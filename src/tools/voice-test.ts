#!/usr/bin/env bun
/**
 * voice-test.ts - OSINT Pack Voice Test Tool
 *
 * Tests each OSINT agent voice by sending test phrases to VoiceServer.
 *
 * Usage:
 *   bun run voice-test.ts [--quiet] [--agent <name>]
 *
 * Options:
 *   --quiet        Only show pass/fail summary
 *   --agent <name> Test only specific agent (collector, linker, auditor, shadow, verifier)
 *   --help         Show this help message
 */

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

// OSINT agent test phrases - characteristic of each persona
const OSINT_AGENTS = {
  collector: {
    voice_name: "Rachel",
    gender: "F",
    phrase: "I've cross-referenced this against three independent sources. The confidence level is high.",
    description: "Meticulous intelligence gatherer",
  },
  linker: {
    voice_name: "Daniel",
    gender: "M",
    phrase: "I've identified a correlation between these data points. The timing overlap indicates a connection.",
    description: "Pattern recognition specialist",
  },
  auditor: {
    voice_name: "Sarah",
    gender: "F",
    phrase: "Red flag identified. Discrepancy noted between stated and actual ownership. Recommend further investigation.",
    description: "Due diligence expert",
  },
  shadow: {
    voice_name: "Clyde",
    gender: "M",
    phrase: "Attack surface analysis reveals critical exposure. An adversary could leverage this immediately.",
    description: "Adversarial intelligence operator",
  },
  verifier: {
    voice_name: "Adam",
    gender: "M",
    phrase: "Primary source confirmed via independent verification. Provenance chain is intact.",
    description: "Source verification specialist",
  },
};

const VOICE_SERVER_PORT = process.env.VOICE_SERVER_PORT || "8888";
const VOICE_SERVER_URL = `http://localhost:${VOICE_SERVER_PORT}`;

interface TestResult {
  agent: string;
  voice: string;
  success: boolean;
  duration?: number;
  error?: string;
}

async function testVoice(agent: string, config: typeof OSINT_AGENTS.collector): Promise<TestResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${VOICE_SERVER_URL}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `OSINT ${agent}`,
        message: config.phrase,
        voice_name: agent,
      }),
    });

    const duration = Date.now() - startTime;

    if (response.ok) {
      return {
        agent,
        voice: config.voice_name,
        success: true,
        duration,
      };
    } else {
      const errorText = await response.text();
      return {
        agent,
        voice: config.voice_name,
        success: false,
        duration,
        error: `HTTP ${response.status}: ${errorText.slice(0, 100)}`,
      };
    }
  } catch (err) {
    return {
      agent,
      voice: config.voice_name,
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkVoiceServer(): Promise<boolean> {
  try {
    const response = await fetch(`${VOICE_SERVER_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

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

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log(`
${colors.bold}OSINT Voice Test Tool${colors.reset}

Tests each OSINT agent voice by sending test phrases to VoiceServer.

${colors.bold}Usage:${colors.reset}
  bun run voice-test.ts [options]

${colors.bold}Options:${colors.reset}
  --quiet        Only show pass/fail summary
  --agent <name> Test only specific agent
  --help         Show this help message

${colors.bold}Agents:${colors.reset}
  collector   Rachel (F) - Meticulous intelligence gatherer
  linker      Daniel (M) - Pattern recognition specialist
  auditor     Sarah (F)  - Due diligence expert
  shadow      Clyde (M)  - Adversarial intelligence operator
  verifier    Adam (M)   - Source verification specialist
`);
    process.exit(0);
  }

  const quiet = args.includes("--quiet");
  const agentIdx = args.indexOf("--agent");
  const specificAgent = agentIdx !== -1 ? args[agentIdx + 1] : null;

  log(`${colors.bold}OSINT Voice Test${colors.reset}`);
  log("═".repeat(50));

  // Check VoiceServer is running
  info("→ Checking VoiceServer...");
  const serverUp = await checkVoiceServer();

  if (!serverUp) {
    error(`✗ VoiceServer not responding at ${VOICE_SERVER_URL}`);
    error("  Make sure VoiceServer is running:");
    error("  bun run $PAI_DIR/VoiceServer/server.ts");
    process.exit(1);
  }
  success("✓ VoiceServer is running\n");

  // Determine which agents to test
  const agentsToTest = specificAgent
    ? { [specificAgent]: OSINT_AGENTS[specificAgent as keyof typeof OSINT_AGENTS] }
    : OSINT_AGENTS;

  if (specificAgent && !OSINT_AGENTS[specificAgent as keyof typeof OSINT_AGENTS]) {
    error(`✗ Unknown agent: ${specificAgent}`);
    error(`  Available: ${Object.keys(OSINT_AGENTS).join(", ")}`);
    process.exit(1);
  }

  const results: TestResult[] = [];

  // Test each agent
  for (const [agent, config] of Object.entries(agentsToTest)) {
    if (!quiet) {
      info(`→ Testing ${agent} (${config.voice_name}, ${config.gender})...`);
      log(`  ${colors.dim}"${config.phrase.slice(0, 60)}..."${colors.reset}`);
    }

    const result = await testVoice(agent, config);
    results.push(result);

    if (result.success) {
      if (!quiet) {
        success(`  ✓ PASS (${result.duration}ms)`);
      }
    } else {
      error(`  ✗ FAIL: ${result.error}`);
    }

    // Brief pause between tests
    if (!quiet) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Summary
  log("");
  log("─".repeat(50));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  log(`${colors.bold}Results${colors.reset}`);
  log("");

  for (const r of results) {
    const status = r.success
      ? `${colors.green}✓ PASS${colors.reset}`
      : `${colors.red}✗ FAIL${colors.reset}`;
    const timing = r.duration ? ` (${r.duration}ms)` : "";
    log(`  ${r.agent.padEnd(12)} ${r.voice.padEnd(8)} ${status}${timing}`);
  }

  log("");
  log("─".repeat(50));

  if (failed === 0) {
    success(`✓ All ${passed} OSINT voices working!`);
  } else {
    error(`✗ ${failed}/${passed + failed} voices failed`);
    process.exit(1);
  }
}

main();
