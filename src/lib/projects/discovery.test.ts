import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_DISCOVERY_STATE,
  discoverProjects,
  discoveryStateKey,
  hasActiveFilters,
  matchesSearch,
  parseDiscoveryParams,
  SEARCH_MAX_LENGTH,
  sortProjects,
  writeDiscoveryParams,
  type ProjectDiscoveryState,
} from "@/lib/projects/discovery";
import type { Project } from "@/types/project";

function project(overrides: Partial<Project> & { name: string }): Project {
  return {
    repositoryUrl: `https://github.com/example/${overrides.name}`,
    homepageUrl: null,
    language: null,
    topics: [],
    stars: 0,
    forks: 0,
    updatedAt: "2026-01-01T00:00:00Z",
    title: overrides.name,
    description: null,
    category: null,
    technologies: [],
    featured: false,
    image: null,
    story: null,
    problem: null,
    solution: null,
    learning: null,
    order: 0,
    ...overrides,
  };
}

const docBot = project({
  name: "doc-bot",
  title: "Document Assistant",
  description: "Answers questions about PDF files.",
  category: "AI",
  technologies: ["Python", "LangChain"],
  topics: ["llm", "rag"],
  stars: 40,
  forks: 3,
  updatedAt: "2026-03-01T00:00:00Z",
});

const apiServer = project({
  name: "api-server",
  title: "Orders API",
  description: "A REST backend for orders.",
  category: "Backend",
  technologies: ["Go"],
  topics: ["rest", "postgres"],
  stars: 12,
  forks: 9,
  updatedAt: "2026-05-01T00:00:00Z",
});

const portfolio = project({
  name: "portfolio",
  title: "personal site",
  description: "My website.",
  category: "Frontend",
  technologies: ["Next.js"],
  topics: ["react"],
  stars: 40,
  forks: 1,
  updatedAt: "2026-04-01T00:00:00Z",
});

const sparse = project({
  name: "zz-sparse",
  description: null,
  category: null,
  technologies: [],
  topics: [],
  stars: Number.NaN,
  forks: Number.NaN,
  updatedAt: "",
});

const projects: readonly Project[] = [docBot, apiServer, portfolio, sparse];

function state(overrides: Partial<ProjectDiscoveryState>): ProjectDiscoveryState {
  return { ...DEFAULT_DISCOVERY_STATE, ...overrides };
}

function names(list: readonly Project[]): string[] {
  return list.map((item) => item.name);
}

describe("matchesSearch", () => {
  it("matches the repository name", () => {
    assert.equal(matchesSearch(apiServer, "api-server"), true);
  });

  it("matches the display title", () => {
    assert.equal(matchesSearch(docBot, "assistant"), true);
  });

  it("matches the description", () => {
    assert.equal(matchesSearch(docBot, "pdf"), true);
  });

  it("matches technologies", () => {
    assert.equal(matchesSearch(docBot, "langchain"), true);
  });

  it("matches GitHub topics", () => {
    assert.equal(matchesSearch(apiServer, "postgres"), true);
  });

  it("ignores case and surrounding whitespace", () => {
    assert.equal(matchesSearch(docBot, "  DOCUMENT  "), true);
    assert.equal(matchesSearch(portfolio, "Personal SITE"), true);
  });

  it("requires every word to match", () => {
    assert.equal(matchesSearch(docBot, "python rag"), true);
    assert.equal(matchesSearch(docBot, "python go"), false);
  });

  it("matches everything for empty or blank input", () => {
    assert.equal(matchesSearch(docBot, ""), true);
    assert.equal(matchesSearch(sparse, "   "), true);
  });

  it("handles projects without description, technologies, or topics", () => {
    assert.equal(matchesSearch(sparse, "sparse"), true);
    assert.equal(matchesSearch(sparse, "python"), false);
  });
});

describe("discoverProjects", () => {
  it("returns every project for the default state", () => {
    assert.equal(discoverProjects(projects, DEFAULT_DISCOVERY_STATE).length, 4);
  });

  it("filters by category", () => {
    assert.deepEqual(names(discoverProjects(projects, state({ category: "AI" }))), [
      "doc-bot",
    ]);
  });

  it("excludes projects without a category when one is selected", () => {
    const result = discoverProjects(projects, state({ category: "Backend" }));
    assert.deepEqual(names(result), ["api-server"]);
  });

  it("combines search and category", () => {
    assert.deepEqual(
      names(discoverProjects(projects, state({ category: "AI", search: "document" }))),
      ["doc-bot"],
    );
    assert.deepEqual(
      discoverProjects(projects, state({ category: "Backend", search: "document" })),
      [],
    );
  });

  it("returns an empty list when nothing matches", () => {
    assert.deepEqual(discoverProjects(projects, state({ search: "no-such-thing" })), []);
    assert.deepEqual(discoverProjects([], DEFAULT_DISCOVERY_STATE), []);
  });

  it("filters before sorting", () => {
    const result = discoverProjects(
      projects,
      state({ search: "re", sort: "stars" }),
    );
    assert.deepEqual(names(result), ["portfolio", "api-server"]);
  });
});

describe("sortProjects", () => {
  it("sorts by most recently updated, with missing dates last", () => {
    assert.deepEqual(names(sortProjects(projects, "updated")), [
      "api-server",
      "portfolio",
      "doc-bot",
      "zz-sparse",
    ]);
  });

  it("sorts by most stars, keeping the original order for ties", () => {
    assert.deepEqual(names(sortProjects(projects, "stars")), [
      "doc-bot",
      "portfolio",
      "api-server",
      "zz-sparse",
    ]);
  });

  it("sorts by most forks, with missing counts last", () => {
    assert.deepEqual(names(sortProjects(projects, "forks")), [
      "api-server",
      "doc-bot",
      "portfolio",
      "zz-sparse",
    ]);
  });

  it("sorts alphabetically by title, ignoring case", () => {
    assert.deepEqual(names(sortProjects(projects, "name")), [
      "doc-bot",
      "api-server",
      "portfolio",
      "zz-sparse",
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [...projects];
    const result = sortProjects(input, "stars");
    assert.notEqual(result, input);
    assert.deepEqual(input, projects);
  });

  it("keeps the order when every value is missing", () => {
    const missing = [
      project({ name: "a", updatedAt: "not a date", stars: Number.NaN }),
      project({ name: "b", updatedAt: "", stars: Number.NaN }),
    ];
    assert.deepEqual(names(sortProjects(missing, "updated")), ["a", "b"]);
    assert.deepEqual(names(sortProjects(missing, "stars")), ["a", "b"]);
  });
});

describe("parseDiscoveryParams", () => {
  it("returns defaults for an empty query", () => {
    assert.deepEqual(parseDiscoveryParams(new URLSearchParams()), DEFAULT_DISCOVERY_STATE);
  });

  it("reads search, category, and sort", () => {
    assert.deepEqual(
      parseDiscoveryParams(new URLSearchParams("category=AI&search=document&sort=stars")),
      { search: "document", category: "AI", sort: "stars" },
    );
  });

  it("matches categories and sorts without regard to case", () => {
    const parsed = parseDiscoveryParams(new URLSearchParams("category=devtools&sort=FORKS"));
    assert.equal(parsed.category, "DevTools");
    assert.equal(parsed.sort, "forks");
  });

  it("falls back to defaults for unknown values", () => {
    const parsed = parseDiscoveryParams(
      new URLSearchParams("category=All&sort=random&search="),
    );
    assert.deepEqual(parsed, DEFAULT_DISCOVERY_STATE);
    assert.equal(
      parseDiscoveryParams(new URLSearchParams("category=<script>")).category,
      null,
    );
  });

  it("limits very long search text", () => {
    const parsed = parseDiscoveryParams(
      new URLSearchParams({ search: "x".repeat(SEARCH_MAX_LENGTH + 50) }),
    );
    assert.equal(parsed.search.length, SEARCH_MAX_LENGTH);
  });
});

describe("writeDiscoveryParams", () => {
  it("writes non-default values", () => {
    const params = writeDiscoveryParams(
      new URLSearchParams(),
      { search: " document ", category: "AI", sort: "stars" },
    );
    assert.equal(params.toString(), "search=document&category=AI&sort=stars");
  });

  it("removes default values", () => {
    const params = writeDiscoveryParams(
      new URLSearchParams("search=old&category=AI&sort=forks"),
      DEFAULT_DISCOVERY_STATE,
    );
    assert.equal(params.toString(), "");
  });

  it("keeps unrelated parameters and does not modify the input", () => {
    const current = new URLSearchParams("ref=newsletter&search=old");
    const params = writeDiscoveryParams(current, state({ search: "ai" }));
    assert.equal(params.toString(), "ref=newsletter&search=ai");
    assert.equal(current.toString(), "ref=newsletter&search=old");
  });

  it("round-trips through parseDiscoveryParams", () => {
    const original = state({ search: "ai tools", category: "Learning", sort: "name" });
    assert.deepEqual(
      parseDiscoveryParams(writeDiscoveryParams(new URLSearchParams(), original)),
      original,
    );
  });
});

describe("discoveryStateKey and hasActiveFilters", () => {
  it("treats states the URL would store the same way as equal", () => {
    assert.equal(
      discoveryStateKey(state({ search: "ai " })),
      discoveryStateKey(state({ search: "ai" })),
    );
    assert.notEqual(
      discoveryStateKey(state({ sort: "stars" })),
      discoveryStateKey(DEFAULT_DISCOVERY_STATE),
    );
  });

  it("counts search and category as filters, but not sort", () => {
    assert.equal(hasActiveFilters(DEFAULT_DISCOVERY_STATE), false);
    assert.equal(hasActiveFilters(state({ search: "   " })), false);
    assert.equal(hasActiveFilters(state({ sort: "stars" })), false);
    assert.equal(hasActiveFilters(state({ search: "ai" })), true);
    assert.equal(hasActiveFilters(state({ category: "Desktop" })), true);
  });
});
