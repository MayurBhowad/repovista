# RepoVista Plan

> This is the master execution plan. Update this file whenever project scope or implementation status changes.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete
- `[-]` Deferred

## Phase 0 — Foundation

- [x] Create GitHub repository
- [x] Initialize Next.js + TypeScript + App Router
- [x] Configure Tailwind CSS
- [x] Configure shadcn/ui
- [x] Configure ESLint
- [x] Add strict TypeScript
- [x] Add the documentation system (`README`, `ARCHITECTURE`, `PLAN`, `USER_GUIDE`, `DEVELOPMENT`, `DECISIONS`, `CHANGELOG`, `CONTRIBUTING`)
- [x] Verify `pnpm lint`
- [x] Verify `pnpm typecheck`
- [x] Verify `pnpm build`

## Phase 1 — Domain and Data Architecture

Scaffolding is in the tree. Behavior is not implemented yet, except for the initial `Project` type.

- [~] Define `Project` domain model (`src/types/project.ts` has the initial type; storytelling fields from `ARCHITECTURE.md` are still missing)
- [ ] Define GitHub API types (`src/lib/github/types.ts` is a placeholder)
- [ ] Create GitHub client (`src/lib/github/client.ts` is a placeholder)
- [ ] Add Zod validation for GitHub responses (Zod is installed and unused)
- [ ] Create project metadata model (`src/lib/projects/metadata.ts` is a placeholder)
- [ ] Create project mapper (`src/lib/projects/mapper.ts` is a placeholder)
- [ ] Create project service (`src/lib/projects/service.ts` is a placeholder)
- [ ] Load repositories for `GITHUB_USERNAME` (`src/lib/github/repositories.ts` is a placeholder)
- [ ] Add server-side caching/revalidation
- [ ] Add graceful GitHub API error handling

## Phase 2 — Visual Foundation

- [ ] Establish typography
- [ ] Establish light theme
- [ ] Establish dark theme
- [ ] Build application shell
- [ ] Build desktop sidebar
- [ ] Build mobile navigation
- [ ] Build header
- [ ] Build hero section
- [ ] Build statistics section

## Phase 3 — Project Gallery

- [ ] Build `RepositoryCard`
- [ ] Build featured projects
- [ ] Build project grid
- [ ] Add technology badges
- [ ] Add GitHub statistics
- [ ] Add hover interactions
- [ ] Add loading states
- [ ] Add empty states
- [ ] Add error states

## Phase 4 — Discovery

- [ ] Search by project name
- [ ] Search by description
- [ ] Search by technology/topic
- [ ] Category filtering
- [ ] Sorting
- [ ] URL-based search/filter state
- [ ] Responsive refinement

Search and filter run on the normalized `Project[]` from Phase 1. They do not call GitHub per keystroke.

## Phase 5 — Project Detail

- [ ] Build `/repositories/[name]` (the route exists and renders a placeholder)
- [ ] Project header
- [ ] Project story
- [ ] Technology section
- [ ] GitHub statistics
- [ ] Screenshots
- [ ] GitHub link
- [ ] Roadmap section where applicable

## Phase 6 — Quality

- [ ] Accessibility audit
- [ ] Keyboard navigation
- [ ] Reduced-motion support
- [ ] Mobile testing
- [ ] Performance review
- [ ] Error boundary review
- [ ] Metadata/SEO
- [ ] Production build
- [ ] Vercel deployment

## Phase 7 — Future / Only If Needed

- [-] Database
- [-] GitHub webhooks
- [-] Authentication
- [-] Analytics
- [-] Multiple GitHub profiles
- [-] Admin/project editor
- [-] CMS

## Current Focus

**Phase 1 — Domain and Data Architecture**

Phase 0 is complete. The running app shows a placeholder home page and a placeholder repository page. Finish the project service, mapper, metadata, and GitHub client before building gallery UI.

What a new developer should treat as already decided is recorded in `DECISIONS.md`. Do not reopen those choices inside a feature branch.

## Rules for Updating This Plan

When completing work:

1. Mark completed items `[x]`.
2. Mark active work `[~]`.
3. Add newly discovered work to the appropriate phase.
4. Do not silently change architecture.
5. Record significant architecture changes in `DECISIONS.md`.
