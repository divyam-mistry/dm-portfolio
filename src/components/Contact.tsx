"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, Check, Copy } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { contactInfo, profile, socialLinks } from "@/lib/data";
import { useClock } from "@/lib/hooks";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const time = useClock(profile.timezone);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contactInfo.email}`;
    }
  };

  return (
    <footer id="contact" className="border-t border-rule bg-paper-sunken">
      <div className="mx-auto max-w-[1000px] px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <FadeIn>
          <h2 className="text-4xl font-bold tracking-[-0.035em] text-ink sm:text-[2.75rem]">Contact</h2>
          <p className="pretty mt-5 max-w-2xl text-lg text-muted sm:text-xl">
            Always happy to talk about AI products, platform engineering, or something worth building.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10 flex items-center gap-3">
          <a
            href={`mailto:${contactInfo.email}`}
            className="rule-link font-mono text-lg text-ink decoration-ink-soft hover:decoration-accent sm:text-2xl"
          >
            {contactInfo.email}
          </a>
          <button
            onClick={copy}
            aria-label={copied ? "Email copied" : "Copy email address"}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-rule hover:text-ink"
          >
            {copied ? <Check aria-hidden className="h-4 w-4 text-accent" /> : <Copy aria-hidden className="h-4 w-4" />}
          </button>
          <span role="status" className="sr-only">
            {copied ? "Copied" : ""}
          </span>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-14">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">Explore more</p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-[17px]">
            {socialLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="rule-link text-ink-soft hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/blog" className="rule-link text-ink-soft hover:text-ink">
                Field notes
              </Link>
            </li>
            <li>
              <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`} className="rule-link text-ink-soft hover:text-ink">
                {contactInfo.phone}
              </a>
            </li>
          </ul>
        </FadeIn>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
          <p className="font-mono text-[11px] text-faint">
            © {new Date().getFullYear()} {profile.name} · {profile.timezoneLabel}{" "}
            <span className="tabular">{time || "--:-- --"}</span> · Press ⌘K to navigate
          </p>
          <a
            href="#top"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-rule-strong px-3.5 font-mono text-[12px] text-ink-soft transition-colors hover:border-faint hover:text-ink"
          >
            Back to top
            <ArrowUp aria-hidden className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
