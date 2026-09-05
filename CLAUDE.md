# MadeInOz OSINT Skill - Claude Code Project Guidance

## Project Overview

A generic, self-contained Claude skill for Open Source Intelligence: person investigation, domain reconnaissance, company research, digital-artifact analysis (email/phone/image), and iterative pivot-driven investigations. Findings persist through a pluggable memory adapter — MuninnDB MCP preferred, local markdown log fallback. No required external dependencies.

## Project Structure

```
madeinoz-osint-skill/
├── osint/                    # THE SKILL — installable directory
│   ├── SKILL.md              # Claude-native skill definition (name + description frontmatter)
│   ├── AgentProfiles.yaml    # Persona definitions for subagent briefs
│   ├── Workflows/            # 17 investigation workflows
│   └── References/           # Self-contained reference docs (agent roles, voices, groups)
├── src/tools/                # Optional bun-powered image-forensic utilities (TS)
├── docs/                     # Documentation site (mkdocs)
├── config/                   # Configuration files (voices)
├── icons/                    # Skill pack icons
├── package.json              # Root manifest — governs the toolchain for the whole repo
├── README.md / INSTALL.md / VERIFY.md
└── CLAUDE.md                 # This file
```

## Architecture invariants

- `osint/` is the entire installable skill — it must stay self-contained (no references out to repo-root files at runtime)
- The memory adapter (SKILL.md § Memory Adapter) is the ONLY sanctioned findings-persistence path: `muninn_*` MCP tools when bound, else `./osint-findings/<group>.md`
- Subagent dispatch is native (Agent tool + AgentProfiles personas); no external agents-skill dependency
- CI gates: SKILL.md < 500 lines with `name: osint` frontmatter, AgentProfiles.yaml parses, all 17 workflows exist, legacy-residue grep = 0, lint/typecheck/test green, Trivy (pinned release tag) + TruffleHog clean

## Key Optional Backends

- **MuninnDB MCP**: preferred memory persistence (findings as tagged, linked, recallable memories)
- **Bright Data MCP**: enhanced scraping for bot-walled sources
- **Browser automation**: JS-heavy sites (any skill/MCP the session provides)

## When Working on This Project

### Adding New Workflows
1. Create new workflow in `osint/Workflows/`
2. Follow existing workflow naming: `DescriptiveName.md`
3. Add a routing row in `osint/SKILL.md` § Intent Routing and a persona mapping if new traits apply
4. Update README.md's "What's Included" table

### Modifying Skill Behavior
- Edit `osint/SKILL.md` for routing and the memory/dispatch contracts
- Edit `osint/AgentProfiles.yaml` for personas
- Test changes with a fresh session and the VERIFY.md checklist

### Documentation Updates
- User-facing changes: Update `docs/user-guide/USER_GUIDE.md`
- API changes: Update relevant `docs/*.md` files
- Version history: conventional commits feed the generated `CHANGELOG.md` (git-cliff)

## Testing

After making changes:
1. `bun run lint && bun run typecheck && bun run test` — all green
2. Run the VERIFY.md checklist (structure + legacy-residue grep)
3. Verify memory-adapter storage if workflows changed

## CI/CD

The `.github/workflows/ci.yml` pipeline: Lint (eslint), OSINT Skill Validation (frontmatter/line-count/workflows/AgentProfiles), Security Scan (Trivy pinned tag + TruffleHog), TypeScript Tests, Build (tools + mkdocs). Release runs on `v*` tags.

## Release Process

1. Update version in package.json and README.md frontmatter
2. Commit with conventional commit: `chore: release v2.x.x`
3. Create git tag: `git tag v2.x.x`
4. GitHub Actions generates the changelog, builds the release, and deploys docs

## Notes

- This repo's 1.x line shipped as a skill pack for a specific personal AI infrastructure; v2.0.0 is the generic Claude-skill conversion. Historical references to that stack remain only in CHANGELOG.md history, docs/investigation/ reports, and the legacy-bannered GRAPHITI_IMPLEMENTATION.md
- All OSINT findings persist through the memory adapter
- InvestigationOrchestrator supports iterative pivot-driven investigations with deferred leads stored per investigation group
