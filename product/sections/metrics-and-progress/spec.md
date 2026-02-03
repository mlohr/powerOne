# Metrics & Progress Specification

## Overview
A simple interface for updating metric values on Key Results during the active sprint. Users see only KRs where they're part of the team, can update values with a basic input field, and see progress as text percentages.

## User Flows
- View all Key Results in the active sprint where the user is part of the KR team
- Update a metric value by entering a new number in an input field
- See current progress displayed as a percentage
- Save the update (automatically timestamped)

## UI Requirements
- Display a list of Key Results (filtered: active sprint + user is on KR team)
- For each KR, show: KR name, current metric value, target value, baseline
- Simple input field for entering new metric value
- Progress displayed as text percentage next to each KR (e.g., "75%")
- Save button to submit the update
- No charts, no graphs, no historical data for MVP
- Minimal styling - focus on functionality

## Configuration
- shell: true
