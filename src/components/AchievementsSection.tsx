"use client";

import SectionIntro from "@/components/ui/SectionIntro";
import FadeIn from "@/components/ui/FadeIn";
import { achievements } from "@/lib/data";

const marks = ["600+", "TOP 15", "CAPTAIN"];
const offsets = ["sm:mt-0", "sm:mt-16", "sm:mt-4"];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="px-6 py-24 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionIntro index="06" title="Achievements" />

        <div className="grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
          {achievements.map((achievement, index) => (
            <FadeIn key={achievement.title} delay={index * 0.1} className={offsets[index % offsets.length]}>
              <p className="font-display text-6xl font-medium text-volt">{marks[index % marks.length]}</p>
              <h3 className="mt-4 font-mono text-xs uppercase tracking-widest text-paper">
                {achievement.title}
              </h3>
              <p className="mt-3 text-muted leading-relaxed">{achievement.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
