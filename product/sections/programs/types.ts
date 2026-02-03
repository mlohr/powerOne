// =============================================================================
// Data Types
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
// Component Props
// =============================================================================

export interface ProgramsDashboardProps {
  /** The list of programs to display on the dashboard */
  programs: Program[]
  /** Called when user wants to create a new program */
  onCreate?: () => void
  /** Called when user wants to view a program's details */
  onView?: (programId: string) => void
  /** Called when user wants to edit a program */
  onEdit?: (programId: string) => void
  /** Called when user wants to delete a program */
  onDelete?: (programId: string) => void
  /** Called when user searches by program name */
  onSearch?: (query: string) => void
  /** Called when user filters by program lead */
  onFilterByLead?: (leadUserId: string) => void
  /** Called when user filters by entity */
  onFilterByEntity?: (entity: string) => void
}

export interface ProgramDetailProps {
  /** The program to display in detail view */
  program: Program
  /** Called when user wants to edit the program */
  onEdit?: () => void
  /** Called when user wants to delete the program */
  onDelete?: () => void
  /** Called when user wants to navigate to a linked objective */
  onViewObjective?: (objectiveId: string) => void
  /** Called when user wants to go back to the dashboard */
  onBack?: () => void
}

export interface ProgramFormProps {
  /** The program being edited (undefined for create mode) */
  program?: Program
  /** Called when user submits the form */
  onSubmit?: (program: Partial<Program>) => void
  /** Called when user cancels the form */
  onCancel?: () => void
  /** Available users to select as program leads */
  availableLeads?: ProgramLead[]
  /** Available objectives to link to the program */
  availableObjectives?: LinkedObjective[]
  /** Available organizational units for entity scope */
  availableEntities?: string[]
}
