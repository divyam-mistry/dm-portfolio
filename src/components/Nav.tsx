"use client";

import { useEffect, useState } from "react";
import { Command } from "lucide-react";
import CommandPalette from "@/components/CommandPalette";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { profile, sections } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const sectionIds = sections.map((s) => s.id);
const navItems = sections.filter((s) => s.nav);

/** Floating capsule navigation, as in the reference: name, links, then the command menu and theme switch. */
export default function Nav() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-12 max-w-[1040px] items-center justify-between gap-4 rounded-full border pr-2 pl-5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300",
            scrolled
              ? "border-rule-strong bg-paper-raised/80 shadow-[0_12px_40px_-16px_rgb(0_0_0/0.45)]"
              : "border-rule bg-paper-raised/50",
          )}
        >
          <a href="#top" className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-ink">
            {profile.name}
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13px] transition-colors",
                    active === item.id ? "bg-rule text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {item.nav}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-8 items-center gap-1.5 rounded-full border border-rule px-2.5 font-mono text-[11px] text-muted transition-colors hover:border-rule-strong hover:text-ink"
              aria-label="Open command menu"
            >
              <Command aria-hidden className="h-3 w-3" />K
            </button>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
