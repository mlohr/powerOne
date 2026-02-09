---
description: "Create realistic sample data and TypeScript types for a section"
---

You are helping the user create realistic sample data for a section of their product. This data will be used to populate screen designs. You will also generate TypeScript types based on the data structure.

## Step 1: Check Prerequisites

Read `product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple, ask which section the user wants to generate data for.

Then check if `product/sections/[section-id]/spec.md` exists. If it doesn't:

"I don't see a specification for **[Section Title]** yet. Please run `/shape-section` first to define the section's requirements."

Stop here if the spec doesn't exist.

## Step 2: Check for Global Data Model

Check if `product/data-model/data-model.md` exists.

**If it exists:** Read it and use entity names/relationships as a guide.
**If it doesn't:** Show a warning but continue:
"Note: A global data model hasn't been defined yet. I'll create entity structures based on the section spec."

## Step 3: Analyze the Specification

Read `product/sections/[section-id]/spec.md` to understand:

- What data entities are implied by the user flows?
- What fields/properties would each entity need?
- What sample values would be realistic?
- What actions can be taken on each entity? (These become callback props)

## Step 4: Present Data Structure

Present your proposed data structure in human-friendly language:

"Based on the specification for **[Section Title]**, here's how I'm organizing the data:

**Data Models:**
- **[Entity1]** — [One sentence explanation]
- **[Entity2]** — [One sentence explanation]

**What You Can Do:**
- View, edit, and delete [entities]
- [Other key actions from the spec]

**Sample Data:**
I'll create [X] realistic records with varied content.

Does this structure make sense? Any adjustments?"

## Step 5: Generate the Data File

Create `product/sections/[section-id]/data.json` with:

- **A `_meta` section** — Human-readable descriptions of each data model and their relationships
- **Realistic sample data** — Use believable names, dates, descriptions
- **Varied content** — Mix short and long text, different statuses
- **Edge cases** — Include at least one empty array, one long description

### Required `_meta` Structure

```json
{
  "_meta": {
    "models": {
      "invoices": "Each invoice represents a bill you send to a client.",
      "lineItems": "Line items are individual charges on each invoice."
    },
    "relationships": [
      "Each Invoice contains one or more Line Items",
      "Invoices track which Client they belong to"
    ]
  },
  "invoices": [...]
}
```

## Step 6: Generate TypeScript Types

Create `product/sections/[section-id]/types.ts` based on the data structure.

### Type Generation Rules

1. **Infer types from sample data:** Strings → `string`, Numbers → `number`, etc.
2. **Use union types for status fields:** `'draft' | 'sent' | 'paid' | 'overdue'`
3. **Create a Props interface** for the main component with data and callback props
4. **Use consistent entity names** from the global data model if one exists

Example types.ts:

```typescript
// =============================================================================
// Data Types
// =============================================================================

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  lineItems: LineItem[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface InvoiceListProps {
  /** The list of invoices to display */
  invoices: Invoice[]
  /** Called when user wants to view an invoice */
  onView?: (id: string) => void
  /** Called when user wants to create a new invoice */
  onCreate?: () => void
}
```

## Step 7: Confirm and Next Steps

"I've created two files for **[Section Title]**:

1. `product/sections/[section-id]/data.json` — Sample data with [X] records
2. `product/sections/[section-id]/types.ts` — TypeScript interfaces

When you're ready, run `/design-screen` to create the screen design for this section."

## Important Notes

- Generate realistic, believable sample data — not "Lorem ipsum" or "Test 123"
- Include 5-10 sample records for main entities
- Include edge cases: empty arrays, long text, different statuses
- Keep field names clear and TypeScript-friendly (camelCase)
- Callback props should cover all actions mentioned in the spec
- Use entity names from the global data model for consistency across sections
