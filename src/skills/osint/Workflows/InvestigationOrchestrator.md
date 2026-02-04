# Investigation Orchestrator Workflow

Iterative, pivot-driven OSINT investigation that automatically expands collection as new intelligence is discovered.

## Trigger Phrases
- "investigate"
- "full investigation"
- "deep dive"
- "recursive OSINT"
- "follow the leads"
- "pivot investigation"

## Input
- `target`: Primary identifier (username, email, domain, company name, or phone)
- `target_type` (optional): person, company, domain, infrastructure (auto-detected if not provided)
- `max_depth` (optional): Maximum pivot hops (default: 2)
- `max_entities` (optional): Maximum entities before stopping (default: 50)
- `scope` (optional): narrow, standard, wide (default: standard)
- `pivot_types` (optional): all, or list of specific types to follow
- `require_approval` (optional): Ask before each expansion (default: false)

---

## REQUIRED: Main Agent as Orchestrator Pattern

**The MAIN CLAUDE CODE AGENT acts as the orchestrator - NOT a subagent.**

### Why Main Agent Must Orchestrate

| Pattern | Works? | Reason |
|---------|--------|--------|
| Main agent spawns parallel collectors | ✅ YES | Task tool supports multiple parallel calls |
| Subagent spawns nested subagents | ❌ NO | Causes "Invalid tool parameters" errors |
| Single agent does all collection | ⚠️ SLOW | No parallelization |

### Correct Orchestration Flow

```
MAIN AGENT (Claude Code)
├── Phase 1: Spawn initial collection agents (PARALLEL)
│   ├── Task: UsernameRecon Agent
│   ├── Task: SocialCapture Agent
│   └── Task: DomainRecon Agent (if applicable)
│
├── Phase 2: Consolidate results, detect pivots
│   └── (Main agent analyzes all agent outputs)
│
├── Phase 3: Present pivots to user (interactive mode)
│   └── (Main agent uses AskUserQuestion or text prompt)
│
├── Phase 4: Spawn expansion agents (PARALLEL)
│   ├── Task: EmailRecon Agent (pivot 1)
│   ├── Task: DomainRecon Agent (pivot 2)
│   └── Task: CompanyProfile Agent (pivot 3)
│
└── Phase 5: Synthesize and report
    └── Task: IntelReport Agent (or main agent generates)
```

### Spawning Parallel Agents (CRITICAL)

When expanding on multiple pivots, the main agent MUST:

1. **Run AgentFactory for each pivot** to get proper trait/voice mapping
2. **Send a single message with multiple Task tool calls** for parallel execution

```
<example>
User approves: "pursue 1,2,3"

Step 1: Generate agents via AgentFactory (can run in parallel via Bash)
┌─────────────────────────────────────────────────────────────────────────┐
│ bun run AgentFactory.ts --traits "intelligence,technical,systematic"   │
│   --task "Domain recon for X" --output json                            │
│                                                                         │
│ bun run AgentFactory.ts --traits "intelligence,analytical,systematic"  │
│   --task "PGP analysis for Y" --output json                            │
│                                                                         │
│ bun run AgentFactory.ts --traits "intelligence,business,synthesizing"  │
│   --task "Company profile for Z" --output json                         │
└─────────────────────────────────────────────────────────────────────────┘

Step 2: Spawn agents using generated prompts (single message, parallel)
┌─────────────────────────────────────────────────────────────────────────┐
│ Task 1: prompt=[AgentFactory output for domain]                        │
│ Task 2: prompt=[AgentFactory output for PGP]                           │
│ Task 3: prompt=[AgentFactory output for company]                       │
│                                                                         │
│ All three run IN PARALLEL and return results together.                 │
└─────────────────────────────────────────────────────────────────────────┘
</example>
```

### Pivot Type → Traits Mapping

| Pivot Type | Traits | Expected Voice |
|------------|--------|----------------|
| DomainRecon | `intelligence,technical,systematic` | Authoritative |
| EmailRecon | `intelligence,analytical,systematic` | Professional |
| CompanyProfile | `intelligence,business,synthesizing` | Professional |
| UsernameRecon | `intelligence,analytical,exploratory` | Sophisticated |
| SocialCapture | `intelligence,meticulous,thorough` | Sophisticated |
| InfraMapping | `intelligence,technical,thorough` | Authoritative |
| RiskAssessment | `intelligence,security,skeptical` | Intense |
| PGP/Crypto | `intelligence,analytical,systematic` | Professional |

### What is FORBIDDEN

| Action | Why It's Wrong |
|--------|----------------|
| Subagent spawning subagents | Task tool fails with "Invalid tool parameters" |
| Sequential agent spawning | Wastes time, should be parallel |
| Main agent doing all collection directly | Misses voice notifications, no parallelization |

---

## Investigation State Model

```typescript
interface InvestigationState {
  // Target information
  original_target: string;
  target_type: 'person' | 'company' | 'domain' | 'infrastructure';

  // Progress tracking
  current_depth: number;
  max_depth: number;

  // Entity management
  discovered_entities: Entity[];
  investigated_entities: Set<string>;  // Already processed
  pivot_queue: Pivot[];                 // Pending expansion

  // Configuration
  scope: 'narrow' | 'standard' | 'wide';
  max_entities: number;
  pivot_types_allowed: PivotType[];
  require_approval: boolean;

  // Results
  findings: Finding[];
  relationships: Relationship[];
  confidence_scores: Map<string, number>;
}

interface Entity {
  id: string;
  type: EntityType;
  value: string;
  source_agent: string;
  discovered_at_depth: number;
  confidence: number;
  metadata: Record<string, any>;
}

interface Pivot {
  from_entity: string;
  to_entity: Entity;
  pivot_type: PivotType;
  priority: 'high' | 'medium' | 'low';
  depth: number;
}

type EntityType =
  | 'username' | 'email' | 'phone' | 'domain'
  | 'real_name' | 'company' | 'ip_address'
  | 'social_profile' | 'image' | 'location';

type PivotType =
  | 'username_to_email'      // Found email in username profile
  | 'username_to_name'       // Found real name
  | 'username_to_company'    // Found employer/business
  | 'username_to_domain'     // Found personal domain
  | 'email_to_domain'        // Domain from email address
  | 'email_to_breach'        // Breach data reveals more
  | 'email_to_social'        // Social accounts linked to email
  | 'domain_to_person'       // WHOIS reveals registrant
  | 'domain_to_company'      // Domain owned by company
  | 'company_to_person'      // Key personnel discovered
  | 'company_to_domain'      // Company domains found
  | 'social_to_social'       // Cross-platform profile links
  | 'image_to_location'      // EXIF reveals location
  | 'name_to_records'        // Public records search
  | 'phone_to_identity';     // Phone reveals identity
```

---

## Process

### Phase 1: Initialization

```
🗣️ Orchestrator: Initializing investigation for {target}.

1. Detect target type (if not provided):
   - Contains @ → likely email or social handle
   - Contains domain pattern → domain
   - Matches phone pattern → phone
   - Otherwise → username or name

2. Initialize state:
   - Set original_target
   - Set max_depth (default: 2)
   - Set max_entities (default: 50)
   - Set scope (default: standard)
   - Initialize empty collections

3. Add original target to pivot_queue at depth 0

🗣️ Orchestrator: Target classified as {target_type}. Beginning collection phase.
```

### Phase 2: Initial Collection (Depth 0)

**Spawn collection agents IN PARALLEL based on target type:**

#### For Person (username/email/name):
```
Parallel spawn:
├── UsernameRecon Agent (if username provided)
├── EmailRecon Agent (if email provided)
├── SocialCapture Agent
└── PhoneRecon Agent (if phone provided)
```

#### For Company:
```
Parallel spawn:
├── CorporateStructure Agent
├── FinancialRecon Agent
├── DomainRecon Agent
├── RiskAssessment Agent
└── CompetitorAnalysis Agent
```

#### For Domain:
```
Parallel spawn:
├── DomainRecon Agent
├── InfraMapping Agent
└── WHOIS Analysis (inline)
```

#### For Infrastructure:
```
Parallel spawn:
├── InfraMapping Agent
├── DomainRecon Agent (reverse DNS)
└── Service Fingerprinting (inline)
```

### Phase 3: Pivot Detection

**After each agent completes, analyze output for new entities:**

```
🗣️ Orchestrator: Analyzing findings for pivot opportunities.

For each agent_output:
  1. Extract entities from structured output:
     - Look for emails, usernames, domains, names, companies, phones
     - Parse from profile data, WHOIS, breach data, etc.

  2. For each extracted entity:
     a. Check: Already in discovered_entities? → Skip
     b. Check: In scope? (based on scope setting)
        - narrow: Only directly related to original target
        - standard: First-degree connections
        - wide: Any discovered entity
     c. Check: Pivot type allowed? → Check pivot_types_allowed
     d. Check: Depth limit reached? → Flag for manual review

  3. If valid pivot:
     - Add to discovered_entities
     - Add to pivot_queue with appropriate priority
     - Log pivot detection

Pivot Priority Assignment:
- HIGH: Same-person indicators (email, username variants, real name)
- MEDIUM: Associated entities (employer, domains, collaborators)
- LOW: Tangential entities (followers, mentioned entities)
```

### Phase 4: Expansion Decision

```
🗣️ Orchestrator: Evaluating expansion. Depth: {current_depth}/{max_depth}, Entities: {count}/{max_entities}

Decision tree:
1. pivot_queue empty?
   → Proceed to Phase 6 (Synthesis)

2. current_depth >= max_depth?
   → Add remaining pivots to deferred_pivots with reason "depth_limit"
   → Proceed to Phase 6 (Synthesis)

3. discovered_entities.length >= max_entities?
   → Add remaining pivots to deferred_pivots with reason "entity_limit"
   → Proceed to Phase 6 (Synthesis)

4. require_approval = true? (Interactive Mode)
   → Present pending pivots to user (see Interactive Pivot Approval below)
   → For each pivot, user can:
     a) PURSUE - Add to active expansion queue
     b) DEFER - Add to deferred_pivots for later
     c) SKIP - Discard (not interested)
   → Continue with approved pivots

5. Otherwise (auto mode):
   → Proceed to Phase 5 (Expand Collection)
```

### Interactive Pivot Approval (when require_approval = true)

When pivots are detected, present them to the user for decision:

```
🗣️ Orchestrator: Found {n} pivot opportunities. Awaiting your direction.

┌─────────────────────────────────────────────────────────────────────────┐
│ PIVOT OPPORTUNITIES DETECTED                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ HIGH PRIORITY:                                                          │
│ [1] Email: john@example.com (from GitHub profile)                       │
│     → Would spawn: EmailRecon (breach check, social correlation)        │
│                                                                         │
│ [2] Real Name: "John Doe" (from LinkedIn)                               │
│     → Would spawn: NameRecon (public records, court records)            │
│                                                                         │
│ MEDIUM PRIORITY:                                                        │
│ [3] Company: "Acme Corp" (employer from LinkedIn)                       │
│     → Would spawn: CompanyProfile (structure, financials, domains)      │
│                                                                         │
│ [4] Domain: johndoe.dev (from Twitter bio)                              │
│     → Would spawn: DomainRecon (WHOIS, DNS, infrastructure)             │
│                                                                         │
│ LOW PRIORITY:                                                           │
│ [5] Mentioned User: @colleague123 (frequent interaction)                │
│     → Would spawn: UsernameRecon                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Options:
  • "pursue 1,2,4" - Investigate these now
  • "defer 3,5"    - Save for later investigation
  • "pursue all"   - Investigate all pivots
  • "defer all"    - Save all for later
  • "done"         - Skip remaining, proceed to synthesis
```

**User Response Handling:**

| Response | Action |
|----------|--------|
| `pursue X` | Add pivot(s) to active queue, spawn agents |
| `defer X` | Add to deferred_pivots with status "user_deferred" |
| `skip X` | Discard pivot, not stored |
| `pursue all` | Process all pending pivots |
| `defer all` | Store all for later |
| `done` | Proceed to synthesis phase |

### Deferred Pivots Data Model

```typescript
interface DeferredPivot {
  id: string;
  entity: Entity;
  pivot_type: PivotType;
  priority: 'high' | 'medium' | 'low';
  discovered_at_depth: number;
  source_entity: string;
  reason: DeferralReason;
  context: string;           // Why this pivot was interesting
  suggested_workflow: string; // Which workflow would investigate this
  deferred_at: Date;
  investigation_id: string;  // Link back to original investigation
}

type DeferralReason =
  | 'depth_limit'      // Max depth reached
  | 'entity_limit'     // Max entities reached
  | 'user_deferred'    // User chose to defer
  | 'out_of_scope'     // Scope setting excluded it
  | 'low_priority';    // Auto-deferred in narrow scope
```

### Phase 5: Expand Collection

```
🗣️ Orchestrator: Expanding investigation. Processing {n} pivots at depth {depth}.

1. Group pending pivots by type for efficient parallel execution:
   - usernames → batch UsernameRecon
   - emails → batch EmailRecon
   - domains → batch DomainRecon
   - companies → batch CompanyProfile
   - etc.

2. Spawn collection agents for each group (parallel within groups)

3. Increment current_depth

4. Wait for all agents to complete

5. Return to Phase 3 (Pivot Detection)
```

### Phase 6: Correlation & Linking

```
🗣️ Orchestrator: Collection complete. Beginning correlation phase.

1. Execute EntityLinking workflow:
   - Input: All discovered_entities
   - Output: Confirmed links, probable links, link matrix

2. Execute TimelineAnalysis workflow:
   - Input: All temporal data from findings
   - Output: Activity patterns, time zones, anomalies

3. Update confidence_scores based on correlation results

4. Store all entities and relationships to Knowledge Graph:
   - Group: "osint-investigation-{id}"
   - Include pivot chains for audit trail
```

### Phase 7: Synthesis

```
🗣️ Orchestrator: Synthesizing findings into comprehensive profile.

Based on target_type, execute appropriate synthesis workflow:

For Person:
  → Execute TargetProfile workflow with all discovered data

For Company:
  → Execute CompanyProfile workflow with all discovered data

For Domain/Infrastructure:
  → Execute custom synthesis combining DomainRecon + InfraMapping outputs
```

### Phase 8: Intelligence Report

```
🗣️ Orchestrator: Generating final intelligence report.

Execute IntelReport workflow with:
- All findings from collection phase
- Correlation results from Phase 6
- Synthesis output from Phase 7
- Pivot chain documentation (investigation trail)
- Confidence matrix for all assertions

Include special sections:
- Investigation Summary (depth reached, entities discovered, pivots followed)
- Pivot Trail (how each entity was discovered)
- Unexplored Leads (pivots not followed due to limits)
```

---

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              ITERATIVE OSINT INVESTIGATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INVESTIGATION ID: OSINT-INV-2026-001
REPORT DATE: 2026-01-12
CLASSIFICATION: UNCLASSIFIED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: INVESTIGATION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Original Target: {target}
Target Type: {target_type}
Investigation Scope: {scope}

┌─────────────────────────────────────────────────────────────┐
│ INVESTIGATION METRICS                                       │
├─────────────────────────────────────────────────────────────┤
│ Depth Reached:        {current_depth} / {max_depth}         │
│ Entities Discovered:  {entity_count} / {max_entities}       │
│ Pivots Followed:      {pivots_followed}                     │
│ Pivots Skipped:       {pivots_skipped}                      │
│ Collection Agents:    {agent_count}                         │
│ Investigation Time:   {duration}                            │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2: PIVOT TRAIL (Investigation Path)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Depth 0 (Initial Target):
└── {target} ({target_type})
    │
    ├── Depth 1:
    │   ├── [UsernameRecon] → Found: email@example.com (HIGH)
    │   ├── [UsernameRecon] → Found: "John Doe" (real name) (HIGH)
    │   └── [SocialCapture] → Found: Acme Corp (employer) (MEDIUM)
    │
    └── Depth 2:
        ├── [EmailRecon] → Found: breach exposure (3 records)
        ├── [EmailRecon] → Found: linked accounts (Twitter, GitHub)
        └── [CompanyProfile] → Found: 2 additional domains

Total Pivot Chain: {target} → {email} → {breach_data}
                   {target} → {company} → {domains}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3: DISCOVERED ENTITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────┬────────────────────────┬───────┬────────────┐
│ Type         │ Value                  │ Depth │ Confidence │
├──────────────┼────────────────────────┼───────┼────────────┤
│ Username     │ johndoe                │ 0     │ 100%       │
│ Email        │ john@example.com       │ 1     │ 95%        │
│ Real Name    │ John Doe               │ 1     │ 90%        │
│ Company      │ Acme Corp              │ 1     │ 85%        │
│ Domain       │ johndoe.dev            │ 1     │ 95%        │
│ Social       │ @johndoe (Twitter)     │ 1     │ 95%        │
│ Social       │ jdoe (GitHub)          │ 2     │ 90%        │
│ Domain       │ acme.com               │ 2     │ 80%        │
│ Domain       │ acme.io                │ 2     │ 80%        │
└──────────────┴────────────────────────┴───────┴────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 4: ENTITY RELATIONSHIP GRAPH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        ┌─────────────┐
                        │  Acme Corp  │
                        │  (Company)  │
                        └──────┬──────┘
                               │ employs
                               ▼
        ┌──────────────────────────────────────────┐
        │                                          │
        ▼                                          ▼
┌───────────────┐                          ┌───────────────┐
│ acme.com      │                          │   JOHNDOE     │
│ acme.io       │                          │   (Target)    │
└───────────────┘                          └───────┬───────┘
                                                   │
                    ┌──────────────────────────────┼───────────────────┐
                    │              │               │                   │
                    ▼              ▼               ▼                   ▼
             ┌──────────┐  ┌──────────┐    ┌──────────┐        ┌──────────┐
             │ @johndoe │  │   jdoe   │    │john@     │        │johndoe   │
             │ Twitter  │  │  GitHub  │    │example   │        │.dev      │
             └──────────┘  └──────────┘    └──────────┘        └──────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 5: KEY FINDINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Consolidated findings from all collection agents]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 6: DEFERRED LEADS (Flagged for Future Investigation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following pivots were identified and saved for future investigation:

┌──────────────────────────┬──────────┬─────────────────┬────────────────────────┐
│ Entity                   │ Priority │ Deferral Reason │ Suggested Workflow     │
├──────────────────────────┼──────────┼─────────────────┼────────────────────────┤
│ colleague@acme.com       │ LOW      │ user_deferred   │ EmailRecon             │
│ Project X Repository     │ MEDIUM   │ depth_limit     │ RepositoryRecon        │
│ Mentioned @user123       │ LOW      │ out_of_scope    │ UsernameRecon          │
│ Acme Corp subsidiary     │ MEDIUM   │ entity_limit    │ CompanyProfile         │
└──────────────────────────┴──────────┴─────────────────┴────────────────────────┘

💾 These leads are stored in Knowledge Graph (group: osint-deferred-{investigation_id})

To resume investigation on deferred leads:
  → "Resume investigation OSINT-INV-2026-001, pursue deferred leads"
  → "Investigate deferred pivot colleague@acme.com"

To adjust limits for future investigations:
  - max_depth: {current} → increase for deeper pivot chains
  - max_entities: {current} → increase for broader coverage
  - scope: {current} → 'wide' for maximum discovery

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 7: CONFIDENCE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full confidence matrix for all entity links]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                         END OF REPORT

Generated by PAI OSINT Investigation Orchestrator
💾 Captured to Memory: Yes (group: osint-investigation-{id})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Scope Levels

### Narrow
- Only pursue pivots directly identifying the target
- HIGH priority pivots only
- Best for: Quick identity verification

### Standard (Default)
- Pursue HIGH and MEDIUM priority pivots
- First-degree connections
- Best for: General investigations

### Wide
- Pursue all pivot types
- Multi-hop relationship mapping
- Best for: Comprehensive investigations, threat analysis

---

## Pivot Type Reference

| From Entity | To Entity | Pivot Type | Priority | Collection Agent |
|-------------|-----------|------------|----------|------------------|
| Username | Email | username_to_email | HIGH | EmailRecon |
| Username | Real Name | username_to_name | HIGH | NameRecon |
| Username | Company | username_to_company | MEDIUM | CompanyProfile |
| Username | Domain | username_to_domain | MEDIUM | DomainRecon |
| Email | Domain | email_to_domain | MEDIUM | DomainRecon |
| Email | Breach Data | email_to_breach | HIGH | EmailRecon |
| Email | Social | email_to_social | MEDIUM | SocialCapture |
| Domain | Person | domain_to_person | HIGH | TargetProfile |
| Domain | Company | domain_to_company | MEDIUM | CompanyProfile |
| Company | Person | company_to_person | MEDIUM | TargetProfile |
| Company | Domain | company_to_domain | MEDIUM | DomainRecon |
| Social | Social | social_to_social | MEDIUM | SocialCapture |
| Image | Location | image_to_location | LOW | GeoRecon |
| Name | Records | name_to_records | MEDIUM | RecordsSearch |
| Phone | Identity | phone_to_identity | HIGH | PhoneRecon |

---

## Voice Output Requirements

The orchestrator MUST include voice markers at key phases:

```
🗣️ Orchestrator: Initializing investigation for {target}.
🗣️ Orchestrator: Target classified as {type}. Spawning {n} collection agents.
🗣️ Orchestrator: Collection complete. Found {n} entities, {p} potential pivots.
🗣️ Orchestrator: Expanding investigation. Following {n} high-priority pivots.
🗣️ Orchestrator: Depth {d} complete. {new} new entities discovered.
🗣️ Orchestrator: Depth limit reached. Proceeding to correlation phase.
🗣️ Orchestrator: Correlation complete. {links} confirmed identity links.
🗣️ Orchestrator: Generating final report. Investigation discovered {total} entities across {depth} pivot hops.
```

---

## Example Invocations

**Basic investigation (default settings):**
```
Investigate username "johndoe"
```

**Deep investigation with wide scope:**
```
Deep dive on email john@example.com with max_depth 3 and wide scope
```

**Company investigation with approval:**
```
Investigate Acme Corp with require_approval true
```

**Narrow scope, limited entities:**
```
Quick pivot investigation on domain example.com, narrow scope, max 20 entities
```

---

## Ethical Notes

- All collection uses passive OSINT techniques only
- No active engagement with targets
- Respect depth limits to avoid over-collection
- Document pivot chains for audit trail
- Store confidence levels accurately
- Flag unexplored leads for transparency
- Never pursue pivots into private/protected data

---

## Memory Capture

All investigation data is stored to Knowledge Graph in multiple groups:

### Primary Investigation Group
```
Group: osint-investigation-{investigation_id}

Episodes stored:
1. Investigation Summary
   - Original target, scope, depth, duration
   - Final metrics (entities, pivots, confidence)

2. Each entity discovered
   - Entity details with metadata
   - Pivot chain (how it was discovered)
   - Confidence score and sources

3. All relationships
   - Entity-to-entity links
   - Confidence and evidence

4. Final report
   - Complete investigation report
```

### Deferred Leads Group
```
Group: osint-deferred-{investigation_id}

Episodes stored (for each deferred pivot):
1. Deferred Pivot: {entity_value}
   - Entity type and value
   - Original investigation ID (for resume)
   - Deferral reason
   - Priority level
   - Suggested workflow
   - Context (why it was interesting)
   - Source entity (what led to this)
   - Discovered at depth
```

### Querying Deferred Leads

To find all deferred leads from an investigation:
```
search_memory_facts(
  query: "deferred pivot investigation OSINT-INV-2026-001",
  group_ids: ["osint-deferred-OSINT-INV-2026-001"]
)
```

To find all deferred leads across all investigations:
```
search_memory_nodes(
  query: "deferred pivot OSINT",
  entity: "Procedure"  // Deferred pivots are stored as procedures to follow up
)
```

### Resume Investigation Trigger

When user says "resume investigation" or "pursue deferred leads":
1. Query deferred leads from Knowledge Graph
2. Present list to user for selection
3. Spawn appropriate collection agents
4. Continue with standard pivot detection flow
