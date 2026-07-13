# QueryForge — Sandbox Service

Executes untrusted user SQL/Mongo queries in isolation and returns rows + execution-plan output.

## Structure
- `engines/` — one adapter per engine: `sqlite_engine.py`, `postgres_engine.py`, `mysql_engine.py`, `mongo_engine.py`
- `config/` — resource limits (timeout, row caps), statement whitelist rules per engine

## Hard rules (all engines)
- Whitelisted statement types only — no admin/superuser operations, no cross-schema/db access, no filesystem or network access from within the sandbox.
- Query timeout (default 5s) and row-limit caps.
- Separate, scoped credentials per sandbox — never reuse platform DB credentials.
- MongoDB additionally blocks `$where` (arbitrary JS) and caps aggregation pipeline stages.

## Sequencing (see docs/)
SQLite (MVP) → Postgres → MySQL → MongoDB.

## Setup
Each engine adapter is intentionally isolated so engines can be added incrementally without touching the others.
