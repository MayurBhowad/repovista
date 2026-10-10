import { z } from "zod";

/**
 * GitHub REST response shapes.
 *
 * These stay inside `src/lib/github/`. The UI consumes `Project` from
 * `@/types/project` after the project layer maps validated data.
 */

const githubOwnerSchema = z.object({
  login: z.string().min(1).max(39),
});

export const githubRepositorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  full_name: z.string().min(1).max(140),
  private: z.boolean(),
  fork: z.boolean(),
  archived: z.boolean(),
  html_url: z.url(),
  description: z.string().nullable(),
  homepage: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  topics: z.array(z.string()).default([]),
  updated_at: z.iso.datetime(),
  owner: githubOwnerSchema,
});

export const githubRepositoryListSchema = z.array(githubRepositorySchema);

/** Language name to byte count, as returned by the languages endpoint. */
export const githubLanguagesSchema = z.record(
  z.string().min(1),
  z.number().int().nonnegative(),
);

export type GitHubRepository = z.infer<typeof githubRepositorySchema>;
export type GitHubLanguages = z.infer<typeof githubLanguagesSchema>;
