import { useState } from 'react'
import type { ProgramsDashboardProps } from '@/../product/sections/programs/types'
import { ProgramCard } from './ProgramCard'
import { Search, Plus, Filter } from 'lucide-react'

export function ProgramsDashboard({
  programs,
  onCreate,
  onView,
  onEdit,
  onSearch,
  onFilterByLead,
  onFilterByEntity
}: ProgramsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<string>('all')
  const [selectedEntity, setSelectedEntity] = useState<string>('all')

  // Extract unique leads and entities for filter dropdowns
  const allLeads = Array.from(
    new Set(
      programs.flatMap(p => p.leads.map(l => JSON.stringify({ id: l.userId, name: l.name })))
    )
  ).map(json => JSON.parse(json))

  const allEntities = Array.from(
    new Set(programs.flatMap(p => p.entitiesInvolved))
  ).sort()

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  // Handle filter by lead
  const handleLeadFilter = (leadId: string) => {
    setSelectedLead(leadId)
    if (leadId !== 'all') {
      onFilterByLead?.(leadId)
    }
  }

  // Handle filter by entity
  const handleEntityFilter = (entity: string) => {
    setSelectedEntity(entity)
    if (entity !== 'all') {
      onFilterByEntity?.(entity)
    }
  }

  // Filter programs for display (client-side demo filtering)
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchQuery === '' ||
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLead = selectedLead === 'all' ||
      program.leads.some(l => l.userId === selectedLead)

    const matchesEntity = selectedEntity === 'all' ||
      program.entitiesInvolved.includes(selectedEntity)

    return matchesSearch && matchesLead && matchesEntity
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 dark:from-teal-600 dark:via-teal-700 dark:to-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Programs</h1>
              <p className="text-lg text-teal-50 dark:text-teal-100 max-w-2xl">
                Cross-entity strategic initiatives driving organizational impact
              </p>
            </div>
            <button
              onClick={onCreate}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-semibold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              New Program
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300 dark:text-teal-400" strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search programs..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/90 dark:bg-slate-900/90 border border-transparent focus:border-teal-400 dark:focus:border-teal-500 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Filter by Lead */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300 dark:text-teal-400 pointer-events-none" strokeWidth={2} />
                  <select
                    value={selectedLead}
                    onChange={(e) => handleLeadFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/90 dark:bg-slate-900/90 border border-transparent focus:border-teal-400 dark:focus:border-teal-500 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Leads</option>
                    {allLeads.map(lead => (
                      <option key={lead.id} value={lead.id}>{lead.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter by Entity */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-300 dark:text-teal-400 pointer-events-none" strokeWidth={2} />
                  <select
                    value={selectedEntity}
                    onChange={(e) => handleEntityFilter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/90 dark:bg-slate-900/90 border border-transparent focus:border-teal-400 dark:focus:border-teal-500 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Entities</option>
                    {allEntities.map(entity => (
                      <option key={entity} value={entity}>{entity}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Filter className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No programs found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {searchQuery || selectedLead !== 'all' || selectedEntity !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Get started by creating your first program'}
            </p>
            {searchQuery === '' && selectedLead === 'all' && selectedEntity === 'all' && (
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 dark:bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                Create First Program
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredPrograms.length}</span> {filteredPrograms.length === 1 ? 'program' : 'programs'}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onView={() => onView?.(program.id)}
                  onEdit={() => onEdit?.(program.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
