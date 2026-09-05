# OSINT Skill

> AI-powered Open Source Intelligence collection and analysis with persistent findings memory and **iterative pivot-driven investigations**

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
- **Persistent Findings** - All findings stored via the memory adapter (MuninnDB if available, local findings log otherwise) for cross-investigation linking
- **Multi-Agent Orchestration** - Parallel research agents for faster collection
- **Ethical by Design** - Legal considerations built into every workflow
- **Degrades Gracefully** - No required dependencies; every optional backend has a fallback

## Installation

Clone the repository and symlink the `osint/` directory into your Claude skills directory:

```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
ln -s "$(pwd)/madeinoz-osint-skill/osint" ~/.claude/skills/osint
```

See the repository root [INSTALL.md](https://github.com/madeinoz67/madeinoz-osint-skill/blob/main/INSTALL.md) for step-by-step setup.

## Documentation

- [User Guide](user-guide/) - Complete usage documentation
- [Investigation Types](investigation/) - People, company, and entity research
- [Framework](framework/) - Methodology and ethical guidelines
- [Advanced](advanced/) - Agent roles, voice mappings, memory groups
- [Knowledge Model](knowledge/) - OSINT ontology and memory conventions
- [Development](development/) - Technical documentation

## Legal & Ethical Notice

**IMPORTANT:** This system is designed for authorized investigations only.

- Only collect publicly available information
- Respect privacy laws and platform ToS
- Maintain operational security (OPSEC)
- Document collection methods for audit trails
- Never use for harassment or unauthorized surveillance

See [Ethical Framework](framework/ETHICAL_FRAMEWORK.md) for complete guidelines.

## Version

See [CHANGELOG.md](https://github.com/madeinoz67/madeinoz-osint-skill/blob/main/CHANGELOG.md) for version history.

## Links

- [GitHub Repository](https://github.com/madeinoz67/madeinoz-osint-skill)
