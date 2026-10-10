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

`ProjectCategory` is one of: `AI`, `Backend`, `Frontend`, `Database`, `DevTools`, `Desktop`, `Learning`. The allowed values live in `PROJECT_CATEGORIES` in `src/types/project.ts`.

`Project` is `ProjectGitHubInfo & ProjectStoryMetadata`:

| Type | Fields |
| --- | --- |
| `ProjectGitHubInfo` | `name`, `repositoryUrl`, `homepageUrl`, `language`, `topics`, `stars`, `forks`, `updatedAt` |
| `ProjectStoryMetadata` | `title`, `description`, `category`, `featured`, `image`, `story`, `problem`, `solution`, `learning`, `order` |

`description` on `Project` is already resolved: RepoVista copy when it exists, otherwise the public GitHub description. These types are the only project model the UI imports. Do not invent a second model in components, and do not import GitHub API response types outside `src/lib/github/`.

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
- Validate external data with Zod.
- Normalize failures as `GitHubApiError`.
- Hide GitHub-specific response structures from the rest of the application.

These modules must not be called from components. `server-only` makes a Client Component import fail the build.

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

Contains `ProjectCategory`, `ProjectGitHubInfo`, `ProjectStoryMetadata`, and the composed `Project` type. Server and UI layers both import from here.

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

GitHub responses are cached and revalidated with Next.js server-side mechanisms. The client revalidates successful responses after one hour and tags them `github`. Redirects are not followed, so the bearer token stays on `api.github.com`.

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
