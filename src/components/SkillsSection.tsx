"use client";

import SectionIntro from "@/components/ui/SectionIntro";
import FadeIn from "@/components/ui/FadeIn";
import Marquee from "@/components/ui/Marquee";
import { skills } from "@/lib/data";

const allTech = skills.flatMap((s) => s.technologies);

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="px-6 sm:px-12">
        <SectionIntro index="05" title="Skills" />
      </div>

      <div className="space-y-2">
        <Marquee speed={42}>
          {allTech.map((tech, i) => (
            <span key={i} className="font-display text-stroke text-[8vw] font-medium leading-none whitespace-nowrap sm:text-[5vw]">
              {tech}
            </span>
          ))}
        </Marquee>
        <Marquee speed={50} reverse>
          {allTech
            .slice()
            .reverse()
            .map((tech, i) => (
              <span key={i} className="font-display text-[8vw] font-medium leading-none text-paper whitespace-nowrap sm:text-[5vw]">
                {tech}
              </span>
            ))}
        </Marquee>
      </div>

      <div className="mx-auto mt-20 max-w-5xl px-6 sm:px-12">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2">
          {skills.map((skill, index) => (
            <FadeIn key={skill.category} delay={index * 0.06}>
              <p className="font-mono text-xs uppercase tracking-widest text-volt">{skill.category}</p>
              <p className="mt-3 text-lg text-muted">{skill.technologies.join(", ")}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
