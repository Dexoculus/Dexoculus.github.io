import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

type MarkdownModule = {
  frontmatter: Record<string, unknown>;
  Content: unknown;
  getHeadings?: () => Heading[];
  rawContent?: () => string;
};

type Skill = {
  name: string;
  percentage: number;
  color?: string;
};

type TimelineItem = {
  title: string;
  linkText?: string;
  url?: string;
  from: number;
  to: number;
  description: string;
};

export type Project = {
  name: string;
  tools: string[];
  image?: string;
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
  description: string;
  externalUrl?: string;
  slug: string;
  date?: Date;
  headings: Heading[];
  readingMinutes: number;
  richFeatures: RichFeatures;
  Content: unknown;
};

const dataPath = (fileName: string) => path.join(process.cwd(), "_data", fileName);

function readYaml<T>(fileName: string, fallback: T): T {
  try {
    const source = fs.readFileSync(dataPath(fileName), "utf8");
    return parse(source) as T;
  } catch {
    return fallback;
  }
}

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

const projectModules = import.meta.glob<MarkdownModule>("../../_projects/*.md", { eager: true });
const postModules = import.meta.glob<MarkdownModule>("../../_posts/*.md", { eager: true });

export const profile = {
  siteTitle: "Dexter Oculus",
  name: "Hyeonbin Han",
  handle: "Dexoculus",
  role: "B.S. candidate in Mathematical Data Science; robotics and machine learning projects",
  location: "Hanyang University ERICA / Seoul, Korea",
  email: "hyeonbin@hanyang.ac.kr",
  avatar: "https://avatars.githubusercontent.com/u/34956179?v=4",
  summary:
    "Undergraduate student in Mathematical Data Science at Hanyang University ERICA, with project experience in computer vision, robotics, and machine learning.",
  focus: ["Computer Vision", "Robotics", "Data Science", "Imitation Learning", "Vision-Language-Action (VLA)"],
  researchInterests: ["Computer Vision", "Robotics", "Data Science", "Imitation Learning", "Vision-Language-Action (VLA)", "Anomaly Detection"],
  stack: ["Python", "C++", "PyTorch", "Docker", "Linux", "Git", "Astro"],
  links: [
    { label: "GitHub", href: "https://github.com/Dexoculus" },
    { label: "ORCID", href: "https://orcid.org/0009-0007-4713-5892" },
    { label: "PyPI", href: "https://pypi.org/user/dexoculus/" },
    { label: "Scholar", href: "https://scholar.google.com/citations?user=EhfNfLAAAAAJ&hl=ko&oi=ao" }
  ],
  education: {
    school: "Hanyang University ERICA",
    program: "B.S. in Mathematical Data Science",
    period: "Expected February 2027",
    detail: "GPA 3.51 / 4.5"
  },
  experience: [
    {
      organization: "CMES Robotics",
      organizationUrl: "https://www.cmesrobotics.ai/",
      role: "Junior Research Assistant, Robot Intelligence Team (Humanoid TF)",
      period: "Mar 2026 - Jun 2026",
      bullets: [
        "Architected a scalable data acquisition and curation platform for the RB-Y1 humanoid robot.",
        "Deployed the Gello teleoperation framework for UR5 manipulators and supported ACT policy training and deployment."
      ]
    },
    {
      organization: "Intelligence & Computation Lab, Hanyang University ERICA",
      role: "Undergraduate Researcher",
      period: "Oct 2023 - Jan 2026",
      bullets: [
        "Administered GPU training infrastructure for deep learning workloads.",
        "Engineered preprocessing pipelines for heterogeneous healthcare and behavioral datasets."
      ]
    }
  ],
  publications: [
    "Prediction of Closed Quotient During Vocal Phonation using GRU-type Neural Network with Audio Signals. Journal of Information & Communication Convergence Engineering 22(2)."
  ],
  presentations: [
    "DMD Method for Analyzing Interactions Between Board Game Players, KIICE Fall Conference, 2025.",
    "Deep learning-based algorithm for analyzing EGG signals to predict closed quotient rate, KIIS Spring Conference, 2024."
  ],
  awards: [
    "Excellence Award, 2025 Intelligent Robot WE-Meet Project Integrated Competition",
    "Participation Award, 2025 Shipbuilding & Maritime Big Data Utilization Idea Contest",
    "Best Paper Award, 2025 KIICE Fall Conference",
    "Bronze Prize, KIICE Physical AI Challenge",
    "Excellence Award, 2024 Hanyang University SW/ICT/AI Integrated Conference"
  ]
};

export const programmingSkills = readYaml<Skill[]>("programming-skills.yml", []);
export const otherSkills = readYaml<Skill[]>("other-skills.yml", []);
export const timeline = readYaml<TimelineItem[]>("timeline.yml", []);

export const projects: Project[] = Object.entries(projectModules)
  .map(([path, module]) => {
    const base = fileBase(path);
    const name = asString(module.frontmatter.name, base.replace(/^\(\d+\)\s*/, ""));
    const externalUrl = asString(module.frontmatter.external_url) || undefined;
    const source = module.rawContent?.() ?? "";

    return {
      name,
      tools: asStringArray(module.frontmatter.tools),
      image: asString(module.frontmatter.image) || undefined,
      description: asString(module.frontmatter.description, "Project note"),
      externalUrl,
      slug: slugify(name || base),
      sequence: extractSequence(base),
      headings: module.getHeadings?.().filter((heading) => heading.depth >= 2 && heading.depth <= 3) ?? [],
      richFeatures: detectRichFeatures(source),
      Content: module.Content
    };
  })
  .sort((a, b) => b.sequence - a.sequence || a.name.localeCompare(b.name));

export const posts: Post[] = Object.entries(postModules)
  .filter(([path]) => fileBase(path).toLowerCase() !== "templete")
  .map(([path, module]) => {
    const base = fileBase(path);
    const dateMatch = base.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
    const date = dateMatch ? new Date(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}T00:00:00`) : undefined;
    const title = asString(module.frontmatter.title, base);
    const externalUrl = asString(module.frontmatter.external_url) || undefined;
    const source = module.rawContent?.() ?? "";

    return {
      title,
      tags: asStringArray(module.frontmatter.tags),
      description: asString(module.frontmatter.description, "Technical note"),
      externalUrl,
      slug: slugify(dateMatch ? dateMatch[4] : title),
      date,
      headings: module.getHeadings?.().filter((heading) => heading.depth >= 2 && heading.depth <= 3) ?? [],
      readingMinutes: readingMinutes(source),
      richFeatures: detectRichFeatures(source),
      Content: module.Content
    };
  })
  .sort((a, b) => {
    const aTime = a.date?.getTime() ?? 0;
    const bTime = b.date?.getTime() ?? 0;
    return bTime - aTime || a.title.localeCompare(b.title);
  });

export function formatDate(date?: Date) {
  if (!date) return "Undated";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}
