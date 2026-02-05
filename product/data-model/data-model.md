# Data Model

## Entities

### OrganizationalUnit
Master data representing a specific organizational unit within the company hierarchy. Each unit has a name, organizational level (Group, Entity, Domain, Department, Team), and optional parent reference. Examples:
- Group level: "group" (single instance)
- Entity level: "Germany", "Portugal", "India"
- Domain level: "New Business Development", "Production", "After-/Sales", "HR", "Finance"
- Department level: specific department names within domains
- Team level: specific team names within departments

Managed by Admins and used for organizing Objectives and filtering across the hierarchy.

### User
A person in the organization who interacts with OKRs and Programs.

### Admin
A user role with permissions to maintain master data, organizational structure, system configuration, and manage rituals.

### ObjectiveOwner
A user with lifecycle responsibility for an Objective, managing transitions through Draft → Accepted → Active → Done → Archived / Cancelled states.

### ProgramLead
A user (or co-leads) responsible for leading a Program.

### KeyResultTeam
A group of users responsible for managing progress and metric updates for a Key Result.

### Objective
An outcome-focused goal at any organizational level. Has a lifecycle of Draft → Accepted → Active → Done → Archived / Cancelled.

### KeyResult
A metric-driven measure of success for an Objective. Has a lifecycle of Draft → Accepted → Active → Done → Archived / Cancelled.

### Metric
Defines how progress is quantified for a Key Result. Includes name, scale (%, absolute, score), baseline value, target value, and direction (increase/decrease).

### MetricUpdate
A historical snapshot of a Metric's value at a specific point in time.

### Program
A cross-entity strategic initiative that connects to multiple Objectives, providing visibility for initiatives that span teams, departments, and entities.

### Task
A concrete to-do item assigned to a Key Result. Each task has a short description, an assigned owner (User), and a status (open or completed). Tasks bridge strategy to daily work without polluting the OKR structure.

### Sprint
A time period with a naming convention of "year.number" (e.g., 26.1, 26.2), defined by start and end dates. Has a lifecycle of inactive → active → done, with only one Sprint active at a time based on current date.

### Ritual
A planning session, check-in, review, or retrospective event linked to a Sprint.

### SavedFilter
A user-defined filter configuration that stores filter criteria (organizational level, status, owner, sprint, etc.) and can be saved, named, and reused. Users can create custom filters and optionally share them with others.

## Relationships

### Organizational Hierarchy
- OrganizationalUnit of level Group contains the entire organization (single instance: "group")
- OrganizationalUnit of level Entity has parent reference to Group organizational unit
- OrganizationalUnit of level Domain has parent reference to Entity organizational unit
- OrganizationalUnit of level Department has parent reference to Domain organizational unit
- OrganizationalUnit of level Team has parent reference to Department organizational unit
- User belongs to one or more OrganizationalUnits (typically Team or Department level)

### OKR Structure
- Objective belongs to one OrganizationalUnit (which determines its organizational level)
- Objective has many Key Results
- Objective is assigned to one Sprint
- Key Result belongs to one Objective
- Key Result can link to a lower-level Objective (for cascading alignment)
- Key Result has many Metrics (typically 1-3)
- Metric belongs to exactly one Key Result
- Metric has many MetricUpdates (historical snapshots)
- MetricUpdate belongs to one Metric

### Strategic Connections
- Program can be assigned to many Objectives
- Objective can belong to one or more Programs
- Task can be assigned to one Key Result
- Key Result can have many Tasks
- Task has one assigned owner (User)
- User can be assigned to many Tasks

### Ownership & Responsibility
- ObjectiveOwner (a User) owns one or more Objectives
- Objective has one ObjectiveOwner
- ProgramLead (one or more Users) leads a Program
- Program has one or more ProgramLeads
- KeyResultTeam (group of Users) is responsible for one Key Result
- Key Result has one KeyResultTeam
- Admin (a User role) manages master data, organizational structure, and Rituals

### Process & Time
- Sprint has many Objectives (with their Key Results)
- Sprint has many Rituals (planning, check-ins, reviews, retrospectives)
- Objective is assigned to one Sprint
- Ritual is linked to one Sprint
- Metric values are tracked and updated during the Sprint
- Only one Sprint is active at a time (determined by current date within start/end boundaries)

### User Preferences
- User has many SavedFilters
- SavedFilter belongs to one User (the creator)
- SavedFilter can optionally be shared with other Users
