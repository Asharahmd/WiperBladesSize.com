import type { MetadataRoute } from "next";
import { INDEXED, SITE } from "@/lib/site";

export const dynamic = "force-static";

// Launch phase: only the indexed pages go in the sitemap. See INDEXED in lib/site.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXED.map((p) => ({ url: SITE.url + p }));
}
