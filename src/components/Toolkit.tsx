import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { skills } from "@/lib/data";

export default function Toolkit() {
  return (
    <Section id="toolkit" index="04" title="Toolkit" note="Set in the order I reach for them.">
      <div className="grid grid-cols-2 border-t border-rule-strong sm:grid-cols-4">
        {skills.map((group, index) => (
          <FadeIn
            key={group.category}
            delay={index * 0.06}
            className={`border-rule pt-5 pb-8 ${index % 2 === 1 ? "border-l pl-5" : "pr-5"} ${
              index > 0 ? "sm:border-l sm:pl-5" : ""
            } ${index < 2 ? "border-b sm:border-b-0" : "pt-8 sm:pt-5"}`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="text-accent">{String.fromCharCode(97 + index)}.</span> {group.category}
            </p>
            <ul className="mt-5 space-y-1.5">
              {group.technologies.map((tech) => (
                <li
                  key={tech}
                  className="font-serif text-2xl leading-snug text-ink transition-colors hover:text-accent hover:italic"
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
