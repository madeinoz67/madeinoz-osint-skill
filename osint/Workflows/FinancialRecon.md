# Financial Reconnaissance Workflow

Investigate company financial health, SEC filings, funding, and investor information.

## Trigger Phrases
- "financial recon"
- "company financials"
- "SEC filings"
- "funding history"
- "investor info"
- "revenue"
- "financial health"
- "company valuation"

## Input
- `company`: Company name or ticker symbol
- `public` (optional): Whether company is publicly traded (auto-detect if not specified)
- `years` (optional): How many years of history (default: 5)

## Process

### Step 1: Determine Company Type
```
Identify financial reporting requirements:

Public Company:
- Get CIK number from SEC
- Access full SEC filings
- Stock price history
- Analyst reports

Private Company:
- Crunchbase/PitchBook data
- Press releases for funding rounds
- Estimated revenue from signals
- Private market valuations
```

### Step 2: SEC Filings (Public Companies)
```
Retrieve and analyze key filings:

10-K (Annual Report):
- Financial statements
- Risk factors
- Business description
- Legal proceedings

10-Q (Quarterly Report):
- Quarterly financials
- Recent developments

8-K (Current Report):
- Material events
- Acquisitions/divestitures
- Executive changes

DEF 14A (Proxy Statement):
- Executive compensation
- Board composition
- Shareholder proposals

Forms 3, 4, 5:
- Insider transactions
- Beneficial ownership
```

### Step 3: Funding & Investment Data (Private Companies)
```
Track funding history:
- Seed rounds
- Series A, B, C, etc.
- Lead investors
- Participating investors
- Valuation at each round
- Terms (if disclosed)
- Secondary transactions
```

### Step 4: Revenue & Financial Metrics
```
Gather financial indicators:

For Public:
- Revenue/earnings from filings
- Gross margin
- Operating margin
- Cash position
- Debt levels
- Key financial ratios

For Private:
- Estimated ARR (from job postings, press)
- Funding efficiency
- Burn rate estimates
- Growth signals
```

### Step 5: Investor Analysis
```
Profile key investors:
- Investor type (VC, PE, strategic, angel)
- Investment thesis
- Portfolio companies
- Board seats
- Follow-on investments
```

### Step 6: Financial Health Assessment
```
Evaluate overall health:
- Growth trajectory
- Path to profitability
- Cash runway
- Debt burden
- Red flags (going concern, audit issues)
```

### Step: Store Findings (Memory Adapter)

Store each finding via the memory adapter (SKILL.md § Memory Adapter), group "osint-financial". Path 1 stores one `muninn_remember` per finding (atomic, entity names in [[brackets]], tags `["osint-financial", "osint"]`); Path 2 appends each finding to `./osint-findings/osint-financial.md`.

```
Store the following findings (one memory/entry each):

1. Funding History:
   - Label: "Funding: {company_name}"
   - Data: Each round with date, amount, valuation, lead investor
   - Group: "osint-financial"

2. Investor Profiles:
   - For each significant investor:
   - Label: "Investor: {investor_name}"
   - Data: Type, investment amount, board seat, other portfolio companies
   - Relationships: invested_in, board_member_of (muninn_link relates_to)

3. Financial Metrics:
   - Label: "Metrics: {company_name}"
   - Data: Revenue (actual or estimated), growth rates, margins, cash position
   - Confidence levels for each metric
   - Temporal metadata (as of date)

4. SEC Filings (if public):
   - Label: "SEC: {company_name}"
   - Data: Key filing summaries, material events, insider transactions
   - Links to source filings

5. Financial Health Score:
   - Label: "Health: {company_name}"
   - Data: Overall assessment, growth signals, caution signals, red flags
   - Confidence level and assessment date
```

## Output Format

```
📋 FINANCIAL RECONNAISSANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 COMPANY: Acme Corporation
📅 REPORT DATE: 2026-01-10
🏷️ TYPE: Private (Series C)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 FUNDING HISTORY:

┌────────────┬────────────┬─────────────────────┬─────────────┐
│ Round      │ Date       │ Amount              │ Valuation   │
├────────────┼────────────┼─────────────────────┼─────────────┤
│ Seed       │ 2015-06    │ $2M                 │ $8M         │
│ Series A   │ 2017-02    │ $10M                │ $40M        │
│ Series B   │ 2019-08    │ $25M                │ $150M       │
│ Series C   │ 2022-03    │ $50M                │ $500M       │
└────────────┴────────────┴─────────────────────┴─────────────┘

Total Raised: $87M
Latest Valuation: $500M (10x revenue multiple)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 INVESTOR BREAKDOWN:

Lead Investors:
┌─────────────────────┬────────────┬────────────────┐
│ Investor            │ Round      │ Board Seat     │
├─────────────────────┼────────────┼────────────────┤
│ Seed Angels LLC     │ Seed       │ Observer       │
│ First VC Partners   │ Series A   │ Yes            │
│ Growth Capital Fund │ Series B   │ Yes            │
│ Global Ventures     │ Series C   │ Yes            │
└─────────────────────┴────────────┴────────────────┘

Participating Investors:
• Strategic Corp Ventures (Series B, C)
• Tech Angels Syndicate (Seed, A)
• Industry Growth Partners (Series C)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ESTIMATED FINANCIALS:

Revenue (Estimated ARR):
┌──────────┬─────────────┬─────────────┐
│ Year     │ ARR (Est.)  │ Growth      │
├──────────┼─────────────┼─────────────┤
│ 2022     │ $15M        │ -           │
│ 2023     │ $25M        │ 67%         │
│ 2024     │ $40M        │ 60%         │
│ 2025     │ $55M        │ 38%         │
└──────────┴─────────────┴─────────────┘

Evidence Sources:
• Job postings mention "50M ARR company"
• Press release: "doubled revenue in 2023"
• LinkedIn employee count trajectory

Key Metrics (Estimated):
• Gross Margin: 75-80% (typical SaaS)
• CAC Payback: 12-18 months
• Net Revenue Retention: 110-120%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏦 FINANCIAL HEALTH INDICATORS:

Cash Position:
• Last Raise: $50M (March 2022)
• Estimated Burn: $3-4M/month
• Runway: 18-24 months (if not profitable)

Growth Signals:
✅ Consistent YoY revenue growth
✅ Expanding team (50 → 250 employees)
✅ New office openings (UK, EU)
✅ Enterprise customer wins

Caution Signals:
⚠️ Growth rate slowing (67% → 38%)
⚠️ High burn rate relative to revenue
⚠️ No profitability announcement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 FOR PUBLIC COMPANIES (Example):

SEC Filing Analysis (ACME ticker):

10-K Summary (FY 2025):
• Revenue: $500M (+15% YoY)
• Net Income: $45M (+8% YoY)
• Cash: $120M
• Debt: $50M
• Employees: 1,200

Key Risk Factors:
1. Customer concentration (top 3 = 40%)
2. International expansion challenges
3. Competitive pressure

Insider Transactions (90 days):
┌─────────────────┬───────────┬───────────┬───────────┐
│ Name            │ Type      │ Shares    │ Value     │
├─────────────────┼───────────┼───────────┼───────────┤
│ CEO Jane Smith  │ Sale      │ 10,000    │ $250,000  │
│ CFO S. Johnson  │ Purchase  │ 5,000     │ $125,000  │
│ Board M. Chen   │ Sale      │ 2,000     │ $50,000   │
└─────────────────┴───────────┴───────────┴───────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ FINANCIAL RED FLAGS: None Identified

Overall Financial Health: GOOD
Confidence: MEDIUM (private company estimates)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 Stored via memory adapter: osint-financial (MuninnDB group | local findings file)
```

## Data Sources

### Public Company Data
- **SEC EDGAR**: 10-K, 10-Q, 8-K, DEF 14A, Forms 3/4/5
- **Stock Exchanges**: Price data, market cap
- **Financial Data Providers**: Yahoo Finance, Google Finance

### Private Company Data
- **Crunchbase**: Funding rounds, investors, valuations
- **PitchBook**: Detailed private company data
- **Press Releases**: Funding announcements
- **Job Postings**: Revenue signals, growth indicators

### Estimation Techniques
- Employee count to revenue ratios
- Industry benchmarks
- Funding efficiency analysis
- Press release claims

## Tools & APIs Used
- SEC EDGAR Full Text Search
- Crunchbase API
- OpenCorporates (for subsidiary data)
- Yahoo Finance API
- Web scraping (press releases)

## Ethical Notes
- Use only publicly disclosed financial information
- Clearly mark estimates vs. confirmed data
- Do not access proprietary financial databases without authorization
- Note confidence levels on all estimates
- Respect material non-public information restrictions
