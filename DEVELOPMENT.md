# RepoVista Development Guide

## Prerequisites

Recommended:

- Node.js LTS
- pnpm 12 (the repository pins `packageManager` to pnpm 12.10.1)
- Git

Check:

```bash
node --version
pnpm --version
git --version
```

## Install

```bash
pnpm install
```

## Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Set:

```env
GITHUB_USERNAME=
GITHUB_TOKEN=
```

`GITHUB_USERNAME` is the GitHub account whose public repositories RepoVista showcases.

`GITHUB_TOKEN` is optional for public data and required if unauthenticated GitHub rate limits are too low. The token is read only in server code (`src/lib/github/`). Do not prefix it with `NEXT_PUBLIC_`. Do not import it from a Client Component. Do not log the token.

Never commit `.env.local`. Commit `.env.example` with empty values only.

## Development Server

```bash
pnpm dev
```

Open the local development URL printed by Next.js (typically `http://localhost:3000`).

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js development server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run `tsc --noEmit` with strict TypeScript |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |

## Quality Checks

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

All three should pass before a feature is considered complete.

## Where Code Goes

```text
src/app/                    routes; prefer Server Components
src/components/layout/      shell and navigation
src/components/home/        gallery UI
src/components/repository/  detail UI
src/components/ui/          shared primitives
src/lib/github/             server-side GitHub access only
src/lib/projects/           metadata, mapper, and project service
src/types/project.ts        Project and ProjectCategory
```

Imports use the `@/` alias, which maps to `src/`.

UI code calls the project service. It does not call `src/lib/github/` and it does not fetch GitHub from the browser.

## Engineering Rules

- TypeScript only.
- Strict TypeScript.
- Avoid `any`.
- Prefer Server Components.
- Add Client Components only for actual browser interactivity.
- Keep GitHub API logic outside UI components.
- Keep GitHub-specific types outside UI components.
- Search, filter, and sort the normalized `Project[]`. Do not query GitHub per keystroke.
- Keep reusable UI components small and focused.
- Do not add dependencies without a clear reason.
- Do not introduce a database, Redux, or Zustand unless a recorded decision says otherwise.

## Feature Workflow

1. Read `PLAN.md`.
2. Confirm the feature belongs in the current phase.
3. Check `ARCHITECTURE.md` and `DECISIONS.md`.
4. Implement the smallest coherent change.
5. Run lint, typecheck, and build.
6. Update `PLAN.md`.
7. Update `CHANGELOG.md` when the change is user-visible or otherwise meaningful.
8. Add a `DECISIONS.md` entry if an architectural decision changed.
9. Update `USER_GUIDE.md` when user-facing behavior changes, and `DEVELOPMENT.md` when setup changes.

## Before a Commit

```bash
git status
pnpm lint
pnpm typecheck
pnpm build
```

Review the diff:

```bash
git diff
```

Do not commit secrets, generated build output, or local environment files.
