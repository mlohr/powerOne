import type { LinkedObjective } from '@/../product/sections/programs/types'
import { ChevronRight, User } from 'lucide-react'

interface ObjectiveListItemProps {
  objective: LinkedObjective
  onView?: () => void
}

export function ObjectiveListItem({ objective, onView }: ObjectiveListItemProps) {
  return (
    <div
      onClick={onView}
      className="group relative bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 p-4 transition-all duration-200 hover:shadow-md hover:shadow-teal-500/5 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {objective.title}
          </h4>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
              {objective.organizationalUnit}
            </span>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{objective.owner}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
              {objective.progress}%
            </div>
            <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
                style={{ width: `${objective.progress}%` }}
              />
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
