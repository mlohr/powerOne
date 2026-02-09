---
description: "Create a screen design for a section — props-based React component"
---

You are helping the user create a screen design for a section of their product. The screen design will be a props-based React component that can be exported and integrated into any React codebase.

## Step 1: Check Prerequisites

Read `product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple, ask which section the user wants to create a screen design for.

Then verify all required files exist:
- `product/sections/[section-id]/spec.md`
- `product/sections/[section-id]/data.json`
- `product/sections/[section-id]/types.ts`

If spec.md doesn't exist: "Please run `/shape-section` first."
If data.json or types.ts don't exist: "Please run `/sample-data` first."

Stop here if any file is missing.

## Step 2: Check for Design System and Shell

**Design Tokens:** Check if `product/design-system/colors.json` and `product/design-system/typography.json` exist. If not, warn but continue with defaults.

**Shell:** Check if `src/shell/components/AppShell.tsx` exists. If not, warn but continue standalone.

## Step 3: Analyze Requirements

Read and analyze all three files:
1. **spec.md** — User flows and UI requirements
2. **data.json** — Data structure and sample content
3. **types.ts** — TypeScript interfaces and available callbacks

## Step 4: Clarify Scope

If the spec implies multiple views, ask which view to build first:

"The specification suggests a few different views:
1. **[View 1]** — [Brief description]
2. **[View 2]** — [Brief description]

Which view should I create first?"

If there's only one obvious view, proceed directly.

## Step 5: Read the Frontend Design Skill

Before creating the screen design, read the `frontend-design` skill at `.github/skills/frontend-design.md` and follow its guidance for creating distinctive, production-grade interfaces.

## Step 6: Create the Props-Based Component

Create the main component at `src/sections/[section-id]/components/[ViewName].tsx`.

The component MUST:
- Import types from the types.ts file
- Accept all data via props (never import data.json directly)
- Accept callback props for all actions
- Be fully self-contained and portable

### Design Requirements

- **Mobile responsive:** Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- **Light & dark mode:** Use `dark:` variants for all colors
- **Use design tokens:** If defined, apply the product's color palette and typography
- **Follow the frontend-design skill:** Create distinctive, memorable interfaces

### Applying Design Tokens

**If colors.json exists:** Use primary for buttons/links, secondary for tags/highlights, neutral for backgrounds/text.
**If design tokens don't exist:** Fall back to `stone` for neutrals and `lime` for accents.

### What NOT to Include

- No `import data from` statements — data comes via props
- No features not specified in the spec
- No routing logic — callbacks handle navigation intent
- No navigation elements (shell handles navigation)

## Step 7: Create Sub-Components (If Needed)

For complex views, break down into sub-components at `src/sections/[section-id]/components/[SubComponent].tsx`. Each sub-component should also be props-based.

## Step 8: Create the Preview Wrapper

Create a preview wrapper at `src/sections/[section-id]/[ViewName].tsx` (in the section root, not in components/).

This wrapper:
- Has a `default` export (required for Design OS routing)
- Imports sample data from data.json
- Passes data to the component via props
- Provides console.log handlers for callbacks
- Is NOT exported to the user's codebase
- Will render inside the shell if one has been designed

## Step 9: Create Component Index

Create `src/sections/[section-id]/components/index.ts` to export all components.

## Step 10: Confirm and Next Steps

"I've created the screen design for **[Section Title]**:

**Exportable components** (props-based, portable):
- `src/sections/[section-id]/components/[ViewName].tsx`

**Preview wrapper** (for Design OS only):
- `src/sections/[section-id]/[ViewName].tsx`

**Important:** Restart your dev server to see the changes.

**Next steps:**
- Run `/screenshot-design` to capture a screenshot
- If the spec calls for additional views, run `/design-screen` again
- When all sections are complete, run `/export-product` to generate the export package"

## Important Notes

- ALWAYS read the `frontend-design` skill before creating screen designs
- Components MUST be props-based — never import data.json in exportable components
- The preview wrapper is the ONLY file that imports data.json
- Use TypeScript interfaces from types.ts for all props
- Callbacks should be optional (`?`) and called with optional chaining (`?.`)
- Always remind the user to restart the dev server after creating files
