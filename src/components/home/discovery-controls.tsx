"use client";

import { ChevronDown, Search } from "lucide-react";
import type { Ref } from "react";
import {
  hasActiveFilters,
  parseSort,
  PROJECT_SORT_LABELS,
  PROJECT_SORTS,
  SEARCH_MAX_LENGTH,
  type ProjectDiscoveryState,
  type ProjectSort,
} from "@/lib/projects/discovery";
import { cn } from "@/lib/utils";
import { PROJECT_CATEGORIES, type ProjectCategory } from "@/types/project";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const fieldClass = cn(
  "h-11 w-full min-w-0 rounded-full border border-input bg-card text-sm text-foreground shadow-sm",
  focusRing,
);

const CATEGORY_OPTIONS: readonly {
  readonly label: string;
  readonly value: ProjectCategory | null;
}[] = [
  { label: "All", value: null },
  ...PROJECT_CATEGORIES.map((category) => ({ label: category, value: category })),
];

export function DiscoveryControls({
  state,
  shown,
  total,
  searchRef,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClear,
}: {
  state: ProjectDiscoveryState;
  shown: number;
  total: number;
  searchRef: Ref<HTMLInputElement>;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: ProjectCategory | null) => void;
  onSortChange: (sort: ProjectSort) => void;
  onClear: () => void;
}) {
  return (
    <div role="search" aria-label="Find projects" className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor="project-search" className="text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              id="project-search"
              type="search"
              value={state.search}
              maxLength={SEARCH_MAX_LENGTH}
              autoComplete="off"
              spellCheck={false}
              placeholder="Name, description, technology, or topic"
              aria-describedby="project-results-status"
              onChange={(event) => onSearchChange(event.target.value)}
              className={cn(fieldClass, "pr-4 pl-11 placeholder:text-muted-foreground")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 sm:w-52">
          <label htmlFor="project-sort" className="text-sm font-medium">
            Sort by
          </label>
          <div className="relative">
            <select
              id="project-sort"
              value={state.sort}
              onChange={(event) => onSortChange(parseSort(event.target.value))}
              className={cn(fieldClass, "cursor-pointer appearance-none pr-10 pl-4")}
            >
              {PROJECT_SORTS.map((sort) => (
                <option key={sort} value={sort}>
                  {PROJECT_SORT_LABELS[sort]}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p id="project-category-label" className="text-sm font-medium">
          Category
        </p>
        <div
          role="group"
          aria-labelledby="project-category-label"
          className="flex flex-wrap gap-2"
        >
          {CATEGORY_OPTIONS.map((option) => {
            const active = state.category === option.value;
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange(option.value)}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors motion-reduce:transition-none",
                  focusRing,
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-accent",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p
          id="project-results-status"
          role="status"
          className="text-sm text-muted-foreground"
        >
          {resultsSummary(shown, total)}
        </p>
        {hasActiveFilters(state) ? (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "inline-flex min-h-11 items-center rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline",
              focusRing,
            )}
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function DiscoveryEmpty({
  state,
  onClear,
}: {
  state: ProjectDiscoveryState;
  onClear: () => void;
}) {
  const search = state.search.trim();

  return (
    <div className="mt-6 rounded-3xl border border-dashed border-border bg-card px-6 py-12 sm:px-10">
      <h3 className="text-xl font-semibold tracking-tight">
        No matching projects
      </h3>
      <p className="mt-3 max-w-xl text-base leading-relaxed break-words text-muted-foreground">
        {emptyMessage(search, state.category)} Try a different word or
        category, or clear the filters to see every project.
      </p>
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 motion-reduce:transition-none",
          focusRing,
        )}
      >
        Clear filters
      </button>
    </div>
  );
}

function resultsSummary(shown: number, total: number): string {
  if (total === 1) {
    return shown === 1 ? "Showing 1 project" : "Showing 0 of 1 project";
  }
  if (shown === total) {
    return `Showing all ${total} projects`;
  }

  return `Showing ${shown} of ${total} projects`;
}

function emptyMessage(search: string, category: ProjectCategory | null): string {
  if (search && category) {
    return `No ${category} projects match “${search}”.`;
  }
  if (search) {
    return `No projects match “${search}”.`;
  }
  if (category) {
    return `There are no ${category} projects yet.`;
  }

  return "No projects match these filters.";
}
