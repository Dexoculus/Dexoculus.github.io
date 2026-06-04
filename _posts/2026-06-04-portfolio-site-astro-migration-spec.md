---
title: "Development Note: Astro Migration and Site Specification"
tags: [Site, Astro, GitHub Pages, Portfolio]
style: fill
color: info
description: "A development note documenting the Astro migration, GitHub Pages deployment model, content structure, design direction, and lightweight rendering support for this portfolio site."
external_url:
---
# Development Note: Astro Migration and Site Specification

## Purpose

This site is maintained as a personal CV, selected project portfolio, and technical note archive. The current version was rebuilt to move away from the previous Jekyll and portfolYOU-based structure while preserving the useful content model of projects, posts, profile data, and timeline entries.

The main objectives of the migration were:

1. Replace the Jekyll theme stack with a modern static site framework.
2. Remove the inherited portfolYOU design and dependency structure.
3. Keep the project and note archive easy to maintain in Markdown.
4. Support GitHub Pages hosting through GitHub Actions.
5. Present the landing page as a CV and portfolio rather than a generic blog index.
6. Add research-note features such as math notation, lightweight charts, optional diagrams, and optional 3D scenes without increasing the default page weight.

## Framework

The site is built with Astro and configured for static output. The project uses a small dependency set:

```json
{
  "astro": "^6.4.4",
  "remark-math": "^6.0.0",
  "rehype-katex": "^7.0.1",
  "rehype-slug": "^6.0.0",
  "rehype-autolink-headings": "^7.1.0",
  "yaml": "^2.9.0"
}
```

Astro was selected because the site is mostly static content, but still benefits from componentized layouts, content-driven routing, and selective client-side scripts for notes that need richer rendering.

## Content Structure

The content structure intentionally remains close to the original repository layout:

```text
_data/
  programming-skills.yml
  other-skills.yml
  timeline.yml

_posts/
  YYYY-MM-DD-note-title.md

_projects/
  (NN) Project Name.md

src/
  components/
  layouts/
  lib/
  pages/
  styles/
```

Projects are loaded from `_projects/*.md`, posts are loaded from `_posts/*.md`, and profile metadata is centralized in `src/lib/content.ts`. This keeps routine updates simple: most CV, project, and note changes can be made without touching page templates.

## Pages

The primary routes are:

- `/` for the CV-oriented landing page.
- `/about/` for the printable CV profile.
- `/projects/` for selected project work.
- `/projects/[slug]/` for individual project notes.
- `/blog/` for notes with search and tag grouping.
- `/blog/[slug]/` for individual notes.
- `/blog/tags/` for the tag archive.
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and `/search.json` for publishing and discoverability.

## Design Direction

The visual direction follows the local `guideline.html` reference rather than the previous Jekyll theme. The interface uses a restrained technical CV style with:

- high-contrast black, white, gray, and yellow accents;
- topographic contour and grid background elements;
- hatch marks near the top navigation area;
- compact project and note cards;
- CV-first language on the landing page;
- direct labels such as `Selected Projects`, `Timeline`, and `Notes`.

The landing page avoids oversized personal branding and instead emphasizes education, current affiliation, research focus, selected work, timeline, and recent notes.

## Markdown Features

The Markdown pipeline supports:

- heading slugs and heading anchors;
- inline math and display math through `remark-math` and `rehype-katex`;
- article table of contents for project and note detail pages;
- rich feature detection for math, chart, Mermaid, and 3D blocks.

Math examples:

```tex
$E = mc^2$

$$
\nabla_\theta \mathcal{L}(\theta)
$$
```

KaTeX CSS is loaded only for pages that contain math content.

## Lightweight Charts

Charts are implemented as a small SVG renderer rather than a bundled Plotly or mathjs runtime. The default site bundle therefore remains small, and only pages containing chart blocks include the chart renderer.

The preferred authoring format is a lightweight matplotlib-like `plot` block:

````md
```plot
const x = np.linspace(0, 10, 120)

plt.title("Training loss")
plt.xlabel("epoch")
plt.ylabel("loss")
plt.plot(x, x.map((v) => Math.exp(-v / 3)), { label: "train" })
plt.scatter([1, 3, 5, 7], [0.8, 0.42, 0.22, 0.12], { label: "checkpoints" })
```
````

Supported chart types include:

- line plots;
- scatter plots;
- bar plots;
- histograms;
- box plots;
- function plots;
- slider-driven parameterized function plots.

The `plot` block executes a small JavaScript DSL in the browser. It is intended for trusted first-party notes written by the site owner.

## Mermaid and 3D Rendering

Mermaid and 3D scenes are optional rich-note features. They are not part of the default page bundle.

- Mermaid blocks are transformed only on pages that contain `mermaid` fenced code blocks.
- 3D blocks are transformed only on pages that contain `three` fenced code blocks.
- Three.js is loaded from a CDN only when a page explicitly uses a `three` block.

This keeps the core portfolio, CV, project index, and ordinary notes lightweight.

## GitHub Pages Deployment

Deployment is handled by GitHub Actions. The workflow runs on pushes to `main` and can also be triggered manually.

The deployment model is:

1. Check out the repository.
2. Install dependencies and build the Astro site with `withastro/action`.
3. Upload the static artifact.
4. Deploy the artifact with `actions/deploy-pages`.

The repository should use GitHub Pages with `GitHub Actions` as the publishing source. This prevents the previous Jekyll publishing path from interfering with the Astro build.

## Optimization Policy

The site follows a static-first optimization policy:

- no default Plotly, Mermaid, Three.js, or mathjs bundle;
- no chart library dependency in `package.json`;
- rich renderers are included only when matching Markdown blocks are detected;
- charts use SVG output;
- images are lazy-loaded in project cards;
- the build output is static and suitable for GitHub Pages.

At the time of this note, the regular build completes in roughly one second locally, and the default `_astro` output contains only the shared CSS asset unless a page explicitly requires a rich renderer.

## Maintenance Notes

To add a project, create a Markdown file in `_projects/` with frontmatter for name, tools, image, description, and optional external URL.

To add a note, create a Markdown file in `_posts/` using the date-prefixed filename format:

```text
YYYY-MM-DD-note-title.md
```

To update CV data, edit `src/lib/content.ts` and the YAML files under `_data/`.

To verify the site locally:

```bash
npm run build
npm run dev
```

The project is designed to stay easy to edit, lightweight by default, and expressive enough for research and engineering notes.
