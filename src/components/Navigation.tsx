"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import SectionRail from "@/components/ui/SectionRail";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[76] flex items-center justify-between px-6 py-6 sm:px-12">
        <a href="#hero" data-cursor="Top" className="font-display text-lg font-medium text-paper">
          DM<span className="text-volt">.</span>
        </a>

        <button
          onClick={() => setOpen((prev) => !prev)}
          data-cursor={open ? "Close" : "Menu"}
          className="flex items-center gap-2 font-mono text-xs tracking-widest text-paper"
        >
          <span>{open ? "CLOSE" : "MENU"}</span>
          <span className="relative flex h-3 w-4 flex-col justify-between">
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }}
              className="h-px w-full origin-center bg-paper"
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              className="h-px w-full bg-paper"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }}
              className="h-px w-full origin-center bg-paper"
            />
          </span>
        </button>
      </div>

      <SectionRail hidden={open} />
      <FullscreenMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
