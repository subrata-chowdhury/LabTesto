import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const BASE_URL =
    process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // 1. Core API & System Routes
          "/api",

          // 2. Dashboard & Administrative Routes
          "/admin",
          "/collector",

          // 3. Private User/Transactional Routes
          "/cart",
          "/order",
          "/profile",
          "/notifications",

          // 4. Auth Routes (Optional but recommended for SEO)
          // Prevents search engines from cluttering results with login/signup pages
          // "/login",
          // "/signup",
        ],
      },
      // {
      //   userAgent: ["GPTBot", "CCBot", "Google-Extended", "Anthropic-ai", "ClaudeBot"],
      //   disallow: "/",
      // },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
