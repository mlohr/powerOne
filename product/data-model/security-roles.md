# PowerOne Security Roles

> **Target**: Microsoft Dataverse (Power Platform)
> **Publisher prefix**: `po_`

---

## Overview

PowerOne uses Dataverse's role-based security model to control access to OKR data. Security roles define what users can do with records (Create, Read, Write, Delete, Append, AppendTo, Assign, Share) and at what scope (User, Business Unit, Organization).

### Access Levels

| Level | Code | Description |
|-------|------|-------------|
| None | 0 | No access |
| User | 1 | Own records only |
| Business Unit | 2 | Records in user's business unit |
| Parent:Child BU | 3 | Records in user's BU and child BUs |
| Organization | 4 | All records in the organization |

### Privilege Types

| Privilege | Description |
|-----------|-------------|
| Create | Add new records |
| Read | View records |
| Write | Modify existing records |
| Delete | Remove records |
| Append | Attach another record to this record |
| AppendTo | Be attached to another record |
| Assign | Change record ownership |
| Share | Grant access to another user |

---

## Security Role Definitions

### 1. PowerOne Admin

**Purpose**: System administrators who maintain master data, organizational structure, sprints, and rituals.

**Typical Users**: OKR Program Managers, System Administrators

| Table | Create | Read | Write | Delete | Append | AppendTo | Assign | Share |
|-------|--------|------|-------|--------|--------|----------|--------|-------|
| OrganizationalUnit | Org | Org | Org | Org | Org | Org | Org | Org |
| Objective | Org | Org | Org | Org | Org | Org | Org | Org |
| KeyResult | Org | Org | Org | Org | Org | Org | Org | Org |
| Metric | Org | Org | Org | Org | Org | Org | - | - |
| MetricUpdate | Org | Org | Org | Org | Org | Org | - | - |
| Task | Org | Org | Org | Org | Org | Org | Org | - |
| Program | Org | Org | Org | Org | Org | Org | Org | Org |
| Sprint | Org | Org | Org | Org | Org | Org | - | - |
| Ritual | Org | Org | Org | Org | Org | Org | - | - |
| SavedFilter | Org | Org | Org | Org | Org | Org | - | - |
| ActivityUpdate | Org | Org | Org | Org | Org | Org | - | - |

---

### 2. PowerOne User

**Purpose**: Standard users who participate in the OKR process - view OKRs, manage their own content.

**Typical Users**: All employees using the OKR system

| Table | Create | Read | Write | Delete | Append | AppendTo | Assign | Share |
|-------|--------|------|-------|--------|--------|----------|--------|-------|
| OrganizationalUnit | - | Org | - | - | - | Org | - | - |
| Objective | - | Org | - | - | - | Org | - | - |
| KeyResult | - | Org | - | - | - | Org | - | - |
| Metric | - | Org | - | - | - | Org | - | - |
| MetricUpdate | - | Org | - | - | - | - | - | - |
| Task | - | Org | User | - | - | Org | - | - |
| Program | - | Org | - | - | - | Org | - | - |
| Sprint | - | Org | - | - | - | Org | - | - |
| Ritual | - | Org | - | - | - | - | - | - |
| SavedFilter | User | Org | User | User | - | - | - | - |
| ActivityUpdate | - | Org | - | - | - | - | - | - |

**Notes**:
- Can view all OKR data across the organization
- Can only write to Tasks assigned to them
- Can create and manage their own SavedFilters
- Can read shared SavedFilters from others

---

### 3. PowerOne Objective Owner

**Purpose**: Users who own and manage Objectives and their Key Results.

**Typical Users**: Managers, Team Leads, anyone assigned as an Objective Owner

**Inherits from**: PowerOne User (assign both roles)

| Table | Create | Read | Write | Delete | Append | AppendTo | Assign | Share |
|-------|--------|------|-------|--------|--------|----------|--------|-------|
| Objective | User | Org | User | - | User | Org | - | User |
| KeyResult | User | Org | User | User | User | Org | - | - |
| Metric | User | Org | User | User | User | Org | - | - |
| Task | User | Org | User | User | User | Org | User | - |

**Notes**:
- Can create Objectives (owned by them)
- Can edit Objectives they own
- Can create/edit/delete Key Results on their Objectives
- Can create/edit/delete Metrics on their Key Results
- Can share their Objectives for collaboration
- Cannot delete Objectives (Admin action)

---

### 4. PowerOne KR Contributor

**Purpose**: Users who contribute to Key Results by updating metrics and tasks.

**Typical Users**: Team members assigned to KeyResultTeam

**Inherits from**: PowerOne User (assign both roles)

| Table | Create | Read | Write | Delete | Append | AppendTo | Assign | Share |
|-------|--------|------|-------|--------|--------|----------|--------|-------|
| KeyResult | - | Org | User | - | User | Org | - | - |
| Metric | - | Org | User | - | User | Org | - | - |
| MetricUpdate | User | Org | User | User | User | Org | - | - |
| Task | User | Org | User | User | User | Org | - | - |

**Notes**:
- Can update Key Results they're assigned to (via team membership)
- Can update Metrics on their Key Results
- Can create MetricUpdates to track progress
- Can create and manage Tasks on their Key Results
- Uses Dataverse team-based sharing for KeyResultTeam access

---

### 5. PowerOne Viewer

**Purpose**: Read-only access to view OKR data without modification capabilities.

**Typical Users**: Executives, stakeholders, auditors who need visibility but not edit access

| Table | Create | Read | Write | Delete | Append | AppendTo | Assign | Share |
|-------|--------|------|-------|--------|--------|----------|--------|-------|
| OrganizationalUnit | - | Org | - | - | - | - | - | - |
| Objective | - | Org | - | - | - | - | - | - |
| KeyResult | - | Org | - | - | - | - | - | - |
| Metric | - | Org | - | - | - | - | - | - |
| MetricUpdate | - | Org | - | - | - | - | - | - |
| Task | - | Org | - | - | - | - | - | - |
| Program | - | Org | - | - | - | - | - | - |
| Sprint | - | Org | - | - | - | - | - | - |
| Ritual | - | Org | - | - | - | - | - | - |
| SavedFilter | User | Org | User | User | - | - | - | - |
| ActivityUpdate | - | Org | - | - | - | - | - | - |

**Notes**:
- Read-only access to all OKR data
- Can create personal SavedFilters for convenience
- No create/edit/delete on OKR content

---

## Role Assignment Guidelines

### Typical Role Combinations

| User Type | Roles to Assign |
|-----------|-----------------|
| System Admin | PowerOne Admin |
| OKR Program Manager | PowerOne Admin |
| Department Head | PowerOne User + PowerOne Objective Owner |
| Team Lead | PowerOne User + PowerOne Objective Owner |
| Team Member | PowerOne User + PowerOne KR Contributor |
| Individual Contributor | PowerOne User |
| Executive (view only) | PowerOne Viewer |

### Notes on Role Inheritance

- Dataverse security roles are **cumulative** - users get the union of all privileges from all assigned roles
- Always assign **PowerOne User** as a base role before adding specialized roles
- **PowerOne Admin** is standalone and provides full access
- **PowerOne Viewer** is standalone for read-only access

---

## Implementation Notes

### Privilege Naming Convention

Dataverse privileges follow the pattern: `prv` + `Verb` + `TableSchemaName`

For PowerOne custom tables:
- `prvCreatepo_Objective`
- `prvReadpo_Objective`
- `prvWritepo_Objective`
- `prvDeletepo_Objective`
- `prvAppendpo_Objective`
- `prvAppendTopo_Objective`
- `prvAssignpo_Objective`
- `prvSharepo_Objective`

### Access Level Values (Depth)

When using the Web API `AddPrivilegesRole` action:
- `"None"` or `0` - No access
- `"Basic"` or `1` - User level
- `"Local"` or `2` - Business Unit level
- `"Deep"` or `3` - Parent:Child BU level
- `"Global"` or `4` - Organization level

### Standard Tables Required

All roles require read access to standard system tables:
- `systemuser` - For user lookups and assignments
- `team` - For KeyResultTeam functionality
- `businessunit` - For organizational context

---

## Security Considerations

1. **Principle of Least Privilege**: Start with PowerOne User or PowerOne Viewer and add roles as needed

2. **Data Visibility**: All roles can read all OKR data by design (OKR transparency principle)

3. **Sensitive Filters**: SavedFilters can contain criteria that reveal organizational strategy - handled via user-level access

4. **Audit Trail**: ActivityUpdate provides audit logging for Program changes - read-only for most users

5. **Team-Based Access**: KeyResultTeam uses Dataverse owner teams for collaborative metric updates
