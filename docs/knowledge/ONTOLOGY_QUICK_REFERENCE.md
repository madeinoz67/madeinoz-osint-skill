# OSINT Ontology Quick Reference

**Quick reference for OSINT entities, relationships, and implementation**

---

## Entity Types at a Glance

| Entity | Purpose | Key Attributes |
|--------|---------|----------------|
| **Person** | Individual humans | name, aliases, usernames, emails, phones |
| **Organization** | Companies, orgs | legal_name, registration_number, directors |
| **Account** | Platform IDs | platform, username, display_name, verified |
| **Domain** | Websites | name, dns_records, ssl_certificate, hosting |
| **Email** | Email addresses | address, breach_history, reputation |
| **Phone** | Phone numbers | e164_format, line_type, carrier |
| **Location** | Places | name, coordinates, type (city/venue/gps) |
| **Image** | Photos/media | hash, exif, gps, authenticity |
| **Investigation** | Cases | id, target_type, scope, depth |

---

## Relationship Types Quick Reference

### Identity Resolution

```
SAME_PERSON_AS (95-100%)    — Confirmed same person
LIKELY_SAME_PERSON (70-94%) — Probable match
POSSIBLY_SAME_PERSON (50-69%) — Tentative
DIFFERENT_PERSON (95-100%) — Confirmed different
```

### Digital Identity

```
HAS_EMAIL       Person → Email
HAS_PHONE       Person → Phone
HAS_ACCOUNT     Person → Account
REGISTERED_WITH Account → Email
```

### Professional

```
WORKS_AT        Person → Org (since, title)
DIRECTOR_OF     Person → Org (appointed, resigned)
FOUNDER_OF       Person → Org
EMPLOYS          Org → Person
```

### Corporate

```
PARENT_OF        Org → Org (ownership_pct)
SUBSIDIARY_OF   Org → Org
OWNS            Org → Domain
FUNDED_BY       Org → Investor
COMPETES_WITH   Org ↔ Org
```

### Infrastructure

```
RESOLVES_TO     Domain → IP
HOSTS           IP → Domain
HAS_SUBDOMAIN   Domain → Domain
EXPOSES         IP → Port
```

### Social

```
KNOWS           Person → Person
FOLLOWS        Account → Account
CONNECTED_TO   Person → Person
```

---

## Confidence Levels

| Level | Range | When to Use |
|-------|-------|-------------|
| **Confirmed** | 95-100% | Verified email, exact profile match, explicit cross-link |
| **High** | 80-94% | Same unique identifier, strong temporal correlation |
| **Medium** | 60-79% | Similar usernames + network overlap |
| **Low** | 40-59% | Username pattern only |
| **Tentative** | 0-39% | Weak association, needs verification |

---

## Memory Groups

Group names used by the memory adapter (MuninnDB tag or `osint-findings/` filename):

```
osint-username                    → username enumeration results
osint-domain                      → domain/infrastructure results
osint-email                       → email investigation findings
osint-phone                       → phone lookup results
osint-image                       → image forensics findings
osint-company                     → corporate intelligence
osint-financial                   → financial data and SEC filings
osint-risk                        → risk and due diligence findings
osint-entities                    → cross-source entity relationships
osint-investigation-<SLUG>-<YEAR> → orchestrated investigation results
```

See [KNOWLEDGE_GROUPS.md](../advanced/KNOWLEDGE_GROUPS.md) for the full convention.

---

## Common Finding Patterns

### Username Enumeration Finding

```
Person: John Smith
Usernames: twitter: @jsmith, github: jsmith-dev
Emails: john@example.com
Accounts Found: 15
Confidence: 85%
Sources: Twitter API, GitHub Profile
```

### Corporate Profile Finding

```
Organization: Acme Corporation Inc.
Registration: DE-12345678
Jurisdiction: Delaware
Founded: 2015-03-15
Directors: Jane Smith (CEO), John Doe (CTO)
Subsidiaries: Acme UK Ltd, Acme Labs Inc.
Confidence: 92%
Sources: Delaware Registry, SEC EDGAR
```

---

## Implementation Checklist

- [ ] Probe at investigation start: MuninnDB MCP tools bound? (Path 1) : local log (Path 2)
- [ ] Choose the group name (`osint-<type>` or `osint-investigation-<SLUG>-<YEAR>`)
- [ ] Store one finding per memory/entry, atomic
- [ ] Wrap entity names in `[[double brackets]]` (Path 1) or name them explicitly (Path 2)
- [ ] Tag every memory with the group name plus `osint` (Path 1)
- [ ] Link related findings (`muninn_link` / cross-references in log entries)
- [ ] Include confidence level and source in every finding
- [ ] Record provenance (tool or URL) per finding
- [ ] Update existing findings rather than duplicating (`muninn_evolve` on Path 1)

---

## Related Documentation

- [OSINT_ONTOLOGY.md](OSINT_ONTOLOGY.md) - Complete ontology specification
- [GRAPHITI_IMPLEMENTATION.md](GRAPHITI_IMPLEMENTATION.md) - Legacy backend notes (retired optional integration)
- [KNOWLEDGE_GROUPS.md](../advanced/KNOWLEDGE_GROUPS.md) - Group naming conventions

---

**Version:** 1.0.0
**Last Updated:** 2026-02-04
