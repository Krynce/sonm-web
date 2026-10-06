import { lingui as linguiSolidPlugin } from "@lingui/vite-plugin";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
// compiles Lingui macros in plain .ts files (vite-plugin-solid only handles .tsx)
import babelMacrosPlugin from "vite-plugin-babel-macros";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";

import codegenPlugin from "./codegen.plugin.ts";
import { addFontPreload } from "./fontpreload.plugin.ts";

const base = process.env.BASE_PATH ?? "/";
const pwaScope = process.env.PWA_SCOPE || base;

export default defineConfig({
  base,
  plugins: [
    codegenPlugin(),
    babelMacrosPlugin(),
    solidPlugin({
      babel: {
        plugins: ["@lingui/babel-plugin-lingui-macro"],
      },
    }),
    linguiSolidPlugin(),
    solidSvg({
      defaultAsComponent: false,
    }),
    addFontPreload(),
    VitePWA({
      srcDir: "src",
      registerType: "autoUpdate",
      filename: "serviceWorker.ts",
      strategies: "injectManifest",
      injectManifest: {
        maximumFileSizeToCacheInBytes: 8000000,
        globPatterns: ["**/*.{js,css,html}", "**/material-symbols-*.woff2"],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "Sonm",
        short_name: "Sonm",
        description: "Open source chat platform.",
        categories: ["communication", "chat", "messaging"],
        start_url: base,
        scope: pwaScope,
        display_override: ["window-controls-overlay"],
        display: "standalone",
        background_color: "#101823",
        theme_color: "#101823",
        icons: [
          {
            src: `${base}assets/web/android-chrome-192x192.png`,
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: `${base}assets/web/android-chrome-512x512.png`,
            type: "image/png",
            sizes: "512x512",
          },
          {
            src: `${base}assets/web/monochrome.svg`,
            type: "image/svg+xml",
            sizes: "48x48 72x72 96x96 128x128 256x256",
            purpose: "monochrome",
          },
          {
            src: `${base}assets/web/masking-512x512.png`,
            type: "image/png",
            sizes: "512x512",
            purpose: "maskable",
          },
        ],
        // TODO: take advantage of shortcuts
      },
    }),
  ],
  build: {
    target: "esnext",
    rollupOptions: {
      external: ["hast"],
    },
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["hast"],
  },
  resolve: {
    alias: {
      "styled-system": resolve(import.meta.dirname, "styled-system"),
      ...readdirSync(resolve(import.meta.dirname, "components")).reduce(
        (p, f) => ({
          ...p,
          [`@sonm/${f}`]: resolve(import.meta.dirname, "components", f),
        }),
        {},
      ),
    },
  },
});
