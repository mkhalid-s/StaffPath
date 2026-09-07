# StaffPath

StaffPath is a local-first Staff Software Engineer preparation system — 65 encyclopedia chapters, 116 practice scenarios, 6 company packs, a 90-day roadmap, mock interview scorecards, and a live readiness tracker. No account or backend required. All preparation data stays in your browser.

The application is a production React + TypeScript implementation. The original dependency-free prototype is archived under `/legacy/index.html` for reference and backward-data compatibility.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite.

## Validate

```sh
npm run check      # TypeScript
npm test           # 77 Vitest tests
npm run build      # Production bundle
npm audit          # Dependency security
```

## Feature overview

### Content
- **65 encyclopedia chapters** — full Staff-level depth across Systems, Data, Reliability, AI, Architecture, and Leadership; every chapter has a problem statement, solution approach, failure scenarios, Staff discussion, core tension, mid/senior/staff level expectations, flashcards, one-minute answer, and cheat sheet
- **116 practice scenarios** across four tracks: system design (54), problem solving (22), people leadership (20), and SDLC (20) — including distributed messaging, social feed, video streaming, booking systems, AI coding assistants, and natural-language analytics
- **52 curated resources** — books (Designing Data-Intensive Applications, Staff Engineer, Accelerate, An Elegant Puzzle), engineering blogs (Netflix, Stripe, Uber, High Scalability), and operational references (Google SRE launch checklist)
- **19 Communication Gym lessons** with responsible practice guidance

### Company packs (6)
Google, Meta, Netflix, Startup, Amazon, and Atlassian — each with:
- 12–19 chapter-level interview angles drawn from the 65-chapter catalog (Amazon covers the most)
- 8 behavioral questions with LP framing where applicable
- Interview format and process overview
- 5 key signals interviewers look for
- 4 common mistakes that trip candidates up
- 4 company-specific practice scenarios

### Preparation system
- **90-day roadmap** — one-hour daily executor with timer, reflection, artifact evidence, and 13 weeks of themed mastery questions (3 per week)
- **Progressive feature disclosure** — sections unlock as you demonstrate engagement; bypass available in Settings
- **Intelligence dashboard** — what's-next engine, learning velocity, streak, heatmap, competency radar, and milestone markers
- **LifecyclePage readiness tracker** — 8 preparation stages with live evidence counts (sessions, attempts, mistakes, mocks) and 8 binary interview-readiness gates
- **CurriculumPage with progress** — 12-module coverage map linked to roadmap session completion
- **Intelligence-driven coach** — recommended actions and focus areas derived from your weakest competencies and recent mistakes, with local knowledge retrieval

### Interview preparation
- **Interview Studio** — 45-minute timed mocks across system design, AI design, behavioral, and coding; 8-dimension scorecard; spaced mistake review; last-3-mock average
- **Company pack behavioral mode** — when a pack is active, Interview Studio surfaces that company's 8 behavioral questions with key signals panel
- **Quick Actions FAB** — context-aware top-5 actions from anywhere in the app
- **Keyboard shortcuts** — ⌘1–8 for main nav; ⌘I/M/H/F/, for Interviews/Communication/Handbook/Flashcards/Settings; ⌘K search; ⌘N journal; ⌘R roadmap; ⌘? help

### Evidence and export
- **Handbook** — STAR story bank, architecture diagram studio, evidence aggregation, templates (ADR, RFC, system design, incident update, STAR, weekly reflection), and Markdown export
- **Journal** with learning, application, artifact, and quality tracking
- **Assessment** with 8-competency radar and 12-week activity heatmap
- **Versioned JSON backup/restore**

### Technical
- React 19, strict TypeScript, Vite 8, Vitest 4
- Local-first: all data in `localStorage`; no account or backend
- Legacy `staffpath-state` data auto-migrates on first load
- Connection banner with an offline action queue for journal, practice, and roadmap activity
- Installable PWA with service worker and connection status banner; paths derived from the Vite base so it works at root or under a sub-path
- Lazy-loaded Mermaid diagrams with SVG download
- Route-level code splitting and lazy loading
- GitHub Actions CI (typecheck → test → build → audit) and GitHub Pages deploy workflow
- No account or external service required

## Demo mode

Settings → "Load demo data" fills the app with a realistic week-6 snapshot (Amazon pack active, 42/90 sessions complete, practice attempts, mocks, journal entries) so you can explore all features without weeks of real use.

## Production deployment

### GitHub Pages
Enable in repo Settings → Pages → Source → GitHub Actions. The deploy workflow (`/.github/workflows/deploy.yml`) builds and publishes on every push to `main`.

### Any static host
Deploy `dist/` with SPA fallback to `index.html`. The included `_headers` file applies a restrictive baseline policy on hosts that support Netlify-style headers. HTTPS required for service-worker installation outside localhost.

> Preparation data is browser-local. Export backups from Settings before clearing site data or switching devices.

## Docs

- [Product vision](docs/PRODUCT_VISION.md)
- [Content architecture](docs/CONTENT_ARCHITECTURE.md)
- [Research sources](docs/RESEARCH_SOURCES.md)
