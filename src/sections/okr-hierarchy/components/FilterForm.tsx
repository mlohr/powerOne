import { useState, useEffect } from 'react'
import { X, Trash2, Filter, Eye } from 'lucide-react'
import type {
  FilterFormProps,
  FilterFormData,
  OrganizationalLevel,
  ObjectiveStatus,
} from '@/../product/sections/okr-hierarchy/types'

// Design tokens: primary=teal, secondary=blue, neutral=slate

const organizationalLevels: OrganizationalLevel[] = [
  'Group',
  'Entity',
  'Domain',
  'Department',
  'Team',
]

const statuses: ObjectiveStatus[] = [
  'Draft',
  'Accepted',
  'Active',
  'Done',
  'Archived',
  'Cancelled',
]

export function FilterForm({
  filter,
  objectives,
  sprints,
  users,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
}: FilterFormProps) {
  const [formData, setFormData] = useState<FilterFormData>({
    name: '',
    criteria: {},
    isShared: false,
  })

  const [selectedLevels, setSelectedLevels] = useState<OrganizationalLevel[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<ObjectiveStatus[]>([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (filter && !filter.isPreset) {
      const levels = Array.isArray(filter.criteria.organizationalLevel)
        ? filter.criteria.organizationalLevel
        : filter.criteria.organizationalLevel
        ? [filter.criteria.organizationalLevel as OrganizationalLevel]
        : []

      const statuses = Array.isArray(filter.criteria.status)
        ? filter.criteria.status
        : filter.criteria.status
        ? [filter.criteria.status]
        : []

      setFormData({
        name: filter.name,
        criteria: filter.criteria,
        isShared: filter.isShared,
      })
      setSelectedLevels(levels)
      setSelectedStatuses(statuses)
    } else {
      setFormData({
        name: '',
        criteria: {},
        isShared: false,
      })
      setSelectedLevels([])
      setSelectedStatuses([])
    }
  }, [filter])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Build criteria with selected values
    const criteria: any = {}
    if (selectedLevels.length > 0) {
      criteria.organizationalLevel = selectedLevels
    }
    if (selectedStatuses.length > 0) {
      criteria.status = selectedStatuses
    }
    if (formData.criteria.sprint) {
      criteria.sprint = formData.criteria.sprint
    }
    if (formData.criteria.owner) {
      criteria.owner = formData.criteria.owner
    }

    onSubmit({
      name: formData.name,
      criteria,
      isShared: formData.isShared,
    })
  }

  const toggleLevel = (level: OrganizationalLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    )
  }

  const toggleStatus = (status: ObjectiveStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  // Preview: count matching objectives
  const matchingObjectives = objectives.filter((obj) => {
    if (selectedLevels.length > 0 && obj.organizationalLevel && !selectedLevels.includes(obj.organizationalLevel)) {
      return false
    }
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(obj.status)) {
      return false
    }
    if (formData.criteria.sprint && obj.sprint !== formData.criteria.sprint) {
      return false
    }
    if (formData.criteria.owner && obj.owner.id !== formData.criteria.owner) {
      return false
    }
    return true
  })

  if (!isOpen) return null

  const isEditMode = !!filter && !filter.isPreset

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
                <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center">
                  <Filter className="text-teal-600 dark:text-teal-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {isEditMode ? 'Edit Custom Filter' : 'Create Custom Filter'}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Save your filter criteria for quick access
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
            {/* Filter Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
                placeholder="e.g., Q1 Active Objectives, My Team Goals"
              />
            </div>

            {/* Organizational Levels */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Organizational Levels (Optional)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                Select one or more levels to filter by
              </p>
              <div className="flex flex-wrap gap-2">
                {organizationalLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleLevel(level)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedLevels.includes(level)
                        ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-2 border-teal-500 dark:border-teal-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status (Optional)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                Select one or more statuses to filter by
              </p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedStatuses.includes(status)
                        ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-2 border-teal-500 dark:border-teal-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sprint */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sprint (Optional)
              </label>
              <select
                value={formData.criteria.sprint || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, sprint: e.target.value || undefined },
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">All Sprints</option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Owner */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Owner (Optional)
              </label>
              <select
                value={formData.criteria.owner || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, owner: e.target.value || undefined },
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">All Owners</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Share Toggle */}
            <div>
              <label className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isShared}
                  onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-teal-600 dark:text-teal-500 rounded border-slate-300 dark:border-slate-600 focus:ring-teal-500 dark:focus:ring-teal-600"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Share this filter with others
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    When shared, this filter will be visible to all users in the secondary
                    navigation
                  </p>
                </div>
              </label>
            </div>

            {/* Preview Section */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-4"
              >
                <Eye size={16} />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>

              {showPreview && (
                <div className="p-4 bg-teal-50 dark:bg-teal-950/50 rounded-lg border border-teal-200 dark:border-teal-800">
                  <p className="text-sm font-medium text-teal-900 dark:text-teal-100 mb-3">
                    Filter Preview
                  </p>

                  {selectedLevels.length === 0 &&
                  selectedStatuses.length === 0 &&
                  !formData.criteria.sprint &&
                  !formData.criteria.owner ? (
                    <p className="text-sm text-teal-700 dark:text-teal-300">
                      No criteria selected. This filter will show all objectives.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-3">
                        {selectedLevels.length > 0 && (
                          <p className="text-xs text-teal-800 dark:text-teal-200">
                            <span className="font-medium">Levels:</span>{' '}
                            {selectedLevels.join(', ')}
                          </p>
                        )}
                        {selectedStatuses.length > 0 && (
                          <p className="text-xs text-teal-800 dark:text-teal-200">
                            <span className="font-medium">Status:</span>{' '}
                            {selectedStatuses.join(', ')}
                          </p>
                        )}
                        {formData.criteria.sprint && (
                          <p className="text-xs text-teal-800 dark:text-teal-200">
                            <span className="font-medium">Sprint:</span>{' '}
                            {sprints.find((s) => s.id === formData.criteria.sprint)?.name}
                          </p>
                        )}
                        {formData.criteria.owner && (
                          <p className="text-xs text-teal-800 dark:text-teal-200">
                            <span className="font-medium">Owner:</span>{' '}
                            {users.find((u) => u.id === formData.criteria.owner)?.name}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-teal-200 dark:border-teal-800">
                        <p className="text-sm font-medium text-teal-900 dark:text-teal-100">
                          {matchingObjectives.length} objective(s) match this filter
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 About Custom Filters
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Custom filters appear in the sidebar under "OKR Hierarchy"</li>
                <li>• Combine multiple criteria to create powerful filtered views</li>
                <li>• Shared filters are visible to all users</li>
                <li>• Pre-set filters (My OKRs, My Entity, My Domain) cannot be edited</li>
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
                  Delete Filter
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
                  className="px-6 py-2 rounded-lg bg-teal-600 dark:bg-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors font-medium shadow-sm"
                >
                  {isEditMode ? 'Save Changes' : 'Create Filter'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
