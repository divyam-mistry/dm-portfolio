"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { useClock } from "@/lib/hooks";

const GREETINGS = ["Hello", "નમસ્તે", "Hola", "नमस्ते", "Bonjour", "こんにちは", "Ciao"];

const ease = [0.16, 1, 0.3, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease },
});

/** Types a greeting, holds it, erases it, and moves on to the next language. */
function Greeting() {
  const [word, setWord] = useState(0);
  const [length, setLength] = useState(GREETINGS[0].length);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const full = [...GREETINGS[word]];
    let delay = deleting ? 45 : 110;
    if (!deleting && length === full.length) delay = 1800;
    if (deleting && length === 0) delay = 250;

    const id = window.setTimeout(() => {
      if (!deleting && length === full.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setWord((w) => (w + 1) % GREETINGS.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [word, length, deleting]);

  return (
    <p className="flex h-10 items-center text-[1.75rem] font-light tracking-[-0.02em] text-ink-soft sm:text-3xl">
      <span lang={word === 0 ? "en" : undefined}>{[...GREETINGS[word]].slice(0, length).join("")}</span>
      <span aria-hidden className="caret ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-px bg-accent" />
    </p>
  );
}

type Company = (typeof profile.shippedAt)[number];

function Logo({ company }: { company: Company }) {
  const { name, logo, width, height, displayHeight } = company;
  const mask = `url(${logo}) center / contain no-repeat`;
  return (
    <span className="flex items-center gap-2 text-faint transition-colors duration-300 hover:text-ink-soft">
      <span
        role="img"
        aria-label={name}
        className="block shrink-0 bg-current"
        style={{ height: displayHeight, aspectRatio: `${width} / ${height}`, mask, WebkitMask: mask }}
      />
      {"wordmark" in company && (
        <span aria-hidden className={company.wordmark}>
          {name}
        </span>
      )}
    </span>
  );
}

export default function Hero() {
  const time = useClock(profile.timezone);

  return (
    <section id="top" className="mx-auto max-w-[1000px] px-5 pt-36 pb-20 sm:px-8 sm:pt-44 sm:pb-24">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
        <div className="order-2 md:order-1">
          <motion.div {...rise(0)}>
            <Greeting />
          </motion.div>

          <motion.h1
            {...rise(0.12)}
            className="balance mt-6 text-[2rem] leading-[1.18] font-medium tracking-[-0.04em] text-ink sm:mt-8 sm:text-[2.6rem] lg:text-[2.8rem]"
          >
            I&apos;m a software engineer building{" "}
            <a href="#work" className="rule-link">
              agentic AI products
            </a>{" "}
            and{" "}
            <a href="#shiplog" className="rule-link">
              the systems behind them
            </a>{" "}
            that hold up in production.
          </motion.h1>
        </div>

        <motion.figure {...rise(0.25)} className="order-1 flex flex-col items-start gap-4 md:order-2 md:items-center">
          <div className="group relative h-36 w-36 overflow-hidden rounded-[2rem] border border-rule-strong sm:h-52 sm:w-52">
            <Image
              src="/avatar.jpg"
              alt={profile.name}
              fill
              priority
              sizes="(min-width: 640px) 208px, 144px"
              className="object-cover grayscale contrast-[1.05] transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          </div>
          <figcaption className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
            {profile.baseShort} · {profile.timezoneLabel} <span className="tabular">{time || "--:-- --"}</span>
          </figcaption>
        </motion.figure>
      </div>

      <motion.div {...rise(0.4)} className="mt-20 sm:mt-24">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Shipped at</p>
        <div className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-5">
          {profile.shippedAt.map((company) => (
            <div key={company.name} className="flex sm:justify-center">
              <Logo company={company} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
