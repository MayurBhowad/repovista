# RepoVista Architecture Decisions

> Record decisions that would otherwise be forgotten. Prefer explaining WHY over documenting obvious implementation details.

## Index

| Decision | Status | Summary |
| --- | --- | --- |
| [001](#decision-001--github--repovista-metadata) | Accepted | GitHub owns live facts. RepoVista metadata owns presentation. |
| [002](#decision-002--normalized-project-domain-model) | Accepted | The UI consumes `Project`, not raw GitHub payloads. |
| [003](#decision-003--server-side-github-access) | Accepted | GitHub access stays on the server. |
| [004](#decision-004--no-database-in-v1) | Accepted | No database in V1. |
| [005](#decision-005--prefer-server-components) | Accepted | Load the initial project data in Server Components. |
| [006](#decision-006--searchfilter-locally) | Accepted | Search, filter, and sort the normalized dataset. |
| [007](#decision-007--no-reduxzustand-initially) | Accepted | No Redux or Zustand until a real need appears. |

## Decision 001 — GitHub + RepoVista Metadata

**Status:** Accepted

**Decision:** Use GitHub as the source of truth for live repository facts and a local RepoVista metadata layer for presentation and storytelling.

**Why:**

GitHub knows technical repository facts, but it does not provide enough human-friendly storytelling for the intended experience.

RepoVista therefore owns:

- titles
- descriptions written for people
- categories
- featured status
- project stories
- images
- presentation order

GitHub owns:

- stars
- forks
- language
- topics
- repository URL
- homepage URL
- update information
- the public repository description, used when curated copy is absent

**Consequences:** Live numbers can change without editing RepoVista content. Storytelling can change without forking the repository's GitHub description. The mapper is responsible for combining the two.

---

## Decision 002 — Normalized Project Domain Model

**Status:** Accepted

**Decision:** UI components consume a RepoVista `Project` model rather than raw GitHub API responses.

**Why:**

This isolates the UI from GitHub's API structure and allows the data source to change later without rewriting the UI.

**Consequences:** GitHub response types stay in `src/lib/github/`. Components import `Project` from `src/types/project.ts` or receive it as props. Missing storytelling fields are added to that model, not modeled ad hoc in components.

---

## Decision 003 — Server-Side GitHub Access

**Status:** Accepted

**Decision:** GitHub API access is server-side.

**Why:**

- Protect GitHub credentials.
- Avoid exposing tokens.
- Reduce unnecessary browser-to-GitHub requests.
- Allow Next.js caching and revalidation.

**Consequences:** `GITHUB_TOKEN` is never `NEXT_PUBLIC_GITHUB_TOKEN`. Client Components do not receive the token and do not call the GitHub API.

---

## Decision 004 — No Database in V1

**Status:** Accepted

**Decision:** Do not introduce a database initially.

**Why:**

RepoVista is initially a personal project showcase with a small amount of curated metadata. A database would add operational complexity without solving an immediate problem.

Reconsider when metadata requires runtime editing, multiple users, or significant content volume.

**Consequences:** Curated metadata lives in the repository, in the project layer. There is no Prisma schema and no hosted database to migrate.

---

## Decision 005 — Prefer Server Components

**Status:** Accepted

**Decision:** Initial repository data is loaded through Server Components and the project service. Do not add a client-side data library for that load.

**Why:**

The initial use case does not require a client-side data synchronization library. Server Components keep the architecture smaller and send less JavaScript to the browser.

**Consequences:** Pages under `src/app/` call the project service. Client Components are introduced only for interaction such as search controls, theme, or animation, and they receive data that was already loaded.

---

## Decision 006 — Search/Filter Locally

**Status:** Accepted

**Decision:** Search, filtering, and sorting operate on the normalized project dataset instead of querying GitHub on every interaction.

**Why:**

The expected repository count is small enough for this to be efficient, and it avoids a GitHub request on every keystroke.

**Consequences:** Discovery features in Phase 4 filter `Project[]`. Shareable state uses URL search parameters such as `search` and `category`.

---

## Decision 007 — No Redux/Zustand Initially

**Status:** Accepted

**Decision:** Do not introduce global state management initially.

**Why:**

The application can use Server Components, local React state, and URL search parameters for its current requirements.

**Consequences:** Do not add Redux, Zustand, or a similar store as part of the gallery, search, or detail work. A later decision is required before adding one.

---

## How to Add a New Decision

Use:

```text
## Decision NNN — Title

**Status:** Proposed | Accepted | Rejected | Superseded

**Decision:** ...

**Why:** ...

**Consequences:** ...
```

Add the new entry to the index.

Never silently overwrite a previous architectural decision. If a decision changes, mark the old one as superseded and add a new decision.
