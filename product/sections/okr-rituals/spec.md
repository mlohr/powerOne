# OKR Rituals Specification

## Overview
The OKR Rituals section enables users to schedule and facilitate structured sessions for managing OKRs throughout the sprint lifecycle. Users can create planning sessions, check-ins, reviews, and retrospectives linked to specific sprints, capture notes during facilitation, and access a history of past rituals. The dashboard provides an overview of upcoming and recent rituals organized by sprint.

## User Flows
- View dashboard showing upcoming rituals, recent rituals, and quick access to create new rituals
- Create a new ritual by selecting ritual type (planning, check-in, review, or retrospective), setting date/time, and linking to a sprint
- Facilitate a ritual session by opening the ritual and capturing notes and discussion points during the meeting
- View past rituals filtered by sprint to review historical notes and outcomes
- Browse rituals organized by sprint to see all rituals associated with each time period

## UI Requirements
- Dashboard as the primary view displaying: upcoming rituals (next 7-14 days), recently completed rituals, and a prominent "Create Ritual" button
- Ritual cards showing: ritual type (with icon/badge), date/time, linked sprint, and completion status
- Filter/organization by sprint with a sprint selector dropdown
- Create ritual form with fields: ritual type selector (planning/check-in/review/retrospective), date/time picker, and sprint dropdown
- Facilitation view with: ritual details header, large notes textarea for capturing discussion points, and "Mark as Completed" action
- Past rituals list showing completed rituals with their captured notes, organized by sprint
- Out of scope (not included): calendar integrations (Google Calendar, Outlook), meeting invite generation, email notifications, video conferencing integrations

## Configuration
- shell: true
