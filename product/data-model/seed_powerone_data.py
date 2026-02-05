"""
Dependencies:
pip install azure-identity requests

PowerOne — Dataverse Seed Data Script

Populates all 11 PowerOne Dataverse tables with sample data using the
Dataverse Web API. Designed to run after create_powerone_schema.py has
created the schema.

Phases:
  Phase 0: Discovery — resolve entity set names and current user (WhoAmI)
  Phase 1: Sprints (3)
  Phase 2: Organizational Units (14, topological order)
  Phase 3: Objectives (8, topological order for parent references)
  Phase 4: Key Results (18)
  Phase 5: Metrics (9)
  Phase 6: Metric Updates (5)
  Phase 7: Tasks (42)
  Phase 8: Programs (6)
  Phase 9: Activity Updates (14)
  Phase 10: Rituals (8)
  Phase 11: Saved Filters (5)
  Phase 12: N:N — Program <-> Objective associations
  Phase 13: N:N — Program <-> Lead (systemuser) associations
  Phase 14: N:N — KeyResult <-> Team (systemuser) associations
  Phase 15: N:N — User <-> OrganizationalUnit associations

Prerequisites:
    pip install azure-identity requests

Usage:
    python seed_powerone_data.py           # seed data
    python seed_powerone_data.py --clear   # delete all records from all tables

    Set environment variables before running:
        POWERONE_ENV_URL      — Dataverse environment URL (required)
        POWERONE_PREFIX       — Publisher prefix (default: "po")
        POWERONE_SOLUTION     — Solution unique name (optional)
"""

import os
import sys
import time

import requests
from azure.identity import InteractiveBrowserCredential


# =============================================================================
# Configuration
# =============================================================================

ENV_URL = os.environ.get("POWERONE_ENV_URL", "https://<your-org>.crm.dynamics.com").rstrip("/")
PREFIX = os.environ.get("POWERONE_PREFIX", "po")
SOLUTION_NAME = os.environ.get("POWERONE_SOLUTION", "")
API_VERSION = "v9.2"

if "<your-org>" in ENV_URL:
    print("ERROR: Set POWERONE_ENV_URL environment variable to your Dataverse URL.")
    print("  Example: export POWERONE_ENV_URL=https://myorg.crm.dynamics.com")
    sys.exit(1)

P = PREFIX  # shorthand


# =============================================================================
# Choice Value Mappings (must match create_powerone_schema.py IntEnum values)
# =============================================================================

CHOICE_VALUES = {
    "SprintStatus": {"Inactive": 100000000, "Active": 100000001, "Done": 100000002},
    "OrganizationalLevel": {"Group": 100000000, "Entity": 100000001, "Domain": 100000002, "Department": 100000003, "Team": 100000004},
    "ObjectiveStatus": {"Draft": 100000000, "Accepted": 100000001, "Active": 100000002, "Done": 100000003, "Archived": 100000004, "Cancelled": 100000005},
    "KeyResultStatus": {"Draft": 100000000, "Accepted": 100000001, "Active": 100000002, "Done": 100000003, "Archived": 100000004, "Cancelled": 100000005},
    "TaskStatus": {"Open": 100000000, "Completed": 100000001},
    "MetricScale": {"Percentage": 100000000, "Absolute": 100000001, "Score": 100000002},
    "MetricDirection": {"Increase": 100000000, "Decrease": 100000001},
    "RitualType": {"Planning": 100000000, "Check-in": 100000001, "Review": 100000002, "Retrospective": 100000003},
    "RitualStatus": {"Upcoming": 100000000, "In Progress": 100000001, "Completed": 100000002},
    "ActivityType": {"Program Created": 100000000, "Program Edited": 100000001, "Objective Added": 100000002, "Objective Removed": 100000003, "Progress Update": 100000004, "Lead Added": 100000005, "Lead Removed": 100000006},
}


# =============================================================================
# Seed Data Definitions
# =============================================================================

SPRINTS = [
    {"id": "26.1", "name": "Sprint 26.1", "startDate": "2026-01-01", "endDate": "2026-03-31", "status": "Active"},
    {"id": "26.2", "name": "Sprint 26.2", "startDate": "2026-04-01", "endDate": "2026-06-30", "status": "Inactive"},
    {"id": "25.4", "name": "Sprint 25.4", "startDate": "2025-10-01", "endDate": "2025-12-31", "status": "Done"},
]

ORG_UNITS = [
    {"id": "ou-group", "name": "Group", "level": "Group", "parentId": None},
    {"id": "ou-germany", "name": "Germany", "level": "Entity", "parentId": "ou-group"},
    {"id": "ou-portugal", "name": "Portugal", "level": "Entity", "parentId": "ou-group"},
    {"id": "ou-india", "name": "India", "level": "Entity", "parentId": "ou-group"},
    {"id": "ou-nbd", "name": "New Business Development", "level": "Domain", "parentId": "ou-germany"},
    {"id": "ou-production", "name": "Production", "level": "Domain", "parentId": "ou-germany"},
    {"id": "ou-sales", "name": "After-/Sales", "level": "Domain", "parentId": "ou-germany"},
    {"id": "ou-hr", "name": "HR", "level": "Domain", "parentId": "ou-germany"},
    {"id": "ou-finance", "name": "Finance", "level": "Domain", "parentId": "ou-germany"},
    {"id": "ou-enterprise-sales", "name": "Enterprise Sales", "level": "Department", "parentId": "ou-nbd"},
    {"id": "ou-product-dev", "name": "Product Development", "level": "Department", "parentId": "ou-production"},
    {"id": "ou-people-ops", "name": "People Operations", "level": "Department", "parentId": "ou-hr"},
    {"id": "ou-sales-team-west", "name": "Sales Team West", "level": "Team", "parentId": "ou-enterprise-sales"},
    {"id": "ou-engineering-team-a", "name": "Engineering Team A", "level": "Team", "parentId": "ou-product-dev"},
]

OBJECTIVES = [
    {"id": "obj-001", "title": "Increase company-wide revenue growth", "description": "Drive sustainable revenue growth across all business entities and markets through strategic initiatives, new customer acquisition, and expansion of existing accounts.", "orgUnitId": "ou-group", "status": "Active", "sprintId": "26.1", "progress": 65, "parentObjectiveId": None},
    {"id": "obj-002", "title": "Scale Germany entity revenue to \u20ac20M", "description": "Grow the German entity through enterprise sales acceleration, increased deal sizes, and strategic partnerships in the DACH region.", "orgUnitId": "ou-germany", "status": "Active", "sprintId": "26.1", "progress": 70, "parentObjectiveId": "obj-001"},
    {"id": "obj-003", "title": "Launch operations in India", "description": "Establish a strong market presence in India by hiring local talent, signing pilot customers, and generating initial revenue.", "orgUnitId": "ou-india", "status": "Active", "sprintId": "26.1", "progress": 45, "parentObjectiveId": "obj-001"},
    {"id": "obj-004", "title": "Accelerate enterprise customer acquisition", "description": "Build a repeatable sales process for enterprise customers with predictable pipeline generation and shortened sales cycles.", "orgUnitId": "ou-nbd", "status": "Active", "sprintId": "26.1", "progress": 80, "parentObjectiveId": "obj-002"},
    {"id": "obj-005", "title": "Enhance product quality and delivery speed", "description": "Improve engineering velocity and product stability by reducing bugs, increasing deployment frequency, and automating quality processes.", "orgUnitId": "ou-production", "status": "Active", "sprintId": "26.1", "progress": 55, "parentObjectiveId": None},
    {"id": "obj-006", "title": "Build a high-performing enterprise sales team", "description": "Recruit, onboard, and enable a world-class enterprise sales team capable of consistently exceeding quota targets.", "orgUnitId": "ou-enterprise-sales", "status": "Active", "sprintId": "26.1", "progress": 70, "parentObjectiveId": "obj-004"},
    {"id": "obj-007", "title": "Automate deployment pipeline", "description": "Build fully automated CI/CD pipeline to enable rapid, reliable deployments with comprehensive test coverage.", "orgUnitId": "ou-product-dev", "status": "Active", "sprintId": "26.1", "progress": 40, "parentObjectiveId": "obj-005"},
    {"id": "obj-008", "title": "Dominate Western region enterprise market", "description": "Become the #1 solution provider in the Western region by closing key enterprise accounts and building a strong pipeline.", "orgUnitId": "ou-sales-team-west", "status": "Draft", "sprintId": "26.2", "progress": 0, "parentObjectiveId": "obj-006"},
]

KEY_RESULTS = [
    {"id": "kr-001", "title": "Achieve \u20ac50M in total revenue", "objectiveId": "obj-001", "status": "Active", "progress": 70, "linkedChildObjectiveId": "obj-002"},
    {"id": "kr-002", "title": "Improve customer retention rate to 92%", "objectiveId": "obj-001", "status": "Active", "progress": 55, "linkedChildObjectiveId": None},
    {"id": "kr-003", "title": "Expand into 3 new markets", "objectiveId": "obj-001", "status": "Active", "progress": 33, "linkedChildObjectiveId": "obj-003"},
    {"id": "kr-004", "title": "Close 15 new enterprise deals", "objectiveId": "obj-002", "status": "Active", "progress": 80, "linkedChildObjectiveId": "obj-004"},
    {"id": "kr-005", "title": "Increase average deal size to \u20ac500K", "objectiveId": "obj-002", "status": "Active", "progress": 60, "linkedChildObjectiveId": None},
    {"id": "kr-006", "title": "Hire 20 local employees", "objectiveId": "obj-003", "status": "Active", "progress": 50, "linkedChildObjectiveId": None},
    {"id": "kr-007", "title": "Sign 5 pilot customers", "objectiveId": "obj-003", "status": "Active", "progress": 40, "linkedChildObjectiveId": None},
    {"id": "kr-008", "title": "Achieve \u20ac2M in revenue", "objectiveId": "obj-003", "status": "Active", "progress": 30, "linkedChildObjectiveId": None},
    {"id": "kr-009", "title": "Generate 200 qualified leads", "objectiveId": "obj-004", "status": "Active", "progress": 85, "linkedChildObjectiveId": None},
    {"id": "kr-010", "title": "Reduce sales cycle to 45 days", "objectiveId": "obj-004", "status": "Active", "progress": 75, "linkedChildObjectiveId": None},
    {"id": "kr-011", "title": "Reduce bug count by 40%", "objectiveId": "obj-005", "status": "Active", "progress": 60, "linkedChildObjectiveId": None},
    {"id": "kr-012", "title": "Increase deployment frequency to 3x/week", "objectiveId": "obj-005", "status": "Active", "progress": 50, "linkedChildObjectiveId": "obj-007"},
    {"id": "kr-013", "title": "Hire 5 new sales reps", "objectiveId": "obj-006", "status": "Active", "progress": 80, "linkedChildObjectiveId": None},
    {"id": "kr-014", "title": "Achieve 120% quota attainment", "objectiveId": "obj-006", "status": "Active", "progress": 60, "linkedChildObjectiveId": "obj-008"},
    {"id": "kr-015", "title": "Achieve 100% test coverage", "objectiveId": "obj-007", "status": "Active", "progress": 35, "linkedChildObjectiveId": None},
    {"id": "kr-016", "title": "Reduce deployment time to <10 min", "objectiveId": "obj-007", "status": "Active", "progress": 45, "linkedChildObjectiveId": None},
    {"id": "kr-017", "title": "Close 8 deals in Q2", "objectiveId": "obj-008", "status": "Draft", "progress": 0, "linkedChildObjectiveId": None},
    {"id": "kr-018", "title": "Achieve \u20ac4M in pipeline value", "objectiveId": "obj-008", "status": "Draft", "progress": 0, "linkedChildObjectiveId": None},
]

METRICS = [
    {"id": "metric-001", "name": "Enterprise deals closed", "keyResultId": "kr-004", "scale": "Absolute", "direction": "Increase", "baseline": 0, "current": 12, "target": 15, "unit": "deals"},
    {"id": "metric-002", "name": "Average deal size", "keyResultId": "kr-005", "scale": "Absolute", "direction": "Increase", "baseline": 350000, "current": 420000, "target": 500000, "unit": "EUR"},
    {"id": "metric-003", "name": "Local employees hired", "keyResultId": "kr-006", "scale": "Absolute", "direction": "Increase", "baseline": 0, "current": 10, "target": 20, "unit": "people"},
    {"id": "metric-004", "name": "Qualified leads generated", "keyResultId": "kr-009", "scale": "Absolute", "direction": "Increase", "baseline": 0, "current": 170, "target": 200, "unit": "leads"},
    {"id": "metric-005", "name": "Sales cycle length", "keyResultId": "kr-010", "scale": "Absolute", "direction": "Decrease", "baseline": 75, "current": 52, "target": 45, "unit": "days"},
    {"id": "metric-006", "name": "Open bug count", "keyResultId": "kr-011", "scale": "Absolute", "direction": "Decrease", "baseline": 120, "current": 72, "target": 72, "unit": "bugs"},
    {"id": "metric-007", "name": "Deployments per week", "keyResultId": "kr-012", "scale": "Absolute", "direction": "Increase", "baseline": 1, "current": 1.5, "target": 3, "unit": "deployments/week"},
    {"id": "metric-008", "name": "Revenue", "keyResultId": "kr-001", "scale": "Absolute", "direction": "Increase", "baseline": 0, "current": 35000000, "target": 50000000, "unit": "EUR"},
    {"id": "metric-009", "name": "Customer retention rate", "keyResultId": "kr-002", "scale": "Percentage", "direction": "Increase", "baseline": 85, "current": 89, "target": 92, "unit": "%"},
]

METRIC_UPDATES = [
    {"id": "mu-001", "name": "Jan week 2 update", "metricId": "metric-008", "value": 12000000, "recordedAt": "2026-01-13T10:00:00Z", "sprintId": "26.1"},
    {"id": "mu-002", "name": "Jan week 3 update", "metricId": "metric-008", "value": 22000000, "recordedAt": "2026-01-20T10:00:00Z", "sprintId": "26.1"},
    {"id": "mu-003", "name": "Jan week 4 update", "metricId": "metric-008", "value": 35000000, "recordedAt": "2026-01-27T10:00:00Z", "sprintId": "26.1"},
    {"id": "mu-004", "name": "Jan retention check", "metricId": "metric-009", "value": 87, "recordedAt": "2026-01-15T10:00:00Z", "sprintId": "26.1"},
    {"id": "mu-005", "name": "Feb retention check", "metricId": "metric-009", "value": 89, "recordedAt": "2026-01-31T10:00:00Z", "sprintId": "26.1"},
]

TASKS = [
    # Tasks for kr-001 (7 tasks)
    {"id": "task-001", "description": "Review and approve Q1 revenue forecasts from all entities", "keyResultId": "kr-001", "status": "Completed", "completedAt": "2026-01-10T14:30:00Z"},
    {"id": "task-002", "description": "Analyze monthly revenue trends and identify growth opportunities", "keyResultId": "kr-001", "status": "Completed", "completedAt": "2026-01-15T16:45:00Z"},
    {"id": "task-003", "description": "Schedule revenue review meetings with entity leads", "keyResultId": "kr-001", "status": "Open", "completedAt": None},
    {"id": "task-004", "description": "Update revenue dashboard with real-time data from all regions", "keyResultId": "kr-001", "status": "Open", "completedAt": None},
    {"id": "task-005", "description": "Prepare mid-sprint revenue report for leadership team", "keyResultId": "kr-001", "status": "Open", "completedAt": None},
    {"id": "task-006", "description": "Identify and escalate revenue risks from underperforming entities", "keyResultId": "kr-001", "status": "Open", "completedAt": None},
    {"id": "task-007", "description": "Review pricing strategy impact on revenue across product lines", "keyResultId": "kr-001", "status": "Open", "completedAt": None},
    # Tasks for kr-002 (8 tasks)
    {"id": "task-008", "description": "Conduct customer satisfaction survey across all active accounts", "keyResultId": "kr-002", "status": "Completed", "completedAt": "2026-01-12T17:00:00Z"},
    {"id": "task-009", "description": "Analyze churn data and identify at-risk customer segments", "keyResultId": "kr-002", "status": "Completed", "completedAt": "2026-01-14T11:00:00Z"},
    {"id": "task-010", "description": "Launch customer success program for enterprise accounts", "keyResultId": "kr-002", "status": "Open", "completedAt": None},
    {"id": "task-011", "description": "Schedule quarterly business reviews with top 20 accounts", "keyResultId": "kr-002", "status": "Open", "completedAt": None},
    {"id": "task-012", "description": "Implement automated early warning system for churn signals", "keyResultId": "kr-002", "status": "Open", "completedAt": None},
    {"id": "task-013", "description": "Create customer retention playbook for account managers", "keyResultId": "kr-002", "status": "Open", "completedAt": None},
    {"id": "task-014", "description": "Develop upsell strategy for existing customer base", "keyResultId": "kr-002", "status": "Open", "completedAt": None},
    {"id": "task-015", "description": "Track and report weekly retention metrics to leadership", "keyResultId": "kr-002", "status": "Open", "completedAt": None},
    # Tasks for kr-003 (6 tasks)
    {"id": "task-016", "description": "Complete market research for APAC expansion opportunities", "keyResultId": "kr-003", "status": "Completed", "completedAt": "2026-01-13T15:30:00Z"},
    {"id": "task-017", "description": "Hire country manager for India market", "keyResultId": "kr-003", "status": "Completed", "completedAt": "2026-01-20T16:00:00Z"},
    {"id": "task-018", "description": "Establish legal entity in Portugal", "keyResultId": "kr-003", "status": "Open", "completedAt": None},
    {"id": "task-019", "description": "Adapt product localization for new market languages", "keyResultId": "kr-003", "status": "Open", "completedAt": None},
    {"id": "task-020", "description": "Develop go-to-market strategy for Portugal", "keyResultId": "kr-003", "status": "Open", "completedAt": None},
    {"id": "task-021", "description": "Set up banking and payment processing in new markets", "keyResultId": "kr-003", "status": "Open", "completedAt": None},
    # Tasks for kr-009 (8 tasks)
    {"id": "task-022", "description": "Launch targeted LinkedIn campaign for enterprise decision-makers", "keyResultId": "kr-009", "status": "Completed", "completedAt": "2026-01-08T12:00:00Z"},
    {"id": "task-023", "description": "Host webinar on industry trends and solutions", "keyResultId": "kr-009", "status": "Completed", "completedAt": "2026-01-11T17:00:00Z"},
    {"id": "task-024", "description": "Optimize landing pages for conversion rate improvement", "keyResultId": "kr-009", "status": "Completed", "completedAt": "2026-01-15T14:30:00Z"},
    {"id": "task-025", "description": "Attend industry conference and collect business cards", "keyResultId": "kr-009", "status": "Completed", "completedAt": "2026-01-18T20:00:00Z"},
    {"id": "task-026", "description": "Set up automated lead scoring model in CRM", "keyResultId": "kr-009", "status": "Open", "completedAt": None},
    {"id": "task-027", "description": "Follow up with all webinar attendees", "keyResultId": "kr-009", "status": "Open", "completedAt": None},
    {"id": "task-028", "description": "Create case study content for lead nurturing campaigns", "keyResultId": "kr-009", "status": "Open", "completedAt": None},
    {"id": "task-029", "description": "Partner with industry associations for co-marketing", "keyResultId": "kr-009", "status": "Open", "completedAt": None},
    # Tasks for kr-011 (7 tasks)
    {"id": "task-030", "description": "Implement automated regression test suite", "keyResultId": "kr-011", "status": "Completed", "completedAt": "2026-01-14T16:00:00Z"},
    {"id": "task-031", "description": "Conduct code review workshops for engineering team", "keyResultId": "kr-011", "status": "Completed", "completedAt": "2026-01-12T15:00:00Z"},
    {"id": "task-032", "description": "Triage and prioritize all P1 and P2 bugs in backlog", "keyResultId": "kr-011", "status": "Completed", "completedAt": "2026-01-16T13:30:00Z"},
    {"id": "task-033", "description": "Set up continuous integration alerts for test failures", "keyResultId": "kr-011", "status": "Open", "completedAt": None},
    {"id": "task-034", "description": "Allocate 20% sprint capacity to bug fixing", "keyResultId": "kr-011", "status": "Open", "completedAt": None},
    {"id": "task-035", "description": "Improve unit test coverage to 80%", "keyResultId": "kr-011", "status": "Open", "completedAt": None},
    {"id": "task-036", "description": "Document common bug patterns and prevention strategies", "keyResultId": "kr-011", "status": "Open", "completedAt": None},
    # Tasks for kr-013 (6 tasks)
    {"id": "task-037", "description": "Post job openings on LinkedIn and sales job boards", "keyResultId": "kr-013", "status": "Completed", "completedAt": "2026-01-06T11:00:00Z"},
    {"id": "task-038", "description": "Screen resumes and conduct phone interviews", "keyResultId": "kr-013", "status": "Completed", "completedAt": "2026-01-15T17:00:00Z"},
    {"id": "task-039", "description": "Coordinate panel interviews for top candidates", "keyResultId": "kr-013", "status": "Completed", "completedAt": "2026-01-18T16:30:00Z"},
    {"id": "task-040", "description": "Extend offers to final candidates", "keyResultId": "kr-013", "status": "Completed", "completedAt": "2026-01-19T14:00:00Z"},
    {"id": "task-041", "description": "Prepare onboarding materials and training schedule", "keyResultId": "kr-013", "status": "Open", "completedAt": None},
    {"id": "task-042", "description": "Set up CRM access and sales tools for new hires", "keyResultId": "kr-013", "status": "Open", "completedAt": None},
]

PROGRAMS = [
    {"id": "prog-001", "name": "Global Revenue Acceleration", "description": "Strategic initiative to accelerate revenue growth across all entities and markets.", "overallProgress": 72, "entitiesInvolved": "Group, Germany, New Business Development"},
    {"id": "prog-002", "name": "International Expansion", "description": "Expand into new international markets with focus on Asia-Pacific.", "overallProgress": 45, "entitiesInvolved": "Group, India"},
    {"id": "prog-003", "name": "Digital Transformation", "description": "Modernize technology stack and processes to improve efficiency and scalability.", "overallProgress": 48, "entitiesInvolved": "Germany, Production, Product Development"},
    {"id": "prog-004", "name": "Customer Success Excellence", "description": "Build world-class customer success capabilities to drive retention and expansion.", "overallProgress": 0, "entitiesInvolved": "Germany, After-/Sales"},
    {"id": "prog-005", "name": "Talent Development & Culture", "description": "Invest in employee growth, leadership development, and organizational culture.", "overallProgress": 70, "entitiesInvolved": "Group, Germany, India, Portugal"},
    {"id": "prog-006", "name": "Product Innovation Lab", "description": "Experimental initiative to explore emerging technologies and innovative product concepts.", "overallProgress": 48, "entitiesInvolved": "Germany, India, Production"},
]

ACTIVITY_UPDATES = [
    {"id": "act-001", "description": "Added objective 'Accelerate enterprise customer acquisition' to program", "programId": "prog-001", "type": "Objective Added", "timestamp": "2026-01-03T14:30:00Z", "userName": "Sarah Chen"},
    {"id": "act-002", "description": "Overall progress increased from 68% to 72% based on linked objective updates", "programId": "prog-001", "type": "Progress Update", "timestamp": "2026-01-02T09:15:00Z", "userName": "System"},
    {"id": "act-003", "description": "Updated program description to emphasize customer retention strategies", "programId": "prog-001", "type": "Program Edited", "timestamp": "2025-12-28T16:45:00Z", "userName": "Sarah Chen"},
    {"id": "act-004", "description": "Added Sarah Chen as co-lead for the program", "programId": "prog-002", "type": "Lead Added", "timestamp": "2026-01-04T11:20:00Z", "userName": "Priya Patel"},
    {"id": "act-005", "description": "Overall progress increased from 38% to 45%", "programId": "prog-002", "type": "Progress Update", "timestamp": "2025-12-30T13:00:00Z", "userName": "System"},
    {"id": "act-006", "description": "Created new program for digital transformation initiatives", "programId": "prog-003", "type": "Program Created", "timestamp": "2026-01-05T08:45:00Z", "userName": "Tom Richter"},
    {"id": "act-007", "description": "Added objective 'Enhance product quality and delivery speed'", "programId": "prog-003", "type": "Objective Added", "timestamp": "2026-01-05T09:30:00Z", "userName": "Tom Richter"},
    {"id": "act-008", "description": "Added objective 'Automate deployment pipeline'", "programId": "prog-003", "type": "Objective Added", "timestamp": "2026-01-05T09:32:00Z", "userName": "Tom Richter"},
    {"id": "act-009", "description": "Created new program - no objectives assigned yet", "programId": "prog-004", "type": "Program Created", "timestamp": "2026-01-04T15:00:00Z", "userName": "Michael Schmidt"},
    {"id": "act-010", "description": "Expanded entity scope to include Portugal", "programId": "prog-005", "type": "Program Edited", "timestamp": "2026-01-03T10:15:00Z", "userName": "Emma Johnson"},
    {"id": "act-011", "description": "Added objective 'Build a high-performing enterprise sales team'", "programId": "prog-005", "type": "Objective Added", "timestamp": "2025-12-29T14:20:00Z", "userName": "Emma Johnson"},
    {"id": "act-012", "description": "Added David Lee as co-lead for the program", "programId": "prog-005", "type": "Lead Added", "timestamp": "2025-12-28T11:00:00Z", "userName": "Emma Johnson"},
    {"id": "act-013", "description": "Created new experimental program for innovation initiatives", "programId": "prog-006", "type": "Program Created", "timestamp": "2026-01-05T16:30:00Z", "userName": "Raj Kumar"},
    {"id": "act-014", "description": "Linked existing objectives from Production domain", "programId": "prog-006", "type": "Objective Added", "timestamp": "2026-01-05T16:45:00Z", "userName": "Raj Kumar"},
]

RITUALS = [
    {
        "id": "ritual-001",
        "title": "Q1 2026 Planning Session",
        "sprintId": "26.1",
        "type": "Planning",
        "status": "Completed",
        "dateTime": "2026-01-08T10:00:00Z",
        "facilitator": "Sarah Chen",
        "participantCount": 12,
        "duration": 120,
        "notes": "## Objectives Set\n\n- Agreed on 3 company-level objectives for Q1\n- Cascaded objectives down to 5 entity/domain teams\n- Identified 18 key results across all objectives\n\n## Key Decisions\n\n- Revenue target set at \u20ac50M for the quarter\n- India expansion approved with initial budget of \u20ac500K\n- Engineering to focus on deployment automation\n\n## Action Items\n\n- All domain leads to finalize KRs by Jan 10\n- HR to post India country manager role immediately\n- Finance to prepare quarterly budget allocation",
    },
    {
        "id": "ritual-002",
        "title": "January Check-in",
        "sprintId": "26.1",
        "type": "Check-in",
        "status": "Completed",
        "dateTime": "2026-01-31T15:00:00Z",
        "facilitator": "Marcus Weber",
        "participantCount": 8,
        "duration": 60,
        "notes": "## Progress Review\n\n- Overall sprint progress: 28% (on track)\n- Enterprise sales pipeline strong at 170 qualified leads\n- India hiring progressing well (10 of 20 hired)\n\n## Blockers\n\n- Portugal legal entity setup delayed by 2 weeks\n- CI/CD pipeline migration hitting compatibility issues\n\n## Adjustments\n\n- Added 2 more engineering resources to deployment automation\n- Extended Portugal legal timeline to mid-February",
    },
    {
        "id": "ritual-003",
        "title": "February Check-in",
        "sprintId": "26.1",
        "type": "Check-in",
        "status": "Upcoming",
        "dateTime": "2026-02-28T15:00:00Z",
        "facilitator": "Lisa Schneider",
        "participantCount": 8,
        "duration": 60,
        "notes": "",
    },
    {
        "id": "ritual-004",
        "title": "March Check-in",
        "sprintId": "26.1",
        "type": "Check-in",
        "status": "Upcoming",
        "dateTime": "2026-03-28T15:00:00Z",
        "facilitator": "Tom Richter",
        "participantCount": 8,
        "duration": 60,
        "notes": "",
    },
    {
        "id": "ritual-005",
        "title": "Q1 2026 Review",
        "sprintId": "26.1",
        "type": "Review",
        "status": "Upcoming",
        "dateTime": "2026-04-03T10:00:00Z",
        "facilitator": "Sarah Chen",
        "participantCount": 12,
        "duration": 90,
        "notes": "",
    },
    {
        "id": "ritual-006",
        "title": "Q1 2026 Retrospective",
        "sprintId": "26.1",
        "type": "Retrospective",
        "status": "Upcoming",
        "dateTime": "2026-04-03T14:00:00Z",
        "facilitator": "Emma Johnson",
        "participantCount": 12,
        "duration": 90,
        "notes": "",
    },
    {
        "id": "ritual-007",
        "title": "Q4 2025 Review",
        "sprintId": "25.4",
        "type": "Review",
        "status": "Completed",
        "dateTime": "2025-12-20T10:00:00Z",
        "facilitator": "Sarah Chen",
        "participantCount": 10,
        "duration": 90,
        "notes": "## Q4 Results Summary\n\n- Achieved 92% of overall sprint targets\n- Revenue hit \u20ac45M against \u20ac48M target\n- Customer retention improved from 82% to 85%\n- 3 new enterprise deals closed in December\n\n## Highlights\n\n- Germany entity exceeded revenue target by 5%\n- New sales process reduced cycle time by 15%\n- Engineering shipped 12 features vs. 10 planned\n\n## Areas for Improvement\n\n- India launch delayed by one quarter\n- Bug count reduction fell short of 30% target\n- Cross-team collaboration needs improvement",
    },
    {
        "id": "ritual-008",
        "title": "Q4 2025 Retrospective",
        "sprintId": "25.4",
        "type": "Retrospective",
        "status": "Completed",
        "dateTime": "2025-12-20T14:00:00Z",
        "facilitator": "David Lee",
        "participantCount": 10,
        "duration": 90,
        "notes": "## What Went Well\n\n- Clear OKR definitions from the start\n- Weekly metric updates kept everyone aligned\n- Sales team exceeded expectations despite market headwinds\n- Engineering velocity improved by 20%\n\n## What Could Be Better\n\n- Earlier identification of blocked objectives\n- More frequent cross-domain check-ins\n- Better tooling for OKR progress tracking\n- Need clearer escalation paths for blockers\n\n## Action Items for Q1\n\n- Implement bi-weekly cross-domain sync meetings\n- Set up automated OKR progress dashboards\n- Create blocker escalation playbook\n- Assign dedicated program leads for multi-domain initiatives",
    },
]

SAVED_FILTERS = [
    {"id": "filter-my-okrs", "name": "My OKRs", "isPreset": True, "criteriaJson": '{"owner":"current_user"}', "isShared": True},
    {"id": "filter-my-entity", "name": "My Entity", "isPreset": True, "criteriaJson": '{"organizationalUnitId":"ou-germany"}', "isShared": True},
    {"id": "filter-my-domain", "name": "My Domain", "isPreset": True, "criteriaJson": '{"organizationalUnitId":"ou-hr"}', "isShared": True},
    {"id": "filter-custom-001", "name": "Active Enterprise Sales Goals", "isPreset": False, "criteriaJson": '{"organizationalUnitId":["ou-enterprise-sales","ou-sales-team-west"],"status":["Active"]}', "isShared": True},
    {"id": "filter-custom-002", "name": "Q1 Product Development", "isPreset": False, "criteriaJson": '{"organizationalUnitId":"ou-product-dev","sprint":"26.1","status":["Active","Draft"]}', "isShared": False},
]

# N:N Associations — Program <-> Objective
PROGRAM_OBJECTIVE_LINKS = [
    ("prog-001", "obj-001"),
    ("prog-001", "obj-002"),
    ("prog-001", "obj-004"),
    ("prog-002", "obj-003"),
    ("prog-003", "obj-005"),
    ("prog-003", "obj-007"),
    ("prog-005", "obj-006"),
    ("prog-006", "obj-005"),
    ("prog-006", "obj-007"),
]

# N:N Associations — Program <-> Lead (all map to current user, deduped to one per program)
PROGRAM_LEAD_PROGRAMS = ["prog-001", "prog-002", "prog-003", "prog-004", "prog-005", "prog-006"]

# N:N Associations — KeyResult <-> Team (all KRs get current user as team member)
KR_TEAM_KR_IDS = [kr["id"] for kr in KEY_RESULTS]

# N:N Associations — User <-> OrganizationalUnit (current user linked to key org units)
USER_ORGUNIT_IDS = ["ou-group", "ou-germany", "ou-nbd", "ou-hr"]


# =============================================================================
# Table Definitions (for entity set name discovery and clear operations)
# =============================================================================

TABLE_LOGICAL_NAMES = [
    f"{P}_sprint",
    f"{P}_organizationalunit",
    f"{P}_objective",
    f"{P}_keyresult",
    f"{P}_metric",
    f"{P}_metricupdate",
    f"{P}_task",
    f"{P}_program",
    f"{P}_activityupdate",
    f"{P}_ritual",
    f"{P}_savedfilter",
]

# Primary ID column for each table (used for querying records in clear)
TABLE_PRIMARY_ID = {
    f"{P}_sprint": f"{P}_sprintid",
    f"{P}_organizationalunit": f"{P}_organizationalunitid",
    f"{P}_objective": f"{P}_objectiveid",
    f"{P}_keyresult": f"{P}_keyresultid",
    f"{P}_metric": f"{P}_metricid",
    f"{P}_metricupdate": f"{P}_metricupdateid",
    f"{P}_task": f"{P}_taskid",
    f"{P}_program": f"{P}_programid",
    f"{P}_activityupdate": f"{P}_activityupdateid",
    f"{P}_ritual": f"{P}_ritualid",
    f"{P}_savedfilter": f"{P}_savedfilterid",
}


# =============================================================================
# Helpers
# =============================================================================

def raise_for_status(resp):
    """Raise with the Dataverse error message included."""
    if resp.ok:
        return
    try:
        body = resp.json()
        error = body.get("error", {})
        code = error.get("code", "")
        msg = error.get("message", resp.text)
        raise requests.HTTPError(
            f"{resp.status_code} {resp.reason}: {code} — {msg}",
            response=resp,
        )
    except (ValueError, KeyError):
        resp.raise_for_status()


def with_retry(fn, label="operation", max_retries=3, backoff=2):
    """Retry with exponential backoff for transient Dataverse errors."""
    for attempt in range(max_retries):
        try:
            return fn()
        except Exception as e:
            if attempt == max_retries - 1:
                print(f"  FAILED after {max_retries} attempts: {label}")
                raise
            wait = backoff ** attempt
            print(f"  Retry {attempt + 1}/{max_retries} for '{label}' after {wait}s: {e}")
            time.sleep(wait)


def phase_header(num, title, description):
    """Print a phase header."""
    print(f"\n{'='*70}")
    print(f"  PHASE {num}: {title}")
    print(f"  {description}")
    print(f"{'='*70}\n")


def get_web_api_headers(credential, base_url):
    """Get authenticated headers for Web API calls."""
    token = credential.get_token(f"{base_url}/.default")
    headers = {
        "Authorization": f"Bearer {token.token}",
        "Content-Type": "application/json; charset=utf-8",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Accept": "application/json",
        "Prefer": "return=representation",
    }
    if SOLUTION_NAME:
        headers["MSCRM.SolutionUniqueName"] = SOLUTION_NAME
    return headers


def get_who_am_i(headers, base_url):
    """Get the current user's systemuserid via WhoAmI."""
    resp = requests.get(
        f"{base_url}/api/data/{API_VERSION}/WhoAmI",
        headers=headers,
    )
    raise_for_status(resp)
    user_id = resp.json()["UserId"]
    print(f"  Authenticated user ID: {user_id}")
    return user_id


def get_entity_set_name(headers, base_url, table_logical):
    """Get the EntitySetName for Web API record operations by querying metadata."""
    resp = requests.get(
        f"{base_url}/api/data/{API_VERSION}/EntityDefinitions(LogicalName='{table_logical}')"
        f"?$select=EntitySetName",
        headers=headers,
    )
    raise_for_status(resp)
    return resp.json()["EntitySetName"]


def discover_entity_sets(headers, base_url):
    """Discover and cache EntitySetName for all PowerOne tables."""
    entity_sets = {}
    for table_logical in TABLE_LOGICAL_NAMES:
        es_name = get_entity_set_name(headers, base_url, table_logical)
        entity_sets[table_logical] = es_name
        print(f"  {table_logical} -> {es_name}")
    return entity_sets


def create_record(headers, base_url, entity_set, data):
    """Create a record via Web API. Returns the GUID from OData-EntityId header or response body."""
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/{entity_set}",
        json=data,
        headers=headers,
    )
    raise_for_status(resp)
    # Extract GUID from OData-EntityId header
    entity_id = resp.headers.get("OData-EntityId", "")
    guid = entity_id.rstrip(")").rsplit("(", 1)[-1] if "(" in entity_id else ""
    # Fallback: extract from response body (when using return=representation)
    if not guid and resp.text:
        try:
            body = resp.json()
            # Derive primary key field name from entity set (e.g., po_sprints -> po_sprintid)
            singular = entity_set.rstrip("s")
            if singular.endswith("ie"):  # e.g., po_activities -> po_activityid
                singular = singular[:-2] + "y"
            pk_field = f"{singular}id"
            guid = body.get(pk_field, "")
        except Exception:
            pass
    return guid


def associate_nn(headers, base_url, entity1_set, entity1_guid, relationship_name, entity2_set, entity2_guid):
    """Create an N:N association between two records via Web API."""
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/{entity1_set}({entity1_guid})/{relationship_name}/$ref",
        json={
            "@odata.id": f"{base_url}/api/data/{API_VERSION}/{entity2_set}({entity2_guid})"
        },
        headers=headers,
    )
    raise_for_status(resp)


def delete_record(headers, base_url, entity_set, guid):
    """Delete a single record via Web API."""
    resp = requests.delete(
        f"{base_url}/api/data/{API_VERSION}/{entity_set}({guid})",
        headers=headers,
    )
    raise_for_status(resp)


def get_all_record_ids(headers, base_url, entity_set, primary_id_col):
    """Get all record GUIDs from a table."""
    records = []
    url = f"{base_url}/api/data/{API_VERSION}/{entity_set}?$select={primary_id_col}"
    while url:
        resp = requests.get(url, headers=headers)
        raise_for_status(resp)
        data = resp.json()
        for record in data.get("value", []):
            records.append(record[primary_id_col])
        url = data.get("@odata.nextLink")
    return records


# =============================================================================
# Main — Seed Data
# =============================================================================

def main():
    print("PowerOne — Dataverse Seed Data")
    print(f"Environment: {ENV_URL}")
    print(f"Prefix:      {P}_")
    print(f"Solution:    {SOLUTION_NAME or '(none)'}")
    print()

    # ── Authenticate ────────────────────────────────────────────────────
    print("Authenticating via browser...")
    credential = InteractiveBrowserCredential()
    headers = get_web_api_headers(credential, ENV_URL)
    print("Authenticated.\n")

    # ID map: local string ID -> Dataverse GUID
    id_map = {}

    # ====================================================================
    # PHASE 0: Discovery
    # ====================================================================
    phase_header(0, "DISCOVERY", "Resolve entity set names and current user (WhoAmI)")

    print("Discovering entity set names...")
    entity_sets = discover_entity_sets(headers, ENV_URL)
    print()

    print("Resolving current user...")
    current_user_id = get_who_am_i(headers, ENV_URL)
    print()

    # Shorthand for entity set names
    es_sprint = entity_sets[f"{P}_sprint"]
    es_orgunit = entity_sets[f"{P}_organizationalunit"]
    es_objective = entity_sets[f"{P}_objective"]
    es_keyresult = entity_sets[f"{P}_keyresult"]
    es_metric = entity_sets[f"{P}_metric"]
    es_metricupdate = entity_sets[f"{P}_metricupdate"]
    es_task = entity_sets[f"{P}_task"]
    es_program = entity_sets[f"{P}_program"]
    es_activityupdate = entity_sets[f"{P}_activityupdate"]
    es_ritual = entity_sets[f"{P}_ritual"]
    es_savedfilter = entity_sets[f"{P}_savedfilter"]

    # ====================================================================
    # PHASE 1: Sprints
    # ====================================================================
    phase_header(1, "SPRINTS", f"Creating {len(SPRINTS)} sprints")

    headers = get_web_api_headers(credential, ENV_URL)

    for sprint in SPRINTS:
        payload = {
            f"{P}_name": sprint["name"],
            f"{P}_startdate": sprint["startDate"],
            f"{P}_enddate": sprint["endDate"],
            f"{P}_status": CHOICE_VALUES["SprintStatus"][sprint["status"]],
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_sprint, p),
            f"Sprint: {sprint['name']}",
        )
        id_map[sprint["id"]] = guid
        print(f"  + Sprint: {sprint['name']} [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 2: Organizational Units
    # ====================================================================
    phase_header(2, "ORGANIZATIONAL UNITS", f"Creating {len(ORG_UNITS)} org units (topological order)")

    headers = get_web_api_headers(credential, ENV_URL)

    for ou in ORG_UNITS:
        payload = {
            f"{P}_name": ou["name"],
            f"{P}_level": CHOICE_VALUES["OrganizationalLevel"][ou["level"]],
        }
        if ou["parentId"] is not None:
            parent_guid = id_map[ou["parentId"]]
            payload[f"{P}_ParentUnitId@odata.bind"] = f"/{es_orgunit}({parent_guid})"
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_orgunit, p),
            f"OrgUnit: {ou['name']}",
        )
        id_map[ou["id"]] = guid
        print(f"  + OrgUnit: {ou['name']} (level={ou['level']}) [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 3: Objectives
    # ====================================================================
    phase_header(3, "OBJECTIVES", f"Creating {len(OBJECTIVES)} objectives (topological order)")

    headers = get_web_api_headers(credential, ENV_URL)

    for obj in OBJECTIVES:
        payload = {
            f"{P}_title": obj["title"],
            f"{P}_description": obj["description"],
            f"{P}_progress": obj["progress"],
            f"{P}_status": CHOICE_VALUES["ObjectiveStatus"][obj["status"]],
            f"{P}_OrganizationalUnitId@odata.bind": f"/{es_orgunit}({id_map[obj['orgUnitId']]})",
            f"{P}_SprintId@odata.bind": f"/{es_sprint}({id_map[obj['sprintId']]})",
            f"{P}_OwnerId@odata.bind": f"/systemusers({current_user_id})",
        }
        if obj["parentObjectiveId"] is not None:
            parent_guid = id_map[obj["parentObjectiveId"]]
            payload[f"{P}_ParentObjectiveId@odata.bind"] = f"/{es_objective}({parent_guid})"
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_objective, p),
            f"Objective: {obj['title']}",
        )
        id_map[obj["id"]] = guid
        print(f"  + Objective: {obj['title'][:60]}... [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 4: Key Results
    # ====================================================================
    phase_header(4, "KEY RESULTS", f"Creating {len(KEY_RESULTS)} key results")

    headers = get_web_api_headers(credential, ENV_URL)

    for kr in KEY_RESULTS:
        payload = {
            f"{P}_title": kr["title"],
            f"{P}_progress": kr["progress"],
            f"{P}_status": CHOICE_VALUES["KeyResultStatus"][kr["status"]],
            f"{P}_ObjectiveId@odata.bind": f"/{es_objective}({id_map[kr['objectiveId']]})",
        }
        if kr["linkedChildObjectiveId"] is not None:
            linked_guid = id_map[kr["linkedChildObjectiveId"]]
            payload[f"{P}_LinkedChildObjectiveId@odata.bind"] = f"/{es_objective}({linked_guid})"
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_keyresult, p),
            f"KeyResult: {kr['title']}",
        )
        id_map[kr["id"]] = guid
        print(f"  + KR: {kr['title'][:60]}... [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 5: Metrics
    # ====================================================================
    phase_header(5, "METRICS", f"Creating {len(METRICS)} metrics")

    headers = get_web_api_headers(credential, ENV_URL)

    for metric in METRICS:
        payload = {
            f"{P}_name": metric["name"],
            f"{P}_scale": CHOICE_VALUES["MetricScale"][metric["scale"]],
            f"{P}_direction": CHOICE_VALUES["MetricDirection"][metric["direction"]],
            f"{P}_baselinevalue": metric["baseline"],
            f"{P}_currentvalue": metric["current"],
            f"{P}_targetvalue": metric["target"],
            f"{P}_unit": metric["unit"],
            f"{P}_KeyResultId@odata.bind": f"/{es_keyresult}({id_map[metric['keyResultId']]})",
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_metric, p),
            f"Metric: {metric['name']}",
        )
        id_map[metric["id"]] = guid
        print(f"  + Metric: {metric['name']} [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 6: Metric Updates
    # ====================================================================
    phase_header(6, "METRIC UPDATES", f"Creating {len(METRIC_UPDATES)} metric updates")

    headers = get_web_api_headers(credential, ENV_URL)

    for mu in METRIC_UPDATES:
        payload = {
            f"{P}_name": mu["name"],
            f"{P}_value": mu["value"],
            f"{P}_recordedat": mu["recordedAt"],
            f"{P}_MetricId@odata.bind": f"/{es_metric}({id_map[mu['metricId']]})",
            f"{P}_SprintId@odata.bind": f"/{es_sprint}({id_map[mu['sprintId']]})",
            f"{P}_UpdatedById@odata.bind": f"/systemusers({current_user_id})",
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_metricupdate, p),
            f"MetricUpdate: {mu['name']}",
        )
        id_map[mu["id"]] = guid
        print(f"  + MetricUpdate: {mu['name']} [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 7: Tasks
    # ====================================================================
    phase_header(7, "TASKS", f"Creating {len(TASKS)} tasks")

    headers = get_web_api_headers(credential, ENV_URL)

    for task in TASKS:
        payload = {
            f"{P}_description": task["description"],
            f"{P}_status": CHOICE_VALUES["TaskStatus"][task["status"]],
            f"{P}_KeyResultId@odata.bind": f"/{es_keyresult}({id_map[task['keyResultId']]})",
            f"{P}_AssignedToId@odata.bind": f"/systemusers({current_user_id})",
        }
        if task["completedAt"] is not None:
            payload[f"{P}_completedat"] = task["completedAt"]
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_task, p),
            f"Task: {task['id']}",
        )
        id_map[task["id"]] = guid
        print(f"  + Task: {task['description'][:60]}... [{guid}]")
        time.sleep(0.2)

    # ====================================================================
    # PHASE 8: Programs
    # ====================================================================
    phase_header(8, "PROGRAMS", f"Creating {len(PROGRAMS)} programs")

    headers = get_web_api_headers(credential, ENV_URL)

    for prog in PROGRAMS:
        payload = {
            f"{P}_name": prog["name"],
            f"{P}_description": prog["description"],
            f"{P}_overallprogress": prog["overallProgress"],
            f"{P}_entitiesinvolved": prog["entitiesInvolved"],
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_program, p),
            f"Program: {prog['name']}",
        )
        id_map[prog["id"]] = guid
        print(f"  + Program: {prog['name']} [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 9: Activity Updates
    # ====================================================================
    phase_header(9, "ACTIVITY UPDATES", f"Creating {len(ACTIVITY_UPDATES)} activity updates")

    headers = get_web_api_headers(credential, ENV_URL)

    for act in ACTIVITY_UPDATES:
        payload = {
            f"{P}_description": act["description"],
            f"{P}_type": CHOICE_VALUES["ActivityType"][act["type"]],
            f"{P}_timestamp": act["timestamp"],
            f"{P}_username": act["userName"],
            f"{P}_ProgramId@odata.bind": f"/{es_program}({id_map[act['programId']]})",
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_activityupdate, p),
            f"ActivityUpdate: {act['id']}",
        )
        id_map[act["id"]] = guid
        print(f"  + Activity: {act['description'][:60]}... [{guid}]")
        time.sleep(0.2)

    # ====================================================================
    # PHASE 10: Rituals
    # ====================================================================
    phase_header(10, "RITUALS", f"Creating {len(RITUALS)} rituals")

    headers = get_web_api_headers(credential, ENV_URL)

    for ritual in RITUALS:
        payload = {
            f"{P}_title": ritual["title"],
            f"{P}_type": CHOICE_VALUES["RitualType"][ritual["type"]],
            f"{P}_status": CHOICE_VALUES["RitualStatus"][ritual["status"]],
            f"{P}_datetime": ritual["dateTime"],
            f"{P}_facilitator": ritual["facilitator"],
            f"{P}_participantcount": ritual["participantCount"],
            f"{P}_duration": ritual["duration"],
            f"{P}_notes": ritual["notes"],
            f"{P}_SprintId@odata.bind": f"/{es_sprint}({id_map[ritual['sprintId']]})",
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_ritual, p),
            f"Ritual: {ritual['title']}",
        )
        id_map[ritual["id"]] = guid
        print(f"  + Ritual: {ritual['title']} [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 11: Saved Filters
    # ====================================================================
    phase_header(11, "SAVED FILTERS", f"Creating {len(SAVED_FILTERS)} saved filters")

    headers = get_web_api_headers(credential, ENV_URL)

    for sf in SAVED_FILTERS:
        payload = {
            f"{P}_name": sf["name"],
            f"{P}_ispreset": sf["isPreset"],
            f"{P}_isshared": sf["isShared"],
            f"{P}_criteriajson": sf["criteriaJson"],
            f"{P}_CreatedById@odata.bind": f"/systemusers({current_user_id})",
        }
        guid = with_retry(
            lambda p=payload: create_record(headers, ENV_URL, es_savedfilter, p),
            f"SavedFilter: {sf['name']}",
        )
        id_map[sf["id"]] = guid
        print(f"  + SavedFilter: {sf['name']} [{guid}]")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 12: N:N — Program <-> Objective
    # ====================================================================
    phase_header(12, "N:N PROGRAM-OBJECTIVE", f"Creating {len(PROGRAM_OBJECTIVE_LINKS)} associations")

    headers = get_web_api_headers(credential, ENV_URL)

    for prog_id, obj_id in PROGRAM_OBJECTIVE_LINKS:
        prog_guid = id_map[prog_id]
        obj_guid = id_map[obj_id]
        with_retry(
            lambda pg=prog_guid, og=obj_guid: associate_nn(
                headers, ENV_URL,
                es_program, pg,
                f"{P}_program_objective",
                es_objective, og,
            ),
            f"Associate {prog_id} <-> {obj_id}",
        )
        print(f"  + {prog_id} <-> {obj_id}")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 13: N:N — Program <-> Lead (systemuser)
    # ====================================================================
    phase_header(13, "N:N PROGRAM-LEAD", f"Creating {len(PROGRAM_LEAD_PROGRAMS)} associations (all -> current user)")

    headers = get_web_api_headers(credential, ENV_URL)

    for prog_id in PROGRAM_LEAD_PROGRAMS:
        prog_guid = id_map[prog_id]
        with_retry(
            lambda pg=prog_guid: associate_nn(
                headers, ENV_URL,
                es_program, pg,
                f"{P}_program_lead",
                "systemusers", current_user_id,
            ),
            f"Associate {prog_id} <-> current user",
        )
        print(f"  + {prog_id} <-> current user")
        time.sleep(0.3)

    # ====================================================================
    # PHASE 14: N:N — KeyResult <-> Team (systemuser)
    # ====================================================================
    phase_header(14, "N:N KEYRESULT-TEAM", f"Creating {len(KR_TEAM_KR_IDS)} associations (all -> current user)")

    headers = get_web_api_headers(credential, ENV_URL)

    for kr_id in KR_TEAM_KR_IDS:
        kr_guid = id_map[kr_id]
        with_retry(
            lambda kg=kr_guid: associate_nn(
                headers, ENV_URL,
                es_keyresult, kg,
                f"{P}_keyresult_team",
                "systemusers", current_user_id,
            ),
            f"Associate {kr_id} <-> current user",
        )
        print(f"  + {kr_id} <-> current user")
        time.sleep(0.2)

    # ====================================================================
    # PHASE 15: N:N — User <-> OrganizationalUnit
    # ====================================================================
    phase_header(15, "N:N USER-ORGUNIT", f"Creating {len(USER_ORGUNIT_IDS)} associations (current user -> org units)")

    headers = get_web_api_headers(credential, ENV_URL)

    for ou_id in USER_ORGUNIT_IDS:
        ou_guid = id_map[ou_id]
        with_retry(
            lambda og=ou_guid: associate_nn(
                headers, ENV_URL,
                "systemusers", current_user_id,
                f"{P}_user_orgunit",
                es_orgunit, og,
            ),
            f"Associate current user <-> {ou_id}",
        )
        print(f"  + current user <-> {ou_id}")
        time.sleep(0.3)

    # ====================================================================
    # DONE
    # ====================================================================
    print(f"\n{'='*70}")
    print("  COMPLETE")
    print(f"{'='*70}")

    total_records = (
        len(SPRINTS) + len(ORG_UNITS) + len(OBJECTIVES) + len(KEY_RESULTS)
        + len(METRICS) + len(METRIC_UPDATES) + len(TASKS) + len(PROGRAMS)
        + len(ACTIVITY_UPDATES) + len(RITUALS) + len(SAVED_FILTERS)
    )
    total_associations = (
        len(PROGRAM_OBJECTIVE_LINKS) + len(PROGRAM_LEAD_PROGRAMS)
        + len(KR_TEAM_KR_IDS) + len(USER_ORGUNIT_IDS)
    )

    print(f"""
Seed data creation finished.

Summary:
  Sprints:              {len(SPRINTS)}
  Organizational Units: {len(ORG_UNITS)}
  Objectives:           {len(OBJECTIVES)}
  Key Results:          {len(KEY_RESULTS)}
  Metrics:              {len(METRICS)}
  Metric Updates:       {len(METRIC_UPDATES)}
  Tasks:                {len(TASKS)}
  Programs:             {len(PROGRAMS)}
  Activity Updates:     {len(ACTIVITY_UPDATES)}
  Rituals:              {len(RITUALS)}
  Saved Filters:        {len(SAVED_FILTERS)}
  ─────────────────────────
  Total records:        {total_records}

  N:N associations ({total_associations} total):
    Program <-> Objective:  {len(PROGRAM_OBJECTIVE_LINKS)}
    Program <-> Lead:       {len(PROGRAM_LEAD_PROGRAMS)}
    KR <-> Team:            {len(KR_TEAM_KR_IDS)}
    User <-> OrgUnit:       {len(USER_ORGUNIT_IDS)}

All owner/assignee/lead lookups point to the authenticated user (WhoAmI).

Verify in Power Apps:
  https://make.powerapps.com -> Tables -> filter by "{P}_"
  Open each table and check the data view for records.

To remove all seed data:
  python seed_powerone_data.py --clear
""")


# =============================================================================
# Clear — Delete All Seed Records
# =============================================================================

def clear():
    """Delete ALL records from all PowerOne custom tables."""
    print("PowerOne — Clear All Seed Data")
    print(f"Environment: {ENV_URL}")
    print(f"Prefix:      {P}_")
    print()
    print("This will delete ALL records from all 11 PowerOne tables.")
    print("This operation is IRREVERSIBLE.\n")

    # ── Authenticate ────────────────────────────────────────────────────
    print("Authenticating via browser...")
    credential = InteractiveBrowserCredential()
    headers = get_web_api_headers(credential, ENV_URL)
    print("Authenticated.\n")

    # Discover entity set names
    print("Discovering entity set names...")
    entity_sets = discover_entity_sets(headers, ENV_URL)
    print()

    # Delete in reverse dependency order to respect cascade constraints:
    # Children first, parents last
    delete_order = [
        f"{P}_activityupdate",   # depends on Program
        f"{P}_savedfilter",      # depends on systemuser
        f"{P}_metricupdate",     # depends on Metric, Sprint, systemuser
        f"{P}_task",             # depends on KeyResult, systemuser
        f"{P}_metric",           # depends on KeyResult
        f"{P}_ritual",           # depends on Sprint
        f"{P}_keyresult",        # depends on Objective
        f"{P}_objective",        # depends on Sprint, OrgUnit, systemuser, self
        f"{P}_program",          # N:N with Objective, systemuser
        f"{P}_organizationalunit",  # self-referential, depended on by Objective
        f"{P}_sprint",           # depended on by Objective, MetricUpdate, Ritual
    ]

    total_deleted = 0

    for table_logical in delete_order:
        es_name = entity_sets.get(table_logical)
        pk_col = TABLE_PRIMARY_ID.get(table_logical)
        if not es_name or not pk_col:
            print(f"  Skip (unknown): {table_logical}")
            continue

        print(f"\nDeleting records from {table_logical} ({es_name})...")
        headers = get_web_api_headers(credential, ENV_URL)

        try:
            record_ids = get_all_record_ids(headers, ENV_URL, es_name, pk_col)
        except Exception as e:
            print(f"  ERROR querying {table_logical}: {e}")
            continue

        if not record_ids:
            print(f"  (no records)")
            continue

        print(f"  Found {len(record_ids)} records to delete...")
        deleted_count = 0
        for guid in record_ids:
            try:
                delete_record(headers, ENV_URL, es_name, guid)
                deleted_count += 1
            except Exception as e:
                print(f"  ERROR deleting {guid}: {e}")
            time.sleep(0.1)

        print(f"  Deleted {deleted_count}/{len(record_ids)} records.")
        total_deleted += deleted_count

    print(f"\n{'='*70}")
    print(f"  CLEAR COMPLETE — Deleted {total_deleted} records total")
    print(f"{'='*70}\n")


# =============================================================================
# Entry Point
# =============================================================================

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--clear":
        confirm = input("Type 'DELETE ALL' to confirm clearing all seed data: ")
        if confirm == "DELETE ALL":
            clear()
        else:
            print("Clear cancelled.")
    else:
        main()
