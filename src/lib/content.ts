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

export const profile = {
  siteTitle: "Hyeonbin Han",
  name: "Hyeonbin Han",
  handle: "Dexoculus",
  role: "Undergraduate researcher in Mathematical Data Science",
  location: "Republic of Korea",
  email: "hyeonbin@hanyang.ac.kr",
  avatar: "https://avatars.githubusercontent.com/u/34956179?v=4",
  summary:
    "Undergraduate researcher working across robot intelligence, computer vision, physical AI, distributed learning, and machine learning systems.",
  focus: ["Computer Vision", "Robotics", "Data Science", "Imitation Learning", "Vision-Language-Action (VLA)"],
  researchInterests: ["Computer Vision", "Robotics", "Data Science", "Imitation Learning", "Vision-Language-Action (VLA)", "Anomaly Detection"],
  skillGroups: [
    { label: "Languages", scope: "programming", items: ["Python", "C++", "SQL"] },
    {
      label: "AI / Machine Learning",
      scope: "research stack",
      items: ["PyTorch", "Flower", "Hugging Face LeRobot"]
    },
    {
      label: "Robotics / Hardware",
      scope: "physical systems",
      items: ["Raspberry Pi", "RB-Y1", "UR5", "Robotis FFW-SG2"]
    },
    {
      label: "Data / Applications",
      scope: "analysis",
      items: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Streamlit"]
    },
    {
      label: "Infrastructure",
      scope: "deployment",
      items: ["Linux (Ubuntu)", "Docker", "Git", "Cloudflare Tunnels"]
    },
    {
      label: "Fabrication / 3D",
      scope: "prototyping",
      items: ["Fusion 360", "FreeCAD", "Blender", "3D Printing"]
    }
  ],
  stack: ["Python", "C++", "SQL", "PyTorch", "Flower", "LeRobot", "NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Streamlit", "Linux", "Docker", "Git", "Cloudflare Tunnels"],
  links: [
    { label: "GitHub", href: "https://github.com/Dexoculus" },
    { label: "ORCID", href: "https://orcid.org/0009-0007-4713-5892" },
    { label: "PyPI", href: "https://pypi.org/user/dexoculus/" },
    { label: "Scholar", href: "https://scholar.google.com/citations?user=EhfNfLAAAAAJ&hl=ko&oi=ao" }
  ],
  education: {
    school: "Hanyang University ERICA",
    program: "B.S. in Mathematical Data Science",
    period: "Expected graduation: February 2027",
    detail: "GPA 3.51 / 4.5",
    location: "Ansan, Korea"
  },
  experience: [
    {
      organization: "CMES Robotics",
      organizationUrl: "https://www.cmesrobotics.ai/",
      location: "Seoul, Korea",
      role: "Junior Research Assistant, Robot Intelligence Team (Humanoid TF)",
      period: "Mar 2026 - Aug 2026",
      bullets: [
        "Architected a scalable data acquisition and curation platform for the RB-Y1 humanoid robot and standardized the teleoperation environment for high-fidelity data collection.",
        "Deployed the Gello teleoperation framework for UR5 manipulators and streamlined the pipeline from data curation to ACT policy training and physical deployment."
      ]
    },
    {
      organization: "Intelligence & Computation Lab, Hanyang University ERICA",
      location: "Ansan, Korea",
      role: "Undergraduate Researcher",
      period: "Oct 2023 - Jan 2026",
      bullets: [
        "Administered and optimized GPU training infrastructure, maintaining availability and efficient resource allocation for deep learning workloads.",
        "Engineered robust preprocessing pipelines for heterogeneous healthcare datasets, including mobile addiction metrics, and converted raw signals into machine-learning-ready formats."
      ]
    }
  ],
  publications: [
    "Han, Hyeonbin, et al. \"Prediction of Closed Quotient During Vocal Phonation Using GRU-Type Neural Network with Audio Signals.\" Journal of Information and Communication Convergence Engineering, vol. 22, no. 2, 2024, pp. 145-152."
  ],
  presentations: [
    "\"DMD Method for Analyzing Interactions Between Board Game Players,\" KIICE Fall Conference, 2025. Poster.",
    "\"Deep Learning-Based Algorithm for Analyzing EGG Signals to Predict Closed Quotient Rate,\" KIIS Spring Conference, 2024. Poster."
  ],
  awards: [
    "Excellence Award, Hanyang University ERICA College of Computing Capstone Fair, Jun 2026. KRW 2,000,000 prize.",
    "Excellence Award, 2025 Intelligent Robot WE-Meet Project Integrated Competition, Jan 2026.",
    "Participation Award, 2025 Shipbuilding & Maritime Big Data Utilization Idea Contest, Dec 2025.",
    "Best Paper Award, 2025 KIICE Fall Conference, Oct 2025.",
    "Bronze Prize (Robot News President's Award), KIICE Physical AI Challenge, Oct 2025.",
    "Excellence Award, 2024 Hanyang University SW/ICT/AI Integrated Conference, Dec 2024."
  ]
};

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
