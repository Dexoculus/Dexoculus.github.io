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
      scope: ["keyword.operator", "storage.modifier", "punctuation.definition.template-expression"],
      settings: { foreground: "#ff7000" }
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#00d6fa" }
    },
    {
      scope: ["variable.parameter", "meta.function.parameters", "variable.other.readwrite"],
      settings: { foreground: "#fdfdfd" }
    },
    {
      scope: ["variable.language", "support.variable", "variable.other.constant"],
      settings: { foreground: "#9e8af9" }
    },
    {
      scope: ["string", "constant.other.symbol"],
      settings: { foreground: "#99f120" }
    },
    {
      scope: ["constant.numeric", "constant.language", "support.constant"],
      settings: { foreground: "#fabe34" }
    },
    {
      scope: ["constant.language.boolean", "constant.language.null", "constant.language.undefined"],
      settings: { foreground: "#9e8af9" }
    },
    {
      scope: ["entity.name.type", "support.type", "support.class"],
      settings: { foreground: "#ef8c38" }
    },
    {
      scope: ["variable.other.property", "support.type.property-name", "entity.other.attribute-name", "meta.object-literal.key"],
      settings: { foreground: "#ff95c8" }
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
