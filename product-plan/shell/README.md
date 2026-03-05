# Application Shell

## Overview

The PowerOne application shell provides a sidebar navigation layout optimized for enterprise OKR management. It features a fixed vertical sidebar on the left with the PowerOne brand, user menu, and navigation links. The content area on the right displays the active section.

## Navigation Structure

Main sections:
- OKR Hierarchy (`/okr-hierarchy`)
- Programs (`/programs`)
- Metrics & Progress (`/metrics-and-progress`)
- OKR Rituals (`/okr-rituals`)

Utility areas:
- Admin (`/admin`)
- Settings (`/settings`)
- Help (`/help`)

## Layout Pattern

- **Desktop (1024px+):** Fixed 272px sidebar on left, flexible content area on right
- **Tablet:** Narrower sidebar, content area adjusts
- **Mobile (<768px):** Top bar with hamburger menu, navigation collapses to dropdown

## Components Provided

- `AppShell` — Main layout wrapper with sidebar + content area
- `MainNav` — Navigation component with icon map and active states
- `UserMenu` — User avatar, name, role, and logout dropdown

## Props

### AppShell
| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Content to render in the main area |
| `navigationItems` | NavigationItem[] | Array of nav items |
| `user` | User | Logged-in user info |
| `onNavigate` | (href: string) => void | Navigation callback |
| `onLogout` | () => void | Logout callback |

### NavigationItem
```typescript
{
  label: string
  href: string
  isActive?: boolean
  icon?: React.ReactNode
}
```

### User
```typescript
{
  name: string
  email?: string
  role?: string
  avatarUrl?: string
}
```

## Visual Reference

See `screenshot.png` for the target UI design (if available).
