"use client";

import SectionIntro from "@/components/ui/SectionIntro";
import FadeIn from "@/components/ui/FadeIn";
import { education, skills } from "@/lib/data";

const focusAreas = skills.find((s) => s.category === "Frameworks/Libraries")?.technologies.slice(0, 4) ?? [];

const facts = [
  { label: "Location", value: education.location },
  { label: "Education", value: education.institution },
  { label: "Focus", value: focusAreas.join(", ") },
  { label: "Off the clock", value: "Basketball — State Level Tournament captain, Baroda" },
];

export default function AboutSection() {
  return (
    <section id="about" className="px-6 py-24 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionIntro index="02" title="About" />

        <FadeIn>
          <p className="max-w-3xl text-3xl leading-snug text-paper sm:text-4xl">
            I&apos;m a full-stack developer who turns{" "}
            <span className="font-serif italic text-volt">ambitious ideas</span>{" "}
            into fast, reliable products — spanning backend systems, mobile apps, and real-time
            data pipelines. I&apos;ve solved 600+ competitive programming problems and I&apos;m
            always chasing the next hard problem worth solving.
          </p>
        </FadeIn>

        <div className="mt-16 divide-y divide-line border-t border-line">
          {facts.map((fact, i) => (
            <FadeIn key={fact.label} delay={i * 0.06} y={12}>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-faint">
                  {fact.label}
                </span>
                <span className="text-lg text-paper">{fact.value}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
