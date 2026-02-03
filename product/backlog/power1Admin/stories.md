# power1Admin — User Story Cards

> Platform: Model-Driven App on Microsoft Dataverse

---

## MDA-001: Create Model-Driven App & Site Map

**Story:** As a developer, I want a Model-Driven App created in the PowerOne solution with a configured site map, so that administrators have a dedicated interface for managing master data.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** model-driven-app, infrastructure, site-map
**Dependencies:** US-001 (Dataverse schema), US-002 (Security roles)

### Acceptance Criteria

- [ ] Model-Driven App created inside the PowerOne solution (same solution as Canvas App)
- [ ] App name: "PowerOne Admin" with appropriate icon
- [ ] Site map configured with area: **Master Data Management**
- [ ] Groups: Organizational Structure, Time Periods
- [ ] Sub-areas: Organizational Units (po_OrganizationalUnit), Sprints (po_Sprint)
- [ ] App opens in a browser and displays the configured navigation
- [ ] App is accessible only to users with Admin security role

### Power Platform Notes

- Use the new unified app designer (modern experience)
- Model-Driven Apps auto-generate forms from Dataverse table definitions
- Site map defines the left navigation — keep it simple with one area for MVP
- Both the Canvas App and Model-Driven App live in the same `po_` solution
- The app is a separate entry in the Power Apps portal — users see it as a distinct application

---

## MDA-002: Organizational Unit Management

**Story:** As an admin, I want forms and views for managing organizational units in the Model-Driven App, so that the org hierarchy is maintained through a purpose-built admin interface.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** model-driven-app, forms, views, org-units
**Dependencies:** MDA-001

### Acceptance Criteria

- [ ] **Main form** configured with fields:
  - Name (required, single line text)
  - Level (required, choice: Group / Entity / Domain / Department / Team)
  - Parent Unit (lookup to po_OrganizationalUnit, self-referential)
  - Description (multi-line text)
- [ ] **Quick Create form** with: Name, Level, Parent Unit
- [ ] **Views configured**:
  - Active Organizational Units (default view)
  - All Organizational Units
  - Units by Level (grouped by po_Level)
- [ ] **Hierarchical view** enabled for visual tree display of org structure
- [ ] **Business rule**: Name is required (form validation)
- [ ] **Business rule**: When Level is "Group", Parent Unit is hidden/disabled (top-level has no parent)
- [ ] Delete protection: cannot delete units with child units (Restrict cascade from schema)
- [ ] Delete protection: cannot delete units with linked Objectives

### Power Platform Notes

- Model-Driven Apps support **hierarchical visualization natively** for self-referential lookups — enable hierarchy settings on po_OrganizationalUnit
- Business rules are configured declaratively in the form designer — no code needed
- Views auto-paginate and support column sorting, filtering, and inline editing
- Quick Create form allows adding records without navigating away from the current context
- Consider adding a sub-grid on the main form showing child organizational units

---

## MDA-003: Sprint Management

**Story:** As an admin, I want forms and views for managing sprints in the Model-Driven App, so that time periods are properly configured for OKR cycles.

**Story Points:** 3
**Priority:** P1 - Must Have
**Tags:** model-driven-app, forms, views, sprints
**Dependencies:** MDA-001

### Acceptance Criteria

- [ ] **Main form** configured with fields:
  - Name (required, single line text, e.g., "1.26")
  - Start Date (required, date only)
  - End Date (required, date only)
  - Status (choice: Inactive / Active / Done)
- [ ] **Views configured**:
  - Active Sprint (filtered to Status = Active)
  - Upcoming Sprints (filtered to Status = Inactive, Start Date > today)
  - Completed Sprints (filtered to Status = Done)
  - All Sprints (sorted by Start Date descending)
- [ ] **Business rule**: End Date must be after Start Date (validation message on form)
- [ ] **Business rule**: Only one sprint can have Status = Active at a time
  - Show warning when activating a sprint if another is already active
- [ ] Delete protection: cannot delete sprints with linked Objectives (Restrict cascade)
- [ ] Status transitions: Inactive → Active → Done (no backwards transitions)

### Power Platform Notes

- Use the built-in Status/Status Reason fields or a custom choice column for sprint status
- Date validation: business rule comparing po_StartDate and po_EndDate with "Show Error Message" action
- Active sprint uniqueness enforcement options:
  - **Option A**: Business rule shows warning (client-side only)
  - **Option B**: Power Automate flow triggered on status change that checks for other active sprints
  - **Recommended**: Start with business rule (Option A), add flow (Option B) if server-side enforcement is needed
- Consider adding a timeline control on the form for visual date range display
- Sub-grid showing linked Objectives provides useful context on the sprint form

---

## MDA-004: User-OrgUnit Assignment

**Story:** As an admin, I want to manage user-organizational unit assignments through the Model-Driven App, so that team membership is maintained for filtering and user context in the Canvas App.

**Story Points:** 2
**Priority:** P1 - Must Have
**Tags:** model-driven-app, relationships, n-n
**Dependencies:** MDA-002

### Acceptance Criteria

- [ ] **Subgrid on Organizational Unit form** showing assigned users
  - Displays: User name, email, business unit
  - "Add Existing User" button for associating users
  - "Remove" button for disassociating users
- [ ] **Associate view** for user lookup: shows name, email, job title
- [ ] A user can belong to multiple organizational units (N:N)
- [ ] Removing a user from an org unit does not delete the user record
- [ ] Changes are reflected in the `po_user_orgunit` N:N intersect table
- [ ] Canvas App can read these assignments for pre-set filters and user context

### Power Platform Notes

- **N:N relationships are managed natively** in Model-Driven Apps via subgrids — no custom code needed
- Associate/Disassociate functionality is built into the subgrid component
- Configure the subgrid to use the `po_user_orgunit` N:N relationship
- The lookup view for adding users should show relevant columns (Full Name, Primary Email)
- Consider also adding a reciprocal subgrid on the System User form (if customizing the user form is in scope)
- Test with the same user assigned to multiple org units to verify N:N behavior

---

## MDA-005: Admin Dashboard

**Story:** As an admin, I want a dashboard in the Model-Driven App with overview charts and quick actions, so that I can monitor master data health at a glance.

**Story Points:** 2
**Priority:** P1 - Must Have
**Tags:** model-driven-app, dashboard, charts
**Dependencies:** MDA-002, MDA-003

### Acceptance Criteria

- [ ] Dashboard set as the **default landing page** in the admin app
- [ ] **Chart**: Organizational Units by Level (bar chart)
- [ ] **Chart**: Sprints by Status (pie chart, Inactive/Active/Done)
- [ ] **List**: Recently modified Organizational Units (top 10)
- [ ] **List**: Upcoming and Active Sprints
- [ ] Dashboard layout: 2-column with charts on top, lists below
- [ ] Dashboard auto-refreshes when navigated to

### Power Platform Notes

- Model-Driven App dashboards are configured declaratively — no code
- Charts are bound to system views — create the views first (done in MDA-002 and MDA-003), then create charts on those views
- Use a **system dashboard** (visible to all admin users) rather than a personal dashboard
- Dashboard layout options: 2-column (regular-wide), 3-column, etc.
- Consider adding a "Quick Create" link for Org Units and Sprints for fast data entry

---

## MDA-006: Security Configuration & Testing

**Story:** As an admin, I want security roles properly configured for the Model-Driven App, so that only authorized administrators can access and modify master data.

**Story Points:** 2
**Priority:** P1 - Must Have
**Tags:** model-driven-app, security, testing
**Dependencies:** MDA-001

### Acceptance Criteria

- [ ] **Admin security role** configured with:
  - Full CRUD on po_OrganizationalUnit
  - Full CRUD on po_Sprint
  - Read on systemuser (for assignment views)
  - Access to the PowerOne Admin Model-Driven App
- [ ] **Non-admin users** cannot see or open the Model-Driven App
  - App visibility controlled by security role assignment
- [ ] **Canvas App users** retain read access to master data tables
  - Verify Canvas App can query org units, sprints, and user-orgunit assignments created in MDA
- [ ] **Audit logging** enabled for po_OrganizationalUnit and po_Sprint tables
  - Changes tracked: who changed what, when
- [ ] **End-to-end testing**:
  - [ ] Admin can create, edit, delete org units
  - [ ] Admin can create, edit, delete sprints
  - [ ] Admin can assign/remove users from org units
  - [ ] Non-admin user cannot access the admin app
  - [ ] Canvas App user can read data created through the admin app

### Power Platform Notes

- Security roles from US-002 provide the base configuration — this story adds MDA-specific privileges
- Model-Driven App visibility is controlled by role assignment: users must have the role that includes the app to see it in their app list
- "Basic User" security role (or equivalent) is a prerequisite for Model-Driven App access
- Audit can be configured at the table level in Power Platform Admin Center → Environments → Audit settings
- Test the cross-app data flow: create data in MDA → verify it appears correctly in the Canvas App's galleries and dropdowns
