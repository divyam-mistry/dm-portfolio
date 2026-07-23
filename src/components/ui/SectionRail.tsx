"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "education", label: "Education" },
];

interface SectionRailProps {
  hidden?: boolean;
}

export default function SectionRail({ hidden }: SectionRailProps) {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      animate={{ opacity: hidden ? 0 : 1, pointerEvents: hidden ? "none" : "auto" }}
      transition={{ duration: 0.3 }}
      className="fixed right-6 top-1/2 z-[70] hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex xl:right-12"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        const isHovered = hovered === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-cursor="Go"
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            className="group flex items-center gap-3 py-0.5"
          >
            <motion.span
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "font-mono text-[11px] uppercase tracking-widest whitespace-nowrap",
                isActive ? "text-paper" : "text-muted"
              )}
            >
              {s.label}
            </motion.span>
            <span className="relative flex h-3 w-3 items-center justify-center">
              <motion.span
                animate={{ scale: isActive ? 1 : 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute h-3 w-3 rounded-full border border-volt"
              />
              <motion.span
                animate={{
                  scale: isActive ? 1 : 0.6,
                  backgroundColor: isActive ? "var(--color-volt)" : "var(--color-line-strong)",
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-1.5 w-1.5 rounded-full"
              />
            </span>
          </a>
        );
      })}
    </motion.nav>
  );
}
