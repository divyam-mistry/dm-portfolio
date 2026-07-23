"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contactInfo } from "@/lib/data";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "education", label: "Education" },
];

interface FullscreenMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function FullscreenMenu({ open, onClose }: FullscreenMenuProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[75] flex flex-col justify-between bg-ink px-6 pt-28 pb-10 sm:px-12"
        >
          <nav className="flex flex-col">
            {navItems.map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={onClose}
                data-cursor="Go"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-baseline gap-4 border-b border-line py-4 sm:py-5"
              >
                <span className="font-mono text-xs text-faint">0{i + 1}</span>
                <span className="font-display text-4xl text-paper transition-colors group-hover:text-volt sm:text-6xl">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <a
              href={`mailto:${contactInfo.email}`}
              className="font-mono text-sm text-muted transition-colors hover:text-volt"
            >
              {contactInfo.email}
            </a>
            <div className="flex gap-6 font-mono text-sm text-muted">
              <a href={contactInfo.github} className="transition-colors hover:text-volt">
                GitHub
              </a>
              <a href={contactInfo.linkedin} className="transition-colors hover:text-volt">
                LinkedIn
              </a>
              <a href={contactInfo.leetcode} className="transition-colors hover:text-volt">
                LeetCode
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
