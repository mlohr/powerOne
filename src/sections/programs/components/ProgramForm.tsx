import { useState, useEffect } from 'react'
import type { ProgramFormProps } from '@/../product/sections/programs/types'
import { X, Save, Users, Target, Building2 } from 'lucide-react'

export function ProgramForm({
  program,
  onSubmit,
  onCancel,
  availableLeads = [],
  availableObjectives = [],
  availableEntities = []
}: ProgramFormProps) {
  const isEditMode = !!program

  // Form state
  const [formData, setFormData] = useState({
    name: program?.name || '',
    description: program?.description || '',
    leadIds: program?.leads.map(l => l.userId) || [],
    objectiveIds: program?.linkedObjectives.map(o => o.id) || [],
    entityIds: program?.entitiesInvolved || []
  })

  // Reset form when program changes
  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name,
        description: program.description,
        leadIds: program.leads.map(l => l.userId),
        objectiveIds: program.linkedObjectives.map(o => o.id),
        entityIds: program.entitiesInvolved
      })
    }
  }, [program])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Build the program object from form data
    const programData = {
      name: formData.name,
      description: formData.description,
      leads: availableLeads.filter(l => formData.leadIds.includes(l.userId)),
      linkedObjectives: availableObjectives.filter(o => formData.objectiveIds.includes(o.id)),
      entitiesInvolved: formData.entityIds
    }

    onSubmit?.(programData)
  }

  const toggleLead = (leadId: string) => {
    setFormData(prev => ({
      ...prev,
      leadIds: prev.leadIds.includes(leadId)
        ? prev.leadIds.filter(id => id !== leadId)
        : [...prev.leadIds, leadId]
    }))
  }

  const toggleObjective = (objectiveId: string) => {
    setFormData(prev => ({
      ...prev,
      objectiveIds: prev.objectiveIds.includes(objectiveId)
        ? prev.objectiveIds.filter(id => id !== objectiveId)
        : [...prev.objectiveIds, objectiveId]
    }))
  }

  const toggleEntity = (entity: string) => {
    setFormData(prev => ({
      ...prev,
      entityIds: prev.entityIds.includes(entity)
        ? prev.entityIds.filter(e => e !== entity)
        : [...prev.entityIds, entity]
    }))
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end animate-fade-in">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-600 dark:to-blue-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isEditMode ? 'Edit Program' : 'New Program'}
              </h2>
              <p className="text-sm text-teal-50 dark:text-teal-100">
                {isEditMode ? 'Update program details and assignments' : 'Create a cross-entity strategic initiative'}
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
            {/* Program Name */}
            <div>
              <label htmlFor="program-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Program Name *
              </label>
              <input
                id="program-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Global Revenue Acceleration"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="program-description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                id="program-description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the strategic initiative and its goals..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Program Leads */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Program Leads * <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Select one or more)</span>
                </label>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {availableLeads.map((lead) => (
                  <label
                    key={lead.userId}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 rounded-lg cursor-pointer transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={formData.leadIds.includes(lead.userId)}
                      onChange={() => toggleLead(lead.userId)}
                      className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {lead.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                          {lead.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {formData.leadIds.length === 0 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Please select at least one program lead
                </p>
              )}
            </div>

            {/* Linked Objectives */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Linked Objectives <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Optional)</span>
                </label>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto p-1">
                {availableObjectives.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 p-4 text-center bg-slate-50 dark:bg-slate-800 rounded-lg">
                    No objectives available
                  </p>
                ) : (
                  availableObjectives.map((objective) => (
                    <label
                      key={objective.id}
                      className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-lg cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.objectiveIds.includes(objective.id)}
                        onChange={() => toggleObjective(objective.id)}
                        className="mt-0.5 w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors mb-1">
                          {objective.title}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                            {objective.organizationalUnit}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {objective.owner}
                          </span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {objective.progress}%
                          </span>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Cross-Entity Scope */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Cross-Entity Scope * <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Select entities involved)</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableEntities.map((entity) => (
                  <button
                    key={entity}
                    type="button"
                    onClick={() => toggleEntity(entity)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.entityIds.includes(entity)
                        ? 'bg-teal-600 dark:bg-teal-500 text-white border-2 border-teal-600 dark:border-teal-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500'
                    }`}
                  >
                    {entity}
                  </button>
                ))}
              </div>
              {formData.entityIds.length === 0 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Please select at least one entity
                </p>
              )}
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
              disabled={!formData.name || !formData.description || formData.leadIds.length === 0 || formData.entityIds.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-500 dark:to-blue-500 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 dark:hover:from-teal-600 dark:hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Save className="w-4 h-4" strokeWidth={2} />
              {isEditMode ? 'Save Changes' : 'Create Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
