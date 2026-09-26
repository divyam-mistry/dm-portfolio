import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { skills } from "@/lib/data";

export default function Toolkit() {
  return (
    <Section id="toolkit" title="Toolkit" subtitle="What I reach for, roughly in order.">
      <div className="grid gap-5 sm:grid-cols-2">
        {skills.map((group, index) => (
          <FadeIn key={group.category} delay={(index % 2) * 0.06} className="card p-5 sm:p-6">
            <p className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{group.category}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-rule-strong px-3 py-1 text-[13px] text-ink-soft transition-colors hover:border-faint hover:text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
