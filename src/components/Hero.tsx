"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { useClock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

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

function Wordmark({ name }: { name: string }) {
  // Typographic stand-ins for each logo, so the row reads like the reference's logo strip.
  const styles: Record<string, string> = {
    Strique: "text-xl font-bold tracking-[-0.04em]",
    "Resilient Tech": "text-lg font-semibold tracking-[-0.03em]",
    ERPNext: "font-mono text-base font-medium tracking-tight",
    Simulas: "text-xs font-semibold uppercase tracking-[0.42em]",
    Nearlikes: "text-lg font-extrabold italic tracking-[-0.03em]",
  };
  return (
    <span
      className={cn(
        "whitespace-nowrap text-faint transition-colors duration-300 hover:text-ink-soft",
        styles[name] ?? "text-lg font-semibold",
      )}
    >
      {name}
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
          {profile.shippedAt.map((name) => (
            <div key={name} className="flex sm:justify-center">
              <Wordmark name={name} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
