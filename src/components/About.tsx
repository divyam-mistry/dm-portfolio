import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { profile, stats } from "@/lib/data";

export default function About() {
  return (
    <Section id="about" title="About" action={{ label: "View experience", href: "#experience" }}>
      <FadeIn>
        <p className="pretty max-w-3xl text-lg leading-[1.75] text-muted sm:text-xl">{profile.about}</p>
      </FadeIn>

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <FadeIn key={stat.label} delay={0.08 * i} y={10} className="flex flex-col-reverse gap-1.5">
            <dt className="text-[13px] text-muted">{stat.label}</dt>
            <dd className="tabular text-3xl font-semibold tracking-[-0.03em] text-ink">{stat.value}</dd>
          </FadeIn>
        ))}
      </dl>
    </Section>
  );
}
