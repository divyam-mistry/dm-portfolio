import Link from "next/link";
import { ArrowUpRight, Gauge, ServerCog, Sparkles, Wrench, type LucideIcon } from "lucide-react";
import Section from "@/components/ui/Section";
import FadeIn from "@/components/ui/FadeIn";
import { blogPosts, readingTime, type BlogPost } from "@/lib/blog";
import type { ShipKind } from "@/lib/data";

const KIND_ICON: Record<ShipKind, LucideIcon> = {
  feat: Sparkles,
  perf: Gauge,
  infra: ServerCog,
  fix: Wrench,
};

/** Square thumbnail tinted by the note's kind, standing in for the reference's article images. */
export function PostThumb({ kind, size = "md" }: { kind: ShipKind; size?: "md" | "lg" }) {
  const Icon = KIND_ICON[kind];
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-xl border border-rule ${
        size === "lg" ? "h-24 w-24" : "h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24"
      }`}
      style={{
        color: `var(--k-${kind})`,
        background: `radial-gradient(120% 120% at 20% 10%, color-mix(in srgb, var(--k-${kind}) 28%, transparent), color-mix(in srgb, var(--k-${kind}) 6%, var(--paper-sunken)))`,
      }}
    >
      <Icon className="h-7 w-7" strokeWidth={1.5} />
    </span>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card group flex h-full flex-col p-5 transition-colors hover:border-rule-strong sm:p-6"
    >
      <div className="flex items-start gap-4">
        <PostThumb kind={post.kind} />
        <div className="min-w-0">
          <span className="chip">{readingTime(post)} min read</span>
          <h3 className="balance mt-2.5 text-lg leading-snug font-semibold tracking-[-0.025em] text-ink sm:text-xl">
            {post.title}
          </h3>
        </div>
      </div>
      <p className="pretty mt-5 flex-1 text-[15px] leading-relaxed text-muted">{post.dek}</p>
      <div className="mt-5 flex items-center justify-between border-t border-rule pt-4">
        <span className="font-mono text-[11px] text-faint">{post.when}</span>
        <span className="inline-flex items-center gap-1 text-[13px] text-ink-soft transition-colors group-hover:text-ink">
          Read note
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

export default function Writing() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <Section
      id="writing"
      title="Writing"
      subtitle="Field notes on the bugs, payloads and races behind the ship log."
      action={{ label: "View all", href: "/blog" }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={(i % 2) * 0.08} className="h-full">
            <PostCard post={post} />
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
