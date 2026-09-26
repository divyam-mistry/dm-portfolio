"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CommandPalette from "@/components/CommandPalette";
import { profile, sections } from "@/lib/data";
import { useActiveSection, useClock, useTheme } from "@/lib/hooks";

const sectionIds = sections.map((s) => s.id);

export default function RunningHeader() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);
  const time = useClock(profile.timezone);
  const { theme, toggle } = useTheme();
  const current = sections.find((s) => s.id === active);

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
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled ? "border-b border-rule bg-paper/80 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto grid h-14 max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-5 font-mono text-[11px] uppercase tracking-[0.12em] sm:grid-cols-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2 text-ink">
            <span className="font-serif text-lg normal-case tracking-normal">Divyam Mistry</span>
          </a>

          {/* Running header: which section of the broadsheet you are reading */}
          <div className="hidden justify-center overflow-hidden text-muted sm:flex">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={current?.id ?? "top"}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {current ? (
                  <>
                    <span className="text-accent">§ {current.index}</span>&nbsp;&nbsp;{current.label}
                  </>
                ) : (
                  <>
                    {profile.base}&nbsp;·&nbsp;<span className="tabular">{time || "--:--"}</span>&nbsp;{profile.timezoneLabel}
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-8 items-center gap-2 rounded-full border border-rule px-3 text-muted transition-colors hover:border-rule-strong hover:text-ink"
              aria-label="Open command menu"
            >
              <span className="hidden sm:inline">Index</span>
              <kbd className="font-mono text-[10px] normal-case tracking-normal">⌘K</kbd>
            </button>
            <button
              onClick={toggle}
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-rule transition-colors hover:border-rule-strong"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Paper edition" : "Ink edition"}
            >
              {/* Half-filled disc: the filled side flips with the edition */}
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" aria-hidden>
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
