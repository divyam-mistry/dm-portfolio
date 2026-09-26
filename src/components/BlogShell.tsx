import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { contactInfo, profile } from "@/lib/data";

/** Header and footer chrome shared by the blog index and post pages. */
export default function BlogShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-rule">
        <div className="mx-auto flex h-14 max-w-[760px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="font-serif text-lg text-ink">
            {profile.name}
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="ink-link font-mono text-[11px] uppercase tracking-[0.12em] text-muted hover:text-ink"
            >
              Field notes
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-between gap-3 px-5 py-8 font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:px-8">
          <Link href="/" className="ink-link hover:text-ink">
            ← {profile.name}
          </Link>
          <a href={`mailto:${contactInfo.email}`} className="ink-link normal-case tracking-normal hover:text-ink">
            {contactInfo.email}
          </a>
        </div>
      </footer>
    </>
  );
}
