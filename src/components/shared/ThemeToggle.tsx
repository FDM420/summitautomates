"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle. The initial theme class is set on <html> before paint by
 * the inline script in layout.tsx (no flash); this component just mirrors and
 * flips it, persisting the choice to localStorage. Default is light.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — fall back to in-memory only */
    }
  };

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`grid h-10 w-10 place-items-center rounded-xl border border-hair bg-overlay text-ink transition hover:bg-overlay-strong ${className}`}
      onClick={toggle}
      type="button"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch. */}
      {mounted && theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
