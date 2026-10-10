import "server-only";

import type { GitHubRepository } from "@/lib/github/types";
import type {
  ProjectMetadata,
  ProjectStory,
} from "@/lib/projects/metadata";
import {
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from "@/types/project";

/**
 * Merges one validated GitHub repository with curated metadata.
 *
 * This is the boundary that reads GitHub field names. It returns `Project`
 * and does not re-export the GitHub type. Missing or unusable metadata never
 * drops the repository: each field falls back on its own.
 *
 * `metadata.story.problem`, `solution`, and `learning` are copied onto the
 * flat `Project` fields. `Project.story` stays null because the catalog has
 * no separate narrative summary.
 */

const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 500;
const STORY_MAX_LENGTH = 2_000;
const LABEL_MAX_LENGTH = 40;
const LABEL_LIMIT = 20;
const IMAGE_MAX_LENGTH = 500;
const URL_MAX_LENGTH = 500;
const ORDER_MAX = 1_000_000;

const CONTROL_CHARACTER = /[\u0000-\u001F\u007F]/;
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;
const STORY_CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const RELATIVE_IMAGE_PATH = /^\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+$/;
const GITHUB_WEB_HOST = "github.com";

const STORY_FIELDS = ["problem", "solution", "learning"] as const;

export function mapRepositoryToProject(
  repository: GitHubRepository,
  metadata: ProjectMetadata | null,
  fallbackOrder: number,
): Project {
  const topics = sanitizeLabels(repository.topics);
  const technologies =
    metadata?.technologies !== undefined
      ? sanitizeLabels(metadata.technologies)
      : topics;

  return {
    name: repository.name,
    repositoryUrl: normalizeRepositoryUrl(repository),
    homepageUrl: normalizeHttpUrl(repository.homepage),
    language: normalizeLine(repository.language, LABEL_MAX_LENGTH),
    topics,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    updatedAt: repository.updated_at,
    title: normalizeLine(metadata?.title, TITLE_MAX_LENGTH) ?? repository.name,
    description:
      normalizeLine(metadata?.description, DESCRIPTION_MAX_LENGTH) ??
      normalizeLine(repository.description, DESCRIPTION_MAX_LENGTH),
    category: normalizeCategory(metadata?.category),
    technologies,
    featured: metadata?.featured === true,
    image: normalizeImage(metadata?.image),
    story: null,
    problem: readStory(metadata, "problem"),
    solution: readStory(metadata, "solution"),
    learning: readStory(metadata, "learning"),
    order: resolveOrder(metadata?.order, fallbackOrder),
  };
}

function readStory(
  metadata: ProjectMetadata | null,
  field: keyof ProjectStory,
): string | null {
  if (!metadata?.story || !STORY_FIELDS.includes(field)) {
    return null;
  }

  return normalizeStory(metadata.story[field]);
}

function resolveOrder(
  order: number | undefined,
  fallbackOrder: number,
): number {
  if (
    typeof order !== "number" ||
    !Number.isInteger(order) ||
    order < 0 ||
    order > ORDER_MAX
  ) {
    return fallbackOrder;
  }

  return order;
}

function normalizeCategory(
  category: ProjectCategory | undefined,
): ProjectCategory | null {
  if (!category) {
    return null;
  }

  return PROJECT_CATEGORIES.includes(category) ? category : null;
}

function normalizeLine(
  value: string | null | undefined,
  maxLength: number,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value
    .replace(CONTROL_CHARACTERS, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) {
    return null;
  }

  return limitLength(cleaned, maxLength);
}

function normalizeStory(value: string | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(STORY_CONTROL_CHARACTERS, "").trim();
  if (!cleaned) {
    return null;
  }

  return limitLength(cleaned, STORY_MAX_LENGTH);
}

function sanitizeLabels(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const value of values) {
    const cleaned = normalizeLine(value, LABEL_MAX_LENGTH);
    if (!cleaned) {
      continue;
    }

    const key = cleaned.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    labels.push(cleaned);
    if (labels.length === LABEL_LIMIT) {
      break;
    }
  }

  return labels;
}

function normalizeImage(value: string | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.length > IMAGE_MAX_LENGTH ||
    CONTROL_CHARACTER.test(trimmed) ||
    trimmed.includes("\\") ||
    trimmed.includes("..")
  ) {
    return null;
  }

  if (trimmed.startsWith("/")) {
    return RELATIVE_IMAGE_PATH.test(trimmed) ? trimmed : null;
  }

  return normalizeHttpsUrl(trimmed);
}

function normalizeRepositoryUrl(repository: GitHubRepository): string {
  const owner = encodeURIComponent(repository.owner.login);
  const name = encodeURIComponent(repository.name);
  const fallback = `https://${GITHUB_WEB_HOST}/${owner}/${name}`;
  const url = normalizeHttpsUrl(repository.html_url);
  if (!url) {
    return fallback;
  }

  const parsed = new URL(url);
  const [urlOwner, urlName] = parsed.pathname.split("/").filter(Boolean);
  const matchesRepository =
    urlOwner?.toLowerCase() === repository.owner.login.toLowerCase() &&
    urlName?.toLowerCase() === repository.name.toLowerCase();
  if (parsed.hostname !== GITHUB_WEB_HOST || !matchesRepository) {
    return fallback;
  }

  parsed.search = "";
  parsed.hash = "";
  return parsed.href;
}

function normalizeHttpUrl(value: string | null): string | null {
  return normalizeUrl(value, ["https:", "http:"]);
}

function normalizeHttpsUrl(value: string): string | null {
  return normalizeUrl(value, ["https:"]);
}

function normalizeUrl(
  value: string | null,
  protocols: readonly string[],
): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed.length > URL_MAX_LENGTH ||
    CONTROL_CHARACTER.test(trimmed)
  ) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (
    !protocols.includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    return null;
  }

  return url.href;
}

function limitLength(value: string, maxLength: number): string {
  return [...value].slice(0, maxLength).join("");
}
