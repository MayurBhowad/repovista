"use client";

import { ArrowRight, ArrowUpRight, GitFork, Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  formatCount,
  formatUpdatedAt,
  projectDetailHref,
} from "@/components/home/format";
import { ProjectImage } from "@/components/home/project-image";
import { TechnologyBadges } from "@/components/home/technology-badges";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

const linkClass =
  "rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export function RepositoryCard({
  project,
  sizes,
  priority = false,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const updated = formatUpdatedAt(project.updatedAt);
  const detailHref = projectDetailHref(project.name);

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none",
        project.featured
          ? "border-primary/35 shadow-md ring-1 ring-primary/15"
          : "border-border",
      )}
    >
      <ProjectImage
        src={project.image}
        alt={project.image ? `${project.title} preview` : ""}
        sizes={sizes}
        priority={priority}
      />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {project.featured ? (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Featured
            </span>
          ) : null}
          {project.category ? (
            <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {project.category}
            </span>
          ) : null}
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-balance">
          <Link href={detailHref} className={cn(linkClass, "hover:text-primary")}>
            {project.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description ??
            "A description has not been written for this project yet."}
        </p>
        <TechnologyBadges technologies={project.technologies} />
        <div className="mt-auto flex flex-col gap-4 pt-3">
          <dl className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 shrink-0" aria-hidden="true" />
              <dt className="sr-only">Stars</dt>
              <dd className="tabular-nums">{formatCount(project.stars)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <GitFork className="size-3.5 shrink-0" aria-hidden="true" />
              <dt className="sr-only">Forks</dt>
              <dd className="tabular-nums">{formatCount(project.forks)}</dd>
            </div>
            {updated ? (
              <div className="flex items-center gap-1.5">
                <dt className="sr-only">Last updated</dt>
                <dd>Updated {updated}</dd>
              </div>
            ) : null}
          </dl>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={detailHref}
              className={cn(
                linkClass,
                "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary",
              )}
            >
              Explore
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub (opens in a new tab)`}
              className={cn(
                linkClass,
                "inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground",
              )}
            >
              GitHub
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
