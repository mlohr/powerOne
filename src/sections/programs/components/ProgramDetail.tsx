import type { ProgramDetailProps } from '@/../product/sections/programs/types'
import { ArrowLeft, Edit, Trash2, Users, Target, Activity } from 'lucide-react'
import { ObjectiveListItem } from './ObjectiveListItem'
import { ActivityFeedItem } from './ActivityFeedItem'
import { ProgressChart } from './ProgressChart'

export function ProgramDetail({
  program,
  onEdit,
  onDelete,
  onViewObjective,
  onBack
}: ProgramDetailProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 dark:from-teal-600 dark:via-teal-700 dark:to-blue-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            <span className="font-medium">Back to Programs</span>
          </button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">
                {program.name}
              </h1>
              <p className="text-lg text-teal-50 dark:text-teal-100 leading-relaxed mb-6">
                {program.description}
              </p>

              {/* Program leads */}
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-teal-200 dark:text-teal-300" strokeWidth={2} />
                <div className="flex items-center gap-3 flex-wrap">
                  {program.leads.map((lead, index) => (
                    <div key={lead.userId} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                        <span className="text-sm font-semibold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                          {lead.initials}
                        </span>
                      </div>
                      <span className="text-white font-medium">
                        {lead.name}
                      </span>
                      {index < program.leads.length - 1 && (
                        <span className="text-teal-200">&</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Entities involved */}
              <div className="flex items-center gap-2 flex-wrap">
                {program.entitiesInvolved.map((entity) => (
                  <span
                    key={entity}
                    className="px-3 py-1 text-sm font-medium bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm text-white rounded-lg border border-white/30 dark:border-slate-700/50"
                  >
                    {entity}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 transition-all"
              >
                <Edit className="w-4 h-4" strokeWidth={2} />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm text-white font-medium rounded-xl border border-red-400/30 transition-all"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Chart */}
            <ProgressChart
              objectives={program.linkedObjectives}
              overallProgress={program.overallProgress}
            />

            {/* Linked Objectives */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    Linked Objectives
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {program.linkedObjectives.length} {program.linkedObjectives.length === 1 ? 'objective' : 'objectives'} driving this program
                  </p>
                </div>
              </div>

              {program.linkedObjectives.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                  <Target className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No objectives linked yet
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Link objectives to this program to track progress
                  </p>
                  <button
                    onClick={onEdit}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" strokeWidth={2} />
                    Edit Program
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {program.linkedObjectives.map((objective) => (
                    <ObjectiveListItem
                      key={objective.id}
                      objective={objective}
                      onView={() => onViewObjective?.(objective.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            {/* Activity Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    Activity Feed
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Recent updates
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {program.activityUpdates.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No activity yet
                    </p>
                  </div>
                ) : (
                  program.activityUpdates.map((activity) => (
                    <ActivityFeedItem key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
