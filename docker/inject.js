const {
  cpSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} = require("node:fs");
const { join, sep } = require("node:path");
const { createHash } = require("node:crypto");

const BUILD_DIR = "dist";
const OUT_DIR = "dist_injected";

// Map of placeholder to env var name
// At build time, Vite replaces import.meta.env.VITE_X with the literal string value.
// We build with placeholder values like "__VITE_API_URL__" so they appear in the output.
const REPLACEMENTS = {
  __VITE_API_URL__: process.env.VITE_API_URL,
  __VITE_SUPPORT_URL__: process.env.VITE_SUPPORT_URL,
  __VITE_SOURCE_URL__: process.env.VITE_SOURCE_URL,
  __VITE_EMOJI_URL__: process.env.VITE_EMOJI_URL,
  __VITE_RNNOISE_WORKLET_CDN_URL__: process.env.VITE_RNNOISE_WORKLET_CDN_URL,
};

console.log("Preparing injected build...");

rmSync(OUT_DIR, { recursive: true, force: true });
cpSync(BUILD_DIR, OUT_DIR, { recursive: true });

console.log("Injecting environment variables...");
const files = readdirSync(OUT_DIR, { recursive: true });
const revisions = {};

for (const file of files) {
  const path = join(OUT_DIR, file);
  if (!path.endsWith(".js") && !path.endsWith(".html")) continue;

  let data = readFileSync(path, "utf-8");
  let modified = false;

  for (const [placeholder, value] of Object.entries(REPLACEMENTS)) {
    if (data.includes(placeholder)) {
      if (value) {
        data = data.replaceAll(placeholder, value);
      } else {
        // the minifier may quote strings with ", ' or `
        data = data.replace(new RegExp(`(["'\`])${placeholder}\\1`, "g"), "void 0");
      }
      modified = true;
    }
  }

  if (modified) {
    console.log("Injected:", path);
    writeFileSync(path, data);
    revisions[file.split(sep).join("/")] = createHash("md5")
      .update(data)
      .digest("hex");
  }
}

// The service worker precaches hashed assets with revision null, i.e. "never
// changes". Injection changes their content under the same name, so give each
// injected file a real revision or installed clients keep the stale bundle.
const swPath = join(OUT_DIR, "serviceWorker.js");
let sw = readFileSync(swPath, "utf-8");
for (const [url, revision] of Object.entries(revisions)) {
  sw = sw.replace(
    new RegExp(`"revision":(?:null|"[^"]*"),"url":"${url.replaceAll(".", "\\.")}"`),
    `"revision":"${revision}","url":"${url}"`,
  );
}
writeFileSync(swPath, sw);

console.log("Injection complete.");
