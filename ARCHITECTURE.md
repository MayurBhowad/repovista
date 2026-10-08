# RepoVista Architecture

## 1. Architectural Principle

RepoVista has two sources of truth:

1. **GitHub** owns live repository facts.
2. **RepoVista metadata** owns presentation and storytelling.

The UI consumes a normalized `Project` domain model. UI code must not depend on raw GitHub API responses.

```text
GitHub API
    |
    v
GitHub Client
    |
    v
Repository Data ----+
                    |
RepoVista Metadata -+--> Mapper --> Project Service --> Project[]
                                                       |
                                      +----------------+----------------+
                                      |                                 |
                                      v                                 v
                                  Home Page                         Detail Page
```

## 2. Data Ownership

### GitHub owns

- Repository name
- GitHub URL
- Homepage URL
- Stars
- Forks
- Primary language
- Topics
- Updated timestamp
- Public repository description

### RepoVista owns

- Human-friendly title
- Human-friendly description
- Category
- Featured status
- Project image
- Project story
- Problem
- Solution
- Learning
- Presentation order

When both sources provide a description, the normalized `Project` uses the RepoVista description. The GitHub description is the fallback when curated copy is missing.

## 3. Normalized Project

Server Components receive `Project` values from the project service. The agreed model combines both sources of truth:

| Field | Source |
| --- | --- |
| Repository name, URL, homepage, language, topics, stars, forks, updated time | GitHub |
| Human-friendly title and description | RepoVista, with GitHub description as fallback |
| Category, featured, image, story, problem, solution, learning, order | RepoVista |

`ProjectCategory` is one of: `AI`, `Backend`, `Frontend`, `Database`, `DevTools`, `Desktop`, `Learning`.

The type in `src/types/project.ts` is the start of this model. It currently includes name, description, category, repository URL, homepage URL, language, topics, stars, forks, and updated time. Storytelling fields (title override, featured, image, story, problem, solution, learning, and order) are part of the agreed model and are not on the type yet. Add them in the project layer. Do not invent a second model in the UI.

## 4. Layers

### GitHub layer

Location:

```text
src/lib/github/
  client.ts         server-side HTTP client
  repositories.ts   repository queries for GITHUB_USERNAME
  types.ts          GitHub response types, kept out of the UI
```

Responsibilities:

- Communicate with the GitHub REST API.
- Authenticate server-side when `GITHUB_TOKEN` is available.
- Validate external data.
- Hide GitHub-specific response structures from the rest of the application.

These modules are placeholders. They must not be called from components.

### Project layer

Location:

```text
src/lib/projects/
  metadata.ts   curated presentation data
  mapper.ts     GitHub data + metadata -> Project
  service.ts    functions Server Components call
```

Responsibilities:

- Store curated metadata.
- Map GitHub repositories into RepoVista projects.
- Provide project-oriented service functions.
- Apply defaults when metadata is missing.

These modules are placeholders. The service is the only project API the UI should use.

### Domain layer

Location:

```text
src/types/project.ts
```

Contains the application-level `Project` and `ProjectCategory` types.

### UI layer

Location:

```text
src/app/                         routes (Server Components by default)
src/components/layout/           shell, navigation, header
src/components/home/             gallery, hero, statistics
src/components/repository/       project detail
src/components/ui/               shared primitives
```

Current routes:

- `/` — home placeholder in `src/app/page.tsx`
- `/repositories/[name]` — detail placeholder in `src/app/repositories/[name]/page.tsx`

Responsibilities:

- Render domain data.
- Handle presentation and interaction.
- Never call GitHub directly.

## 5. Server/Client Boundary

Prefer Server Components.

Initial data flow:

```text
Next.js Server Component
        |
        v
Project Service
        |
        +--> GitHub Client
        |
        +--> Project Metadata
        |
        v
Normalized Project[]
        |
        v
UI
```

Client Components are only for browser interactivity, such as search and filter controls, theme controls, or animation. They receive `Project` data that a Server Component already loaded.

## 6. Search, Filter, and Sort

Repositories are fetched server-side and normalized into `Project[]`.

Search, filter, and sort operate on that dataset. They do not call GitHub on each keystroke.

URL search parameters represent shareable UI state:

```text
/?search=ai
/?category=AI
/?category=AI&search=document
```

## 7. Repository Detail

Route:

```text
/repositories/[name]
```

The detail page loads the requested repository and merges it with RepoVista metadata through the project service.

The page is a project case study. It is not a GitHub repository clone.

## 8. Caching

GitHub responses are cached and revalidated with Next.js server-side mechanisms.

The browser does not request GitHub data on each interaction.

## 9. Security

`GITHUB_TOKEN` and `GITHUB_USERNAME` are read on the server from the environment.

The token must never be exposed as `NEXT_PUBLIC_GITHUB_TOKEN`, passed to a Client Component, or committed. `.env.local` stays untracked. `.env.example` lists the variable names only.

Treat GitHub responses as untrusted input. Validate them before they become a `Project`.

## 10. Deliberate Non-Goals for V1

Do not add:

- A database
- Prisma
- Redux
- Zustand
- React Query
- Authentication
- GitHub webhooks
- Multi-user accounts
- A separate backend service

Reconsider one of these only when a real requirement appears, and record that change in `DECISIONS.md` before implementing it.
