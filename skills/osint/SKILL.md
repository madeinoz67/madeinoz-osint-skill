---
name: osint
description: AI-powered Open Source Intelligence collection and analysis. USE WHEN user mentions OSINT, reconnaissance, recon, investigate, deep dive, follow the leads, pivot investigation, username lookup, domain lookup, whois, social media intel, intelligence gathering, target profile, digital footprint, company research, corporate intelligence, due diligence, business investigation, company profile, competitor analysis, financial recon, risk assessment, corporate structure, email lookup, breach check, phone lookup, reverse phone, image search, reverse image, photo analysis, EXIF, image forensics, entity linking, or timeline analysis. NOT FOR academic literature search, real-time news monitoring, or paid data-broker background checks.
---

# OSINT Skill

Self-contained Open Source Intelligence collection and analysis for Claude. 17 investigation workflows, persona-driven subagent dispatch, and a pluggable memory layer that persists findings to whatever the host install provides — MuninnDB first, a local findings log otherwise. No required external dependencies.

## Installation

```bash
git clone https://github.com/madeinoz67/madeinoz-osint-skill.git
ln -s "$(pwd)/madeinoz-osint-skill/osint" ~/.claude/skills/osint
```

`osint/` is the entire skill. `src/tools/` in the same repo holds optional bun-powered image-forensic utilities (OCR, hashing, metadata, EXIF) — see Tools below.

## Memory Adapter — how findings persist

**Probe once at investigation start:** if MuninnDB MCP tools are bound in this session (`mcp__muninndb__muninn_remember` or any `muninn_*` tool), use **Path 1**. Otherwise use **Path 2**. A graph database is never required; every workflow's "store findings" step means "run this adapter."

### Group naming (both paths)

| Investigation shape | Group name |
|---|---|
| Single-target collection (username, domain, email, phone, image) | `osint-<type>` — e.g. `osint-username`, `osint-domain` |
| Orchestrated multi-pivot investigation | `osint-investigation-<SLUG>-<YEAR>` — e.g. `osint-investigation-ALB-ZYG-2026` |

### Path 1 — MuninnDB MCP (preferred)

Store — **one finding per memory, atomic:**

```
muninn_remember(
  concept: "<GROUP-SHORT>: <one-line label>",
  content: "<the finding, entity names wrapped in [[double brackets]]>",
  entities: [{name: "...", type: "person|organization|location|concept|other"}],
  tags: ["<group-name>", "osint"],
  type: "observation"
)
```

Rules:

- **Update, don't duplicate:** re-asserting or correcting a stored fact goes through `muninn_evolve` on the prior memory's ID — a second `muninn_remember` for the same fact leaves a stale copy competing in recall.
- **Link pivots:** related findings connect with `muninn_link` (`source_id`, `target_id`, relation: `relates_to` / `supports` / `contradicts`).
- **Resume:** `muninn_recall` with context phrases plus `tags_any: ["<group-name>"]` reloads an investigation's prior state, including deferred leads.

### Path 2 — local findings log (fallback)

Append to `./osint-findings/<group-name>.md`, one entry per finding:

```markdown
## 2026-09-04T15:30+08:00 — <headline>
source: <url or tool> · confidence: high|medium|low
<finding prose; name entities explicitly>
```

Resume = read the group file. Persist across machines by committing the directory.

## Agent Dispatch — native

Specialist work runs in subagents, not the main session. Compose each brief from the matching persona in [AgentProfiles.yaml](AgentProfiles.yaml), then dispatch with the host's native agent/Task tool:

```
Agent(
  description: "OSINT <Workflow> Specialist",
  prompt: |
    <persona block from AgentProfiles.yaml — role, voice, traits>
    Target: <target>
    Workflow: Read <skill-dir>/Workflows/<Workflow>.md and follow it.
    Memory: use the adapter in <skill-dir>/SKILL.md § Memory Adapter,
    group "<group-name>".
    Tools: use whatever web/search tools this session provides.
    Escalate back to the main session on judgment calls (legality,
    scope expansion, ambiguous identity) — do not decide alone.
)
```

Workflow → persona mapping:

| Workflow | Traits | Voice |
|---|---|---|
| UsernameRecon | intelligence, analytical, exploratory | Sophisticated |
| DomainRecon | intelligence, technical, systematic | Authoritative |
| EmailRecon | intelligence, analytical, systematic | Sophisticated |
| SocialCapture | intelligence, meticulous, thorough | Sophisticated |
| CompanyProfile | intelligence, business, synthesizing | Professional |
| RiskAssessment | intelligence, security, skeptical | Intense |
| InfraMapping | intelligence, technical, thorough | Authoritative |
| TargetProfile | intelligence, meticulous, thorough | Sophisticated |
| InvestigationOrchestrator | intelligence, systematic, meticulous | Authoritative |
| CompetitorAnalysis | intelligence, business, comparative | Professional |
| CorporateStructure | intelligence, business, systematic | Professional |
| FinancialRecon | intelligence, finance, thorough | Professional |
| EntityLinking | intelligence, analytical, synthesizing | Sophisticated |
| TimelineAnalysis | intelligence, analytical, systematic | Sophisticated |
| PhoneRecon | intelligence, analytical, systematic | Sophisticated |
| ImageRecon | intelligence, technical, meticulous | Authoritative |
| IntelReport | intelligence, communications, synthesizing | Authoritative |

Agent role tiers, voice mappings, and group-naming reference: [References/AGENT_ROLES.md](References/AGENT_ROLES.md), [References/VOICE_MAPPINGS.md](References/VOICE_MAPPINGS.md), [References/KNOWLEDGE_GROUPS.md](References/KNOWLEDGE_GROUPS.md).

## Intent Routing

| User says | Workflow |
|---|---|
| "find/check username", "where is this user" | UsernameRecon.md |
| "domain info", "whois", "dns", "subdomains" | DomainRecon.md |
| "capture/analyze social profile" | SocialCapture.md |
| "infrastructure", "shodan", "ports", "ip scan" | InfraMapping.md |
| "link entities", "identity resolution" | EntityLinking.md |
| "timeline", "activity pattern", "when active" | TimelineAnalysis.md |
| "generate report/dossier" | IntelReport.md |
| "full profile", "complete dossier" | TargetProfile.md |
| "email lookup", "breach check" | EmailRecon.md |
| "phone lookup", "reverse phone" | PhoneRecon.md |
| "image search", "reverse image", "exif" | ImageRecon.md |
| "company profile", "due diligence" | CompanyProfile.md |
| "corporate structure", "who owns" | CorporateStructure.md |
| "financials", "SEC filings", "funding" | FinancialRecon.md |
| "competitors", "market position" | CompetitorAnalysis.md |
| "risk assessment", "adverse media", "sanctions" | RiskAssessment.md |
| "investigate", "deep dive", "follow the leads", "resume investigation" | InvestigationOrchestrator.md |

InvestigationOrchestrator is the iterative pivot engine: automatic pivot detection (email → domain → company → personnel), deferred leads stored via the memory adapter for future runs, configurable `max_depth` (default 2), `max_entities` (default 50), `scope` (narrow/standard/wide), and `require_approval` for interactive pivots.

## Optional backends

| Capability | Used for | Without it |
|---|---|---|
| MuninnDB MCP | findings persistence, resume | local findings log (Path 2) |
| Bright Data MCP | bot-walled/scraped sources | WebSearch/WebFetch only |
| Browser automation skill | JS-heavy sites, screenshots | skip those sources |
| `src/tools/` bun utilities | OCR, perceptual hashing, EXIF/metadata, forensics | skip image-forensics depth |

Nothing above is required; every workflow degrades gracefully.

## Tools (optional image forensics)

From the repo root:

```bash
bun install && bun run test   # verify the toolchain
```

Utilities: OCR (`ocr-engine`), perceptual/exif hashing (`hash-calculator`), metadata + EXIF extraction (`metadata-extractor`), image processing (`image-processor`), manipulation forensics (`forensic-analyzer`). Each is a bun script under `src/tools/`; see `src/tools/README.md`.

## Ethical Guidelines

Before any OSINT operation:

1. **Verify authorization** — legitimate purpose only
2. **Check legal boundaries** — privacy laws and platform ToS
3. **Maintain OPSEC** — appropriate anonymization where needed
4. **Document everything** — audit trail of collection methods
5. **Store securely** — protect collected intelligence appropriately

## Voice markers (optional convention)

If the host has a voice-notification system it will speak `🗣️` lines aloud; include them at start, key findings, and completion — harmless otherwise:

```
🗣️ [AgentRole]: [brief status — max 20 words]
```

## Output format

```markdown
🗣️ [AgentRole]: [brief opening status]

📋 OSINT REPORT: [operation type]
🎯 TARGET: [identifier] · 📅 [timestamp] · 🔍 [method]

📊 FINDINGS: [structured findings]
🔗 RELATIONSHIPS: [entity relationships]
⚠️ CONFIDENCE: [high/medium/low] · 📝 NOTES: [analyst notes]

💾 Stored via memory adapter: [MuninnDB group | local file]

🗣️ [AgentRole]: [closing status and recommendation]
```
