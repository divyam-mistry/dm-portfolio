"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Work() {
  const [open, setOpen] = useState<string | null>(projects[0]?.name ?? null);

  return (
    <Section
      id="work"
      index="01"
      title="Selected work"
      note="Flagship work at Strique, from schema to screen. Open a row for the spec sheet."
    >
      <div className="hidden grid-cols-12 gap-x-6 border-b border-rule-strong pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-5">Project</span>
        <span className="col-span-4">Brief</span>
        <span className="col-span-2 text-right">Year</span>
      </div>

      <ul>
        {projects.map((project, index) => {
          const isOpen = open === project.name;
          const panelId = `work-${index}`;
          return (
            <FadeIn as="li" key={project.name} delay={index * 0.05} y={12} className="border-b border-rule">
              <button
                onClick={() => setOpen(isOpen ? null : project.name)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-4 py-6 text-left sm:grid-cols-12 sm:gap-x-6 sm:py-7"
              >
                <span className="tabular font-mono text-xs text-faint sm:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-serif text-4xl leading-none transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:col-span-5 sm:text-[2.75rem] lg:text-5xl",
                    isOpen ? "text-accent italic" : "text-ink group-hover:translate-x-2",
                  )}
                >
                  {project.name}
                </span>
                <span className="hidden text-[15px] text-muted sm:col-span-4 sm:block">{project.summary}</span>
                <span className="flex items-baseline justify-end gap-3 font-mono text-xs text-muted sm:col-span-2">
                  <span className="hidden sm:inline">{project.year}</span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block text-base text-ink"
                  >
                    +
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-12 gap-x-6 gap-y-8 pb-10">
                      <div className="col-span-12 pl-[3.25rem] sm:col-span-6 sm:col-start-2 sm:pl-0">
                        <p className="text-[15px] text-muted sm:hidden">{project.summary}</p>
                        <div className="mt-4 space-y-4 sm:mt-0">
                          {project.description.map((line, i) => (
                            <p key={i} className="pretty leading-relaxed text-ink-soft">
                              {line}
                            </p>
                          ))}
                        </div>
                        {project.links && project.links.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            {project.links.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="ink-link text-accent"
                              >
                                {link.label} ↗
                              </a>
                            ))}
                          </div>
                        )}
                      </div>

                      <dl className="col-span-12 self-start rounded-lg border border-rule bg-paper-raised/60 p-5 font-mono text-[11px] sm:col-span-5">
                        <div className="flex justify-between border-b border-rule pb-2 uppercase tracking-[0.14em] text-faint">
                          <span>Spec sheet</span>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="grid grid-cols-[5.5rem_1fr] gap-y-2.5 pt-3">
                          {project.org && (
                            <>
                              <dt className="text-faint">Built at</dt>
                              <dd className="text-ink-soft">{project.org}</dd>
                            </>
                          )}
                          <dt className="text-faint">Status</dt>
                          <dd className="text-ink-soft">{project.status ?? "Shipped"}</dd>
                          {project.period && (
                            <>
                              <dt className="text-faint">Period</dt>
                              <dd className="text-ink-soft">{project.period}</dd>
                            </>
                          )}
                          <dt className="text-faint">Stack</dt>
                          <dd className="flex flex-wrap gap-1.5">
                            {project.techStack.map((t) => (
                              <span key={t} className="rounded-full border border-rule px-2 py-0.5 text-ink-soft">
                                {t}
                              </span>
                            ))}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </FadeIn>
          );
        })}
      </ul>
    </Section>
  );
}
