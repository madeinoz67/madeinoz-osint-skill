/**
 * Tests for the pinned agent-definition generator (generate-agents.ts).
 *
 * ISC-4  generation — running the generator emits all six definitions; each
 *        file's frontmatter parses; name/description/tools present.
 * ISC-5  projection parity — the persona block in each generated body is a
 *        byte-faithful projection of the AgentProfiles.yaml entry.
 * ISC-11 allowlist (static, on the COMMITTED agents/ files so it gates
 *        drift) — tools ⊆ {Read, Grep, Glob, WebSearch, WebFetch, Bash};
 *        Bash appears ONLY in osint-verifier.
 * ISC-13 persistence exclusion (committed files) — no generated file grants
 *        Write/Edit/NotebookEdit/Task/Agent or any mcp__/muninn_ tool.
 *
 * Generation and parity tests regenerate into a temp directory and compare;
 * the security tests read the committed agents/ directory directly.
 */

import { describe, it, expect } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "yaml";
import { AGENTS_DIR, PERSONA_ORDER, PROFILES_PATH, generateAgents } from "../generate-agents";

const ALLOWED_TOOLS = ["Read", "Grep", "Glob", "WebSearch", "WebFetch", "Bash"] as const;
const FORBIDDEN_TOOLS = ["Write", "Edit", "NotebookEdit", "Task", "Agent"] as const;
const BASE_TOOLS = ["Read", "Grep", "Glob", "WebSearch", "WebFetch"] as const;

/** Parse a generated definition's YAML frontmatter, asserting the fences. */
function parseFrontmatter(content: string): Record<string, unknown> {
  expect(content.startsWith("---\n")).toBe(true);
  const end = content.indexOf("\n---\n", 4);
  expect(end).toBeGreaterThan(0);
  const frontmatter = parse(content.slice(4, end + 1)) as Record<string, unknown>;
  expect(frontmatter).not.toBeNull();
  expect(typeof frontmatter).toBe("object");
  return frontmatter;
}

function toolsListOf(frontmatter: Record<string, unknown>): string[] {
  expect(typeof frontmatter.tools).toBe("string");
  return (frontmatter.tools as string)
    .split(",")
    .map((tool) => tool.trim())
    .filter(Boolean);
}

async function withTempDir(fn: (dir: string) => Promise<void>): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), "osint-agents-"));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("generate-agents (ISC-4: generation)", () => {
  it("emits all six definitions with valid frontmatter (name, description, tools)", async () => {
    await withTempDir(async (dir) => {
      const { written } = await generateAgents({ outDir: dir });
      expect(written.length).toBe(6);
      for (const persona of PERSONA_ORDER) {
        const content = await readFile(join(dir, `osint-${persona}.md`), "utf8");
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter.name).toBe(`osint-${persona}`);
        expect(typeof frontmatter.description).toBe("string");
        expect((frontmatter.description as string).trim().length).toBeGreaterThan(0);
        expect(toolsListOf(frontmatter).length).toBeGreaterThan(0);
        // No model pinning — native inheritance is deliberate.
        expect(frontmatter.model).toBeUndefined();
      }
    });
  });

  it("regeneration matches the committed agents/ files byte-for-byte (zero-diff gate)", async () => {
    await withTempDir(async (dir) => {
      await generateAgents({ outDir: dir });
      for (const persona of PERSONA_ORDER) {
        const regenerated = await readFile(join(dir, `osint-${persona}.md`), "utf8");
        const committed = await readFile(join(AGENTS_DIR, `osint-${persona}.md`), "utf8");
        expect(regenerated).toBe(committed);
      }
    });
  });

  it("AgentProfiles.yaml named_agents key set is exactly the six personas (no silent extras)", async () => {
    const doc = parse(await readFile(PROFILES_PATH, "utf8")) as { named_agents: Record<string, unknown> };
    expect(Object.keys(doc.named_agents).sort()).toEqual([...PERSONA_ORDER].sort());
  });
});

describe("generate-agents validation (guard against silent rot)", () => {
  it("rejects a YAML grant of Bash to a non-verifier persona (validation is loud)", async () => {
    await withTempDir(async (dir) => {
      const yaml = await readFile(PROFILES_PATH, "utf8");
      // First occurrence of the base tools line is the collector's.
      const poisoned = yaml.replace(
        "tools: [Read, Grep, Glob, WebSearch, WebFetch]",
        "tools: [Read, Grep, Glob, WebSearch, WebFetch, Bash]",
      );
      expect(poisoned).not.toBe(yaml);
      const badPath = join(dir, "bad-profiles.yaml");
      await writeFile(badPath, poisoned, "utf8");
      await expect(generateAgents({ profilesPath: badPath, outDir: join(dir, "out") })).rejects.toThrow(
        "Bash is verifier-only",
      );
    });
  });
});

describe("generate-agents (ISC-5: projection parity)", () => {
  it("persona block is a byte-faithful projection of AgentProfiles.yaml", async () => {
    const doc = parse(await readFile(PROFILES_PATH, "utf8")) as {
      named_agents: Record<string, {
        name: string;
        tagline: string;
        traits: string[];
        voice: string;
        description: string;
        communication_style: { phrases: string[]; tone: string };
        use_when: string[];
      }>;
    };

    await withTempDir(async (dir) => {
      await generateAgents({ outDir: dir });
      for (const persona of PERSONA_ORDER) {
        const profile = doc.named_agents[persona];
        expect(profile).toBeDefined();

        const content = await readFile(join(dir, `osint-${persona}.md`), "utf8");
        const start = content.indexOf("## Persona");
        const end = content.indexOf("## Standing instructions");
        expect(start).toBeGreaterThan(-1);
        expect(end).toBeGreaterThan(start);
        const personaBlock = content.slice(start, end);

        // Every field copied from the YAML entry must match byte-for-byte.
        expect(personaBlock).toContain(profile.name);
        expect(personaBlock).toContain(profile.tagline);
        expect(personaBlock).toContain(profile.voice);
        for (const trait of profile.traits) {
          expect(personaBlock).toContain(trait);
        }
        expect(personaBlock).toContain(profile.description.trimEnd());
        for (const phrase of profile.communication_style.phrases) {
          expect(personaBlock).toContain(phrase);
        }
        expect(personaBlock).toContain(profile.communication_style.tone);
        for (const useWhen of profile.use_when) {
          expect(personaBlock).toContain(useWhen);
        }
      }
    });
  });
});

describe("agents/ allowlist (ISC-11: committed files gate drift)", () => {
  it("every committed definition's tools are within the allowlist", async () => {
    for (const persona of PERSONA_ORDER) {
      const content = await readFile(join(AGENTS_DIR, `osint-${persona}.md`), "utf8");
      const tools = toolsListOf(parseFrontmatter(content));
      for (const tool of tools) {
        expect((ALLOWED_TOOLS as readonly string[])).toContain(tool);
      }
    }
  });

  it("all six carry exactly the base five tools; Bash appears only in osint-verifier", async () => {
    for (const persona of PERSONA_ORDER) {
      const content = await readFile(join(AGENTS_DIR, `osint-${persona}.md`), "utf8");
      const tools = toolsListOf(parseFrontmatter(content));
      const expected = persona === "verifier" ? [...BASE_TOOLS, "Bash"] : [...BASE_TOOLS];
      expect(tools.sort()).toEqual([...expected].sort());
      if (persona === "verifier") {
        expect(tools).toContain("Bash");
      } else {
        expect(tools).not.toContain("Bash");
      }
    }
  });
});

describe("agents/ persistence exclusion (ISC-13: committed files gate drift)", () => {
  it("no definition grants Write/Edit/NotebookEdit/Task/Agent or any mcp__/muninn_ tool", async () => {
    for (const persona of PERSONA_ORDER) {
      const content = await readFile(join(AGENTS_DIR, `osint-${persona}.md`), "utf8");
      const frontmatter = parseFrontmatter(content);

      const tools = toolsListOf(frontmatter);
      for (const tool of tools) {
        expect((FORBIDDEN_TOOLS as readonly string[])).not.toContain(tool);
        expect(tool.startsWith("mcp__")).toBe(false);
        expect(tool.startsWith("muninn_")).toBe(false);
      }

      // Belt and braces: the frontmatter block itself must not name any
      // persistence or MCP grant, whatever shape it takes.
      const end = content.indexOf("\n---\n", 4);
      const frontmatterText = content.slice(0, end + 5);
      expect(frontmatterText.includes("mcp__")).toBe(false);
      expect(frontmatterText.includes("muninn_")).toBe(false);
      for (const forbidden of FORBIDDEN_TOOLS) {
        expect(frontmatterText.includes(`tools: ${forbidden}`)).toBe(false);
      }
    }
  });
});
