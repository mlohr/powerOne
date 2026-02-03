# Application Shell Specification

## Overview
The PowerOne application shell provides a sidebar navigation layout optimized for enterprise OKR management. It features a vertical sidebar on the left with the PowerOne brand, user menu, and navigation links to all main sections and utility areas. The content area on the right displays the active section.

## Navigation Structure
- **PowerOne Logo** — Brand/home link at top of sidebar
- **User Menu** — Avatar, user name, and logout below logo
- **Main Sections:**
  - OKR Hierarchy → Section 1
  - Programs → Section 2
  - Metrics & Progress → Section 3
  - OKR Rituals → Section 4
- **Utility Areas:**
  - Admin → Admin area for master data, users, rituals
  - Settings → User settings and preferences
  - Help → Help and documentation

## User Menu
- **Location:** Top of sidebar, directly below the PowerOne logo
- **Contents:** User avatar (or initials fallback), user name, role indicator, logout dropdown
- **Behavior:** Clicking opens a dropdown menu with user profile options and logout

## Layout Pattern
- **Sidebar:** Fixed vertical navigation (240-280px width) on the left side
- **Content Area:** Flexible width area on the right for section content
- **Visual Style:** Clean, minimal design with teal accents for active states, subtle borders, and consistent spacing

## Responsive Behavior
- **Desktop (1024px+):** Fixed sidebar on left, full content area on right
- **Tablet (768px-1023px):** Slightly narrower sidebar, content area adjusts
- **Mobile (<768px):** Sidebar transforms into horizontal top bar with logo and hamburger menu; navigation items stack in dropdown

## Design Notes
- Use teal (primary) for active navigation items and key interactions
- Use blue (secondary) for hover states and secondary highlights
- Use slate (neutral) for backgrounds, borders, and text
- Apply Inter font family for all text
- Support light and dark modes throughout
- Ensure all interactive elements have clear hover and active states
- Maintain consistent spacing and alignment across all breakpoints
