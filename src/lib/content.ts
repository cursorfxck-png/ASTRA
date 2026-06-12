import { readFile } from "fs/promises";
import path from "path";

import type { SiteContent } from "@/lib/types";
import { getSiteContentFromSupabase, updateSiteContentInSupabase } from "@/lib/supabase";

const localContentFilePath = path.join(process.cwd(), "src", "data", "site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  try {
    // Try to fetch from Supabase
    return await getSiteContentFromSupabase();
  } catch (error) {
    console.log("Content not found in Supabase, uploading initial content...");
    
    try {
      // Read local file as initial content
      const raw = await readFile(localContentFilePath, "utf8");
      const initialContent = JSON.parse(raw) as SiteContent;
      
      // Upload to Supabase
      await updateSiteContentInSupabase(initialContent);
      console.log("✅ Initial content uploaded to Supabase successfully");
      
      return initialContent;
    } catch (uploadError) {
      console.error("Failed to upload initial content to Supabase:", uploadError);
      throw new Error("Failed to initialize content. Please check Supabase configuration.");
    }
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await updateSiteContentInSupabase(content);
  console.log("Content saved to Supabase successfully");
}

