import { profile } from "@/data/profile";

export { profile };

type MarkdownModule = {
  frontmatter: Record<string, unknown>;
  Content: unknown;
  getHeadings?: () => Heading[];
  rawContent?: () => string;
};

export type ProjectMediaType = "image" | "video";

export type Project = {
  name: string;
  tools: string[];
  featured: boolean;
  featuredOrder: number;
  image?: string;
  video?: string;
  mediaUrl?: string;
  mediaType: ProjectMediaType;
  description: string;
  externalUrl?: string;
  slug: string;
  sequence: number;
  headings: Heading[];
  richFeatures: RichFeatures;
  Content: unknown;
};

export type RichFeatures = {
  chart: boolean;
  mermaid: boolean;
  three: boolean;
  math: boolean;
};

export type Heading = {
  depth: number;
  slug: string;
  text: string;
};

export type Post = {
  title: string;
  tags: string[];
  featured: boolean;
  featuredOrder: number;
  image?: string;
  video?: string;
  mediaUrl?: string;
  mediaType: ProjectMediaType;
  description: string;
  externalUrl?: string;
  slug: string;
  headings: Heading[];
  readingMinutes: number;
  richFeatures: RichFeatures;
  Content: unknown;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

const tagAliases = new Map([
  ["ai worker", "AI Worker"],
  ["physical ai tools", "Physical AI Tools"],
  ["huggingface", "Hugging Face"],
  ["zed mini", "ZED Mini"],
  ["robotis", "ROBOTIS"]
]);

function normalizeTags(value: unknown) {
  const normalized = asStringArray(value).map((tag) => tagAliases.get(tag.toLowerCase()) || tag);
  return Array.from(new Set(normalized));
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "on", "1"].includes(normalized)) return true;
    if (["false", "no", "off", "0"].includes(normalized)) return false;
  }
  return fallback;
}

function asNumber(value: unknown, fallback = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeMediaType(value: unknown): ProjectMediaType | undefined {
  const normalized = asString(value).toLowerCase();
  return normalized === "video" || normalized === "image" ? normalized : undefined;
}

function inferMediaType(url: string | undefined): ProjectMediaType {
  const cleanUrl = (url || "").split("?")[0].toLowerCase();
  return /\.(mp4|webm|mov|m4v|ogv|ogg)$/.test(cleanUrl) ? "video" : "image";
}

function extractFirstMedia(source = "") {
  const prose = stripFencedBlocks(source);
  const candidates: { index: number; url: string; type: ProjectMediaType }[] = [];
  const collect = (pattern: RegExp, urlGroup: number, forcedType?: ProjectMediaType) => {
    for (const match of prose.matchAll(pattern)) {
      const url = match[urlGroup]?.trim().replace(/^<|>$/g, "");
      if (!url) continue;
      candidates.push({
        index: match.index ?? Number.MAX_SAFE_INTEGER,
        url,
        type: forcedType || inferMediaType(url)
      });
    }
  };

  collect(/!\[[^\]]*]\(\s*(<[^>]+>|[^\s)]+)(?:\s+["'][^"']*["'])?\s*\)/g, 1);
  collect(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, 1, "image");
  collect(/<(?:video|source)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi, 1, "video");
  collect(/\[[^\]]+]\(\s*(https?:\/\/github\.com\/user-attachments\/assets\/[^)\s]+)\s*\)/gi, 1, "video");
  collect(/\[[^\]]+]\(\s*(<?[^)\s>]+\.(?:mp4|webm|mov|m4v|ogv|ogg)(?:\?[^)\s>]*)?>?)\s*\)/gi, 1, "video");

  return candidates.sort((a, b) => a.index - b.index)[0];
}

function fileBase(path: string) {
  return path.split(/[\\/]/).pop()?.replace(/\.md$/, "") ?? "";
}

function readingMinutes(source = "") {
  const words = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

function readFenceLanguages(source = "") {
  const languages: string[] = [];
  let activeFence: { marker: string; length: number } | null = null;

  for (const line of source.split(/\r?\n/)) {
    if (activeFence) {
      const closePattern = new RegExp(`^ {0,3}\\${activeFence.marker}{${activeFence.length},}\\s*$`);
      if (closePattern.test(line)) {
        activeFence = null;
      }
      continue;
    }

    const open = line.match(/^ {0,3}(`{3,}|~{3,})\s*([^\s`]*)?/);
    if (!open) continue;

    const marker = open[1][0];
    const language = open[2]?.trim().toLowerCase();
    if (language) languages.push(language);
    activeFence = { marker, length: open[1].length };
  }

  return languages;
}

function stripFencedBlocks(source = "") {
  const output: string[] = [];
  let activeFence: { marker: string; length: number } | null = null;

  for (const line of source.split(/\r?\n/)) {
    if (activeFence) {
      const closePattern = new RegExp(`^ {0,3}\\${activeFence.marker}{${activeFence.length},}\\s*$`);
      if (closePattern.test(line)) {
        activeFence = null;
      }
      continue;
    }

    const open = line.match(/^ {0,3}(`{3,}|~{3,})\s*([^\s`]*)?/);
    if (open) {
      activeFence = { marker: open[1][0], length: open[1].length };
      continue;
    }

    output.push(line);
  }

  return output.join("\n");
}

function detectRichFeatures(source = ""): RichFeatures {
  const fenceLanguages = readFenceLanguages(source);
  const prose = stripFencedBlocks(source);

  return {
    chart: fenceLanguages.some((language) => language === "chart" || language === "plot"),
    mermaid: fenceLanguages.includes("mermaid"),
    three: fenceLanguages.includes("three"),
    math: /\$\$|\\\[|\\\(|(^|[^\\])\$[^$\n]+\$/m.test(prose)
  };
}

function extractSequence(base: string) {
  const match = base.match(/^\((\d+)\)/);
  return match ? Number(match[1]) : 0;
}

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\(\d+\)\s*/, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function assertUniqueSlugs<T extends { slug: string }>(
  items: T[],
  collectionName: string,
  label: (item: T) => string
) {
  const seen = new Map<string, string>();

  for (const item of items) {
    const currentLabel = label(item);
    if (!item.slug) {
      throw new Error(`[content] Empty ${collectionName} slug for "${currentLabel}".`);
    }

    const previousLabel = seen.get(item.slug);
    if (previousLabel) {
      throw new Error(
        `[content] Duplicate ${collectionName} slug "${item.slug}" for "${previousLabel}" and "${currentLabel}". Keep filenames and generated slugs globally unique.`
      );
    }

    seen.set(item.slug, currentLabel);
  }

  return items;
}

const projectModules = import.meta.glob<MarkdownModule>("../../_projects/**/*.md", { eager: true });
const postModules = import.meta.glob<MarkdownModule>("../../_posts/**/*.md", { eager: true });

export const projects: Project[] = assertUniqueSlugs(
  Object.entries(projectModules)
    .map(([path, module]) => {
      const base = fileBase(path);
      const name = asString(module.frontmatter.name, base.replace(/^\(\d+\)\s*/, ""));
      const externalUrl = asString(module.frontmatter.external_url) || undefined;
      const image = asString(module.frontmatter.image) || undefined;
      const video = asString(module.frontmatter.video) || undefined;
      const media = asString(module.frontmatter.media) || undefined;
      const mediaUrl = video || media || image;
      const mediaType = video ? "video" : normalizeMediaType(module.frontmatter.media_type) || inferMediaType(mediaUrl);
      const source = module.rawContent?.() ?? "";

      return {
        name,
        tools: asStringArray(module.frontmatter.tools),
        featured: asBoolean(module.frontmatter.featured),
        featuredOrder: asNumber(module.frontmatter.featured_order),
        image,
        video,
        mediaUrl,
        mediaType,
        description: asString(module.frontmatter.description, "Project note"),
        externalUrl,
        slug: slugify(name || base),
        sequence: extractSequence(base),
        headings: module.getHeadings?.().filter((heading) => heading.depth >= 2 && heading.depth <= 3) ?? [],
        richFeatures: detectRichFeatures(source),
        Content: module.Content
      };
    })
    .sort((a, b) => b.sequence - a.sequence || a.name.localeCompare(b.name)),
  "project",
  (project) => project.name
);

export const posts: Post[] = assertUniqueSlugs(
  Object.entries(postModules)
    .filter(([path, module]) => {
      if (fileBase(path).toLowerCase() === "templete") return false;
      return Boolean(asString(module.frontmatter.title) || module.rawContent?.().trim());
    })
    .map(([path, module]) => {
      const base = fileBase(path);
      const title = asString(module.frontmatter.title, base);
      const externalUrl = asString(module.frontmatter.external_url) || undefined;
      const source = module.rawContent?.() ?? "";
      const detectedMedia = extractFirstMedia(source);
      const image = asString(module.frontmatter.image) || (detectedMedia?.type === "image" ? detectedMedia.url : undefined);
      const video = asString(module.frontmatter.video) || (detectedMedia?.type === "video" ? detectedMedia.url : undefined);
      const media = asString(module.frontmatter.media) || undefined;
      const mediaUrl = video || media || image || detectedMedia?.url;
      const mediaType = video
        ? "video"
        : normalizeMediaType(module.frontmatter.media_type) || detectedMedia?.type || inferMediaType(mediaUrl);

      return {
        order: base,
        post: {
          title,
          tags: normalizeTags(module.frontmatter.tags),
          featured: asBoolean(module.frontmatter.featured),
          featuredOrder: asNumber(module.frontmatter.featured_order),
          image,
          video,
          mediaUrl,
          mediaType,
          description: asString(module.frontmatter.description, "Technical note"),
          externalUrl,
          slug: slugify(base),
          headings: module.getHeadings?.().filter((heading) => heading.depth >= 2 && heading.depth <= 3) ?? [],
          readingMinutes: readingMinutes(source),
          richFeatures: detectRichFeatures(source),
          Content: module.Content
        }
      };
    })
    .sort((a, b) => a.post.title.localeCompare(b.post.title) || a.order.localeCompare(b.order))
    .map(({ post }) => post),
  "post",
  (post) => post.title
);
