# OSINT Knowledge Graph Group Naming Convention

Standard group IDs for storing OSINT findings to the knowledge graph.

## Standard Group Pattern

All OSINT workflows MUST use the `osint-{category}` pattern for knowledge graph groups.

## Defined Groups

| Group ID | Used By | Description |
|----------|---------|-------------|
| `osint-usernames` | UsernameRecon | Username enumeration results |
| `osint-domains` | DomainRecon, InfraMapping | Domain intelligence and infrastructure |
| `osint-emails` | EmailRecon | Email investigation findings |
| `osint-phones` | PhoneRecon | Phone number lookup results |
| `osint-companies` | CompanyProfile, CorporateStructure | Corporate intelligence |
| `osint-financial` | FinancialRecon | Financial data and SEC filings |
| `osint-risk` | RiskAssessment | Risk and due diligence findings |
| `osint-entities` | EntityLinking, TimelineAnalysis | Cross-source entity relationships |
| `osint-investigation-{id}` | InvestigationOrchestrator | Full investigation results |
| `osint-deferred-{id}` | InvestigationOrchestrator | Deferred pivots for later investigation |

## Usage Example

When storing findings to the knowledge graph:

```
mcp__knowledge__add_memory:
  name: "Username: johndoe"
  episode_body: "Found 15 accounts across platforms..."
  group_id: "osint-usernames"
```

## Cross-Workflow Querying

To query findings across related groups:

```
# Get all findings for a person
group_ids: ["osint-usernames", "osint-emails", "osint-entities"]

# Get all company intelligence
group_ids: ["osint-companies", "osint-financial", "osint-risk"]
```

## New Groups

When adding new workflows, follow the `osint-{category}` pattern:

1. Use descriptive, singular category names
2. Add to this reference document
3. Document in workflow file
