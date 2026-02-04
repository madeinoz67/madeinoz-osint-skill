# Graphiti Implementation Guide for OSINT

**Purpose:** Step-by-step guide to implementing custom OSINT entities and relationships in Graphiti knowledge graph

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Defining Custom Entities](#defining-custom-entities)
4. [Defining Custom Relationships](#defining-custom-relationships)
5. [Episode Processing](#episode-processing)
6. [Knowledge Graph Queries](#knowledge-graph-queries)
7. [Integration with OSINT Workflows](#integration-with-osint-workflows)

---

## Prerequisites

### Required Systems

```bash
# Graphiti with Neo4j or FalkorDB
pip install graphiti-core

# Neo4j (recommended) or FalkorDB
# Neo4j: 5.x+
# FalkorDB: Latest
```

### Configuration

```bash
# Set environment variables
export NEO4J_URI="bolt://localhost:7687"
export NEO4J_USER="neo4j"
export NEO4J_PASSWORD="your_password"
export GRAPHITI_WORKSPACE="/path/to/workspace"
```

---

## Setup

### 1. Project Structure

```
madeinoz-knowledge-system/
├── graphiti_osint/
│   ├── __init__.py
│   ├── entities/
│   │   ├── __init__.py
│   │   ├── person.py
│   │   ├── organization.py
│   │   ├── account.py
│   │   ├── domain.py
│   │   ├── email.py
│   │   ├── phone.py
│   │   ├── location.py
│   │   └── image.py
│   ├── relationships/
│   │   ├── __init__.py
│   │   ├── identity_resolution.py
│   │   ├── professional.py
│   │   └── corporate.py
│   ├── processors/
│   │   ├── __init__.py
│   │   ├── osint_base.py
│   │   ├── username_recon.py
│   │   ├── email_recon.py
│   │   └── investigation.py
│   └── config.py
└── tests/
    ├── test_entities.py
    └── test_processors.py
```

### 2. Initialize Graphiti

```python
# graphiti_osint/config.py
from graphiti_core import Graphiti
from graphiti_core.llm_loader import OpenAILLMLoader
from neo4j import GraphDatabase

class OSINTGraphConfig:
    """Configuration for OSINT knowledge graph"""

    # Neo4j connection
    NEO4J_URI = "bolt://localhost:7687"
    NEO4J_USER = "neo4j"
    NEO4J_PASSWORD = "your_password"

    # Graphiti workspace
    WORKSPACE_DIR = "./workspace"

    # LLM for entity extraction
    LLM_CLIENT = OpenAILLMLoader()

    # Knowledge graph groups
    GROUPS = {
        "osint-people": "Person entities",
        "osint-organizations": "Organization entities",
        "osint-accounts": "Platform accounts",
        "osint-domains": "Domain/DNS entities",
        "osint-emails": "Email entities",
        "osint-phones": "Phone entities",
        "osint-locations": "Location entities",
        "osint-images": "Image entities",
        "osint-investigations": "Investigation cases",
    }

def get_graphiti() -> Graphiti:
    """Get configured Graphiti instance"""
    db = GraphDatabase(
        OSINTGraphConfig.NEO4J_URI,
        auth=(OSINTGraphConfig.NEO4J_USER, OSINTGraphConfig.NEO4J_PASSWORD)
    )

    return Graphiti(
        database=db,
        llm=OSINTGraphConfig.LLM_CLIENT,
        workspace_dir=OSINTGraphConfig.WORKSPACE_DIR
    )
```

---

## Defining Custom Entities

### Person Entity Implementation

```python
# graphiti_osint/entities/person.py
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum

class AccountStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    SUSPENDED = "Suspended"
    DELETED = "Deleted"
    PRIVATE = "Private"

class PersonEntity(BaseModel):
    """Person entity for OSINT investigations"""

    # Primary Key
    uuid: str = Field(..., description="Unique person identifier")

    # Core Identity
    primary_name: str = Field(..., description="Full legal name")
    given_name: str = Field(..., description="First name")
    family_name: str = Field(..., description="Last name")
    middle_name: Optional[str] = Field(None, description="Middle name")

    # Identity Variants
    aliases: List[str] = Field(default_factory=list, description="AKA, maiden names")
    usernames: Dict[str, str] = Field(
        default_factory=dict,
        description="Platform-specific usernames"
    )
    emails: List[str] = Field(default_factory=list, description="Associated emails")
    phones: List[str] = Field(default_factory=list, description="Associated phones")

    # Temporal
    born_at: Optional[datetime] = Field(None, description="Date of birth")
    active_since: Optional[datetime] = Field(None, description="First online appearance")
    last_seen: Optional[datetime] = Field(None, description="Most recent activity")

    # Location
    locations: List[str] = Field(default_factory=list, description="Known locations")

    # Professional
    occupations: List[str] = Field(default_factory=list, description="Job titles")
    employers: List[str] = Field(default_factory=list, description="Current/past employers")

    # Investigation Metadata
    confidence: float = Field(default=0.0, ge=0.0, le=100.0, description="Confidence score 0-100")
    sources: List[str] = Field(default_factory=list, description="Data source URLs/references")

    # Temporal Metadata
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    valid_from: datetime = Field(default_factory=datetime.now)
    valid_until: Optional[datetime] = Field(None, description="When this info stops being true")

    def to_graphiti_episode(self) -> str:
        """Convert to Graphiti episode format"""
        episode_parts = [
            f"Person: {self.primary_name}",
            f"Born: {self.born_at.strftime('%Y-%m-%d') if self.born_at else 'Unknown'}",
        ]

        if self.aliases:
            episode_parts.append(f"AKA: {', '.join(self.aliases)}")

        if self.usernames:
            usernames_str = ', '.join([
                f"{platform}: @{username}"
                for platform, username in self.usernames.items()
            ])
            episode_parts.append(f"Usernames: {usernames_str}")

        if self.emails:
            episode_parts.append(f"Emails: {', '.join(self.emails)}")

        if self.employers:
            episode_parts.append(f"Employers: {', '.join(self.employers)}")

        episode_parts.append(f"Confidence: {self.confidence}%")
        episode_parts.append(f"Sources: {', '.join(self.sources)}")

        return '\n'.join(episode_parts)

    class Config:
        json_schema_extra = {
            "example": {
                "uuid": "person_abc123",
                "primary_name": "John Smith",
                "given_name": "John",
                "family_name": "Smith",
                "usernames": {
                    "twitter": "@jsmith",
                    "github": "jsmith-dev"
                },
                "emails": ["john@example.com"],
                "confidence": 85.0
            }
        }
```

### Organization Entity

```python
# graphiti_osint/entities/organization.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class EntityStatus(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    DISSOLVED = "Dissolved"

class OrganizationEntity(BaseModel):
    """Organization entity for OSINT investigations"""

    uuid: str
    entity_type: str = "Organization"

    # Legal Identity
    legal_name: str
    dba_names: List[str] = Field(default_factory=list)
    registration_number: str
    entity_type: str  # Corp, LLC, Ltd, NonProfit
    jurisdiction: str
    status: EntityStatus

    # Temporal
    founded_on: datetime
    dissolved_on: Optional[datetime] = None
    incorporated_at: Optional[datetime] = None

    # Contact
    headquarters: str
    website: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

    # Structure
    subsidiaries: List[str] = Field(default_factory=list)
    parent_company: Optional[str] = None
    directors: List[str] = Field(default_factory=list)
    officers: List[str] = Field(default_factory=list)
    employees: int = 0

    # Financial
    annual_revenue: Optional[float] = None
    revenue_currency: str = "USD"
    revenue_year: int = 0

    # Metadata
    confidence: float = 0.0
    sources: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    valid_from: datetime = Field(default_factory=datetime.now)
    valid_until: Optional[datetime] = None
```

---

## Defining Custom Relationships

### Identity Resolution Relationship

```python
# graphiti_osint/relationships/identity_resolution.py
from graphiti_core.edges import Edge
from datetime import datetime
from typing import List, Optional
from enum import Enum

class IdentityRelationType(str, Enum):
    SAME_PERSON_AS = "SAME_PERSON_AS"
    LIKELY_SAME_PERSON = "LIKELY_SAME_PERSON"
    POSSIBLY_SAME_PERSON = "POSSIBLY_SAME_PERSON"
    DIFFERENT_PERSON = "DIFFERENT_PERSON"

class IdentityResolutionEdge(Edge):
    """Custom edge for identity resolution"""

    def __init__(
        self,
        source_node_uuid: str,
        target_node_uuid: str,
        relationship_type: IdentityRelationType,
        confidence: float,
        evidence: List[str],
        valid_from: datetime,
        valid_until: Optional[datetime] = None,
    ):
        super().__init__(
            source_node_uuid=source_node_uuid,
            target_node_uuid=target_node_uuid,
        )
        self.relationship_type = relationship_type
        self.confidence = confidence
        self.evidence = evidence
        self.valid_from = valid_from
        self.valid_until = valid_until

    def to_dict(self) -> dict:
        """Convert to dictionary for storage"""
        return {
            "source_uuid": self.source_node_uuid,
            "target_uuid": self.target_node_uuid,
            "relationship_type": self.relationship_type.value,
            "confidence": self.confidence,
            "evidence": self.evidence,
            "valid_from": self.valid_from.isoformat(),
            "valid_until": self.valid_until.isoformat() if self.valid_until else None,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "IdentityResolutionEdge":
        """Create from dictionary"""
        return cls(
            source_node_uuid=data["source_uuid"],
            target_node_uuid=data["target_uuid"],
            relationship_type=IdentityRelationType(data["relationship_type"]),
            confidence=data["confidence"],
            evidence=data["evidence"],
            valid_from=datetime.fromisoformat(data["valid_from"]),
            valid_until=datetime.fromisoformat(data["valid_until"]) if data.get("valid_until") else None,
        )
```

---

## Episode Processing

### OSINT Episode Processor Base

```python
# graphiti_osint/processors/osint_base.py
from abc import ABC, abstractmethod
from graphiti_core import Graphiti
from graphiti_core.observations import Episode
from typing import Dict, Any, List
from datetime import datetime

class OSINTEpisodeProcessor(ABC):
    """Base class for OSINT episode processors"""

    def __init__(self, graphiti: Graphiti):
        self.graphiti = graphiti
        self.group_id = self.get_group_id()

    @abstractmethod
    def get_group_id(self) -> str:
        """Return the knowledge graph group ID"""
        pass

    @abstractmethod
    async def process(self, episode_body: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Process an episode and return results"""
        pass

    async def add_episode(
        self,
        name: str,
        episode_body: str,
        source_description: str,
        metadata: Dict[str, Any] = None
    ) -> str:
        """Add episode to knowledge graph"""
        episode = Episode(
            name=name,
            episode_body=episode_body,
            source_description=source_description,
            metadata=metadata or {}
        )

        # This triggers Graphiti's entity extraction
        await self.graphiti.add_episode(
            name=name,
            episode_body=episode_body,
            source=EpisodeType.text,
            source_description=source_description
        )

        return episode.uuid
```

### Username Recon Processor

```python
# graphiti_osint/processors/username_recon.py
from .osint_base import OSINTEpisodeProcessor
from ..entities.person import PersonEntity
from ..relationships.identity_resolution import IdentityResolutionEdge, IdentityRelationType
from typing import Dict, Any

class UsernameReconProcessor(OSINTEpisodeProcessor):
    """Process username enumeration episodes"""

    def get_group_id(self) -> str:
        return "osint-usernames"

    async def process(self, episode_body: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Process username enumeration results"""

        username = metadata.get("username")
        results = metadata.get("results", {})

        # Create person entity
        person = PersonEntity(
            uuid=f"person_{self._hash_string(username)}",
            primary_name=results.get("name") or username,
            given_name=results.get("first_name", ""),
            family_name=results.get("last_name", ""),
            usernames={
                platform: account["username"]
                for platform, account in results.get("accounts", {}).items()
            },
            emails=results.get("emails", []),
            confidence=results.get("confidence", 70.0),
            sources=results.get("sources", []),
            created_at=datetime.now(),
            valid_from=datetime.now()
        )

        # Add episode to knowledge graph
        await self.add_episode(
            name=f"username_recon_{username}",
            episode_body=person.to_graphiti_episode(),
            source_description="OSINT Username Enumeration"
        )

        # Link accounts to person
        for platform, account_data in results.get("accounts", {}).items():
            await self._link_account_to_person(
                username,
                platform,
                account_data,
                person.uuid
            )

        return {
            "person_uuid": person.uuid,
            "accounts_linked": len(results.get("accounts", {})),
            "confidence": person.confidence
        }

    async def _link_account_to_person(
        self,
        username: str,
        platform: str,
        account_data: Dict[str, Any],
        person_uuid: str
    ):
        """Create account entity and link to person"""
        account_uuid = f"account_{platform}_{self._hash_string(username)}"

        # Account episode
        account_episode = f"""
Account on {platform}
Username: {username}
URL: {account_data.get('url')}
Display Name: {account_data.get('display_name')}
Followers: {account_data.get('followers', 0)}
Platform Verified: {account_data.get('verified', False)}
"""

        await self.graphiti.add_episode(
            name=f"account_{platform}_{username}",
            episode_body=account_episode,
            source_description=f"OSINT Account Data from {platform}"
        )

        # Create identity resolution relationship
        edge = IdentityResolutionEdge(
            source_node_uuid=account_uuid,
            target_node_uuid=person_uuid,
            relationship_type=IdentityRelationType.SAME_PERSON_AS,
            confidence=account_data.get("confidence", 90.0),
            evidence=[f"Profile on {platform}"],
            valid_from=datetime.now()
        )

        # Store edge (implementation depends on Graphiti version)
        # await self.graphiti.add_edge(edge)

    def _hash_string(self, s: str) -> str:
        """Generate consistent hash for string"""
        import hashlib
        return hashlib.sha256(s.encode()).hexdigest()[:16]
```

---

## Knowledge Graph Queries

### Cypher Query Examples

```cypher
// Find all identities for a person across platforms
MATCH (p:Person {primary_name: "John Smith"})
MATCH (p)-[:HAS_ACCOUNT]->(a:Account)
RETURN p, a.platform, a.username, a.url
ORDER BY a.followers_count DESC

// Identity resolution: Find likely same persons
MATCH (p1:Person)-[:LIKELY_SAME_PERSON]->(p2:Person)
WHERE p1.confidence > 70
RETURN p1, p2, p1.uuid as source
LIMIT 20

// Corporate structure exploration
MATCH (o:Organization {legal_name: "Acme Corp"})
OPTIONAL MATCH (o)<-[:PARENT_OF]-(sub:Organization)
OPTIONAL MATCH (o)<-[:FUNDED_BY]-(i:Investor)
OPTIONAL MATCH (o)<-[:DIRECTOR_OF]-(d:Person)
RETURN o,
       collect(DISTINCT sub.legal_name) as subsidiaries,
       collect(DISTINCT i.name) as investors,
       collect(DISTINCT d.primary_name) as directors

// Temporal: What did we know about person X at a specific time?
MATCH (p:Person {uuid: "person_abc123"})
WHERE datetime(p.valid_from) <= datetime("2023-06-01")
  AND (p.valid_until IS NULL OR datetime(p.valid_until) >= datetime("2023-06-01"))
RETURN p.primary_name, p.emails, p.employers

// Cross-platform identity correlation
MATCH (a1:Account {platform: "twitter"})-[r:LIKELY_SAME_PERSON]->(a2:Account {platform: "github"})
RETURN a1.username, a2.username, r.confidence, r.evidence
ORDER BY r.confidence DESC

// Investigation pivot tracking
MATCH (i:Investigation {id: "OSINT-INV-2026-001"})
MATCH (i)-[:GENERATED_PIVOT]->(pivot:Pivot)
MATCH (pivot)-[:DISCOVERED_IN]->(entity)
RETURN pivot.pivot_type, entity.uuid, entity.entity_type, pivot.priority
ORDER BY pivot.priority DESC
```

---

## Integration with OSINT Workflows

### Workflow Integration Pattern

```python
# In OSINT workflow files, add knowledge graph integration

## Knowledge Graph Integration

After collecting OSINT findings, store to knowledge graph:

```python
from graphiti_osint import OSINTGraphConfig, UsernameReconProcessor

async def store_to_knowledge_graph(findings: dict):
    """Store OSINT findings to Graphiti knowledge graph"""
    graphiti = OSINTGraphConfig.get_graphiti()
    processor = UsernameReconProcessor(graphiti)

    results = await processor.process(
        episode_body=generate_episode_body(findings),
        metadata={
            "username": findings["username"],
            "results": findings["accounts"]
        }
    )

    return results
```

### Workflow Example: UsernameRecon.md Enhancement

```markdown
## Knowledge Graph Integration

**Store findings to Graphiti knowledge graph for:**
- Cross-investigation correlation
- Identity resolution across cases
- Temporal tracking of entity changes
- Relationship discovery and analysis

**Episode Structure:**
```
name: username_recon_{username}
body: |
  Username Enumeration Results

  Target: {username}
  Scan Date: {timestamp}

  Accounts Found:
  - Platform: {platform}
    Username: {username}
    URL: {url}
    Followers: {count}
    Verified: {bool}

  Confirmed Accounts: {count}
  Confidence: {confidence}

  Metadata:
  - Investigation: {investigation_id}
  - Depth: {depth}
  - Sources: {sources}

group_id: "osint-usernames"
```
```

---

## Testing

### Entity Tests

```python
# tests/test_entities.py
import pytest
from graphiti_osint.entities.person import PersonEntity
from datetime import datetime

def test_person_entity_creation():
    """Test Person entity creation"""
    person = PersonEntity(
        uuid="person_test123",
        primary_name="John Smith",
        given_name="John",
        family_name="Smith",
        usernames={"twitter": "@jsmith", "github": "jsmith-dev"},
        emails=["john@example.com"],
        confidence=85.0,
        sources=["Twitter", "GitHub"],
        created_at=datetime.now(),
        valid_from=datetime.now()
    )

    assert person.primary_name == "John Smith"
    assert person.confidence == 85.0
    assert len(person.usernames) == 2
    assert "@jsmith" in person.usernames["twitter"]

def test_person_to_graphiti_episode():
    """Test conversion to Graphiti episode format"""
    person = PersonEntity(
        uuid="person_test123",
        primary_name="John Smith",
        given_name="John",
        family_name="Smith",
        usernames={"twitter": "@jsmith"},
        confidence=85.0,
        sources=["Twitter"],
        created_at=datetime.now(),
        valid_from=datetime.now()
    )

    episode = person.to_graphiti_episode()

    assert "Person: John Smith" in episode
    assert "twitter: @jsmith" in episode
    assert "Confidence: 85.0" in episode
```

---

## Troubleshooting

### Common Issues

**Issue:** Entities not being extracted
- **Solution:** Check episode format - ensure clear entity names and attributes

**Issue:** Relationships not being created
- **Solution:** Verify both source and target entities exist before creating edges

**Issue:** Confidence scores not calculating
- **Solution:** Check confidence factors are being passed correctly

**Issue:** Temporal queries returning incorrect results
- **Solution:** Verify valid_from and valid_until timestamps are set correctly

---

## Best Practices

1. **Always set confidence scores** - Every entity and relationship should have a confidence value
2. **Track provenance** - Always record where data came from
3. **Use temporal metadata** - Set valid_from and valid_until for time-bound facts
4. **Group related entities** - Use consistent group_id for related investigations
5. **Test with real data** - Use actual OSINT findings to validate schema design
6. **Iterate on schema** - Start with core entities, expand as needed

---

**Version:** 1.0.0
**Last Updated:** 2026-02-04
**Related Docs:** OSINT_ONTOLOGY.md, KNOWLEDGE_GROUPS.md
