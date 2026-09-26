import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { achievements, certifications, education } from "@/lib/data";

export default function Record() {
  return (
    <Section id="record" index="05" title="Record" note="Off-the-clock results, schooling, and paperwork.">
      <div className="grid grid-cols-1 border-t border-rule-strong sm:grid-cols-3">
        {achievements.map((a, i) => (
          <FadeIn
            key={a.title}
            delay={i * 0.08}
            className={`border-rule py-8 ${i > 0 ? "border-t sm:border-t-0 sm:border-l sm:pl-6" : ""} sm:pr-6`}
          >
            <p className="font-serif text-6xl leading-none text-accent italic">{a.mark}</p>
            <h3 className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink">{a.title}</h3>
            <p className="pretty mt-2 leading-relaxed text-muted">{a.description}</p>
          </FadeIn>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14">
        <FadeIn className="col-span-12 md:col-span-7">
          <p className="border-b border-rule-strong pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Education
          </p>
          <div className="flex items-start justify-between gap-6 pt-6">
            <div>
              <h3 className="font-serif text-3xl leading-tight text-ink">{education.degree}</h3>
              <p className="mt-1 text-ink-soft">
                {education.institution} · <span className="text-muted">{education.location}</span>
              </p>
            </div>
            {education.cgpa && (
              <div className="shrink-0 text-right">
                <p className="tabular font-serif text-4xl leading-none text-ink">{education.cgpa}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">CGPA / 10</p>
              </div>
            )}
          </div>
          <p className="mt-2 font-mono text-[11px] text-faint">Graduated {education.graduation}</p>
          {education.coursework && (
            <p className="pretty mt-6 text-[15px] leading-relaxed text-muted">
              <span className="text-ink-soft">Coursework — </span>
              {education.coursework.join(" · ")}
            </p>
          )}
        </FadeIn>

        <FadeIn delay={0.1} className="col-span-12 md:col-span-5">
          <p className="border-b border-rule-strong pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Certifications
          </p>
          <ul>
            {certifications.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-4 border-b border-rule py-4">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer" className="ink-link text-ink-soft">
                    {c.name}
                  </a>
                ) : (
                  <span className="text-ink-soft">{c.name}</span>
                )}
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}
