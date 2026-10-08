# RepoVista Development Guide

## Prerequisites

Recommended:

- Node.js LTS
- pnpm
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

Never commit `.env.local`.

## Development Server

```bash
pnpm dev
```

Open the local development URL shown by Next.js.

## Quality Checks

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

All three should pass before a feature is considered complete.

## Engineering Rules

- TypeScript only.
- Strict TypeScript.
- Avoid `any`.
- Prefer Server Components.
- Add Client Components only for actual browser interactivity.
- Keep GitHub API logic outside UI components.
- Keep GitHub-specific types outside UI components.
- Keep reusable UI components small and focused.
- Do not add dependencies without a clear reason.
- Do not introduce a database unless a real requirement exists.

## Feature Workflow

1. Read `PLAN.md`.
2. Confirm the feature belongs in the current phase.
3. Check `ARCHITECTURE.md`.
4. Implement the smallest coherent change.
5. Run lint/typecheck/build.
6. Update `PLAN.md`.
7. Update `CHANGELOG.md` when user-visible or meaningful.
8. Add a `DECISIONS.md` entry if an architectural decision changed.

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
