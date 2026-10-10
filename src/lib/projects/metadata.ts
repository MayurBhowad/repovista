import "server-only";

import type { ProjectCategory } from "@/types/project";

/**
 * Curated presentation for one repository.
 *
 * Every field is optional. The mapper fills defaults when a field, or the
 * whole entry, is missing. Keys in the catalog are GitHub repository names.
 */

/**
 * Orders below this stay ahead of repositories that do not set `order`.
 * The service adds the repository's position in GitHub's recently-updated
 * list to this value.
 */
export const DEFAULT_PROJECT_ORDER_START = 10_000;

export interface ProjectStory {
  readonly problem?: string;
  readonly solution?: string;
  readonly learning?: string;
}

export interface ProjectMetadata {
  /** Human-friendly title. Defaults to the repository name. */
  readonly title?: string;
  /** Overrides the public GitHub description when present. */
  readonly description?: string;
  readonly category?: ProjectCategory;
  /**
   * Overrides GitHub topics on `Project.technologies` when present,
   * including when the list is empty.
   */
  readonly technologies?: readonly string[];
  /** Defaults to false. */
  readonly featured?: boolean;
  /** Site path (`/images/...`) or an https URL. Invalid values become null. */
  readonly image?: string;
  readonly story?: ProjectStory;
  /**
   * Presentation order. Lower numbers appear first.
   * When omitted, the service uses {@link DEFAULT_PROJECT_ORDER_START}
   * plus the repository's position in GitHub's recently-updated list.
   */
  readonly order?: number;
}

/**
 * Curated projects, keyed by GitHub repository name.
 * Matching is case-insensitive. An absent key is not an error.
 */
const PROJECT_METADATA: Readonly<Record<string, ProjectMetadata>> = {};

const metadataByRepositoryName = indexMetadata(PROJECT_METADATA);

/** Curated metadata for a repository, or null when none has been written. */
export function getProjectMetadata(
  repositoryName: string,
): ProjectMetadata | null {
  const key = repositoryName.trim().toLowerCase();
  if (!key) {
    return null;
  }

  return metadataByRepositoryName.get(key) ?? null;
}

function indexMetadata(
  catalog: Readonly<Record<string, ProjectMetadata>>,
): ReadonlyMap<string, ProjectMetadata> {
  const index = new Map<string, ProjectMetadata>();

  for (const [name, metadata] of Object.entries(catalog)) {
    const key = name.trim().toLowerCase();
    if (!key || index.has(key)) {
      continue;
    }

    index.set(key, metadata);
  }

  return index;
}
