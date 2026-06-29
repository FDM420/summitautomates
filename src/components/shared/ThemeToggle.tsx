"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Light/dark theme toggle. The actual theme is applied to <html data-theme>
 * by a tiny pre-paint script in layout.tsx (so there's no flash on load);
 * this button just flips that attribute and persists the choice.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("summit.theme", next);
    } catch {
      /* ignore storage failures */
    }
  };

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-gold-200 transition hover:border-gold-300/30 hover:bg-white/10 sm:h-10 sm:w-10 ${className}`}
      onClick={toggle}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      type="button"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
