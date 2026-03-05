# Metrics & Progress

## Overview

A simple interface for updating metric values on Key Results during the active sprint. Users see only KRs where they're part of the team, can update values with a basic input field, and see progress as text percentages.

## User Flows

- View all Key Results in the active sprint where the user is part of the KR team
- Update a metric value by entering a new number in an input field
- See current progress displayed as a percentage
- Save the update (automatically timestamped)

## Design Decisions

- Focused, minimal interface — no charts or historical data for MVP
- KRs are pre-filtered server-side (active sprint + user is on team) before being passed to the component
- Each metric shows baseline, current, and target values for context
- Progress percentage color-coded: teal (≥75%), blue (≥50%), amber (≥25%), slate (<25%)
- Save button only enabled when the user has changed the value

## Data Used

**Entities:** `User`, `Sprint`, `KeyResult`, `Metric`, `Objective`, `OrganizationalUnit`

**From global model:** KeyResults belong to Objectives which belong to OrganizationalUnits

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `MetricsProgress` — Full page with sprint header, KR list, metric inputs, and empty state

## Callback Props

| Callback | Description |
|----------|-------------|
| `onUpdateMetric` | Called with (metricId, newValue) when user saves a metric update |
