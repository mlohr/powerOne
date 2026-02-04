import { useState } from 'react'
import rawData from '@/../product/sections/okr-rituals/data.json'
import { RitualFacilitation } from './components/RitualFacilitation'
import type { Ritual } from '@/../product/sections/okr-rituals/types'

// Cast JSON data to proper types
const data = rawData as unknown as {
  rituals: Ritual[]
}

export default function RitualFacilitationPreview() {
  const [selectedRitualId, setSelectedRitualId] = useState<string | null>(null)

  // Find rituals for different states
  const upcomingRitual = data.rituals.find(r => r.status === 'upcoming')
  const completedRitual = data.rituals.find(r => r.status === 'completed')

  // Use selected ritual or default to upcoming
  const ritual = selectedRitualId
    ? data.rituals.find(r => r.id === selectedRitualId) || upcomingRitual
    : upcomingRitual

  if (!ritual) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">No rituals available for preview</p>
        </div>
      </div>
    )
  }

  // Show selector if no ritual is selected
  if (!selectedRitualId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Ritual Facilitation Preview
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select a ritual to preview the facilitation view
          </p>
          <div className="flex flex-col gap-3">
            {upcomingRitual && (
              <button
                onClick={() => setSelectedRitualId(upcomingRitual.id)}
                className="px-5 py-3 bg-teal-600 dark:bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              >
                Preview Upcoming Ritual (Editable)
              </button>
            )}
            {completedRitual && (
              <button
                onClick={() => setSelectedRitualId(completedRitual.id)}
                className="px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Preview Completed Ritual (Read-only)
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <RitualFacilitation
      ritual={ritual}
      onSaveNotes={(notes) => {
        console.log('Save notes:', notes)
      }}
      onMarkCompleted={() => {
        console.log('Mark ritual as completed:', ritual.id)
      }}
      onEdit={() => {
        console.log('Edit ritual:', ritual.id)
      }}
      onDelete={() => {
        console.log('Delete ritual:', ritual.id)
        setSelectedRitualId(null)
      }}
      onBack={() => {
        console.log('Back to dashboard')
        setSelectedRitualId(null)
      }}
    />
  )
}
