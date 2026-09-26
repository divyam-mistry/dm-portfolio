import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

interface SectionAction {
  label: string;
  href: string;
}

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  action?: SectionAction;
  children: ReactNode;
}

/** Links that leave the page get ↗, in-page jumps get →. */
export function ActionLink({ label, href }: SectionAction) {
  const inPage = href.startsWith("#");
  const Icon = inPage ? ArrowRight : ArrowUpRight;
  const Anchor = href.startsWith("/") ? Link : "a";
  return (
    <Anchor
      href={href}
      className="group inline-flex items-center gap-1.5 font-mono text-[13px] text-muted transition-colors hover:text-ink"
    >
      {label}
      <Icon
        aria-hidden
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px"
      />
    </Anchor>
  );
}

/** A full-bleed band with a hairline on top, a bold heading and an optional "View all" link. */
export default function Section({ id, title, subtitle, action, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-rule">
      <div className="mx-auto max-w-[1000px] px-5 py-24 sm:px-8 sm:py-32">
        <FadeIn y={12} className="mb-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 sm:mb-14">
          <div>
            <h2 className="text-4xl font-bold tracking-[-0.035em] text-ink sm:text-[2.75rem]">{title}</h2>
            {subtitle && <p className="pretty mt-2 max-w-2xl text-lg text-muted">{subtitle}</p>}
          </div>
          {action && <ActionLink {...action} />}
        </FadeIn>
        {children}
      </div>
    </section>
  );
}
