"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import ProjectCover from "@/components/ProjectCover";
import { projects, type Project } from "@/lib/data";

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-rule-strong px-3.5 text-[13px] text-ink-soft transition-colors hover:border-faint hover:text-ink"
    >
      {children}
      <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
    </a>
  );
}

function ProjectSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-sheet-title"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="card relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-b-none p-5 sm:rounded-2xl sm:p-7"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-8 right-8 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/80 text-[#141413] backdrop-blur transition-colors hover:bg-white sm:top-10 sm:right-10"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>

        <ProjectCover kind={project.cover} />

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {project.org && <span className="chip">{project.org}</span>}
          <span className="chip">{project.status ?? "Shipped"}</span>
          {project.period && <span className="chip">{project.period}</span>}
        </div>
        <h3 id="project-sheet-title" className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
          {project.name}
        </h3>
        <p className="mt-1 text-muted">{project.summary}</p>

        <div className="mt-6 space-y-4 border-t border-rule pt-6">
          {project.description.map((line, i) => (
            <p key={i} className="pretty leading-relaxed text-ink-soft">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.techStack.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.links.map((link) => (
              <PillLink key={link.href} href={link.href}>
                {link.label}
              </PillLink>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <Section id="work" title="Work" action={{ label: "View ship log", href: "#shiplog" }}>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {projects.map((project, i) => (
          <FadeIn key={project.name} delay={(i % 2) * 0.08}>
            <article className="group">
              <button
                onClick={() => setOpen(project)}
                className="block w-full text-left"
                aria-haspopup="dialog"
                aria-label={`${project.name}: open details`}
              >
                <ProjectCover
                  kind={project.cover}
                  className="transition-[border-color] duration-300 group-hover:border-rule-strong"
                />
                <div className="mt-5 px-0.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">{project.name}</h3>
                    <span className="shrink-0 font-mono text-[11px] text-faint">{project.year}</span>
                  </div>
                  <p className="pretty mt-1.5 leading-relaxed text-muted">
                    {project.summary}. {project.org && <span className="text-faint">{project.org}, {project.period}</span>}
                  </p>
                </div>
              </button>
              <div className="mt-4 flex flex-wrap gap-2 px-0.5">
                <button
                  onClick={() => setOpen(project)}
                  className="inline-flex h-8 items-center rounded-full border border-rule-strong px-3.5 text-[13px] text-ink-soft transition-colors hover:border-faint hover:text-ink"
                >
                  Read more
                </button>
                {project.links?.[0] && <PillLink href={project.links[0].href}>{project.links[0].label}</PillLink>}
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      <FadeIn className="card mt-14 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-ink">Want the story behind these, incidents and trade-offs included?</p>
          <p className="mt-0.5 text-[13px] text-muted">The field notes go deeper. Or just say hello.</p>
        </div>
        <a
          href="#contact"
          className="inline-flex h-9 w-fit shrink-0 items-center rounded-lg border border-rule-strong px-4 text-[13px] text-ink-soft transition-colors hover:border-faint hover:text-ink"
        >
          Get in touch
        </a>
      </FadeIn>

      <AnimatePresence>{open && <ProjectSheet project={open} onClose={close} />}</AnimatePresence>
    </Section>
  );
}
