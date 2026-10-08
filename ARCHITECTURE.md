# RepoVista Architecture

## 1. Architectural Principle

RepoVista has two sources of truth:

1. **GitHub** owns live repository facts.
2. **RepoVista metadata** owns presentation and storytelling.

The UI consumes a normalized `Project` domain model and should never depend directly on raw GitHub API responses.

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

## 3. Layers

### GitHub layer

Location:

```text
src/lib/github/
```

Responsibilities:

- Communicate with GitHub REST API.
- Authenticate server-side when a token is available.
- Validate external data.
- Hide GitHub-specific response structures from the rest of the application.

### Project layer

Location:

```text
src/lib/projects/
```

Responsibilities:

- Store curated metadata.
- Map GitHub repositories into RepoVista projects.
- Provide project-oriented service functions.
- Apply defaults when metadata is missing.

### Domain layer

Location:

```text
src/types/
```

Contains stable application-level types such as `Project` and `ProjectCategory`.

### UI layer

Location:

```text
src/components/
```

Responsibilities:

- Render domain data.
- Handle presentation and interaction.
- Never call GitHub directly.

## 4. Server/Client Boundary

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

Client Components should only be introduced where browser interactivity is required, such as search/filter controls, theme controls, or animations.

## 5. Search, Filter and Sort

For the initial version, repositories are fetched server-side and normalized into a manageable `Project[]`.

Search/filter/sort should operate on that dataset rather than making a GitHub request for every keystroke.

URL search parameters should represent shareable UI state where useful:

```text
/?search=ai
/?category=AI
/?category=AI&search=document
```

## 6. Repository Detail

Route:

```text
/repositories/[name]
```

The detail page should retrieve the requested repository and merge it with RepoVista metadata.

The detail page is a project case-study experience, not a GitHub clone.

## 7. Caching

GitHub responses should be cached/revalidated using Next.js server-side mechanisms.

Do not request GitHub data on every browser interaction.

## 8. Security

`GITHUB_TOKEN` must remain server-side.

Never expose it as:

```text
NEXT_PUBLIC_GITHUB_TOKEN
```

Never place secrets in source control.

## 9. Deliberate Non-Goals for V1

Do not add:

- Database
- Prisma
- Redux
- Zustand
- React Query
- Authentication
- GitHub webhooks
- Multi-user accounts
- Complex backend services

These can be reconsidered only when a real requirement appears.
