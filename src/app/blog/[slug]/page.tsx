import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogShell from "@/components/BlogShell";
import PostBody from "@/components/PostBody";
import { blogPosts, getPost, readingTime } from "@/lib/blog";
import type { ShipKind } from "@/lib/data";

const kindColor = (kind: ShipKind) => `var(--k-${kind})`;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Divyam Mistry`,
    description: post.dek,
    openGraph: { title: post.title, description: post.dek, type: "article" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const index = sorted.findIndex((p) => p.slug === post.slug);
  const next = sorted[index + 1];
  const prev = sorted[index - 1];

  return (
    <BlogShell>
      <article className="mx-auto max-w-[760px] px-5 py-16 sm:px-8 sm:py-24">
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
            <Link href="/blog" className="ink-link uppercase tracking-[0.14em] text-accent">
              § Field notes
            </Link>
            <span className="text-faint">/</span>
            <span style={{ color: kindColor(post.kind) }}>{post.kind}</span>
            <span className="text-faint">/</span>
            <span>{post.when}</span>
            <span className="text-faint">·</span>
            <span className="text-faint">{readingTime(post)} min read</span>
          </div>
          <h1 className="balance mt-4 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">{post.title}</h1>
          <p className="pretty mt-5 text-lg leading-relaxed text-muted">{post.dek}</p>
        </header>

        <div className="mt-10 border-t border-rule-strong pt-10">
          <PostBody blocks={post.body} />
        </div>

        <footer className="mt-12 border-t border-rule pt-6">
          <div className="flex flex-wrap gap-2 font-mono text-[11px] text-faint">
            {post.tags.map((tag) => (
              <span key={tag}>#{tag.toLowerCase().replace(/[^a-z0-9]+/g, "")}</span>
            ))}
          </div>

          <nav className="mt-8 grid gap-4 sm:grid-cols-2">
            {next && (
              <Link href={`/blog/${next.slug}`} className="group rounded-lg border border-rule p-4 transition-colors hover:border-rule-strong">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Older</span>
                <span className="mt-1 block font-serif text-lg leading-snug text-ink group-hover:text-accent">
                  {next.title}
                </span>
              </Link>
            )}
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="group rounded-lg border border-rule p-4 transition-colors hover:border-rule-strong sm:text-right"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Newer</span>
                <span className="mt-1 block font-serif text-lg leading-snug text-ink group-hover:text-accent">
                  {prev.title}
                </span>
              </Link>
            )}
          </nav>
        </footer>
      </article>
    </BlogShell>
  );
}
