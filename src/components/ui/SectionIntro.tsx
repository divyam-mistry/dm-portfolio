"use client";

import RevealText from "./RevealText";
import { cn } from "@/lib/utils";

interface SectionIntroProps {
  index: string;
  title: string;
  className?: string;
}

export default function SectionIntro({ index, title, className }: SectionIntroProps) {
  return (
    <div className={cn("relative mb-16 sm:mb-24", className)}>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-16 right-0 font-display text-[22vw] leading-none text-line select-none sm:text-[9vw]"
      >
        {index}
      </span>
      <RevealText
        text={title}
        as="h2"
        className="relative font-display text-4xl font-medium text-paper sm:text-6xl"
      />
    </div>
  );
}
