"use client";

import RevealText from "@/components/ui/RevealText";
import FadeIn from "@/components/ui/FadeIn";
import { contactInfo } from "@/lib/data";

export default function ContactSection() {
  return (
    <footer>
      <section className="bg-volt px-6 py-24 text-ink sm:px-12 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="font-mono text-xs tracking-[0.25em] text-ink/70">SAY HELLO</p>
          </FadeIn>

          <h2 className="mt-6 font-display text-5xl font-medium leading-[0.95] sm:text-7xl">
            <RevealText text="Let's build something" />
            <br />
            <span className="font-serif italic font-normal">
              <RevealText text="remarkable together." delay={0.15} />
            </span>
          </h2>

          <FadeIn delay={0.35}>
            <a
              href={`mailto:${contactInfo.email}`}
              data-cursor="Email"
              className="mt-14 inline-block border-b-2 border-ink/40 font-display text-3xl font-medium transition-colors hover:border-ink sm:text-5xl"
            >
              {contactInfo.email}
            </a>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
              {[
                { label: "GitHub", href: contactInfo.github },
                { label: "LinkedIn", href: contactInfo.linkedin },
                { label: "LeetCode", href: contactInfo.leetcode },
                { label: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/[^+\d]/g, "")}` },
              ].map((item) => (
                <a key={item.label} href={item.href} data-cursor="Open" className="opacity-70 transition-opacity hover:opacity-100">
                  {item.label}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-faint sm:flex-row sm:px-12">
        <p>&copy; {new Date().getFullYear()} Divyam Mistry. All rights reserved.</p>
        <p className="font-mono">Built with Next.js, Tailwind CSS &amp; Framer Motion</p>
      </div>
    </footer>
  );
}
