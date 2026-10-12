import { connection } from "next/server";
import { FeaturedProjects } from "@/components/home/featured-projects";
import {
  GalleryEmpty,
  GalleryError,
  galleryErrorMessage,
} from "@/components/home/gallery-status";
import { ProjectGrid } from "@/components/home/project-grid";
import { ProjectStatistics } from "@/components/home/project-statistics";
import { getProjects, isGitHubApiError } from "@/lib/projects/service";
import type { Project } from "@/types/project";

type ProjectLoad =
  | { readonly ok: true; readonly projects: readonly Project[] }
  | { readonly ok: false; readonly message: string };

/**
 * Loads the gallery through the project service.
 * Rendering waits for the request so a build without GitHub credentials
 * does not freeze an error page into the static output.
 */
export async function ProjectCollection() {
  await connection();
  const load = await loadProjects();

  if (!load.ok) {
    return <GalleryError message={load.message} />;
  }

  if (load.projects.length === 0) {
    return <GalleryEmpty />;
  }

  const featured = load.projects.filter((project) => project.featured);

  return (
    <div className="gallery-enter flex flex-col gap-16 sm:gap-20">
      <ProjectStatistics projects={load.projects} />
      <FeaturedProjects projects={featured} />
      <ProjectGrid projects={load.projects} />
    </div>
  );
}

async function loadProjects(): Promise<ProjectLoad> {
  try {
    const projects = await getProjects();
    return { ok: true, projects };
  } catch (error) {
    if (isGitHubApiError(error)) {
      return { ok: false, message: galleryErrorMessage(error.code) };
    }

    throw error;
  }
}
