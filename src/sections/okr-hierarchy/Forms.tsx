import { useState } from 'react'
import rawData from '@/../product/sections/okr-hierarchy/data.json'
import { ObjectiveForm } from './components/ObjectiveForm'
import { KeyResultForm } from './components/KeyResultForm'
import type { OrganizationalUnit, Sprint, Program, Objective, User } from '@/../product/sections/okr-hierarchy/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  organizationalUnits: OrganizationalUnit[]
  sprints: Sprint[]
  programs: Program[]
  objectives: Objective[]
  currentUser: User & { entity: string; domain: string }
}

export default function FormsPreview() {
  const [objectiveFormOpen, setObjectiveFormOpen] = useState(true)
  const [keyResultFormOpen, setKeyResultFormOpen] = useState(false)

  // Mock users list from data
  const users = [
    data.currentUser,
    ...data.objectives.map((obj) => obj.owner).filter((u, i, arr) =>
      arr.findIndex(user => user.id === u.id) === i
    )
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Form Components Preview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This preview shows the side panel forms for creating and editing Objectives and Key
            Results. Click the buttons below to open each form.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setObjectiveFormOpen(true)}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
            >
              Open Objective Form
            </button>
            <button
              onClick={() => setKeyResultFormOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Open Key Result Form
            </button>
          </div>
        </div>
      </div>

      {/* Objective Form */}
      <ObjectiveForm
        objective={null}
        organizationalUnits={data.organizationalUnits}
        sprints={data.sprints}
        programs={data.programs}
        objectives={data.objectives}
        users={users}
        isOpen={objectiveFormOpen}
        onClose={() => setObjectiveFormOpen(false)}
        onSubmit={(formData) => {
          console.log('Objective form submitted:', formData)
          setObjectiveFormOpen(false)
        }}
        onDelete={() => {
          console.log('Delete objective')
          setObjectiveFormOpen(false)
        }}
      />

      {/* Key Result Form */}
      <KeyResultForm
        keyResult={null}
        objectives={data.objectives}
        preselectedObjectiveId={null}
        isOpen={keyResultFormOpen}
        onClose={() => setKeyResultFormOpen(false)}
        onSubmit={(formData) => {
          console.log('Key Result form submitted:', formData)
          setKeyResultFormOpen(false)
        }}
        onDelete={() => {
          console.log('Delete key result')
          setKeyResultFormOpen(false)
        }}
      />
    </div>
  )
}
