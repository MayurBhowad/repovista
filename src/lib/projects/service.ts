import "server-only";

import { getRepositories, getRepository } from "@/lib/github/repositories";
import { mapRepositoryToProject } from "@/lib/projects/mapper";
import {
  DEFAULT_PROJECT_ORDER_START,
  getProjectMetadata,
} from "@/lib/projects/metadata";
import type { Project } from "@/types/project";

export { GitHubApiError, isGitHubApiError } from "@/lib/github/client";

/**
 * Project API for Server Components.
 *
 * Pages import this module and receive `Project` values. They do not import
 * `src/lib/github/` or read curated metadata directly. GitHub failures still
 * surface as `GitHubApiError`. A repository with no metadata is returned
 * with mapper defaults.
 */

/** Public repositories for the configured user, normalized and ordered. */
export async function getProjects(): Promise<readonly Project[]> {
  const repositories = await getRepositories();
  const projects = repositories.map((repository, index) =>
    mapRepositoryToProject(
      repository,
      getProjectMetadata(repository.name),
      DEFAULT_PROJECT_ORDER_START + index,
    ),
  );

  return [...projects].sort(compareProjects);
}

/**
 * One public repository, normalized with curated metadata when it exists.
 * When metadata omits `order`, the order is {@link DEFAULT_PROJECT_ORDER_START}.
 * `getProjects` adds the list index to that start.
 */
export async function getProject(name: string): Promise<Project> {
  const repository = await getRepository(name);

  return mapRepositoryToProject(
    repository,
    getProjectMetadata(repository.name),
    DEFAULT_PROJECT_ORDER_START,
  );
}

function compareProjects(left: Project, right: Project): number {
  if (left.order !== right.order) {
    return left.order - right.order;
  }

  return left.name.localeCompare(right.name);
}
