# Email Reconnaissance Workflow

Comprehensive email address investigation including validation, breach exposure, social correlation, and domain analysis.

## Trigger Phrases
- "email lookup"
- "investigate email"
- "email OSINT"
- "check email breaches"
- "find accounts for email"
- "email reconnaissance"
- "who owns this email"

## Input
- `email`: The email address to investigate (e.g., john.doe@example.com)
- `headers`: (Optional) Raw email headers for header analysis

---

## REQUIRED: Agent Delegation

**This workflow MUST be executed by a specialized OSINT agent via the native agent/Task tool.**

### Spawn Specialist Agent (MANDATORY)

Compose the brief from the matching persona in AgentProfiles.yaml (workflow mapping: EmailRecon → collector), then dispatch natively:

```
Agent/Task tool parameters:
  subagent_type: "general-purpose"
  description: "OSINT email recon for {email}"
  prompt: |
    [Persona block from AgentProfiles.yaml — role, voice, traits]

    Task: Investigate email '{email}' including validation, breach exposure,
    social correlation, and domain analysis.
    Workflow: Read <skill-dir>/Workflows/EmailRecon.md and follow it.
    Memory: use the adapter in <skill-dir>/SKILL.md § Memory Adapter,
    group "osint-email".
    Tools: use whatever web/search tools this session provides.
    Escalate back to the main session on judgment calls (legality,
    scope expansion, ambiguous identity) — do not decide alone.

    ## Workflow Instructions
    [Include the Process steps below]

    ## Voice Output Required
    Include 🗣️ Recon: or 🗣️ Analyst: lines at start, key findings, and completion.
```

**Agent Traits:**
- `intelligence` - OSINT expertise and breach database knowledge
- `analytical` - Systematic breach and account correlation
- `systematic` - Structured investigation methodology

⚠️ **FORBIDDEN: Executing this workflow directly without the agent spawn.**
⚠️ **WHY: Specialist collection belongs in subagents — the main session orchestrates, it does not collect.**

---

## Process

### Step 1: Email Validation
```
Verify email deliverability:
- Syntax validation (RFC 5322)
- MX record check for domain
- SMTP connection test (if authorized)
- Disposable email detection
- Role-based email detection (info@, support@, etc.)
```

### Step 2: Email Format Analysis
```
Parse and analyze email components:
- Local part: john.doe
- Domain: example.com
- Naming patterns detected (firstname.lastname, firstlast, etc.)
- Common variations generated:
  - j.doe@example.com
  - johndoe@example.com
  - john_doe@example.com
  - jdoe@example.com
```

### Step 3: Breach Database Check
```
Query breach databases:
- HaveIBeenPwned API
  - Breach names and dates
  - Data types exposed (passwords, phone, address)
  - Paste appearances
- Additional breach sources (if available)
  - DeHashed (with authorization)
  - IntelX (with API key)

Output:
- Number of breaches
- Breach timeline
- Severity assessment
- Exposed data categories
```

### Step 4: Email-to-Social Correlation
```
Discover linked accounts:

1. Gravatar:
   - Hash email (MD5) and query Gravatar API
   - Retrieve avatar image
   - Profile data if available

2. GitHub:
   - Search commits by email
   - Author/committer matching
   - Repository associations

3. Social Platforms:
   - Hunter.io profile search
   - EmailRep.io social indicators
   - LinkedIn (limited without auth)
   - Twitter/X email search (if authorized)

4. Professional Directories:
   - Domain-associated directories
   - Industry-specific lookups
   - Company employee pages

5. Password Reset Pages:
   - Check for account existence indicators
   - Platform-specific enumeration (ethical, no exploitation)
```

### Step 5: Domain Analysis
```
Analyze email domain:
- MX records (mail server infrastructure)
- SPF record (authorized senders)
- DMARC policy (email authentication)
- DKIM selectors (if discoverable)
- Domain registration (WHOIS)
- Organization type (corporate, personal, provider)
```

### Step 6: Email Header Analysis
```
If email sample headers provided:
- Trace routing path (Received headers)
- Originating IP address
- Mail client/User-Agent
- Authentication results (SPF, DKIM, DMARC)
- Time zone indicators
- X-headers analysis
- Detect spoofing indicators
```

### Step 7: Reputation Assessment
```
Email reputation scoring:
- EmailRep.io reputation check
- Spam database presence
- Blacklist status
- Trust score calculation
- Risk indicators
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-email". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-email", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-email.md`.

```
Store the following findings (one memory/entry each):

1. Email Entity:
   - Label: "Email: {email}"
   - Data: Email address, domain, local part, validation status, reputation score
   - Group: "osint-email"

2. Breach Exposure:
   - Label: "Breaches: {email}"
   - Data: Breach list, dates, exposed data types, severity
   - Relationships: exposed_in breach entities (muninn_link relates_to)
   - Temporal metadata for timeline

3. Linked Accounts:
   - Label: "Accounts: {email}"
   - Data: Platform name, URL, username, confidence level
   - Relationships: owns_account, linked_to email entity

4. Gravatar Profile:
   - Label: "Gravatar: {email}"
   - Data: Avatar URL, hash, profile data
   - Relationships: avatar_for email entity

5. Domain Association:
   - Label: "Domain: {domain}"
   - Data: MX records, SPF, DMARC, organization
   - Relationships: email_domain_of email entity

6. Header Analysis (if provided):
   - Label: "Headers: {email}/{date}"
   - Data: Routing path, originating IP, auth results, anomalies
   - Relationships: received_from, routed_through
```

## Output Format

```
📋 EMAIL RECONNAISSANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 EMAIL: john.doe@example.com
📅 SCAN DATE: 2026-01-11

✅ VALIDATION:
• Syntax: Valid (RFC 5322)
• MX Record: Found (mail.example.com)
• Deliverable: Yes
• Disposable: No
• Role-based: No

📊 FORMAT ANALYSIS:
• Local Part: john.doe
• Domain: example.com
• Pattern: firstname.lastname
• Variations Generated: 4

⚠️ BREACH EXPOSURE:
• Breaches Found: 3
• First Breach: 2019-05-12 (CompanyX)
• Latest Breach: 2024-03-15 (DataLeakY)
• Data Exposed: Email, Password Hash, Phone, Address
• Severity: HIGH

🔍 LINKED ACCOUNTS:

1. Gravatar ✓
   Hash: d4c74594d841139328695756648b6bd6
   Avatar: Found
   Profile: https://gravatar.com/johndoe

2. GitHub ✓
   Username: johndoe
   Commits: 234 (using this email)
   Repos: 12 public repositories

3. Hunter.io ✓
   Confidence: 94%
   Sources: 3 web mentions
   Position: Software Engineer
   Company: Example Corp

4. EmailRep.io ✓
   Reputation: High
   Profiles: Twitter, LinkedIn detected
   Days Since Domain Created: 4,521

❌ NOT FOUND ON:
• Facebook, Instagram (no direct link)

📡 DOMAIN ANALYSIS:
• MX: mail.example.com (Priority: 10)
• SPF: v=spf1 include:_spf.google.com ~all
• DMARC: v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com
• Organization: Example Corporation
• Hosting: Google Workspace

📨 HEADER ANALYSIS: (if provided)
• Originating IP: 203.0.113.45
• Mail Client: Mozilla Thunderbird 115.0
• Routing Hops: 4
• SPF: Pass
• DKIM: Pass
• DMARC: Pass
• Anomalies: None detected

🛡️ REPUTATION:
• Trust Score: 85/100
• Blacklisted: No
• Spam Reports: 0
• Risk Level: LOW

📈 TIMELINE:
• 2019-05: First breach exposure
• 2022-08: Second breach exposure
• 2024-03: Latest breach exposure
• 2026-01: Current scan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-email (MuninnDB group | local findings file)
```

## Tools & APIs Used
- Hunter.io (email verification, company lookup)
- HaveIBeenPwned API (breach checking)
- Gravatar API (avatar and profile lookup)
- EmailRep.io (reputation and social indicators)
- DNS tools (MX, SPF, DMARC, DKIM)
- WHOIS APIs (domain registration)
- GitHub Search API (commit email search)

## Ethical Notes
- Only use breach data for awareness, not exploitation
- Respect API rate limits and terms of service
- Do not attempt credential stuffing or account takeover
- Email validation should not trigger spam filters
- SMTP checks should be non-intrusive (no delivery attempts)
- Store findings securely and limit access
- Document collection methods for audit trail
- Notify targets if conducting authorized security assessments
