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

The `Project` domain model, GitHub access, curated metadata, mapper, and project service are implemented. Pages are still placeholders and do not call the service yet.

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

**Phase 2 — Visual Foundation**

Phase 1 is complete. The running app still shows a placeholder home page and a placeholder repository page. GitHub access, curated metadata, the mapper, and the project service are in place. Next, build the visual foundation. Pages should call the project service and should not import `src/lib/github/`.

What a new developer should treat as already decided is recorded in `DECISIONS.md`. Do not reopen those choices inside a feature branch.

## Rules for Updating This Plan

When completing work:

1. Mark completed items `[x]`.
2. Mark active work `[~]`.
3. Add newly discovered work to the appropriate phase.
4. Do not silently change architecture.
5. Record significant architecture changes in `DECISIONS.md`.
