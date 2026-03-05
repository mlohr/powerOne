# Data Model

## Entities

### OrganizationalUnit
Master data for organizational hierarchy. Levels: Group → Entity → Domain → Department → Team. Each unit has optional parent reference. Managed by Admins.

### User
A person in the organization. Has name, email, and optional avatar.

### Objective
Outcome-focused goal. Belongs to an OrganizationalUnit. Lifecycle: Draft → Accepted → Active → Done → Archived/Cancelled. Assigned to one Sprint.

### KeyResult
Metric-driven measure of success for an Objective. Has 1-3 Metrics, optional cascade link to lower-level Objective.

### Metric
Defines how KR progress is quantified. Fields: name, scale (percentage/absolute/score), baseline, target, direction (increase/decrease).

### MetricUpdate
Historical snapshot of a Metric value at a point in time.

### Program
Cross-entity strategic initiative. Links to multiple Objectives. Has one or more ProgramLeads.

### Task
Concrete work item assigned to a KeyResult. Has description, owner (User), and status (open/completed).

### Sprint
Time period named "year.number" (e.g., 26.1). Lifecycle: inactive → active → done. Only one active at a time.

### Ritual
Planning/check-in/review/retrospective session linked to a Sprint.

### SavedFilter
User-defined filter criteria for the OKR Hierarchy view. Can be shared.

## Relationships

- OrganizationalUnit has parent reference (Group > Entity > Domain > Department > Team)
- User belongs to one or more OrganizationalUnits
- Objective belongs to one OrganizationalUnit, one Sprint, has many KeyResults
- KeyResult belongs to one Objective, has many Metrics, optional cascade link to child Objective
- Metric belongs to one KeyResult, has many MetricUpdates
- Program assigned to many Objectives; Objective can belong to many Programs
- Task assigned to one KeyResult, one owner (User)
- Sprint has many Objectives and Rituals
- SavedFilter belongs to one User (creator), optionally shared

## Notes for Implementation

- Organizational units are master data — created/managed by Admins
- Only one Sprint is active at a time (based on current date)
- KR progress is calculated from Metric current values vs. targets
- Objective progress rolls up from its Key Results
- Program progress rolls up from linked Objectives
- Cascade links: a KR at higher level links to an Objective at lower level
