# Contributing to RepoVista

## Before You Start

Read:

1. `README.md` — what RepoVista is and why it exists
2. `PLAN.md` — what is being built now
3. `ARCHITECTURE.md` — how data flows
4. `DECISIONS.md` — choices that are already accepted
5. `DEVELOPMENT.md` — how to run the project

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

Accepted constraints, until a new decision supersedes them:

- GitHub is the source of truth for live repository information.
- RepoVista metadata is the source of truth for presentation and storytelling.
- The UI consumes the normalized `Project` model.
- GitHub access stays server-side. Never expose `GITHUB_TOKEN` to the browser.
- No database in V1.
- No Redux or Zustand initially.
- Search and filter operate on the normalized project dataset.
- Prefer Next.js Server Components.

If a new architectural pattern is required, document it in `DECISIONS.md` before building it.

## Which Document to Update

| You changed | Update |
| --- | --- |
| Purpose, stack, or how to start | `README.md` |
| Data flow, layers, or boundaries | `ARCHITECTURE.md` |
| Scope or progress | `PLAN.md` |
| What a visitor can do | `USER_GUIDE.md` |
| Setup or engineering workflow | `DEVELOPMENT.md` |
| An architectural choice | `DECISIONS.md` |
| A meaningful release note | `CHANGELOG.md` |
| Contribution rules | `CONTRIBUTING.md` |

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
