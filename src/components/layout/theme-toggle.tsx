"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useLayoutEffect } from "react";
import { iconButtonClass } from "@/components/layout/icon-button";
import { THEME_STORAGE_KEY } from "@/components/layout/theme";

type ThemeChoice = "light" | "dark";

function readStoredTheme(): ThemeChoice | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: ThemeChoice) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

function preferredTheme(): ThemeChoice {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  useLayoutEffect(() => {
    applyTheme(readStoredTheme() ?? preferredTheme());
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme()) return;
      applyTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggleTheme() {
    const next: ThemeChoice = document.documentElement.classList.contains(
      "dark",
    )
      ? "light"
      : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be blocked. The choice still applies for this view.
    }
  }

  return (
    <button
      type="button"
      className={iconButtonClass}
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <Sun className="hidden size-[1.125rem] dark:block" aria-hidden="true" />
      <Moon className="size-[1.125rem] dark:hidden" aria-hidden="true" />
    </button>
  );
}
