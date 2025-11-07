import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app" || "http://localhost:3000";
    const now = new Date();

    const staticPages = [
        { path: "/", changeFreq: "monthly", priority: 1 },
        { path: "/about", changeFreq: "yearly", priority: 0.8 },
        { path: "/contact", changeFreq: "yearly", priority: 0.8 },
        { path: "/faq", changeFreq: "monthly", priority: 0.6 },
        { path: "/login", changeFreq: "monthly", priority: 0.5 },
        // { path: "/login/admin", changeFreq: "monthly", priority: 0.5 },
        // { path: "/login/collector", changeFreq: "monthly", priority: 0.5 },
        { path: "/privacy-policy", changeFreq: "yearly", priority: 0.3 },
        { path: "/services", changeFreq: "weekly", priority: 0.7 },
        { path: "/signup", changeFreq: "monthly", priority: 0.6 },
        { path: "/terms-and-conditions", changeFreq: "yearly", priority: 0.3 },
        { path: "/testimonials", changeFreq: "monthly", priority: 0.5 },
        { path: "/tests", changeFreq: "weekly", priority: 0.9 },
    ];

    const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((p) => ({
        url: `${baseUrl}${p.path}`,
        lastModified: now,
        changeFrequency: p.changeFreq as "monthly" | "yearly" | "weekly" | "always" | "hourly" | "daily" | "never" | undefined,
        priority: p.priority,
    }));

    // Dynamic entries can be added here in the future
    const res = await fetch(`${baseUrl}/api/tests?filter={%22name%22:%22%22}&limit=50&page=1`);
    const tests = (await res.json()).tests;
    tests.forEach((t: { _id: string, updatedAt: string }) => {
        sitemapEntries.push({
            url: `${baseUrl}/tests/${t._id}`,
            lastModified: new Date(t.updatedAt || Date.now()),
            changeFrequency: "weekly",
            priority: 0.8,
        });
    });

    return sitemapEntries;
}
