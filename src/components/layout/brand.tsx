import Link from "next/link";
import { cn } from "@/lib/utils";

function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold tracking-tight text-primary-foreground"
    >
      R
    </span>
  );
}

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <Mark />
      <span className="truncate text-base font-semibold tracking-tight">
        RepoVista
      </span>
    </Link>
  );
}
