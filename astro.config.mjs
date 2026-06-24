import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkMath from "remark-math";

const dexoculusShikiTheme = {
  name: "dexoculus-code",
  type: "dark",
  colors: {
    "editor.background": "#111111",
    "editor.foreground": "#fdfdfd",
    "editorLineNumber.foreground": "#66656b",
    "editor.selectionBackground": "#00d6fa44"
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#808080", fontStyle: "italic" }
    },
    {
      scope: ["keyword", "storage", "storage.type", "punctuation.definition.keyword"],
      settings: { foreground: "#ffef01" }
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#00d6fa" }
    },
    {
      scope: ["variable", "variable.other", "entity.name.variable"],
      settings: { foreground: "#fdfdfd" }
    },
    {
      scope: ["string", "constant.other.symbol"],
      settings: { foreground: "#f7f5ad" }
    },
    {
      scope: ["constant.numeric", "constant.language", "support.constant"],
      settings: { foreground: "#7cd0ff" }
    },
    {
      scope: ["entity.name.type", "support.type", "support.class"],
      settings: { foreground: "#eec16c" }
    },
    {
      scope: ["punctuation", "meta.brace", "meta.delimiter"],
      settings: { foreground: "#909090" }
    },
    {
      scope: ["invalid", "invalid.illegal"],
      settings: { foreground: "#fdfdfd", background: "#920008" }
    }
  ]
};

export default defineConfig({
  site: "https://page.dexoculus.com",
  trailingSlash: "always",
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["plot", "chart", "mermaid", "three"]
    },
    shikiConfig: {
      theme: dexoculusShikiTheme,
      wrap: false
    },
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
