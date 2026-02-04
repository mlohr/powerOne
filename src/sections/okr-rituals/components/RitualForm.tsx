import { useState, useEffect } from 'react'
import type { RitualFormProps } from '@/../product/sections/okr-rituals/types'
import { X, Save, Calendar, Clock, Target, Users } from 'lucide-react'

const ritualTypes = [
  { value: 'planning', label: 'Planning Session', color: 'teal' },
  { value: 'check-in', label: 'Check-in', color: 'blue' },
  { value: 'review', label: 'Review', color: 'purple' },
  { value: 'retrospective', label: 'Retrospective', color: 'amber' }
] as const

export function RitualForm({
  ritual,
  availableSprints = [],
  onSubmit,
  onCancel
}: RitualFormProps) {
  const isEditMode = !!ritual

  // Form state
  const [formData, setFormData] = useState({
    type: ritual?.type || 'planning' as const,
    title: ritual?.title || '',
    sprintId: ritual?.sprintId || '',
    dateTime: ritual?.dateTime ? ritual.dateTime.slice(0, 16) : '', // Format for datetime-local input
    facilitator: ritual?.facilitator || '',
    participantCount: ritual?.participantCount || 8,
    duration: ritual?.duration || 60
  })

  // Reset form when ritual changes
  useEffect(() => {
    if (ritual) {
      setFormData({
        type: ritual.type,
        title: ritual.title,
        sprintId: ritual.sprintId,
        dateTime: ritual.dateTime.slice(0, 16),
        facilitator: ritual.facilitator,
        participantCount: ritual.participantCount,
        duration: ritual.duration
      })
    }
  }, [ritual])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Find the sprint name
    const sprint = availableSprints.find(s => s.id === formData.sprintId)

    // Build the ritual object from form data
    const ritualData = {
      type: formData.type,
      title: formData.title,
      sprintId: formData.sprintId,
      sprintName: sprint?.name || '',
      dateTime: new Date(formData.dateTime).toISOString(),
      facilitator: formData.facilitator,
      participantCount: formData.participantCount,
      duration: formData.duration,
      status: 'upcoming' as const,
      notes: ''
    }

    onSubmit?.(ritualData)
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end animate-fade-in">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isEditMode ? 'Edit Ritual' : 'Schedule New Ritual'}
              </h2>
              <p className="text-sm text-teal-50 dark:text-teal-100">
                {isEditMode ? 'Update ritual details' : 'Create a planning session, check-in, review, or retrospective'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Ritual Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Ritual Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ritualTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.type === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-950/30`
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`font-semibold ${
                      formData.type === type.value
                        ? `text-${type.color}-700 dark:text-${type.color}-300`
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="ritual-title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Title *
              </label>
              <input
                id="ritual-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Q1 2026 Planning Session"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sprint */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                <label htmlFor="ritual-sprint" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Sprint *
                </label>
              </div>
              <select
                id="ritual-sprint"
                required
                value={formData.sprintId}
                onChange={(e) => setFormData(prev => ({ ...prev, sprintId: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Select a sprint...</option>
                {availableSprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  <label htmlFor="ritual-datetime" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Date & Time *
                  </label>
                </div>
                <input
                  id="ritual-datetime"
                  type="datetime-local"
                  required
                  value={formData.dateTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                  <label htmlFor="ritual-duration" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Duration (minutes) *
                  </label>
                </div>
                <input
                  id="ritual-duration"
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Facilitator & Participants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ritual-facilitator" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Facilitator *
                </label>
                <input
                  id="ritual-facilitator"
                  type="text"
                  required
                  value={formData.facilitator}
                  onChange={(e) => setFormData(prev => ({ ...prev, facilitator: e.target.value }))}
                  placeholder="e.g., Sarah Chen"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                  <label htmlFor="ritual-participants" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Participants *
                  </label>
                </div>
                <input
                  id="ritual-participants"
                  type="number"
                  required
                  min="1"
                  value={formData.participantCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, participantCount: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Info box */}
            <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl p-4">
              <p className="text-sm text-teal-800 dark:text-teal-200 font-medium mb-2">
                💡 About Rituals
              </p>
              <ul className="text-sm text-teal-700 dark:text-teal-300 space-y-1">
                <li>• Rituals help teams stay aligned on OKRs throughout the sprint</li>
                <li>• Capture notes during the session to document decisions and outcomes</li>
                <li>• Past rituals are accessible for historical reference</li>
              </ul>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="shrink-0 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.sprintId || !formData.dateTime || !formData.facilitator}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 dark:hover:from-teal-600 dark:hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              {isEditMode ? 'Save Changes' : 'Schedule Ritual'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
