"""
Dependencies:
pip install PowerPlatform-Dataverse-Client
pip install azure-identity

PowerOne — Dataverse Schema Creation Script

Creates the complete PowerOne data model in Microsoft Dataverse, organized
in dependency-ordered phases:

  Phase 0: Global choices (option sets) via Web API
  Phase 1: Foundation tables (no dependencies)
  Phase 2: Core OKR tables (depend on Phase 1)
  Phase 3: OKR detail tables (depend on Phase 2)
  Phase 4: Programs & process tables (depend on Phase 1)
  Phase 5: User feature tables (depend on Phase 1)
  Phase 5b: Choice columns referencing global option sets (tables must exist)
  Phase 6: Display names via Web API (clean names without publisher prefix)
  Phase 7: Memo columns via Web API (tables must exist)
  Phase 8: 1:N relationships via Web API (tables must exist)
  Phase 9: N:N relationships via Web API (tables must exist)

Prerequisites:
    pip install PowerPlatform-Dataverse-Client azure-identity requests

Note: The Dataverse SDK for Python is in PUBLIC PREVIEW (GA planned Mar 2026).

Usage:
    python create_powerone_schema.py

    Set environment variables before running:
        POWERONE_ENV_URL  — Dataverse environment URL (required)
        POWERONE_PREFIX   — Publisher prefix (default: "po")
"""

import os
import sys
import time
from enum import IntEnum

import requests
from azure.identity import InteractiveBrowserCredential
from PowerPlatform.Dataverse.client import DataverseClient
from PowerPlatform.Dataverse.core.config import DataverseConfig


# =============================================================================
# Configuration
# =============================================================================

ENV_URL = os.environ.get("POWERONE_ENV_URL", "https://<your-org>.crm.dynamics.com").rstrip("/")
PREFIX = os.environ.get("POWERONE_PREFIX", "po")
API_VERSION = "v9.2"

if "<your-org>" in ENV_URL:
    print("ERROR: Set POWERONE_ENV_URL environment variable to your Dataverse URL.")
    print("  Example: export POWERONE_ENV_URL=https://myorg.crm.dynamics.com")
    sys.exit(1)

P = PREFIX  # shorthand


# =============================================================================
# Choice Column Definitions (IntEnum for SDK)
# =============================================================================

class OrganizationalLevel(IntEnum):
    GROUP = 100000000
    ENTITY = 100000001
    DOMAIN = 100000002
    DEPARTMENT = 100000003
    TEAM = 100000004


class ObjectiveStatus(IntEnum):
    DRAFT = 100000000
    ACCEPTED = 100000001
    ACTIVE = 100000002
    DONE = 100000003
    ARCHIVED = 100000004
    CANCELLED = 100000005


class KeyResultStatus(IntEnum):
    DRAFT = 100000000
    ACCEPTED = 100000001
    ACTIVE = 100000002
    DONE = 100000003
    ARCHIVED = 100000004
    CANCELLED = 100000005


class SprintStatus(IntEnum):
    INACTIVE = 100000000
    ACTIVE = 100000001
    DONE = 100000002


class TaskStatus(IntEnum):
    OPEN = 100000000
    COMPLETED = 100000001


class MetricScale(IntEnum):
    PERCENTAGE = 100000000
    ABSOLUTE = 100000001
    SCORE = 100000002


class MetricDirection(IntEnum):
    INCREASE = 100000000
    DECREASE = 100000001


class RitualType(IntEnum):
    PLANNING = 100000000
    CHECK_IN = 100000001
    REVIEW = 100000002
    RETROSPECTIVE = 100000003


class RitualStatus(IntEnum):
    UPCOMING = 100000000
    IN_PROGRESS = 100000001
    COMPLETED = 100000002


class ActivityType(IntEnum):
    PROGRAM_CREATED = 100000000
    PROGRAM_EDITED = 100000001
    OBJECTIVE_ADDED = 100000002
    OBJECTIVE_REMOVED = 100000003
    PROGRESS_UPDATE = 100000004
    LEAD_ADDED = 100000005
    LEAD_REMOVED = 100000006


# =============================================================================
# Global Choice (Option Set) Definitions
# =============================================================================
# Choices are created as global option sets via the Web API so they have proper
# schema names (e.g., po_SprintStatus) and can be reused across columns.
# The IntEnum classes above remain as Python constants for seed data scripts.

GLOBAL_CHOICES = [
    {
        "name": f"{P}_OrganizationalLevel",
        "display": "Organizational Level",
        "options": [
            ("Group", 100000000),
            ("Entity", 100000001),
            ("Domain", 100000002),
            ("Department", 100000003),
            ("Team", 100000004),
        ],
    },
    {
        "name": f"{P}_ObjectiveStatus",
        "display": "Objective Status",
        "options": [
            ("Draft", 100000000),
            ("Accepted", 100000001),
            ("Active", 100000002),
            ("Done", 100000003),
            ("Archived", 100000004),
            ("Cancelled", 100000005),
        ],
    },
    {
        "name": f"{P}_KeyResultStatus",
        "display": "Key Result Status",
        "options": [
            ("Draft", 100000000),
            ("Accepted", 100000001),
            ("Active", 100000002),
            ("Done", 100000003),
            ("Archived", 100000004),
            ("Cancelled", 100000005),
        ],
    },
    {
        "name": f"{P}_SprintStatus",
        "display": "Sprint Status",
        "options": [
            ("Inactive", 100000000),
            ("Active", 100000001),
            ("Done", 100000002),
        ],
    },
    {
        "name": f"{P}_TaskStatus",
        "display": "Task Status",
        "options": [
            ("Open", 100000000),
            ("Completed", 100000001),
        ],
    },
    {
        "name": f"{P}_MetricScale",
        "display": "Metric Scale",
        "options": [
            ("Percentage", 100000000),
            ("Absolute", 100000001),
            ("Score", 100000002),
        ],
    },
    {
        "name": f"{P}_MetricDirection",
        "display": "Metric Direction",
        "options": [
            ("Increase", 100000000),
            ("Decrease", 100000001),
        ],
    },
    {
        "name": f"{P}_RitualType",
        "display": "Ritual Type",
        "options": [
            ("Planning", 100000000),
            ("Check-in", 100000001),
            ("Review", 100000002),
            ("Retrospective", 100000003),
        ],
    },
    {
        "name": f"{P}_RitualStatus",
        "display": "Ritual Status",
        "options": [
            ("Upcoming", 100000000),
            ("In Progress", 100000001),
            ("Completed", 100000002),
        ],
    },
    {
        "name": f"{P}_ActivityType",
        "display": "Activity Type",
        "options": [
            ("Program Created", 100000000),
            ("Program Edited", 100000001),
            ("Objective Added", 100000002),
            ("Objective Removed", 100000003),
            ("Progress Update", 100000004),
            ("Lead Added", 100000005),
            ("Lead Removed", 100000006),
        ],
    },
]

# Choice columns to add to tables after global choices are created.
# (table_schema, column_schema, display_name, global_choice_name, required)
CHOICE_COLUMNS = [
    (f"{P}_Sprint", f"{P}_Status", "Status", f"{P}_SprintStatus", True),
    (f"{P}_OrganizationalUnit", f"{P}_Level", "Level", f"{P}_OrganizationalLevel", True),
    (f"{P}_Objective", f"{P}_Status", "Status", f"{P}_ObjectiveStatus", True),
    (f"{P}_KeyResult", f"{P}_Status", "Status", f"{P}_KeyResultStatus", True),
    (f"{P}_Metric", f"{P}_Scale", "Scale", f"{P}_MetricScale", True),
    (f"{P}_Metric", f"{P}_Direction", "Direction", f"{P}_MetricDirection", True),
    (f"{P}_Task", f"{P}_Status", "Status", f"{P}_TaskStatus", True),
    (f"{P}_Ritual", f"{P}_Type", "Type", f"{P}_RitualType", True),
    (f"{P}_Ritual", f"{P}_Status", "Status", f"{P}_RitualStatus", True),
    (f"{P}_ActivityUpdate", f"{P}_Type", "Type", f"{P}_ActivityType", True),
]


# =============================================================================
# Display Name Definitions
# =============================================================================
# The SDK create_table() derives display names from the schema name, which
# includes the publisher prefix (e.g. "po_Sprint" → display "po Sprint").
# We fix this by setting clean display names via the Web API after creation.

TABLE_DISPLAY_NAMES = {
    f"{P}_Sprint": ("Sprint", "Sprints"),
    f"{P}_OrganizationalUnit": ("Organizational Unit", "Organizational Units"),
    f"{P}_Objective": ("Objective", "Objectives"),
    f"{P}_KeyResult": ("Key Result", "Key Results"),
    f"{P}_Metric": ("Metric", "Metrics"),
    f"{P}_MetricUpdate": ("Metric Update", "Metric Updates"),
    f"{P}_Task": ("Task", "Tasks"),
    f"{P}_Program": ("Program", "Programs"),
    f"{P}_ActivityUpdate": ("Activity Update", "Activity Updates"),
    f"{P}_Ritual": ("Ritual", "Rituals"),
    f"{P}_SavedFilter": ("Saved Filter", "Saved Filters"),
}

# Column display names: (table_schema, column_schema, display_name)
# Lookup columns get display names via relationship definitions (Phase 8).
# Memo columns get display names via create_memo_column() (Phase 7).
# Choice columns are excluded — they get display names from create_choice_column().
COLUMN_DISPLAY_NAMES = [
    # Sprint
    (f"{P}_Sprint", f"{P}_Name", "Name"),
    (f"{P}_Sprint", f"{P}_StartDate", "Start Date"),
    (f"{P}_Sprint", f"{P}_EndDate", "End Date"),
    # Organizational Unit
    (f"{P}_OrganizationalUnit", f"{P}_Name", "Name"),
    # Objective
    (f"{P}_Objective", f"{P}_Title", "Title"),
    (f"{P}_Objective", f"{P}_Progress", "Progress"),
    # Key Result
    (f"{P}_KeyResult", f"{P}_Title", "Title"),
    (f"{P}_KeyResult", f"{P}_Progress", "Progress"),
    # Metric
    (f"{P}_Metric", f"{P}_Name", "Name"),
    (f"{P}_Metric", f"{P}_BaselineValue", "Baseline Value"),
    (f"{P}_Metric", f"{P}_CurrentValue", "Current Value"),
    (f"{P}_Metric", f"{P}_TargetValue", "Target Value"),
    (f"{P}_Metric", f"{P}_Unit", "Unit"),
    # Metric Update
    (f"{P}_MetricUpdate", f"{P}_Name", "Name"),
    (f"{P}_MetricUpdate", f"{P}_Value", "Value"),
    (f"{P}_MetricUpdate", f"{P}_RecordedAt", "Recorded At"),
    # Task
    (f"{P}_Task", f"{P}_Description", "Description"),
    (f"{P}_Task", f"{P}_CompletedAt", "Completed At"),
    # Program
    (f"{P}_Program", f"{P}_Name", "Name"),
    (f"{P}_Program", f"{P}_OverallProgress", "Overall Progress"),
    (f"{P}_Program", f"{P}_EntitiesInvolved", "Entities Involved"),
    # Activity Update
    (f"{P}_ActivityUpdate", f"{P}_Description", "Description"),
    (f"{P}_ActivityUpdate", f"{P}_Timestamp", "Timestamp"),
    (f"{P}_ActivityUpdate", f"{P}_UserName", "User Name"),
    # Ritual
    (f"{P}_Ritual", f"{P}_Title", "Title"),
    (f"{P}_Ritual", f"{P}_DateTime", "Date Time"),
    (f"{P}_Ritual", f"{P}_Facilitator", "Facilitator"),
    (f"{P}_Ritual", f"{P}_ParticipantCount", "Participant Count"),
    (f"{P}_Ritual", f"{P}_Duration", "Duration"),
    # Saved Filter
    (f"{P}_SavedFilter", f"{P}_Name", "Name"),
    (f"{P}_SavedFilter", f"{P}_IsPreset", "Is Preset"),
    (f"{P}_SavedFilter", f"{P}_IsShared", "Is Shared"),
]


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
    return {
        "Authorization": f"Bearer {token.token}",
        "Content-Type": "application/json; charset=utf-8",
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        "Accept": "application/json",
    }


def create_memo_column(headers, base_url, table_logical_name, schema_name, display_name, max_length=2000):
    """Create a Memo (multi-line text) column via Web API."""
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.MemoAttributeMetadata",
        "SchemaName": schema_name,
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": display_name,
                "LanguageCode": 1033,
            }],
        },
        "RequiredLevel": {
            "Value": "None",
            "CanBeChanged": True,
            "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings",
        },
        "Format": "TextArea",
        "MaxLength": max_length,
    }
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/EntityDefinitions(LogicalName='{table_logical_name}')/Attributes",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    print(f"  + Memo column: {schema_name} on {table_logical_name}")


def create_one_to_many(headers, base_url, parent_table, parent_pk, child_table,
                       rel_name, lookup_display, lookup_schema, cascade_delete="Restrict"):
    """Create a 1:N relationship with lookup column via Web API."""
    payload = {
        "SchemaName": rel_name,
        "@odata.type": "Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata",
        "AssociatedMenuConfiguration": {
            "Behavior": "UseCollectionName",
            "Group": "Details",
            "Label": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": lookup_display,
                    "LanguageCode": 1033,
                }],
                "UserLocalizedLabel": {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": lookup_display,
                    "LanguageCode": 1033,
                },
            },
            "Order": 10000,
        },
        "CascadeConfiguration": {
            "Assign": "NoCascade",
            "Delete": cascade_delete,
            "Merge": "NoCascade",
            "Reparent": "NoCascade",
            "Share": "NoCascade",
            "Unshare": "NoCascade",
        },
        "ReferencedAttribute": parent_pk,
        "ReferencedEntity": parent_table,
        "ReferencingEntity": child_table,
        "Lookup": {
            "AttributeType": "Lookup",
            "AttributeTypeName": {"Value": "LookupType"},
            "Description": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": f"Lookup to {lookup_display}",
                    "LanguageCode": 1033,
                }],
                "UserLocalizedLabel": {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": f"Lookup to {lookup_display}",
                    "LanguageCode": 1033,
                },
            },
            "DisplayName": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": lookup_display,
                    "LanguageCode": 1033,
                }],
                "UserLocalizedLabel": {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": lookup_display,
                    "LanguageCode": 1033,
                },
            },
            "RequiredLevel": {
                "Value": "None",
                "CanBeChanged": True,
                "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings",
            },
            "SchemaName": lookup_schema,
            "@odata.type": "Microsoft.Dynamics.CRM.LookupAttributeMetadata",
        },
    }
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/RelationshipDefinitions",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    print(f"  + 1:N  {rel_name}  ({parent_table} -> {child_table}.{lookup_schema})")


def create_many_to_many(headers, base_url, entity1, entity1_display,
                        entity2, entity2_display, rel_name):
    """Create an N:N relationship via Web API."""
    payload = {
        "SchemaName": rel_name,
        "@odata.type": "Microsoft.Dynamics.CRM.ManyToManyRelationshipMetadata",
        "Entity1AssociatedMenuConfiguration": {
            "Behavior": "UseLabel",
            "Group": "Details",
            "Label": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": entity1_display,
                    "LanguageCode": 1033,
                }],
                "UserLocalizedLabel": {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": entity1_display,
                    "LanguageCode": 1033,
                },
            },
            "Order": 10000,
        },
        "Entity1LogicalName": entity1,
        "Entity2AssociatedMenuConfiguration": {
            "Behavior": "UseLabel",
            "Group": "Details",
            "Label": {
                "@odata.type": "Microsoft.Dynamics.CRM.Label",
                "LocalizedLabels": [{
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": entity2_display,
                    "LanguageCode": 1033,
                }],
                "UserLocalizedLabel": {
                    "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                    "Label": entity2_display,
                    "LanguageCode": 1033,
                },
            },
            "Order": 10000,
        },
        "Entity2LogicalName": entity2,
        "IntersectEntityName": rel_name,
    }
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/RelationshipDefinitions",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    print(f"  + N:N  {rel_name}  ({entity1} <-> {entity2})")


def create_global_optionset(headers, base_url, name, display_name, options):
    """Create a global option set (Choice) via Web API. Returns the MetadataId (GUID)."""
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.OptionSetMetadata",
        "IsGlobal": True,
        "Name": name.lower(),
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": display_name,
                "LanguageCode": 1033,
            }],
        },
        "OptionSetType": "Picklist",
        "Options": [
            {
                "Value": value,
                "Label": {
                    "@odata.type": "Microsoft.Dynamics.CRM.Label",
                    "LocalizedLabels": [{
                        "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                        "Label": label,
                        "LanguageCode": 1033,
                    }],
                },
            }
            for label, value in options
        ],
    }
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/GlobalOptionSetDefinitions",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    # Extract GUID from OData-EntityId header:
    # https://org.crm.dynamics.com/api/data/v9.2/GlobalOptionSetDefinitions(guid)
    entity_id = resp.headers.get("OData-EntityId", "")
    guid = entity_id.rstrip(")").rsplit("(", 1)[-1] if "(" in entity_id else ""
    print(f"  + Global choice: {name} ({display_name}) — {len(options)} options  [{guid}]")
    return guid


def create_choice_column(headers, base_url, table_logical, column_schema, column_display,
                         global_choice_guid, required=False):
    """Create a picklist column referencing a global option set by GUID via Web API."""
    payload = {
        "@odata.type": "Microsoft.Dynamics.CRM.PicklistAttributeMetadata",
        "SchemaName": column_schema,
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": column_display,
                "LanguageCode": 1033,
            }],
        },
        "RequiredLevel": {
            "Value": "ApplicationRequired" if required else "None",
            "CanBeChanged": True,
            "ManagedPropertyLogicalName": "canmodifyrequirementlevelsettings",
        },
        "GlobalOptionSet@odata.bind": f"/GlobalOptionSetDefinitions({global_choice_guid})",
    }
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/EntityDefinitions(LogicalName='{table_logical}')/Attributes",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    print(f"  + Choice column: {table_logical}.{column_schema} → {global_choice_guid}")


def set_table_display_name(headers, base_url, table_logical_name, display_name, plural_display_name):
    """Set the display name and plural display name for a table via Web API."""
    payload = {
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": display_name,
                "LanguageCode": 1033,
            }],
        },
        "DisplayCollectionName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": plural_display_name,
                "LanguageCode": 1033,
            }],
        },
    }
    resp = requests.patch(
        f"{base_url}/api/data/{API_VERSION}/EntityDefinitions(LogicalName='{table_logical_name}')",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    print(f"  + Table: {table_logical_name} → {display_name} ({plural_display_name})")


def set_column_display_name(headers, base_url, table_logical_name, column_logical_name, display_name):
    """Set the display name for a column via Web API."""
    payload = {
        "DisplayName": {
            "@odata.type": "Microsoft.Dynamics.CRM.Label",
            "LocalizedLabels": [{
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": display_name,
                "LanguageCode": 1033,
            }],
        },
    }
    resp = requests.patch(
        f"{base_url}/api/data/{API_VERSION}/EntityDefinitions(LogicalName='{table_logical_name}')"
        f"/Attributes(LogicalName='{column_logical_name}')",
        json=payload,
        headers=headers,
    )
    raise_for_status(resp)
    print(f"  + Column: {table_logical_name}.{column_logical_name} → {display_name}")


# =============================================================================
# Main Script
# =============================================================================

def main():
    print("PowerOne — Dataverse Schema Creation")
    print(f"Environment: {ENV_URL}")
    print(f"Prefix:      {P}_")
    print()

    # ── Authenticate ────────────────────────────────────────────────────
    print("Authenticating via browser...")
    credential = InteractiveBrowserCredential()
    config = DataverseConfig()
    client = DataverseClient(base_url=ENV_URL, credential=credential, config=config)
    headers = get_web_api_headers(credential, ENV_URL)
    print("Authenticated.\n")

    # Logical name helper (Dataverse lowercases schema names)
    def ln(table_schema):
        return table_schema.lower()

    # ====================================================================
    # PHASE 0: Global Choices (Web API — must exist before choice columns)
    # ====================================================================
    phase_header(0, "GLOBAL CHOICES", "10 global option sets used by choice columns across tables")

    headers = get_web_api_headers(credential, ENV_URL)

    # Map choice name → GUID (needed for Phase 5b to bind columns to option sets)
    choice_guids = {}
    for choice in GLOBAL_CHOICES:
        guid = with_retry(
            lambda c=choice: create_global_optionset(
                headers, ENV_URL, c["name"], c["display"], c["options"]
            ),
            f"Global choice {choice['name']}",
        )
        choice_guids[choice["name"]] = guid
        time.sleep(0.5)

    print()

    # ====================================================================
    # PHASE 1: Foundation Tables (no dependencies)
    # ====================================================================
    phase_header(1, "FOUNDATION TABLES", "Sprint + OrganizationalUnit — no foreign keys needed")

    # Sprint (choice columns added in Phase 5b)
    print("Creating Sprint (po_Sprint)...")
    with_retry(lambda: client.create_table(
        f"{P}_Sprint",
        {
            f"{P}_StartDate": "datetime",
            f"{P}_EndDate": "datetime",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_Sprint")
    print("  Created.\n")

    # Organizational Unit (choice columns added in Phase 5b)
    print("Creating Organizational Unit (po_OrganizationalUnit)...")
    with_retry(lambda: client.create_table(
        f"{P}_OrganizationalUnit",
        {},
        primary_column_schema_name=f"{P}_Name",
    ), "po_OrganizationalUnit")
    print("  Created.\n")

    # ====================================================================
    # PHASE 2: Core OKR Tables (depend on Phase 1 via relationships)
    # ====================================================================
    phase_header(2, "CORE OKR TABLES", "Objective + KeyResult — SDK columns only, choice/lookups added later")

    # Objective (choice columns added in Phase 5b)
    print("Creating Objective (po_Objective)...")
    with_retry(lambda: client.create_table(
        f"{P}_Objective",
        {
            f"{P}_Progress": "int",
        },
        primary_column_schema_name=f"{P}_Title",
    ), "po_Objective")
    print("  Created.\n")

    # Key Result (choice columns added in Phase 5b)
    print("Creating Key Result (po_KeyResult)...")
    with_retry(lambda: client.create_table(
        f"{P}_KeyResult",
        {
            f"{P}_Progress": "int",
        },
        primary_column_schema_name=f"{P}_Title",
    ), "po_KeyResult")
    print("  Created.\n")

    # ====================================================================
    # PHASE 3: OKR Detail Tables (depend on Phase 2)
    # ====================================================================
    phase_header(3, "OKR DETAIL TABLES", "Metric, MetricUpdate, Task — depend on KeyResult")

    # Metric (choice columns added in Phase 5b)
    print("Creating Metric (po_Metric)...")
    with_retry(lambda: client.create_table(
        f"{P}_Metric",
        {
            f"{P}_BaselineValue": "decimal",
            f"{P}_CurrentValue": "decimal",
            f"{P}_TargetValue": "decimal",
            f"{P}_Unit": "string",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_Metric")
    print("  Created.\n")

    # Metric Update
    print("Creating Metric Update (po_MetricUpdate)...")
    with_retry(lambda: client.create_table(
        f"{P}_MetricUpdate",
        {
            f"{P}_Value": "decimal",
            f"{P}_RecordedAt": "datetime",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_MetricUpdate")
    print("  Created.\n")

    # Task (choice columns added in Phase 5b)
    print("Creating Task (po_Task)...")
    with_retry(lambda: client.create_table(
        f"{P}_Task",
        {
            f"{P}_CompletedAt": "datetime",
        },
        primary_column_schema_name=f"{P}_Description",
    ), "po_Task")
    print("  Created.\n")

    # ====================================================================
    # PHASE 4: Programs & Process Tables
    # ====================================================================
    phase_header(4, "PROGRAMS & PROCESS TABLES", "Program, ActivityUpdate, Ritual")

    # Program
    print("Creating Program (po_Program)...")
    with_retry(lambda: client.create_table(
        f"{P}_Program",
        {
            f"{P}_OverallProgress": "int",
            f"{P}_EntitiesInvolved": "string",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_Program")
    print("  Created.\n")

    # Activity Update (choice columns added in Phase 5b)
    print("Creating Activity Update (po_ActivityUpdate)...")
    with_retry(lambda: client.create_table(
        f"{P}_ActivityUpdate",
        {
            f"{P}_Timestamp": "datetime",
            f"{P}_UserName": "string",
        },
        primary_column_schema_name=f"{P}_Description",
    ), "po_ActivityUpdate")
    print("  Created.\n")

    # Ritual (choice columns added in Phase 5b)
    print("Creating Ritual (po_Ritual)...")
    with_retry(lambda: client.create_table(
        f"{P}_Ritual",
        {
            f"{P}_DateTime": "datetime",
            f"{P}_Facilitator": "string",
            f"{P}_ParticipantCount": "int",
            f"{P}_Duration": "int",
        },
        primary_column_schema_name=f"{P}_Title",
    ), "po_Ritual")
    print("  Created.\n")

    # ====================================================================
    # PHASE 5: User Feature Tables
    # ====================================================================
    phase_header(5, "USER FEATURE TABLES", "SavedFilter")

    print("Creating Saved Filter (po_SavedFilter)...")
    with_retry(lambda: client.create_table(
        f"{P}_SavedFilter",
        {
            f"{P}_IsPreset": "bool",
            f"{P}_IsShared": "bool",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_SavedFilter")
    print("  Created.\n")

    # ====================================================================
    # PHASE 5b: Choice Columns (Web API — tables + global choices must exist)
    # ====================================================================
    phase_header("5b", "CHOICE COLUMNS",
                 "10 picklist columns referencing global option sets")

    headers = get_web_api_headers(credential, ENV_URL)

    for table_schema, col_schema, col_display, choice_name, required in CHOICE_COLUMNS:
        guid = choice_guids[choice_name]
        with_retry(
            lambda t=table_schema, c=col_schema, d=col_display, g=guid, r=required:
                create_choice_column(headers, ENV_URL, ln(t), c, d, g, r),
            f"Choice {col_schema} on {table_schema}",
        )
        time.sleep(0.5)

    print()

    # ====================================================================
    # PHASE 6: Display Names (Web API — tables and columns must exist)
    # ====================================================================
    phase_header(6, "DISPLAY NAMES",
                 "Set clean display names for tables and columns (remove publisher prefix from UI)")

    headers = get_web_api_headers(credential, ENV_URL)

    print("Setting table display names...")
    for schema_name, (display, plural) in TABLE_DISPLAY_NAMES.items():
        with_retry(
            lambda s=schema_name, d=display, p=plural:
                set_table_display_name(headers, ENV_URL, ln(s), d, p),
            f"Display name for {schema_name}",
        )

    print("\nSetting column display names...")
    for table_schema, col_schema, display in COLUMN_DISPLAY_NAMES:
        with_retry(
            lambda t=table_schema, c=col_schema, d=display:
                set_column_display_name(headers, ENV_URL, ln(t), ln(c), d),
            f"Display name for {table_schema}.{col_schema}",
        )

    print()

    # ====================================================================
    # PHASE 7: Memo Columns (Web API — tables must exist)
    # ====================================================================
    phase_header(7, "MEMO COLUMNS", "Multi-line text columns via Web API (SDK doesn't support Memo)")

    # Refresh token for Web API calls
    headers = get_web_api_headers(credential, ENV_URL)

    memo_columns = [
        (ln(f"{P}_Objective"),      f"{P}_Description",  "Description",    4000),
        (ln(f"{P}_Program"),        f"{P}_Description",  "Description",    4000),
        (ln(f"{P}_Ritual"),         f"{P}_Notes",        "Notes",          10000),
        (ln(f"{P}_SavedFilter"),    f"{P}_CriteriaJson", "Criteria JSON",  50000),
    ]

    for table, schema, display, length in memo_columns:
        with_retry(
            lambda t=table, s=schema, d=display, l=length:
                create_memo_column(headers, ENV_URL, t, s, d, l),
            f"Memo {schema} on {table}",
        )

    print()

    # ====================================================================
    # PHASE 8: 1:N Relationships (Web API — all tables must exist)
    # ====================================================================
    phase_header(8, "1:N RELATIONSHIPS", "16 one-to-many relationships with lookup columns")

    # Refresh token
    headers = get_web_api_headers(credential, ENV_URL)

    one_to_many_rels = [
        # R1: OrgUnit self-referential
        {
            "parent": ln(f"{P}_OrganizationalUnit"),
            "parent_pk": ln(f"{P}_organizationalunitid"),
            "child": ln(f"{P}_OrganizationalUnit"),
            "rel": f"{P}_orgunit_1N_orgunit",
            "display": "Parent Unit",
            "lookup": f"{P}_ParentUnitId",
            "cascade": "RemoveLink",
        },
        # R2: OrgUnit -> Objective
        {
            "parent": ln(f"{P}_OrganizationalUnit"),
            "parent_pk": ln(f"{P}_organizationalunitid"),
            "child": ln(f"{P}_Objective"),
            "rel": f"{P}_orgunit_1N_objective",
            "display": "Organizational Unit",
            "lookup": f"{P}_OrganizationalUnitId",
            "cascade": "Restrict",
        },
        # R3: systemuser -> Objective (Owner)
        {
            "parent": "systemuser",
            "parent_pk": "systemuserid",
            "child": ln(f"{P}_Objective"),
            "rel": f"{P}_user_1N_objective",
            "display": "Owner",
            "lookup": f"{P}_OwnerId",
            "cascade": "RemoveLink",
        },
        # R4: Sprint -> Objective
        {
            "parent": ln(f"{P}_Sprint"),
            "parent_pk": ln(f"{P}_sprintid"),
            "child": ln(f"{P}_Objective"),
            "rel": f"{P}_sprint_1N_objective",
            "display": "Sprint",
            "lookup": f"{P}_SprintId",
            "cascade": "Restrict",
        },
        # R5: Objective self-referential (Parent)
        {
            "parent": ln(f"{P}_Objective"),
            "parent_pk": ln(f"{P}_objectiveid"),
            "child": ln(f"{P}_Objective"),
            "rel": f"{P}_objective_1N_objective",
            "display": "Parent Objective",
            "lookup": f"{P}_ParentObjectiveId",
            "cascade": "RemoveLink",
        },
        # R6: Objective -> KeyResult
        {
            "parent": ln(f"{P}_Objective"),
            "parent_pk": ln(f"{P}_objectiveid"),
            "child": ln(f"{P}_KeyResult"),
            "rel": f"{P}_objective_1N_keyresult",
            "display": "Objective",
            "lookup": f"{P}_ObjectiveId",
            "cascade": "Cascade",
        },
        # R7: Objective -> KeyResult (Linked Child)
        {
            "parent": ln(f"{P}_Objective"),
            "parent_pk": ln(f"{P}_objectiveid"),
            "child": ln(f"{P}_KeyResult"),
            "rel": f"{P}_objective_1N_keyresult_linked",
            "display": "Linked Child Objective",
            "lookup": f"{P}_LinkedChildObjectiveId",
            "cascade": "RemoveLink",
        },
        # R8: KeyResult -> Metric
        {
            "parent": ln(f"{P}_KeyResult"),
            "parent_pk": ln(f"{P}_keyresultid"),
            "child": ln(f"{P}_Metric"),
            "rel": f"{P}_keyresult_1N_metric",
            "display": "Key Result",
            "lookup": f"{P}_KeyResultId",
            "cascade": "Cascade",
        },
        # R9: Metric -> MetricUpdate
        {
            "parent": ln(f"{P}_Metric"),
            "parent_pk": ln(f"{P}_metricid"),
            "child": ln(f"{P}_MetricUpdate"),
            "rel": f"{P}_metric_1N_metricupdate",
            "display": "Metric",
            "lookup": f"{P}_MetricId",
            "cascade": "Cascade",
        },
        # R10: systemuser -> MetricUpdate (Updated By)
        {
            "parent": "systemuser",
            "parent_pk": "systemuserid",
            "child": ln(f"{P}_MetricUpdate"),
            "rel": f"{P}_user_1N_metricupdate",
            "display": "Updated By",
            "lookup": f"{P}_UpdatedById",
            "cascade": "RemoveLink",
        },
        # R11: Sprint -> MetricUpdate
        {
            "parent": ln(f"{P}_Sprint"),
            "parent_pk": ln(f"{P}_sprintid"),
            "child": ln(f"{P}_MetricUpdate"),
            "rel": f"{P}_sprint_1N_metricupdate",
            "display": "Sprint",
            "lookup": f"{P}_SprintId",
            "cascade": "RemoveLink",
        },
        # R12: KeyResult -> Task
        {
            "parent": ln(f"{P}_KeyResult"),
            "parent_pk": ln(f"{P}_keyresultid"),
            "child": ln(f"{P}_Task"),
            "rel": f"{P}_keyresult_1N_task",
            "display": "Key Result",
            "lookup": f"{P}_KeyResultId",
            "cascade": "Cascade",
        },
        # R13: systemuser -> Task (Assigned To)
        {
            "parent": "systemuser",
            "parent_pk": "systemuserid",
            "child": ln(f"{P}_Task"),
            "rel": f"{P}_user_1N_task",
            "display": "Assigned To",
            "lookup": f"{P}_AssignedToId",
            "cascade": "RemoveLink",
        },
        # R14: Sprint -> Ritual
        {
            "parent": ln(f"{P}_Sprint"),
            "parent_pk": ln(f"{P}_sprintid"),
            "child": ln(f"{P}_Ritual"),
            "rel": f"{P}_sprint_1N_ritual",
            "display": "Sprint",
            "lookup": f"{P}_SprintId",
            "cascade": "Restrict",
        },
        # R15: systemuser -> SavedFilter (Created By)
        {
            "parent": "systemuser",
            "parent_pk": "systemuserid",
            "child": ln(f"{P}_SavedFilter"),
            "rel": f"{P}_user_1N_savedfilter",
            "display": "Created By",
            "lookup": f"{P}_CreatedById",
            "cascade": "Cascade",
        },
        # R16: Program -> ActivityUpdate
        {
            "parent": ln(f"{P}_Program"),
            "parent_pk": ln(f"{P}_programid"),
            "child": ln(f"{P}_ActivityUpdate"),
            "rel": f"{P}_program_1N_activityupdate",
            "display": "Program",
            "lookup": f"{P}_ProgramId",
            "cascade": "Cascade",
        },
    ]

    for i, rel in enumerate(one_to_many_rels, 1):
        with_retry(
            lambda r=rel: create_one_to_many(
                headers, ENV_URL,
                parent_table=r["parent"],
                parent_pk=r["parent_pk"],
                child_table=r["child"],
                rel_name=r["rel"],
                lookup_display=r["display"],
                lookup_schema=r["lookup"],
                cascade_delete=r["cascade"],
            ),
            f"R{i}: {rel['rel']}",
        )
        # Brief pause between relationship creations to avoid throttling
        time.sleep(1)

    print()

    # ====================================================================
    # PHASE 9: N:N Relationships (Web API — all tables must exist)
    # ====================================================================
    phase_header(9, "N:N RELATIONSHIPS", "4 many-to-many relationships with intersect tables")

    # Refresh token
    headers = get_web_api_headers(credential, ENV_URL)

    many_to_many_rels = [
        # R17: Program <-> Objective
        {
            "entity1": ln(f"{P}_Program"),
            "display1": "Program",
            "entity2": ln(f"{P}_Objective"),
            "display2": "Objective",
            "rel": f"{P}_program_objective",
        },
        # R18: Program <-> systemuser (Program Leads)
        {
            "entity1": ln(f"{P}_Program"),
            "display1": "Program",
            "entity2": "systemuser",
            "display2": "Program Lead",
            "rel": f"{P}_program_lead",
        },
        # R19: KeyResult <-> systemuser (KR Team)
        {
            "entity1": ln(f"{P}_KeyResult"),
            "display1": "Key Result",
            "entity2": "systemuser",
            "display2": "Team Member",
            "rel": f"{P}_keyresult_team",
        },
        # R20: systemuser <-> OrganizationalUnit (User membership)
        {
            "entity1": "systemuser",
            "display1": "User",
            "entity2": ln(f"{P}_OrganizationalUnit"),
            "display2": "Organizational Unit",
            "rel": f"{P}_user_orgunit",
        },
    ]

    for i, rel in enumerate(many_to_many_rels, 17):
        with_retry(
            lambda r=rel: create_many_to_many(
                headers, ENV_URL,
                entity1=r["entity1"],
                entity1_display=r["display1"],
                entity2=r["entity2"],
                entity2_display=r["display2"],
                rel_name=r["rel"],
            ),
            f"R{i}: {rel['rel']}",
        )
        time.sleep(1)

    # ====================================================================
    # DONE
    # ====================================================================
    print(f"\n{'='*70}")
    print("  COMPLETE")
    print(f"{'='*70}")
    num_columns = len(COLUMN_DISPLAY_NAMES)
    num_choices = len(GLOBAL_CHOICES)
    num_choice_cols = len(CHOICE_COLUMNS)
    print(f"""
Schema creation finished.

Summary:
  Global choices created:   {num_choices}
  Tables created:           11
  Choice columns added:     {num_choice_cols}
  Display names set:        11 tables + {num_columns} columns
  Memo columns added:       4
  1:N relationships:        16
  N:N relationships:        4

Verify in Power Apps:
  https://make.powerapps.com → Tables → filter by "{P}_"
  Table display names should show without the "{P}_" prefix (e.g. "Sprint", not "po_Sprint")
  Global choices visible under: Settings → Customizations → Option Sets → filter by "{P}_"

Next steps:
  1. Configure security roles (Admin, Program Lead, Objective Owner, Team Member, Viewer)
  2. Run the seed data script to populate sample records
  3. Build model-driven app or canvas app on top of these tables
""")


# =============================================================================
# Rollback Script (uncomment to delete all tables — IRREVERSIBLE)
# =============================================================================

def rollback():
    """Delete all PowerOne custom tables and global choices. USE WITH EXTREME CAUTION."""
    print("ROLLBACK — Deleting all PowerOne tables and global choices")
    print("This is IRREVERSIBLE and deletes ALL data.\n")

    credential = InteractiveBrowserCredential()
    config = DataverseConfig()
    client = DataverseClient(base_url=ENV_URL, credential=credential, config=config)
    headers = get_web_api_headers(credential, ENV_URL)

    # Delete tables in reverse dependency order (children first)
    print("Deleting tables...")
    tables_to_delete = [
        f"{P}_ActivityUpdate",
        f"{P}_SavedFilter",
        f"{P}_MetricUpdate",
        f"{P}_Task",
        f"{P}_Metric",
        f"{P}_Ritual",
        f"{P}_KeyResult",
        f"{P}_Objective",
        f"{P}_Program",
        f"{P}_Sprint",
        f"{P}_OrganizationalUnit",
    ]

    for table in tables_to_delete:
        try:
            client.delete_table(table)
            print(f"  Deleted: {table}")
        except Exception as e:
            print(f"  Skip (may not exist): {table} — {e}")

    # Delete global choices (must happen after tables that reference them)
    print("\nDeleting global choices...")
    for choice in GLOBAL_CHOICES:
        name = choice["name"].lower()
        try:
            resp = requests.delete(
                f"{ENV_URL}/api/data/{API_VERSION}/GlobalOptionSetDefinitions(Name='{name}')",
                headers=headers,
            )
            raise_for_status(resp)
            print(f"  Deleted: {choice['name']}")
        except Exception as e:
            print(f"  Skip (may not exist): {choice['name']} — {e}")

    print("\nRollback complete.")


# =============================================================================
# Entry Point
# =============================================================================

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--rollback":
        confirm = input("Type 'DELETE ALL' to confirm rollback: ")
        if confirm == "DELETE ALL":
            rollback()
        else:
            print("Rollback cancelled.")
    else:
        main()
