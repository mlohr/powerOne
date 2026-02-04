import { useState } from 'react'
import type { MetricsProgressProps, Metric } from '@/../product/sections/metrics-and-progress/types'

// Typography: Inter for headings and body (from design tokens)
// Colors: teal (primary), blue (secondary), slate (neutral)

export function MetricsProgress({
  currentUser: _currentUser,
  activeSprint,
  organizationalUnits,
  objectives,
  keyResults,
  onUpdateMetric
}: MetricsProgressProps) {
  // Track which metrics are being edited
  const [editingMetrics, setEditingMetrics] = useState<Record<string, string>>({})

  // Helper to calculate progress percentage
  const calculateProgress = (metric: Metric): number => {
    const { baseline, currentValue, target, direction } = metric

    if (direction === 'increase') {
      const range = target - baseline
      const progress = currentValue - baseline
      return range > 0 ? Math.round((progress / range) * 100) : 0
    } else {
      // For decrease direction (e.g., reduce delivery time)
      const range = baseline - target
      const progress = baseline - currentValue
      return range > 0 ? Math.round((progress / range) * 100) : 0
    }
  }

  // Get progress status color
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 75) return 'text-teal-600 dark:text-teal-400'
    if (percentage >= 50) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 25) return 'text-amber-600 dark:text-amber-400'
    return 'text-slate-500 dark:text-slate-400'
  }

  // Get objective for a key result
  const getObjective = (objectiveId: string) => {
    return objectives.find(obj => obj.id === objectiveId)
  }

  // Get organizational unit for an objective
  const getOrgUnit = (orgUnitId: string) => {
    return organizationalUnits.find(unit => unit.id === orgUnitId)
  }

  // Handle metric value change
  const handleInputChange = (metricId: string, value: string) => {
    setEditingMetrics(prev => ({ ...prev, [metricId]: value }))
  }

  // Handle save for a specific metric
  const handleSave = (metricId: string) => {
    const value = editingMetrics[metricId]
    if (value && value.trim() !== '') {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        onUpdateMetric?.(metricId, numValue)
        // Clear the editing state
        setEditingMetrics(prev => {
          const next = { ...prev }
          delete next[metricId]
          return next
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              Metrics & Progress
            </h1>
            <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              Sprint {activeSprint.name}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Update metric values for your Key Results
          </p>
        </div>

        {/* Key Results List */}
        <div className="space-y-6">
          {keyResults.map(kr => {
            const objective = getObjective(kr.objectiveId)
            const orgUnit = objective ? getOrgUnit(objective.organizationalUnitId) : null

            return (
              <div
                key={kr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 transition-shadow hover:shadow-md"
              >
                {/* Key Result Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 leading-tight">
                      {kr.title}
                    </h3>
                    {orgUnit && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 whitespace-nowrap">
                        {orgUnit.level}
                      </span>
                    )}
                  </div>
                  {objective && (
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {objective.title}
                    </p>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  {kr.metrics.map(metric => {
                    const progress = calculateProgress(metric)
                    const isEditing = editingMetrics[metric.id] !== undefined
                    const editValue = editingMetrics[metric.id] ?? metric.currentValue.toString()

                    return (
                      <div
                        key={metric.id}
                        className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50"
                      >
                        {/* Metric Name & Progress */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {metric.name}
                          </span>
                          <span className={`text-sm font-bold ${getProgressColor(progress)}`}>
                            {progress}%
                          </span>
                        </div>

                        {/* Metric Values */}
                        <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                              Baseline
                            </div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">
                              {metric.baseline} {metric.unit}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                              Current
                            </div>
                            <div className="font-bold text-slate-900 dark:text-slate-50">
                              {metric.currentValue} {metric.unit}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                              Target
                            </div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">
                              {metric.target} {metric.unit}
                            </div>
                          </div>
                        </div>

                        {/* Update Input */}
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => handleInputChange(metric.id, e.target.value)}
                              placeholder="Enter new value"
                              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all"
                            />
                          </div>
                          <button
                            onClick={() => handleSave(metric.id)}
                            disabled={!isEditing || editValue.trim() === ''}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {keyResults.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <svg
                  className="w-8 h-8 text-slate-400 dark:text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No Key Results to update
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You don't have any Key Results assigned in the active sprint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
