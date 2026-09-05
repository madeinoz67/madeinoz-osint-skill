# Target Profile Workflow

Create comprehensive target profile by combining all OSINT workflows.

## Trigger Phrases
- "full profile"
- "complete investigation"
- "target dossier"
- "comprehensive OSINT"
- "full reconnaissance"

## Input
- `target`: Primary identifier (username, email, domain, or name)
- `scope` (optional): light, standard, comprehensive

---

## REQUIRED: Multi-Agent Orchestration

**This workflow requires MULTIPLE specialized agents working in parallel.**

### Agent Team Composition

Compose each specialist from the matching persona in AgentProfiles.yaml (workflow_mappings), then dispatch with the host's native agent/Task tool — one dispatch per agent:

```
# Agent 1: Username/Identity Analyst (persona: collector)
#   traits: intelligence, analytical, exploratory
#   task: "Enumerate username '{target}' across platforms, build comprehensive account inventory"

# Agent 2: Domain/Infrastructure Specialist (persona: collector)
#   traits: intelligence, technical, systematic
#   task: "Analyze domains and infrastructure associated with '{target}'"

# Agent 3: Social Network Analyst (persona: linker)
#   traits: intelligence, analytical, synthesizing
#   task: "Map social network, relationships, and entity connections for '{target}'"

# Agent 4: Timeline/Pattern Analyst (persona: linker)
#   traits: intelligence, analytical, systematic
#   task: "Construct activity timeline and behavioral patterns for '{target}'"

# Agent 5: Intelligence Synthesizer (Coordinator; persona: analyst)
#   traits: intelligence, meticulous, thorough
#   task: "Compile comprehensive target dossier from all investigation findings for '{target}'"
```

Each dispatch follows SKILL.md § Agent Dispatch: persona block, target, the sub-workflow file to read, memory adapter group, and the session's available tools.

### Orchestration Pattern

1. **Parallel Execution:** Agents 1-4 run concurrently on different intelligence domains
2. **Synthesis:** Agent 5 consolidates findings into unified dossier
3. **Cross-Reference:** Verify overlapping identifiers between agents
4. **Confidence Scoring:** Rate each finding based on source corroboration

**Do NOT execute this workflow as a single agent or without spawning specialized agents.**

---

## Process

### Step 1: Initial Target Analysis
```
Determine target type:
- Person
- Organization
- Domain/Website
- Infrastructure

Identify starting points:
- Primary identifier
- Known aliases
- Associated entities
```

### Step 2: Execute Sub-Workflows

Run workflows in order:

1. **Username Reconnaissance** (if person)
   - Enumerate across platforms
   - Build account list

2. **Domain Reconnaissance** (if domain/org)
   - DNS, WHOIS, SSL
   - Subdomain enumeration

3. **Social Media Capture**
   - Profile metadata
   - Network analysis
   - Content themes

4. **Infrastructure Mapping** (if technical target)
   - Port scanning
   - Technology detection

5. **Entity Linking**
   - Cross-reference all discovered identities
   - Confirm connections

6. **Timeline Analysis**
   - Activity patterns
   - Account history

### Step 3: Consolidate Findings
```
Merge all workflow outputs:
- Deduplicate entities
- Resolve conflicts
- Calculate confidence scores
- Generate unified entity graph
```

### Step 4: Risk Assessment
```
Evaluate:
- Information exposure level
- Security posture
- Potential vulnerabilities
- Attack surface
```

### Step 5: Generate Comprehensive Report
```
Compile IntelReport with all findings
```

### Step 6: Store Findings (Memory Adapter)

Persist the completed dossier via the memory adapter (SKILL.md § Memory Adapter), group "osint-profile" — Path 1 `muninn_remember` per major finding (atomic, entity names in [[brackets]], tags `["osint-profile", "osint"]`); Path 2 appends to `./osint-findings/osint-profile.md`.

**Required Report Header (for both paths):**

```markdown
# OSINT Target Profile: {target}

Date: {YYYY-MM-DD}

[Full investigation report content...]
```

**Adapter Recognition:**
- Path 1: each stored memory carries the `osint-profile` tag for later recall
- Path 2: the entry header (date + target) anchors the audit trail
- Entities and relationships named in [[brackets]] are registered and linkable

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    COMPREHENSIVE TARGET PROFILE
                         INVESTIGATION DOSSIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASSIFICATION: UNCLASSIFIED
REPORT DATE: 2026-01-09
REPORT ID: OSINT-PROFILE-2026-001
ANALYST: OSINT Skill

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Target Type: Individual
Primary Identifier: johndoe
Investigation Scope: Comprehensive

Key Findings:
• Active presence on 15 platforms
• Confirmed identity across 8 accounts
• Professional: Software Engineering
• Location: San Francisco, CA (High Confidence)
• Associated with 2 organizations

Overall Exposure Level: MODERATE-HIGH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2: IDENTITY OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2.1 Primary Identifiers
┌────────────────┬────────────────────────────┬────────────┐
│ Attribute      │ Value                      │ Confidence │
├────────────────┼────────────────────────────┼────────────┤
│ Primary Name   │ John Doe                   │ High       │
│ Username       │ johndoe                    │ Confirmed  │
│ Email          │ john@example.com           │ Medium     │
│ Location       │ San Francisco, CA          │ High       │
│ Occupation     │ Software Engineer          │ High       │
│ Age Range      │ 28-35                      │ Medium     │
└────────────────┴────────────────────────────┴────────────┘

2.2 Known Aliases
• @johndoe (Twitter)
• jdoe (GitHub)
• john-doe (LinkedIn)
• johndoe123 (Reddit)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3: DIGITAL FOOTPRINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3.1 Platform Presence

┌──────────────┬─────────────┬────────────┬───────────────┐
│ Platform     │ Username    │ Status     │ Followers     │
├──────────────┼─────────────┼────────────┼───────────────┤
│ Twitter/X    │ @johndoe    │ Active     │ 2,500         │
│ GitHub       │ jdoe        │ Active     │ 150           │
│ LinkedIn     │ john-doe    │ Active     │ 500+          │
│ Reddit       │ johndoe123  │ Active     │ 1,234 karma   │
│ Medium       │ johndoe     │ Inactive   │ 45            │
└──────────────┴─────────────┴────────────┴───────────────┘

3.2 Owned Domains
• johndoe.dev (Active, personal website)
• johndoe.io (Redirects to .dev)

3.3 Associated Organizations
• TechCorp Inc (Current employer)
• Open Source Project X (Contributor)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 4: NETWORK ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 Relationship Graph

                    ┌─────────────┐
                    │  TechCorp   │
                    │   (Employer)│
                    └──────┬──────┘
                           │ works_at
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Colleague A  │  │   JOHNDOE     │  │  Colleague B  │
│               │◄─│   (Target)    │─►│               │
└───────────────┘  └───────┬───────┘  └───────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Project A│ │ Project B│ │Influencer│
        └──────────┘ └──────────┘ └──────────┘

4.2 Key Connections
• 45 mutual connections with tech industry professionals
• Active in 3 professional communities
• Regularly interacts with 12 specific accounts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 5: TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2015 ●──── Twitter account created
2016 ●──── First public commits (GitHub)
2018 ●──── Joined TechCorp (LinkedIn)
2020 ●──── Registered johndoe.dev
2024 ●──── Promoted to Senior Engineer
2026 ●──── Last activity: 2 hours ago

Activity Pattern: Weekdays 9am-6pm PST
Inferred Time Zone: PST (High Confidence)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 6: INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6.1 Personal Website (johndoe.dev)
• Hosting: Vercel
• CDN: Cloudflare
• Tech Stack: Next.js, React
• SSL: Valid (Let's Encrypt)

6.2 Associated IPs
• 76.xxx.xxx.xxx (Cloudflare)
• No direct infrastructure exposed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 7: RISK ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7.1 Information Exposure
• Personal Info: MODERATE (name, location, employer)
• Professional: HIGH (work history, skills, projects)
• Contact Info: LOW (no direct email/phone exposed)

7.2 Security Posture
• Uses Cloudflare protection: GOOD
• No credentials in breaches: GOOD
• 2FA status: UNKNOWN

7.3 Attack Surface
• Primary vectors: Social engineering, spear phishing
• Technical vectors: Minimal (no exposed infrastructure)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 8: APPENDICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A. Sources Used
• Public social media profiles
• WHOIS databases
• Certificate transparency logs
• Public code repositories

B. Methodology
• Passive OSINT techniques only
• No active engagement with target
• All sources publicly accessible

C. Confidence Matrix
┌────────────────────┬────────────┬─────────┐
│ Finding            │ Confidence │ Sources │
├────────────────────┼────────────┼─────────┤
│ Identity confirmed │ 95%        │ 5       │
│ Location           │ 85%        │ 3       │
│ Employment         │ 90%        │ 2       │
│ Timeline accuracy  │ 80%        │ 4       │
└────────────────────┴────────────┴─────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                         END OF REPORT

Generated by OSINT Skill v1.0.0
Investigation Duration: 15 minutes
Entities Discovered: 23
Relationships Mapped: 45

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-profile (MuninnDB group | local findings file)
```

## Scope Levels

### Light
- Username enumeration
- Basic social media capture
- ~5 minute investigation

### Standard (Default)
- All above plus
- Domain reconnaissance
- Entity linking
- Timeline analysis
- ~15 minute investigation

### Comprehensive
- All workflows
- Deep network analysis
- Historical research
- Full report generation
- ~30+ minute investigation

## Ethical Notes
- Always verify authorization before investigation
- Document all methods for audit trail
- Note confidence levels accurately
- Protect collected intelligence appropriately
- Do not use for harassment or stalking
