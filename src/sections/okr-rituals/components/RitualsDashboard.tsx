import { useState, useMemo } from 'react'
import type { RitualsDashboardProps } from '@/../product/sections/okr-rituals/types'
import { RitualCard } from './RitualCard'
import { Plus, Calendar, Filter } from 'lucide-react'

export function RitualsDashboard({
  rituals,
  sprints,
  onCreate,
  onView,
  onFacilitate,
  onFilterBySprint
}: RitualsDashboardProps) {
  const [selectedSprint, setSelectedSprint] = useState<string>('all')

  // Filter rituals by sprint
  const filteredRituals = useMemo(() => {
    if (selectedSprint === 'all') return rituals
    return rituals.filter(r => r.sprintId === selectedSprint)
  }, [rituals, selectedSprint])

  // Separate upcoming and completed rituals
  const upcomingRituals = useMemo(() => {
    const now = new Date()
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    return filteredRituals
      .filter(r => {
        if (r.status !== 'upcoming') return false
        const ritualDate = new Date(r.dateTime)
        return ritualDate >= now && ritualDate <= twoWeeksFromNow
      })
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
  }, [filteredRituals])

  const recentRituals = useMemo(() => {
    return filteredRituals
      .filter(r => r.status === 'completed')
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
      .slice(0, 4)
  }, [filteredRituals])

  const handleSprintFilter = (sprintId: string) => {
    setSelectedSprint(sprintId)
    if (sprintId !== 'all') {
      onFilterBySprint?.(sprintId)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 dark:from-teal-600 dark:via-teal-700 dark:to-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">OKR Rituals</h1>
              <p className="text-lg text-teal-50 dark:text-teal-100 max-w-2xl">
                Schedule and facilitate planning sessions, check-ins, reviews, and retrospectives
              </p>
            </div>
            <button
              onClick={onCreate}
              className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-semibold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              New Ritual
            </button>
          </div>

          {/* Sprint Filter */}
          <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-teal-200 dark:text-teal-300" strokeWidth={2} />
              <select
                value={selectedSprint}
                onChange={(e) => handleSprintFilter(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/90 dark:bg-slate-900/90 border border-transparent focus:border-teal-400 dark:focus:border-teal-500 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/20 dark:focus:ring-teal-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Sprints</option>
                {sprints.map(sprint => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upcoming Rituals */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Upcoming Rituals
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Next 14 days
              </p>
            </div>
          </div>

          {upcomingRituals.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No upcoming rituals
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Schedule planning sessions, check-ins, reviews, or retrospectives
              </p>
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 dark:bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                Schedule First Ritual
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRituals.map((ritual) => (
                <RitualCard
                  key={ritual.id}
                  ritual={ritual}
                  onView={() => onView?.(ritual.id)}
                  onFacilitate={() => onFacilitate?.(ritual.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Rituals */}
        {recentRituals.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                  Recent Rituals
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Recently completed sessions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentRituals.map((ritual) => (
                <RitualCard
                  key={ritual.id}
                  ritual={ritual}
                  onView={() => onView?.(ritual.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state when no rituals at all */}
        {filteredRituals.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No rituals found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {selectedSprint !== 'all'
                ? 'Try selecting a different sprint or create your first ritual'
                : 'Get started by scheduling your first ritual'}
            </p>
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 dark:bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Schedule First Ritual
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
