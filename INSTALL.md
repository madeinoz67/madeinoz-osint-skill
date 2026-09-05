# OSINT Skill v2.0.0 — Installation Guide

A self-contained Claude skill. No required dependencies — install the directory, and it works with whatever your session already has.

## Requirements

- A Claude install with skills support (e.g. Claude Code with `~/.claude/skills/`)
- Nothing else. Everything below is optional enhancement.

## Install

**Option A — symlink (recommended, stays current with git):**

```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
ln -s "$(pwd)/madeinoz-osint-skill/osint" ~/.claude/skills/osint
```

**Option B — copy (frozen snapshot):**

```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
cp -r madeinoz-osint-skill/osint ~/.claude/skills/osint
```

Restart your Claude session (or start a new one) and confirm the skill loads — say "find all accounts for username johndoe" and watch for OSINT workflow dispatch, or check that `osint` appears in your skills list.

The entire skill is the `osint/` directory: `SKILL.md`, 17 workflows, `AgentProfiles.yaml`, and `References/`.

## Optional backends

Each backend plugs in automatically when present; every workflow degrades gracefully without it.

| Backend | What it adds | How to enable |
|---|---|---|
| **MuninnDB MCP** | Preferred memory path — findings persist as tagged, linked, recallable memories; investigations resume across sessions | Install [MuninnDB](https://github.com/scrypster/muninndb) and bind its MCP server (`muninn_*` tools) to your session |
| **Bright Data MCP** | Bot-walled sources, scraping-heavy collection | Add the Bright Data MCP server to your Claude config |
| **Browser automation** | JavaScript-heavy sites, authenticated capture, screenshots | Any browser-automation skill or MCP your session provides |

Without MuninnDB, findings append to `./osint-findings/<group>.md` in your working directory — commit that directory to persist across machines.

## Optional image-forensics tools

The repo's `src/tools/` carries bun-powered utilities (OCR, perceptual hashing, EXIF/metadata, manipulation forensics):

```bash
cd madeinoz-osint-skill
bun install
bun run test        # expect 15/15 passing
bun run typecheck   # expect clean
```

## Optional API keys

All workflows run on public sources without keys. Keys improve data quality and rate limits — add to `.env` or your shell profile:

```bash
# Shodan (infrastructure scanning) — https://developer.shodan.io/api/requirements
SHODAN_API_KEY=""

# SecurityTrails (domain intelligence) — https://securitytrails.com/corp/api
SECURITYTRAILS_API_KEY=""

# Hunter.io (email finding) — https://hunter.io/api-keys
HUNTER_API_KEY=""
```

## Upgrading from v1.x (skill-pack installs)

v2.0.0 replaces the v1.x pack layout:

1. Remove the old install: `rm -rf ~/.claude/skills/osint` (or wherever the v1.x pack placed it)
2. Install fresh per Option A above
3. Investigation group names carry over (`osint-<type>`, `osint-investigation-<SLUG>-<YEAR>`) — previously stored findings are untouched; new findings follow the memory adapter
4. The old external agents/knowledge/browser pack dependencies are no longer used — native agent dispatch and the memory adapter replace them

## Troubleshooting

| Symptom | Fix |
|---|---|
| Skill doesn't trigger | Check `ls -la ~/.claude/skills/osint/SKILL.md` resolves; restart the session |
| Findings only go to local files | MuninnDB MCP isn't bound to the session — the adapter picks Path 1 only when `muninn_*` tools are present |
| Image tools fail | Run `bun install` at the repo root; tools share the root manifest |
| Lint/typecheck fail locally | `bun install` then `bun run lint && bun run typecheck && bun run test` |

Post-install validation: run the `VERIFY.md` checklist.
