import { useState } from 'react'
import rawData from '@/../product/sections/okr-hierarchy/data.json'
import { FilterForm } from './components/FilterForm'
import type { SavedFilter, OrganizationalUnit, Objective, Sprint, Program, User } from '@/../product/sections/okr-hierarchy/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  savedFilters: SavedFilter[]
  organizationalUnits: OrganizationalUnit[]
  objectives: Objective[]
  sprints: Sprint[]
  programs: Program[]
  currentUser: User & { entity: string; domain: string }
}

export default function FilterManagementPreview() {
  const [filterFormOpen, setFilterFormOpen] = useState(true)
  const [editMode, setEditMode] = useState(false)

  // Mock users list from data
  const users = [
    data.currentUser,
    ...data.objectives.map((obj) => obj.owner).filter((u, i, arr) =>
      arr.findIndex(user => user.id === u.id) === i
    )
  ]

  // Example saved filter for edit mode
  const exampleFilter = data.savedFilters.find(f => !f.isPreset) || null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Filter Management Preview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This preview shows the custom filter creation and editing form. Users can create
            saved filters with multiple criteria and share them with others.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditMode(false)
                setFilterFormOpen(true)
              }}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
            >
              Create New Filter
            </button>
            <button
              onClick={() => {
                setEditMode(true)
                setFilterFormOpen(true)
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Edit Existing Filter
            </button>
          </div>
        </div>
      </div>

      {/* Filter Form */}
      <FilterForm
        filter={editMode ? exampleFilter : null}
        organizationalUnits={data.organizationalUnits}
        objectives={data.objectives}
        sprints={data.sprints}
        programs={data.programs}
        users={users}
        isOpen={filterFormOpen}
        onClose={() => setFilterFormOpen(false)}
        onSubmit={(formData) => {
          console.log('Filter form submitted:', formData)
          setFilterFormOpen(false)
        }}
        onDelete={() => {
          console.log('Delete filter')
          setFilterFormOpen(false)
        }}
      />
    </div>
  )
}
