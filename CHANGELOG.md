# Changelog

All meaningful project changes are recorded here.

## [Unreleased]

### Added

- Application shell in `src/components/layout/`: sidebar, header, mobile navigation, page container, and a light/dark theme. The first visit follows the system appearance. A later choice is stored in `localStorage` under `repovista-theme`. The shell does not load projects.
- Server-side GitHub layer in `src/lib/github/`: authenticated requests, Zod-validated repository and language payloads, and normalized API errors. `GITHUB_TOKEN` stays on the server. The `server-only` package blocks Client Component imports.
- Documentation system for ongoing alignment: README, architecture, plan, user guide, development guide, decision log, changelog, and contributing guide.
- The decision log records the agreed V1 boundaries: GitHub versus RepoVista metadata, the normalized `Project` model, server-side GitHub access, no database, Server Components, local search and filter, and no Redux or Zustand.
- Next.js application scaffold with the App Router, strict TypeScript, Tailwind CSS, ESLint, shadcn/ui, and the `@/*` import alias.
- Project metadata layer in `src/lib/projects/`: a curated catalog (title, description, category, technologies, featured, image, nested story, and order), a mapper from a validated GitHub repository plus that catalog into `Project`, and a server-only project service. Repositories without metadata still become projects. Curated description and technologies win over the GitHub description and topics.
- `Project` domain model in `src/types/project.ts`: `ProjectCategory`, normalized `ProjectGitHubInfo`, `ProjectStoryMetadata`, and the composed `Project` type shared by the server and UI.
- Placeholder routes for `/` and `/repositories/[name]`.

### Changed

- Light and dark color tokens now use a warm paper background and a spruce accent, with Geist for the type scale in the shell.
- `Project` now includes `technologies`. The project service is the data API for pages. GitHub response types stay in `src/lib/github/`.

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
