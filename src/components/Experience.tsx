import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <Section id="experience" index="03" title="Experience" note="Teams I've shipped with, and what I owned there.">
      <ol className="border-t border-rule-strong">
        {experiences.map((exp, index) => (
          <FadeIn
            as="li"
            key={exp.company}
            delay={index * 0.06}
            className="grid grid-cols-12 gap-x-6 gap-y-4 border-b border-rule py-10"
          >
            <div className="col-span-12 font-mono text-[11px] text-muted sm:col-span-3">
              <p className="tabular text-ink-soft">{exp.period}</p>
              {exp.location && <p className="mt-1 text-faint">{exp.location}</p>}
            </div>
            <div className="col-span-12 sm:col-span-9">
              <h3 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">{exp.role}</h3>
              <p className="mt-1 text-accent">{exp.company}</p>
              <ul className="mt-6 space-y-3">
                {exp.description.map((item, i) => (
                  <li key={i} className="pretty grid grid-cols-[1.75rem_1fr] leading-relaxed text-ink-soft">
                    <span className="tabular pt-[0.2rem] font-mono text-[10px] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </ol>
    </Section>
  );
}
