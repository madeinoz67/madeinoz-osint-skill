# Knowledge Graph Integration

The PAI OSINT Skill integrates with the PAI Knowledge System (Graphiti) to persist intelligence findings and enable cross-investigation querying.

<p align="center">
  <img src="../assets/knowledge-graph.png" alt="Knowledge Graph Entity Relationships" width="80%">
</p>

## Knowledge Graph Documentation

- **[OSINT Ontology](OSINT_ONTOLOGY.md)** - Complete ontology for OSINT entities and relationships
- **[Ontology Quick Reference](ONTOLOGY_QUICK_REFERENCE.md)** - Quick lookup for entity types
- **[Graphiti Implementation](GRAPHITI_IMPLEMENTATION.md)** - Technical implementation details

## Key Concepts

### Entity Types

- **Person** - Individuals under investigation
- **Organization** - Companies, non-profits, government entities
- **Domain** - Websites and infrastructure
- **Email** - Email addresses and breach data
- **Phone** - Phone numbers and carrier information
- **Account** - Social media and service accounts
- **DigitalArtifact** - Images, documents, files

### Relationship Types

- **OWNS** - Ownership relationships
- **WORKS_FOR** - Employment associations
- **ASSOCIATED_WITH** - General associations
- **HOSTED_ON** - Infrastructure relationships
- **LINKED_TO** - Identity correlations

## Investigation Persistence

All OSINT investigations automatically store findings to the knowledge graph:

```bash
# Query past investigations
What do I know about username johndoe?
What companies are linked to domain example.com?
Show me all findings from OSINT investigations in the past week
```
