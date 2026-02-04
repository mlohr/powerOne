import type { ActivityUpdate } from '@/../product/sections/programs/types'
import { Plus, Edit2, TrendingUp, UserPlus, UserMinus, Target } from 'lucide-react'

interface ActivityFeedItemProps {
  activity: ActivityUpdate
}

const activityIcons = {
  program_created: Plus,
  program_edited: Edit2,
  objective_added: Target,
  objective_removed: Target,
  progress_update: TrendingUp,
  lead_added: UserPlus,
  lead_removed: UserMinus,
}

const activityColors = {
  program_created: 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
  program_edited: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  objective_added: 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
  objective_removed: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
  progress_update: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  lead_added: 'text-teal-500 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30',
  lead_removed: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30',
}

export function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const Icon = activityIcons[activity.type]
  const colorClass = activityColors[activity.type]

  // Format timestamp
  const date = new Date(activity.timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  let timeAgo: string
  if (diffMins < 1) {
    timeAgo = 'Just now'
  } else if (diffMins < 60) {
    timeAgo = `${diffMins}m ago`
  } else if (diffHours < 24) {
    timeAgo = `${diffHours}h ago`
  } else if (diffDays === 1) {
    timeAgo = 'Yesterday'
  } else if (diffDays < 7) {
    timeAgo = `${diffDays}d ago`
  } else {
    timeAgo = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex gap-3 group">
      <div className={`shrink-0 w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
        <Icon className="w-4 h-4" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
        <p className="text-sm text-slate-900 dark:text-slate-100 mb-1">
          {activity.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">{activity.user}</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  )
}
