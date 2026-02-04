import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

export interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
  icon?: React.ReactNode
}

export interface User {
  name: string
  email?: string
  role?: string
  avatarUrl?: string
}

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            PowerOne
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {user && (
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <UserMenu user={user} onLogout={onLogout} />
              </div>
            )}
            <MainNav
              items={navigationItems}
              onNavigate={(href) => {
                onNavigate?.(href)
                setMobileMenuOpen(false)
              }}
              isMobile
            />
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          {/* Logo and User Menu */}
          <div className="flex flex-col flex-shrink-0 px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              PowerOne
            </h1>
            {user && <UserMenu user={user} onLogout={onLogout} />}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <MainNav items={navigationItems} onNavigate={onNavigate} />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 pt-16 lg:pt-0">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
