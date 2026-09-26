import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = blogPosts.map((p) => p.date).sort().at(-1);

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestPost ? new Date(`${latestPost}-01`) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}-01`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
