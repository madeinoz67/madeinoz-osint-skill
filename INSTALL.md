# OSINT Skill v2.1.0 — Installation Guide

A self-contained Claude skill. No required dependencies — install the directory, and it works with whatever your session already has.

## Requirements

- A Claude install with skills support (e.g. Claude Code with `~/.claude/skills/`)
- Nothing else. Everything below is optional enhancement.

## Install

**Option A — Claude Code plugin (recommended):**

```
/plugin marketplace add madeinoz67/madeinoz-osint-skill
/plugin install madeinoz-osint@madeinoz-osint-marketplace
```

Two commands, no clone, updates via `/plugin` (auto-update is off by default for third-party marketplaces — enable it or re-run `claude plugin update` after version bumps). The skill runs namespaced as `/madeinoz-osint:osint` plus natural-language routing. Notes: git sources clone over SSH by default; set `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` if you don't use SSH keys. Run `/reload-plugins` if installing into a live session.

**Option B — skills-dir symlink (any skills-capable host):**

```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
ln -s "$(pwd)/madeinoz-osint-skill/skills/osint" ~/.claude/skills/osint
```

**Option C — copy (frozen snapshot):**

```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
cp -r madeinoz-osint-skill/skills/osint ~/.claude/skills/osint
```

Restart your Claude session (or start a new one) and confirm the skill loads — say "find all accounts for username johndoe" and watch for OSINT workflow dispatch, or check that `osint` appears in your skills list.

The entire skill is the `skills/osint/` directory: `SKILL.md`, 17 workflows, `AgentProfiles.yaml`, and `References/`. The plugin packaging (`.claude-plugin/plugin.json` + `marketplace.json`) wraps that same directory — nothing else ships.

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
