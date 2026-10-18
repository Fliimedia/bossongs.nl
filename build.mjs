// NOTE: .htaccess caches images for a year. When an image changes, give it a new
// filename (a content hash suffix works well). Overwriting a name leaves visitors
// stuck on the old file for up to a year.
// Writes index.html (the Bossongs mark, static) and foto/index.html (the React
// photo album). No build step runs on the host, so everything ships pre-compiled.
import * as esbuild from "esbuild";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

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

// The home page: the Bossongs mark on its own, nothing else. No framework and no
// webfont, so the first paint is the finished page and the fade never stutters.
// The mark is traced vector (src/bossongs-logo.svg), inlined so it needs no request.
const PAPER = "#f8f5ee"; // sampled from the logo artwork
const LOGO = readFileSync("src/bossongs-logo.svg", "utf8").trim();

const home = `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Bossongs</title>
    <meta name="build" content="b17" />
    <meta name="description" content="Nyarayek en Sten, 19 september 2026." />
    <meta name="theme-color" content="${PAPER}" />
    <link rel="icon" href="images/logo-icoon.png" />
    <style>
      :root { color-scheme: light; }
      html, body {
        margin: 0;
        height: 100%;
        background: ${PAPER};
        overflow: hidden;
      }
      .stage {
        min-height: 100svh;
        display: grid;
        place-items: center;
        padding: 6vmin;
        box-sizing: border-box;
      }
      .mark {
        display: block;
        width: min(64vw, 46svh, 430px);
        height: auto;
        transform: scale(1.045) translateY(12px);
        animation: settle 4s cubic-bezier(0.22, 0.61, 0.36, 1) both;
      }
      .mark-monogram { opacity: 0; animation: rise 2.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both; }
      .mark-word     { opacity: 0; animation: rise 2s   cubic-bezier(0.4, 0, 0.2, 1) 1.15s both; }
      .mark-rule {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: center;
        animation: draw 1.6s cubic-bezier(0.22, 1, 0.36, 1) 1.7s both;
      }
      @keyframes settle { to { transform: none; } }
      @keyframes rise   { to { opacity: 1; } }
      @keyframes draw   { from { opacity: 0; transform: scaleX(0.25); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) {
        .mark { transform: none; }
        .mark, .mark-monogram, .mark-word, .mark-rule {
          opacity: 1;
          animation: none;
        }
      }
    </style>
  </head>
  <body>
    <main class="stage">
${LOGO.split("\n").map((l) => "      " + l).join("\n")}
    </main>
  </body>
</html>
`;
writeFileSync("index.html", home);
console.log("index.html written, " + Math.round(home.length / 1024) + "K");

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
