# Production Readiness

Validated on 2026-09-05.

## Acceptance coverage

| Capability | Implementation | Verification |
|---|---|---|
| Daily preparation | 90 typed one-hour sessions with timer, recall, learning, application, communication, reflection, and artifact capture | Content-contract and Roadmap interaction tests |
| Technical breadth | 12 modules; 65 full chapters; classic, distributed, production, cloud, security, SDLC, Staff architecture, and AI topics | Chapter-schema and content-contract tests |
| System variations | 54 system designs plus constraint variations; 22 problem-solving, 20 people, and 20 SDLC scenarios | 116-scenario contract and persistence tests |
| Nontechnical depth | 19 responsible communication lessons; leadership practice; STAR bank; eight competency areas | Communication and assessment tests |
| Interview loop | Timed prompts for four formats, eight-criterion scorecards, feedback history, mistake journal, spaced review | Interview and coach tests |
| Solutions and diagrams | Worked solutions in every chapter; rendered Mermaid diagrams; editable, versioned personal diagram studio; SVG and Markdown export | Chapter contract and production build |
| Evidence and readiness | Native journal, artifacts, attempts, stories, mocks, eight readiness gates, adaptive next-action coach | Persistence, handbook, and recommendation tests |
| Portability | Legacy progress/evidence migration, versioned local state, Markdown handbook, validated JSON backup/restore | Type checks and backup validation tests |
| Production behavior | Responsive layout, keyboard focus, reduced motion, modal Escape/focus restore, route splitting/error boundary, PWA/offline cache | Build and preview deep-link smoke test |
| Security posture | No backend or implicit data transfer, strict Mermaid mode, bounded imports, deployment security headers, zero known npm vulnerabilities | `npm audit` and static review |

## Intentional boundaries

- Data is local to one browser unless the learner exports a backup. There is no account or cloud synchronization.
- The coach retrieves curated local material and recommends practice; it does not pretend to be an omniscient evaluator. A remote AI critique adapter would require explicit consent, provider configuration, privacy controls, and separate evaluation.
- Static hosts must rewrite application routes to `index.html`. HTTPS is required for service workers outside localhost.
- Browser storage is finite. Export backups regularly, especially before clearing site data or changing devices.

## Release commands

```sh
npm ci
npm run check
npm test
npm run build
npm audit
```

Deploy the generated `dist/` directory with SPA fallback enabled.
