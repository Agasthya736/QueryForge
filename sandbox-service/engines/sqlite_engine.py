"""SQLite sandbox: one file per session, executed in a subprocess with
ulimit/timeout enforcement. Returns rows + EXPLAIN QUERY PLAN output."""
