# OSINT Memory Group Naming Convention

Standard group names for persisting OSINT findings through the skill's memory adapter (see `skills/osint/SKILL.md` § Memory Adapter).

## Standard Group Pattern

All OSINT workflows use one of two group shapes:

| Investigation shape | Group name |
|---|---|
| Single-target collection (username, domain, email, phone, image) | `osint-<type>` — e.g. `osint-username`, `osint-domain` |
| Orchestrated multi-pivot investigation | `osint-investigation-<SLUG>-<YEAR>` — e.g. `osint-investigation-ALB-ZYG-2026` |

The group name is used as-is: a MuninnDB tag on Path 1, a filename under `./osint-findings/` on Path 2.

## Defined Groups

| Group | Used By | Description |
|----------|---------|-------------|
| `osint-username` | UsernameRecon | Username enumeration results |
| `osint-domain` | DomainRecon, InfraMapping | Domain intelligence and infrastructure |
| `osint-email` | EmailRecon | Email investigation findings |
| `osint-phone` | PhoneRecon | Phone number lookup results |
| `osint-image` | ImageRecon | Image forensics findings |
| `osint-social` | SocialCapture | Social profile capture |
| `osint-profile` | TargetProfile | Full target dossiers |
| `osint-company` | CompanyProfile, CorporateStructure | Corporate intelligence |
| `osint-financial` | FinancialRecon | Financial data and SEC filings |
| `osint-competitors` | CompetitorAnalysis | Market and competitor analysis |
| `osint-risk` | RiskAssessment | Risk and due diligence findings |
| `osint-entities` | EntityLinking, TimelineAnalysis | Cross-source entity relationships |
| `osint-investigation-<SLUG>-<YEAR>` | InvestigationOrchestrator | Full investigation results |
| `osint-investigation-<SLUG>-<YEAR>` (deferred entries) | InvestigationOrchestrator | Deferred pivots, stored in the same group marked `deferred` |

## Usage Example

Path 1 — MuninnDB MCP (tag carries the group):

```
muninn_remember(
  concept: "osint-username: johndoe 15 accounts across platforms",
  content: "Found 15 accounts for [[johndoe]] across platforms...",
  tags: ["osint-username", "osint"],
  type: "observation"
)
```

Path 2 — local findings log (filename carries the group):

```markdown
## 2026-09-04T15:30+08:00 — Username johndoe: 15 accounts found
source: UsernameRecon workflow · confidence: high
Found 15 accounts for johndoe across platforms...
```

## Cross-Workflow Recall

To reload findings across related groups:

```
# Path 1: MuninnDB recall with multiple group tags
muninn_recall(context: ["johndoe"], tags_any: ["osint-username", "osint-email", "osint-entities"])

# Path 2: read the group files
./osint-findings/osint-username.md
./osint-findings/osint-email.md
./osint-findings/osint-entities.md
```

## New Groups

When adding workflows, follow the `osint-<type>` pattern:

1. Use a descriptive, singular type name matching the workflow's target type
2. Add to this reference document
3. Document in the workflow file
