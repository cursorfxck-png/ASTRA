import { AdminClient } from "@/components/AdminClient";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getSiteContent();

  return <AdminClient initialContent={content} />;
}
