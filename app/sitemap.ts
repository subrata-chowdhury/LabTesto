import { MetadataRoute } from "next";
import dbConnect from "@/config/db";
import Test from "@/models/Test";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Removed the localhost fallback. Next_PUBLIC_APP_URL or the production URL is all you need.
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app";
  const now = new Date();

  // 1. Removed /login and /signup
  // Using 'as const' automatically locks in the exact string types for Next.js
  const staticPages = [
    { path: "/", changeFreq: "monthly" as const, priority: 1 },
    { path: "/about", changeFreq: "yearly" as const, priority: 0.8 },
    { path: "/contact", changeFreq: "yearly" as const, priority: 0.8 },
    { path: "/faq", changeFreq: "monthly" as const, priority: 0.6 },
    { path: "/privacy-policy", changeFreq: "yearly" as const, priority: 0.3 },
    { path: "/services", changeFreq: "weekly" as const, priority: 0.7 },
    {
      path: "/terms-and-conditions",
      changeFreq: "yearly" as const,
      priority: 0.3,
    },
    { path: "/testimonials", changeFreq: "monthly" as const, priority: 0.5 },
    { path: "/tests", changeFreq: "weekly" as const, priority: 0.9 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));

  try {
    // 2. Query the database directly instead of making an HTTP fetch to your own API
    await dbConnect();

    // 3. Fetch ALL tests, not just the first 50. Projection keeps memory usage low.
    const tests = await Test.find({}, { _id: 1, updatedAt: 1 }).lean();

    tests.forEach((t) => {
      sitemapEntries.push({
        url: `${baseUrl}/tests/${t._id}`,
        lastModified: t.updatedAt
          ? new Date(t.updatedAt as Date | string)
          : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error(
      "[Sitemap Error] Failed to fetch tests from database:",
      error,
    );
    // Even if the DB fails, we still return the static pages so the sitemap doesn't completely break
  }

  return sitemapEntries;
}
