// Inlines the Vite build output (JS + CSS) into one self-contained HTML file
// that works when opened directly from disk (file://) or shared by email.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("./dist/", import.meta.url).pathname;
let html = readFileSync(join(dist, "index.html"), "utf8");

html = html.replace(/<link rel="stylesheet"[^>]*href="(?:\.\/|\/)(assets\/[^"]+\.css)"[^>]*>/g, (_m, file) => {
  return `<style>\n${readFileSync(join(dist, file), "utf8")}\n</style>`;
});
let inlineScript = "";
html = html.replace(/<script type="module"[^>]*src="(?:\.\/|\/)(assets\/[^"]+\.js)"[^>]*><\/script>\s*/g, (_m, file) => {
  const js = readFileSync(join(dist, file), "utf8").replace(/<\/script/gi, "<\\/script");
  inlineScript = `<script type="module">\n${js}\n</script>`;
  return "";
});
// Place the script after the #app element so it always finds its mount point.
html = html.replace("</body>", () => `${inlineScript}\n  </body>`);

if (/(?:src|href)="(?:\.\/|\/)assets/.test(html)) {
  throw new Error("Some assets were not inlined");
}

const outDir = new URL("../standalone/", import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "pre-med-study-abroad-finder.html"), html);
console.log("Wrote standalone/pre-med-study-abroad-finder.html", html.length, "bytes");
