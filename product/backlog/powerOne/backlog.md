# powerOne — Product Backlog

> **Platform**: Microsoft Power Platform — Canvas App on Dataverse
> **Publisher prefix**: `po_`
> **Sprint cadence**: 1-week sprints
> **Estimation basis**: Person-days (8h), Fibonacci story points (relative complexity)
> **Assumed velocity**: 10–12 points/sprint

---

## Backlog Summary

| Metric | Value |
|--------|-------|
| **Total Stories** | 36 |
| **Total Story Points** | 184 |
| **Sprint Cadence** | 1-week sprints |
| **Sprints Estimated** | 16–20 (at 10–12 pts/sprint) |
| **Must Have (P1)** | 24 stories, 127 pts |
| **Should Have (P2)** | 8 stories, 41 pts |
| **Could Have (P3)** | 4 stories, 16 pts |
| **Critical Path** | Schema → Security → Canvas App → Shell → OKR List → OKR CRUD → Metrics |

> **Note**: Admin master data CRUD (Org Units, Sprints, User-OrgUnit assignments) has been moved to the **power1Admin** Model-Driven App. See [power1Admin backlog](../power1Admin/backlog.md).

### Effort by Epic

| Epic | Stories | Points | % of Total |
|------|---------|--------|------------|
| E0: Foundation & Infrastructure | 4 | 26 | 14% |
| E1: Application Shell | 5 | 27 | 15% |
| E3: OKR Hierarchy | 14 | 81 | 44% |
| E4: Programs | 5 | 23 | 13% |
| E5: Metrics & Progress | 4 | 14 | 8% |
| E6: OKR Rituals | 4 | 13 | 7% |
| **Total** | **36** | **184** | |

> Epic E2 (Admin & Master Data) is handled entirely by power1Admin.

---

## Prioritized Backlog

| ID | Title | Points | Priority | Epic | Deps |
|----|-------|--------|----------|------|------|
| US-001 | Deploy Dataverse schema | 8 | P1/Must | E0 | — |
| US-002 | Configure security roles | 5 | P1/Must | E0 | US-001 |
| US-003 | Set up ALM pipeline | 5 | P2/Should | E0 | US-001 |
| US-004 | Create Canvas App project | 8 | P1/Must | E0 | US-001, US-002 |
| US-005 | Build sidebar navigation | 5 | P1/Must | E1 | US-004 |
| US-006 | Implement user context | 3 | P1/Must | E1 | US-004 |
| US-007 | Build section routing | 8 | P1/Must | E1 | US-005, US-006 |
| US-011 | OKR list view | 8 | P1/Must | E3 | US-007 * |
| US-012 | Objective create/edit form | 8 | P1/Must | E3 | US-011 |
| US-013 | Key Result create/edit form | 8 | P1/Must | E3 | US-012 |
| US-014 | Metric definition on Key Results | 5 | P1/Must | E3 | US-013 |
| US-015 | Lifecycle status management | 5 | P1/Must | E3 | US-012, US-013 |
| US-016 | Cascade linking | 5 | P1/Must | E3 | US-013, US-012 |
| US-017 | Filter bar with searchable dropdowns | 8 | P1/Must | E3 | US-011 |
| US-018 | Pre-set filters | 3 | P1/Must | E3 | US-017 |
| US-019 | Custom saved filters | 5 | P2/Should | E3 | US-017, US-018 |
| US-020 | View modes (full, compact, hierarchy) | 8 | P2/Should | E3 | US-011 |
| US-021 | Breadcrumb navigation | 5 | P2/Should | E3 | US-011, US-016 |
| US-022 | Cascade navigation | 5 | P2/Should | E3 | US-016, US-021 |
| US-023 | Task management on Key Results | 5 | P1/Must | E3 | US-013 |
| US-024 | Assign Objectives to Sprint & Programs | 3 | P1/Must | E3 | US-012 |
| US-025 | Programs dashboard | 5 | P1/Must | E4 | US-007, US-012 |
| US-026 | Program create/edit form | 5 | P1/Must | E4 | US-025 |
| US-027 | Program detail view | 5 | P1/Must | E4 | US-026 |
| US-028 | Program progress rollup | 5 | P2/Should | E4 | US-027, US-014 |
| US-029 | Activity feed | 3 | P3/Could | E4 | US-027 |
| US-030 | My Key Results list | 3 | P1/Must | E5 | US-007, US-014 |
| US-031 | Metric value update | 5 | P1/Must | E5 | US-030 |
| US-032 | Progress calculation & display | 3 | P1/Must | E5 | US-031 |
| US-033 | Metric update history | 3 | P2/Should | E5 | US-031 |
| US-034 | Rituals dashboard | 3 | P1/Must | E6 | US-007 * |
| US-035 | Ritual create/edit form | 3 | P1/Must | E6 | US-034 |
| US-036 | Ritual facilitation view | 5 | P2/Should | E6 | US-035 |
| US-037 | Past rituals list | 2 | P3/Could | E6 | US-035 |
| US-038 | Responsive layout | 8 | P3/Could | E1 | US-007 |
| US-039 | Dark mode support | 3 | P3/Could | E1 | US-007 |

> \* **Cross-project data dependency**: US-011 and US-034 read org unit and sprint data from Dataverse. This data is managed by power1Admin. For development, sample data must be entered via the Model-Driven App or direct Dataverse import before these stories can be tested.

---

## Sprint Planning Suggestion

> 1-week sprints at 10–12 points/sprint velocity

| Sprint | Stories | Points | Focus |
|--------|---------|--------|-------|
| **Sprint 1** | US-001, US-002 | 13 | Foundation: Dataverse schema + security roles |
| **Sprint 2** | US-004, US-003 | 13 | Foundation: Canvas App project + ALM pipeline |
| **Sprint 3** | US-005, US-006 | 8 | Shell: sidebar navigation + user context |
| **Sprint 4** | US-007 | 8 | Shell: section routing + deep linking |
| **Sprint 5** | US-011 | 8 | OKR: list view with expandable Key Results |
| **Sprint 6** | US-012, US-024 | 11 | OKR: Objective CRUD + sprint/program assign |
| **Sprint 7** | US-013 | 8 | OKR: Key Result CRUD |
| **Sprint 8** | US-014, US-023 | 10 | OKR: metric definition + task management |
| **Sprint 9** | US-015, US-016 | 10 | OKR: lifecycle status + cascade linking |
| **Sprint 10** | US-017, US-018 | 11 | OKR: filter bar + pre-set filters |
| **Sprint 11** | US-019, US-020 | 13 | OKR: saved filters + view modes |
| **Sprint 12** | US-025, US-026 | 10 | Programs: dashboard + CRUD form |
| **Sprint 13** | US-027, US-028 | 10 | Programs: detail view + progress rollup |
| **Sprint 14** | US-030, US-031 | 8 | Metrics: KR list + value update |
| **Sprint 15** | US-029, US-032, US-033 | 9 | Programs activity + progress display + history |
| **Sprint 16** | US-034, US-035, US-036 | 11 | Rituals: dashboard + CRUD + facilitation |
| **Sprint 17** | US-037, US-021, US-022 | 12 | Past rituals + breadcrumbs + cascade nav |
| **Sprint 18** | US-038, US-039 | 11 | Polish: responsive layout + dark mode |

**Total**: 184 points over 18 sprints.

### MVP Cut (P1 Only)

For a faster first release, deliver only Must Have (P1) stories:

| Metric | Value |
|--------|-------|
| Stories | 24 |
| Points | 127 |
| Sprints | 11–13 |
| Excluded | US-003, US-019, US-020, US-021, US-022, US-028, US-029, US-033, US-036, US-037, US-038, US-039 |

---

## Dependency Graph

```mermaid
graph TD
    US001[US-001: Dataverse Schema] --> US002[US-002: Security Roles]
    US001 --> US003[US-003: ALM Pipeline]
    US001 --> US004[US-004: Canvas App Project]
    US002 --> US004

    US004 --> US005[US-005: Sidebar Nav]
    US004 --> US006[US-006: User Context]
    US005 --> US007[US-007: Section Routing]
    US006 --> US007

    US007 --> US011[US-011: OKR List View]

    US011 --> US012[US-012: Objective CRUD]
    US012 --> US013[US-013: Key Result CRUD]
    US013 --> US014[US-014: Metric Definition]
    US012 --> US015[US-015: Lifecycle Mgmt]
    US013 --> US015
    US013 --> US016[US-016: Cascade Linking]
    US012 --> US016

    US011 --> US017[US-017: Filter Bar]
    US017 --> US018[US-018: Pre-set Filters]
    US017 --> US019[US-019: Saved Filters]
    US018 --> US019

    US011 --> US020[US-020: View Modes]
    US011 --> US021[US-021: Breadcrumbs]
    US016 --> US021
    US016 --> US022[US-022: Cascade Nav]
    US021 --> US022

    US013 --> US023[US-023: Task Mgmt]
    US012 --> US024[US-024: Sprint/Program Assign]

    US007 --> US025[US-025: Programs Dashboard]
    US012 --> US025
    US025 --> US026[US-026: Program CRUD]
    US026 --> US027[US-027: Program Detail]
    US027 --> US028[US-028: Progress Rollup]
    US014 --> US028
    US027 --> US029[US-029: Activity Feed]

    US007 --> US030[US-030: My KR List]
    US014 --> US030
    US030 --> US031[US-031: Metric Update]
    US031 --> US032[US-032: Progress Calc]
    US031 --> US033[US-033: Update History]

    US007 --> US034[US-034: Rituals Dashboard]
    US034 --> US035[US-035: Ritual CRUD]
    US035 --> US036[US-036: Facilitation View]
    US035 --> US037[US-037: Past Rituals]

    US007 --> US038[US-038: Responsive Layout]
    US007 --> US039[US-039: Dark Mode]

    MDA[power1Admin MDA]:::mda -.->|data| US011
    MDA -.->|data| US034

    classDef mda fill:#dbeafe,stroke:#3b82f6
```

---

## Platform Considerations

### Power Platform Effort Factors

| Factor | Assessment | Impact |
|--------|-----------|--------|
| **Data model** | 11 custom tables, 4 N:N relationships, self-referential lookups | Complex (3/3) |
| **Business logic** | Status transitions, cascade validation, progress rollup | Medium-High (2.5/3) |
| **Integrations** | Dataverse only, no external connectors needed | Low (1/3) |
| **UI complexity** | 15+ screens, three view modes, hierarchy visualization | Complex (3/3) |
| **Security model** | 5 roles with row-level ownership patterns | Medium (2/3) |
| **Admin screens** | Moved to Model-Driven App — reduced from Canvas App scope | **Reduced** |

### Key Canvas App Risks

- **Delegation**: OKR list filtering with multi-column search must use delegable Dataverse functions only. Non-delegable operations limited to 500/2,000 rows.
- **Hierarchy visualization**: Canvas apps lack native tree rendering. The hierarchy view with connector lines requires custom component or creative use of galleries with calculated indentation.
- **N:N relationships**: Canvas apps have limited native support for N:N. Intersect tables may need to be queried explicitly or use Relate/Unrelate functions.
- **Performance**: Loading Objectives with nested Key Results → Metrics requires careful use of delegation and explicit column selection to avoid large payloads.
- **Progress rollup**: Calculating progress across Objectives → Key Results → Metrics may need a Power Automate flow or Dataverse rollup field for performance.
