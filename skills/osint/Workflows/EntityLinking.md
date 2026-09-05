# Entity Linking Workflow

Cross-reference and link entities across multiple data sources for identity resolution.

## Trigger Phrases
- "link entities"
- "find connections"
- "identity resolution"
- "connect accounts"
- "cross-reference"

## Input
- `entities`: List of entities to analyze (usernames, emails, domains, names)

## Process

### Step 1: Entity Extraction
```
Parse inputs to identify:
- Usernames/handles
- Email addresses
- Domain names
- Real names
- Phone numbers
- IP addresses
```

### Step 2: Query Stored Intelligence (Memory Adapter)
```
Recall existing intelligence via the memory adapter (Path 1: muninn_recall
with context phrases + tags_any ["osint"]; Path 2: read ./osint-findings/):
- Known entities matching inputs
- Existing relationships
- Previous investigations
```

### Step 3: Cross-Platform Username Search
```
For each username:
- Search across known platforms
- Identify matching profiles
- Compare profile metadata
```

### Step 4: Email Correlation
```
For each email:
- Search breach databases (ethical sources)
- Check domain associations
- Identify linked accounts
```

### Step 5: Writing Style Analysis
```
If text content available:
- Analyze writing patterns
- Compare linguistic features
- Note distinctive phrases
```

### Step 6: Temporal Correlation
```
Compare activity timelines:
- Account creation dates
- Posting patterns
- Activity overlaps
```

### Step 7: Network Overlap Analysis
```
Compare social networks:
- Mutual followers/friends
- Shared group memberships
- Interaction patterns
```

### Step 8: Generate Link Graph
```
Create relationship map:
- Confirmed links (same person)
- Probable links (high confidence)
- Possible links (requires verification)
- Related entities (associated but different)
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-identity". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-identity", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-identity.md`.

```
Store the following findings (one memory/entry each):

1. Resolved Identity:
   - Label: "Identity: {primary_identifier}"
   - Data: Primary identifier, all linked accounts, confidence score
   - Group: "osint-identity"

2. Confirmed Links:
   - Label: "Link: {entity1} = {entity2}"
   - Data: Evidence (matching email, profile pics, bios), confidence percentage
   - Relationships: same_person_as, confirmed_link (muninn_link relates_to)

3. Probable Links:
   - Label: "ProbableLink: {entity1} ~ {entity2}"
   - Data: Evidence, confidence percentage, verification needed
   - Relationships: likely_same_as

4. Correlation Evidence:
   - Label: "Evidence: {primary_identifier}"
   - Data: Profile picture matches, writing style, temporal patterns, network overlap
   - Supporting data for future verification

5. Link Matrix:
   - Label: "Matrix: {investigation_id}"
   - Data: Full cross-reference matrix with all confidence scores
```

## Output Format

```
📋 ENTITY LINKING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 ENTITIES ANALYZED: 4
📅 ANALYSIS DATE: 2026-01-09

📥 INPUT ENTITIES:
1. Username: johndoe
2. Email: john@example.com
3. Twitter: @jdoe_tech
4. GitHub: jdoe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 CONFIRMED LINKS (Same Person):

  ┌─────────────────┐
  │   johndoe       │
  │   (Primary)     │
  └────────┬────────┘
           │
    ┌──────┴──────┐
    │             │
┌───┴───┐    ┌───┴───┐
│ GitHub│    │Twitter│
│ jdoe  │    │@jdoe_ │
└───────┘    └───────┘

Evidence:
• Same email in both profiles
• Profile pictures match (87% similarity)
• Bio text contains same website
• Created within same month

Confidence: 95% (High)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ PROBABLE LINKS (Needs Verification):

johndoe ←→ john@example.com
• Domain matches username pattern
• WHOIS shows similar registration
• Confidence: 75%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ POSSIBLE LINKS (Low Confidence):

johndoe ←→ jdoe_reddit
• Similar username pattern
• Some topic overlap
• Different writing style
• Confidence: 35%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 LINK MATRIX:

             │ johndoe │ @jdoe_ │ jdoe │ john@...│
─────────────┼─────────┼────────┼──────┼─────────│
johndoe      │    -    │  95%   │ 95%  │   75%   │
@jdoe_tech   │   95%   │   -    │ 90%  │   70%   │
jdoe (GH)    │   95%   │  90%   │  -   │   80%   │
john@example │   75%   │  70%   │ 80%  │    -    │

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 CORRELATION EVIDENCE:

1. Profile Picture Analysis
   • GitHub ↔ Twitter: 87% match

2. Writing Style
   • Common phrases: "building cool stuff"
   • Similar emoji usage patterns

3. Temporal
   • All accounts created 2015-2016
   • Similar activity hours (9am-6pm PST)

4. Network Overlap
   • 12 mutual followers across platforms
   • 3 shared organization memberships

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-identity (MuninnDB group | local findings file)
```

## Linking Criteria

### High Confidence (>80%)
- Same email verified on multiple platforms
- Profile picture exact match
- Explicit cross-linking in bios
- Same unique identifier (website, phone)

### Medium Confidence (50-80%)
- Similar usernames + overlapping networks
- Writing style correlation
- Temporal activity patterns match
- Partial email match

### Low Confidence (<50%)
- Username pattern similarity only
- Topic interest overlap
- Geographic correlation

## Ethical Notes
- Only use publicly available information
- Do not access private accounts
- Respect user privacy preferences
- Document confidence levels accurately
- Avoid false positive assertions
