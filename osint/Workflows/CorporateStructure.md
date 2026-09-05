# Corporate Structure Workflow

Investigate company ownership, subsidiaries, directors, and key personnel.

## Trigger Phrases
- "corporate structure"
- "company ownership"
- "who owns"
- "subsidiaries"
- "parent company"
- "directors"
- "key personnel"
- "org chart"

## Input
- `company`: Company name or identifier
- `jurisdiction` (optional): Country/state for registry lookup
- `depth` (optional): How many levels of ownership to trace (default: 2)

## Process

### Step 1: Company Identification
```
Verify company identity:
- Search corporate registry by name
- Obtain company registration number
- Note jurisdiction of incorporation
- Identify legal entity type (Corp, LLC, Ltd, etc.)
- Check for DBA/trading names
```

### Step 2: Ownership Structure
```
Trace ownership hierarchy:

Upward:
- Identify immediate parent company
- Trace ultimate beneficial owner (UBO)
- Note ownership percentages
- Check for circular ownership

Downward:
- List all subsidiaries
- Note ownership stakes
- Identify dormant vs active entities
- Map multi-jurisdictional holdings
```

### Step 3: Directors & Officers
```
For each director/officer:
- Full legal name
- Position/title
- Appointment date
- Other directorships
- Previous companies
- Potential conflicts of interest
```

### Step 4: Registered Agent & Addresses
```
Collect address information:
- Registered office address
- Principal place of business
- Previous addresses
- Registered agent details
```

### Step 5: Historical Changes
```
Track corporate changes:
- Name changes
- Ownership transfers
- Director appointments/resignations
- Capital structure changes
- Merger/acquisition history
```

### Step 6: Cross-Reference
```
Verify with multiple sources:
- Cross-check with SEC filings (if public)
- LinkedIn executive profiles
- Press releases
- Court records
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-company". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-company", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-company.md`.

```
Store the following findings (one memory/entry each):

1. Company Entity:
   - Label: "Company: {company_name}"
   - Data: Legal name, registration number, type, status, jurisdiction
   - Group: "osint-company"

2. Ownership Hierarchy:
   - Label: "Ownership: {company_name}"
   - Data: Parent entities, ownership percentages, UBO information
   - Relationships: owned_by, parent_of, controls (muninn_link relates_to)

3. Subsidiaries:
   - Label: "Subsidiaries: {company_name}"
   - Data: Each subsidiary with jurisdiction, stake, status
   - Relationships: subsidiary_of, owns

4. Directors & Officers:
   - For each person, store as individual entity:
   - Label: "Person: {full_name}"
   - Data: Positions held, appointment dates, other directorships
   - Relationships: director_of, officer_of, works_at

5. Corporate Timeline:
   - Label: "History: {company_name}"
   - Data: Key events (incorporations, name changes, acquisitions)
   - Temporal metadata for each event
```

## Output Format

```
📋 CORPORATE STRUCTURE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 COMPANY: Acme Corporation Inc.
📅 REPORT DATE: 2026-01-10
🔍 REGISTRY: Delaware Division of Corporations

📋 BASIC INFORMATION:
• Legal Name: Acme Corporation Inc.
• Registration #: DE-12345678
• Type: Corporation
• Status: Active / Good Standing
• Incorporated: 2015-03-15
• Jurisdiction: Delaware, USA
• Registered Agent: CT Corporation System

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 OWNERSHIP STRUCTURE:

Level 0 (Ultimate Parent):
┌─────────────────────────────────┐
│     Founder Holdings LLC        │
│     (Nevada, Private)           │
│     UBO: Jane Smith (75%)       │
│          John Doe (25%)         │
└────────────────┬────────────────┘
                 │ 100%
Level 1 (Holding):
┌────────────────┴────────────────┐
│      Acme Holdings Inc.         │
│      (Delaware)                 │
└────────────────┬────────────────┘
                 │ 100%
Level 2 (Target):
┌────────────────┴────────────────┐
│     ACME CORPORATION INC.       │
│     [TARGET ENTITY]             │
└────────────────┬────────────────┘
        ┌────────┼────────┐
        │ 100%   │ 100%   │ 100%
        ▼        ▼        ▼
┌───────────┐ ┌─────────┐ ┌───────────┐
│ Acme UK   │ │Acme Labs│ │ Acme EU   │
│ Limited   │ │ Inc.    │ │ GmbH      │
│ (UK)      │ │ (DE)    │ │ (Germany) │
└───────────┘ └─────────┘ └───────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 DIRECTORS & OFFICERS:

Current Directors:
┌──────────────────┬─────────────────┬──────────────┐
│ Name             │ Position        │ Appointed    │
├──────────────────┼─────────────────┼──────────────┤
│ Jane Smith       │ Director (CEO)  │ 2015-03-15   │
│ John Doe         │ Director (CTO)  │ 2016-01-10   │
│ Michael Chen     │ Director (Ind.) │ 2018-06-01   │
│ Sarah Johnson    │ Director (CFO)  │ 2020-03-01   │
└──────────────────┴─────────────────┴──────────────┘

Officers:
┌──────────────────┬─────────────────┬──────────────┐
│ Jane Smith       │ CEO             │ 2015-03-15   │
│ John Doe         │ CTO             │ 2016-01-10   │
│ Sarah Johnson    │ CFO             │ 2020-03-01   │
│ Lisa Park        │ COO             │ 2022-01-15   │
│ Robert Lee       │ Secretary       │ 2015-03-15   │
└──────────────────┴─────────────────┴──────────────┘

Other Directorships (Jane Smith):
• Founder Holdings LLC (Director)
• Acme Holdings Inc. (Director)
• Tech Nonprofit Inc. (Board Member)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 SUBSIDIARIES:

┌──────────────────┬────────────┬─────────┬─────────┐
│ Entity           │ Juris.     │ Stake   │ Status  │
├──────────────────┼────────────┼─────────┼─────────┤
│ Acme UK Limited  │ UK         │ 100%    │ Active  │
│ Acme Labs Inc.   │ Delaware   │ 100%    │ Active  │
│ Acme EU GmbH     │ Germany    │ 100%    │ Active  │
│ Acme Asia Pte.   │ Singapore  │ 100%    │ Dormant │
└──────────────────┴────────────┴─────────┴─────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 REGISTERED ADDRESSES:

Registered Office:
1209 Orange Street
Wilmington, DE 19801

Principal Place of Business:
123 Main Street, Suite 500
San Francisco, CA 94105

Previous Addresses:
• 456 Startup Lane, Palo Alto, CA (2015-2018)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📜 CORPORATE HISTORY:

2015-03-15 │ Incorporated as "Acme Technologies Inc."
2016-01-10 │ John Doe appointed Director
2017-06-01 │ Name changed to "Acme Corporation Inc."
2018-06-01 │ Michael Chen appointed Independent Director
2019-02-15 │ Acquired Acme Labs Inc.
2020-03-01 │ Sarah Johnson appointed Director and CFO
2021-08-20 │ Established Acme UK Limited
2022-01-15 │ Established Acme EU GmbH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ FLAGS & NOTES:

• Clean corporate history
• No regulatory actions
• No nominee directors detected
• UBO identified and verified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-company (MuninnDB group | local findings file)
```

## Data Sources

### Primary Registries
- **US**: Delaware Division of Corporations, Secretary of State databases
- **UK**: Companies House
- **EU**: National business registers, EUBD
- **Global**: OpenCorporates (235M+ companies, 145 jurisdictions)

### Secondary Sources
- SEC EDGAR (beneficial ownership filings)
- LinkedIn (executive verification)
- Bloomberg (corporate data)
- Annual reports

## Tools & APIs Used
- OpenCorporates API
- SEC EDGAR (Forms 4, 10-K, DEF 14A)
- State registry search tools
- Companies House API (UK)

## Ethical Notes
- Stick to publicly filed information
- Respect privacy of individuals not in public roles
- Note when UBO is protected by privacy laws
- Do not impersonate officials to obtain data
- Document all sources for verification
