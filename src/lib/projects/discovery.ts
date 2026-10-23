import {
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from "@/types/project";

/**
 * Search, category filter, and sort for the loaded `Project[]`.
 *
 * This module has no server or browser dependencies, so Server and Client
 * Components can share it. It never calls GitHub. URL parameters are parsed
 * here so `/?search=`, `/?category=`, and `/?sort=` have one definition.
 */

export const PROJECT_SORTS = ["updated", "stars", "forks", "name"] as const;

export type ProjectSort = (typeof PROJECT_SORTS)[number];

export const DEFAULT_PROJECT_SORT: ProjectSort = "updated";

export const PROJECT_SORT_LABELS: Readonly<Record<ProjectSort, string>> = {
  updated: "Recently updated",
  stars: "Most stars",
  forks: "Most forks",
  name: "Alphabetical",
};

export const DISCOVERY_PARAMS = {
  search: "search",
  category: "category",
  sort: "sort",
} as const;

export const SEARCH_MAX_LENGTH = 100;

export interface ProjectDiscoveryState {
  /** Raw search text. Matching uses {@link normalizeSearch}. */
  readonly search: string;
  /** Null means every category, including projects without one. */
  readonly category: ProjectCategory | null;
  readonly sort: ProjectSort;
}

export const DEFAULT_DISCOVERY_STATE: ProjectDiscoveryState = {
  search: "",
  category: null,
  sort: DEFAULT_PROJECT_SORT,
};

type ReadableParams = Pick<URLSearchParams, "get">;

const TITLE_COLLATOR = new Intl.Collator("en", {
  sensitivity: "base",
  numeric: true,
});

export function parseDiscoveryParams(
  params: ReadableParams,
): ProjectDiscoveryState {
  return {
    search: limitSearch(params.get(DISCOVERY_PARAMS.search) ?? ""),
    category: parseCategory(params.get(DISCOVERY_PARAMS.category)),
    sort: parseSort(params.get(DISCOVERY_PARAMS.sort)),
  };
}

/** Matching is case-insensitive, so `?category=ai` selects `AI`. */
export function parseCategory(value: string | null): ProjectCategory | null {
  const key = value?.trim().toLowerCase();
  if (!key) {
    return null;
  }

  return (
    PROJECT_CATEGORIES.find((category) => category.toLowerCase() === key) ??
    null
  );
}

export function parseSort(value: string | null): ProjectSort {
  const key = value?.trim().toLowerCase();
  return PROJECT_SORTS.find((sort) => sort === key) ?? DEFAULT_PROJECT_SORT;
}

/**
 * Copies `current` and writes the discovery state onto it. Default values are
 * removed so the plain `/` URL stays the default view. Other parameters are
 * kept as they were.
 */
export function writeDiscoveryParams(
  current: URLSearchParams,
  state: ProjectDiscoveryState,
): URLSearchParams {
  const params = new URLSearchParams(current);
  const search = limitSearch(state.search).trim();

  setOrDelete(params, DISCOVERY_PARAMS.search, search);
  setOrDelete(params, DISCOVERY_PARAMS.category, state.category ?? "");
  setOrDelete(
    params,
    DISCOVERY_PARAMS.sort,
    state.sort === DEFAULT_PROJECT_SORT ? "" : state.sort,
  );

  return params;
}

/** Stable key for comparing two states the way the URL would store them. */
export function discoveryStateKey(state: ProjectDiscoveryState): string {
  return writeDiscoveryParams(new URLSearchParams(), state).toString();
}

export function hasActiveFilters(state: ProjectDiscoveryState): boolean {
  return normalizeSearch(state.search) !== "" || state.category !== null;
}

export function normalizeSearch(value: string): string {
  return limitSearch(value).trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Every search word must appear in the project name, title, description,
 * technologies, or GitHub topics. An empty search matches every project.
 */
export function matchesSearch(project: Project, search: string): boolean {
  const query = normalizeSearch(search);
  if (!query) {
    return true;
  }

  const haystack = searchableText(project);
  return query.split(" ").every((term) => haystack.includes(term));
}

export function matchesCategory(
  project: Project,
  category: ProjectCategory | null,
): boolean {
  return category === null || project.category === category;
}

/** Returns a new array. The input array and projects are not modified. */
export function sortProjects(
  projects: readonly Project[],
  sort: ProjectSort,
): Project[] {
  const sorted = [...projects];
  switch (sort) {
    case "updated":
      return sorted.sort((left, right) =>
        descending(timestamp(left.updatedAt), timestamp(right.updatedAt)),
      );
    case "stars":
      return sorted.sort((left, right) =>
        descending(count(left.stars), count(right.stars)),
      );
    case "forks":
      return sorted.sort((left, right) =>
        descending(count(left.forks), count(right.forks)),
      );
    case "name":
      return sorted.sort(
        (left, right) =>
          TITLE_COLLATOR.compare(left.title, right.title) ||
          TITLE_COLLATOR.compare(left.name, right.name),
      );
  }
}

/**
 * Filters by search and category, then sorts. Ties keep the service order,
 * because `Array.prototype.sort` is stable.
 */
export function discoverProjects(
  projects: readonly Project[],
  state: ProjectDiscoveryState,
): Project[] {
  const matching = projects.filter(
    (project) =>
      matchesCategory(project, state.category) &&
      matchesSearch(project, state.search),
  );

  return sortProjects(matching, state.sort);
}

function searchableText(project: Project): string {
  return [
    project.name,
    project.title,
    project.description ?? "",
    ...project.technologies,
    ...project.topics,
  ]
    .join("\n")
    .toLowerCase();
}

/** Missing or unreadable timestamps sort after every real date. */
function timestamp(value: string): number {
  const time = Date.parse(value);
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
}

function count(value: number): number {
  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
}

function descending(left: number, right: number): number {
  if (left === right) {
    return 0;
  }

  return left < right ? 1 : -1;
}

function limitSearch(value: string): string {
  return value.slice(0, SEARCH_MAX_LENGTH);
}

function setOrDelete(params: URLSearchParams, name: string, value: string) {
  if (value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
}
