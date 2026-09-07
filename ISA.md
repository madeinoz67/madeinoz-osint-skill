---
task: "ImageRecon pinned-agent prototype — generated agents, allowlists, dual-path CI"
slug: 20260907-093000_imagerecon-pinned-agent-prototype
project: madeinoz-osint-skill
phase: climbing
progress: 13/15
started: 2026-09-07T09:30:00+08:00
updated: 2026-09-07T15:05:00+08:00
principal_stated_goal: "should we be using specific claude agents with the relevant skills for this skill"
principal_stated_goal_source: prompt
principal_stated_goal_signal: 4
principal_stated_goal_locked: 2026-09-07T09:30:00+08:00
context_sufficient: true
interview_invoked: false
---

## Problem

The skill's dispatch contract (v2.1.0) composes a persona block from `AgentProfiles.yaml` onto a generic subagent for every workflow. Three costs, one of them a security exposure on a publicly distributed skill:

1. **Token waste + drift** — every dispatch re-sends persona text; the main session paraphrases the persona each time, so repeated dispatches are not deterministic (Council R1, Dario).
2. **Unreliable tool discovery** — "use whatever web/search tools this session provides" leaves generic agents fumbling Bright Data and the bun forensics utilities.
3. **Injection blast radius** — OSINT collection agents read attacker-controlled text by definition (scraped profiles, EXIF payloads); a generic agent holds every host tool, so one embedded "run this / write this" instruction is a session-level compromise. A persona block is a suggestion; a pinned agent's tool allowlist is a boundary (Council R2, Inés).

The plugin packaging (v2.1.0) can ship pinned agent definitions; it ships none. The symlink install never will — skills don't transport agent types.

## Vision

A user installs the plugin and ImageRecon dispatch runs as a pinned, least-privilege `osint-verifier` agent — deterministic persona, allowlisted tools, findings returned to the main session — while a symlink install gets byte-identical behavior to v2.1.0 via the documented persona fallback. CI proves both paths on every PR, and a poisoned-EXIF fixture proves the tool boundary structurally. Euphoric surprise: the principal ships a public skill and the injection surface he was distributing is gone — replaced by a boundary CI enforces — and nothing about the plain-skill install changed.

## Out of Scope

- **No rollout beyond ImageRecon.** The other 16 workflows keep the current contract; rollout is gated on the prototype's measured metrics (Council R2, Tomás). Recording roll-out decisions is a future run.
- **No model pinning.** Agent frontmatter pins tools, not models (native inheritance).
- **No release/tag.** Version bump lands in-tree; tagging v2.2.0 and publishing is the principal's call (consistent with the held v2.0.0 tag).
- **No changes to persona content.** `AgentProfiles.yaml` traits/voices/mappings are the source of truth and are not edited (except: a tools field may be ADDED per persona — additive schema, no semantic edits).
- **No behavioral model-in-loop corpus.** Deferred as fog (see Not yet specified); the structural fixture is the merge gate.
- **No new persistence path.** Findings still flow only through the memory adapter (SKILL.md § Memory Adapter), now centralized in the main session.

## Principles

- **Allowlists are boundaries; personas are suggestions.** Enforcement lives in agent frontmatter, never in prompt prose. (Council, unanimous)
- **Portability is the product.** Two install doors, both must work; the recommended door must be the gated one, not the ungated one. (Council, Priya)
- **One source of truth.** Agent definitions are generated from `AgentProfiles.yaml` — one definition, two projections; never hand-maintained twice. (Council, Priya + Tomás independently)
- **Every optional layer degrades gracefully** — the project's own invariant; the agent layer must obey it or not ship.
- **Hardening-plus-disclosure, not a fix.** Residual risk on the symlink door is documented, not silently assumed away. (Council, Tomás)

## Constraints

- Plain-skill (symlink) behavior is byte-compatible with v2.1.0: persona fallback is permanent, not transitional.
- Generated artifacts (`agents/*.md`) are committed and CI diff-gated: regeneration in CI must produce zero diff.
- Plugin version lives in `.claude-plugin/plugin.json` ONLY; on bump, version strings align across README, package.json, INSTALL.md/VERIFY.md titles.
- Repo toolchain: bun + TypeScript; CI (`.github/workflows/ci.yml`) stays green on all existing jobs.
- The dispatch probe is a static capability check (agent types listed in session context) — never a caught mid-run dispatch failure.
- Collection agents get no persistence tools; `muninn_*` and Write-class tools are held by the main session, which runs the memory adapter.
- Work lands on a feature branch; main is touched only after CI green on both paths. Release/tag is principal-gated.

## Goal

"Should we be using specific claude agents with the relevant skills for this skill" — resolved conditionally-yes by council (4-0), ratified "go" 2026-09-07. Done means: the plugin ships six agent definitions generated from `AgentProfiles.yaml` with least-privilege tool allowlists; SKILL.md documents one probe-and-fallback dispatch contract wired to ImageRecon only; CI proves both install paths plus a structural poisoned-EXIF boundary fixture; and the docs disclose the fallback as a degraded security posture. Rollout beyond ImageRecon stays explicitly gated on this prototype's metrics.

## Not yet specified

- fog: Does a model-in-loop red-team corpus (poisoned payloads run against both modes, counting escalation attempts) add signal beyond the structural allowlist assertion, and can it run cheaply enough to keep out of the per-PR gate? — resolves after the structural fixture exists and its coverage can be compared.
- fog: Can ImageRecon's Bash requirement be narrowed (scoped command surface for the bun forensics tools) so `osint-verifier` ships without general command execution, or is Bash-with-disclosure the honest ceiling for this prototype? — resolves when the fixture demonstrates what Bash actually gates.

## Test Strategy

| isc | type | check | threshold | tool | anchors_to |
|---|---|---|---|---|---|
| ISC-1 | build | regenerating agents in CI yields zero diff | 0 changed files | CI job: `bun run generate:agents` + `git diff --exit-code agents/` | principal_stated_goal (one source of truth) |
| ISC-2 | release | version strings aligned across plugin.json, package.json, README, INSTALL/VERIFY | all == 2.2.0 | grep script / bun test | repo convention (version homes) |
| ISC-3 | regression | existing gates green (lint, typecheck, test, OSINT skill validation, legacy-residue grep) | 0 failures | CI on feature branch | principal_stated_goal (plain path unchanged) |
| ISC-4 | build | generator emits 6 definitions with valid frontmatter (name, description, tools) | 6/6 parse | `bun test` (generator unit test) | principal_stated_goal |
| ISC-5 | parity | generated agent body persona block matches AgentProfiles.yaml persona content | byte-identical projection | `bun test` (projection parity test) | principal_stated_goal (one source) |
| ISC-6 | packaging | plugin bundles agents/; manifests valid per existing CI plugin gates | gates pass | CI plugin validation step | principal_stated_goal (plugin path) |
| ISC-7 | doc | SKILL.md § Agent Dispatch documents both branches + mode logging | both branches present | grep on SKILL.md | council spec |
| ISC-8 | e2e | pinned mode fires: plugin-installed host dispatches ImageRecon to osint-verifier | mode log says pinned | CI headless claude + plugin | council spec (parity gate) |
| ISC-9 | e2e | fallback mode fires when agent types absent: inline persona composed | mode log says fallback | CI unit/e2e missing-agent branch | council spec (graceful) |
| ISC-10 | regression | other 16 workflows' dispatch rows unchanged vs v2.1.0 | diff limited to probe contract + ImageRecon row | git diff on SKILL.md | principal_stated_goal |
| ISC-11 | security | all 6 definitions' tools exclude Write/Edit/NotebookEdit and any muninn_* / persistence tool | 0 violations | `bun test` (allowlist static assertion) | council spec (boundary) |
| ISC-12 | security | poisoned-EXIF fixture: payload instructing file-write cannot be acted on by pinned osint-verifier | structural: boundary holds | `bun test` (fixture + frontmatter assertion) | council spec (Inés/Tomás) |
| ISC-13 | security | Anti: no collection agent holds a persistence path — findings return to main session | 0 persistence grants | grep across agents/ | council spec |
| ISC-14 | doc | SKILL.md marks persona fallback as degraded security posture | statement present | grep on SKILL.md | council spec (disclosure) |
| ISC-15 | doc | INSTALL.md + README disclose two-tier posture + Bash residual risk | statements present | grep on docs | council spec (disclosure) |

## Features

### F0 · Cross-cutting — CI, versioning, regression floor
Why: the prototype's whole value is that both doors stay provably intact; without the CI parity spine the agent layer is ungated surface.

- [x] ISC-1: CI regenerates `agents/` and fails on any diff (generator output is committed truth).
- [x] ISC-2: Version 2.2.0 aligned across all four version homes.
- [x] ISC-3: Anti: every existing CI gate stays green; no regression to v2.1.0 behavior.

### F1 · Generated agent definitions
Why: six personas become deterministic, allowlisted agent types via a generator — the single-source move that retires the drift and token objections at once.

- [x] ISC-4: `src/tools/generate-agents.ts` (bun) emits `osint-collector/linker/auditor/shadow/analyst/verifier` with valid frontmatter from AgentProfiles.yaml.
- [x] ISC-5: The generated body's persona block is a byte-parity projection of the YAML persona (one definition, two projections).
- [x] ISC-6: The plugin bundles `agents/`; existing manifest gates pass.

### F2 · Probe-and-fallback dispatch contract
Why: one documented contract replaces per-dispatch improvisation — prefer pinned types when the session lists them, else compose the inline persona, and log which mode fired so silent fallback cannot hide.

- [x] ISC-7: SKILL.md § Agent Dispatch states the static probe, both branches, and mode logging.
- [ ] ISC-8: With the plugin installed, ImageRecon dispatch fires pinned mode (CI, real host).
- [ ] ISC-9: Without agent types present, ImageRecon dispatch fires persona fallback (CI).
- [x] ISC-10: Anti: the other 16 workflows' dispatch rows are untouched.

### F3 · Security boundary and fixture
Why: the allowlist is the actual deliverable — enforcement, not suggestion — and the fixture is its falsifier.

- [x] ISC-11: Static assertion: all six tools lists exclude Write/Edit/NotebookEdit and persistence tools.
- [x] ISC-12: Poisoned-EXIF fixture proves the payload's file-write and memory-persistence instructions are unactable through the verifier's file/memory tools, and that the Bash-mediated residual (command execution, incl. file writes via shell) is disclosed in README + INSTALL. [reworded 2026-09-07 — the original closed wording overclaimed the boundary for the one Bash-holding agent; Max second-look finding HIGH-1]
- [x] ISC-13: Anti: no collection agent holds `muninn_*`, Write, or any persistence path; the memory adapter runs in the main session.

### F4 · Disclosure
Why: two tiers that behave differently must say so — the symlink door's residual risk is documented, never assumed away.

- [x] ISC-14: SKILL.md documents the fallback as degraded security posture.
- [x] ISC-15: INSTALL.md + README disclose the two-tier posture and the Bash residual risk.

## Decisions

- 2026-09-07 09:30 — Council (Priya/Dario/Inés/Tomás, 3 rounds collapsed to 2) resolved the motion 4-0 conditional: plugin path ships pinned agents generated from AgentProfiles.yaml; plain-skill path keeps inline personas permanently; probe-and-fallback dispatch; dual-path CI; ImageRecon prototype first; rollout gated on prototype metrics. Principal ratified "go".
- 2026-09-07 09:30 — principal_stated_goal is the council motion (the goal-bearing literal); "go" alone fails the minimum-content rule and is recorded here as ratification, not as the goal.
- 2026-09-07 09:30 — Persistence centralized: collection agents return findings; the MAIN session runs the memory adapter. Simplifies every allowlist and matches Inés's auditor-holds-persistence shape.
- 2026-09-07 09:30 — Bash decision: `osint-verifier` keeps Bash (forensics tools require it) with the residual command-execution risk disclosed in docs (ISC-15); narrowing the Bash surface is fog, not a blocker. Hardening-plus-disclosure framing per Tomás.
- 2026-09-07 09:30 — Behavioral red-team corpus deferred to fog: structural assertion (ISC-11/12) is the merge gate; the corpus is an extended, non-blocking suite if it earns its cost.
- 2026-09-07 09:30 — Branch strategy: feature branch, CI green on both paths before main; release/tag principal-gated (v2.0.0 tag precedent).
- 2026-09-07 10:05 — Shared working-vault mode (principal ask) evaluated, NOT in prototype scope: T1 = orchestrator-minted `wf-osint-<slug>` vault as agent-shared scratch (vault param; canonical archive at close; prompt-level scoping disclosed), T2 = second muninndb MCP instance authenticated with the minted `cap_` token (credential-scoped; injection lands in disposable vault), T3 = claim/lease lead queue + Hebbian (#597 vision). Deferred to Remaining Work — gated on rollout metrics.

- 2026-09-07 15:05 — Second look (Max, fresh-context top-rung, read-only) returned FIX-FIRST; all findings dispositioned. ADOPTED+FIXED: HIGH-1 claim-sentence overclaim (verifier's Bash residual carved into SKILL.md security posture, ISC-12 reworded, fixture test retitled); HIGH-2 silent-fallback shape (pinned-dispatch example with exact type string + "on dispatch error: stop and report, never fall back mid-run" rule added to the contract); MEDIUM-4 pre-existing broken symlink path in SKILL.md:14; LOW-5 VERIFY.md validate-sentence corrected + marketplace top-level description added (--strict now passes, probed); LOW-6 tools allowlist moved into AgentProfiles.yaml per-persona (generator validates the invariant loudly); LOW-7 INSTALL "nothing else ships" reworded. ACCEPTED: MEDIUM-3 (deferral load-bearing — merge remains principal-gated; version 2.2.0 stays in-tree until push). NOTED: INFO-8 zero-diff untracked-file hole closed by the ==6 count assert; INFO-9 fixture not circular (property test on committed artifacts). Unverified-offline items stay parked under the ISC-8/9 decision.
- 2026-09-07 15:05 — Remediation commit: regenerated agents/ (tools from YAML + residual-aware standing instructions), gates 25/0 green, claude plugin validate --strict passes.
## Remaining Work

- [ ] Shared working-vault memory mode (MuninnDB `wf-osint-*` vaults as live investigation scratch for parallel agents) — waits on prototype rollout metrics; tiered design in Decisions 2026-09-07 (T1 parameter-scoped scratch, T2 cap_-scoped MCP instance, T3 claim/lease queue).

## Verification

- ISC-7: grep skills/osint/SKILL.md — "Pinned mode"/"Persona mode"/"Probe once"/mode tags, 6 matches (branch feat/imagerecon-pinned-agents)
- ISC-10: git diff skills/osint/SKILL.md — 13+/3−, all within § Agent Dispatch; mapping table + Intent Routing untouched
- ISC-14: grep "degraded security posture" skills/osint/SKILL.md — 1 match; 193 lines (< 500 CI gate)
- ISC-4: bun run test (CI=true) 21 pass / 0 fail — six agents/osint-*.md generated, frontmatter valid; osint-verifier spot-checked (comma-string tools)
- ISC-5: generate-agents.test.ts projection-parity pass — persona block verbatim from AgentProfiles.yaml (455 expect calls in suite)
- ISC-11: allowlist tests pass — all six ⊆ {Read, Grep, Glob, WebSearch, WebFetch, Bash}; Bash only in osint-verifier
- ISC-13: persistence-exclusion test pass — no Write/Edit/NotebookEdit/Task/mcp__ in any committed definition
- ISC-1: local zero-diff gate green — regenerate vs staged agents/ byte-identical; CI agent-definitions job added (commit 417a04a)
- ISC-2: grep 2.2.0 — plugin.json, package.json, README (frontmatter/H1/changelog), INSTALL.md:1, VERIFY.md:1
- ISC-3: bun run lint / typecheck / test (CI=true) all green locally — 25 pass / 0 fail; GitHub runner proof at push
- ISC-6: agents/ at plugin root (marketplace source ./) + CI frontmatter validation + claude plugin validate step
- ISC-12: poisoned-exif-fixture.test.ts 4/4 — real JPEG (sharp-decoded), payload verbatim, persistence instructions structurally unactable, Bash residual asserted disclosed
- ISC-15: Security posture sections at README:285 + INSTALL:39; content asserted by passing fixture test
