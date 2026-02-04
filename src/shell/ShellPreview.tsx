import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: 'OKR Hierarchy', href: '/okr-hierarchy', isActive: true },
    { label: 'Programs', href: '/programs' },
    { label: 'Metrics & Progress', href: '/metrics-progress' },
    { label: 'OKR Rituals', href: '/okr-rituals' },
    { label: 'Admin', href: '/admin' },
    { label: 'Settings', href: '/settings' },
    { label: 'Help', href: '/help' },
  ]

  const user = {
    name: 'Alex Morgan',
    email: 'alex.morgan@powerone.com',
    role: 'Program Lead',
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            OKR Hierarchy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create, edit, and manage Objectives and Key Results across all organizational
            levels with clear ownership, linking, and lifecycle management.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Content Area
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This is where section-specific content will render. Each section (OKR Hierarchy,
            Programs, Metrics & Progress, etc.) will display its own screens here.
          </p>
          <div className="space-y-3">
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-teal-900 dark:text-teal-100 mb-1">
              Active OKRs
            </h3>
            <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">47</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Programs
            </h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">12</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              On Track
            </h3>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">85%</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
