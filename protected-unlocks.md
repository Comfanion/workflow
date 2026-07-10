# Protected Paths Unlock Log

Append-only log of overrides granted against `protected.yaml`. Newest first.

Every entry must include:

- **Date** (ISO 8601)
- **Protected id** (must match a `protected.yaml` entry)
- **Reason** (why this override was necessary — not "I wanted to")
- **Author** (who approved — must be a human; not the agent)
- **Expiry** (`permanent`, or an ISO date for temporary overrides)

The agent reads this file before proceeding with an override. If no matching entry exists, the agent refuses and asks for the entry to be added. The full mechanism is defined inline in `protected.yaml`.

## Entries

<!-- Append new entries below this line. Newest first. -->

(no entries yet)
