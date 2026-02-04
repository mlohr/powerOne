import { useState } from 'react'
import rawData from '@/../product/sections/programs/data.json'
import { ProgramForm } from './components/ProgramForm'
import type { Program } from '@/../product/sections/programs/types'

// Cast JSON data to proper types
const data = rawData as unknown as { programs: Program[] }

export default function ProgramFormPreview() {
  const [isOpen, setIsOpen] = useState(true)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  // For edit mode, use the first program
  const programToEdit = mode === 'edit' ? data.programs[0] : undefined

  // Collect all unique leads from programs
  const allLeads = Array.from(
    new Set(
      data.programs.flatMap(p => p.leads.map(l => JSON.stringify(l)))
    )
  ).map(json => JSON.parse(json))

  // Collect all objectives
  const allObjectives = Array.from(
    new Set(
      data.programs.flatMap(p => p.linkedObjectives.map(o => JSON.stringify(o)))
    )
  ).map(json => JSON.parse(json))

  // Collect all entities
  const allEntities = Array.from(
    new Set(data.programs.flatMap(p => p.entitiesInvolved))
  ).sort()

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Program Form Preview
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Click a button below to preview the form
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setMode('create')
                setIsOpen(true)
              }}
              className="px-5 py-3 bg-teal-600 dark:bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
            >
              Create Mode
            </button>
            <button
              onClick={() => {
                setMode('edit')
                setIsOpen(true)
              }}
              className="px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Edit Mode
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProgramForm
      program={programToEdit}
      onSubmit={(programData) => {
        console.log('Submit program:', programData)
        setIsOpen(false)
      }}
      onCancel={() => {
        console.log('Cancel form')
        setIsOpen(false)
      }}
      availableLeads={allLeads}
      availableObjectives={allObjectives}
      availableEntities={allEntities}
    />
  )
}
