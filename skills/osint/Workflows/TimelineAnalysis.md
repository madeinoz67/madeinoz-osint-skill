# Timeline Analysis Workflow

Analyze temporal patterns across collected intelligence data.

## Trigger Phrases
- "timeline analysis"
- "activity patterns"
- "when active"
- "temporal analysis"
- "event timeline"

## Input
- `target`: Entity identifier (username, email, domain)
- `date_range` (optional): Start and end dates

## Process

### Step 1: Gather Temporal Data
```
Query stored intelligence via the memory adapter (Path 1: muninn_recall;
Path 2: read the group findings file) for:
- Account creation dates
- Post/activity timestamps
- Domain registration dates
- Event occurrences
```

### Step 2: Account Lifecycle Analysis
```
Track:
- Account creation date
- First public activity
- Activity milestones
- Periods of inactivity
- Recent activity status
```

### Step 3: Activity Pattern Detection
```
Analyze posting behavior:
- Hour of day distribution
- Day of week distribution
- Monthly trends
- Seasonal patterns
```

### Step 4: Time Zone Inference
```
From activity patterns:
- Most likely time zone
- Work hours vs personal time
- Weekend vs weekday behavior
```

### Step 5: Event Correlation
```
Map activity to known events:
- Industry events
- News events
- Personal milestones
- Platform changes
```

### Step 6: Anomaly Detection
```
Identify unusual patterns:
- Sudden activity spikes
- Extended dormancy periods
- Schedule changes
- Behavioral shifts
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-timeline". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-timeline", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-timeline.md`.

```
Store the following findings (one memory/entry each):

1. Timeline Entity:
   - Label: "Timeline: {target}"
   - Data: Analysis period, account lifecycle milestones
   - Group: "osint-timeline"

2. Activity Patterns:
   - Label: "Patterns: {target}"
   - Data: Hour/day distributions, peak times, posting frequency
   - Inferred time zone with confidence

3. Events:
   - Label: "Events: {target}"
   - Data: Notable events with dates, activity spikes, dormancy periods
   - Possible triggers and correlations

4. Anomalies:
   - Label: "Anomalies: {target}"
   - Data: Detected anomalies with dates, descriptions, possible explanations
   - Temporal metadata

5. Behavioral Profile:
   - Label: "Behavior: {target}"
   - Data: Work patterns, schedule indicators, trend analysis
   - Year-over-year comparisons
```

## Output Format

```
📋 TIMELINE ANALYSIS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TARGET: johndoe
📅 ANALYSIS PERIOD: 2020-01-01 to 2026-01-09

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ACCOUNT LIFECYCLE:

2015 ──●─────────────────────────── Account Created (Twitter)
       │
2016 ──●─────────────────────────── First Public Post
       │
2018 ──●─────────────────────────── GitHub Account Created
       │
2020 ──●─────────────────────────── Domain Registered
       │
2022 ──●─────────────────────────── LinkedIn Profile Found
       │
2026 ──●─────────────────────────── Last Activity (2 hours ago)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ ACTIVITY PATTERNS:

Hour of Day Distribution:
00-06 ░░░░░░░░░░░░░░░░░░░░ 5%
06-12 ████████████████████ 35%
12-18 ██████████████████████████ 45%
18-24 ████████████░░░░░░░░ 15%

Day of Week:
Mon ████████████████ 18%
Tue ██████████████████ 20%
Wed ████████████████████ 22%
Thu ████████████████ 18%
Fri ██████████████ 15%
Sat ██████░░░░░░░░ 5%
Sun ████░░░░░░░░░░ 2%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌍 TIME ZONE INFERENCE:

• Primary Zone: PST/PDT (UTC-8/-7)
• Confidence: 92%
• Evidence:
  - Peak activity: 9am-6pm PST
  - Minimal night activity
  - Weekend pattern suggests US West Coast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 ACTIVITY TRENDS:

Monthly Activity (2025):
Jan ████████████████ 45 posts
Feb ██████████████ 38 posts
Mar ████████████████████ 52 posts
Apr ████████████ 32 posts
May █████████████████ 44 posts
...

Year-over-Year:
2023: 380 posts
2024: 425 posts (+12%)
2025: 482 posts (+13%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ EVENT CORRELATION:

Date       │ Activity           │ Possible Trigger
───────────┼────────────────────┼──────────────────
2024-03-15 │ 25 posts (5x avg)  │ Product launch?
2024-09-22 │ 0 posts (5 days)   │ Conference travel?
2025-01-01 │ Spike in follows   │ New Year networking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ANOMALIES DETECTED:

1. Dormancy Period
   • 2024-06-15 to 2024-07-01 (16 days)
   • Unusual for this user
   • Possible: Vacation, account issue, life event

2. Schedule Shift
   • Before 2024-10: Peak at 2pm PST
   • After 2024-10: Peak at 10am PST
   • Possible: Job change, timezone change

3. Content Type Change
   • 2025+: More retweets, fewer original posts
   • Possible: Changed engagement strategy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 KEY INSIGHTS:

• Consistent weekday professional activity pattern
• Strong indicator of US West Coast location
• Growing engagement year-over-year
• Possible job change in late 2024
• Active and maintained account

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-timeline (MuninnDB group | local findings file)
```

## Pattern Categories

### Work Pattern Indicators
- 9-5 activity suggests employment
- Weekend gaps indicate work/life separation
- Lunch dips may indicate office job

### Personal Pattern Indicators
- Evening/weekend heavy = personal account
- Irregular hours = freelancer/entrepreneur
- Consistent all-day = social media professional

### Geographic Indicators
- Activity timing → time zone
- Holiday patterns → cultural region
- Language timing → regional audience

## Ethical Notes
- Analysis based only on public activity
- Do not track real-time movements
- Respect privacy in interpretations
- Note uncertainty in inferences
