# QueryForge — Frontend (Next.js)

## Structure
- `app/` — routes: `learn/`, `practice/`, `interview/`, `dashboard/`
- `components/` — `QueryEditor`, `JoinAnimation`, `IndexScanAnimation`, `PlanTreeAnimation`, `AggregationPipelineAnimation`, `ChatPanel`, `InterviewReport`
- `lib/` — API client (`api.ts`), animation renderer registry (`animationRegistry.ts`), types shared with backend DTOs
- `public/` — static assets

## Talks to
- Core API (Spring Boot) only — never calls the Agent Service or Sandbox Service directly.

## Setup
```bash
npm install
npm run dev
```
