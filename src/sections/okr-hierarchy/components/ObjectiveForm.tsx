import { useState, useEffect } from 'react'
import { X, Trash2, Target } from 'lucide-react'
import type {
  ObjectiveFormProps,
  ObjectiveFormData,
  ObjectiveStatus,
  OrganizationalLevel,
} from '@/../product/sections/okr-hierarchy/types'

// Design tokens: primary=teal, secondary=blue, neutral=slate

const statuses: ObjectiveStatus[] = [
  'Draft',
  'Accepted',
  'Active',
  'Done',
  'Archived',
  'Cancelled',
]

const levelOrder: OrganizationalLevel[] = ['Group', 'Entity', 'Domain', 'Department', 'Team']

export function ObjectiveForm({
  objective,
  organizationalUnits,
  sprints,
  programs,
  objectives,
  users,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
}: ObjectiveFormProps) {
  const [formData, setFormData] = useState<ObjectiveFormData>({
    title: '',
    description: '',
    organizationalUnitId: '',
    ownerId: '',
    status: 'Draft',
    sprintId: '',
    programIds: [],
    parentObjectiveId: null,
  })

  // Group organizational units by level
  const groupedOrgUnits = levelOrder.reduce((acc, level) => {
    acc[level] = organizationalUnits.filter((ou) => ou.level === level)
    return acc
  }, {} as Record<OrganizationalLevel, typeof organizationalUnits>)

  useEffect(() => {
    if (objective) {
      setFormData({
        title: objective.title,
        description: objective.description,
        organizationalUnitId: objective.organizationalUnitId,
        ownerId: objective.owner.id,
        status: objective.status,
        sprintId: objective.sprint,
        programIds: objective.programIds,
        parentObjectiveId: objective.parentObjectiveId,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        organizationalUnitId: organizationalUnits[0]?.id || '',
        ownerId: users[0]?.id || '',
        status: 'Draft',
        sprintId: sprints.find((s) => s.status === 'active')?.id || sprints[0]?.id || '',
        programIds: [],
        parentObjectiveId: null,
      })
    }
  }, [objective, users, sprints, organizationalUnits])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleProgramToggle = (programId: string) => {
    setFormData((prev) => ({
      ...prev,
      programIds: prev.programIds.includes(programId)
        ? prev.programIds.filter((id) => id !== programId)
        : [...prev.programIds, programId],
    }))
  }

  if (!isOpen) return null

  const isEditMode = !!objective

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
                  <Target className="text-teal-600 dark:text-teal-400" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {isEditMode ? 'Edit Objective' : 'New Objective'}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Define an outcome-focused goal
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
                Objective Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
                placeholder="e.g., Increase company-wide revenue growth"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent resize-none"
                placeholder="Describe what this objective aims to achieve and why it matters..."
              />
            </div>

            {/* Organizational Unit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Organizational Unit *
              </label>
              <select
                required
                value={formData.organizationalUnitId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizationalUnitId: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">Select organizational unit...</option>
                {levelOrder.map((level) => {
                  const units = groupedOrgUnits[level]
                  if (units.length === 0) return null

                  return (
                    <optgroup key={level} label={level}>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </optgroup>
                  )
                })}
              </select>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                Organizational units are master data managed by Admins
              </p>
            </div>

            {/* Owner */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Owner *
              </label>
              <select
                required
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status & Sprint */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as ObjectiveStatus })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sprint *
                </label>
                <select
                  required
                  value={formData.sprintId}
                  onChange={(e) => setFormData({ ...formData, sprintId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
                >
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name} ({sprint.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent Objective */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Parent Objective (Optional)
              </label>
              <select
                value={formData.parentObjectiveId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentObjectiveId: e.target.value || null,
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 focus:border-transparent"
              >
                <option value="">None - Top-level objective</option>
                {objectives
                  .filter((obj) => obj.id !== objective?.id)
                  .map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.title} ({obj.organizationalLevel})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
                Link this objective to a higher-level objective for cascading alignment
              </p>
            </div>

            {/* Programs */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Programs (Optional)
              </label>
              <div className="space-y-2">
                {programs.map((program) => (
                  <label
                    key={program.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.programIds.includes(program.id)}
                      onChange={() => handleProgramToggle(program.id)}
                      className="mt-0.5 w-4 h-4 text-teal-600 dark:text-teal-500 rounded border-slate-300 dark:border-slate-600 focus:ring-teal-500 dark:focus:ring-teal-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {program.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {program.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
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
                  className="px-6 py-2 rounded-lg bg-teal-600 dark:bg-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors font-medium shadow-sm"
                >
                  {isEditMode ? 'Save Changes' : 'Create Objective'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
