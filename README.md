# StaffPath

StaffPath is a local-first Staff Software Engineer preparation system covering technical depth, leadership, communication, deliberate practice, interview readiness, and long-lived career evidence.

The application is a production React + TypeScript implementation. The original dependency-free prototype is archived under `/legacy/index.html` for reference and backward-data verification.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite.

## Validate

```sh
npm run check
npm test
npm run build
npm audit
```

## Current architecture

- React and strict TypeScript
- Vite production build
- Local-first browser persistence compatible with the original `staffpath-state` data
- Feature-oriented source layout
- Searchable typed encyclopedia chapters
- Lazy-loaded Mermaid diagrams with SVG export
- Route-level code splitting, installable PWA metadata, and offline runtime cache
- Vitest and Testing Library
- No account or backend required

## Product scope

The complete product direction is documented in:

- [Product vision](docs/PRODUCT_VISION.md)
- [Content architecture](docs/CONTENT_ARCHITECTURE.md)
- [Research sources](docs/RESEARCH_SOURCES.md)

## Implemented product lifecycle

- Responsive application shell and custom minimal client router
- Automatic migration of legacy roadmap progress
- Preparation lifecycle view
- Native 90-day, one-hour daily executor with timer, reflection, communication, and artifact evidence
- Searchable curriculum map and engineering encyclopedia
- Complete chapter schema with worked solutions, diagrams, production concerns, Staff discussion, flashcards, and interview answers
- SVG architecture-diagram rendering and download
- 21 production-quality encyclopedia chapters spanning foundations, distributed systems, production, architecture, AI, and leadership
- 47-scenario Practice Lab across system design, problem solving, people leadership, and SDLC
- Four-format mock interview scorecards and spaced mistake review
- Eight-area evidence-based assessment and readiness gates
- Fourteen-lesson Communication Gym with responsible practice guidance
- Native journal, reusable STAR story bank, evidence aggregation, handbook Markdown export
- Evidence-aware local coach with curated knowledge and scenario retrieval
- Versioned JSON backup/restore and zero known npm audit vulnerabilities

## Production deployment

Deploy `dist/` to a static host with SPA fallback to `index.html`. The included `_headers` file applies a restrictive baseline policy on hosts that support Netlify-style headers. HTTPS is required for service-worker installation outside localhost. Because preparation data is browser-local, learners should export backups regularly and before clearing site data.
