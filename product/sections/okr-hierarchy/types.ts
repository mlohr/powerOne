// =============================================================================
// Data Types
// =============================================================================

export type OrganizationalLevel = 'Group' | 'Entity' | 'Domain' | 'Department' | 'Team'

export interface OrganizationalUnit {
  id: string
  name: string
  level: OrganizationalLevel
  parentId: string | null
}

export type ObjectiveStatus = 'Draft' | 'Accepted' | 'Active' | 'Done' | 'Archived' | 'Cancelled'

export type KeyResultStatus = 'Draft' | 'Accepted' | 'Active' | 'Done' | 'Archived' | 'Cancelled'

export type SprintStatus = 'inactive' | 'active' | 'done'

export interface User {
  id: string
  name: string
  avatar?: string | null
}

export type TaskStatus = 'open' | 'completed'

export interface Task {
  id: string
  keyResultId: string
  description: string
  owner: User
  status: TaskStatus
  createdAt: string
  completedAt?: string | null
}

export interface KeyResult {
  id: string
  title: string
  objectiveId: string
  status: KeyResultStatus
  progress: number
  linkedChildObjectiveId: string | null
  tasks: Task[]
}

export interface Objective {
  id: string
  title: string
  description: string
  organizationalUnitId: string
  organizationalLevel?: OrganizationalLevel  // Derived from organizational unit
  organizationalUnit?: string  // Derived from organizational unit name
  owner: User
  status: ObjectiveStatus
  sprint: string
  progress: number
  programIds: string[]
  parentObjectiveId: string | null
  childObjectiveIds: string[]
  keyResultCount: number
  keyResults: KeyResult[]
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: SprintStatus
}

export interface ProgramLead {
  id: string
  name: string
}

export interface Program {
  id: string
  name: string
  description: string
  leads: ProgramLead[]
}

export interface FilterCriteria {
  owner?: string
  organizationalUnitId?: string | string[]
  organizationalLevel?: OrganizationalLevel | OrganizationalLevel[]
  programId?: string | string[]
  status?: ObjectiveStatus | ObjectiveStatus[]
  sprint?: string
}

export interface SavedFilter {
  id: string
  name: string
  isPreset: boolean
  criteria: FilterCriteria
  createdBy: string | null
  isShared: boolean
}

export interface CurrentUser {
  id: string
  name: string
  entity: string
  domain: string
}

export type ViewMode = 'full' | 'compact' | 'hierarchy'

// =============================================================================
// Component Props
// =============================================================================

export interface OKRHierarchyProps {
  /** The list of objectives to display */
  objectives: Objective[]

  /** Available organizational units (master data) */
  organizationalUnits: OrganizationalUnit[]

  /** Available sprints for filtering and assignment */
  sprints: Sprint[]

  /** Available programs for filtering and assignment */
  programs: Program[]

  /** Saved and preset filters */
  savedFilters: SavedFilter[]

  /** Current logged-in user for "My" filters */
  currentUser: CurrentUser

  /** Current view mode (full or compact) */
  viewMode?: ViewMode

  /** Currently active filter */
  activeFilterId?: string | null

  /** IDs of expanded objectives */
  expandedObjectiveIds?: string[]

  /** Called when user wants to create a new objective */
  onCreateObjective?: () => void

  /** Called when user wants to create a new key result */
  onCreateKeyResult?: (objectiveId?: string) => void

  /** Called when user wants to edit an objective */
  onEditObjective?: (objectiveId: string) => void

  /** Called when user wants to edit a key result */
  onEditKeyResult?: (keyResultId: string) => void

  /** Called when user wants to delete an objective */
  onDeleteObjective?: (objectiveId: string) => void

  /** Called when user wants to delete a key result */
  onDeleteKeyResult?: (keyResultId: string) => void

  /** Called when user changes an objective's lifecycle status */
  onChangeObjectiveStatus?: (objectiveId: string, newStatus: ObjectiveStatus) => void

  /** Called when user changes a key result's lifecycle status */
  onChangeKeyResultStatus?: (keyResultId: string, newStatus: KeyResultStatus) => void

  /** Called when user links a key result to a child objective */
  onLinkKeyResultToObjective?: (keyResultId: string, childObjectiveId: string) => void

  /** Called when user assigns an objective to a sprint */
  onAssignToSprint?: (objectiveId: string, sprintId: string) => void

  /** Called when user assigns an objective to a program */
  onAssignToProgram?: (objectiveId: string, programIds: string[]) => void

  /** Called when user toggles between full and compact view */
  onToggleViewMode?: (mode: ViewMode) => void

  /** Called when user expands/collapses an objective */
  onToggleObjective?: (objectiveId: string) => void

  /** Called when user selects a filter */
  onApplyFilter?: (filterId: string) => void

  /** Called when user saves current criteria as a new filter */
  onSaveAsNewFilter?: (name: string, criteria: FilterCriteria, isShared: boolean) => void

  /** Called when user updates an existing saved filter */
  onUpdateFilter?: (filterId: string, criteria: FilterCriteria) => void

  /** Called when user wants to delete a saved filter */
  onDeleteFilter?: (filterId: string) => void

  /** Called when user navigates through organizational hierarchy */
  onNavigateHierarchy?: (level: OrganizationalLevel, unit: string) => void

  /** Called when user changes filter criteria in the filter bar */
  onFilterChange?: (criteria: FilterCriteria) => void

  /** Called when user clears all filters */
  onClearFilters?: () => void

  /** Called when user adds a new task to a key result */
  onAddTask?: (keyResultId: string, description: string, ownerId: string) => void

  /** Called when user toggles a task's completion status */
  onToggleTaskStatus?: (taskId: string) => void

  /** Called when user edits a task */
  onEditTask?: (taskId: string, description: string, ownerId: string) => void

  /** Called when user deletes a task */
  onDeleteTask?: (taskId: string) => void
}

export interface ObjectiveFormData {
  title: string
  description: string
  organizationalUnitId: string
  ownerId: string
  status: ObjectiveStatus
  sprintId: string
  programIds: string[]
  parentObjectiveId: string | null
}

export interface ObjectiveFormProps {
  /** Existing objective data for edit mode, null for create mode */
  objective?: Objective | null

  /** Available organizational units (master data) */
  organizationalUnits: OrganizationalUnit[]

  /** Available sprints for selection */
  sprints: Sprint[]

  /** Available programs for selection */
  programs: Program[]

  /** Available objectives for parent selection */
  objectives: Objective[]

  /** Available users for owner selection */
  users: User[]

  /** Whether the form is open */
  isOpen: boolean

  /** Called when form is closed without saving */
  onClose: () => void

  /** Called when form is submitted with data */
  onSubmit: (data: ObjectiveFormData) => void

  /** Called when user deletes the objective (edit mode only) */
  onDelete?: () => void
}

export type MetricScale = 'percentage' | 'absolute' | 'score'
export type MetricDirection = 'increase' | 'decrease'

export interface MetricDefinition {
  name: string
  scale: MetricScale
  baselineValue: number
  targetValue: number
  direction: MetricDirection
}

export interface KeyResultFormData {
  title: string
  objectiveId: string
  status: KeyResultStatus
  linkedChildObjectiveId: string | null
  metrics: MetricDefinition[]
}

export interface KeyResultFormProps {
  /** Existing key result data for edit mode, null for create mode */
  keyResult?: KeyResult | null

  /** Available objectives for selection and linking */
  objectives: Objective[]

  /** Pre-selected objective ID (when creating from expanded objective) */
  preselectedObjectiveId?: string | null

  /** Whether the form is open */
  isOpen: boolean

  /** Called when form is closed without saving */
  onClose: () => void

  /** Called when form is submitted with data */
  onSubmit: (data: KeyResultFormData) => void

  /** Called when user deletes the key result (edit mode only) */
  onDelete?: () => void
}

export interface FilterFormData {
  name: string
  criteria: FilterCriteria
  isShared: boolean
}

export interface FilterFormProps {
  /** Existing filter data for edit mode, null for create mode */
  filter?: SavedFilter | null

  /** Available organizational units (master data) */
  organizationalUnits: OrganizationalUnit[]

  /** Available objectives for preview and owner selection */
  objectives: Objective[]

  /** Available sprints for selection */
  sprints: Sprint[]

  /** Available programs for selection */
  programs: Program[]

  /** Available users for owner selection */
  users: User[]

  /** Whether the form is open */
  isOpen: boolean

  /** Called when form is closed without saving */
  onClose: () => void

  /** Called when form is submitted with data */
  onSubmit: (data: FilterFormData) => void

  /** Called when user deletes the filter (edit mode only) */
  onDelete?: () => void
}
