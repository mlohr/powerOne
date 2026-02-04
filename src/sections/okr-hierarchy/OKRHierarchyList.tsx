import { useState } from 'react'
import rawData from '@/../product/sections/okr-hierarchy/data.json'
import { OKRHierarchyList } from './components/OKRHierarchyList'
import type { ViewMode, Objective, OrganizationalUnit, Sprint, Program, SavedFilter, User } from '@/../product/sections/okr-hierarchy/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  objectives: Objective[]
  organizationalUnits: OrganizationalUnit[]
  sprints: Sprint[]
  programs: Program[]
  savedFilters: SavedFilter[]
  currentUser: User & { entity: string; domain: string }
}

export default function OKRHierarchyListPreview() {
  const [viewMode, setViewMode] = useState<ViewMode>('full')
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const handleToggleObjective = (objectiveId: string) => {
    setExpandedIds((prev) =>
      prev.includes(objectiveId)
        ? prev.filter((id) => id !== objectiveId)
        : [...prev, objectiveId]
    )
  }

  return (
    <OKRHierarchyList
      objectives={data.objectives}
      organizationalUnits={data.organizationalUnits}
      sprints={data.sprints}
      programs={data.programs}
      savedFilters={data.savedFilters}
      currentUser={data.currentUser}
      viewMode={viewMode}
      expandedObjectiveIds={expandedIds}
      onCreateObjective={() => console.log('Create objective')}
      onCreateKeyResult={(objectiveId?: string) =>
        console.log('Create key result', objectiveId ? `for ${objectiveId}` : 'standalone')
      }
      onEditObjective={(id) => console.log('Edit objective:', id)}
      onEditKeyResult={(id) => console.log('Edit key result:', id)}
      onDeleteObjective={(id) => console.log('Delete objective:', id)}
      onDeleteKeyResult={(id) => console.log('Delete key result:', id)}
      onChangeObjectiveStatus={(id, status) =>
        console.log('Change objective status:', id, 'to', status)
      }
      onChangeKeyResultStatus={(id, status) =>
        console.log('Change key result status:', id, 'to', status)
      }
      onLinkKeyResultToObjective={(krId, objId) =>
        console.log('Link key result', krId, 'to objective', objId)
      }
      onAssignToSprint={(id, sprintId) => console.log('Assign to sprint:', id, sprintId)}
      onAssignToProgram={(id, programIds) =>
        console.log('Assign to programs:', id, programIds)
      }
      onToggleViewMode={(mode) => setViewMode(mode)}
      onToggleObjective={handleToggleObjective}
      onApplyFilter={(id) => console.log('Apply filter:', id)}
      onNavigateHierarchy={(level, unit) => console.log('Navigate to:', level, unit)}
      onFilterChange={(criteria) => console.log('Filter change:', criteria)}
    />
  )
}
