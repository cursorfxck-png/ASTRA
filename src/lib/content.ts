import { readFile, writeFile } from "fs/promises";
import path from "path";

import type { SiteContent } from "@/lib/types";

const contentFilePath = path.join(process.cwd(), "src", "data", "site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await readFile(contentFilePath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await writeFile(contentFilePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
