// Bundles the React component into one self-contained index.html.
// No build step runs on the host, so everything ships pre-compiled.
import * as esbuild from "esbuild";
import { writeFileSync } from "fs";

const result = await esbuild.build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  jsx: "automatic",
  format: "iife",
  target: ["es2019"],
  charset: "utf8",
  define: { "process.env.NODE_ENV": '"production"' },
  write: false,
});

const script = result.outputFiles[0].text;

const html = `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bruiloft 19 september 2026</title>
    <meta name="build" content="b10" />
    <meta
      name="description"
      content="Uitnodiging voor onze bruiloft op 19 september 2026 in Amstelveen en Ouderkerk aan de Amstel."
    />
    <link rel="icon" href="images/logo-icoon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
    />
  </head>
  <body>
    <div id="root"><noscript>Zet JavaScript aan om de uitnodiging te bekijken.</noscript></div>
    <script>${script}</script>
  </body>
</html>
`;

writeFileSync("index.html", html);
console.log("index.html written, " + Math.round(html.length / 1024) + "K");
