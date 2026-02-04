---
name: osint
description: AI-powered Open Source Intelligence collection and analysis. USE WHEN user mentions OSINT, reconnaissance, investigation, username lookup, domain analysis, social media intel, intelligence gathering, company research, corporate intelligence, due diligence, or business investigation.
triggers:
  - osint
  - reconnaissance
  - recon
  - investigate
  - deep dive
  - follow the leads
  - pivot investigation
  - full investigation
  - recursive osint
  - resume investigation
  - username lookup
  - domain lookup
  - whois
  - social media intel
  - intelligence gathering
  - target profile
  - digital footprint
  - company research
  - corporate intelligence
  - due diligence
  - business investigation
  - company profile
  - competitor analysis
  - financial recon
  - risk assessment
  - corporate structure
  - email lookup
  - email recon
  - breach check
  - phone lookup
  - phone number
  - reverse phone
  - image search
  - reverse image
  - photo analysis
  - exif
---

# osint skill

AI-powered Open Source Intelligence collection and analysis system.

---

## MANDATORY: Use AgentFactory + Task Tool (Constitutional Rule)

**ALL OSINT tasks MUST use AgentFactory.ts to generate the specialist, then spawn via Task.**

### Step 1: Run AgentFactory with OSINT Traits

```bash
bun run $PAI_DIR/skills/Agents/Tools/AgentFactory.ts \
  --traits "intelligence,<personality>,<approach>" \
  --task "<task description>" \
  --output json
```

### Workflow → Traits Mapping

| Workflow | Traits | Voice |
|----------|--------|-------|
| UsernameRecon | `intelligence,analytical,exploratory` | Sophisticated |
| DomainRecon | `intelligence,technical,systematic` | Authoritative |
| EmailRecon | `intelligence,analytical,systematic` | Sophisticated |
| SocialCapture | `intelligence,meticulous,thorough` | Sophisticated |
| CompanyProfile | `intelligence,business,synthesizing` | Professional |
| RiskAssessment | `intelligence,security,skeptical` | Intense |
| InfraMapping | `intelligence,technical,thorough` | Authoritative |
| TargetProfile | `intelligence,meticulous,thorough` | Sophisticated |
| InvestigationOrchestrator | `intelligence,systematic,meticulous` | Authoritative |
| CompetitorAnalysis | `intelligence,business,comparative` | Professional |
| CorporateStructure | `intelligence,business,systematic` | Professional |
| FinancialRecon | `intelligence,finance,thorough` | Professional |
| EntityLinking | `intelligence,analytical,synthesizing` | Sophisticated |
| TimelineAnalysis | `intelligence,analytical,systematic` | Sophisticated |
| PhoneRecon | `intelligence,analytical,systematic` | Sophisticated |
| ImageRecon | `intelligence,technical,meticulous` | Authoritative |
| IntelReport | `intelligence,communications,synthesizing` | Authoritative |

---

## OSINT Agent Role Architecture

### Agent Role → Traits → Voice → Work Types

This table defines all OSINT specialist roles, their trait combinations, resulting voices, and appropriate work types.

#### Tier 1: Enumeration Specialists (Collection)

| Role | Traits | Voice | Work Types | Use For Workflows |
|------|--------|-------|------------|-------------------|
| **Recon** | `intelligence,analytical,exploratory` | Sophisticated | Discovery, enumeration, platform scanning | UsernameRecon, initial collection phases |
| **Scanner** | `intelligence,technical,systematic` | Authoritative | DNS, ports, infrastructure scanning | DomainRecon, InfraMapping |
| **Collector** | `intelligence,meticulous,thorough` | Sophisticated | Profile capture, data extraction | SocialCapture, comprehensive data gathering |
| **Enumerator** | `intelligence,analytical,systematic` | Sophisticated | Email/phone validation, breach checks | EmailRecon, PhoneRecon |

#### Tier 2: Analysis Specialists (Processing)

| Role | Traits | Voice | Work Types | Use For Workflows |
|------|--------|-------|------------|-------------------|
| **Analyst** | `intelligence,analytical,synthesizing` | Sophisticated | Pattern analysis, correlation, inference | EntityLinking, TimelineAnalysis |
| **TechAnalyst** | `intelligence,technical,meticulous` | Authoritative | Infrastructure analysis, forensics | InfraMapping, ImageRecon, DomainRecon |
| **FinanceAnalyst** | `intelligence,finance,thorough` | Professional | SEC filings, funding, valuations | FinancialRecon |
| **BusinessAnalyst** | `intelligence,business,comparative` | Professional | Market analysis, competitive intel | CompetitorAnalysis, CompanyProfile |
| **PatternAnalyst** | `intelligence,analytical,systematic` | Sophisticated | Timeline patterns, anomaly detection | TimelineAnalysis |

#### Tier 3: Correlation Specialists (Linking)

| Role | Traits | Voice | Work Types | Use For Workflows |
|------|--------|-------|------------|-------------------|
| **Linker** | `intelligence,analytical,synthesizing` | Sophisticated | Identity resolution, account linking | EntityLinking |
| **Correlator** | `intelligence,analytical,exploratory` | Sophisticated | Cross-source correlation, pivot detection | InvestigationOrchestrator expansion |

#### Tier 4: Assessment Specialists (Risk/Verification)

| Role | Traits | Voice | Work Types | Use For Workflows |
|------|--------|-------|------------|-------------------|
| **Auditor** | `intelligence,security,skeptical` | Intense | Risk assessment, due diligence, sanctions | RiskAssessment |
| **Verifier** | `intelligence,meticulous,systematic` | Sophisticated | Source verification, validation | All workflows (verification steps) |
| **Shadow** | `intelligence,security,adversarial` | Intense | Threat modeling, attack surface | Security-focused assessments |

#### Tier 5: Synthesis Specialists (Output)

| Role | Traits | Voice | Work Types | Use For Workflows |
|------|--------|-------|------------|-------------------|
| **Synthesizer** | `intelligence,communications,synthesizing` | Authoritative | Report generation, consolidation | IntelReport, TargetProfile synthesis |
| **Briefer** | `intelligence,communications,consultative` | Authoritative | Executive summaries, recommendations | IntelReport, final briefings |
| **Researcher** | `intelligence,business,systematic` | Professional | Corporate structure, ownership tracing | CorporateStructure, CompanyProfile |

---

### Work Type → Recommended Role Mapping

| Work Type | Primary Role | Alternate Role | Traits Pattern |
|-----------|--------------|----------------|----------------|
| **Enumeration** | Recon | Enumerator | `intelligence,analytical,exploratory` |
| **Technical Analysis** | TechAnalyst | Scanner | `intelligence,technical,*` |
| **Financial Analysis** | FinanceAnalyst | BusinessAnalyst | `intelligence,finance,thorough` |
| **Correlation** | Linker | Analyst | `intelligence,analytical,synthesizing` |
| **Pattern Detection** | PatternAnalyst | Analyst | `intelligence,analytical,systematic` |
| **Risk Assessment** | Auditor | Shadow | `intelligence,security,skeptical` |
| **Verification** | Verifier | Auditor | `intelligence,meticulous,systematic` |
| **Synthesis** | Synthesizer | Briefer | `intelligence,communications,synthesizing` |
| **Reporting** | Briefer | Synthesizer | `intelligence,communications,consultative` |
| **Corporate Research** | Researcher | BusinessAnalyst | `intelligence,business,systematic` |
| **Infrastructure** | Scanner | TechAnalyst | `intelligence,technical,systematic` |
| **Profile Capture** | Collector | Recon | `intelligence,meticulous,thorough` |

---

### Workflow Step → Agent Role Assignment

For multi-step workflows, assign specific roles to each phase:

#### InvestigationOrchestrator Phases
| Phase | Role | Traits |
|-------|------|--------|
| Initial Collection | Recon | `intelligence,analytical,exploratory` |
| Domain Pivots | Scanner | `intelligence,technical,systematic` |
| Email Pivots | Enumerator | `intelligence,analytical,systematic` |
| Company Pivots | Researcher | `intelligence,business,systematic` |
| Correlation | Linker | `intelligence,analytical,synthesizing` |
| Synthesis | Synthesizer | `intelligence,communications,synthesizing` |

#### TargetProfile Phases
| Phase | Role | Traits |
|-------|------|--------|
| Username Scan | Recon | `intelligence,analytical,exploratory` |
| Domain Analysis | Scanner | `intelligence,technical,systematic` |
| Social Capture | Collector | `intelligence,meticulous,thorough` |
| Entity Linking | Linker | `intelligence,analytical,synthesizing` |
| Timeline Analysis | PatternAnalyst | `intelligence,analytical,systematic` |
| Final Report | Briefer | `intelligence,communications,consultative` |

#### CompanyProfile Phases
| Phase | Role | Traits |
|-------|------|--------|
| Registry Research | Researcher | `intelligence,business,systematic` |
| Corporate Structure | Researcher | `intelligence,business,systematic` |
| Financial Analysis | FinanceAnalyst | `intelligence,finance,thorough` |
| Competitive Intel | BusinessAnalyst | `intelligence,business,comparative` |
| Risk Assessment | Auditor | `intelligence,security,skeptical` |
| Synthesis | Synthesizer | `intelligence,communications,synthesizing` |

### Step 2: Spawn via Task Tool

Use the `prompt` field from AgentFactory output:

```
Task tool parameters:
  subagent_type: "general-purpose"
  description: "OSINT [Workflow] Specialist"
  prompt: |
    [AgentFactory prompt output]

    ## Additional Context
    Target: [target]
    Workflow: [Read from skills/osint/Workflows/[Workflow].md]

    ## Tools Available
    - mcp__brightdata__search_engine - platform searches
    - mcp__brightdata__scrape_as_markdown - profile extraction
    - mcp__pai-knowledge__add_memory - store findings (group_id: "osint-[type]")

    ## Voice Output (REQUIRED)
    - Start: 🗣️ Recon: Beginning [type] for [target].
    - Key finding: 🗣️ Analyst: Found [X]. [Insight].
    - End: 🗣️ Analyst: Investigation complete. [Summary].
```

### Why This Pattern?

| Benefit | Explanation |
|---------|-------------|
| **Proper voice mapping** | AgentFactory maps traits to correct voice |
| **Consistent agents** | Uses standard agent composition system |
| **SubagentStop fires** | Voice notifications work |

### What is FORBIDDEN

| Action | Why It's Wrong |
|--------|----------------|
| Skipping AgentFactory | No voice mapping, inconsistent agents |
| Main agent executing searches | Bypasses subagent, voice breaks |
| Hardcoding prompts | Should use AgentFactory output |

---

## Intent Routing

When the user requests OSINT activities, route to the appropriate workflow:

### Username Reconnaissance
**Triggers:** "find username", "check username", "username lookup", "where is this user"
**Workflow:** UsernameRecon.md
```
User: Find all accounts for username "johndoe"
→ Execute UsernameRecon workflow
```

### Domain Reconnaissance
**Triggers:** "domain info", "whois", "dns lookup", "subdomains", "domain recon"
**Workflow:** DomainRecon.md
```
User: Investigate domain example.com
→ Execute DomainRecon workflow
```

### Social Media Capture
**Triggers:** "social media profile", "capture profile", "social intel", "profile analysis"
**Workflow:** SocialCapture.md
```
User: Capture social profile for @target_user
→ Execute SocialCapture workflow
```

### Infrastructure Mapping
**Triggers:** "infrastructure", "shodan", "ports", "services", "ip scan"
**Workflow:** InfraMapping.md
```
User: Map infrastructure for 192.168.1.0/24
→ Execute InfraMapping workflow
```

### Entity Linking
**Triggers:** "link entities", "connect accounts", "find connections", "identity resolution"
**Workflow:** EntityLinking.md
```
User: Find connections between these accounts
→ Execute EntityLinking workflow
```

### Timeline Analysis
**Triggers:** "timeline", "activity pattern", "when active", "temporal analysis"
**Workflow:** TimelineAnalysis.md
```
User: Analyze activity timeline for target
→ Execute TimelineAnalysis workflow
```

### Intelligence Report
**Triggers:** "report", "summary", "intel report", "dossier", "findings"
**Workflow:** IntelReport.md
```
User: Generate intelligence report
→ Execute IntelReport workflow
```

### Target Profile
**Triggers:** "full profile", "complete investigation", "target dossier", "comprehensive"
**Workflow:** TargetProfile.md
```
User: Create complete profile for target
→ Execute TargetProfile workflow (combines multiple workflows)
```

### Investigation Orchestrator (Iterative Pivot-Driven)
**Triggers:** "investigate", "deep dive", "follow the leads", "recursive OSINT", "pivot investigation", "full investigation"
**Workflow:** InvestigationOrchestrator.md
```
User: Deep dive on username "johndoe"
→ Execute InvestigationOrchestrator workflow

User: Investigate with interactive approval
→ Execute InvestigationOrchestrator with require_approval=true
```

**Key Features:**
- Iterative collection that expands as new intelligence is discovered
- Automatic pivot detection (email → domain → company → personnel)
- Interactive mode: user approves/defers each pivot
- Deferred leads stored in Knowledge Graph for future investigation
- Configurable depth limits and scope (narrow/standard/wide)

**Parameters:**
- `max_depth`: Maximum pivot hops (default: 2)
- `max_entities`: Maximum entities before stopping (default: 50)
- `scope`: narrow | standard | wide
- `require_approval`: Ask before each expansion (default: false)

**Resume Investigation:**
```
User: Resume investigation OSINT-INV-2026-001
→ Load deferred pivots from Knowledge Graph, continue investigation
```

---

## Digital Artifact Analysis

### Email Reconnaissance
**Triggers:** "email lookup", "email recon", "check email", "email OSINT", "breach check email", "who owns this email"
**Workflow:** EmailRecon.md
```
User: Investigate email address john@example.com
→ Execute EmailRecon workflow
```

### Phone Number Reconnaissance
**Triggers:** "phone lookup", "phone number", "reverse phone", "caller ID", "who called", "phone OSINT"
**Workflow:** PhoneRecon.md
```
User: Look up phone number +1-555-123-4567
→ Execute PhoneRecon workflow
```

### Image Reconnaissance
**Triggers:** "image search", "reverse image", "photo analysis", "exif data", "where was this photo taken", "image forensics", "is this image real"
**Workflow:** ImageRecon.md
```
User: Analyze this image for metadata and find similar images
→ Execute ImageRecon workflow
```

---

## Company & Business Research

### Company Profile
**Triggers:** "company profile", "business investigation", "company research", "corporate intelligence", "company due diligence"
**Workflow:** CompanyProfile.md
```
User: Investigate Acme Corporation
→ Execute CompanyProfile workflow (comprehensive company dossier)
```

### Corporate Structure
**Triggers:** "corporate structure", "who owns", "ownership", "subsidiaries", "parent company", "directors", "org chart"
**Workflow:** CorporateStructure.md
```
User: Show me the ownership structure of XYZ Inc
→ Execute CorporateStructure workflow
```

### Financial Reconnaissance
**Triggers:** "financial recon", "company financials", "SEC filings", "funding history", "investor info", "valuation"
**Workflow:** FinancialRecon.md
```
User: What's the financial status of TechCorp?
→ Execute FinancialRecon workflow
```

### Competitor Analysis
**Triggers:** "competitor analysis", "competitive landscape", "market position", "who competes with"
**Workflow:** CompetitorAnalysis.md
```
User: Analyze competitors for Acme Corp
→ Execute CompetitorAnalysis workflow
```

### Risk Assessment
**Triggers:** "risk assessment", "due diligence", "litigation history", "adverse media", "sanctions check"
**Workflow:** RiskAssessment.md
```
User: Run a risk check on potential vendor
→ Execute RiskAssessment workflow
```

## Example Invocations

Use natural language to invoke OSINT workflows:

**Username enumeration:**
- "Find all accounts for username johndoe"
- "Check username johndoe across platforms"
- "Where is username johndoe registered"

**Domain reconnaissance:**
- "Investigate domain example.com"
- "Get WHOIS and DNS for example.com"
- "Show me subdomains for example.com"

**Social media capture:**
- "Capture social profile for @target_user"
- "Get profile data from twitter.com/user"
- "Extract social media intelligence"

**Infrastructure mapping:**
- "Map infrastructure for 192.168.1.0/24"
- "Scan ports on example.com"
- "What services are running on target"

**Entity linking:**
- "Find connections between these accounts"
- "Link entities across platforms"
- "Resolve identity for username X"

**Timeline analysis:**
- "Analyze activity timeline for target"
- "When was this account most active"
- "Show temporal patterns"

**Intelligence reporting:**
- "Generate intel report for Investigation Alpha"
- "Create dossier from findings"
- "Summarize collected intelligence"

**Target profiling:**
- "Full profile for target johndoe"
- "Comprehensive investigation of username X"
- "Complete dossier for company"

**Digital Artifact Analysis:**
- "Email lookup john@example.com"
- "Check if email was breached"
- "Phone lookup +1-555-123-4567"
- "Analyze this image for metadata"
- "Reverse image search"

**Company & Business Research:**
- "Company profile Acme Corporation"
- "Corporate structure of XYZ Inc"
- "Financials for TechCorp"
- "Competitor analysis for Acme Corp"
- "Risk assessment on potential vendor"

**Investigation Orchestrator (Iterative Pivot-Driven):**
- "Deep dive on username johndoe"
- "Investigate johndoe, follow the leads"
- "Full investigation on email john@example.com with wide scope"
- "Pivot investigation on Acme Corp, max depth 3"
- "Investigate johndoe with interactive approval" (asks before each pivot)
- "Resume investigation OSINT-INV-2026-001" (continue from deferred leads)
- "Pursue deferred leads from last investigation"

## Dependencies

**Required:**
- **pai-agents-skill** - REQUIRED for agent delegation (OSINT tasks must be executed by specialized agents)

**Recommended:**
- **pai-browser-skill** - For web scraping and JavaScript-heavy sites
- **pai-knowledge-system** - For storing entities and relationships to knowledge graph (required for full functionality)

## Ethical Guidelines

Before any OSINT operation:

1. **Verify Authorization** - Ensure you have legitimate purpose
2. **Check Legal Boundaries** - Respect privacy laws and platform ToS
3. **Maintain OPSEC** - Use appropriate anonymization if needed
4. **Document Everything** - Maintain audit trail of collection methods
5. **Store Securely** - Protect collected intelligence appropriately

## Voice Output (REQUIRED)

**All OSINT agents MUST include voice markers for audio notifications.**

The voice system picks up `🗣️` lines and speaks them aloud. Include these at key points:

### Voice Line Format
```
🗣️ [AgentRole]: [Brief status message - max 20 words]
```

### When to Include Voice Lines

| Phase | Example |
|-------|---------|
| **Start** | `🗣️ Recon: Beginning username enumeration for target madeinoz.` |
| **Key Finding** | `🗣️ Analyst: Found 5 confirmed accounts. GitHub profile shows developer activity.` |
| **Completion** | `🗣️ Analyst: Investigation complete. 4 distinct entities identified. Awaiting direction.` |

### Agent Role → Voice Mapping

| Agent Role | Voice | Traits | Description |
|------------|-------|--------|-------------|
| `Recon` | Sophisticated | `intelligence,analytical,exploratory` | Quick, tactical reconnaissance specialist |
| `Scanner` | Authoritative | `intelligence,technical,systematic` | Infrastructure and domain scanning |
| `Collector` | Sophisticated | `intelligence,meticulous,thorough` | Methodical intelligence gatherer |
| `Enumerator` | Sophisticated | `intelligence,analytical,systematic` | Email/phone validation specialist |
| `Analyst` | Sophisticated | `intelligence,analytical,synthesizing` | Measured, synthesizing intelligence analyst |
| `TechAnalyst` | Authoritative | `intelligence,technical,meticulous` | Technical infrastructure analyst |
| `FinanceAnalyst` | Professional | `intelligence,finance,thorough` | Financial intelligence specialist |
| `BusinessAnalyst` | Professional | `intelligence,business,comparative` | Corporate/competitive analyst |
| `PatternAnalyst` | Sophisticated | `intelligence,analytical,systematic` | Timeline and pattern detection |
| `Linker` | Sophisticated | `intelligence,analytical,synthesizing` | Identity resolution specialist |
| `Correlator` | Sophisticated | `intelligence,analytical,exploratory` | Cross-source correlation |
| `Auditor` | Intense | `intelligence,security,skeptical` | Risk and due diligence expert |
| `Verifier` | Sophisticated | `intelligence,meticulous,systematic` | Source verification specialist |
| `Shadow` | Intense | `intelligence,security,adversarial` | Adversarial intelligence operator |
| `Synthesizer` | Authoritative | `intelligence,communications,synthesizing` | Report generation specialist |
| `Briefer` | Authoritative | `intelligence,communications,consultative` | Executive briefing specialist |
| `Researcher` | Professional | `intelligence,business,systematic` | Corporate structure researcher |

### Example Output with Voice

```
🗣️ Recon: Initiating username scan for johndoe across 400 platforms.

[... investigation proceeds ...]

🗣️ Analyst: Found 12 accounts. Strong GitHub presence detected.

[... analysis continues ...]

🗣️ Analyst: Investigation complete. Recommend deep dive on developer platforms.
```

---

## Output Format

All OSINT operations output in structured format:

```
🗣️ [AgentRole]: [Brief opening status]

📋 OSINT REPORT: [Operation Type]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TARGET: [Target identifier]
📅 DATE: [Collection timestamp]
🔍 METHOD: [Collection method]

📊 FINDINGS:
[Structured findings]

🔗 RELATIONSHIPS:
[Entity relationships discovered]

⚠️ CONFIDENCE: [High/Medium/Low]
📝 NOTES: [Analyst notes]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored to Knowledge Graph: [Yes/No]

🗣️ [AgentRole]: [Brief closing status and recommendation]
```
