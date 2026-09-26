import type { Metadata } from "next";
import BlogShell from "@/components/BlogShell";
import { PostCard } from "@/components/Writing";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Field notes — Divyam Mistry",
  description:
    "Engineering write-ups from production: streaming payload diets, OOM post-mortems, webhook races, long-lived SSE streams and CI security.",
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: "Field notes — Divyam Mistry" },
};

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <BlogShell>
      <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 sm:py-24">
        <header>
          <h1 className="text-4xl font-bold tracking-[-0.035em] text-ink sm:text-5xl">Field notes</h1>
          <p className="pretty mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            Longer write-ups of work at Strique that the ship log only headlines — bugs fixed, payloads shrunk,
            webhooks tamed. Systems are described generically, and numbers appear only where they were actually
            measured.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </BlogShell>
  );
}
