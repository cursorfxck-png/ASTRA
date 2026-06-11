import { LandingPage } from "@/components/LandingPage";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

  return <LandingPage content={content} />;
}
