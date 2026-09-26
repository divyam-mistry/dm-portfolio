import type { ReactNode } from "react";
import FadeIn from "@/components/ui/FadeIn";

interface SectionProps {
  id: string;
  index: string;
  title: string;
  note?: string;
  children: ReactNode;
}

/**
 * Broadsheet section: a sticky margin column carrying the section mark and
 * title, with the content set in the wider right column.
 */
export default function Section({ id, index, title, note, children }: SectionProps) {
  return (
    <section id={id} className="border-t border-rule">
      <div className="mx-auto grid max-w-[1200px] grid-cols-12 gap-x-6 px-5 py-20 sm:px-8 sm:py-28">
        <header className="col-span-12 mb-12 lg:col-span-3 lg:mb-0">
          <FadeIn className="lg:sticky lg:top-24" y={10}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">§ {index}</p>
            <h2 className="mt-3 font-serif text-4xl leading-none text-ink sm:text-5xl">{title}</h2>
            {note && <p className="pretty mt-5 max-w-[30ch] text-sm leading-relaxed text-muted">{note}</p>}
          </FadeIn>
        </header>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
