// =============================================================================
// Core Shared Types
// =============================================================================

export type OrganizationalLevel = 'Group' | 'Entity' | 'Domain' | 'Department' | 'Team'

export interface OrganizationalUnit {
  id: string
  name: string
  level: OrganizationalLevel
  parentId: string | null
}

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string | null
}

export type SprintStatus = 'inactive' | 'active' | 'done'

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: SprintStatus
}

export type LifecycleStatus = 'Draft' | 'Accepted' | 'Active' | 'Done' | 'Archived' | 'Cancelled'

// =============================================================================
// OKR Hierarchy Types
// =============================================================================

export type ObjectiveStatus = LifecycleStatus
export type KeyResultStatus = LifecycleStatus
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
  organizationalLevel?: OrganizationalLevel
  organizationalUnit?: string
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
// Metric Types
// =============================================================================

export type MetricScale = 'percentage' | 'absolute' | 'score'
export type MetricDirection = 'increase' | 'decrease'

export interface MetricDefinition {
  name: string
  scale: MetricScale
  baselineValue: number
  targetValue: number
  direction: MetricDirection
}

export interface Metric {
  id: string
  name: string
  scale: MetricScale
  direction: MetricDirection
  baseline: number
  currentValue: number
  target: number
  unit: string
}

export interface KeyResultWithMetrics {
  id: string
  title: string
  objectiveId: string
  sprintId: string
  status: LifecycleStatus
  metrics: Metric[]
}

// =============================================================================
// Program Types
// =============================================================================

export interface ProgramLead {
  userId: string
  name: string
  initials: string
  email: string
}

export interface LinkedObjective {
  id: string
  title: string
  organizationalUnit: string
  progress: number
  owner: string
}

export interface ActivityUpdate {
  id: string
  timestamp: string
  type: 'program_created' | 'program_edited' | 'objective_added' | 'objective_removed' | 'progress_update' | 'lead_added' | 'lead_removed'
  user: string
  description: string
}

export interface Program {
  id: string
  name: string
  description: string
  leads: ProgramLead[]
  linkedObjectives: LinkedObjective[]
  overallProgress: number
  entitiesInvolved: string[]
  activityUpdates: ActivityUpdate[]
}

// =============================================================================
// Ritual Types
// =============================================================================

export interface Ritual {
  id: string
  type: 'planning' | 'check-in' | 'review' | 'retrospective'
  title: string
  sprintId: string
  sprintName: string
  dateTime: string
  facilitator: string
  status: 'upcoming' | 'in-progress' | 'completed'
  notes: string
  participantCount: number
  duration: number
}
