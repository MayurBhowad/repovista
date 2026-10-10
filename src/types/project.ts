/**
 * RepoVista domain model.
 *
 * Server code merges GitHub facts with curated metadata and returns `Project`.
 * UI code imports these types only. GitHub API response types stay in
 * `src/lib/github/` and must not be imported by components.
 */

/** Categories that can be filtered in the UI. Values match `/?category=`. */
export const PROJECT_CATEGORIES = [
  "AI",
  "Backend",
  "Frontend",
  "Database",
  "DevTools",
  "Desktop",
  "Learning",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * Live repository facts, normalized for RepoVista.
 * This is not a GitHub API response. The mapper copies validated GitHub data
 * into this shape before the UI sees it.
 */
export interface ProjectGitHubInfo {
  /** Repository name. Also the `[name]` segment of `/repositories/[name]`. */
  readonly name: string;
  readonly repositoryUrl: string;
  readonly homepageUrl: string | null;
  readonly language: string | null;
  readonly topics: readonly string[];
  readonly stars: number;
  readonly forks: number;
  /** ISO-8601 timestamp of the last repository update. */
  readonly updatedAt: string;
}

/**
 * Presentation and storytelling owned by RepoVista metadata.
 * The project service fills defaults when curated metadata is missing.
 */
export interface ProjectStoryMetadata {
  /** Human-friendly title. Defaults to the repository name. */
  readonly title: string;
  /**
   * Display description. RepoVista copy wins when it exists; otherwise this
   * is the public GitHub description. Null only when both are absent.
   */
  readonly description: string | null;
  readonly category: ProjectCategory | null;
  /**
   * Technologies shown in the UI. Curated metadata wins when it is present.
   * Otherwise the mapper uses GitHub topics.
   */
  readonly technologies: readonly string[];
  /** Defaults to false when metadata does not mark the project as featured. */
  readonly featured: boolean;
  /** Project image URL or path. Null when no image is curated. */
  readonly image: string | null;
  /**
   * Optional narrative summary. Null when curated metadata only provides
   * problem, solution, and learning.
   */
  readonly story: string | null;
  readonly problem: string | null;
  readonly solution: string | null;
  readonly learning: string | null;
  /**
   * Presentation order. Lower numbers appear first.
   * The project service assigns a default when metadata omits an order.
   */
  readonly order: number;
}

/**
 * Normalized project consumed by Server Components and Client Components.
 * Built from `ProjectGitHubInfo` and `ProjectStoryMetadata`.
 */
export type Project = ProjectGitHubInfo & ProjectStoryMetadata;
