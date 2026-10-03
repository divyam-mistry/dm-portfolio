"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { blogPosts } from "@/lib/blog";
import { contactInfo, sections, socialLinks } from "@/lib/data";
import { useTheme } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  /** Extra words the search should match, e.g. the nav name of a section */
  keywords?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      { id: "top", group: "Go to", label: "Top of page", hint: "#00", run: () => jump("top") },
      ...sections.map((s) => ({
        id: s.id,
        group: "Go to",
        label: s.label,
        hint: `#${s.index}`,
        keywords: `${s.id} ${s.nav ?? ""}`,
        run: () => jump(s.id),
      })),
      ...blogPosts.map((p) => ({
        id: `post-${p.slug}`,
        group: "Field notes",
        label: p.title,
        hint: p.when,
        run: () => {
          window.location.href = `/blog/${p.slug}`;
        },
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Copied to clipboard" : "Copy email address",
        hint: contactInfo.email,
        run: () => {
          navigator.clipboard?.writeText(contactInfo.email);
          setCopied(true);
        },
      },
      {
        id: "mail",
        group: "Actions",
        label: "Write an email",
        run: () => (window.location.href = `mailto:${contactInfo.email}`),
      },
      {
        id: "theme",
        group: "Actions",
        label: theme === "dark" ? "Switch to paper edition" : "Switch to ink edition",
        hint: "Theme",
        run: toggle,
      },
      ...socialLinks.map((l) => ({
        id: l.label,
        group: "Elsewhere",
        label: l.label,
        hint: "↗",
        run: () => window.open(l.href, "_blank", "noopener,noreferrer"),
      })),
    ],
    [theme, toggle, copied]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ""} ${c.keywords ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => {
    setQuery("");
    setCursor(0);
    setCopied(false);
    onClose();
  };

  const execute = (cmd: Command | undefined) => {
    if (!cmd) return;
    cmd.run();
    // Keep the palette open for copy/theme so the result is visible.
    if (cmd.id !== "copy-email" && cmd.id !== "theme") close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (filtered.length ? (c - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      execute(filtered[cursor]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/20 px-4 pt-[14vh] backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-rule-strong bg-paper shadow-[0_24px_80px_-20px_rgb(0_0_0/0.35)]"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <span className="font-mono text-xs text-accent">❯</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Jump to a section, copy email…"
                aria-label="Search commands"
                className="h-12 w-full bg-transparent text-[15px] text-ink placeholder:text-faint focus:outline-none focus-visible:outline-none"
              />
              <kbd className="rounded border border-rule px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
            </div>

            <ul role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted">Nothing matches “{query}”.</li>
              )}
              {filtered.map((cmd, i) => {
                const header = filtered[i - 1]?.group !== cmd.group ? cmd.group : null;
                return (
                  <li key={cmd.id}>
                    {header && (
                      <p className="px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        {header}
                      </p>
                    )}
                    <button
                      role="option"
                      aria-selected={i === cursor}
                      onMouseMove={() => setCursor(i)}
                      onClick={() => execute(cmd)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm transition-colors",
                        i === cursor ? "bg-accent-soft text-ink" : "text-ink-soft"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-colors",
                            i === cursor ? "bg-accent" : "bg-transparent"
                          )}
                        />
                        {cmd.label}
                      </span>
                      {cmd.hint && <span className="truncate font-mono text-[11px] text-muted">{cmd.hint}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-rule px-4 py-2 font-mono text-[10px] text-faint">
              <span>↑↓ navigate · ↵ select</span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
