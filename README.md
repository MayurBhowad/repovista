# RepoVista

> **Explore projects, not repositories.**

RepoVista is a polished, human-friendly showcase for GitHub projects. It turns technical repository data into an approachable project gallery that developers and non-developers can both enjoy.

GitHub is an excellent place to store code. It is a poor place to explain a project to someone who does not already know the repository. RepoVista exists to answer what a project is, why it was built, and why it matters, while still showing live facts such as stars, forks, language, topics, and last update.

## Goals

- Make software projects visually discoverable.
- Explain what a project does and why it exists.
- Keep live GitHub information such as stars, forks, language, topics, and update time.
- Separate technical GitHub data from curated presentation metadata.
- Provide a fast, responsive, and accessible experience.

## How the application is shaped

Two sources of truth stay separate:

- **GitHub** owns live repository information.
- **RepoVista metadata** owns presentation and storytelling.

The UI consumes a normalized `Project` model. It does not read raw GitHub responses. GitHub access stays on the server. Version 1 has no database and no Redux or Zustand. Search and filter run on the normalized project dataset. Prefer Next.js Server Components.

The full design is in [Architecture](./ARCHITECTURE.md). The reasons are in [Decisions](./DECISIONS.md).

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Zod
- GitHub REST API
- pnpm

## Documentation

These files are the documentation system. Update the file that owns the change so later work stays aligned.

| File | Owns |
| --- | --- |
| [README](./README.md) | What RepoVista is, why it exists, and how to start |
| [Architecture](./ARCHITECTURE.md) | Data flow, layers, and boundaries |
| [Plan](./PLAN.md) | What is being built, and current progress |
| [User Guide](./USER_GUIDE.md) | How people experience RepoVista |
| [Development](./DEVELOPMENT.md) | How to run and change the project |
| [Decisions](./DECISIONS.md) | Architectural decisions and why they were made |
| [Changelog](./CHANGELOG.md) | Meaningful project history |
| [Contributing](./CONTRIBUTING.md) | Contribution rules |

## Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `GITHUB_USERNAME` and, when you have one, `GITHUB_TOKEN` in `.env.local`. The token stays server-side. Never commit `.env.local`, and never name the token `NEXT_PUBLIC_GITHUB_TOKEN`.

Before committing:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Status

Phase 0 (application foundation) is complete. Current work is Phase 1: the domain and data path. Placeholder modules exist under `src/lib/github/` and `src/lib/projects/`. The home page and `/repositories/[name]` are placeholders. Follow [Plan](./PLAN.md) and do not skip ahead of the current phase.
