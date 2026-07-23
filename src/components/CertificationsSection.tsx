"use client";

import SectionIntro from "@/components/ui/SectionIntro";
import FadeIn from "@/components/ui/FadeIn";
import { certifications } from "@/lib/data";

export default function CertificationsSection() {
  return (
    <section id="certifications" className="px-6 py-24 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionIntro index="07" title="Certifications" />

        <div className="border-t border-line">
          {certifications.map((cert, index) => (
            <FadeIn key={cert.name} delay={index * 0.06}>
              <div className="flex flex-col gap-1 border-b border-line py-6 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-faint">0{index + 1}</span>
                  <h3 className="text-lg text-paper">{cert.name}</h3>
                </div>
                <span className="pl-8 font-mono text-xs uppercase tracking-widest text-faint sm:pl-0">
                  {cert.issuer}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
