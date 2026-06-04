import { posts, profile, projects } from "@/lib/content";

export const siteUrl = "https://page.dexoculus.com";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function sitePages() {
  const staticPages = ["/", "/about/", "/projects/", "/blog/", "/blog/tags/"];
  const projectPages = projects.map((project) => `/projects/${project.slug}/`);
  const postPages = posts.map((post) => `/blog/${post.slug}/`);

  return [...staticPages, ...projectPages, ...postPages];
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.handle,
  url: siteUrl,
  image: profile.avatar,
  email: profile.email,
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: profile.education.school
  },
  knowsAbout: profile.focus,
  sameAs: profile.links.map((link) => link.href)
};
