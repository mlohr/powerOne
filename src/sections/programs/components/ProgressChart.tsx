import type { LinkedObjective } from '@/../product/sections/programs/types'

interface ProgressChartProps {
  objectives: LinkedObjective[]
  overallProgress: number
}

export function ProgressChart({ objectives, overallProgress }: ProgressChartProps) {
  // Sort objectives by progress (highest first) for visual impact
  const sortedObjectives = [...objectives].sort((a, b) => b.progress - a.progress)

  return (
    <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 rounded-xl p-6 border border-teal-100 dark:border-teal-900/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Progress Breakdown
        </h3>
        <div className="text-right">
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Overall Progress
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
            {overallProgress}%
          </div>
        </div>
      </div>

      {objectives.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No objectives linked yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedObjectives.map((objective) => (
            <div key={objective.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate flex-1 mr-4">
                  {objective.title}
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent shrink-0">
                  {objective.progress}%
                </span>
              </div>
              <div className="relative h-3 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${objective.progress}%` }}
                />
                {/* Shimmer effect */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                  style={{ width: `${objective.progress}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {objective.organizationalUnit} • {objective.owner}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Average line visualization */}
      {objectives.length > 0 && (
        <div className="mt-6 pt-6 border-t border-teal-200 dark:border-teal-900/30">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Average across {objectives.length} {objectives.length === 1 ? 'objective' : 'objectives'}
            </span>
            <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length)}%
            </span>
          </div>
          <div className="h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-700"
              style={{
                width: `${Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length)}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
