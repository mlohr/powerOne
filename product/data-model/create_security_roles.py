#!/usr/bin/env python3
"""
PowerOne Security Roles — Dataverse Web API Implementation

Creates custom security roles for the PowerOne OKR system with appropriate
privileges for each PowerOne table.

Requirements:
- Python 3.9+
- azure-identity
- requests

Environment Variables:
- POWERONE_ENV_URL: Dataverse environment URL (e.g., https://org.crm4.dynamics.com)

Usage:
    python create_security_roles.py [--rollback]
"""

import os
import sys
import time
import argparse
import requests
from azure.identity import InteractiveBrowserCredential

# =============================================================================
# Configuration
# =============================================================================

API_VERSION = "v9.2"
P = "po"  # Publisher prefix

# Get environment URL from environment variable
ENV_URL = os.environ.get("POWERONE_ENV_URL", "").rstrip("/")
if not ENV_URL:
    print("ERROR: POWERONE_ENV_URL environment variable is required")
    print("Example: export POWERONE_ENV_URL=https://org12345.crm4.dynamics.com")
    sys.exit(1)

# =============================================================================
# PowerOne Tables
# =============================================================================

POWERONE_TABLES = [
    "po_organizationalunit",
    "po_objective",
    "po_keyresult",
    "po_metric",
    "po_metricupdate",
    "po_task",
    "po_program",
    "po_sprint",
    "po_ritual",
    "po_savedfilter",
    "po_activityupdate",
]

# =============================================================================
# Privilege Types
# =============================================================================

PRIVILEGE_VERBS = ["Create", "Read", "Write", "Delete", "Append", "AppendTo", "Assign", "Share"]

# Access levels for AddPrivilegesRole
ACCESS_LEVELS = {
    "None": "None",
    "User": "Basic",
    "BU": "Local",
    "ParentChild": "Deep",
    "Org": "Global",
}

# =============================================================================
# Security Role Definitions
# =============================================================================

# Format: table_name: {verb: access_level}
# Use "-" for no access (privilege won't be added)

ROLE_DEFINITIONS = {
    "PowerOne Admin": {
        "po_organizationalunit": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org", "Assign": "Org", "Share": "Org"},
        "po_objective": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org", "Assign": "Org", "Share": "Org"},
        "po_keyresult": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org", "Assign": "Org", "Share": "Org"},
        "po_metric": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org"},
        "po_metricupdate": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org"},
        "po_task": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org", "Assign": "Org"},
        "po_program": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org", "Assign": "Org", "Share": "Org"},
        "po_sprint": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org"},
        "po_ritual": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org"},
        "po_savedfilter": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org"},
        "po_activityupdate": {"Create": "Org", "Read": "Org", "Write": "Org", "Delete": "Org", "Append": "Org", "AppendTo": "Org"},
    },
    "PowerOne User": {
        "po_organizationalunit": {"Read": "Org", "AppendTo": "Org"},
        "po_objective": {"Read": "Org", "AppendTo": "Org"},
        "po_keyresult": {"Read": "Org", "AppendTo": "Org"},
        "po_metric": {"Read": "Org", "AppendTo": "Org"},
        "po_metricupdate": {"Read": "Org"},
        "po_task": {"Read": "Org", "Write": "User", "AppendTo": "Org"},
        "po_program": {"Read": "Org", "AppendTo": "Org"},
        "po_sprint": {"Read": "Org", "AppendTo": "Org"},
        "po_ritual": {"Read": "Org"},
        "po_savedfilter": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User"},
        "po_activityupdate": {"Read": "Org"},
    },
    "PowerOne Objective Owner": {
        "po_objective": {"Create": "User", "Read": "Org", "Write": "User", "Append": "User", "AppendTo": "Org", "Share": "User"},
        "po_keyresult": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User", "Append": "User", "AppendTo": "Org"},
        "po_metric": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User", "Append": "User", "AppendTo": "Org"},
        "po_task": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User", "Append": "User", "AppendTo": "Org", "Assign": "User"},
    },
    "PowerOne KR Contributor": {
        "po_keyresult": {"Read": "Org", "Write": "User", "Append": "User", "AppendTo": "Org"},
        "po_metric": {"Read": "Org", "Write": "User", "Append": "User", "AppendTo": "Org"},
        "po_metricupdate": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User", "Append": "User", "AppendTo": "Org"},
        "po_task": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User", "Append": "User", "AppendTo": "Org"},
    },
    "PowerOne Viewer": {
        "po_organizationalunit": {"Read": "Org"},
        "po_objective": {"Read": "Org"},
        "po_keyresult": {"Read": "Org"},
        "po_metric": {"Read": "Org"},
        "po_metricupdate": {"Read": "Org"},
        "po_task": {"Read": "Org"},
        "po_program": {"Read": "Org"},
        "po_sprint": {"Read": "Org"},
        "po_ritual": {"Read": "Org"},
        "po_savedfilter": {"Create": "User", "Read": "Org", "Write": "User", "Delete": "User"},
        "po_activityupdate": {"Read": "Org"},
    },
}


# =============================================================================
# Authentication
# =============================================================================

def get_credential():
    """Get Azure credential via interactive browser login."""
    return InteractiveBrowserCredential()


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


# =============================================================================
# API Helpers
# =============================================================================

def raise_for_status(resp):
    """Raise an exception with detailed error info if request failed."""
    if not resp.ok:
        try:
            error = resp.json().get("error", {})
            code = error.get("code", "Unknown")
            message = error.get("message", resp.text)
        except Exception:
            code = "Unknown"
            message = resp.text
        raise requests.HTTPError(
            f"{resp.status_code} {resp.reason}: {code} — {message}",
            response=resp,
        )


def get_business_unit_id(headers, base_url):
    """Get the root business unit ID using WhoAmI."""
    resp = requests.get(
        f"{base_url}/api/data/{API_VERSION}/WhoAmI",
        headers=headers,
    )
    raise_for_status(resp)
    return resp.json()["BusinessUnitId"]


def get_privileges_for_table(headers, base_url, table_name):
    """Get all privileges for a specific table."""
    # Privilege names follow pattern: prv{Verb}{TableSchemaName}
    privilege_names = [f"prv{verb}{table_name}" for verb in PRIVILEGE_VERBS]

    # Build filter
    filter_parts = [f"name eq '{name}'" for name in privilege_names]
    filter_str = " or ".join(filter_parts)

    resp = requests.get(
        f"{base_url}/api/data/{API_VERSION}/privileges",
        headers=headers,
        params={
            "$select": "privilegeid,name",
            "$filter": filter_str,
        },
    )
    raise_for_status(resp)

    # Return dict mapping verb to privilege info
    privileges = {}
    for priv in resp.json().get("value", []):
        # Extract verb from privilege name (e.g., prvReadpo_objective -> Read)
        name = priv["name"]
        for verb in PRIVILEGE_VERBS:
            if name.startswith(f"prv{verb}"):
                privileges[verb] = {
                    "privilegeid": priv["privilegeid"],
                    "name": name,
                }
                break
    return privileges


def get_all_powerone_privileges(headers, base_url):
    """Get all privileges for all PowerOne tables."""
    print("\n  Discovering privileges for PowerOne tables...")
    all_privileges = {}

    for table in POWERONE_TABLES:
        privileges = get_privileges_for_table(headers, base_url, table)
        all_privileges[table] = privileges
        print(f"    Found {len(privileges)} privileges for {table}")
        time.sleep(0.1)  # Rate limiting

    return all_privileges


def get_existing_role(headers, base_url, role_name, business_unit_id):
    """Check if a role with the given name already exists."""
    resp = requests.get(
        f"{base_url}/api/data/{API_VERSION}/roles",
        headers=headers,
        params={
            "$select": "roleid,name",
            "$filter": f"name eq '{role_name}' and _businessunitid_value eq '{business_unit_id}'",
        },
    )
    raise_for_status(resp)
    roles = resp.json().get("value", [])
    return roles[0] if roles else None


def create_role(headers, base_url, role_name, business_unit_id):
    """Create a new security role."""
    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/roles",
        headers=headers,
        json={
            "name": role_name,
            "businessunitid@odata.bind": f"/businessunits({business_unit_id})",
        },
    )
    raise_for_status(resp)

    # Extract role ID from OData-EntityId header
    entity_id = resp.headers.get("OData-EntityId", "")
    role_id = entity_id.rstrip(")").rsplit("(", 1)[-1] if "(" in entity_id else ""
    return role_id


def add_privileges_to_role(headers, base_url, role_id, business_unit_id, privileges_to_add):
    """Add privileges to a security role using AddPrivilegesRole action."""
    if not privileges_to_add:
        return

    resp = requests.post(
        f"{base_url}/api/data/{API_VERSION}/roles({role_id})/Microsoft.Dynamics.CRM.AddPrivilegesRole",
        headers=headers,
        json={
            "Privileges": privileges_to_add,
        },
    )
    raise_for_status(resp)


def delete_role(headers, base_url, role_id):
    """Delete a security role."""
    resp = requests.delete(
        f"{base_url}/api/data/{API_VERSION}/roles({role_id})",
        headers=headers,
    )
    raise_for_status(resp)


# =============================================================================
# Main Functions
# =============================================================================

def create_security_roles():
    """Create all PowerOne security roles."""
    print("=" * 70)
    print("  PowerOne Security Roles — Creation Script")
    print("=" * 70)
    print(f"\n  Environment: {ENV_URL}")

    # Authenticate
    print("\n  Authenticating...")
    credential = get_credential()
    headers = get_web_api_headers(credential, ENV_URL)

    # Get business unit ID
    business_unit_id = get_business_unit_id(headers, ENV_URL)
    print(f"  Business Unit ID: {business_unit_id}")

    # Discover all privileges
    all_privileges = get_all_powerone_privileges(headers, ENV_URL)

    # Create each role
    created_roles = []

    for role_name, table_privileges in ROLE_DEFINITIONS.items():
        print(f"\n  Creating role: {role_name}")
        print("-" * 50)

        # Refresh headers (token might expire)
        headers = get_web_api_headers(credential, ENV_URL)

        # Check if role exists
        existing_role = get_existing_role(headers, ENV_URL, role_name, business_unit_id)
        if existing_role:
            print(f"    Role already exists with ID: {existing_role['roleid']}")
            print(f"    Skipping creation (delete first if you want to recreate)")
            continue

        # Create the role
        role_id = create_role(headers, ENV_URL, role_name, business_unit_id)
        print(f"    Created role with ID: {role_id}")
        created_roles.append({"name": role_name, "id": role_id})

        # Build list of privileges to add
        privileges_to_add = []

        for table_name, verbs in table_privileges.items():
            table_privs = all_privileges.get(table_name, {})

            for verb, access_level in verbs.items():
                if access_level == "-":
                    continue  # Skip - means no access

                priv_info = table_privs.get(verb)
                if not priv_info:
                    print(f"    WARNING: Privilege prv{verb}{table_name} not found")
                    continue

                privileges_to_add.append({
                    "PrivilegeId": priv_info["privilegeid"],
                    "PrivilegeName": priv_info["name"],
                    "Depth": ACCESS_LEVELS[access_level],
                    "BusinessUnitId": business_unit_id,
                })

        # Add privileges to role
        if privileges_to_add:
            add_privileges_to_role(headers, ENV_URL, role_id, business_unit_id, privileges_to_add)
            print(f"    Added {len(privileges_to_add)} privileges to role")

        time.sleep(0.3)  # Rate limiting

    print("\n" + "=" * 70)
    print("  Security Role Creation Complete!")
    print("=" * 70)

    if created_roles:
        print("\n  Created roles:")
        for role in created_roles:
            print(f"    - {role['name']} [{role['id']}]")

    print("\n  Next steps:")
    print("    1. Review roles in Power Platform Admin Center")
    print("    2. Assign roles to users/teams")
    print("    3. Test access with different user accounts")


def rollback_security_roles():
    """Delete all PowerOne security roles."""
    print("=" * 70)
    print("  PowerOne Security Roles — Rollback Script")
    print("=" * 70)
    print(f"\n  Environment: {ENV_URL}")

    # Authenticate
    print("\n  Authenticating...")
    credential = get_credential()
    headers = get_web_api_headers(credential, ENV_URL)

    # Get business unit ID
    business_unit_id = get_business_unit_id(headers, ENV_URL)
    print(f"  Business Unit ID: {business_unit_id}")

    print("\n  Deleting PowerOne security roles...")
    print("-" * 50)

    for role_name in ROLE_DEFINITIONS.keys():
        headers = get_web_api_headers(credential, ENV_URL)

        existing_role = get_existing_role(headers, ENV_URL, role_name, business_unit_id)
        if existing_role:
            delete_role(headers, ENV_URL, existing_role["roleid"])
            print(f"    Deleted: {role_name}")
        else:
            print(f"    Not found: {role_name}")

        time.sleep(0.2)

    print("\n" + "=" * 70)
    print("  Rollback Complete!")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="PowerOne Security Roles Management")
    parser.add_argument(
        "--rollback",
        action="store_true",
        help="Delete all PowerOne security roles",
    )
    args = parser.parse_args()

    if args.rollback:
        rollback_security_roles()
    else:
        create_security_roles()


if __name__ == "__main__":
    main()
