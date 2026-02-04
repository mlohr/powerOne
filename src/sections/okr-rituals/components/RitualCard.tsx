import type { Ritual } from '@/../product/sections/okr-rituals/types'
import { Calendar, Clock, Users, Target, Play, CheckCircle } from 'lucide-react'

interface RitualCardProps {
  ritual: Ritual
  onView?: () => void
  onFacilitate?: () => void
}

const ritualTypeConfig = {
  planning: {
    label: 'Planning',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-teal-200 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-300'
  },
  'check-in': {
    label: 'Check-in',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  review: {
    label: 'Review',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300'
  },
  retrospective: {
    label: 'Retrospective',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300'
  }
}

export function RitualCard({ ritual, onView, onFacilitate }: RitualCardProps) {
  const config = ritualTypeConfig[ritual.type]

  // Format date/time
  const date = new Date(ritual.dateTime)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const isUpcoming = ritual.status === 'upcoming'
  const isCompleted = ritual.status === 'completed'

  return (
    <div
      onClick={onView}
      className={`group relative bg-white dark:bg-slate-900 rounded-xl border ${config.borderColor} hover:border-teal-400 dark:hover:border-teal-500 p-5 transition-all duration-200 hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer overflow-hidden`}
    >
      {/* Ritual type badge */}
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
          <span className={`text-sm font-semibold ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        {isCompleted && (
          <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
        {ritual.title}
      </h3>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" strokeWidth={2} />
          <span className="text-sm text-slate-600 dark:text-slate-400">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" strokeWidth={2} />
          <span className="text-sm text-slate-600 dark:text-slate-400">{timeStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-400" strokeWidth={2} />
          <span className="text-sm text-slate-600 dark:text-slate-400">{ritual.sprintName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" strokeWidth={2} />
          <span className="text-sm text-slate-600 dark:text-slate-400">{ritual.participantCount} people</span>
        </div>
      </div>

      {/* Facilitator */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Led by <span className="font-medium text-slate-700 dark:text-slate-300">{ritual.facilitator}</span>
        </span>

        {isUpcoming && onFacilitate && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFacilitate()
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 dark:bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
          >
            <Play className="w-3.5 h-3.5" strokeWidth={2} fill="currentColor" />
            Start
          </button>
        )}
      </div>
    </div>
  )
}
