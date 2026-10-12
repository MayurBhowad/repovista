import type { Project } from "@/types/project";

/** Totals derived from the projects the page actually loaded. */
export type RepositoryTotals = {
  readonly projects: number;
  readonly stars: number;
  readonly forks: number;
  readonly languages: number;
};

const COUNT_FORMAT = new Intl.NumberFormat("en-US");
const UPDATED_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const SAFE_IMAGE_PATH = /^\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+$/;

export function summarizeProjects(
  projects: readonly Project[],
): RepositoryTotals {
  const languages = new Set<string>();
  let stars = 0;
  let forks = 0;

  for (const project of projects) {
    stars = addCount(stars, project.stars);
    forks = addCount(forks, project.forks);
    if (project.language) {
      languages.add(project.language);
    }
  }

  return {
    projects: projects.length,
    stars,
    forks,
    languages: languages.size,
  };
}

export function formatCount(value: number): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return COUNT_FORMAT.format(value);
}

/** Readable update date, or null when the timestamp cannot be shown. */
export function formatUpdatedAt(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return UPDATED_FORMAT.format(date);
}

export function projectDetailHref(name: string): string {
  return `/repositories/${encodeURIComponent(name)}`;
}

/**
 * Curated images are a site path or an https URL. Anything else is omitted
 * so the card can show a placeholder instead of an unsafe or broken source.
 */
export function displayableImageSource(value: string | null): string | null {
  if (!value) {
    return null;
  }

  if (value.startsWith("/")) {
    return SAFE_IMAGE_PATH.test(value) ? value : null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

function addCount(total: number, value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return total;
  }

  return total + value;
}
