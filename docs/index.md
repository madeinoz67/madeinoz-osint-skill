# PAI OSINT Skill

> AI-powered Open Source Intelligence collection and analysis with knowledge graph integration and **iterative pivot-driven investigations**

## Quick Start

```bash
# Username enumeration
/osint username johndoe

# Domain investigation
/osint domain example.com

# Company research
/osint company "Acme Corporation"

# Full investigation with automatic pivot expansion
/osint investigate johndoe --follow-leads
```

**Tip:** Use natural language instead of `/osint`:
- "Find all accounts for username johndoe"
- "Research company Acme Corp"
- "Investigate domain example.com"

## What's Included

| Category | Workflows |
|----------|-----------|
| **Person Investigation** | UsernameRecon, SocialCapture, TargetProfile, TimelineAnalysis |
| **Domain Intelligence** | DomainRecon, InfraMapping |
| **Company Research** | CompanyProfile, CorporateStructure, FinancialRecon, CompetitorAnalysis, RiskAssessment |
| **Digital Artifacts** | EmailRecon, PhoneRecon, ImageRecon |
| **Analysis** | EntityLinking, IntelReport, InvestigationOrchestrator |

## Key Features

- **Iterative Pivot-Driven Investigations** - Automatically expand collection as new intelligence is discovered
- **Knowledge Graph Persistence** - All findings stored for cross-investigation linking
- **Multi-Agent Orchestration** - Parallel research agents for faster collection
- **Ethical by Design** - Legal considerations built into every workflow
- **Dual Storage** - Both queryable graph AND human-readable file reports

## Installation

See the repository root [INSTALL.md](../INSTALL.md) for step-by-step setup.

## Documentation

- [User Guide](user-guide/) - Complete usage documentation
- [Investigation Types](investigation/) - People, company, and entity research
- [Framework](framework/) - Methodology and ethical guidelines
- [Advanced](advanced/) - Agent roles, voice mappings, knowledge groups
- [Knowledge Graph](knowledge/) - Ontology and Graphiti integration
- [Development](development/) - Technical documentation

## Legal & Ethical Notice

**IMPORTANT:** This system is designed for authorized investigations only.

- Only collect publicly available information
- Respect privacy laws and platform ToS
- Maintain operational security (OPSEC)
- Document collection methods for audit trails
- Never use for harassment or unauthorized surveillance

See [Ethical Framework](ETHICAL_FRAMEWORK.md) for complete guidelines.

## Version

**v1.3.0** - See [CHANGELOG.md](CHANGELOG.md) for version history.

## Links

- [GitHub Repository](https://github.com/madeinoz67/madeinoz-osint-skill)
- [PAI Project](https://github.com/danielmiessler/PAI)
