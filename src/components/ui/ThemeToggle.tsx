"use client";

import { useTheme } from "@/lib/hooks";

/** The half-filled edition disc from the running header, as a standalone island. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="group flex h-8 w-8 items-center justify-center rounded-full border border-rule transition-colors hover:border-rule-strong"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Paper edition" : "Ink edition"}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180"
        aria-hidden
      >
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
      </svg>
    </button>
  );
}
