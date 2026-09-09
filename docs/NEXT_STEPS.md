# Remaining work — plan for review

**Status:** proposed, not started  
**Date:** 2026-09-09  
**Audience:** review this before any more implementation.

This is the work that is still left after dark theme, IBM Plex Sans, curriculum↔roadmap linking, and the Company path (`/pack`). It is a sequenced plan, not a commitment to ship every item.

StaffPath already has a strong encyclopedia, a 90-session roadmap, practice labs, mocks, and local evidence. The remaining gap is **guidance**: the product still asks the learner to hold too many parallel models in their head.

---

## Product principles (do not reopen unless we decide to)

1. **Local-first.** No account, no backend, no implicit data transfer. Backup/restore stays the sync story.
2. **Company packs are overlays**, not a second curriculum. Core map stays company-agnostic.
3. **The coach is not an evaluator.** Scorecards are self-scored. Remote AI critique would need explicit consent and is out of this plan.
4. **Completion is evidence-based.** Reading a chapter is not mastery.

---

## Already shipped on this branch (do not redo)

- Semantic dark/light tokens and theme persistence (`src/lib/theme.ts`, `src/styles/global.css`).
- IBM Plex Sans as the UI typeface.
- Curriculum modules carry `intent`, `chapterIds`, `roadmapWeek`, `practiceTrack` (`src/data/curriculum.ts`).
- Deep links: `/encyclopedia?chapter=`, `/roadmap?week=`, `/practice?track=&packScenario=`.
- Company path page at `/pack`; Practice Lab can run a pack scenario as the active prompt.
- Content-contract tests that every curriculum `chapterId` exists and roadmap weeks are 1–12.

**Honest leftover from that work:** two calendars are *linked*, not merged. A learner can still be on “curriculum week 3” and “roadmap week 7” at the same time.

---

## Decision we should make first

**Dual-track vs one canonical week.**

| Option | What it means | Cost | Recommendation |
|---|---|---|---|
| **A. Dual-track, one “this week” object** | Keep two data sources. Surface a single card: knowledge chapters + today’s roadmap session + optional pack overlay. | Small. Mostly dashboard, coach, onboarding. | **Default. Ship this.** |
| **B. Merge into one 12-week program** | Rewrite roadmap sessions to match curriculum weeks (or vice versa). | Large content rewrite, migration of existing `state.roadmap` keys. | Only if dual-track still confuses after A. |
| **C. Hide curriculum** | Roadmap is the only calendar; encyclopedia is search. | Throws away the map we just built. | Reject. |

**Ask on review:** confirm Option A. Everything in P0 assumes A.

---

## P0 — Close the guided loop

Highest leverage. New users still do not land on a path after onboarding.

### P0.1 Onboarding actually starts a plan

**Problem:** `OnboardingGuide` computes `suggestedStartingWeek` and lists recommendations, then `finishOnboarding` only sets `onboardingComplete`. It does not persist a week cursor, does not pick a company, and does not navigate anywhere. Recommendation cards are dead text (`to` is unused).

**Do:**

- Persist `suggestedStartingWeek` onto profile or a `planCursor` (roadmap week + curriculum module).
- Make each recommendation a real link (chapters already support `?chapter=`).
- After “Start preparing”, land on Today or Curriculum week N — not a blank dashboard.
- Optional last onboarding step: company pack `none` vs a named pack. Default `none`.

**Files:** `src/features/onboarding/OnboardingGuide.tsx`, `src/domain/appState.ts` / `src/lib/appStore.ts`, `src/lib/recommendations.ts`.

**Accept:** finishing onboarding with a weak assessment opens week 1 chapters + roadmap week 1; a strong assessment opens week 7 (current heuristic). Tests cover persist + navigation.

### P0.2 Unlock order matches the map

**Problem:** Curriculum unlocks after **1 roadmap session**. Company path unlocks at **onboarding**. Encyclopedia unlocks at onboarding. A new user can pick Google before they have seen the map, and cannot open Curriculum until they complete a session they do not yet understand.

**Do:**

- Unlock Curriculum at onboarding (same gate as encyclopedia).
- Keep Practice Lab at 2 sessions, Interview Studio at 7, Resources at 5.
- Leave Company path at onboarding, but copy on Today / Curriculum should say it is optional.

**Files:** `src/lib/featureUnlocks.ts`, `src/lib/featureUnlocks.test.ts`.

**Accept:** a fresh onboarded profile can open `/curriculum` without completing a session.

### P0.3 Coach and Today speak one week

**Problem:** Coach (`src/lib/intelligence.ts`) recommends sessions and chapters but never “you are on curriculum week N / roadmap week M”. Today shows a pack banner and next unlock, not the Read → Practice → Apply loop.

**Do:**

- Derive `currentStudyWeek` from roadmap progress (first incomplete week) or the persisted onboarding cursor.
- Show one “this week” card on Today: chapter list, practice track, next roadmap session, pack overlay if any.
- Coach copy includes that week; chapter links use `?chapter=`.

**Files:** `src/features/dashboard/DashboardPage.tsx`, Coach page + `intelligence.ts`, possibly a small `src/lib/studyWeek.ts`.

**Accept:** completing all sessions in week 1 advances the card to week 2 without a second UI concept.

### P0.4 Lifecycle is a reference, not a third calendar

**Problem:** `/lifecycle` (Discover → Operate) is a third narrative competing with Curriculum + Roadmap.

**Do:** keep the page. Demote it in nav (REFERENCE, not PREPARE) or link it from Curriculum as “how work actually ships”. Do not add a fourth progress bar.

**Files:** `src/app/AppShell.tsx`, maybe `LifecyclePage.tsx` intro copy.

---

## P1 — Make overlays and recommendations actually fire

### P1.1 Interview Studio from Company path

Pack page links to `/interviews` with no query. Behavioral pool exists on the pack. Wire `?packBehavioral=` (or similar) the same way Practice Lab got `packScenario`.

### P1.2 Assessment week is not theater

`suggestedStartingWeek` exists and is tested, then discarded. After P0.1 persist it, also seed the roadmap “current week” view so the learner does not start at session 1 when the heuristic said week 7.

**Migration:** existing users keep their completed sessions; cursor is `max(suggested, firstIncompleteWeek)`.

### P1.3 Related topics as IDs

Encyclopedia `relatedTopics` are title strings. Fuzzy matching is brittle. Store chapter IDs (or resolve titles in a contract test) and render links.

### P1.4 Resources attached to weeks

Resources unlock at 5 sessions and are a separate library. Attach 1–3 resources per curriculum module (optional field on `curriculum.ts`). No new host.

---

## P2 — Visual and information architecture debt

Not a redesign. Finish the readability pass.

- Remaining 8–10px labels (progress, chips, eyebrows). Floor at 12px for anything a learner must read.
- Contrast on hero stats, inactive chips, muted-on-green (theme review already flagged this).
- Sidebar: ~15 items. Collapse Evidence (Skills / Handbook / Journal) until there is evidence. Keep PREPARE: Today, Roadmap, Curriculum, Company path, Coach.
- `PRODUCTION_READINESS.md` still dated 2026-09-05 and still describes an older IA. Update the table after P0, not before.

**Files:** `src/styles/global.css`, `AppShell.tsx`.

---

## P3 — Content honesty vs `CONTENT_ARCHITECTURE.md`

Do **not** bulk-write chapters to match every bullet in the architecture doc.

**Audit first:** map architecture bullets → existing 65 chapters. Fill only holes that Staff interviews actually hit and the encyclopedia currently skips (likely thin: speaking/presence drills, some AI evals, some FinOps). Skip vanity volume.

**Coding:** vision says coding is “only as needed”. Interview Studio coding prompts are not a real editor. Either label them as design-a-solution prompts or add a later optional sandbox. Not P0.

---

## P4 — Production / ops (intentional freeze)

| Item | Action |
|---|---|
| Multi-device sync | Out of scope. Export/import is the product. |
| Remote AI coach | Out of scope without a consent + provider design. |
| PWA / offline | Exists; re-smoke after P0 if service worker still caches old routes (`/pack`). |
| README test count | Keep in sync when tests change (currently drifted historically). |
| `npm audit` / CI | No change unless we add deps. |

---

## Suggested sequence if we implement

1. Review this doc. Confirm Option A (dual-track + one “this week” card).
2. **P0.2** unlock Curriculum at onboarding (smallest, unblocks the rest).
3. **P0.1** persist week + live recommendation links.
4. **P0.3** Today / Coach “this week” card.
5. **P0.4** Lifecycle nav demotion.
6. Then P1 in order 1.2 → 1.1 → 1.3 → 1.4.
7. P2 in parallel with P0 if contrast bugs show up in review.
8. P3 audit only after the loop is followable; otherwise more content makes the maze worse.

Stop after P0 if the loop feels usable. P1–P3 are polish on a path that already exists.

---

## Explicitly not in this plan

- Backend, accounts, cloud sync.
- Replacing IBM Plex or redoing the forest palette.
- Merging roadmap JSON with curriculum modules (Option B).
- Human mock interviewer or model-graded rubrics.
- New company packs.
- Collapsing Encyclopedia into Curriculum (search stays).

---

## Review checklist

- [ ] Option A confirmed (or B/C chosen instead).
- [ ] Company pack remains optional overlay (yes / no).
- [ ] Curriculum unlocks at onboarding (yes / keep 1-session gate).
- [ ] Persist suggested week even if it skips early roadmap sessions (yes / always start at week 1, only *recommend* later weeks).
- [ ] Lifecycle stays as a page (yes / hide behind a link).
- [ ] Implement P0 on this PR vs a follow-up PR.

---

## Success after P0

A new learner can: finish onboarding → land on a week → open a chapter → run the matching practice prompt → complete the matching roadmap session → see Coach talk about that same week. Company path is a later overlay, not the front door.
