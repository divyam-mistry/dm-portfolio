import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { experiences } from "@/lib/data";

const initials = (company: string) =>
  company
    .replace(/\(.*\)/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export default function Experience() {
  return (
    <Section id="experience" title="Experience" subtitle="Teams I've shipped with, and what I owned there.">
      <ol className="space-y-5">
        {experiences.map((exp, index) => {
          const current = exp.period.includes("Present");
          return (
            <FadeIn as="li" key={exp.company} delay={index * 0.05} className="card p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-rule bg-paper-sunken font-mono text-[13px] font-medium text-ink-soft"
                  >
                    {initials(exp.company)}
                  </span>
                  <div>
                    <h3 className="text-lg leading-tight font-semibold tracking-[-0.025em] text-ink sm:text-xl">
                      {exp.role}
                    </h3>
                    <p className="mt-0.5 text-[15px] text-muted">
                      {exp.company}
                      {exp.location && <span className="text-faint"> · {exp.location}</span>}
                    </p>
                  </div>
                </div>
                <span className={current ? "chip border-accent/40 text-accent" : "chip"}>{exp.period}</span>
              </div>

              <ul className="mt-6 space-y-2.5 border-t border-rule pt-5">
                {exp.description.map((item, i) => (
                  <li key={i} className="pretty grid grid-cols-[1rem_1fr] leading-relaxed text-ink-soft">
                    <span aria-hidden className="mt-[0.7em] h-1 w-1 rounded-full bg-faint" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          );
        })}
      </ol>
    </Section>
  );
}
