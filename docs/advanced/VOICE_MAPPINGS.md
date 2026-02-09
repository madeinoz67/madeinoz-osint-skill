# OSINT Voice Mappings Reference

Voice mappings for OSINT agent roles and how they map to the PAI voice system.

<p align="center">
  <img src="../assets/osint-voice-mappings.png" alt="Voice Mappings Flow" width="80%">
</p>

## Agent Role → Voice → Traits Mapping

| Agent Role | Voice | Traits | Description |
|------------|-------|--------|-------------|
| `Recon` | Sophisticated | `intelligence,analytical,exploratory` | Quick, tactical reconnaissance specialist |
| `Scanner` | Authoritative | `intelligence,technical,systematic` | Infrastructure and domain scanning |
| `Collector` | Sophisticated | `intelligence,meticulous,thorough` | Methodical intelligence gatherer |
| `Enumerator` | Sophisticated | `intelligence,analytical,systematic` | Email/phone validation specialist |
| `Analyst` | Sophisticated | `intelligence,analytical,synthesizing` | Measured, synthesizing intelligence analyst |
| `TechAnalyst` | Authoritative | `intelligence,technical,meticulous` | Technical infrastructure analyst |
| `FinanceAnalyst` | Professional | `intelligence,finance,thorough` | Financial intelligence specialist |
| `BusinessAnalyst` | Professional | `intelligence,business,comparative` | Corporate/competitive analyst |
| `PatternAnalyst` | Sophisticated | `intelligence,analytical,systematic` | Timeline and pattern detection |
| `Linker` | Sophisticated | `intelligence,analytical,synthesizing` | Identity resolution specialist |
| `Correlator` | Sophisticated | `intelligence,analytical,exploratory` | Cross-source correlation |
| `Auditor` | Intense | `intelligence,security,skeptical` | Risk and due diligence expert |
| `Verifier` | Sophisticated | `intelligence,meticulous,systematic` | Source verification specialist |
| `Shadow` | Intense | `intelligence,security,adversarial` | Adversarial intelligence operator |
| `Synthesizer` | Authoritative | `intelligence,communications,synthesizing` | Report generation specialist |
| `Briefer` | Authoritative | `intelligence,communications,consultative` | Executive briefing specialist |
| `Researcher` | Professional | `intelligence,business,systematic` | Corporate structure researcher |

## Workflow → Voice Mapping

| Workflow | Recommended Voice | Traits | Voice Line Prefix |
|----------|-------------------|--------|-------------------|
| UsernameRecon | Sophisticated | `intelligence,analytical,exploratory` | `🗣️ Recon:` |
| DomainRecon | Authoritative | `intelligence,technical,systematic` | `🗣️ Scanner:` |
| EmailRecon | Sophisticated | `intelligence,analytical,systematic` | `🗣️ Enumerator:` |
| PhoneRecon | Sophisticated | `intelligence,analytical,systematic` | `🗣️ Enumerator:` |
| SocialCapture | Sophisticated | `intelligence,meticulous,thorough` | `🗣️ Collector:` |
| InfraMapping | Authoritative | `intelligence,technical,thorough` | `🗣️ Scanner:` |
| EntityLinking | Sophisticated | `intelligence,analytical,synthesizing` | `🗣️ Linker:` |
| TimelineAnalysis | Sophisticated | `intelligence,analytical,systematic` | `🗣️ Analyst:` |
| TargetProfile | Sophisticated | `intelligence,meticulous,thorough` | `🗣️ Collector:` |
| IntelReport | Authoritative | `intelligence,communications,synthesizing` | `🗣️ Briefer:` |
| CompanyProfile | Professional | `intelligence,business,synthesizing` | `🗣️ Researcher:` |
| CorporateStructure | Professional | `intelligence,business,systematic` | `🗣️ Researcher:` |
| FinancialRecon | Professional | `intelligence,finance,thorough` | `🗣️ FinanceAnalyst:` |
| CompetitorAnalysis | Professional | `intelligence,business,comparative` | `🗣️ BusinessAnalyst:` |
| RiskAssessment | Intense | `intelligence,security,skeptical` | `🗣️ Auditor:` |
| ImageRecon | Authoritative | `intelligence,technical,meticulous` | `🗣️ TechAnalyst:` |
| InvestigationOrchestrator | Authoritative | `intelligence,systematic,meticulous` | `🗣️ Analyst:` |

## Voice Output Format

All OSINT agents MUST include voice markers for audio notifications. The voice system picks up `🗣️` lines and speaks them aloud.

### Voice Line Format

```
🗣️ [AgentRole]: [Brief status message - max 20 words]
```

### When to Include Voice Lines

| Phase | Example |
|-------|---------|
| **Start** | `🗣️ Recon: Beginning username enumeration for target madeinoz.` |
| **Key Finding** | `🗣️ Analyst: Found 5 confirmed accounts. GitHub profile shows developer activity.` |
| **Completion** | `🗣️ Analyst: Investigation complete. 4 distinct entities identified. Awaiting direction.` |

### Example Output with Voice

```
🗣️ Recon: Initiating username scan for johndoe across 400 platforms.

[... investigation proceeds ...]

🗣️ Analyst: Found 12 accounts. Strong GitHub presence detected.

[... analysis continues ...]

🗣️ Analyst: Investigation complete. Recommend deep dive on developer platforms.
```

## Voice Personality Descriptions

### Sophisticated Voice

- **Tone:** Nuanced, measured, intellectual
- **Used for:** Analysis, correlation, investigation
- **Roles:** Recon, Analyst, Linker, Collector, Verifier, TechAnalyst, PatternAnalyst, Correlator

### Authoritative Voice

- **Tone:** Formal, definitive, expert
- **Used for:** Technical analysis, reporting, scanning
- **Roles:** Scanner, TechAnalyst, Synthesizer, Briefer, ImageRecon

### Professional Voice

- **Tone:** Balanced, business-like, advisory
- **Used for:** Corporate research, financial analysis
- **Roles:** FinanceAnalyst, BusinessAnalyst, Researcher, CompanyProfile

### Intense Voice

- **Tone:** Urgent, serious, security-focused
- **Used for:** Risk assessment, adversarial operations
- **Roles:** Auditor, Shadow, RiskAssessment

## Voice Configuration

Voice IDs are configured in `$PAI_DIR/VoiceServer/voice-personalities.json`. Each OSINT agent role should have a corresponding voice personality entry.

For voice configuration details, see the VoiceServer skill documentation.
