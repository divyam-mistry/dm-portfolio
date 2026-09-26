import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { achievements, certifications, education } from "@/lib/data";

/** Patent-style card from the reference: mono label, status chip, body, and a meta footer. */
function RecordCard({
  label,
  chip,
  title,
  body,
  meta,
}: {
  label: string;
  chip: string;
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    <div className="card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">{label}</span>
        <span className="chip">{chip}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.025em] text-ink">{title}</h3>
      <p className="pretty mt-2 flex-1 text-[15px] leading-relaxed text-muted">{body}</p>
      {meta && <p className="mt-5 border-t border-rule pt-4 font-mono text-[11px] text-faint">{meta}</p>}
    </div>
  );
}

export default function Record() {
  return (
    <Section id="record" title="Record" subtitle="Off-the-clock results, schooling, and paperwork.">
      <div className="grid gap-5 sm:grid-cols-3">
        {achievements.map((a, i) => (
          <FadeIn key={a.title} delay={i * 0.06} className="h-full">
            <RecordCard label={`Record ${String(i + 1).padStart(2, "0")}`} chip={a.mark} title={a.title} body={a.description} />
          </FadeIn>
        ))}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <FadeIn className="h-full">
          <RecordCard
            label="Education"
            chip={education.cgpa ? `CGPA ${education.cgpa}` : education.graduation}
            title={education.degree}
            body={`${education.institution}, ${education.location}. Coursework in ${education.coursework?.join(", ")}.`}
            meta={`Graduated ${education.graduation}`}
          />
        </FadeIn>

        <FadeIn delay={0.06} className="card h-full p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">Certifications</span>
            <span className="chip">{certifications.length}</span>
          </div>
          <ul className="mt-3 divide-y divide-rule">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-4 py-3">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noreferrer" className="ink-link text-[15px] text-ink-soft">
                    {c.name}
                  </a>
                ) : (
                  <span className="text-[15px] text-ink-soft">{c.name}</span>
                )}
                <span className="shrink-0 font-mono text-[11px] text-faint">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}
