---
description: "Choose colors and typography for the product design system"
---

You are helping the user choose colors and typography for their product. These design tokens will be used consistently across all screen designs and the application shell.

## Step 1: Check Prerequisites

Read `product/product-overview.md` to understand what the product is.

If it doesn't exist:
"Before defining your design system, you'll need to establish your product vision. Please run `/product-vision` first."

Stop here if the prerequisite is missing.

## Step 2: Explain the Process

"Let's define the visual identity for **[Product Name]**.

I'll help you choose:
1. **Colors** — A primary accent, secondary accent, and neutral palette
2. **Typography** — Fonts for headings, body text, and code

These will be applied consistently across all your screen designs and the application shell.

Do you have any existing brand colors or fonts in mind, or would you like suggestions?"

Wait for their response.

## Step 3: Choose Colors

Help the user select from Tailwind's built-in color palette:

"For colors, we'll pick from Tailwind's palette so they work seamlessly with your screen designs.

**Primary color** (main accent, buttons, links):
Common choices: `blue`, `indigo`, `violet`, `emerald`, `teal`, `amber`, `rose`, `lime`

**Secondary color** (complementary accent, tags, highlights):
Should complement your primary — often a different hue or a neutral variation

**Neutral color** (backgrounds, text, borders):
Options: `slate` (cool gray), `gray` (pure gray), `zinc` (slightly warm), `neutral`, `stone` (warm gray)

Based on [Product Name], I'd suggest:
- **Primary:** [suggestion] — [why it fits]
- **Secondary:** [suggestion] — [why it complements]
- **Neutral:** [suggestion] — [why it works]

What feels right for your product?"

Ask follow-up questions if needed:
- "What vibe are you going for? Professional, playful, modern, minimal?"
- "Any colors you definitely want to avoid?"
- "Light mode, dark mode, or both?"

## Step 4: Choose Typography

Help the user select Google Fonts:

"For typography, we'll use Google Fonts for easy web integration.

**Heading font** (titles, section headers):
Popular choices: `DM Sans`, `Inter`, `Poppins`, `Manrope`, `Space Grotesk`, `Outfit`

**Body font** (paragraphs, UI text):
Often the same as heading, or: `Inter`, `Source Sans 3`, `Nunito Sans`, `Open Sans`

**Mono font** (code, technical content):
Options: `IBM Plex Mono`, `JetBrains Mono`, `Fira Code`, `Source Code Pro`

My suggestions for [Product Name]:
- **Heading:** [suggestion] — [why]
- **Body:** [suggestion] — [why]
- **Mono:** [suggestion] — [why]

What do you prefer?"

## Step 5: Present Final Choices

"Here's your design system:

**Colors:**
- Primary: `[color]`
- Secondary: `[color]`
- Neutral: `[color]`

**Typography:**
- Heading: [Font Name]
- Body: [Font Name]
- Mono: [Font Name]

Does this look good? Ready to save it?"

## Step 6: Create the Files

Once approved, create two files:

**File 1:** `product/design-system/colors.json`
```json
{
  "primary": "[color]",
  "secondary": "[color]",
  "neutral": "[color]"
}
```

**File 2:** `product/design-system/typography.json`
```json
{
  "heading": "[Font Name]",
  "body": "[Font Name]",
  "mono": "[Font Name]"
}
```

## Step 7: Confirm Completion

"I've saved your design tokens:
- `product/design-system/colors.json`
- `product/design-system/typography.json`

Next step: Run `/design-shell` to design your application's navigation and layout."

## Reference: Tailwind Color Palette

Available colors (each has shades 50-950):
- **Warm:** `red`, `orange`, `amber`, `yellow`, `lime`
- **Cool:** `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`
- **Purple:** `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`
- **Neutral:** `slate`, `gray`, `zinc`, `neutral`, `stone`

## Reference: Popular Google Font Pairings

- **Modern & Clean:** DM Sans + DM Sans + IBM Plex Mono
- **Professional:** Inter + Inter + JetBrains Mono
- **Friendly:** Nunito Sans + Nunito Sans + Fira Code
- **Bold & Modern:** Space Grotesk + Inter + Source Code Pro
- **Editorial:** Playfair Display + Source Sans 3 + IBM Plex Mono
- **Tech-forward:** JetBrains Mono + Inter + JetBrains Mono

## Important Notes

- Colors should be Tailwind palette names (not hex codes)
- Fonts should be exact Google Fonts names
- Keep suggestions contextual to the product type
- Design tokens apply to screen designs only — the Design OS app keeps its own aesthetic
