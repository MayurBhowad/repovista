import { formatCount, summarizeProjects } from "@/components/home/format";
import type { Project } from "@/types/project";

const stats = [
  { key: "projects", label: "Projects", hint: "Public projects in this gallery" },
  { key: "stars", label: "Stars", hint: "Stars across these projects" },
  { key: "forks", label: "Forks", hint: "Forks across these projects" },
  {
    key: "languages",
    label: "Languages",
    hint: "Primary languages represented",
  },
] as const;

export function ProjectStatistics({
  projects,
}: {
  projects: readonly Project[];
}) {
  const totals = summarizeProjects(projects);

  return (
    <section aria-labelledby="statistics-heading">
      <h2
        id="statistics-heading"
        className="text-2xl font-semibold tracking-tight"
      >
        At a glance
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Totals from the projects shown here.
      </p>
      <dl className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-3xl border border-border bg-card px-5 py-6 shadow-sm"
          >
            <dt className="text-sm text-muted-foreground">
              {stat.label}
              <span className="sr-only">, {stat.hint}</span>
            </dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
              {formatCount(totals[stat.key])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
