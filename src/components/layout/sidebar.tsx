import { Brand } from "@/components/layout/brand";
import { NavLinks } from "@/components/layout/nav-links";

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col self-start overflow-y-auto border-r border-sidebar-border bg-sidebar px-6 py-8 lg:flex">
      <Brand />
      <p className="mt-4 max-w-56 text-sm leading-relaxed text-muted-foreground">
        A calm gallery for software projects.
      </p>
      <div className="mt-10">
        <NavLinks />
      </div>
    </aside>
  );
}
