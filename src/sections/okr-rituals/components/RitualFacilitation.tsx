import { useState, useEffect } from 'react'
import type { RitualDetailProps } from '@/../product/sections/okr-rituals/types'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Target,
  Save,
  CheckCircle,
  Edit,
  Trash2,
  Sparkles
} from 'lucide-react'

const ritualTypeConfig = {
  planning: {
    label: 'Planning Session',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-900/50'
  },
  'check-in': {
    label: 'Check-in',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50'
  },
  review: {
    label: 'Review',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50'
  },
  retrospective: {
    label: 'Retrospective',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50'
  }
}

export function RitualFacilitation({
  ritual,
  onSaveNotes,
  onMarkCompleted,
  onEdit,
  onDelete,
  onBack
}: RitualDetailProps) {
  const config = ritualTypeConfig[ritual.type]
  const [notes, setNotes] = useState(ritual.notes)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Track changes to notes
  useEffect(() => {
    setHasUnsavedChanges(notes !== ritual.notes)
  }, [notes, ritual.notes])

  // Format date/time
  const date = new Date(ritual.dateTime)
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

  const isInProgress = ritual.status === 'in-progress'
  const isCompleted = ritual.status === 'completed'

  const handleSaveNotes = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate save
    onSaveNotes?.(notes)
    setIsSaving(false)
    setHasUnsavedChanges(false)
  }

  const handleMarkCompleted = () => {
    if (hasUnsavedChanges) {
      handleSaveNotes().then(() => {
        onMarkCompleted?.()
      })
    } else {
      onMarkCompleted?.()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} dark:from-${ritual.type === 'planning' ? 'teal' : ritual.type === 'check-in' ? 'blue' : ritual.type === 'review' ? 'purple' : 'amber'}-600 dark:to-${ritual.type === 'planning' ? 'teal' : ritual.type === 'check-in' ? 'blue' : ritual.type === 'review' ? 'purple' : 'amber'}-700`}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
            Back to Dashboard
          </button>

          {/* Ritual header info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30`}>
                  <span className="text-sm font-semibold text-white">
                    {config.label}
                  </span>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                    <CheckCircle className="w-4 h-4 text-white" strokeWidth={2} />
                    <span className="text-sm font-semibold text-white">Completed</span>
                  </div>
                )}
                {isInProgress && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <span className="text-sm font-semibold text-white">In Progress</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {ritual.title}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white/80" strokeWidth={2} />
                  <div>
                    <p className="text-xs text-white/70 font-medium">Date</p>
                    <p className="text-sm text-white font-semibold">{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/80" strokeWidth={2} />
                  <div>
                    <p className="text-xs text-white/70 font-medium">Time</p>
                    <p className="text-sm text-white font-semibold">{timeStr} ({ritual.duration}m)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-white/80" strokeWidth={2} />
                  <div>
                    <p className="text-xs text-white/70 font-medium">Sprint</p>
                    <p className="text-sm text-white font-semibold">{ritual.sprintName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-white/80" strokeWidth={2} />
                  <div>
                    <p className="text-xs text-white/70 font-medium">Participants</p>
                    <p className="text-sm text-white font-semibold">{ritual.participantCount} people</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!isCompleted && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={onEdit}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                  title="Edit ritual details"
                >
                  <Edit className="w-5 h-5" strokeWidth={2} />
                </button>
                <button
                  onClick={onDelete}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white transition-all"
                  title="Delete ritual"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>

          {/* Facilitator badge */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white/70" strokeWidth={2} />
            <span className="text-sm text-white/90">
              Facilitated by <span className="font-semibold text-white">{ritual.facilitator}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Notes section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          {/* Section header */}
          <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {isCompleted ? 'Session Notes' : 'Capture Notes'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {isCompleted
                    ? 'Review the notes captured during this session'
                    : 'Document key discussion points, decisions, and action items in real-time'
                  }
                </p>
              </div>

              {hasUnsavedChanges && !isCompleted && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse"></div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Unsaved changes
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes textarea or display */}
          <div className="p-6">
            {isCompleted ? (
              // Read-only markdown-style display for completed rituals
              notes ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {notes}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">
                    No notes were captured for this session.
                  </p>
                </div>
              )
            ) : (
              // Editable textarea for upcoming/in-progress rituals
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Start typing your notes here...

Use markdown formatting:
## Headings for major sections
- Bullet points for lists
**Bold** for emphasis

Example structure:
## Key Discussion Points
- Point 1
- Point 2

## Decisions Made
- Decision 1
- Decision 2

## Action Items
- [ ] Action 1
- [ ] Action 2"
                className="w-full h-[600px] px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed"
              />
            )}
          </div>
        </div>

        {/* Action buttons for non-completed rituals */}
        {!isCompleted && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {hasUnsavedChanges
                ? 'Remember to save your notes before marking as completed'
                : notes
                ? 'Your notes are saved'
                : 'No notes captured yet'
              }
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveNotes}
                disabled={!hasUnsavedChanges || isSaving}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>

              <button
                onClick={handleMarkCompleted}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r ${config.color} text-white rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl`}
              >
                <CheckCircle className="w-4 h-4" strokeWidth={2} />
                Mark as Completed
              </button>
            </div>
          </div>
        )}

        {/* Helpful tips for facilitation */}
        {!isCompleted && (
          <div className={`mt-6 ${config.bgColor} border ${config.borderColor} rounded-xl p-5`}>
            <p className={`text-sm ${config.textColor} font-medium mb-2`}>
              💡 Facilitation Tips
            </p>
            <ul className={`text-sm ${config.textColor} space-y-1`}>
              <li>• Use headings (##) to organize notes into clear sections</li>
              <li>• Capture decisions and action items with clear owners</li>
              <li>• Notes are saved automatically when you click "Save Notes"</li>
              <li>• Mark as completed when the session is finished to lock the notes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
