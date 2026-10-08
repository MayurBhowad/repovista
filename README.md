# RepoVista

> **Explore projects, not repositories.**

RepoVista is a polished, human-friendly showcase for GitHub projects. It takes technical repository data and presents it as an approachable project gallery that developers and non-developers can both enjoy.

## Goals

- Make software projects visually discoverable.
- Explain what a project does and why it exists.
- Keep live GitHub information such as stars, forks, language, topics, and update time.
- Separate technical GitHub data from curated presentation metadata.
- Provide a fast, responsive and accessible experience.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Zod
- GitHub REST API
- pnpm

## Documentation

- [Architecture](./ARCHITECTURE.md) — system design and data flow
- [Plan](./PLAN.md) — roadmap and current progress
- [User Guide](./USER_GUIDE.md) — how users experience RepoVista
- [Development](./DEVELOPMENT.md) — local development and engineering workflow
- [Decisions](./DECISIONS.md) — important decisions and their rationale
- [Changelog](./CHANGELOG.md) — project history
- [Contributing](./CONTRIBUTING.md) — contribution rules

## Development

```bash
pnpm install
pnpm dev
```

Before committing:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Status

The application foundation is in place. Further implementation should follow `PLAN.md` and the architecture defined in `ARCHITECTURE.md`.
