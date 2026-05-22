import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import handler from "../netlify/functions/blog-generator.mts";

console.log("=== Blog Generator Test Run ===");
handler()
  .then(() => { console.log("=== Done ==="); process.exit(0); })
  .catch((e) => { console.error("=== Error ===", e); process.exit(1); });
