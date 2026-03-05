# Test Instructions: Metrics & Progress

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Metrics & Progress section lets users update metric values for their Key Results in the active sprint. Key functionality: viewing assigned KRs, entering new metric values, seeing progress percentages, and saving updates.

---

## User Flow Tests

### Flow 1: View Assigned Key Results

**Scenario:** User views their Key Results for the active sprint

#### Success Path

**Setup:**
- User has Key Results assigned in the active sprint
- Each KR has one or more metrics with baseline, current, and target values

**Steps:**
1. User navigates to `/metrics` or `/metrics-and-progress`
2. User sees the page header with "Metrics & Progress" and the sprint badge (e.g., "Sprint 26.1")
3. User sees a list of Key Result cards

**Expected Results:**
- [ ] Page heading "Metrics & Progress" is visible
- [ ] Sprint name badge is displayed (e.g., "Sprint 26.1")
- [ ] Each KR card shows the KR title
- [ ] Each KR card shows the parent objective title as subtext
- [ ] Each KR card shows the org unit level badge (e.g., "Entity", "Domain", "Team")
- [ ] Each metric shows: metric name, baseline value, current value, target value with units
- [ ] Each metric shows a progress percentage

---

### Flow 2: Update a Metric Value

**Scenario:** User enters a new metric value and saves it

#### Success Path

**Setup:**
- A KR with a metric is visible (e.g., "Enterprise deals closed", current: 3, target: 10)

**Steps:**
1. User sees the metric input field pre-filled with the current value (3)
2. User clears the input and types a new value (e.g., "5")
3. User clicks "Save" button

**Expected Results:**
- [ ] Save button becomes enabled when value is changed
- [ ] `onUpdateMetric` is called with the metric id and new numeric value (5)
- [ ] After save, the input reflects the updated value
- [ ] Save button returns to disabled state (no unsaved changes)

#### Failure Path: Invalid Input

**Setup:**
- User clears the input field completely

**Steps:**
1. User clears the metric input (empty string)
2. User tries to click "Save"

**Expected Results:**
- [ ] Save button is disabled when input is empty
- [ ] No API call is made

#### Failure Path: Non-numeric Input

**Setup:**
- User enters non-numeric text

**Steps:**
1. User types "abc" in the metric input

**Expected Results:**
- [ ] Input field (type="number") prevents non-numeric input
- [ ] Save button remains disabled or no call is made

---

### Flow 3: Progress Percentage Display

**Scenario:** Progress percentage is correctly calculated and color-coded

**Setup:**
- Metric with direction "increase": baseline=0, target=10, currentValue=7.5 → 75%
- Metric with direction "decrease": baseline=21, target=14, currentValue=17 → ~57%

**Expected Results:**
- [ ] Increase metric at 75% shows "75%" in teal color
- [ ] Metric at 50-74% shows in blue color
- [ ] Metric at 25-49% shows in amber color
- [ ] Metric below 25% shows in slate color
- [ ] Decrease direction calculates correctly (progress = how much reduced from baseline toward target)

---

## Empty State Tests

### No Key Results Assigned

**Scenario:** User has no KRs assigned in the active sprint

**Setup:**
- `keyResults: []`

**Expected Results:**
- [ ] Empty state is shown (not a blank screen)
- [ ] Shows an icon and heading: "No Key Results to update"
- [ ] Shows description: "You don't have any Key Results assigned in the active sprint."
- [ ] No input fields or Save buttons rendered

---

## Component Interaction Tests

### MetricsProgress

**Renders correctly:**
- [ ] Displays sprint name in badge
- [ ] Shows all KR titles from the keyResults prop
- [ ] Shows parent objective title under each KR
- [ ] Shows baseline, current, target values with correct units

**Metric input:**
- [ ] Input is pre-filled with currentValue
- [ ] Changing the value enables the Save button
- [ ] Clicking Save calls `onUpdateMetric(metricId, numericValue)`
- [ ] Save button disabled when value unchanged or empty

**Multiple metrics per KR:**
- [ ] KRs with 2 metrics show both metric rows
- [ ] Each metric has its own independent input and Save button
- [ ] Saving one metric does not affect the other

---

## Edge Cases

- [ ] Metric with `direction: "decrease"` correctly calculates progress (reducing from baseline toward lower target)
- [ ] Metric already at 100% progress still shows input and Save button
- [ ] Metric exceeding target (over 100%) handled gracefully (capped or shown as 100%)
- [ ] Large numbers (e.g., 1,000,000) displayed without layout issues
- [ ] Decimal values (e.g., 28.5%) accepted and saved correctly
- [ ] KR with score scale (1-10) works same as other scales
- [ ] After saving, if data refreshes from API, input reflects new server value

---

## Accessibility Checks

- [ ] Metric input fields have accessible labels (metric name)
- [ ] Save buttons are keyboard accessible
- [ ] Progress percentage values are visible text (not just color)
- [ ] Empty state message is readable by screen readers

---

## Sample Test Data

```typescript
const mockUser = {
  id: "user-001",
  name: "Sarah Chen",
  email: "sarah.chen@company.com"
}

const mockSprint = {
  id: "sprint-026-1",
  name: "26.1",
  startDate: "2026-01-06",
  endDate: "2026-02-02",
  status: "active" as const
}

const mockMetric = {
  id: "metric-001",
  name: "Enterprise deals closed",
  scale: "absolute" as const,
  direction: "increase" as const,
  baseline: 0,
  currentValue: 3,
  target: 10,
  unit: "deals"
}

const mockKeyResult = {
  id: "kr-001",
  title: "Close 10 enterprise deals worth €500K+ each",
  objectiveId: "obj-001",
  sprintId: "sprint-026-1",
  status: "Active" as const,
  metrics: [mockMetric]
}

const mockObjective = {
  id: "obj-001",
  title: "Expand market share in enterprise segment",
  organizationalUnitId: "org-entity-germany",
  sprintId: "sprint-026-1",
  status: "Active" as const
}

const mockOrgUnit = {
  id: "org-entity-germany",
  name: "Germany",
  level: "Entity" as const
}

// Empty state
const mockEmptyKeyResults: typeof mockKeyResult[] = []
```
