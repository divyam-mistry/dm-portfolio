import type { ReactNode } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { contactInfo, profile } from "@/lib/data";

/** Header and footer chrome shared by the blog index and post pages. */
export default function BlogShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Blog"
          className="mx-auto flex h-12 max-w-[1040px] items-center justify-between gap-4 rounded-full border border-rule bg-paper-raised/70 pr-2 pl-5 backdrop-blur-xl"
        >
          <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
            {profile.name}
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="rounded-full px-3 py-1.5 text-[13px] text-muted transition-colors hover:text-ink">
              Field notes
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="mt-10 border-t border-rule">
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
