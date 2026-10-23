"use client";

import { useMemo, useRef } from "react";
import {
  DiscoveryControls,
  DiscoveryEmpty,
} from "@/components/home/discovery-controls";
import { ProjectGrid } from "@/components/home/project-grid";
import { useDiscoveryState } from "@/components/home/use-discovery-state";
import { discoverProjects } from "@/lib/projects/discovery";
import type { Project } from "@/types/project";

/**
 * The project grid with search, category, and sort controls.
 * It filters the `Project[]` the Server Component already loaded.
 */
export function ProjectDiscovery({
  projects,
}: {
  projects: readonly Project[];
}) {
  const { state, setSearch, setCategory, setSort, clearFilters } =
    useDiscoveryState();
  const searchRef = useRef<HTMLInputElement>(null);
  const results = useMemo(
    () => discoverProjects(projects, state),
    [projects, state],
  );

  function clearAndFocusSearch() {
    clearFilters();
    searchRef.current?.focus();
  }

  return (
    <ProjectGrid
      projects={results}
      toolbar={
        <DiscoveryControls
          state={state}
          shown={results.length}
          total={projects.length}
          searchRef={searchRef}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSort}
          onClear={clearAndFocusSearch}
        />
      }
      empty={<DiscoveryEmpty state={state} onClear={clearAndFocusSearch} />}
    />
  );
}
