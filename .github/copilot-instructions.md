# Copilot Instructions for Design OS (PowerOne)

## What This Is

Design OS is a **product planning and design tool** — NOT the end product. It helps define product vision, data models, and screen designs that get exported as a handoff package (`product-plan/`) for implementation in a separate codebase.

## Two Distinct Contexts

Every change falls into one of two contexts:

1. **Design OS Application** (`src/`, `public/`) — The React app that renders and previews the product design. Always uses stone/lime palette, DM Sans, and the shadcn/ui component library. Prompt files in `.github/prompts/` drive the workflows that construct product files and screen designs.
2. **Product Definition** (`product/`, `src/sections/`, `src/shell/`) — The product being planned (PowerOne), an OKR management platform implemented on **Microsoft Power Platform** (Dataverse, Canvas Apps, Model-Driven Apps). See `product/backlog/planning.md` for the three-workstream implementation plan. Screen design components use design tokens from `product/design-system/` and must be **props-based and portable** — never import data directly.

## Tech Stack & Build

- **Vite + React 19 + TypeScript**, deployed to GitHub Pages at `/powerOne/` base path
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js` exists or should be created
- **shadcn/ui** (new-york style) for Design OS UI components in `src/components/ui/`
- **Radix UI** primitives, **lucide-react** icons, **react-router-dom** v7 for routing
- Dev server: `npm run dev` (port 3000), Build: `npm run build`, Deploy: `npm run deploy`
- **Deployment**: When `product/` is updated, build and deploy to the `gh-pages` branch on `https://github.com/mlohr/powerOne` via `npm run deploy`

## Architecture Patterns

### Data Loading via `import.meta.glob`
Product files (`product/**/*.md`, `product/**/*.json`) are loaded at **build time** using Vite's `import.meta.glob` with `eager: true`. Changes to product files require a dev server restart. See `src/lib/product-loader.ts` and `src/lib/section-loader.ts`.

### Routing
Routes are defined in `src/lib/router.tsx` with `basename: '/powerOne'`. Screen designs are loaded lazily via `import.meta.glob('/src/sections/*/*.tsx')`.

### Section Screen Design Pattern
Exportable components live in `src/sections/[id]/components/` and accept all data via props. Preview wrappers in `src/sections/[id]/[ViewName].tsx` import sample data from `product/sections/[id]/data.json` and have a `default` export — these are NOT exported to the product.

### Product Data Files
All product definition files live in `product/` with strict markdown formats parsed by regex in the loaders. See `parseProductOverview()` and `parseProductRoadmap()` in `src/lib/product-loader.ts` for required heading structures.

## Key Conventions

- **Tailwind v4 only**: Use built-in utility classes and colors. No custom CSS, no `tailwind.config.js`, no custom color definitions.
- **Dark mode**: Use `dark:` variants everywhere. Dark mode is toggled via `.dark` class on root (see `@custom-variant dark (&:is(.dark *))` in `index.css`).
- **Path alias**: `@/` maps to `src/`. Product imports use `@/../product/...`.
- **Design OS aesthetic**: Stone palette for neutrals, lime for accents, DM Sans font, max 800px content width, subtle 200ms fade-ins.
- **Screen design components**: Must be responsive (`sm:`, `md:`, `lg:`), support light/dark mode, accept data+callbacks via props, and include no navigation chrome.

## Skills & Prompts

- **Prompt files** in `.github/prompts/` provide step-by-step workflows (product-vision, design-screen, export-product, etc.)
- **Skill files** in `.github/skills/` provide domain knowledge (frontend-design aesthetics, Power Platform analysis)
- When creating screen designs, always read `.github/skills/frontend-design.md` first for design quality guidance.
