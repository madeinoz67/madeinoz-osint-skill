# OSINT Skill v2.0.0 — Verification Checklist

Run after installation and after any upgrade. Every check names its expected result; a check that cannot run is a FAIL, not a skip.

## 1. Skill structure

```bash
SKILL=~/.claude/skills/osint

# Skill definition present and Claude-native
test -f "$SKILL/SKILL.md" && echo "SKILL.md present"

# Frontmatter is exactly name + description (no legacy triggers array)
python3 -c "
import yaml
meta = yaml.safe_load(open('$SKILL/SKILL.md').read().split('---')[1])
assert sorted(meta.keys()) == ['description', 'name'], meta.keys()
assert meta['name'] == 'osint'
print('frontmatter OK: name + description only')
"

# Line budget (CI enforces < 500)
[ "$(wc -l < "$SKILL/SKILL.md")" -lt 500 ] && echo "SKILL.md under 500 lines"

# All 17 workflows present
ls "$SKILL/Workflows" | wc -l   # expect 17

# Personas parse
python3 -c "import yaml; yaml.safe_load(open('$SKILL/AgentProfiles.yaml')); print('AgentProfiles.yaml valid')"

# Self-contained references
ls "$SKILL/References/"          # expect AGENT_ROLES.md VOICE_MAPPINGS.md KNOWLEDGE_GROUPS.md
```

## 2. Routing smoke test

In a fresh Claude session:

- [ ] "Find all accounts for username johndoe" dispatches UsernameRecon
- [ ] "Deep dive on johndoe, follow the leads" dispatches InvestigationOrchestrator
- [ ] "Company profile Acme Corporation" dispatches CompanyProfile
- [ ] "Check if john@example.com was breached" dispatches EmailRecon

## 3. Memory adapter

- [ ] **Path probe:** with MuninnDB MCP bound, an investigation stores via `muninn_remember` and the finding is retrievable — `muninn_recall` with `tags_any: ["osint-<group>"]` returns it
- [ ] **Fallback:** without MuninnDB, the same investigation appends an entry to `./osint-findings/<group>.md`
- [ ] **Update semantics:** correcting a stored finding uses `muninn_evolve` (no duplicate near-copies in recall)

## 4. Optional backends (only if installed)

- [ ] Bright Data MCP: a scrape request returns markdown (bot-walled source)
- [ ] Browser automation: a screenshot request produces an image file

## 5. Image-forensics tools (optional, repo clone only)

```bash
bun install
bun run lint && bun run typecheck && bun run test
# expect: lint clean, typecheck clean, 15/15 tests
```

## 6. CI parity (repo contributors)

```bash
python3 -c "import yaml; yaml.safe_load(open('skills/osint/AgentProfiles.yaml'))"
grep -q "^name: osint$" skills/osint/SKILL.md && echo "name check OK"
grep -rnE "pa[i]-|PA[I]_DIR|AgentFactor[y]|mcp__pa[i]|knowledge-syste[m]" skills/ src/tools/ docs/ README.md INSTALL.md VERIFY.md CLAUDE.md mkdocs.yml config/ \
  | grep -v docs/investigation | grep -v GRAPHITI_IMPLEMENTATION | grep -v "src/tools/logs"
# expect: zero output (legacy-residue gate; character classes keep this doc itself out of the match set)
```

## 7. Plugin packaging

```bash
python3 - <<'EOF'
import json, re
p = json.load(open('.claude-plugin/plugin.json'))
assert re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', p['name']), 'name must be kebab-case'
assert re.fullmatch(r'\d+\.\d+\.\d+', p['version']), 'semver version required'
m = json.load(open('.claude-plugin/marketplace.json'))
assert m['plugins'][0]['name'] == p['name'], 'marketplace/plugin name mismatch'
assert m['plugins'][0]['source'] == './', 'single-repo plugin sources from ./'
print('plugin manifests OK:', p['name'], p['version'])
EOF
```

If you have the Claude CLI locally: `claude plugin validate .` (add `--strict` in CI-minded runs) — checks the manifests plus SKILL.md frontmatter.

Live install smoke (fresh session):

- [ ] `/plugin marketplace add madeinoz67/madeinoz-osint-skill` succeeds
- [ ] `/plugin install madeinoz-osint@madeinoz-osint-marketplace` succeeds
- [ ] `/madeinoz-osint:osint` (or natural language) routes to an OSINT workflow

## Sign-off

| Section | Result | Evidence |
|---|---|---|
| 1. Structure | ☐ | |
| 2. Routing | ☐ | |
| 3. Memory adapter | ☐ | |
| 4. Backends | ☐ / N-A | |
| 5. Tools | ☐ / N-A | |
| 6. CI parity | ☐ / N-A | |
