import "server-only";

import { z } from "zod";

/**
 * Server-side GitHub HTTP client.
 *
 * Reads `GITHUB_USERNAME` and `GITHUB_TOKEN` only. The token is optional and
 * is sent as a bearer credential when present. `NEXT_PUBLIC_GITHUB_TOKEN`
 * is refused so a public env name cannot leak the credential to the browser.
 */

const GITHUB_API_ORIGIN = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_REVALIDATE_SECONDS = 60 * 60;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 2_000_000;

const GITHUB_USERNAME_PATTERN =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_TOKEN_PATTERN = /^[A-Za-z0-9_]{16,255}$/;
const SEARCH_PARAM_NAME_PATTERN = /^[a-z_]{1,32}$/;
const SEARCH_PARAM_VALUE_PATTERN = /^[A-Za-z0-9._-]{1,16}$/;

export const GITHUB_ERROR_CODES = [
  "configuration",
  "unauthorized",
  "forbidden",
  "not_found",
  "rate_limited",
  "validation",
  "network",
  "unexpected",
] as const;

export type GitHubErrorCode = (typeof GITHUB_ERROR_CODES)[number];

export class GitHubApiError extends Error {
  readonly code: GitHubErrorCode;
  readonly status: number | null;

  constructor(
    code: GitHubErrorCode,
    message: string,
    status: number | null = null,
  ) {
    super(message);
    this.name = "GitHubApiError";
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isGitHubApiError(error: unknown): error is GitHubApiError {
  return error instanceof GitHubApiError;
}

type GitHubCredentials = {
  readonly username: string;
  readonly token: string | null;
};

type GitHubGetOptions = {
  readonly searchParams?: Readonly<Record<string, string>>;
};

const githubErrorBodySchema = z.object({
  message: z.string().optional(),
});

export function getGitHubUsername(): string {
  return readCredentials().username;
}

export async function githubGet<T>(
  path: string,
  schema: z.ZodType<T>,
  options?: GitHubGetOptions,
): Promise<T> {
  const credentials = readCredentials();
  const url = buildUrl(path, options?.searchParams);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: buildHeaders(credentials.token),
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: {
        revalidate: GITHUB_REVALIDATE_SECONDS,
        tags: ["github"],
      },
    });
  } catch (error) {
    throw toNetworkError(error);
  }

  if (response.status >= 300 && response.status < 400) {
    await response.body?.cancel();
    throw new GitHubApiError(
      "unexpected",
      "GitHub redirected the request.",
      response.status,
    );
  }

  const body = await readJsonBody(response, credentials.token);

  if (!response.ok) {
    throw toResponseError(response, body, credentials.token);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.issues
      .slice(0, 5)
      .map((issue) => issue.path.join(".") || "(root)")
      .join(", ");
    throw new GitHubApiError(
      "validation",
      `GitHub response did not match the expected shape (${fields}).`,
      response.status,
    );
  }

  return parsed.data;
}

function readCredentials(): GitHubCredentials {
  if (process.env["NEXT_PUBLIC_GITHUB_TOKEN"]) {
    throw new GitHubApiError(
      "configuration",
      "NEXT_PUBLIC_GITHUB_TOKEN must not be set. Store the token in GITHUB_TOKEN so it stays on the server.",
    );
  }

  const username = process.env.GITHUB_USERNAME?.trim() ?? "";
  if (!username) {
    throw new GitHubApiError(
      "configuration",
      "GITHUB_USERNAME is not set.",
    );
  }
  if (!GITHUB_USERNAME_PATTERN.test(username)) {
    throw new GitHubApiError(
      "configuration",
      "GITHUB_USERNAME is not a valid GitHub username.",
    );
  }

  const token = process.env.GITHUB_TOKEN?.trim() ?? "";
  if (!token) {
    return { username, token: null };
  }
  if (!GITHUB_TOKEN_PATTERN.test(token)) {
    throw new GitHubApiError(
      "configuration",
      "GITHUB_TOKEN is not a valid token.",
    );
  }

  return { username, token };
}

function buildHeaders(token: string | null): Headers {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoVista",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

function buildUrl(
  path: string,
  searchParams: Readonly<Record<string, string>> | undefined,
): URL {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    throw new GitHubApiError(
      "unexpected",
      "Refused a GitHub request with an invalid path.",
    );
  }

  const url = new URL(path, GITHUB_API_ORIGIN);
  if (url.origin !== GITHUB_API_ORIGIN || url.pathname.includes("..")) {
    throw new GitHubApiError(
      "unexpected",
      "Refused a GitHub request outside the API host.",
    );
  }

  if (searchParams) {
    for (const [name, value] of Object.entries(searchParams)) {
      if (
        !SEARCH_PARAM_NAME_PATTERN.test(name) ||
        !SEARCH_PARAM_VALUE_PATTERN.test(value)
      ) {
        throw new GitHubApiError(
          "unexpected",
          "Refused a GitHub request with invalid query parameters.",
        );
      }
      url.searchParams.set(name, value);
    }
  }

  return url;
}

async function readJsonBody(
  response: Response,
  token: string | null,
): Promise<unknown> {
  const declaredLength = response.headers.get("content-length");
  if (
    declaredLength !== null &&
    (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)
  ) {
    await response.body?.cancel();
    throw new GitHubApiError(
      "unexpected",
      "GitHub response was too large.",
      response.status,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    await response.body?.cancel();
    throw new GitHubApiError(
      "unexpected",
      "GitHub returned a non-JSON response.",
      response.status,
    );
  }

  const text = await readBoundedText(response);
  if (token && text.includes(token)) {
    throw new GitHubApiError(
      "unexpected",
      "GitHub response included the server token.",
      response.status,
    );
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new GitHubApiError(
      "unexpected",
      "GitHub returned invalid JSON.",
      response.status,
    );
  }
}

async function readBoundedText(response: Response): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    return "";
  }

  const decoder = new TextDecoder();
  let received = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new GitHubApiError(
        "unexpected",
        "GitHub response was too large.",
        response.status,
      );
    }

    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  return text;
}

function toResponseError(
  response: Response,
  body: unknown,
  token: string | null,
): GitHubApiError {
  const parsed = githubErrorBodySchema.safeParse(body);
  const message = sanitizeMessage(
    parsed.success ? parsed.data.message : undefined,
    token,
  );

  if (isRateLimited(response, message)) {
    return new GitHubApiError(
      "rate_limited",
      "GitHub rate limit exceeded.",
      response.status,
    );
  }

  switch (response.status) {
    case 401:
      return new GitHubApiError(
        "unauthorized",
        "GitHub rejected the server token.",
        response.status,
      );
    case 403:
      return new GitHubApiError(
        "forbidden",
        message || "GitHub refused the request.",
        response.status,
      );
    case 404:
      return new GitHubApiError(
        "not_found",
        "GitHub repository was not found.",
        response.status,
      );
    default:
      return new GitHubApiError(
        "unexpected",
        message || "GitHub request failed.",
        response.status,
      );
  }
}

function isRateLimited(response: Response, message: string): boolean {
  if (response.status === 429) {
    return true;
  }

  if (response.status !== 403) {
    return false;
  }

  return (
    response.headers.get("x-ratelimit-remaining") === "0" ||
    response.headers.has("retry-after") ||
    /rate limit/i.test(message)
  );
}

function sanitizeMessage(
  message: string | undefined,
  token: string | null,
): string {
  if (!message) {
    return "";
  }

  const cleaned = message.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  const redacted =
    token && cleaned.includes(token)
      ? cleaned.replaceAll(token, "[redacted]")
      : cleaned;

  return redacted.slice(0, 200);
}

function toNetworkError(error: unknown): GitHubApiError {
  if (error instanceof Error && error.name === "TimeoutError") {
    return new GitHubApiError("network", "GitHub request timed out.");
  }

  return new GitHubApiError(
    "network",
    "GitHub request could not be completed.",
  );
}
