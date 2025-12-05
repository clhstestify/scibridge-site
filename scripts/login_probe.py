"""Offline login verifier for SciBridge demo accounts.

This utility reads the JSON user store used by the local API server and
checks a username/password pair against the saved bcrypt password hashes.

Usage:
    python scripts/login_probe.py --username alice --password secret

By default the script looks for ``server/data/users.json`` relative to the
repository root. You can override the path with ``--store``.
"""

import argparse
import json
from pathlib import Path

import bcrypt


def load_users(store_path: Path):
    if not store_path.exists():
        raise SystemExit(f"User store not found at {store_path}")

    try:
        data = json.loads(store_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Could not parse user store: {exc}") from exc

    if not isinstance(data, list):
        raise SystemExit("User store is not a list of user objects")
    return data


def verify_credentials(users, username: str, password: str):
    normalized = username.lower()
    for entry in users:
        if entry.get("username") != normalized:
            continue
        stored_hash = entry.get("passwordHash")
        if not stored_hash:
            raise SystemExit("User record is missing a passwordHash field")

        if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            return {
                "id": entry.get("id"),
                "username": entry.get("username"),
                "name": entry.get("name"),
                "role": entry.get("role", "student"),
                "status": entry.get("status", "active"),
                "organization": entry.get("organization"),
            }
        return None
    return None


def main():
    parser = argparse.ArgumentParser(description="Offline login checker")
    parser.add_argument("--username", required=True, help="Username to verify")
    parser.add_argument("--password", required=True, help="Password to verify")
    parser.add_argument(
        "--store",
        default=Path("server/data/users.json"),
        type=Path,
        help="Path to the JSON file that stores users",
    )

    args = parser.parse_args()

    users = load_users(args.store)
    result = verify_credentials(users, args.username, args.password)
    if result:
        print("Credentials are valid for user:")
        for key, value in result.items():
            print(f"  {key}: {value}")
    else:
        print("Invalid username or password")


if __name__ == "__main__":
    main()
