import { posts } from "@/lib/content";
import { absoluteUrl, escapeXml, siteUrl } from "@/lib/seo";

export function GET() {
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}/`);
      const pubDate = post.date ? `
  <pubDate>${escapeXml(post.date.toUTCString())}</pubDate>` : "";

      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(url)}</link>
  <guid>${escapeXml(url)}</guid>${pubDate}
  <description>${escapeXml(post.description)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Dexter Oculus Notes</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>Technical notes, research logs, and case reports by Hyeonbin Han.</description>
  <language>en</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
