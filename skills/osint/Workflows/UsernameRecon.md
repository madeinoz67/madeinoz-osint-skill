# Username Reconnaissance Workflow

Enumerate a username across 400+ platforms to discover digital footprint.

## Trigger Phrases
- "find username"
- "check username across platforms"
- "username lookup"
- "where is this user"
- "digital footprint for username"

## Input
- `username`: The username/handle to search

---

## REQUIRED: Agent Delegation

**This workflow MUST be executed by a specialized OSINT agent via the native agent/Task tool.**

### Spawn Specialist Agent (MANDATORY)

Compose the brief from the matching persona in AgentProfiles.yaml (workflow mapping: UsernameRecon → collector), then dispatch natively:

```
Agent/Task tool parameters:
  subagent_type: "general-purpose"
  description: "OSINT username recon for {username}"
  prompt: |
    [Persona block from AgentProfiles.yaml — role, voice, traits]

    Task: Enumerate username '{username}' across social media, developer,
    gaming, and creative platforms.
    Workflow: Read <skill-dir>/Workflows/UsernameRecon.md and follow it.
    Memory: use the adapter in <skill-dir>/SKILL.md § Memory Adapter,
    group "osint-username".
    Tools: use whatever web/search tools this session provides.
    Escalate back to the main session on judgment calls (legality,
    scope expansion, ambiguous identity) — do not decide alone.

    ## Workflow Instructions
    [Include the Process steps below]

    ## Voice Output Required
    Include 🗣️ Recon: or 🗣️ Analyst: lines at start, key findings, and completion.
```

**Agent Traits:**
- `intelligence` - OSINT expertise and tradecraft
- `analytical` - Methodical platform enumeration
- `exploratory` - Follow leads to discover accounts

⚠️ **FORBIDDEN: Executing this workflow directly without the agent spawn.**
⚠️ **WHY: Specialist collection belongs in subagents — the main session orchestrates, it does not collect.**

---

## Process

### Step 1: Validate Input
```
Ensure username is provided and sanitized
Remove @ prefix if present
Check for invalid characters
```

### Step 2: Platform Categories
Search across these categories:

**Social Media (Major)**
- Twitter/X, Facebook, Instagram, TikTok, LinkedIn, Reddit, Pinterest, Tumblr

**Developer Platforms**
- GitHub, GitLab, Bitbucket, Stack Overflow, Dev.to, Codepen, HackerRank

**Professional/Business**
- LinkedIn, AngelList, Crunchbase, About.me

**Gaming**
- Steam, Xbox, PlayStation, Twitch, Discord (if public)

**Forums & Communities**
- Reddit, Hacker News, Medium, Quora, ProductHunt

**Creative**
- Behance, Dribbble, DeviantArt, SoundCloud, Spotify (if public)

**Messaging (Public)**
- Telegram (public channels), Keybase

### Step 3: Execute Search
For each platform:
1. Check if username exists (HTTP status, profile page)
2. Capture profile metadata if found
3. Note account creation indicators if available
4. Screenshot profile if browser automation is available

### Step 4: Compile Results
```
Found on [X] platforms:
- Platform: [URL] - [Status: Active/Inactive/Uncertain]
  - Profile Name: [if different from username]
  - Bio: [if available]
  - Followers/Following: [if available]
  - Last Activity: [if detectable]
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-username". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-username", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-username.md`.

```
Store the following findings (one memory/entry each):

1. Username Entity:
   - Label: "Username: {username}"
   - Data: Username, scan date, platforms found, confidence
   - Group: "osint-username"

2. Platform Accounts:
   - For each found account:
   - Label: "Account: {platform}/{username}"
   - Data: URL, bio, followers, status, last active
   - Relationships: belongs_to username entity (muninn_link relates_to)

3. Profile Metadata:
   - Label: "Profile: {username}"
   - Data: Aggregated bio info, common themes, locations mentioned
   - Relationships: linked accounts
```

## Output Format

```
📋 USERNAME RECONNAISSANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 USERNAME: johndoe
📅 SCAN DATE: 2026-01-09

📊 SUMMARY:
• Platforms Checked: 400+
• Accounts Found: 15
• Confidence: High

🔍 FOUND ACCOUNTS:

1. GitHub ✓
   URL: https://github.com/johndoe
   Bio: "Software Developer"
   Repos: 42 | Followers: 150

2. Twitter/X ✓
   URL: https://twitter.com/johndoe
   Bio: "Tech enthusiast"
   Tweets: 1,234 | Followers: 500

[... additional platforms ...]

❌ NOT FOUND ON:
• Facebook, LinkedIn, Instagram (username available)

⚠️ UNCERTAIN:
• TikTok (profile private)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-username (MuninnDB group | local findings file)
```

## Tools Used
- Sherlock-style username checking
- Browser automation (if available) for dynamic pages
- Memory adapter (SKILL.md) for storage

## Ethical Notes
- Only access publicly available profiles
- Respect rate limits
- Do not attempt to bypass privacy settings
