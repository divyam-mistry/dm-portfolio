import Link from "next/link";
import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { blogPosts, readingTime } from "@/lib/blog";
import type { ShipKind } from "@/lib/data";

const kindColor = (kind: ShipKind) => `var(--k-${kind})`;

export default function Writing() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Section
      id="writing"
      index="03"
      title="Field notes"
      note="Longer write-ups of things the ship log only headlines — incidents, payload diets and what they taught me."
    >
      <div className="hidden grid-cols-12 gap-x-6 border-b border-rule-strong pb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:grid">
        <span className="col-span-1">No.</span>
        <span className="col-span-8">Note</span>
        <span className="col-span-3 text-right">Filed</span>
      </div>

      <ul>
        {posts.map((post, index) => (
          <FadeIn as="li" key={post.slug} delay={index * 0.05} y={12} className="border-b border-rule">
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 py-6 sm:grid-cols-12 sm:gap-x-6 sm:py-7"
            >
              <span className="tabular font-mono text-xs text-faint sm:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 sm:col-span-8">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
                  <span style={{ color: kindColor(post.kind) }}>{post.kind}</span>
                  <span className="text-faint">/</span>
                  <span className="text-faint">{readingTime(post)} min read</span>
                  <span className="text-faint sm:hidden">· {post.when}</span>
                </span>
                <span className="mt-2 block font-serif text-3xl leading-tight text-ink transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-accent sm:text-[2.1rem]">
                  {post.title}
                </span>
                <span className="pretty mt-2 block max-w-2xl text-[15px] leading-relaxed text-muted">{post.dek}</span>
              </span>
              <span className="hidden justify-end pt-1 text-right font-mono text-xs whitespace-nowrap text-muted sm:col-span-3 sm:flex">
                {post.when}
              </span>
            </Link>
          </FadeIn>
        ))}
      </ul>

      <div className="pt-6">
        <Link href="/blog" className="ink-link font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          Open the notebook ↗
        </Link>
      </div>
    </Section>
  );
}
