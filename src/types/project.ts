export type ProjectCategory =
  | "AI"
  | "Backend"
  | "Frontend"
  | "Database"
  | "DevTools"
  | "Desktop"
  | "Learning";

/**
 * Normalized RepoVista project.
 * The project service will return this shape to Server Components.
 */
export interface Project {
  name: string;
  description: string | null;
  category: ProjectCategory | null;
  repositoryUrl: string;
  homepageUrl: string | null;
  language: string | null;
  topics: readonly string[];
  stars: number;
  forks: number;
  updatedAt: string;
}
