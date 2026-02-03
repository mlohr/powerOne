// =============================================================================
// Data Types
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'inactive' | 'active' | 'done'
}

export interface OrganizationalUnit {
  id: string
  name: string
  level: 'Group' | 'Entity' | 'Domain' | 'Department' | 'Team'
  parentId?: string
}

export interface Objective {
  id: string
  title: string
  organizationalUnitId: string
  sprintId: string
  status: 'Draft' | 'Accepted' | 'Active' | 'Done' | 'Archived' | 'Cancelled'
}

export interface Metric {
  id: string
  name: string
  scale: 'percentage' | 'absolute' | 'score'
  direction: 'increase' | 'decrease'
  baseline: number
  currentValue: number
  target: number
  unit: string
}

export interface KeyResult {
  id: string
  title: string
  objectiveId: string
  sprintId: string
  status: 'Draft' | 'Accepted' | 'Active' | 'Done' | 'Archived' | 'Cancelled'
  metrics: Metric[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface MetricsProgressProps {
  /** The logged-in user viewing the page */
  currentUser: User
  /** The active sprint being displayed */
  activeSprint: Sprint
  /** Organizational units for context/display */
  organizationalUnits: OrganizationalUnit[]
  /** Parent objectives for each Key Result (for context) */
  objectives: Objective[]
  /** The list of Key Results to display (pre-filtered: active sprint + user is on team) */
  keyResults: KeyResult[]
  /** Called when user updates a metric value */
  onUpdateMetric?: (metricId: string, newValue: number) => void
}
