# SQL Mastery Platform — Multi-Agent System Design (Interview Prep Focus)

## 1. Product Vision

Not a content site like GeeksforGeeks, not a pure query-runner like LeetCode. The differentiator:

- An **agent that teaches you a concept with a generated animation on demand**, not a static article.
- An **agent that interviews you** like a real technical round, evaluates your SQL answer semantically (not just exact-match), and tells you *why* it's right/wrong.
- **Adaptive difficulty** — the system tracks what you actually struggle with (e.g. window functions, self-joins) and steers you, instead of a fixed course order.

---

## 2. Multi-Agent Architecture

Five agents, one orchestrator. Each agent is a specialized LLM call with its own tools — same pattern as your Radiology MAS / Code Review project, just applied to SQL pedagogy.

```
                        ┌─────────────────────────┐
                        │   Orchestrator Agent     │
                        │  (routes intent, holds   │
                        │   session state/level)   │
                        └────────────┬─────────────┘
              ┌───────────────────┬──┴───────┬───────────────────┐
              ▼                   ▼          ▼                   ▼
  ┌───────────────────┐ ┌──────────────┐ ┌───────────────┐ ┌──────────────────┐
  │  Concept Tutor     │ │  Animation    │ │ Interviewer   │ │  Evaluator Agent  │
  │  Agent             │ │  Generator    │ │  Agent        │ │                    │
  │  explains concepts │ │  Agent        │ │  asks Qs,     │ │  grades user's SQL │
  │  on request         │ │  turns a      │ │  adjusts by   │ │  answer, gives      │
  │                     │ │  concept into │ │  level        │ │  rubric-based        │
  │                     │ │  step JSON    │ │               │ │  feedback             │
  └─────────────────────┘ └──────────────┘ └───────────────┘ └──────────────────┘
              │                   │                  │                  │
              └───────────────────┴────────┬─────────┴──────────────────┘
                                            ▼
                                ┌────────────────────────┐
                                │   Sandbox Tool          │
                                │  (executes SQL, returns │
                                │   rows + EXPLAIN plan)  │
                                └────────────────────────┘
                                            ▼
                                ┌────────────────────────┐
                                │  Progress Tracker Agent │
                                │  (updates skill graph,  │
                                │   picks next difficulty)│
                                └────────────────────────┘
```

### 2.1 Orchestrator Agent
- Holds session state: current level (beginner/intermediate/advanced), current mode (learn / practice / mock interview), recent mistake tags.
- Routes each user message to the right specialist agent. E.g. "explain window functions" → Concept Tutor + Animation Generator; "quiz me" → Interviewer Agent.
- This is the only agent the frontend talks to directly — it's a thin router, keeps other agents stateless and swappable.

### 2.2 Concept Tutor Agent
- Explains a concept at the user's current level (a beginner explanation of JOINs vs. an advanced one covering join algorithms/cost).
- Tool available: `run_sql(query)` — so it can show a live example, not just talk in the abstract.
- Calls the Animation Generator agent automatically when a concept is spatial/procedural (joins, indexing, execution order, normalization) rather than purely definitional.

### 2.3 Animation Generator Agent — the core differentiator
This agent's job: **given a concept + optionally a real query, emit a structured "scene script"** that the frontend renders. It does *not* generate images — it generates a tool-call payload the frontend interprets deterministically. This keeps animations mechanically accurate instead of hallucinated.

Tool schema it must call:
```json
{
  "tool": "render_animation",
  "scene_type": "join | index_scan | execution_plan | normalization | transaction_lock",
  "steps": [
    {
      "id": 1,
      "narration": "We scan the orders table row by row.",
      "highlight": {"table": "orders", "rows": [1,2,3]},
      "duration_ms": 1500
    },
    {
      "id": 2,
      "narration": "For each order, we probe the hash table built from customers.",
      "highlight": {"table": "customers", "match_key": "customer_id"},
      "duration_ms": 1500
    }
  ]
}
```
- For a **real user query**, this agent is fed the actual `EXPLAIN ANALYZE` output from the Sandbox Tool and translates plan nodes into steps — so the animation matches what really happened, not a generic textbook version.
- For a **pure concept explanation** (no query yet), it generates a canonical example (e.g., a small 5-row `orders`/`customers` join) purely to illustrate the mechanism.
- Frontend has a fixed set of animation renderers keyed by `scene_type` (D3/Framer components) — the agent only ever picks a scene type + fills in data, it never generates arbitrary UI code. This is important: **don't let the agent generate raw HTML/JS for animations** — treat it as filling a template, both for consistency and safety.

### 2.4 Interviewer Agent
- Generates interview-style questions calibrated to level:
  - **Beginner**: "Write a query to find all employees earning more than $50,000."
  - **Intermediate**: "Find the second-highest salary per department using a window function."
  - **Advanced**: "Given this schema, write a query to detect duplicate transactions within a 5-minute window, without using a self-join."
- Can pull from a curated question bank (deterministic, quality-controlled) *or* generate novel variations — recommend curated bank as primary source, agent used to vary table/column names and add follow-up twists so users can't just memorize answers.
- Runs a **mock interview mode**: multi-question session, timed, no hints, mimics real interview pressure; produces a summary report at the end.

### 2.5 Evaluator Agent
- Input: user's SQL + the question's intent (not just one "correct" query string — SQL has many valid solutions).
- Process:
  1. Run user's query via Sandbox Tool.
  2. Compare **result set** against expected output (or against a reference query's output) — correctness by result, not by matching SQL text.
  3. Additionally judge: efficiency (did they use an index-friendly predicate, avoid `SELECT *`, avoid unnecessary subqueries), and style.
  4. If wrong: diagnose the *category* of mistake (off-by-one in window frame, wrong join type, missing NULL handling) — this categorization feeds the Progress Tracker.
- Output: structured feedback, not just "wrong":
```json
{
  "correct": false,
  "result_diff": "Expected 3 rows, got 5 — duplicates not deduplicated",
  "mistake_category": "missing_distinct",
  "hint": "Check whether your join is producing duplicate rows before aggregation.",
  "efficiency_note": "Query would benefit from an index on order_date."
}
```

### 2.6 Progress Tracker Agent (or simpler: rules engine, agent optional)
- Maintains a skill graph: per-topic mastery score, updated after each attempt.
- Decides next difficulty/topic — e.g., if user fails window-function questions 3x, drop back to a targeted concept lesson before another attempt, rather than moving on.
- This can start as a plain scoring algorithm (no LLM needed) — don't over-agentify what's just Elo-style tracking; save the agent calls for things that need language understanding.

---

## 3. Difficulty Levels — how they actually change behavior, not just labels

| Level | Question style | Evaluator strictness | Animation depth | Hints |
|---|---|---|---|---|
| Beginner | Single-table, explicit instructions | Lenient on style, checks correctness only | Full step-by-step, slow, narrated heavily | Hints available anytime |
| Intermediate | Multi-table joins, aggregations, subqueries, ambiguous phrasing (like real interview questions) | Checks correctness + basic efficiency | Moderate detail, skips obvious steps | Hints cost a "attempt" or are limited |
| Advanced | Window functions, CTEs, recursive queries, performance tuning, schema design critique | Checks correctness, efficiency, edge cases (NULLs, ties, timezones) | Minimal narration, shows raw execution plan diagrams | No hints — mimics real interview |

Level isn't just a static setting — Orchestrator can nudge it up/down based on Progress Tracker output, with user override always available.

---

## 4. Full-Stack Plan

### Frontend — Next.js
- **Learn mode**: chat with Concept Tutor, inline animations.
- **Practice mode**: Monaco editor + question panel + run button.
- **Mock Interview mode**: timed, distraction-free UI, question list, final report screen with charts (recharts) showing per-topic performance.
- **Animation renderer**: a registry of components (`JoinAnimation`, `IndexScanAnimation`, `PlanTreeAnimation`, `NormalizationAnimation`) driven by the `render_animation` payload — Framer Motion for transitions, D3 for data-bound layout (e.g. tree layout for execution plans).

### Backend — Spring Boot (Core API)
- Auth, user profiles, level state, question bank CRUD, session history, skill graph persistence.
- Orchestrates calls to the Agent Service and Sandbox Service; frontend never talks to either directly (keeps API keys and sandbox credentials server-side).

### Agent Service — FastAPI + LangGraph/ADK
- Hosts the 5 agents as a graph: Orchestrator node routes to Tutor/Interviewer/Evaluator/AnimationGen nodes, each with tool access (`run_sql`, `get_schema`, `get_user_history`).
- Stateless per-request; session state passed in from Core API each call (same pattern as your other ADK projects).

### Sandbox Service
- Same design as before: start with SQLite-per-session subprocess execution, timeout + statement whitelist, returns rows + `EXPLAIN QUERY PLAN` output.
- Exposed as a tool (`run_sql`) callable by Tutor, Interviewer (to validate reference answers), and Evaluator agents — not directly by the frontend.

### Platform DB — Postgres
- Users, skill graph, question bank, session/attempt history, mock interview reports.

---

## 5. Suggested Roadmap

1. **Phase 1** — Core API, auth, static question bank (beginner/intermediate/advanced tiers), SQLite sandbox, plain query practice (no agents yet).
2. **Phase 2** — Evaluator Agent: result-set comparison + mistake categorization (highest leverage for "worthy vs LeetCode" feel — good feedback beats a bigger question bank).
3. **Phase 3** — Concept Tutor Agent (chat-based explanations, level-aware).
4. **Phase 4** — Animation Generator Agent + fixed frontend renderer set (start with just Join + Index Scan animations — don't build all four at once).
5. **Phase 5** — Interviewer Agent + Mock Interview mode with timed sessions and report generation.
6. **Phase 6** — Progress Tracker (skill graph) wired to adaptive difficulty/orchestrator routing.
7. **Phase 7** — Polish: leaderboards, spaced repetition for weak topics, dialect variants (Postgres/MySQL differences) for advanced users.

---

## 6. Multi-Language / Multi-Dialect Support

Split into two tiers: **SQL dialects** (cheap to add, high reuse) and **MongoDB** (separate track, different mental model).

### 6.1 SQL Dialects — MySQL, Postgres, SQLite

Treat as a `dialect` parameter threaded through the whole stack, not a fork of the system.

- **Sandbox layer**: run one container/engine type per dialect behind a common interface.
  ```
  run_sql(query, dialect="postgres" | "mysql" | "sqlite")
  → { rows, explain_output, engine_specific_warnings }
  ```
  Each dialect gets its own isolated container image (official `postgres`, `mysql`, and in-process `sqlite`), same resource-limit/timeout/statement-whitelist rules as before, just parameterized by engine.

- **Agent changes** — every agent that touches SQL text or explain output needs the dialect in its prompt context:
  - **Concept Tutor**: flags syntax differences directly ("in Postgres this is `LIMIT`, in SQL Server it'd be `TOP`").
  - **Interviewer Agent**: can ask the *same* question across dialects — good advanced-tier drill ("rewrite this MySQL query for Postgres").
  - **Evaluator Agent**: compares result sets (dialect-agnostic), but efficiency notes must reference the right engine's `EXPLAIN` format (`EXPLAIN ANALYZE` in Postgres vs `EXPLAIN` in MySQL have different output shapes).
  - **Animation Generator**: execution-plan scene type needs a per-dialect parser for explain output → common step JSON. This is the main new work — one adapter per engine, but the animation renderer components on the frontend don't change.

- **UI**: a dialect switcher next to the language selector; schema/seed data generation (Schema Generator Agent) just needs to emit dialect-correct DDL (e.g. `AUTO_INCREMENT` vs `SERIAL` vs `AUTOINCREMENT`).

- **Curriculum impact**: mostly reuse the same lesson content, with dialect-specific callout boxes for syntax quirks — don't duplicate the whole curriculum per dialect.

### 6.2 MongoDB — separate track, not a "dialect"

Fundamentally different query model (JSON documents, aggregation pipelines, no joins/normalization in the traditional sense), so treat it as its own curriculum + its own agent behavior branch, sharing only the orchestrator and progress-tracking infrastructure.

- **Sandbox**: separate Mongo container per session. Safety rules differ from SQL: block `$where` (arbitrary JS execution), block admin/`runCommand` operations, cap `aggregate` pipeline stages and result size, timeout long-running pipelines.
- **Interviewer Agent**: question style shifts to aggregation-pipeline design and schema-modeling tradeoffs ("embed vs reference"), not joins.
- **Evaluator Agent**: compares result *documents* (order-insensitive by default, unless sort is explicitly tested); mistake categories are different (wrong `$group` accumulator, missing `$unwind` before `$group`, incorrect index usage for a query pattern).
- **Animation Generator**: new `scene_type`s — `aggregation_pipeline` (animate documents flowing through `$match → $group → $sort` stages), `document_scan`, `embedding_vs_reference`. Fed from Mongo's `.explain("executionStats")` output rather than `EXPLAIN`.
- **Schema Generator Agent**: generates document schemas + realistic nested/embedded sample data instead of relational DDL.

### 6.3 Top-Level UX

- Language selector at the top: **SQL family** vs **MongoDB**.
- Within SQL family: dialect selector (MySQL / Postgres / SQLite), defaulting to whichever is most common in the user's target job market.
- Progress/skill graph tracks languages as separate trees, so "SQL: advanced" and "MongoDB: beginner" can coexist per user.

### 6.4 Sequencing

Don't build all engines in parallel — it multiplies sandbox and agent-testing surface area fast.

1. Ship SQLite-only MVP (as already planned).
2. Add Postgres as the second dialect once the Evaluator/Animation adapters prove out on one real engine beyond SQLite — Postgres is the best second choice since it's closest to "interview-standard" SQL and has the richest `EXPLAIN ANALYZE` output.
3. Add MySQL third (mostly reusing the Postgres-adapter pattern).
4. MongoDB last, and only after the SQL side is stable — it's a genuinely new module, not an incremental add.

---

## 7. What Makes This Better Than GfG/LeetCode

- **Feedback depth**: mistake categorization + efficiency notes, not just pass/fail.
- **Animations grounded in real execution plans**, not static diagrams — this is genuinely rare.
- **Mock interview mode** simulates pressure and gives a report, not just a scoreboard.
- **Adaptive routing** means the platform decides what you need next, rather than you guessing which LeetCode SQL problem to pick.

Want me to design the skill graph/mastery scoring algorithm next, the LangGraph node wiring in more detail, or the animation component spec for the frontend?
