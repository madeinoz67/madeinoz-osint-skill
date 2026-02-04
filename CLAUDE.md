# MadeInOz OSINT Skill - Claude Code Project Guidance

## Project Overview

This is a PAI (Personal AI Infrastructure) OSINT (Open Source Intelligence) skill pack for Claude Code. It provides comprehensive workflows for intelligence gathering, person investigation, domain reconnaissance, company research, and knowledge persistence through graph-based storage.

## Project Structure

```
madeinoz-osint-skill/
├── src/
│   ├── skills/osint/          # Main OSINT skill definition
│   │   ├── SKILL.md           # Skill metadata and routing
│   │   ├── AgentProfiles.yaml # Agent personalities
│   │   └── Workflows/         # Investigation workflows
│   └── tools/                 # Custom tools (if any)
├── docs/                      # Documentation
├── icons/                     # Skill pack icons
├── config/                    # Configuration files
├── package.json               # Node.js dependencies
├── README.md                  # Project overview
├── INSTALL.md                 # Installation guide
├── VERIFY.md                  # Verification checklist
└── CLAUDE.md                  # This file
```

## Key Dependencies

- **pai-knowledge-system**: Required for knowledge graph persistence (Neo4j/FalkorDB)
- **pai-agents-skill**: Required for agent orchestration and InvestigationOrchestrator
- **pai-browser-skill**: Recommended for web scraping and verification
- **Bright Data MCP**: Recommended for advanced web scraping

## When Working on This Project

### Adding New Workflows
1. Create new workflow in `src/skills/osint/Workflows/`
2. Follow existing workflow naming: `DescriptiveName.md`
3. Add to SKILL.md's trigger patterns
4. Update README.md's "What's Included" table

### Modifying Skill Behavior
- Edit `src/skills/osint/SKILL.md` for intent routing and triggers
- Edit `src/skills/osint/AgentProfiles.yaml` for agent personalities
- Test changes with `/osint` command

### Documentation Updates
- User-facing changes: Update `docs/USER_GUIDE.md`
- API changes: Update relevant `docs/*.md` files
- New features: Add to `docs/CHANGELOG.md`

## Testing OSINT Workflows

After making changes:
1. Test with `/osint` command
2. Run `VERIFY.md` checklist
3. Verify knowledge graph storage if applicable

## CI/CD

The `.github/workflows/ci.yml` pipeline includes:
- YAML linting (for AgentProfiles.yaml)
- Security scanning (Trivy, TruffleHog)
- Documentation deployment

## Release Process

1. Update version in `package.json` and README.md frontmatter
2. Update `docs/CHANGELOG.md`
3. Commit with conventional commit: `chore: release v1.x.x`
4. Create git tag: `git tag v1.x.x`
5. GitHub Actions will handle the rest

## Notes

- This is a PAI Pack - modular upgrade for AI agent systems
- All OSINT findings should be stored to knowledge graph for persistence
- The InvestigationOrchestrator workflow supports iterative pivot-driven investigations
- See PAI project documentation for pack system details
