import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <a
        href="#main-content"
        className="skip-link rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-12 lg:py-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
