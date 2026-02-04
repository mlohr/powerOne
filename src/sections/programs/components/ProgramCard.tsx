import type { Program } from '@/../product/sections/programs/types'
import { TrendingUp, Users, Target } from 'lucide-react'

interface ProgramCardProps {
  program: Program
  onView?: () => void
  onEdit?: () => void
}

export function ProgramCard({ program, onView, onEdit }: ProgramCardProps) {
  return (
    <article
      onClick={onView}
      className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 dark:hover:shadow-teal-400/20 overflow-hidden cursor-pointer"
    >
      {/* Progress accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
          style={{ width: `${program.overallProgress}%` }}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {program.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {program.description}
            </p>
          </div>

          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
            className="shrink-0 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-lg transition-colors"
          >
            Edit
          </button>
        </div>

        {/* Program leads */}
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} />
          <div className="flex items-center gap-2 flex-wrap">
            {program.leads.map((lead, index) => (
              <div key={lead.userId} className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white">
                    {lead.initials}
                  </span>
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {lead.name}
                </span>
                {index < program.leads.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-600">&</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Entities involved */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {program.entitiesInvolved.map((entity) => (
            <span
              key={entity}
              className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
            >
              {entity}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-500" strokeWidth={2} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {program.linkedObjectives.length} {program.linkedObjectives.length === 1 ? 'Objective' : 'Objectives'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-500" strokeWidth={2} />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
              {program.overallProgress}%
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
