import { useState, useEffect } from 'react'
import { X, Trash2, TrendingUp, Plus, Minus } from 'lucide-react'
import type {
  KeyResultFormProps,
  KeyResultFormData,
  KeyResultStatus,
  MetricDefinition,
  MetricScale,
  MetricDirection,
} from '@/../product/sections/okr-hierarchy/types'

// Design tokens: primary=teal, secondary=blue, neutral=slate

const statuses: KeyResultStatus[] = [
  'Draft',
  'Accepted',
  'Active',
  'Done',
  'Archived',
  'Cancelled',
]

const metricScales: { value: MetricScale; label: string }[] = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'absolute', label: 'Absolute Number' },
  { value: 'score', label: 'Score (0-10)' },
]

const metricDirections: { value: MetricDirection; label: string }[] = [
  { value: 'increase', label: 'Increase ↑' },
  { value: 'decrease', label: 'Decrease ↓' },
]

export function KeyResultForm({
  keyResult,
  objectives,
  preselectedObjectiveId,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
}: KeyResultFormProps) {
  const [formData, setFormData] = useState<KeyResultFormData>({
    title: '',
    objectiveId: '',
    status: 'Draft',
    linkedChildObjectiveId: null,
    metrics: [
      {
        name: '',
        scale: 'absolute',
        baselineValue: 0,
        targetValue: 0,
        direction: 'increase',
      },
    ],
  })

  useEffect(() => {
    if (keyResult) {
      setFormData({
        title: keyResult.title,
        objectiveId: keyResult.objectiveId,
        status: keyResult.status,
        linkedChildObjectiveId: keyResult.linkedChildObjectiveId,
        metrics: [
          {
            name: '',
            scale: 'absolute',
            baselineValue: 0,
            targetValue: 0,
            direction: 'increase',
          },
        ],
      })
    } else {
      setFormData({
        title: '',
        objectiveId: preselectedObjectiveId || objectives[0]?.id || '',
        status: 'Draft',
        linkedChildObjectiveId: null,
        metrics: [
          {
            name: '',
            scale: 'absolute',
            baselineValue: 0,
            targetValue: 0,
            direction: 'increase',
          },
        ],
      })
    }
  }, [keyResult, preselectedObjectiveId, objectives])

  const addMetric = () => {
    if (formData.metrics.length < 3) {
      setFormData({
        ...formData,
        metrics: [
          ...formData.metrics,
          {
            name: '',
            scale: 'absolute',
            baselineValue: 0,
            targetValue: 0,
            direction: 'increase',
          },
        ],
      })
    }
  }

  const removeMetric = (index: number) => {
    if (formData.metrics.length > 1) {
      setFormData({
        ...formData,
        metrics: formData.metrics.filter((_, i) => i !== index),
      })
    }
  }

  const updateMetric = (index: number, field: keyof MetricDefinition, value: any) => {
    const newMetrics = [...formData.metrics]
    newMetrics[index] = { ...newMetrics[index], [field]: value }
    setFormData({ ...formData, metrics: newMetrics })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const selectedObjective = objectives.find((obj) => obj.id === formData.objectiveId)

  // For cascading: filter objectives that are at a lower level than the selected objective
  const levelHierarchy = ['Group', 'Entity', 'Domain', 'Department', 'Team']
  const selectedLevelIndex = selectedObjective && selectedObjective.organizationalLevel
    ? levelHierarchy.indexOf(selectedObjective.organizationalLevel)
    : -1

  const lowerLevelObjectives = objectives.filter((obj) => {
    if (!obj.organizationalLevel) return false
    const objLevelIndex = levelHierarchy.indexOf(obj.organizationalLevel)
    return (
      objLevelIndex > selectedLevelIndex &&
      obj.id !== formData.objectiveId &&
      obj.id !== keyResult?.id
    )
  })

  if (!isOpen) return null

  const isEditMode = !!keyResult

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {isEditMode ? 'Edit Key Result' : 'New Key Result'}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Define a measurable outcome
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Key Result Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                placeholder="e.g., Achieve €50M in total revenue"
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
                Key Results should be metric-driven and measurable
              </p>
            </div>

            {/* Objective Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Objective *
              </label>
              <select
                required
                value={formData.objectiveId}
                onChange={(e) => setFormData({ ...formData, objectiveId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              >
                {objectives.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.title} ({obj.organizationalLevel || 'N/A'} - {obj.organizationalUnit || 'N/A'})
                  </option>
                ))}
              </select>
              {selectedObjective && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Selected Objective:
                  </p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {selectedObjective.title}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {selectedObjective.description}
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as KeyResultStatus })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Cascading Alignment */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Link to Child Objective (Optional)
              </label>
              <select
                value={formData.linkedChildObjectiveId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    linkedChildObjectiveId: e.target.value || null,
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">None - No cascading alignment</option>
                {lowerLevelObjectives.length > 0 ? (
                  lowerLevelObjectives.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.title} ({obj.organizationalLevel || 'N/A'} - {obj.organizationalUnit || 'N/A'})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No lower-level objectives available
                  </option>
                )}
              </select>
              <div className="mt-3 p-4 bg-teal-50 dark:bg-teal-950/50 rounded-lg border border-teal-200 dark:border-teal-800">
                <p className="text-xs font-medium text-teal-900 dark:text-teal-100 mb-2">
                  💡 Cascading Alignment
                </p>
                <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">
                  Link this Key Result to a lower-level Objective to create cascading alignment.
                  For example, a Group-level Key Result can drive an Entity-level Objective.
                </p>
                {lowerLevelObjectives.length === 0 && (
                  <p className="text-xs text-teal-700 dark:text-teal-300 mt-2">
                    No lower-level objectives available for cascading. Create objectives at lower
                    organizational levels first.
                  </p>
                )}
              </div>
            </div>

            {/* Metrics Definition */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Metrics (1-3 required) *
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Define how success will be measured for this Key Result
                  </p>
                </div>
                {formData.metrics.length < 3 && (
                  <button
                    type="button"
                    onClick={addMetric}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                    Add Metric
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {formData.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Metric {index + 1}
                      </span>
                      {formData.metrics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMetric(index)}
                          className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>

                    {/* Metric Name */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                        Metric Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={metric.name}
                        onChange={(e) => updateMetric(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        placeholder="e.g., Total Revenue, Customer Count"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Scale */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                          Scale *
                        </label>
                        <select
                          required
                          value={metric.scale}
                          onChange={(e) =>
                            updateMetric(index, 'scale', e.target.value as MetricScale)
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        >
                          {metricScales.map((scale) => (
                            <option key={scale.value} value={scale.value}>
                              {scale.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Direction */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                          Direction *
                        </label>
                        <select
                          required
                          value={metric.direction}
                          onChange={(e) =>
                            updateMetric(index, 'direction', e.target.value as MetricDirection)
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                        >
                          {metricDirections.map((dir) => (
                            <option key={dir.value} value={dir.value}>
                              {dir.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Baseline */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                          Baseline Value *
                        </label>
                        <input
                          type="number"
                          required
                          step="any"
                          value={metric.baselineValue}
                          onChange={(e) =>
                            updateMetric(index, 'baselineValue', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                          placeholder="Starting value"
                        />
                      </div>

                      {/* Target */}
                      <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                          Target Value *
                        </label>
                        <input
                          type="number"
                          required
                          step="any"
                          value={metric.targetValue}
                          onChange={(e) =>
                            updateMetric(index, 'targetValue', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                          placeholder="Goal value"
                        />
                      </div>
                    </div>

                    {/* Visual Preview */}
                    {metric.name && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Preview:</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                            {metric.name}:
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {metric.baselineValue}
                            {metric.scale === 'percentage' && '%'} →{' '}
                            {metric.targetValue}
                            {metric.scale === 'percentage' && '%'}
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            ({metric.direction === 'increase' ? '↑' : '↓'})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
                📊 About Metrics
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Each Key Result should have 1-3 metrics that measure success</li>
                <li>• Metrics include baseline (starting point) and target (goal) values</li>
                <li>• Current values are updated in the Metrics & Progress section</li>
                <li>• Progress is automatically calculated based on current vs. target</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              {isEditMode && onDelete ? (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-sm"
                >
                  {isEditMode ? 'Save Changes' : 'Create Key Result'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
