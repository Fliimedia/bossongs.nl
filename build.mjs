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
    loader: { ".svg": "text" },
    define: { "process.env.NODE_ENV": '"production"' },
    write: false,
  });
  return result.outputFiles[0].text;
}

function page({ title, description, fonts, extraHead, noscript, script }) {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${title}</title>
    <meta name="build" content="b36" />
    <meta name="description" content="${description}" />
${extraHead}    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="apple-touch-icon" href="/favicon-180.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${fonts}" />
  </head>
  <body style="margin:0;background:#f8f5ee">
    <div id="root"><noscript>${noscript}</noscript></div>
    <script>${script}</script>
  </body>
</html>
`;
}

// De homepagina staat als gewone HTML in src/home.html: geen framework, zodat
// de eerste weergave meteen de afgewerkte pagina is en de fade niet hapert. De
// twee vectoren worden ingevoegd, zodat de pagina er geen verzoek voor nodig
// heeft. src/bossongs-logo.svg is het volledige merk, src/b-letter.svg de
// losse letter B uit het woordmerk, die in de menuknop opkomt.
const indent = (svg, pad) =>
  svg
    .trim()
    .split("\n")
    .map((line) => pad + line)
    .join("\n");

const home = readFileSync("src/home.html", "utf8")
  .replace("<!--MARK-->", indent(readFileSync("src/bossongs-logo.svg", "utf8"), "      "))
  .replace("<!--B-->", indent(readFileSync("src/b-letter.svg", "utf8"), "        "));

writeFileSync("index.html", home);
console.log("index.html written, " + Math.round(home.length / 1024) + "K");

// The guest photo album at /foto, backed by foto/api.php
mkdirSync("foto", { recursive: true });
const album = page({
  title: "Fotoalbum, Nyarayek en Sten",
  description: "Deel je foto's van de bruiloft van Nyarayek en Sten.",
  fonts:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
  extraHead:
    '    <meta name="robots" content="noindex" />\n    <meta name="theme-color" content="#f8f5ee" />\n',
  noscript: "Zet JavaScript aan om foto's te delen.",
  script: await bundle("src/foto.jsx"),
});
writeFileSync("foto/index.html", album);
console.log("foto/index.html written, " + Math.round(album.length / 1024) + "K");
