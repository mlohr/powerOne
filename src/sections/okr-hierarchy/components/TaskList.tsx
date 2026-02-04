import { useState } from 'react'
import { TaskItem } from './TaskItem'
import type { Task, User } from '@/../product/sections/okr-hierarchy/types'

// Typography: Inter for body (from design tokens)
// Colors: teal (primary), blue (secondary), slate (neutral)

interface TaskListProps {
  /** The list of tasks to display */
  tasks: Task[]
  /** Key Result ID for creating new tasks */
  keyResultId: string
  /** Available users for task assignment */
  users: User[]
  /** Current user for defaulting owner */
  currentUser?: User
  /** Called when user adds a new task */
  onAddTask?: (description: string, ownerId: string) => void
  /** Called when user toggles a task's completion status */
  onToggleTaskStatus?: (taskId: string) => void
  /** Called when user edits a task */
  onEditTask?: (taskId: string, description: string, ownerId: string) => void
  /** Called when user deletes a task */
  onDeleteTask?: (taskId: string) => void
}

export function TaskList({
  tasks,
  keyResultId: _keyResultId,
  users,
  currentUser,
  onAddTask,
  onToggleTaskStatus,
  onEditTask: _onEditTask,
  onDeleteTask
}: TaskListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskOwnerId, setNewTaskOwnerId] = useState(currentUser?.id || users[0]?.id || '')

  // Count open and completed tasks
  const openTasks = tasks.filter(t => t.status === 'open')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  const handleAddTask = () => {
    if (newTaskDescription.trim() && newTaskOwnerId) {
      onAddTask?.(newTaskDescription.trim(), newTaskOwnerId)
      setNewTaskDescription('')
      setNewTaskOwnerId(currentUser?.id || users[0]?.id || '')
      setIsAddingTask(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddTask()
    } else if (e.key === 'Escape') {
      setIsAddingTask(false)
      setNewTaskDescription('')
    }
  }

  return (
    <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
      {/* Header with toggle and counter */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-slate-400 dark:text-slate-600 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tasks
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            ({openTasks.length} open, {completedTasks.length} completed)
          </span>
        </div>
      </button>

      {/* Expanded task list */}
      {isExpanded && (
        <div className="mt-3">
          {/* Task items container with max height and scroll */}
          <div className="max-h-[400px] overflow-y-auto">
            {/* Open tasks */}
            {openTasks.length > 0 && (
              <div className="space-y-0.5">
                {openTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleStatus={() => onToggleTaskStatus?.(task.id)}
                    onEdit={() => {
                      // For MVP, we'll just log - full edit implementation can come later
                      console.log('Edit task:', task.id)
                    }}
                    onDelete={() => onDeleteTask?.(task.id)}
                  />
                ))}
              </div>
            )}

            {/* Separator between open and completed */}
            {openTasks.length > 0 && completedTasks.length > 0 && (
              <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
            )}

            {/* Completed tasks (muted) */}
            {completedTasks.length > 0 && (
              <div className="space-y-0.5 opacity-75">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleStatus={() => onToggleTaskStatus?.(task.id)}
                    onEdit={() => {
                      // For MVP, we'll just log - full edit implementation can come later
                      console.log('Edit task:', task.id)
                    }}
                    onDelete={() => onDeleteTask?.(task.id)}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {tasks.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-500 py-4 text-center">
                No tasks yet
              </p>
            )}
          </div>

          {/* Add task section */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 rounded px-2 py-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            ) : (
              <div className="space-y-2">
                {/* Description input */}
                <input
                  type="text"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Task description..."
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all"
                />

                {/* Owner select and actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={newTaskOwnerId}
                    onChange={(e) => setNewTaskOwnerId(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleAddTask}
                    disabled={!newTaskDescription.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-teal-400"
                  >
                    Add
                  </button>

                  <button
                    onClick={() => {
                      setIsAddingTask(false)
                      setNewTaskDescription('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-slate-400 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
