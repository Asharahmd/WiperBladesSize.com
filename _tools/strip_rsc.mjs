// Deletes the RSC payload .txt files that `next build` writes next to every page (index.txt, __next.*.txt, __PAGE__.txt).
// With them the export has about 34k files, over the 20k-file limit of a free Cloudflare Workers deploy.
// Without them links still work: the router falls back to a normal full-page load. robots.txt is kept.
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
let removed = 0;
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".txt") && !(dir === join(OUT) && e.name === "robots.txt")) {
      rmSync(p);
      removed++;
    }
  }
};
walk(join(OUT));
console.log(`strip_rsc: removed ${removed} payload files`);
