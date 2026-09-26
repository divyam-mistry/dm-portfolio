"use client";

import { motion } from "framer-motion";
import { profile, sections, stats } from "@/lib/data";

const ease = [0.16, 1, 0.3, 1] as const;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

export default function Hero() {
  const year = new Date().getFullYear();

  return (
    <section id="top" className="mx-auto max-w-[1200px] px-5 pt-28 pb-20 sm:px-8 sm:pt-36 sm:pb-28">
      {/* Masthead rule */}
      <motion.div
        {...rise(0)}
        className="flex items-center justify-between border-y border-rule-strong py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px]"
      >
        <span>Portfolio · Edition {year}</span>
        <span className="hidden sm:inline">Software · Systems · Interfaces</span>
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Now at {profile.now.company}
        </span>
      </motion.div>

      <div className="relative">
        <h1 className="mt-10 font-serif text-[clamp(4.5rem,20vw,11.5rem)] leading-[0.86] tracking-[-0.025em] text-ink sm:mt-14">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease }}
            >
              Divyam
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block italic sm:pl-[1.1em]"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.2, ease }}
            >
              Mistry<span className="text-accent not-italic">.</span>
            </motion.span>
          </span>
        </h1>

        <motion.aside
          {...rise(0.9)}
          className="absolute right-0 bottom-6 hidden max-w-[17rem] border-l border-rule-strong pl-5 lg:block"
        >
          <p className="font-mono text-[11px] text-muted">
            <span className="text-accent">n.</span> software engineer
          </p>
          <p className="pretty mt-2 font-serif text-xl leading-snug text-ink-soft italic">
            Builds backends that stay up and interfaces that feel quick. Based in {profile.base}.
          </p>
        </motion.aside>
      </div>

      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14 sm:mt-20">
        <motion.p
          {...rise(0.45)}
          className="pretty col-span-12 font-serif text-[1.75rem] leading-[1.2] text-ink-soft sm:text-[2.1rem] lg:col-span-7"
        >
          {profile.role} at {profile.now.company}, building{" "}
          <span className="relative inline-block text-ink">
            the quiet machinery
            <motion.svg
              aria-hidden
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-[0.35em] w-full text-accent"
            >
              <motion.path
                d="M2 8 C 60 2, 120 11, 180 6 S 270 3, 298 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 1.1, ease: "easeInOut" }}
              />
            </motion.svg>
          </span>{" "}
          behind an agentic AI marketing platform — streaming chat, AI-generated reports, billing and product-feed
          pipelines — and the interfaces that sit on top of them.
        </motion.p>

        <motion.nav {...rise(0.6)} aria-label="Contents" className="col-span-12 lg:col-span-4 lg:col-start-9">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Contents</p>
          <ol className="border-t border-rule">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-baseline border-b border-rule py-2.5 text-[15px] text-ink-soft transition-colors hover:text-ink"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{s.label}</span>
                  <span className="leader" />
                  <span className="tabular font-mono text-[11px] text-faint transition-colors group-hover:text-accent">
                    {s.index}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </motion.nav>
      </div>

      <motion.dl {...rise(0.75)} className="mt-16 grid grid-cols-2 border-t border-rule-strong sm:mt-24 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col-reverse border-rule pt-5 pb-5 ${i % 2 === 1 ? "border-l pl-5" : ""} ${
              i < 2 ? "border-b sm:border-b-0" : ""
            } ${i > 0 ? "sm:border-l sm:pl-5" : ""}`}
          >
            <dt className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:text-[11px]">
              <sup className="mr-1 text-accent">{i + 1}</sup>
              {stat.label}
            </dt>
            <dd className="tabular font-serif text-5xl leading-none text-ink sm:text-6xl">{stat.value}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
