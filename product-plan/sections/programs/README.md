# Programs

## Overview

The Programs section enables users to create and manage cross-entity strategic initiatives. Users can define programs with designated leads, link them to multiple objectives across different entities, and track rolled-up progress. Programs provide a high-level view of strategic work that spans organizational boundaries.

## User Flows

- View program dashboard with all programs displayed as cards showing key information and progress
- Search for programs by name or filter by program lead or entity
- Create a new program by providing name, description, leads, assigning objectives, and defining cross-entity scope
- Click on a program to view its detailed page with linked objectives, progress breakdown, and activity updates
- Edit program details to update information or reassign objectives

## Design Decisions

- Program cards show rolled-up progress from linked objectives
- Side panel (slide-in from right) for create/edit forms to maintain dashboard context
- Activity feed in program detail to surface recent updates
- Progress chart visualizes objective completion trends
- Cross-entity scope shown as tag chips on each program card

## Data Used

**Entities:** `Program`, `ProgramLead`, `LinkedObjective`, `ActivityUpdate`

**From global model:** Programs reference Objectives from the OKR hierarchy and link to organizational units via entitiesInvolved

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `ProgramsDashboard` — Main view with search, filters, and program card grid
- `ProgramCard` — Individual program card showing name, leads, objectives count, progress, and entities
- `ProgramDetail` — Full detail view with progress chart, linked objectives list, and activity feed
- `ProgramForm` — Slide-in panel for creating and editing programs
- `ProgressChart` — Visual progress breakdown across linked objectives
- `ObjectiveListItem` — Single objective row in the detail view
- `ActivityFeedItem` — Single activity entry in the feed

## Callback Props

| Callback | Description |
|----------|-------------|
| `onCreate` | Called when user clicks to create a new program |
| `onView` | Called with programId when user clicks a program card |
| `onEdit` | Called when user clicks Edit on program detail |
| `onDelete` | Called when user clicks Delete on program detail |
| `onSubmit` | Called with program data when create/edit form is submitted |
| `onCancel` | Called when user cancels the create/edit form |
| `onViewObjective` | Called with objectiveId when user clicks an objective in detail |
| `onBack` | Called when user navigates back from detail to dashboard |
