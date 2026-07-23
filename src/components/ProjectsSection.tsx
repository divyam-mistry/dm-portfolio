"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionIntro from "@/components/ui/SectionIntro";
import { projects } from "@/lib/data";

export default function ProjectsSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-72%"]);

  return (
    <section id="projects" className="relative">
      <div className="px-6 pt-24 sm:px-12">
        <SectionIntro index="04" title="Projects" />
      </div>

      <div ref={targetRef} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-8 pl-6 sm:pl-12">
            {projects.map((project, index) => (
              <article
                key={project.name}
                data-cursor="View"
                className="flex w-[82vw] shrink-0 flex-col justify-between border-l border-line pl-8 sm:w-[52vw] sm:pl-10"
                style={{ minHeight: "60vh" }}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-faint">0{index + 1}</span>
                  {project.status && (
                    <span className="font-mono text-xs uppercase tracking-widest text-volt">
                      {project.status}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-5xl font-medium text-paper sm:text-6xl">
                    {project.name}
                  </h3>
                  {project.period && (
                    <p className="mt-2 font-mono text-xs text-faint">{project.period}</p>
                  )}
                  <ul className="mt-6 max-w-lg space-y-2">
                    {project.description.map((item, i) => (
                      <li key={i} className="text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-8 font-mono text-xs text-faint">
                  {project.techStack.join(" / ")}
                </p>
              </article>
            ))}

            <div className="flex w-[40vw] shrink-0 items-center pl-8 sm:pl-10">
              <p className="font-display text-3xl text-faint">That&apos;s the reel — more on GitHub ↗</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
