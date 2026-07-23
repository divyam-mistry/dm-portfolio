"use client";

import SectionIntro from "@/components/ui/SectionIntro";
import FadeIn from "@/components/ui/FadeIn";
import { experiences } from "@/lib/data";

export default function ExperienceSection() {
  return (
    <section id="experience" className="px-6 py-24 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionIntro index="03" title="Experience" />

        <div className="border-t border-line">
          {experiences.map((exp, index) => (
            <FadeIn key={exp.company} delay={index * 0.08}>
              <div className="grid grid-cols-1 gap-4 border-b border-line py-10 sm:grid-cols-12 sm:gap-6">
                <span className="font-mono text-sm text-faint sm:col-span-1">0{index + 1}</span>

                <div className="sm:col-span-7">
                  <h3 className="font-display text-2xl font-medium text-paper sm:text-3xl">{exp.role}</h3>
                  <p className="mt-1 text-volt">{exp.company}</p>
                  <ul className="mt-5 space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-faint" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <span className="font-mono text-xs text-faint sm:col-span-4 sm:text-right">{exp.period}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
