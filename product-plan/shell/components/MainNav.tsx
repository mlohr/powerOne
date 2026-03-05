import React from 'react'
import {
  Target,
  Folder,
  TrendingUp,
  Calendar,
  Settings,
  HelpCircle,
  Shield,
} from 'lucide-react'
import type { NavigationItem } from './AppShell'

const iconMap: Record<string, React.ReactNode> = {
  'OKR Hierarchy': <Target size={20} />,
  Programs: <Folder size={20} />,
  'Metrics & Progress': <TrendingUp size={20} />,
  'OKR Rituals': <Calendar size={20} />,
  Admin: <Shield size={20} />,
  Settings: <Settings size={20} />,
  Help: <HelpCircle size={20} />,
}

export interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
  isMobile?: boolean
}

export function MainNav({ items, onNavigate, isMobile = false }: MainNavProps) {
  // Separate main sections from utility items
  const mainSections = items.slice(0, 5)
  const utilityItems = items.slice(5)

  const renderNavItem = (item: NavigationItem) => {
    const icon = item.icon || iconMap[item.label]
    const isActive = item.isActive

    return (
      <button
        key={item.href}
        onClick={() => onNavigate?.(item.href)}
        className={`
          flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
          ${
            isActive
              ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
          }
        `}
      >
        <span
          className={`
            ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}
          `}
        >
          {icon}
        </span>
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <div className={isMobile ? 'py-2' : 'space-y-1'}>
      {/* Main Sections */}
      <div className={isMobile ? 'px-4 space-y-1' : 'space-y-1'}>
        {mainSections.map(renderNavItem)}
      </div>

      {/* Divider */}
      {utilityItems.length > 0 && (
        <div className={isMobile ? 'my-2 px-4' : 'my-4'}>
          <div className="h-px bg-slate-200 dark:bg-slate-800" />
        </div>
      )}

      {/* Utility Items */}
      {utilityItems.length > 0 && (
        <div className={isMobile ? 'px-4 space-y-1' : 'space-y-1'}>
          {utilityItems.map(renderNavItem)}
        </div>
      )}
    </div>
  )
}
