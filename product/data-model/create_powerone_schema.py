"""
PowerOne — Dataverse Schema Creation Script

Creates the complete PowerOne data model in Microsoft Dataverse, organized
in dependency-ordered phases:

  Phase 1: Foundation tables (no dependencies)
  Phase 2: Core OKR tables (depend on Phase 1)
  Phase 3: OKR detail tables (depend on Phase 2)
  Phase 4: Programs & process tables (depend on Phase 1)
  Phase 5: User feature tables (depend on Phase 1)
  Phase 6: Memo columns via Web API (tables must exist)
  Phase 7: 1:N relationships via Web API (tables must exist)
  Phase 8: N:N relationships via Web API (tables must exist)

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

ENV_URL = os.environ.get("POWERONE_ENV_URL", "https://<your-org>.crm.dynamics.com")
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
# Helpers
# =============================================================================

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
    resp.raise_for_status()
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
    resp.raise_for_status()
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
    resp.raise_for_status()
    print(f"  + N:N  {rel_name}  ({entity1} <-> {entity2})")


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
    # PHASE 1: Foundation Tables (no dependencies)
    # ====================================================================
    phase_header(1, "FOUNDATION TABLES", "Sprint + OrganizationalUnit — no foreign keys needed")

    # Sprint
    print("Creating po_Sprint...")
    with_retry(lambda: client.create_table(
        f"{P}_Sprint",
        {
            f"{P}_StartDate": "datetime",
            f"{P}_EndDate": "datetime",
            f"{P}_Status": SprintStatus,
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_Sprint")
    print("  Created.\n")

    # Organizational Unit
    print("Creating po_OrganizationalUnit...")
    with_retry(lambda: client.create_table(
        f"{P}_OrganizationalUnit",
        {
            f"{P}_Level": OrganizationalLevel,
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_OrganizationalUnit")
    print("  Created.\n")

    # ====================================================================
    # PHASE 2: Core OKR Tables (depend on Phase 1 via relationships)
    # ====================================================================
    phase_header(2, "CORE OKR TABLES", "Objective + KeyResult — SDK columns only, lookups added in Phase 7")

    # Objective
    print("Creating po_Objective...")
    with_retry(lambda: client.create_table(
        f"{P}_Objective",
        {
            f"{P}_Status": ObjectiveStatus,
            f"{P}_Progress": "int",
        },
        primary_column_schema_name=f"{P}_Title",
    ), "po_Objective")
    print("  Created.\n")

    # Key Result
    print("Creating po_KeyResult...")
    with_retry(lambda: client.create_table(
        f"{P}_KeyResult",
        {
            f"{P}_Status": KeyResultStatus,
            f"{P}_Progress": "int",
        },
        primary_column_schema_name=f"{P}_Title",
    ), "po_KeyResult")
    print("  Created.\n")

    # ====================================================================
    # PHASE 3: OKR Detail Tables (depend on Phase 2)
    # ====================================================================
    phase_header(3, "OKR DETAIL TABLES", "Metric, MetricUpdate, Task — depend on KeyResult")

    # Metric
    print("Creating po_Metric...")
    with_retry(lambda: client.create_table(
        f"{P}_Metric",
        {
            f"{P}_Scale": MetricScale,
            f"{P}_Direction": MetricDirection,
            f"{P}_BaselineValue": "decimal",
            f"{P}_CurrentValue": "decimal",
            f"{P}_TargetValue": "decimal",
            f"{P}_Unit": "string",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_Metric")
    print("  Created.\n")

    # Metric Update
    print("Creating po_MetricUpdate...")
    with_retry(lambda: client.create_table(
        f"{P}_MetricUpdate",
        {
            f"{P}_Value": "decimal",
            f"{P}_RecordedAt": "datetime",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_MetricUpdate")
    print("  Created.\n")

    # Task
    print("Creating po_Task...")
    with_retry(lambda: client.create_table(
        f"{P}_Task",
        {
            f"{P}_Status": TaskStatus,
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
    print("Creating po_Program...")
    with_retry(lambda: client.create_table(
        f"{P}_Program",
        {
            f"{P}_OverallProgress": "int",
            f"{P}_EntitiesInvolved": "string",
        },
        primary_column_schema_name=f"{P}_Name",
    ), "po_Program")
    print("  Created.\n")

    # Activity Update
    print("Creating po_ActivityUpdate...")
    with_retry(lambda: client.create_table(
        f"{P}_ActivityUpdate",
        {
            f"{P}_Type": ActivityType,
            f"{P}_Timestamp": "datetime",
            f"{P}_UserName": "string",
        },
        primary_column_schema_name=f"{P}_Description",
    ), "po_ActivityUpdate")
    print("  Created.\n")

    # Ritual
    print("Creating po_Ritual...")
    with_retry(lambda: client.create_table(
        f"{P}_Ritual",
        {
            f"{P}_Type": RitualType,
            f"{P}_Status": RitualStatus,
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

    print("Creating po_SavedFilter...")
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
    # PHASE 6: Memo Columns (Web API — tables must exist)
    # ====================================================================
    phase_header(6, "MEMO COLUMNS", "Multi-line text columns via Web API (SDK doesn't support Memo)")

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
    # PHASE 7: 1:N Relationships (Web API — all tables must exist)
    # ====================================================================
    phase_header(7, "1:N RELATIONSHIPS", "16 one-to-many relationships with lookup columns")

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
    # PHASE 8: N:N Relationships (Web API — all tables must exist)
    # ====================================================================
    phase_header(8, "N:N RELATIONSHIPS", "4 many-to-many relationships with intersect tables")

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
    print(f"""
Schema creation finished.

Summary:
  Tables created:           11
  Memo columns added:       4
  1:N relationships:        16
  N:N relationships:        4

Verify in Power Apps:
  https://make.powerapps.com → Tables → filter by "{P}_"

Next steps:
  1. Configure security roles (Admin, Program Lead, Objective Owner, Team Member, Viewer)
  2. Run the seed data script to populate sample records
  3. Build model-driven app or canvas app on top of these tables
""")


# =============================================================================
# Rollback Script (uncomment to delete all tables — IRREVERSIBLE)
# =============================================================================

def rollback():
    """Delete all PowerOne custom tables. USE WITH EXTREME CAUTION."""
    print("ROLLBACK — Deleting all PowerOne tables")
    print("This is IRREVERSIBLE and deletes ALL data.\n")

    credential = InteractiveBrowserCredential()
    config = DataverseConfig()
    client = DataverseClient(base_url=ENV_URL, credential=credential, config=config)

    # Delete in reverse dependency order (children first)
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
