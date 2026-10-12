import Link from "next/link";

const GALLERY_ERROR_MESSAGES: Record<string, string> = {
  configuration: "RepoVista is not connected to a GitHub account yet.",
  unauthorized: "GitHub did not accept the connection, so projects cannot be shown.",
  forbidden: "GitHub refused to share these projects.",
  not_found: "The GitHub account or its projects could not be found.",
  rate_limited:
    "GitHub is limiting requests right now. Please try again in a little while.",
  validation: "The project list could not be read. Please try again later.",
  network: "The project list could not be reached. Please try again later.",
  unexpected:
    "Something went wrong while loading projects. Please try again later.",
};

export function galleryErrorMessage(code: string): string {
  return GALLERY_ERROR_MESSAGES[code] ?? GALLERY_ERROR_MESSAGES.unexpected;
}

export function GalleryLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-16">
      <p className="sr-only">Loading projects</p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-3 sm:gap-4">
        {["projects", "stars", "forks", "languages"].map((key) => (
          <div
            key={key}
            className="h-28 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none"
          />
        ))}
      </div>
      <div className="gallery-grid grid gap-5">
        {["one", "two", "three", "four", "five", "six"].map((key) => (
          <div
            key={key}
            className="h-80 animate-pulse rounded-3xl bg-muted motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}

export function GalleryEmpty() {
  return (
    <section aria-labelledby="empty-heading">
      <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-12 sm:px-10">
        <h2 id="empty-heading" className="text-2xl font-semibold tracking-tight">
          No projects yet
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          There are no public repositories to show. When some are available,
          they will appear here with their descriptions and GitHub details.
        </p>
      </div>
    </section>
  );
}

export function GalleryError({ message }: { message: string }) {
  return (
    <section aria-labelledby="gallery-error-heading">
      <div
        role="alert"
        className="rounded-3xl border border-border bg-card px-6 py-12 shadow-sm sm:px-10"
      >
        <h2
          id="gallery-error-heading"
          className="text-2xl font-semibold tracking-tight"
        >
          Projects are unavailable
        </h2>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
          {message}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-full text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Try again
        </Link>
      </div>
    </section>
  );
}
