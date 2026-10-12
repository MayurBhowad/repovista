import { RepositoryCard } from "@/components/home/repository-card";
import type { Project } from "@/types/project";

const FEATURED_IMAGE_SIZES = "(min-width: 640px) 36rem, 100vw";

export function FeaturedProjects({
  projects,
}: {
  projects: readonly Project[];
}) {
  return (
    <section aria-labelledby="featured-heading">
      <h2
        id="featured-heading"
        className="text-2xl font-semibold tracking-tight"
      >
        Featured projects
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        A few projects picked out for their story.
      </p>
      {projects.length === 0 ? (
        <p className="mt-6 max-w-2xl rounded-3xl border border-dashed border-border bg-card px-6 py-8 text-sm leading-relaxed text-muted-foreground">
          No projects are highlighted yet. The rest of the collection is just
          below.
        </p>
      ) : (
        <ul
          className={
            projects.length === 1
              ? "mt-6 grid max-w-3xl grid-cols-1"
              : "featured-grid mt-6 grid gap-5"
          }
        >
          {projects.map((project, index) => (
            <li key={project.name} className="min-w-0">
              <RepositoryCard
                project={project}
                sizes={FEATURED_IMAGE_SIZES}
                priority={index === 0}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
