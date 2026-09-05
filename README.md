---
name: OSINT Skill
version: 2.0.0
author: madeinoz
description: AI-powered Open Source Intelligence collection and analysis with pluggable memory persistence and iterative pivot-driven investigations
type: skill
purpose-type: [intelligence, reconnaissance, investigation, analysis]
platform: claude-code
keywords: [osint, intelligence, reconnaissance, investigation, social-media, domain-analysis, geolocation, company-research, due-diligence, corporate-intelligence, competitor-analysis, pivot-detection, iterative-investigation]
---

<p align="center">
  <img src="docs/assets/header.png" alt="OSINT Intelligence Gathering" width="100%">
</p>

# OSINT Skill v2.0.0

> AI-powered Open Source Intelligence collection and analysis with **iterative pivot-driven investigations** and pluggable memory persistence (MuninnDB preferred, local files otherwise)

---

## Quick Navigation

**Getting Started:**
- [Installation Guide](INSTALL.md) - Step-by-step installation wizard
- [Verification Checklist](VERIFY.md) - Post-installation validation

**Documentation:**
- [User Guide](docs/user-guide/USER_GUIDE.md) - Complete usage documentation
- [Quick Reference](docs/user-guide/QUICK_REFERENCE.md) - Command cheat sheet
- [Company Research Guide](docs/advanced/COMPANY_RESEARCH.md) - Business intelligence workflows
- [Changelog](CHANGELOG.md) - Version history and release notes

**Advanced:**
- [Image Analysis Tools](docs/development/IMAGE_ANALYSIS_TOOLS.md) - Tool requirements and setup
- [Enrichment Roadmap](docs/development/ENRICHMENT_ROADMAP.md) - API integration guide

**By Workflow Type:**
- **Person Investigation:** Username enumeration, social media, entity linking
- **Domain Intelligence:** DNS, WHOIS, subdomains, infrastructure mapping
- **Company Research:** Corporate profiles, ownership, financials, risk assessment
- **Digital Artifacts:** Email, phone, and image analysis

---

## Quick Start

Get started immediately with these common OSINT commands:

```bash
# Username enumeration
/osint username johndoe

# Domain investigation
/osint domain example.com

# Company research
/osint company "Acme Corporation"

# Email reconnaissance
/osint email john@example.com

# Full investigation with automatic pivot expansion
/osint investigate johndoe --follow-leads
```

**Tip:** Use natural language instead of `/osint`:
- "Find all accounts for username johndoe"
- "Research company Acme Corp"
- "Investigate domain example.com"

---

## What This Is

A self-contained Claude skill that turns your AI assistant into an intelligence-gathering platform. No required external dependencies — drop it into any skills directory and it works, with optional backends making it better.

- **Person Investigation** - Username enumeration, social media capture, entity linking
- **Domain Intelligence** - DNS, WHOIS, certificate transparency, subdomain discovery
- **Company Research** - Corporate profiles, ownership tracing, financial analysis, risk assessment
- **Persistent Memory** - Findings stored via the memory adapter (MuninnDB MCP when installed, a local findings log otherwise)

**Core principle:** Systematic collection, intelligent analysis, persistent storage.

No more scattered notes across sessions. Your investigations build on each other through persisted, recallable findings.

---

## What's Included

| Component | File | Purpose |
|-----------|------|---------|
| OSINT Skill Definition | `osint/SKILL.md` | Intent routing and workflow dispatch |
| **Investigation Orchestrator** | `Workflows/InvestigationOrchestrator.md` | **Iterative pivot-driven investigations with parallel agents** |
| Username Reconnaissance | `Workflows/UsernameRecon.md` | Enumerate usernames across 400+ platforms |
| Domain Reconnaissance | `Workflows/DomainRecon.md` | DNS, WHOIS, CT logs, subdomains |
| Social Media Capture | `Workflows/SocialCapture.md` | Profile capture via memory adapter |
| Infrastructure Mapping | `Workflows/InfraMapping.md` | Port scanning, service fingerprinting |
| Entity Linking | `Workflows/EntityLinking.md` | Cross-source identity resolution |
| Timeline Analysis | `Workflows/TimelineAnalysis.md` | Temporal pattern detection |
| Target Profile | `Workflows/TargetProfile.md` | Comprehensive target investigation |
| Intel Report | `Workflows/IntelReport.md` | Structured intelligence reports |
| Company Profile | `Workflows/CompanyProfile.md` | Comprehensive company investigation |
| Corporate Structure | `Workflows/CorporateStructure.md` | Ownership, subsidiaries, directors |
| Financial Recon | `Workflows/FinancialRecon.md` | SEC filings, funding, investors |
| Competitor Analysis | `Workflows/CompetitorAnalysis.md` | Market position, SWOT analysis |
| Risk Assessment | `Workflows/RiskAssessment.md` | Litigation, sanctions, due diligence |
| Email Reconnaissance | `Workflows/EmailRecon.md` | Email investigation, breach checking |
| Phone Reconnaissance | `Workflows/PhoneRecon.md` | Phone number lookup, validation |
| Image Reconnaissance | `Workflows/ImageRecon.md` | Image metadata, forensics, reverse search |

**Summary:**
- **Skill directory:** `osint/` (1 SKILL.md + 17 workflows + AgentProfiles + References — the entire installable skill)
- **Optional utilities:** `src/tools/` (bun-powered image forensics)
- **Dependencies:** none required — MuninnDB MCP, Bright Data MCP, and browser automation are optional enhancements

---

## The Concept and/or Problem

Open Source Intelligence (OSINT) investigations suffer from fragmentation:

**For Individual Targets:**
- Usernames scattered across 400+ platforms with no systematic enumeration
- Social media profiles captured ad-hoc, never correlated
- Timeline patterns invisible without structured analysis
- Identity links between accounts discovered by accident, not method

**For Company Research:**
- Corporate structures buried in registries across jurisdictions
- Beneficial ownership hidden behind shell companies
- Financial data scattered across SEC filings, funding databases, news
- Risk signals (litigation, sanctions, adverse media) require multiple searches

**For Intelligence Operations:**
- Each investigation starts from scratch with no institutional memory
- Findings stored in notes that can't be queried
- Relationships between entities discovered once, then forgotten
- No systematic methodology leads to inconsistent results

**The Fundamental Problem:**

Traditional OSINT is manual, fragmented, and ephemeral. Investigators repeat work, miss connections, and lose findings between sessions. There's no accumulation of intelligence over time.

---

## The Solution

The OSINT Skill provides **structured, persistent, memory-backed intelligence collection**.

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                           OSINT Skill                                │
│            AI-Powered Open Source Intelligence Collection            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  osint skill    │    │ native agents   │    │ optional web    │
│                 │    │                 │    │ backends        │
│ • Intent Router │    │ • Persona briefs│    │                 │
│ • 17 Workflows  │    │ • Parallel disp│    │ • Bright Data   │
│ • Orchestrator  │    │ • Escalation    │    │ • Browser auto  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────┐
                    │    Memory Adapter       │
                    │                         │
                    │ • MuninnDB MCP          │
                    │   (preferred, tagged,   │
                    │   recallable, linked)   │
                    │                         │
                    │ • Local findings log    │
                    │   (fallback, always on) │
                    └─────────────────────────┘
```

**The Intelligence Cycle:**

Each workflow follows a consistent 5-step pattern:

1. **Planning** - Define scope, legal/ethical boundaries, OPSEC
2. **Collection** - Systematic acquisition from public sources
3. **Processing** - Normalizing, enriching, correlating data
4. **Analysis** - Identifying patterns, relationships, risk
5. **Storage** - Persist via memory adapter AND file reports

**Design Principles:**

1. **Workflow-Driven**: 17 specialized workflows for different intelligence tasks
2. **Memory-First**: Every workflow stores findings via the memory adapter
3. **Dual Storage**: Recallable memory AND human-readable file reports
4. **Ethical by Design**: Legal considerations built into every workflow
5. **Progressive Enhancement**: Works with zero dependencies, better with optional backends

---

## What Makes This Different

The OSINT System has 3 architectural layers:

1. **Intent Routing (SKILL.md)** - The skill description routes natural language to workflows
2. **Workflow Execution (Workflows/)** - Structured steps with memory persistence
3. **Memory Adapter (SKILL.md § Memory Adapter)** - Findings persisted to MuninnDB or local files

```
User: "investigate company Acme Corp"
         │
         ▼
┌─────────────────────────┐
│ SKILL.md Intent Router  │
│ Match: "company" trigger│
│ Route: CompanyProfile   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ CompanyProfile.md       │
│ Step 1: Registry search │
│ Step 2: Ownership trace │
│ Step 3: Financial data  │
│ Step 4: Risk assessment │
│ Step 5: Store to graph  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Memory Adapter          │
│ Group: osint-company    │
│ Entities tagged, linked │
└─────────────────────────┘
```

**Why This Architecture Matters:**

- **Explicit Routing**: Intent → Workflow → Storage, not fuzzy matching
- **Persistent Memory**: Every investigation adds to recallable memory
- **Cross-Investigation Linking**: Entity discovered in one workflow appears in future searches
- **Audit Trail**: Full methodology documented for each collection

---

## Why This Is Different

This sounds similar to using search engines manually which also finds public information. What makes this approach different?

The OSINT System transforms ad-hoc searching into systematic intelligence collection. Each workflow follows a repeatable methodology, persists findings through the memory adapter, and builds institutional memory across investigations. Future queries automatically surface past findings.

- Structured workflows replace random searching with methodology
- The memory adapter stores entities and findings persistently (MuninnDB when installed)
- Cross-investigation linking surfaces connections automatically
- Dual output: recallable memory AND human-readable reports

---

## Installation

See `INSTALL.md` for step-by-step wizard-style installation.

**Quick Install:**
```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
ln -s "$(pwd)/madeinoz-osint-skill/osint" ~/.claude/skills/osint
```

Then verify with the `VERIFY.md` checklist.

---

## Invocation Scenarios

The OSINT system triggers on natural language or `/osint` commands:

| Trigger | Workflow | Description |
|---------|----------|-------------|
| **"deep dive on X"** | **InvestigationOrchestrator** | **Iterative pivot-driven investigation** |
| **"investigate X, follow the leads"** | **InvestigationOrchestrator** | **Auto-expand as intel discovered** |
| "find accounts for username X" | UsernameRecon | Enumerate across platforms |
| "investigate domain X" | DomainRecon | DNS, WHOIS, CT logs |
| "capture social profile for @X" | SocialCapture | Store profile to graph |
| "map infrastructure for X" | InfraMapping | Port scan, fingerprint |
| "link entities X and Y" | EntityLinking | Cross-reference identities |
| "analyze timeline for X" | TimelineAnalysis | Temporal patterns |
| "full profile for X" | TargetProfile | Comprehensive investigation |
| "generate report for X" | IntelReport | Structured output |
| "company profile X" | CompanyProfile | Business investigation |
| "corporate structure X" | CorporateStructure | Ownership tracing |
| "financials for X" | FinancialRecon | SEC filings, funding |
| "competitors of X" | CompetitorAnalysis | Market landscape |
| "risk assessment X" | RiskAssessment | Due diligence |
| "email lookup X" | EmailRecon | Email investigation, breach check |
| "phone lookup X" | PhoneRecon | Phone number validation |
| "analyze image X" | ImageRecon | Image metadata, forensics |

---

## Example Usage

### Example 1: Iterative Pivot-Driven Investigation (NEW)

```
User: "Deep dive on username johndoe"

System executes InvestigationOrchestrator workflow:

PHASE 1: Initial Collection (Parallel Agents)
├── UsernameRecon Agent → Found 15 accounts
├── SocialCapture Agent → Captured 8 profiles
└── DomainRecon Agent → Found personal domain

PHASE 2: Pivot Detection
├── Email discovered: john@example.com (HIGH priority)
├── Company discovered: Acme Corp (MEDIUM priority)
└── Domain discovered: johndoe.dev (MEDIUM priority)

PHASE 3: User Approval (Interactive Mode)
"Found 3 pivot opportunities. Pursue 1,2,3 or defer?"

PHASE 4: Expansion (Depth 1)
├── EmailRecon Agent → 2 breach exposures
├── CompanyProfile Agent → Corporate structure mapped
└── DomainRecon Agent → WHOIS, hosting analyzed

PHASE 5: Synthesis & Report
└── Comprehensive dossier with 27 entities, 45 relationships

Output: Investigation complete. Deferred pivots saved via the memory adapter.
```

### Example 2: Username Reconnaissance

```
User: "Find all accounts for username johndoe"

System executes UsernameRecon workflow:
1. Searches 400+ platforms for "johndoe"
2. Validates discovered accounts
3. Extracts profile metadata
4. Stores via memory adapter (group: osint-username)
5. Saves report to osint-findings/

Output: Found 15 accounts, stored via memory adapter
```

### Example 2: Company Due Diligence

```
User: "Do a risk assessment on Vendor LLC"

System executes RiskAssessment workflow:
1. Searches litigation databases (PACER, state courts)
2. Checks sanctions lists (OFAC, EU, UK)
3. Scans adverse media
4. Reviews regulatory filings
5. Stores findings via memory adapter (group: osint-risk)

Output: Risk profile generated with 3 litigation cases identified
```

### Example 3: Full Target Investigation

```
User: "Full profile for target johndoe scope comprehensive"

System executes TargetProfile workflow:
1. Runs UsernameRecon
2. Runs DomainRecon (if domains found)
3. Runs SocialCapture
4. Runs EntityLinking
5. Runs TimelineAnalysis
6. Generates consolidated report
7. Stores complete profile via memory adapter

Output: Comprehensive dossier with 23 entities, 45 relationships
```

---

## Configuration

**Environment Variables:**

**Optional API keys for enhanced capabilities** (`.env` or shell profile):
```bash
SHODAN_API_KEY="your_key_here"
SECURITYTRAILS_API_KEY="your_key_here"
HUNTER_API_KEY="your_key_here"
```

---

## Customization

### Recommended Customization

**What to Customize:** Create investigation templates for your common use cases

**Why:** Pre-configured investigation parameters speed up repeated tasks

**Process:**
1. Identify your most common OSINT tasks
2. Create custom workflow variations in `~/.claude/skills/osint/Workflows/`
3. Add trigger phrases to SKILL.md

**Expected Outcome:** One-command investigations for your standard cases

---

### Optional Customization

| Customization | File | Impact |
|--------------|------|--------|
| Add API keys | `.env` | Enhanced data sources |
| Custom report templates | `Workflows/IntelReport.md` | Branded output format |
| Investigation categories | `history/research/osint/` | Organized by case type |

---

## Optional Backends

None are required — every workflow runs on the host's built-in tools and degrades gracefully.

- **MuninnDB MCP** - Persistent, recallable, linked findings (preferred memory path)
  - Without this: findings go to the local `osint-findings/` log instead
- **Bright Data MCP** - Enhanced web scraping and search
  - Without this: standard search tools, may hit rate limits on some sites
- **Browser automation** - JavaScript-heavy sites and authenticated capture
  - Without this: those sources are skipped

---

## Documentation

See `docs/` directory for detailed user guides:

- `docs/USER_GUIDE.md` - Complete usage documentation
- `docs/COMPANY_RESEARCH.md` - Business intelligence workflows
- `docs/QUICK_REFERENCE.md` - Command cheat sheet

---

## Legal & Ethical Considerations

**IMPORTANT:** This system is designed for authorized investigations only.

- Only collect publicly available information
- Respect privacy laws and platform ToS
- Maintain operational security (OPSEC)
- Document collection methods for audit trails
- Never use for harassment or unauthorized surveillance

---

## Credits

- **Original concept**: A personal project that outgrew its home, now a standalone generic skill
- **Methodology**: Based on standard OSINT intelligence cycle practices
- **Inspired by**: Sherlock, theHarvester, Maltego, and professional OSINT frameworks

---

## Works Well With

- **MuninnDB** - Long-term memory server; the preferred findings backend
- **Bright Data MCP** - Bot-walled and scraping-heavy sources
- **Any browser-automation skill** - JavaScript-heavy sites and screenshots

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for full version history.

### v2.0.0 (September 2026)
- **Generic Claude skill** - converted from the v1.x skill-pack format: Claude-native SKILL.md, one-directory install (`osint/`), zero required dependencies
- **Memory adapter** - findings persist to MuninnDB MCP when installed, local `osint-findings/` log otherwise
- **Native agent dispatch** - persona-driven subagent briefs via the host's Agent tool, no external agents skill
- **Toolchain modernization** - sharp 0.35 (GHSA-f88m-g3jw-g9cj), tesseract.js v7 block-hierarchy API, single root manifest, typecheck now green
