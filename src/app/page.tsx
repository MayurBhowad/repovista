import { Suspense } from "react";
import { GalleryLoading } from "@/components/home/gallery-status";
import { Hero } from "@/components/home/hero";
import { ProjectCollection } from "@/components/home/project-collection";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 sm:gap-20">
      <Hero />
      <div id="projects" className="scroll-mt-24">
        <Suspense fallback={<GalleryLoading />}>
          <ProjectCollection />
        </Suspense>
      </div>
    </div>
  );
}
