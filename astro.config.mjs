import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";

export default defineConfig({
  site: "https://page.dexoculus.com",
  trailingSlash: "always",
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: ["heading-anchor"]
            }
          }
        ]
      ]
    })
  }
});
