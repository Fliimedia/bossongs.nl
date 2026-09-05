// NOTE: .htaccess caches images for a year. When an image changes, give it a new
// filename (a content hash suffix works well). Overwriting a name leaves visitors
// stuck on the old file for up to a year.
// Bundles the React component into one self-contained index.html.
// No build step runs on the host, so everything ships pre-compiled.
import * as esbuild from "esbuild";
import { mkdirSync, writeFileSync } from "fs";

async function bundle(entry) {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    jsx: "automatic",
    format: "iife",
    target: ["es2019"],
    charset: "utf8",
    define: { "process.env.NODE_ENV": '"production"' },
    write: false,
  });
  return result.outputFiles[0].text;
}

const FONTS =
  "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap";

function page({ title, description, icon, fonts, extraHead, noscript, script }) {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="build" content="b16" />
    <meta name="description" content="${description}" />
${extraHead}    <link rel="icon" href="${icon}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fonts}" />
  </head>
  <body style="margin:0;background:#faf3e6">
    <div id="root"><noscript>${noscript}</noscript></div>
    <script>${script}</script>
  </body>
</html>
`;
}

// The invitation
const site = page({
  title: "Bruiloft 19 september 2026",
  description:
    "Uitnodiging voor onze bruiloft op 19 september 2026 in Amstelveen en Ouderkerk aan de Amstel.",
  icon: "images/logo-icoon.png",
  fonts: FONTS,
  extraHead: "",
  noscript: "Zet JavaScript aan om de uitnodiging te bekijken.",
  script: await bundle("src/main.jsx"),
});
writeFileSync("index.html", site);
console.log("index.html written, " + Math.round(site.length / 1024) + "K");

// The guest photo album at /foto, backed by foto/api.php
mkdirSync("foto", { recursive: true });
const album = page({
  title: "Fotoalbum, Nyarayek en Sten",
  description: "Deel je foto's van de bruiloft van Nyarayek en Sten.",
  icon: "../images/logo-icoon.png",
  fonts:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
  extraHead:
    '    <meta name="robots" content="noindex" />\n    <meta name="theme-color" content="#faf3e6" />\n',
  noscript: "Zet JavaScript aan om foto's te delen.",
  script: await bundle("src/foto.jsx"),
});
writeFileSync("foto/index.html", album);
console.log("foto/index.html written, " + Math.round(album.length / 1024) + "K");
