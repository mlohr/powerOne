---
description: "Capture a screenshot of a screen design for documentation"
---

You are helping the user capture a screenshot of a screen design they've created. The screenshot will be saved to the product folder for documentation purposes.

## Prerequisites: Browser Automation

This command requires browser automation capabilities (e.g., Playwright MCP or similar). If not available, let the user know they need to set up a browser automation tool.

## Step 1: Identify the Screen Design

Read `product/product-roadmap.md` to get the list of available sections, then check `src/sections/` to see what screen designs exist.

If only one screen design exists, auto-select it.

If multiple exist, ask which one to screenshot:

"Which screen design would you like to screenshot?"

Present the available options grouped by section.

## Step 2: Start the Dev Server

Start the dev server by running `npm run dev` in the background. Do NOT ask the user to do this — start it yourself.

Wait a few seconds for it to be ready.

## Step 3: Capture the Screenshot

Navigate to the screen design URL:
`http://localhost:3000/sections/[section-id]/screen-designs/[screen-design-name]`

1. Navigate to the URL
2. Wait for the page to fully load
3. Click the "Hide" link in the navigation bar (has `data-hide-header` attribute) to hide it before taking the screenshot
4. Capture a full page screenshot (PNG format, 1280px viewport width)

## Step 4: Save the Screenshot

Save the screenshot to `product/sections/[section-id]/[filename].png`

**Naming convention:** `[screen-design-name]-[variant].png`

Examples:
- `invoice-list.png` (main view)
- `invoice-list-dark.png` (dark mode variant)

## Step 5: Confirm Completion

"I've saved the screenshot to `product/sections/[section-id]/[filename].png`.

Would you like me to capture any additional screenshots? For example:
- Dark mode version
- Mobile viewport
- Different states (empty, loading, etc.)"

## Important Notes

- Start the dev server yourself — do not ask the user
- Screenshots are saved to `product/sections/[section-id]/` alongside spec.md and data.json
- Use descriptive filenames
- Capture at consistent viewport width (1280px)
- Always capture full page screenshots
- After you're done, you may kill the dev server if you started it
