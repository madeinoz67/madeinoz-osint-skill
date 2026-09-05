# Social Media Capture Workflow

Capture and analyze social media profiles, storing intelligence via the memory adapter.

## Trigger Phrases
- "capture social profile"
- "social media intel"
- "profile analysis"
- "social media OSINT"
- "analyze social account"

## Input
- `target`: Username, handle (@user), or profile URL

---

## REQUIRED: Agent Delegation

**This workflow MUST be executed by a specialized OSINT agent via the native agent/Task tool.**

### Spawn Specialist Agent (MANDATORY)

Compose the brief from the matching persona in AgentProfiles.yaml (workflow mapping: SocialCapture → collector), then dispatch natively:

```
Agent/Task tool parameters:
  subagent_type: "general-purpose"
  description: "OSINT social capture for {target}"
  prompt: |
    [Persona block from AgentProfiles.yaml — role, voice, traits]

    Task: Capture and analyze social media profile '{target}' including
    profile data, engagement metrics, and content analysis.
    Workflow: Read <skill-dir>/Workflows/SocialCapture.md and follow it.
    Memory: use the adapter in <skill-dir>/SKILL.md § Memory Adapter,
    group "osint-social".
    Tools: use whatever web/search tools this session provides.
    Escalate back to the main session on judgment calls (legality,
    scope expansion, ambiguous identity) — do not decide alone.

    ## Workflow Instructions
    [Include the Process steps below]

    ## Voice Output Required
    Include 🗣️ Collector: or 🗣️ Analyst: lines at start, key findings, and completion.
```

**Agent Traits:**
- `intelligence` - OSINT expertise and tradecraft
- `meticulous` - Detailed profile data extraction
- `thorough` - Complete content capture

⚠️ **FORBIDDEN: Executing this workflow directly without the agent spawn.**
⚠️ **WHY: Specialist collection belongs in subagents — the main session orchestrates, it does not collect.**

---

## Process

### Step 1: Identify Platform
```
Parse input to determine:
- Platform (Twitter, Instagram, LinkedIn, etc.)
- Username/handle
- Profile URL format
```

### Step 2: Profile Data Collection

**Basic Profile Info:**
- Display name
- Username/handle
- Bio/description
- Profile picture
- Banner/header image
- Location (if provided)
- Website links
- Account creation date (if visible)
- Verification status

**Engagement Metrics:**
- Followers count
- Following count
- Post/tweet count
- Engagement rate (if calculable)

**Content Analysis:**
- Recent posts (last 20-50)
- Posting frequency
- Common topics/hashtags
- Mentioned accounts
- Media types used

### Step 3: Network Analysis
```
Map connections:
- Frequently mentioned accounts
- Reply patterns
- Retweet/share sources
- Tagged accounts in media
```

### Step 4: Temporal Analysis
```
Activity patterns:
- Most active times (hour of day)
- Most active days
- Posting frequency trends
- Account activity timeline
```

### Step 5: Geolocation Indicators
```
Location clues:
- Stated location
- Geotagged posts
- Location mentions in content
- Time zone indicators from posting times
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-social". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-social", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-social.md`.

```
Store the following findings (one memory/entry each):

1. Social Account:
   - Label: "Social: {platform}/{handle}"
   - Data: Display name, bio, location, website, joined date, verified status
   - Group: "osint-social"

2. Engagement Metrics:
   - Label: "Metrics: {platform}/{handle}"
   - Data: Followers, following, post count, engagement rate
   - Temporal metadata for tracking changes

3. Network Connections:
   - Label: "Network: {handle}"
   - Data: Frequently mentioned accounts, top interactions, common hashtags
   - Relationships: mentions, interacts_with, follows (muninn_link relates_to)

4. Activity Pattern:
   - Label: "Activity: {handle}"
   - Data: Most active times, peak days, posting frequency, last active
   - Inferred time zone

5. Content Themes:
   - Label: "Themes: {handle}"
   - Data: Topic breakdown, common subjects, media types used
```

## Output Format

```
📋 SOCIAL MEDIA CAPTURE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TARGET: @johndoe
📱 PLATFORM: Twitter/X
📅 CAPTURE DATE: 2026-01-09

👤 PROFILE:
• Display Name: John Doe
• Handle: @johndoe
• Bio: "Software engineer | Coffee enthusiast | Building cool stuff"
• Location: San Francisco, CA
• Website: johndoe.dev
• Joined: March 2015
• Verified: No

📊 METRICS:
• Followers: 2,500
• Following: 450
• Tweets: 5,234
• Engagement Rate: ~2.3%

🔗 NETWORK:
• Frequently Mentions: @techcompany, @devfriend
• Common Hashtags: #coding, #startup, #javascript
• Top Interactions: @colleague1 (45), @colleague2 (32)

⏰ ACTIVITY PATTERN:
• Most Active: Weekdays 9am-6pm PST
• Peak Day: Tuesday
• Avg Posts/Day: 3.2
• Last Active: 2 hours ago

🌍 LOCATION INDICATORS:
• Stated: San Francisco, CA
• Geotagged Posts: 12 (mostly SF area)
• Time Zone: PST (UTC-8)

📝 CONTENT THEMES:
• Technology (65%)
• Startups (20%)
• Personal (15%)

⚠️ FLAGS:
• Account age: 9+ years (established)
• Engagement appears organic
• No bot indicators detected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-social (MuninnDB group | local findings file)
📸 Screenshots: 3 captured
```

## Platform-Specific Notes

### Twitter/X
- Use public API or scraping
- Capture tweets, retweets, likes (if visible)
- Note rate limits

### Instagram
- Profile must be public
- Stories not capturable without login
- Focus on posts, bio, highlights

### LinkedIn
- Limited without login
- Focus on public profile info
- Company associations

### GitHub
- Rich public data
- Repositories, contributions, stars
- Organization memberships

## Ethical Notes
- Only capture public profiles
- Respect platform rate limits
- Do not attempt to bypass privacy settings
- Store data securely
- Document collection method for audit
