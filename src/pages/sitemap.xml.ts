import { posts } from "@/lib/content";
import { absoluteUrl, escapeXml, sitePages } from "@/lib/seo";

export function GET() {
  const postDates = new Map(posts.map((post) => [`/blog/${post.slug}/`, post.date]));

  const urls = sitePages()
    .map((path) => {
      const lastmod = postDates.get(path)?.toISOString();

      return `<url>
  <loc>${escapeXml(absoluteUrl(path))}</loc>${lastmod ? `
  <lastmod>${escapeXml(lastmod)}</lastmod>` : ""}
</url>`;
    })
    .join("\n");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
