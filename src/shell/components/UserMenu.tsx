import { useState, useRef, useEffect } from 'react'
import { ChevronDown, LogOut } from 'lucide-react'
import type { User } from './AppShell'

export interface UserMenuProps {
  user: User
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-medium">
              {initials}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </p>
          {user.role && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.role}
            </p>
          )}
        </div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
          <button
            onClick={() => {
              onLogout?.()
              setIsOpen(false)
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <LogOut size={16} className="text-slate-500 dark:text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
