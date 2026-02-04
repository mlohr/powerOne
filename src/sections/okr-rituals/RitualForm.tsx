import { useState } from 'react'
import rawData from '@/../product/sections/okr-rituals/data.json'
import { RitualForm } from './components/RitualForm'
import type { Ritual, Sprint } from '@/../product/sections/okr-rituals/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  rituals: Ritual[]
  sprints: Sprint[]
}

export default function RitualFormPreview() {
  const [isOpen, setIsOpen] = useState(true)
  const [mode, setMode] = useState<'create' | 'edit'>('create')

  // For edit mode, use the first upcoming ritual
  const ritualToEdit = mode === 'edit'
    ? data.rituals.find(r => r.status === 'upcoming')
    : undefined

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Ritual Form Preview
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
    <RitualForm
      ritual={ritualToEdit}
      availableSprints={data.sprints}
      onSubmit={(ritualData) => {
        console.log('Submit ritual:', ritualData)
        setIsOpen(false)
      }}
      onCancel={() => {
        console.log('Cancel form')
        setIsOpen(false)
      }}
    />
  )
}
