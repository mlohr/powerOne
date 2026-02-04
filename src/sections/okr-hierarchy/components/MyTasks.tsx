import { TaskItem } from './TaskItem'
import type { Objective, KeyResult, Task, User } from '@/../product/sections/okr-hierarchy/types'

// Typography: Inter for headings and body (from design tokens)
// Colors: teal (primary), blue (secondary), slate (neutral)

interface MyTasksProps {
  /** All objectives (for context) */
  objectives: Objective[]
  /** The current logged-in user */
  currentUser: User
  /** Called when user toggles a task's completion status */
  onToggleTaskStatus?: (taskId: string) => void
  /** Called when user edits a task */
  onEditTask?: (taskId: string, description: string, ownerId: string) => void
  /** Called when user deletes a task */
  onDeleteTask?: (taskId: string) => void
  /** Called when user wants to navigate to the Key Result */
  onNavigateToKeyResult?: (keyResultId: string) => void
}

interface TaskWithContext {
  task: Task
  keyResult: KeyResult
  objective: Objective
}

export function MyTasks({
  objectives,
  currentUser,
  onToggleTaskStatus,
  onEditTask: _onEditTask,
  onDeleteTask,
  onNavigateToKeyResult
}: MyTasksProps) {
  // Collect all tasks assigned to current user with their context
  const myTasksWithContext: TaskWithContext[] = []

  objectives.forEach(objective => {
    objective.keyResults.forEach(keyResult => {
      keyResult.tasks?.forEach(task => {
        if (task.owner.id === currentUser.id) {
          myTasksWithContext.push({ task, keyResult, objective })
        }
      })
    })
  })

  // Separate open and completed tasks
  const openTasks = myTasksWithContext.filter(item => item.task.status === 'open')
  const completedTasks = myTasksWithContext.filter(item => item.task.status === 'completed')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            My Tasks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            All tasks assigned to you across Key Results
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <div className="text-sm text-slate-500 dark:text-slate-500 mb-1">Open Tasks</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {openTasks.length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <div className="text-sm text-slate-500 dark:text-slate-500 mb-1">Completed</div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {completedTasks.length}
            </div>
          </div>
        </div>

        {/* Open Tasks */}
        {openTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Open Tasks ({openTasks.length})
            </h2>
            <div className="space-y-4">
              {openTasks.map(({ task, keyResult, objective }) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                >
                  {/* Context Header */}
                  <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => onNavigateToKeyResult?.(keyResult.id)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
                    >
                      <div className="font-medium">{keyResult.title}</div>
                      <div className="text-xs mt-0.5">{objective.title}</div>
                    </button>
                  </div>

                  {/* Task */}
                  <TaskItem
                    task={task}
                    onToggleStatus={() => onToggleTaskStatus?.(task.id)}
                    onEdit={() => {
                      console.log('Edit task:', task.id)
                    }}
                    onDelete={() => onDeleteTask?.(task.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Completed Tasks ({completedTasks.length})
            </h2>
            <div className="space-y-4 opacity-75">
              {completedTasks.map(({ task, keyResult, objective }) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4"
                >
                  {/* Context Header */}
                  <div className="mb-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => onNavigateToKeyResult?.(keyResult.id)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left"
                    >
                      <div className="font-medium">{keyResult.title}</div>
                      <div className="text-xs mt-0.5">{objective.title}</div>
                    </button>
                  </div>

                  {/* Task */}
                  <TaskItem
                    task={task}
                    onToggleStatus={() => onToggleTaskStatus?.(task.id)}
                    onEdit={() => {
                      console.log('Edit task:', task.id)
                    }}
                    onDelete={() => onDeleteTask?.(task.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {openTasks.length === 0 && completedTasks.length === 0 && (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No tasks assigned
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You don't have any tasks assigned to you yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
