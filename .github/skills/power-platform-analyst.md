# Power Platform Analyst

Expert guidance for assessing Power Platform feature implementations and estimating development effort.

Use when evaluating how to implement features in Power Apps, Power Automate, Dataverse, Copilot Studio, or Power Pages. Triggers on questions about implementation approaches, effort estimation, complexity assessment, licensing implications, technical feasibility, or architecture decisions within the Power Platform ecosystem.

## Assessment Workflow

When asked to assess a feature or estimate effort:

1. **Clarify requirements** → Understand the business need, user personas, data scope
2. **Identify components** → Determine which Power Platform services are needed
3. **Assess complexity** → Evaluate technical challenges using the complexity matrix
4. **Estimate effort** → Apply the effort estimation framework
5. **Document risks** → Highlight dependencies, licensing, and governance considerations

## Component Selection Guide

| Requirement | Primary Component | Consider Also |
|-------------|-------------------|---------------|
| Data entry / forms | Canvas App or Model-Driven App | Dataverse, SharePoint |
| Process automation | Power Automate (Cloud Flows) | Dataverse business rules |
| Scheduled jobs | Power Automate (Scheduled Flows) | Azure Functions for complex |
| Conversational AI | Copilot Studio | Power Automate for backend |
| External portal | Power Pages | Canvas App embedded |
| Reporting | Power BI embedded | Model-Driven dashboards |
| Document generation | Power Automate + Word templates | Third-party (Encodian, Plumsail) |

## Complexity Matrix

Rate each factor 1-3 (Low/Medium/High):

| Factor | 1 - Low | 2 - Medium | 3 - High |
|--------|---------|------------|----------|
| **Data model** | Single table, <10 columns | 3-5 related tables | 6+ tables, complex relationships |
| **Business logic** | Simple CRUD | Conditional workflows, validations | Multi-stage approvals, calculations |
| **Integrations** | None or standard connectors | Premium connectors, simple API | Custom connectors, complex auth |
| **UI complexity** | Single screen, basic controls | 5-10 screens, responsive design | Complex navigation, custom components |
| **Security model** | Single security role | Role-based with 2-3 roles | Business unit hierarchy, field-level |
| **Environment** | Single environment | Dev/Test/Prod pipeline | Multi-tenant, multi-region |

**Complexity Score Interpretation:**
- 6-9: Simple → Standard patterns, minimal customization
- 10-14: Moderate → Some custom development, testing cycles
- 15-18: Complex → Significant architecture, specialized skills needed

## Effort Estimation Framework

Base effort units in **person-days** (8h):

### Power Apps (Canvas)
| Scope | Effort | Includes |
|-------|--------|----------|
| Simple form (1-3 screens) | 2-4 days | Basic CRUD, navigation |
| Medium app (4-8 screens) | 5-12 days | Multiple data sources, validation |
| Complex app (9+ screens) | 15-30 days | Offline, responsive, components |

### Power Apps (Model-Driven)
| Scope | Effort | Includes |
|-------|--------|----------|
| Basic entity forms | 1-2 days | Standard forms, views |
| Customized experience | 3-8 days | Business rules, custom views |
| Full solution | 10-20 days | Multiple entities, dashboards, security |

### Power Automate
| Scope | Effort | Includes |
|-------|--------|----------|
| Simple flow (linear) | 0.5-1 day | Trigger → 3-5 actions → output |
| Moderate flow | 1-3 days | Conditions, loops, error handling |
| Complex flow | 3-7 days | Child flows, custom connectors, retry logic |
| Scheduled batch process | 2-5 days | Pagination, throttling, logging |

### Dataverse
| Scope | Effort | Includes |
|-------|--------|----------|
| Simple table setup | 0.5-1 day | Columns, basic relationships |
| Data model design | 2-5 days | Multiple tables, lookups, choices |
| Full schema with security | 5-10 days | Business units, roles, field security |

### Copilot Studio
| Scope | Effort | Includes |
|-------|--------|----------|
| FAQ bot | 1-2 days | Topics from existing content |
| Guided conversation | 3-5 days | Entities, slot filling, conditions |
| Integrated agent | 5-12 days | Power Automate actions, authentication |
| Multi-channel deployment | +2-3 days | Teams, web, custom canvas |

### Multipliers
Apply to base estimates:

| Factor | Multiplier |
|--------|------------|
| First-time implementation (new pattern) | 1.3-1.5x |
| Multi-language support | 1.2-1.4x |
| Complex security requirements | 1.2-1.5x |
| Legacy data migration | 1.3-2.0x |
| Comprehensive testing/UAT | 1.2-1.4x |
| Documentation & training | 1.1-1.3x |

## Licensing Considerations

Flag when requirements imply:

- **Premium connectors** → Per-user or per-flow licensing
- **Dataverse storage** → Capacity add-ons beyond tenant allocation
- **Copilot Studio** → Message capacity packs
- **Power Pages** → Authenticated vs anonymous user licensing
- **AI Builder** → AI credits consumption
- **Managed Environments** → Premium feature requiring licensing

## Risk Assessment Checklist

Always evaluate:

- [ ] **Governance**: ALM strategy, environment strategy, DLP policies
- [ ] **Performance**: Expected data volumes, concurrent users
- [ ] **Supportability**: Team skills, documentation requirements
- [ ] **Dependencies**: External systems availability, API limits
- [ ] **Timeline**: Realistic given complexity and team capacity
- [ ] **Compliance**: Data residency, audit requirements

## Output Format

Structure assessments as:

```
## Feature Assessment: [Feature Name]

### Summary
Brief description of the implementation approach.

### Recommended Architecture
- Components and their roles
- Data flow diagram (if complex)

### Effort Estimate
| Phase | Effort | Notes |
|-------|--------|-------|
| Design | X days | ... |
| Build | X days | ... |
| Test | X days | ... |
| Deploy | X days | ... |
| **Total** | **X days** | |

### Complexity: [Simple/Moderate/Complex]
Score breakdown and justification.

### Risks & Considerations
- Risk 1
- Risk 2

### Licensing Impact
Licensing requirements if applicable.

### Alternatives Considered
Brief mention of other approaches and why not chosen.
```
