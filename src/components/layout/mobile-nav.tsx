"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Brand } from "@/components/layout/brand";
import { iconButtonClass } from "@/components/layout/icon-button";
import { NavLinks } from "@/components/layout/nav-links";

const desktopQuery = "(min-width: 64rem)";

export function MobileNav() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath !== null && openPath === pathname;
  const titleId = useId();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  function close() {
    setOpenPath(null);
  }

  useLayoutEffect(() => {
    if (wasOpen.current && !open) {
      buttonRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpenPath(null);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const desktop = window.matchMedia(desktopQuery);
    function onDesktopChange() {
      if (desktop.matches) setOpenPath(null);
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktopChange);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktopChange);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`${iconButtonClass} lg:hidden`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpenPath(pathname)}
      >
        <Menu className="size-[1.125rem]" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </button>
      {open
        ? createPortal(
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-foreground/25"
                aria-hidden="true"
                onClick={close}
              />
              <div
                ref={panelRef}
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="shell-drawer relative flex h-dvh w-[min(18.5rem,calc(100%-2.5rem))] flex-col overflow-y-auto bg-sidebar px-5 py-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p id={titleId} className="text-sm font-medium">
                    Menu
                  </p>
                  <button
                    type="button"
                    className={iconButtonClass}
                    aria-label="Close menu"
                    onClick={close}
                  >
                    <X className="size-[1.125rem]" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-8">
                  <Brand />
                  <p className="mt-4 max-w-56 text-sm leading-relaxed text-muted-foreground">
                    A calm gallery for software projects.
                  </p>
                </div>
                <div className="mt-8">
                  <NavLinks onNavigate={close} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
