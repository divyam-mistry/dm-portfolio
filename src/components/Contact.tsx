"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import { contactInfo, profile, socialLinks } from "@/lib/data";
import { useClock } from "@/lib/hooks";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useClock(profile.timezone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  return (
    <footer id="contact" className="border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-5 pt-20 pb-10 sm:px-8 sm:pt-28">
        <FadeIn>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">§ 06 — Correspondence</p>
          <h2 className="balance mt-6 font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.02em] text-ink">
            Have something <em className="text-accent">worth</em> building?
          </h2>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-12 flex flex-col gap-6 border-y border-rule-strong py-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${contactInfo.email}`}
            className="ink-link w-fit font-serif text-3xl text-ink sm:text-5xl"
          >
            {contactInfo.email}
          </a>
          <button
            onClick={copy}
            className="flex h-10 w-fit items-center gap-2 rounded-full border border-rule-strong px-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {copied ? "Copied ✓" : "Copy address"}
              </motion.span>
            </AnimatePresence>
          </button>
        </FadeIn>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 font-mono text-[11px] sm:grid-cols-4">
          <div>
            <p className="uppercase tracking-[0.14em] text-faint">Elsewhere</p>
            <ul className="mt-3 space-y-1.5 text-ink-soft">
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="ink-link">
                    {l.label} ↗
                  </a>
                </li>
              ))}
              <li>
                <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`} className="ink-link">
                  {contactInfo.phone}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="uppercase tracking-[0.14em] text-faint">Local time</p>
            <p className="tabular mt-3 text-ink-soft">
              {time || "--:--"} {profile.timezoneLabel}
            </p>
            <p className="mt-1.5 text-muted">{profile.base}</p>
          </div>
          <div className="col-span-2">
            <p className="uppercase tracking-[0.14em] text-faint">Colophon</p>
            <p className="pretty mt-3 max-w-sm leading-relaxed text-muted">
              Set in Instrument Serif, Geist and Geist Mono. Built with Next.js and Framer Motion, printed on Vercel.
              Press <kbd className="text-ink-soft">⌘K</kbd> anywhere to navigate.
            </p>
          </div>
        </div>

        <div className="mt-20 flex items-end justify-between gap-6 border-t border-rule pt-6">
          <p className="font-mono text-[11px] text-faint">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <a href="#top" className="ink-link font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
