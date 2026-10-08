# Contributing to RepoVista

## Before You Start

Read:

1. `README.md`
2. `PLAN.md`
3. `ARCHITECTURE.md`
4. `DEVELOPMENT.md`
5. `DECISIONS.md`

## Principles

RepoVista should remain:

- simple
- fast
- accessible
- visually polished
- strongly typed
- understandable

## Code

Use TypeScript.

Avoid `any`.

Prefer composition over large components.

Do not add a dependency when a small local solution is sufficient.

## Architecture

UI components must not directly call GitHub.

Use:

```text
UI
  ↓
Project Service
  ↓
GitHub Client / Metadata
```

If a new architectural pattern is required, document it in `DECISIONS.md`.

## Pull Requests

A pull request should explain:

- What changed?
- Why was it needed?
- How was it tested?

Before opening a PR:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Documentation

Update documentation when behavior, architecture, setup, or project scope changes.
