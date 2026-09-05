# Intelligence Report Workflow

Generate structured intelligence reports from collected OSINT data.

## Trigger Phrases
- "generate report"
- "intel report"
- "create dossier"
- "summarize findings"
- "investigation summary"

## Input
- `investigation_name`: Name/identifier for the investigation
- `targets` (optional): Specific targets to include
- `format` (optional): Output format (markdown, pdf, json)

---

## REQUIRED: Agent Delegation

**This workflow MUST be executed by a specialized report synthesis agent via the native agent/Task tool.**

### Spawn Specialist Agent (MANDATORY)

Compose the brief from the matching persona in AgentProfiles.yaml (workflow mapping: IntelReport → analyst), then dispatch natively:

```
Agent/Task tool parameters:
  subagent_type: "general-purpose"
  description: "OSINT intel report for {investigation_name}"
  prompt: |
    [Persona block from AgentProfiles.yaml — role, voice, traits]

    Task: Generate comprehensive intelligence report for investigation
    '{investigation_name}', synthesizing all collected OSINT data into
    structured dossier format.
    Workflow: Read <skill-dir>/Workflows/IntelReport.md and follow it.
    Memory: use the adapter in <skill-dir>/SKILL.md § Memory Adapter,
    group "osint-report".
    Tools: use whatever web/search tools this session provides.
    Escalate back to the main session on judgment calls (legality,
    scope expansion, ambiguous identity) — do not decide alone.

    ## Workflow Instructions
    [Include the Process steps below]

    ## Voice Output Required
    Include 🗣️ IntelBriefer: lines at start, key sections, and completion.
```

**Agent Traits:**
- `intelligence` - OSINT expertise and tradecraft for intelligence products
- `communications` - Professional report writing and clear presentation
- `consultative` - Advisory stance with actionable recommendations

⚠️ **FORBIDDEN: Executing this workflow directly without the agent spawn.**
⚠️ **WHY: Specialist synthesis belongs in subagents — the main session orchestrates, it does not collect.**

---

## Process

### Step 1: Gather Intelligence
```
Recall stored intelligence via the memory adapter (Path 1: muninn_recall with
context phrases + tags_any ["osint"]; Path 2: read ./osint-findings/) for:
- All entities related to investigation
- Facts and relationships
- Timeline of collection
- Source attribution
```

### Step 2: Organize by Category
```
Structure findings:
1. Executive Summary
2. Target Overview
3. Digital Footprint
4. Network Analysis
5. Timeline
6. Risk Assessment
7. Recommendations
8. Appendices
```

### Step 3: Generate Sections

**Executive Summary**
- Key findings (3-5 bullet points)
- Confidence level
- Scope of investigation

**Target Overview**
- Primary identifiers
- Known aliases
- Platform presence

**Digital Footprint**
- Domains owned/associated
- Social media accounts
- Online activity summary

**Network Analysis**
- Key relationships
- Organizations
- Geographic associations

**Timeline**
- Account creation dates
- Activity patterns
- Notable events

**Risk Assessment**
- Threat indicators
- Exposure level
- Vulnerabilities identified

### Step 4: Add Metadata
```
Report metadata:
- Generation date
- Analyst (AI)
- Sources used
- Confidence levels
- Classification
```

### Step 5: Export
```
Persist via the memory adapter (SKILL.md § Memory Adapter):
- Path 1: muninn_remember per finding, tags ["osint-report", "osint"]
- Path 2: append to ./osint-findings/osint-report.md
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter, group "osint-report". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]]); Path 2 appends each finding to `./osint-findings/osint-report.md`.

```
Store the following findings (one memory/entry each):

1. Report Entity:
   - Label: "Report: {investigation_name}"
   - Data: Report ID, date, classification, scope, key findings summary
   - Group: "osint-report"

2. Target Summary:
   - Label: "Target: {investigation_name}"
   - Data: All targets included, primary identifiers, platform presence
   - Links to individual target profiles (muninn_link relates_to)

3. Findings:
   - Label: "Findings: {investigation_name}"
   - Data: Digital footprint, network analysis, timeline, risk assessment
   - Confidence levels and source counts

4. Recommendations:
   - Label: "Recommendations: {investigation_name}"
   - Data: Action items, follow-up suggestions
   - Priority levels

5. Sources & Methodology:
   - Label: "Sources: {investigation_name}"
   - Data: All sources used, collection methods, ethical compliance
   - Audit trail
```

## Output Format

```markdown
# INTELLIGENCE REPORT
## Investigation: [Name]

---

**Classification:** UNCLASSIFIED
**Date:** 2026-01-09
**Analyst:** OSINT Skill
**Report ID:** OSINT-2026-001

---

## 1. EXECUTIVE SUMMARY

This report summarizes intelligence gathered on [target/subject]
during the period [dates]. Key findings include:

• [Finding 1]
• [Finding 2]
• [Finding 3]

**Overall Confidence:** [High/Medium/Low]

---

## 2. TARGET OVERVIEW

### 2.1 Primary Identifiers
| Attribute | Value |
|-----------|-------|
| Name | [Name] |
| Aliases | [alias1, alias2] |
| Primary Email | [if known] |
| Primary Phone | [if known] |

### 2.2 Platform Presence
| Platform | Username | Status | Last Active |
|----------|----------|--------|-------------|
| Twitter | @handle | Active | 2026-01-08 |
| GitHub | user | Active | 2026-01-07 |

---

## 3. DIGITAL FOOTPRINT

### 3.1 Domains
- example.com (Registered 2020, Active)
- example.io (Registered 2022, Redirects to .com)

### 3.2 Infrastructure
- Primary IP: x.x.x.x
- Hosting: AWS us-east-1
- CDN: Cloudflare

### 3.3 Technology Stack
- Frontend: React
- Backend: Node.js
- Database: PostgreSQL (inferred)

---

## 4. NETWORK ANALYSIS

### 4.1 Key Relationships
```
[Target] ─── works_at ──→ [Company]
         ├── follows ───→ [Person A]
         └── collaborates ─→ [Person B]
```

### 4.2 Organizations
- Company Inc. (Employee, 2020-present)
- Open Source Project (Contributor)

---

## 5. TIMELINE

| Date | Event | Source |
|------|-------|--------|
| 2015-03 | Twitter account created | Twitter |
| 2018-06 | GitHub first commit | GitHub |
| 2020-01 | Domain registered | WHOIS |

---

## 6. RISK ASSESSMENT

### 6.1 Exposure Level: [Low/Medium/High]
- Public information readily available
- [X] accounts publicly accessible

### 6.2 Potential Vulnerabilities
- [List if applicable]

### 6.3 Threat Indicators
- None identified / [List if present]

---

## 7. RECOMMENDATIONS

1. [Recommendation 1]
2. [Recommendation 2]

---

## 8. APPENDICES

### A. Sources
- WHOIS database
- Certificate Transparency logs
- Public social media profiles
- [Other sources]

### B. Methodology
- Collection period: [dates]
- Tools used: [list]
- Ethical guidelines followed: Yes

### C. Confidence Matrix
| Finding | Confidence | Sources |
|---------|------------|---------|
| [Finding] | High | 3+ sources |

---

**END OF REPORT**

Generated by OSINT Skill v1.0.0
```

## Export Formats

### Markdown (default)
- Human-readable
- Easy to edit
- Git-friendly

### PDF
- Professional presentation
- Fixed formatting
- Suitable for sharing

### JSON
- Machine-readable
- API compatible
- Integration ready

## Ethical Notes
- Include methodology section for transparency
- Note confidence levels for each finding
- Attribute all sources
- Mark classification appropriately
- Maintain audit trail
