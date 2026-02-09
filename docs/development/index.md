# Development

Technical documentation for developers extending or maintaining the PAI OSINT Skill.

## Development Topics

- **[Image Analysis Tools](../IMAGE_ANALYSIS_TOOLS.md)** - Tool requirements and setup
- **[OSINT Image Analysis Research](../OSINT_IMAGE_ANALYSIS_RESEARCH.md)** - Research on image analysis capabilities
- **[Enrichment Roadmap](../ENRICHMENT_ROADMAP.md)** - API integration guide for data enrichment

## Project Structure

```
madeinoz-osint-skill/
├── src/
│   └── skills/
│       └── osint/
│           ├── SKILL.md           # Intent routing and triggers
│           ├── AgentProfiles.yaml # Agent personality configurations
│           └── Workflows/         # Investigation workflow definitions
├── docs/                          # User and developer documentation
├── config/                        # Configuration files
└── package.json                   # Node.js dependencies
```

## Contributing

When adding new workflows:
1. Create workflow file in `src/skills/osint/Workflows/`
2. Add trigger pattern to `SKILL.md`
3. Update documentation in `docs/`
4. Test with various inputs
5. Verify knowledge graph storage

## Workflow Template

```markdown
# WorkflowName

## Purpose
Brief description of what this workflow does.

## Triggers
- "trigger phrase 1"
- "trigger phrase 2"

## Prerequisites
- Required skills
- Required tools
- Required permissions

## Steps
1. First step
2. Second step
3. etc.

## Output
What the workflow produces.

## Storage
How data is stored to knowledge graph.
```
