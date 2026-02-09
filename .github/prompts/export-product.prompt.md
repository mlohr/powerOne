---
description: "Export the complete product design as a handoff package for implementation"
---

You are helping the user export their complete product design as a handoff package for implementation. This generates all files needed to build the product in a real codebase.

## Step 1: Check Prerequisites

**Required:**
- `product/product-overview.md` — Product overview
- `product/product-roadmap.md` — Sections defined
- At least one section with screen designs in `src/sections/[section-id]/`

**Recommended (show warning if missing):**
- `product/data-model/data-model.md` — Global data model
- `product/design-system/colors.json` — Color tokens
- `product/design-system/typography.json` — Typography tokens
- `src/shell/components/AppShell.tsx` — Application shell

If required files are missing, stop and tell the user what's needed.
If recommended files are missing, show warnings but continue.

## Step 2: Gather Export Information

Read all relevant files:
1. `product/product-overview.md`
2. `product/product-roadmap.md`
3. `product/data-model/data-model.md` (if exists)
4. `product/design-system/colors.json` (if exists)
5. `product/design-system/typography.json` (if exists)
6. `product/shell/spec.md` (if exists)
7. For each section: `spec.md`, `data.json`, `types.ts`
8. List screen design components in `src/sections/` and `src/shell/`

## Step 3: Create Export Directory Structure

Create the `product-plan/` directory with this structure:

```
product-plan/
├── README.md
├── product-overview.md
├── prompts/
│   ├── one-shot-prompt.md
│   └── section-prompt.md
├── instructions/
│   ├── one-shot-instructions.md
│   └── incremental/
│       ├── 01-foundation.md
│       └── [NN]-[section-id].md
├── design-system/
│   ├── tokens.css
│   ├── tailwind-colors.md
│   └── fonts.md
├── data-model/
│   ├── README.md
│   ├── types.ts
│   └── sample-data.json
├── shell/
│   ├── README.md
│   └── components/
└── sections/
    └── [section-id]/
        ├── README.md
        ├── tests.md
        ├── components/
        ├── types.ts
        ├── sample-data.json
        └── screenshot.png (if exists)
```

## Step 4: Generate All Export Files

### product-overview.md
Product summary with sections, data model overview, design system, and implementation sequence.

### Milestone Instructions
Each milestone instruction file should include a standard preamble explaining:
- What the user is receiving (UI designs, types, specs)
- What they need to build (backend, auth, data fetching)
- Important guidelines (don't restyle components, wire up callbacks, implement empty states, use TDD)

**01-foundation.md:** Design tokens, data model types, routing structure, application shell.

**[NN]-[section-id].md:** For each section — overview, components to copy, data layer, callbacks to wire up, empty states, expected user flows, done-when checklist. Recommend TDD with `tests.md`.

### one-shot-instructions.md
All milestones combined into a single document.

### Prompt Files
**one-shot-prompt.md:** Ready-to-paste prompt that instructs the coding agent to read all files, asks clarifying questions about auth/users/tech stack/business logic.

**section-prompt.md:** Template prompt with variables (SECTION_NAME, SECTION_ID, NN) for incremental implementation.

### Section Tests
For each section, generate `tests.md` with:
- User flow tests (success and failure paths)
- Empty state tests
- Component interaction tests
- Edge cases
- Accessibility checks
- Sample test data

### Design System Files
`tokens.css`, `tailwind-colors.md`, `fonts.md` based on design tokens.

## Step 5: Copy and Transform Components

- Copy shell components from `src/shell/components/` → `product-plan/shell/components/`
- Copy section components from `src/sections/[id]/components/` → `product-plan/sections/[id]/components/`
- Transform import paths from `@/...` to relative paths
- Copy types.ts and data.json (as sample-data.json)
- Copy any screenshots (.png files)

## Step 6: Generate README.md

Quick start guide explaining:
- What's included (prompts, instructions, design assets)
- Option A: Incremental implementation (recommended)
- Option B: One-shot implementation
- TDD approach with tests.md
- Tips for best results

## Step 7: Create Zip File

```bash
rm -f product-plan.zip
cd . && zip -r product-plan.zip product-plan/
```

## Step 8: Confirm Completion

"I've created the complete export package at `product-plan/` and `product-plan.zip`.

**What's Included:**
- Ready-to-use prompts for coding agents
- Milestone instructions (foundation + sections)
- Design assets (tokens, types, components)
- Test instructions for TDD

**How to Use:**
1. Copy `product-plan/` to your implementation codebase
2. Open the appropriate prompt file
3. Copy/paste into your coding agent
4. Answer clarifying questions and implement

Restart your dev server and visit the Export page to download `product-plan.zip`."

## Important Notes

- Always transform import paths when copying components
- Include `product-overview.md` context with every implementation session
- Screenshots provide visual reference for fidelity checking
- The export is self-contained — no dependencies on Design OS
- Components are portable — they work with any React setup
