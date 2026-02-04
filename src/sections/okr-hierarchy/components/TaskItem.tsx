import { useState } from 'react'
import type { Task } from '@/../product/sections/okr-hierarchy/types'

// Typography: Inter for body (from design tokens)
// Colors: teal (primary), slate (neutral)

interface TaskItemProps {
  /** The task to display */
  task: Task
  /** Called when user toggles the task completion status */
  onToggleStatus?: () => void
  /** Called when user wants to edit the task */
  onEdit?: () => void
  /** Called when user wants to delete the task */
  onDelete?: () => void
}

export function TaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete
}: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Format timestamp as relative time
  const getRelativeTime = (timestamp: string): string => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const isCompleted = task.status === 'completed'

  return (
    <div
      className="group flex items-start gap-3 py-2 px-3 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={onToggleStatus}
        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-offset-2"
        style={{
          backgroundColor: isCompleted ? '#0d9488' : 'transparent',
          borderColor: isCompleted ? '#0d9488' : undefined
        }}
        aria-label={isCompleted ? 'Mark as open' : 'Mark as completed'}
      >
        {isCompleted && (
          <svg
            className="w-full h-full text-white"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 10 L8 13 L15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          {/* Description */}
          <p
            className={`text-sm leading-relaxed ${
              isCompleted
                ? 'text-slate-500 dark:text-slate-500 line-through'
                : 'text-slate-700 dark:text-slate-300'
            }`}
            title={task.description}
          >
            {task.description}
          </p>

          {/* Actions (hover-reveal) */}
          {(isHovered || onEdit || onDelete) && (
            <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 rounded"
                  aria-label="Edit task"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1 text-slate-400 hover:text-red-600 dark:text-slate-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 rounded"
                  aria-label="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Owner and Timestamp */}
        <div className="flex items-center gap-3 mt-1">
          {/* Owner */}
          <div className="flex items-center gap-1.5">
            {task.owner.avatar ? (
              <img
                src={task.owner.avatar}
                alt={task.owner.name}
                className="w-4 h-4 rounded-full"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <span className="text-[8px] font-medium text-slate-600 dark:text-slate-400">
                  {task.owner.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-500">
              {task.owner.name}
            </span>
          </div>

          {/* Timestamp */}
          <span className="text-xs text-slate-400 dark:text-slate-600">
            {isCompleted && task.completedAt
              ? `completed ${getRelativeTime(task.completedAt)}`
              : `created ${getRelativeTime(task.createdAt)}`}
          </span>
        </div>
      </div>
    </div>
  )
}
