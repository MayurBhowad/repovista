import "server-only";

import {
  GitHubApiError,
  getGitHubUsername,
  githubGet,
} from "@/lib/github/client";
import {
  githubLanguagesSchema,
  githubRepositoryListSchema,
  githubRepositorySchema,
  type GitHubLanguages,
  type GitHubRepository,
} from "@/lib/github/types";

/**
 * Public repository queries for `GITHUB_USERNAME`.
 *
 * Pages should use the project service once it exists. They must not import
 * this module.
 */

const PAGE_SIZE = 100;
const MAX_PAGES = 10;
const REPOSITORY_NAME_PATTERN = /^[A-Za-z0-9_][A-Za-z0-9._-]{0,99}$/;

/**
 * Public repositories owned by the configured user, most recently updated first.
 * Forks are included. Private repositories are omitted.
 */
export async function getRepositories(): Promise<readonly GitHubRepository[]> {
  const username = getGitHubUsername();
  const repositories: GitHubRepository[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await githubGet(
      `/users/${encodeURIComponent(username)}/repos`,
      githubRepositoryListSchema,
      {
        searchParams: {
          type: "owner",
          sort: "updated",
          direction: "desc",
          per_page: String(PAGE_SIZE),
          page: String(page),
        },
      },
    );

    for (const repository of batch) {
      const visible = publicOwnedRepository(repository, username);
      if (visible) {
        repositories.push(visible);
      }
    }

    if (batch.length < PAGE_SIZE) {
      return repositories;
    }
  }

  throw new GitHubApiError(
    "unexpected",
    "GitHub returned more repositories than RepoVista will load.",
  );
}

/** One public repository owned by the configured user. */
export async function getRepository(name: string): Promise<GitHubRepository> {
  const username = getGitHubUsername();
  const repositoryName = assertRepositoryName(name);
  const repository = await githubGet(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repositoryName)}`,
    githubRepositorySchema,
  );

  return requirePublicOwnedRepository(repository, username);
}

/** Byte counts by language for one public repository. */
export async function getRepositoryLanguages(
  name: string,
): Promise<GitHubLanguages> {
  const username = getGitHubUsername();
  const repositoryName = assertRepositoryName(name);

  await getRepository(repositoryName);

  return githubGet(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repositoryName)}/languages`,
    githubLanguagesSchema,
  );
}

function assertRepositoryName(name: string): string {
  const trimmed = name.trim();
  if (
    !REPOSITORY_NAME_PATTERN.test(trimmed) ||
    trimmed.includes("..") ||
    trimmed.endsWith(".git")
  ) {
    throw new GitHubApiError("validation", "Repository name is invalid.");
  }

  return trimmed;
}

function publicOwnedRepository(
  repository: GitHubRepository,
  username: string,
): GitHubRepository | null {
  assertOwnedByUser(repository, username);
  return repository.private ? null : repository;
}

function requirePublicOwnedRepository(
  repository: GitHubRepository,
  username: string,
): GitHubRepository {
  const visible = publicOwnedRepository(repository, username);
  if (!visible) {
    throw new GitHubApiError(
      "not_found",
      "GitHub repository was not found.",
      404,
    );
  }

  return visible;
}

function assertOwnedByUser(
  repository: GitHubRepository,
  username: string,
): void {
  if (repository.owner.login.toLowerCase() !== username.toLowerCase()) {
    throw new GitHubApiError(
      "validation",
      "GitHub returned a repository for a different owner.",
    );
  }
}
