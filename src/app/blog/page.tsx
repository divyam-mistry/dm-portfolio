import type { Metadata } from "next";
import Link from "next/link";
import BlogShell from "@/components/BlogShell";
import { blogPosts, readingTime } from "@/lib/blog";
import type { ShipKind } from "@/lib/data";

export const metadata: Metadata = {
  title: "Field notes — Divyam Mistry",
  description:
    "Engineering write-ups from production: streaming payload diets, OOM post-mortems, webhook races, long-lived SSE streams and CI security.",
};

const kindColor = (kind: ShipKind) => `var(--k-${kind})`;

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <BlogShell>
      <div className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 sm:py-24">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">§ Field notes</p>
          <h1 className="mt-3 font-serif text-5xl leading-none text-ink sm:text-6xl">Field notes</h1>
          <p className="pretty mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Longer write-ups of work at Strique that the ship log only headlines — bugs fixed, payloads shrunk,
            webhooks tamed. Systems are described generically, and numbers appear only where they were actually
            measured.
          </p>
        </header>

        <ol className="mt-12 border-t border-rule-strong">
          {posts.map((post, index) => (
            <li key={post.slug} className="border-b border-rule">
              <Link href={`/blog/${post.slug}`} className="group block py-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
                  <span className="tabular text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-faint">/</span>
                  <span style={{ color: kindColor(post.kind) }}>{post.kind}</span>
                  <span className="text-faint">/</span>
                  <span>{post.when}</span>
                  <span className="text-faint">·</span>
                  <span className="text-faint">{readingTime(post)} min read</span>
                </div>
                <h2 className="mt-2 font-serif text-3xl leading-tight text-ink transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-accent sm:text-4xl">
                  {post.title}
                </h2>
                <p className="pretty mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{post.dek}</p>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </BlogShell>
  );
}
