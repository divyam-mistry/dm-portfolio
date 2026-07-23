"use client";

import SectionIntro from "@/components/ui/SectionIntro";
import FadeIn from "@/components/ui/FadeIn";
import { education } from "@/lib/data";

const facts = [
  { label: "Degree", value: education.degree },
  { label: "Institution", value: education.institution },
  { label: "Location", value: education.location },
  { label: "Graduated", value: education.graduation },
  ...(education.cgpa ? [{ label: "CGPA", value: `${education.cgpa}` }] : []),
];

export default function EducationSection() {
  return (
    <section id="education" className="px-6 py-24 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionIntro index="08" title="Education" />

        <div className="divide-y divide-line border-t border-line">
          {facts.map((fact, i) => (
            <FadeIn key={fact.label} delay={i * 0.05} y={12}>
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="w-40 shrink-0 font-mono text-xs uppercase tracking-widest text-faint">
                  {fact.label}
                </span>
                <span className="text-lg text-paper">{fact.value}</span>
              </div>
            </FadeIn>
          ))}
        </div>

        {education.coursework && education.coursework.length > 0 && (
          <FadeIn delay={0.3} className="mt-10">
            <p className="font-mono text-xs uppercase tracking-widest text-volt">Relevant coursework</p>
            <p className="mt-3 text-lg text-muted">{education.coursework.join(", ")}</p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
