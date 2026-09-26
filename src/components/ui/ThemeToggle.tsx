"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Sliding day/night switch. The knob carries the icon of the current edition. */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      onClick={toggle}
      className={cn(
        "relative flex h-7 w-12 shrink-0 items-center rounded-full border border-rule-strong bg-paper-sunken p-0.5 transition-colors hover:border-faint",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink text-paper shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          dark ? "translate-x-0" : "translate-x-5",
        )}
      >
        {dark ? <Moon aria-hidden className="h-3 w-3" /> : <Sun aria-hidden className="h-3 w-3" />}
      </span>
    </button>
  );
}
