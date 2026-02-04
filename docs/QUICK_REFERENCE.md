# osint skill - Quick Reference

## Commands

```bash
# Investigation Orchestrator (Iterative Pivot-Driven)
/osint investigate <target>                    # Full investigation, auto-expand
/osint deepdive <target>                       # Deep dive with pivots
/osint investigate <target> --interactive      # Approve each pivot
/osint resume <investigation-id>               # Resume previous investigation

# Individual/Username
/osint username <username>
/osint social <@handle>
/osint profile <target>
/osint timeline <target>

# Domain/Infrastructure
/osint domain <domain>
/osint infra <IP/range>

# Company Research
/osint company <name>
/osint structure <name>
/osint financials <name>
/osint competitors <name>
/osint risk <name>

# Digital Artifacts
/osint email <email>
/osint phone <number>
/osint image <path/url>

# Analysis
/osint link <entity1> <entity2>
/osint report <investigation>
```

## Natural Language Examples

### Investigation Orchestrator (Iterative Pivot-Driven)
```
Deep dive on username johndoe
Investigate johndoe, follow the leads
Full investigation on email john@example.com
Pivot investigation on Acme Corp with wide scope
Investigate johndoe with interactive approval
Deep dive on johndoe max_depth 3 max_entities 100
Resume investigation OSINT-INV-2026-001
Pursue deferred leads from last investigation
```

### Username/Person
```
Find all accounts for username johndoe
Capture social profile for @target_user
Create complete profile for John Smith
Analyze activity timeline for target
```

### Domain/Infrastructure
```
Investigate domain example.com
Map infrastructure for 192.168.1.0/24
```

### Company Research
```
Company profile on Acme Corporation
Who owns XYZ Inc?
What's the financial status of TechCorp?
Analyze competitors for Acme
Run risk check on vendor ABC
```

### Digital Artifacts
```
Email lookup john@example.com
Check if email was in any breaches
Phone lookup +1-555-123-4567
Analyze this image for metadata
Reverse image search
```

### Analysis
```
Link these accounts together
Generate intelligence report
```

## Investigation Orchestrator Parameters

| Parameter | Default | Options |
|-----------|---------|---------|
| `max_depth` | 2 | 1-5 (pivot hops) |
| `max_entities` | 50 | 10-200 |
| `scope` | standard | narrow, standard, wide |
| `require_approval` | false | true = interactive mode |

### Scope Levels (Pivot Investigation)

| Scope | What Gets Pursued | Use Case |
|-------|-------------------|----------|
| narrow | HIGH priority only | Quick verification |
| standard | HIGH + MEDIUM | General investigation |
| wide | All priorities | Threat analysis |

### Interactive Commands (During Investigation)

| Command | Action |
|---------|--------|
| `pursue 1,2,4` | Investigate selected pivots |
| `defer 3,5` | Save for later |
| `pursue all` | Investigate everything |
| `defer all` | Save all for later |
| `done` | Skip to synthesis |

## Scope Levels (Standard Workflows)

Add scope to any request:

```
Run a light company profile on Acme
Run a comprehensive risk assessment on ABC Corp
```

| Level | Depth | Time |
|-------|-------|------|
| light | Basics only | ~10 min |
| standard | Core analysis | ~25 min |
| comprehensive | Full deep-dive | ~45+ min |

## Output Locations

| Type | Location |
|------|----------|
| Knowledge Graph | Queryable via knowledge skill |
| Report Files | `~/.claude/history/research/osint/` |

## Querying Past Research

```
Search knowledge for "company name"
What do I know about target?
Show relationships for entity
```

## Confidence Levels

| Level | Meaning |
|-------|---------|
| Confirmed | Official/authoritative source |
| High | Multiple corroborating sources |
| Medium | Single reliable source |
| Low | Unverified |

## Risk Scores

| Score | Level |
|-------|-------|
| 0-2 | Low |
| 3-5 | Moderate |
| 6-8 | High |
| 9-10 | Critical |

## Deferred Leads & Resume

### Query Deferred Leads
```
What deferred leads do I have?
Show deferred pivots from OSINT-INV-2026-001
Search knowledge for deferred OSINT leads
```

### Resume Investigation
```
Resume investigation OSINT-INV-2026-001
Pursue deferred leads from last investigation
Investigate deferred pivot colleague@acme.com
```

## Dependencies

- **agents** skill - Agent delegation (required)
- **browser** skill - Web scraping
- **knowledge** skill - Data persistence

## File Naming

Reports saved as:
```
{workflow}_{target}_{date}.md

Examples:
company_acme_2026-01-10.md
risk_vendor_2026-01-10.md
investigation_johndoe_2026-01-12.md
```
