"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/ui/Section";
import { shipLog, type ShipKind, type ShipLogEntry } from "@/lib/data";
import { cn } from "@/lib/utils";

const KINDS: { kind: ShipKind; label: string }[] = [
  { kind: "feat", label: "Features" },
  { kind: "perf", label: "Performance" },
  { kind: "infra", label: "Infrastructure" },
  { kind: "fix", label: "Reliability" },
];

const PAGE = 8;

const kindColor = (kind: ShipKind) => `var(--k-${kind})`;

export default function ShipLog() {
  const [filter, setFilter] = useState<ShipKind | "all">("all");
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(() => [...shipLog].sort((a, b) => b.date.localeCompare(a.date)), []);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: sorted.length };
    sorted.forEach((e) => (c[e.kind] = (c[e.kind] ?? 0) + 1));
    return c;
  }, [sorted]);

  const visible = useMemo(() => {
    const list = filter === "all" ? sorted : sorted.filter((e) => e.kind === filter);
    return expanded ? list : list.slice(0, PAGE);
  }, [sorted, filter, expanded]);
  const total = filter === "all" ? sorted.length : (counts[filter] ?? 0);

  const byYear = useMemo(() => {
    const groups: { year: string; entries: ShipLogEntry[] }[] = [];
    visible.forEach((entry) => {
      const year = entry.date.slice(0, 4);
      const last = groups[groups.length - 1];
      if (last?.year === year) last.entries.push(entry);
      else groups.push({ year, entries: [entry] });
    });
    return groups;
  }, [visible]);

  const years = sorted.map((e) => e.date.slice(0, 4));
  const teams = new Set(sorted.map((e) => e.org.split(" · ")[0])).size;

  return (
    <Section
      id="shiplog"
      index="02"
      title="Ship log"
      note="A running changelog of what made it to production — read it like a commit graph."
    >
      <div className="flex flex-col gap-4 border-b border-rule-strong pb-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span className="tabular text-ink">{sorted.length}</span> entries ·{" "}
          <span className="tabular">
            {years[years.length - 1]}–{years[0]}
          </span>{" "}
          · <span className="tabular">{teams}</span>{" "}
          teams &amp; projects
        </p>

        <div role="radiogroup" aria-label="Filter by kind" className="flex flex-wrap gap-1.5">
          {[{ kind: "all" as const, label: "All" }, ...KINDS].map(({ kind, label }) => {
            const active = filter === kind;
            return (
              <button
                key={kind}
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setFilter(kind);
                  setExpanded(false);
                }}
                disabled={kind !== "all" && !counts[kind]}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors disabled:opacity-40",
                  active ? "border-ink bg-ink text-paper" : "border-rule text-ink-soft hover:border-rule-strong",
                )}
              >
                {kind !== "all" && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: kindColor(kind) }} />
                )}
                {label}
                <span className={cn("tabular", active ? "text-paper/60" : "text-faint")}>{counts[kind] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-2">
        {/* The trunk */}
        <div aria-hidden className="absolute top-0 bottom-0 left-[7px] w-px bg-rule-strong" />

        <AnimatePresence mode="popLayout" initial={false}>
          {byYear.map((group) => (
            <motion.div key={group.year} layout="position" className="relative">
              {/* Year tag, like a git tag on the trunk */}
              <div className="relative flex items-center gap-4 pt-10 pb-4">
                <span className="relative z-10 flex h-[15px] w-[15px] items-center justify-center rounded-sm border border-ink bg-paper">
                  <span className="h-[5px] w-[5px] rounded-[1px] bg-ink" />
                </span>
                <span className="tabular font-serif text-3xl leading-none text-ink">{group.year}</span>
                <span className="h-px flex-1 bg-rule" />
              </div>

              <ol>
                <AnimatePresence mode="popLayout" initial={false}>
                  {group.entries.map((entry) => (
                    <motion.li
                      key={`${entry.date}-${entry.title}`}
                      layout="position"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative grid grid-cols-[15px_1fr] gap-x-4 py-4 sm:grid-cols-[15px_1fr_auto] sm:gap-x-6"
                    >
                      <span className="relative z-10 mt-[0.4rem] flex h-[15px] w-[15px] items-center justify-center">
                        <span
                          className="h-[9px] w-[9px] rounded-full ring-4 ring-paper transition-transform duration-300 group-hover:scale-125"
                          style={{ backgroundColor: kindColor(entry.kind) }}
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
                          <span style={{ color: kindColor(entry.kind) }}>{entry.kind}</span>
                          <span className="text-faint">/</span>
                          <span className="rounded border border-rule px-1.5 py-px text-ink-soft">⎇ {entry.org}</span>
                          {entry.role === "contributed" && <span className="text-faint">contributed</span>}
                          <span className="text-faint sm:hidden">{entry.when}</span>
                        </div>
                        <h3 className="mt-2 font-serif text-2xl leading-tight text-ink sm:text-[1.7rem]">
                          {entry.title}
                        </h3>
                        <p className="pretty mt-1.5 max-w-2xl leading-relaxed text-muted">{entry.summary}</p>
                        {(entry.impact || entry.tags?.length) && (
                          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                            {entry.impact && (
                              <span className="rounded bg-accent-soft px-2 py-0.5 text-accent">↳ {entry.impact}</span>
                            )}
                            {entry.tags?.map((t) => (
                              <span key={t} className="text-faint">
                                #{t.toLowerCase().replace(/[^a-z0-9]+/g, "")}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="hidden pt-1 text-right font-mono text-[11px] whitespace-nowrap text-faint sm:block">
                        {entry.when}
                      </span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
            </motion.div>
          ))}
        </AnimatePresence>

        {total > PAGE && (
          <div className="relative flex items-center gap-4 pt-6">
            <span className="relative z-10 flex h-[15px] w-[15px] items-center justify-center">
              <span className="h-[9px] w-[9px] rounded-full border border-rule-strong bg-paper" />
            </span>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
            >
              {expanded ? "Collapse log" : `Show full log · ${total - PAGE} more`}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
