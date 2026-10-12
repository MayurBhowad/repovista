import { RepositoryCard } from "@/components/home/repository-card";
import type { Project } from "@/types/project";

const GRID_IMAGE_SIZES =
  "(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 100vw";

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <section aria-labelledby="projects-heading">
      <h2
        id="projects-heading"
        className="text-2xl font-semibold tracking-tight"
      >
        All projects
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Every public project in this collection, with the human-friendly
        description when one has been written.
      </p>
      <ul className="gallery-grid mt-6 grid gap-5">
        {projects.map((project) => (
          <li key={project.name} className="min-w-0">
            <RepositoryCard project={project} sizes={GRID_IMAGE_SIZES} />
          </li>
        ))}
      </ul>
    </section>
  );
}
