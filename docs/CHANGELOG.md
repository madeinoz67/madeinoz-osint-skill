# Changelog

All notable changes to the PAI OSINT Skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - January 2026

### Added
- **Investigation Orchestrator** - New master workflow for iterative pivot-driven investigations
- **Pivot Detection System** - Automatic identification of new leads from collected intelligence (email → domain → company → personnel)
- **Interactive Pivot Approval** - User can pursue, defer, or skip detected pivots during investigation
- **Deferred Leads Storage** - Pivots saved to Knowledge Graph for future investigation with `resume investigation` command
- **Parallel Agent Spawning** - Multiple collection agents run concurrently for faster intelligence gathering
- **Pivot Type → Traits Mapping** - Each pivot type maps to specific AgentFactory traits for optimal voice/personality
- **Bright Data MCP** - Added as recommended dependency for enhanced web scraping and search capabilities
- **OSINT Agent Role Architecture** - Comprehensive 5-tier agent role system:
  - Tier 1: Enumeration (Recon, Scanner, Collector, Enumerator)
  - Tier 2: Analysis (Analyst, TechAnalyst, FinanceAnalyst, BusinessAnalyst, PatternAnalyst)
  - Tier 3: Correlation (Linker, Correlator)
  - Tier 4: Assessment (Auditor, Verifier, Shadow)
  - Tier 5: Synthesis (Synthesizer, Briefer, Researcher)
- **Agent Role → Traits → Voice mapping** - Complete mapping of 17 agent roles to traits and voices
- **Work Type → Role mapping** - 12 work types mapped to primary/alternate roles
- **Workflow Step → Role assignment** - Phase-by-phase role assignments for multi-step workflows
- **All 17 workflows now have trait mappings** - Previously only 9 workflows had explicit mappings

### Changed
- Main agent now acts as orchestrator (not subagent) for proper parallel spawning
- AgentFactory must be run for each pivot type before spawning agents
- Updated dependencies documentation to include Bright Data MCP
- Expanded Agent Role → Voice Mapping table from 9 to 17 roles with traits

### Fixed
- Resolved nested subagent spawning issue ("Invalid tool parameters" error)
- Agents now properly spawn in parallel via single Task tool message
- Gap: 8 workflows previously had no agent delegation (now all have trait mappings)

---

## [1.2.0] - January 2026

### Added
- **Mandatory Agent Delegation** - All OSINT workflows now MUST be executed by specialized agents using the Agents skill
- **Workflow → Agent Trait Mapping** - Each workflow has specific recommended traits for optimal intelligence gathering
- **Multi-Agent Orchestration** - Complex investigations (TargetProfile, CompanyProfile) support parallel agent spawning
- **pai-agents-skill dependency** - Now a required dependency for proper OSINT operations

### Changed
- Updated all 16 workflows to include agent delegation patterns
- Dependencies section now distinguishes between required (pai-agents-skill) and recommended (pai-browser-skill, pai-knowledge-system)
- SKILL.md now includes constitutional rules for agent-based execution

### Fixed
- Simplified INSTALL.md prerequisites section

---

## [1.1.0] - January 2026

### Added
- **Company & Business Research Module**
  - CompanyProfile: Comprehensive company investigation dossiers
  - CorporateStructure: Ownership hierarchy, subsidiaries, directors
  - FinancialRecon: SEC filings, funding history, investor analysis
  - CompetitorAnalysis: Market positioning, SWOT, competitive landscape
  - RiskAssessment: Litigation, sanctions, adverse media, due diligence
- **Digital Artifact Analysis Module**
  - EmailRecon: Email address investigation and breach checking
  - PhoneRecon: Phone number lookup and validation
  - ImageRecon: Image metadata, forensics, and reverse search (experimental)
- Explicit **knowledge** skill integration across all 16 workflows
- User documentation under `docs/`
  - USER_GUIDE.md - Complete usage documentation
  - QUICK_REFERENCE.md - Command cheat sheet
  - COMPANY_RESEARCH.md - Business intelligence guide
  - IMAGE_ANALYSIS_TOOLS.md - Tool requirements and setup
  - ENRICHMENT_ROADMAP.md - API integration guide

### Changed
- Skill name changed to lowercase `osint` per PAI conventions
- Updated VERIFY.md with comprehensive post-installation checks

---

## [1.0.0] - January 2026

### Added
- Initial release with 8 core workflows:
  - UsernameRecon: Username enumeration across 400+ platforms
  - DomainRecon: DNS, WHOIS, CT logs, subdomain discovery
  - SocialCapture: Social media profile capture and archival
  - InfraMapping: Port scanning, service fingerprinting
  - EntityLinking: Cross-source identity resolution
  - TimelineAnalysis: Temporal pattern detection
  - TargetProfile: Comprehensive target investigation
  - IntelReport: Structured intelligence reports
- Browser skill integration for JavaScript-heavy sites
- Knowledge skill integration for persistent entity storage
- Dual storage system (knowledge graph + file reports)
- Structured output format for all operations
- Ethical guidelines and OPSEC considerations built into workflows

---

## Version History Summary

| Version | Release | Highlights |
|---------|---------|------------|
| 1.3.0 | Jan 2026 | Investigation Orchestrator, pivot-driven investigations, parallel agents |
| 1.2.0 | Jan 2026 | Agent delegation, multi-agent orchestration |
| 1.1.0 | Jan 2026 | Company research, digital artifacts, user docs |
| 1.0.0 | Jan 2026 | Initial release, 8 core workflows |
