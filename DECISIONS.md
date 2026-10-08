# RepoVista Architecture Decisions

> Record decisions that would otherwise be forgotten. Prefer explaining WHY over documenting obvious implementation details.

## Decision 001 — GitHub + RepoVista Metadata

**Status:** Accepted

**Decision:** Use GitHub as the source of truth for live repository facts and a local RepoVista metadata layer for presentation.

**Why:**

GitHub knows technical repository facts, but it does not provide enough human-friendly storytelling for the intended experience.

RepoVista therefore owns:

- titles
- categories
- featured status
- project stories
- images
- presentation metadata

GitHub owns:

- stars
- forks
- language
- topics
- repository URL
- update information

---

## Decision 002 — Normalized Project Domain Model

**Status:** Accepted

**Decision:** UI components consume a RepoVista `Project` model rather than raw GitHub API responses.

**Why:**

This isolates the UI from GitHub's API structure and allows the data source to change later without rewriting the UI.

---

## Decision 003 — Server-Side GitHub Access

**Status:** Accepted

**Decision:** GitHub API access is server-side.

**Why:**

- Protect GitHub credentials.
- Avoid exposing tokens.
- Reduce unnecessary browser-to-GitHub requests.
- Allow Next.js caching and revalidation.

---

## Decision 004 — No Database in V1

**Status:** Accepted

**Decision:** Do not introduce a database initially.

**Why:**

RepoVista is initially a personal project showcase with a small amount of curated metadata. A database would add operational complexity without solving an immediate problem.

Reconsider when metadata requires runtime editing, multiple users, or significant content volume.

---

## Decision 005 — No Client-Side Data Fetching for Initial Repository Load

**Status:** Accepted

**Decision:** Initial repository data should be loaded through Server Components and the project service.

**Why:**

The initial use case does not require a client-side data synchronization library. This keeps the architecture simpler and reduces browser JavaScript.

---

## Decision 006 — Search/Filter Locally

**Status:** Accepted

**Decision:** Search, filtering and sorting operate on the normalized project dataset instead of querying GitHub on every interaction.

**Why:**

The expected repository count is small enough for this to be efficient and it provides a much better user experience.

---

## Decision 007 — No Redux/Zustand Initially

**Status:** Accepted

**Decision:** Do not introduce global state management initially.

**Why:**

The application can use Server Components, React state, and URL search parameters for its current requirements.

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

Never silently overwrite a previous architectural decision. If a decision changes, mark the old one as superseded and add a new decision.
