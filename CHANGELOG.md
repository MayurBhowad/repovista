# Changelog

All meaningful project changes are recorded here.

## [Unreleased]

### Added

- Server-side GitHub layer in `src/lib/github/`: authenticated requests, Zod-validated repository and language payloads, and normalized API errors. `GITHUB_TOKEN` stays on the server. The `server-only` package blocks Client Component imports.
- Documentation system for ongoing alignment: README, architecture, plan, user guide, development guide, decision log, changelog, and contributing guide.
- The decision log records the agreed V1 boundaries: GitHub versus RepoVista metadata, the normalized `Project` model, server-side GitHub access, no database, Server Components, local search and filter, and no Redux or Zustand.
- Next.js application scaffold with the App Router, strict TypeScript, Tailwind CSS, ESLint, shadcn/ui, and the `@/*` import alias.
- Placeholder modules for the GitHub client, repository queries, project metadata, mapper, and project service.
- `Project` domain model in `src/types/project.ts`: `ProjectCategory`, normalized `ProjectGitHubInfo`, `ProjectStoryMetadata`, and the composed `Project` type shared by the server and UI.
- Placeholder routes for `/` and `/repositories/[name]`.

### Changed

- The plan now distinguishes Phase 1 scaffolding from implemented behavior. The `Project` domain model is defined. GitHub and project modules are still placeholders.

### Fixed

Nothing yet.

## Changelog Rules

Record changes that are meaningful to the project, especially:

- user-visible features
- architecture changes
- important bug fixes
- dependency changes
- deployment changes

Do not record every tiny refactor.
