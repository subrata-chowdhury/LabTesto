import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app/";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/collector"],
            },
            //   {
            //     userAgent: "GPTBot", // blocking AI crawlers - uncomment if needed
            //     disallow: "/",
            //   },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
