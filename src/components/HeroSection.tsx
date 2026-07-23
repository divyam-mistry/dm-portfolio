"use client";

import { motion } from "framer-motion";
import MagneticText from "@/components/ui/MagneticText";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { contactInfo, stats } from "@/lib/data";

export default function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-screen flex-col justify-center px-6 pt-32 pb-16 sm:px-12">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-4 font-display text-[26vw] leading-none text-line select-none sm:right-12 sm:text-[16vw]"
      >
        01
      </span>

      <div className="relative max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 font-mono text-xs tracking-[0.25em] text-volt"
        >
          FULL STACK ENGINEER — REACT · NODE · FLUTTER
        </motion.p>

        <h1 className="font-display font-medium leading-[0.92] tracking-tight text-paper text-[16vw] sm:text-[9.5vw]">
          <MagneticText text="Divyam" />
          <br />
          <MagneticText text="Mistry" />
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-12 sm:gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl text-xl leading-relaxed text-muted sm:col-span-7"
          >
            I build <span className="font-serif italic text-paper">fast, reliable</span> products
            across web, mobile, and real-time systems — from REST APIs and payment integrations to
            Flutter apps and Kafka pipelines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-x-6 gap-y-5 sm:col-span-5 sm:grid-cols-2"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="border-t border-line pt-3">
                <div className="font-display text-2xl font-medium text-paper">
                  <AnimatedCounter value={parseFloat(stat.value)} suffix={stat.suffix} />
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-faint">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <MagneticButton
            href="#projects"
            data-cursor="View"
            strength={0.2}
            className="group border-b border-paper pb-1 text-base text-paper"
          >
            View selected work
            <span className="transition-transform group-hover:translate-x-1">↗</span>
          </MagneticButton>
          <MagneticButton
            href={`mailto:${contactInfo.email}`}
            data-cursor="Email"
            strength={0.2}
            className="border-b border-line pb-1 text-base text-muted hover:border-line-strong hover:text-paper"
          >
            Get in touch
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-faint"
        >
          {[
            { label: "GitHub", href: contactInfo.github },
            { label: "LinkedIn", href: contactInfo.linkedin },
            { label: "LeetCode", href: contactInfo.leetcode },
            { label: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/[^+\d]/g, "")}` },
          ].map((item) => (
            <a key={item.label} href={item.href} data-cursor="Open" className="transition-colors hover:text-volt">
              {item.label}
            </a>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-10 right-6 flex flex-col items-center gap-3 sm:right-12">
        <span className="font-mono text-[10px] tracking-[0.3em] text-faint [writing-mode:vertical-lr]">
          SCROLL
        </span>
        <motion.span
          className="h-16 w-px bg-line-strong"
          style={{ transformOrigin: "top" }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
