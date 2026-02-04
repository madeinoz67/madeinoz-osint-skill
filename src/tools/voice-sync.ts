#!/usr/bin/env bun
/**
 * voice-sync.ts - OSINT Pack Voice Configuration Sync Tool
 *
 * Syncs OSINT agent voices from config/voices.json to the VoiceServer's
 * voice-personalities.md (in skills/CORE/). Only adds new voices, preserves existing.
 * Automatically restarts VoiceServer after changes.
 *
 * Usage:
 *   bun run voice-sync.ts [--dry-run] [--force] [--verbose] [--no-restart]
 *
 * Options:
 *   --dry-run     Show what would be changed without making changes
 *   --force       Overwrite existing voices (not just add new)
 *   --verbose     Show detailed diff output
 *   --no-restart  Don't restart VoiceServer after sync
 *   --help        Show this help message
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { $ } from "bun";

// Types
interface VoiceEntry {
  voice_id: string;
  voice_name: string;
  stability: number;
  similarity_boost: number;
  description: string;
  type?: string;
}

interface VoicePersonalities {
  default_volume?: number;
  voices: Record<string, VoiceEntry>;
}

interface PackVoiceConfig {
  _meta: {
    version: string;
    description: string;
    sync_target: string;
  };
  voices: Record<string, VoiceEntry>;
  _voices_info?: any;
}

interface SyncResult {
  voice: string;
  action: "added" | "updated" | "skipped" | "unchanged";
  reason: string;
}

// ANSI colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  console.log(`${colors.green}${msg}${colors.reset}`);
}

function warn(msg: string) {
  console.log(`${colors.yellow}${msg}${colors.reset}`);
}

function error(msg: string) {
  console.error(`${colors.red}${msg}${colors.reset}`);
}

function info(msg: string) {
  console.log(`${colors.cyan}${msg}${colors.reset}`);
}

// Resolve PAI_DIR
function getPaiDir(): string {
  return process.env.PAI_DIR || `${process.env.HOME}/.claude`;
}

// Restart VoiceServer
async function restartVoiceServer(paiDir: string): Promise<boolean> {
  const serverPath = resolve(paiDir, "VoiceServer/server.ts");

  if (!existsSync(serverPath)) {
    warn("  VoiceServer not found - skipping restart");
    return false;
  }

  try {
    // Find and kill existing VoiceServer process
    const result = await $`pgrep -f "VoiceServer/server.ts"`.quiet();
    const pids = result.text().trim().split("\n").filter(Boolean);

    if (pids.length > 0) {
      info(`→ Stopping VoiceServer (PID: ${pids.join(", ")})...`);
      for (const pid of pids) {
        await $`kill ${pid}`.quiet();
      }
      // Wait for process to stop
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Start VoiceServer in background
    info("→ Starting VoiceServer...");
    const proc = Bun.spawn(["bun", "run", serverPath], {
      cwd: dirname(serverPath),
      stdout: "ignore",
      stderr: "ignore",
      stdin: "ignore",
    });

    // Detach so it continues running after this script exits
    proc.unref();

    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    success("✓ VoiceServer restarted");
    return true;
  } catch (err) {
    // pgrep returns exit code 1 if no processes found - that's fine
    if (err instanceof Error && err.message.includes("exit code")) {
      info("→ Starting VoiceServer (not currently running)...");
      const proc = Bun.spawn(["bun", "run", serverPath], {
        cwd: dirname(serverPath),
        stdout: "ignore",
        stderr: "ignore",
        stdin: "ignore",
      });
      proc.unref();
      await new Promise(resolve => setTimeout(resolve, 1000));
      success("✓ VoiceServer started");
      return true;
    }
    warn(`  Could not restart VoiceServer: ${err}`);
    return false;
  }
}

// Get script directory (where this script lives)
function getScriptDir(): string {
  return dirname(Bun.main);
}

// Get pack root (two levels up from src/tools)
function getPackRoot(): string {
  return resolve(getScriptDir(), "../..");
}

// Load pack voice configuration
function loadPackConfig(): PackVoiceConfig {
  const configPath = resolve(getPackRoot(), "config/voices.json");

  if (!existsSync(configPath)) {
    throw new Error(`Pack voice config not found: ${configPath}`);
  }

  const content = readFileSync(configPath, "utf-8");
  return JSON.parse(content) as PackVoiceConfig;
}

// Load voice-personalities.md and extract JSON
function loadVoicePersonalities(paiDir: string): { data: VoicePersonalities; path: string; rawContent: string } {
  const voicePath = resolve(paiDir, "skills/CORE/voice-personalities.md");

  if (!existsSync(voicePath)) {
    throw new Error(`voice-personalities.md not found: ${voicePath}\nEnsure CORE skill is installed.`);
  }

  const rawContent = readFileSync(voicePath, "utf-8");

  // Extract JSON from markdown code block
  const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) {
    throw new Error("Could not find JSON block in voice-personalities.md");
  }

  const data = JSON.parse(jsonMatch[1]) as VoicePersonalities;
  return { data, path: voicePath, rawContent };
}

// Update the markdown file with new JSON
function updateVoicePersonalities(path: string, rawContent: string, newData: VoicePersonalities): void {
  const newJson = JSON.stringify(newData, null, 2);
  const updatedContent = rawContent.replace(
    /```json\s*[\s\S]*?\s*```/,
    "```json\n" + newJson + "\n```"
  );
  writeFileSync(path, updatedContent);
}

// Perform the diff and sync
function syncVoices(
  packConfig: PackVoiceConfig,
  serverConfig: VoicePersonalities,
  options: { dryRun: boolean; force: boolean; verbose: boolean }
): { results: SyncResult[]; serverConfig: VoicePersonalities } {
  const results: SyncResult[] = [];

  // Process each voice in the pack config
  for (const [voiceName, voiceEntry] of Object.entries(packConfig.voices)) {
    const existingEntry = serverConfig.voices[voiceName];

    // Add type field for OSINT agents
    const entryWithType = { ...voiceEntry, type: "osint" };

    if (!existingEntry) {
      // Voice doesn't exist - add it
      serverConfig.voices[voiceName] = entryWithType;
      results.push({
        voice: voiceName,
        action: "added",
        reason: `Added ${voiceEntry.voice_name} (${voiceEntry.description})`,
      });
    } else if (options.force) {
      // Force update existing
      serverConfig.voices[voiceName] = entryWithType;
      results.push({
        voice: voiceName,
        action: "updated",
        reason: `Updated to ${voiceEntry.voice_name} (was ${existingEntry.voice_name})`,
      });
    } else if (existingEntry.voice_id === voiceEntry.voice_id) {
      // Already matches
      results.push({
        voice: voiceName,
        action: "unchanged",
        reason: `Already configured as ${existingEntry.voice_name}`,
      });
    } else {
      // Exists but different - skip unless force
      results.push({
        voice: voiceName,
        action: "skipped",
        reason: `Keeping existing ${existingEntry.voice_name} (use --force to override)`,
      });
    }
  }

  return { results, serverConfig };
}

// Print results
function printResults(results: SyncResult[], verbose: boolean) {
  const added = results.filter((r) => r.action === "added");
  const updated = results.filter((r) => r.action === "updated");
  const skipped = results.filter((r) => r.action === "skipped");
  const unchanged = results.filter((r) => r.action === "unchanged");

  log("");
  log(`${colors.bold}Voice Sync Results${colors.reset}`);
  log("─".repeat(50));

  if (added.length > 0) {
    success(`\n✓ Added (${added.length}):`);
    for (const r of added) {
      log(`  ${colors.green}${r.voice}${colors.reset}: ${r.reason}`);
    }
  }

  if (updated.length > 0) {
    info(`\n↻ Updated (${updated.length}):`);
    for (const r of updated) {
      log(`  ${colors.cyan}${r.voice}${colors.reset}: ${r.reason}`);
    }
  }

  if (skipped.length > 0) {
    warn(`\n⊘ Skipped (${skipped.length}):`);
    for (const r of skipped) {
      log(`  ${colors.yellow}${r.voice}${colors.reset}: ${r.reason}`);
    }
  }

  if (unchanged.length > 0 && verbose) {
    log(`\n${colors.dim}≡ Unchanged (${unchanged.length}):${colors.reset}`);
    for (const r of unchanged) {
      log(`  ${colors.dim}${r.voice}: ${r.reason}${colors.reset}`);
    }
  }

  log("");
  log("─".repeat(50));
  log(
    `Summary: ${colors.green}${added.length} added${colors.reset}, ` +
      `${colors.cyan}${updated.length} updated${colors.reset}, ` +
      `${colors.dim}${unchanged.length} unchanged${colors.reset}, ` +
      `${colors.yellow}${skipped.length} skipped${colors.reset}`
  );
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log(`
${colors.bold}OSINT Pack Voice Sync Tool${colors.reset}

Syncs OSINT agent voices to skills/CORE/voice-personalities.md.

${colors.bold}Usage:${colors.reset}
  bun run voice-sync.ts [options]

${colors.bold}Options:${colors.reset}
  --dry-run     Show what would be changed without making changes
  --force       Overwrite existing voices (not just add new)
  --verbose     Show detailed output including unchanged voices
  --no-restart  Don't restart VoiceServer after sync
  --help        Show this help message

${colors.bold}OSINT Agents:${colors.reset}
  collector   Rachel (F) - Meticulous intelligence gatherer
  linker      Daniel (M) - Pattern recognition specialist
  auditor     Sarah (F)  - Due diligence expert
  shadow      Clyde (M)  - Adversarial intelligence operator
  verifier    Adam (M)   - Source verification specialist

${colors.bold}Examples:${colors.reset}
  bun run voice-sync.ts --dry-run --verbose
  bun run voice-sync.ts
  bun run voice-sync.ts --force
`);
    process.exit(0);
  }

  const options = {
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force"),
    verbose: args.includes("--verbose"),
    noRestart: args.includes("--no-restart"),
  };

  log(`${colors.bold}OSINT Voice Sync${colors.reset}`);
  log("═".repeat(50));

  if (options.dryRun) {
    warn("⚠ DRY RUN - No changes will be made\n");
  }

  try {
    // Load configs
    info("→ Loading pack voice configuration...");
    const packConfig = loadPackConfig();
    log(`  Found ${Object.keys(packConfig.voices).length} OSINT voices`);

    const paiDir = getPaiDir();
    info(`→ Loading voice-personalities.md from ${paiDir}...`);
    const { data: serverConfig, path: serverPath, rawContent } = loadVoicePersonalities(paiDir);
    log(`  Found ${Object.keys(serverConfig.voices).length} existing voices`);

    // Perform sync
    info("→ Calculating diff...\n");
    const { results, serverConfig: updatedConfig } = syncVoices(
      packConfig,
      serverConfig,
      options
    );

    // Print results
    printResults(results, options.verbose);

    // Write changes if not dry run
    const hasChanges = results.some(
      (r) => r.action === "added" || r.action === "updated"
    );

    if (hasChanges && !options.dryRun) {
      log("");
      info(`→ Writing changes to ${serverPath}...`);
      updateVoicePersonalities(serverPath, rawContent, updatedConfig);
      success("✓ Voice configuration synced successfully!");

      // Restart VoiceServer to load new config
      if (!options.noRestart) {
        log("");
        await restartVoiceServer(paiDir);
      } else {
        log("");
        warn("⚠ VoiceServer restart skipped (--no-restart)");
        warn("  Run manually: kill VoiceServer and restart");
      }
    } else if (options.dryRun && hasChanges) {
      log("");
      warn("→ Run without --dry-run to apply changes");
    } else if (!hasChanges) {
      log("");
      success("✓ All OSINT voices already configured!");
    }
  } catch (err) {
    error(`\n✗ Error: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
}

main();
