// =============================================================================
// Data Types
// =============================================================================

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'inactive' | 'active' | 'done'
}

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

// =============================================================================
// Component Props
// =============================================================================

export interface RitualsDashboardProps {
  /** The list of rituals to display */
  rituals: Ritual[]
  /** Available sprints for filtering */
  sprints: Sprint[]
  /** Called when user wants to create a new ritual */
  onCreate?: () => void
  /** Called when user wants to view a ritual's details */
  onView?: (ritualId: string) => void
  /** Called when user wants to facilitate a ritual (start the session) */
  onFacilitate?: (ritualId: string) => void
  /** Called when user wants to edit a ritual */
  onEdit?: (ritualId: string) => void
  /** Called when user wants to delete a ritual */
  onDelete?: (ritualId: string) => void
  /** Called when user filters by sprint */
  onFilterBySprint?: (sprintId: string) => void
}

export interface RitualDetailProps {
  /** The ritual to display/facilitate */
  ritual: Ritual
  /** Called when user saves notes during facilitation */
  onSaveNotes?: (notes: string) => void
  /** Called when user marks the ritual as completed */
  onMarkCompleted?: () => void
  /** Called when user wants to edit the ritual details */
  onEdit?: () => void
  /** Called when user wants to delete the ritual */
  onDelete?: () => void
  /** Called when user wants to go back to the dashboard */
  onBack?: () => void
}

export interface RitualFormProps {
  /** The ritual being edited (undefined for create mode) */
  ritual?: Ritual
  /** Available sprints to link the ritual to */
  availableSprints?: Sprint[]
  /** Called when user submits the form */
  onSubmit?: (ritual: Partial<Ritual>) => void
  /** Called when user cancels the form */
  onCancel?: () => void
}
