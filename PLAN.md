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

The `Project` domain model, GitHub access, curated metadata, mapper, and project service are implemented. The home page calls the service. `/repositories/[name]` is still a placeholder.

- [x] Define `Project` domain model (`ProjectCategory`, `ProjectGitHubInfo`, `ProjectStoryMetadata`, and `Project` in `src/types/project.ts`)
- [x] Define GitHub API types (`src/lib/github/types.ts`)
- [x] Create GitHub client (`src/lib/github/client.ts`)
- [x] Add Zod validation for GitHub responses
- [x] Create project metadata model (`src/lib/projects/metadata.ts`)
- [x] Create project mapper (`src/lib/projects/mapper.ts`)
- [x] Create project service (`src/lib/projects/service.ts`)
- [x] Load repositories for `GITHUB_USERNAME` (`src/lib/github/repositories.ts`)
- [x] Add server-side caching/revalidation
- [x] Add graceful GitHub API error handling

## Phase 2 — Visual Foundation

- [x] Establish typography
- [x] Establish light theme
- [x] Establish dark theme
- [x] Build application shell
- [x] Build desktop sidebar
- [x] Build mobile navigation
- [x] Build header
- [x] Build hero section
- [x] Build statistics section

## Phase 3 — Project Gallery

- [x] Build `RepositoryCard`
- [x] Build featured projects
- [x] Build project grid
- [x] Add technology badges
- [x] Add GitHub statistics
- [x] Add hover interactions
- [x] Add loading states
- [x] Add empty states
- [x] Add error states

## Phase 4 — Discovery

- [x] Search by project name
- [x] Search by description
- [x] Search by technology/topic
- [x] Category filtering
- [x] Sorting
- [x] URL-based search/filter state
- [x] No-results state with a clear-filters action
- [x] Unit tests for discovery logic (`pnpm test`, Node's built-in test runner)
- [ ] Responsive refinement

Search and filter run on the normalized `Project[]` from Phase 1. They do not call GitHub per keystroke. The logic lives in `src/lib/projects/discovery.ts`.

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
- [ ] Restore visible focus rings where `outline-none` is combined with `focus-visible:outline-2` (hero link, repository card links, gallery error link). In Tailwind v4, `outline-none` sets `--tw-outline-style: none`, which hides the ring.
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

**Phase 4 — Discovery**

The home gallery is in place: hero, statistics counted from the loaded projects, featured projects, repository cards, and loading, empty, and error states. The "All projects" grid has search, category filters, and sorting, kept in the URL as `search`, `category`, and `sort`. Responsive refinement beyond the discovery controls is still open. `/repositories/[name]` is still a placeholder. Pages call the project service and do not import `src/lib/github/`.

What a new developer should treat as already decided is recorded in `DECISIONS.md`. Do not reopen those choices inside a feature branch.

## Rules for Updating This Plan

When completing work:

1. Mark completed items `[x]`.
2. Mark active work `[~]`.
3. Add newly discovered work to the appropriate phase.
4. Do not silently change architecture.
5. Record significant architecture changes in `DECISIONS.md`.
