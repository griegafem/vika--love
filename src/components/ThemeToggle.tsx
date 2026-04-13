"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getInitialTheme(): Theme {
  const saved = window.localStorage.getItem("vika_theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const t = getInitialTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem("vika_theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-blush-200 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-800 shadow-soft backdrop-blur transition hover:border-blush-300 hover:bg-white dark:border-zinc-800/80 dark:bg-zinc-900/55 dark:text-zinc-100 dark:hover:bg-zinc-900"
      aria-label="Переключить тему"
    >
      <span className="text-sm" aria-hidden>
        {theme === "dark" ? "🌙" : "☀"}
      </span>
      {theme === "dark" ? "тёмная" : "светлая"}
    </button>
  );
}

