import { MobileNav } from "@/components/layout/mobile-nav";
import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border/80 bg-background/85 px-3 backdrop-blur-md sm:px-5 lg:px-8">
      <MobileNav />
      <Brand className="lg:hidden" />
      <p className="hidden text-sm text-muted-foreground lg:block">
        Project gallery
      </p>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
