import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import Script from "next/script";
import { GoogleAnalyticsProvider } from "@/components/analytics/GoogleAnalyticsProvider";
import { Suspense } from "react";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
    title: "LabTesto - Trusted Diagnostic Platform - Accredited Labs & Home Sample Collection",
    description:
        "LabTesto is a trusted diagnostic platform offering secure, convenient access to NABL-certified laboratories, professional home sample collection, and reliable medical test results.",
    keywords: [
        "LabTesto",
        "Lab Testo",
        "Diagnostic Tests India",
        "NABL Certified Labs",
        "Home Sample Collection",
        "Online Lab Test Booking",
        "Medical Test Reports Online",
        "Accredited Laboratories India",
        "Health Diagnostics Platform",
        "Pathology Tests at Home",
        "Blood Test Booking Online",
        "Affordable Lab Tests",
        "Diagnostic Center Bankura",
        "LabTesto West Bengal",
        "Free Sample Collection",
        "Cash on Delivery Lab Tests",
    ],
    authors: [{ name: "LabTesto" }],
    creator: "LabTesto",
    publisher: "LabTesto",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app"),
    openGraph: {
        title: "LabTesto | Accurate, Hassle-Free Diagnostic Testing",
        description:
            "Book your medical tests easily with LabTesto — access NABL-accredited labs, certified phlebotomists, and doorstep sample collection. Reliable reports, flexible scheduling, and secure payments.",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app",
        siteName: "LabTesto",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url:
                    (process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app") +
                    "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "LabTesto - Trusted Diagnostic Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "LabTesto | Accredited Labs & Doorstep Sample Collection",
        description:
            "LabTesto offers secure and convenient diagnostic testing from NABL-certified labs with professional home sample collection and reliable test reports.",
        images: [
            (process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app") +
            "/og-image.jpg",
        ],
        creator: "@LabTesto", // replace later when Twitter/X account is created
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "googleae68989b3f48845d.html",
    },
    category: "healthcare"
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app";

export const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "About Us",
            item: BASE_URL + "/about",
        },
        {
            "@type": "ListItem",
            position: 3,
            name: "Services",
            item: BASE_URL + "/services",
        },
        {
            "@type": "ListItem",
            position: 4,
            name: "Tests",
            item: BASE_URL + "/tests",
        },
        {
            "@type": "ListItem",
            position: 5,
            name: "FAQs",
            item: BASE_URL + "/faq",
        },
        {
            "@type": "ListItem",
            position: 6,
            name: "Testimonials",
            item: BASE_URL + "/testimonials",
        },
        {
            "@type": "ListItem",
            position: 7,
            name: "Contact Us",
            item: BASE_URL + "/contact",
        },
        {
            "@type": "ListItem",
            position: 8,
            name: "Privacy Policy",
            item: BASE_URL + "/privacy-policy",
        },
        {
            "@type": "ListItem",
            position: 9,
            name: "Terms & Conditions",
            item: BASE_URL + "/terms-and-conditions",
        },
    ],
};

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "LabTesto",
    alternateName: "LabTesto Diagnostics",
    url: BASE_URL,
    logo: BASE_URL + "/logo.png",
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-8250711212",
        contactType: "Customer Support",
        email: "sayan825071das@gmail.com",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Bengali"],
    },
    address: {
        "@type": "PostalAddress",
        streetAddress: "Kadasole More",
        addressLocality: "Bankura",
        postalCode: "722202",
        addressRegion: "West Bengal",
        addressCountry: "IN",
    },
    sameAs: [
        "https://labtesto.vercel.app",
        // Add these when available:
        // "https://www.linkedin.com/company/labtesto",
        // "https://www.facebook.com/labtesto",
        // "https://twitter.com/LabTesto",
        // "https://www.instagram.com/labtesto",
    ],
    foundingDate: "2023-01-01",
    founders: [
        {
            "@type": "Person",
            name: "Sayantan Das",
        },
    ],
    description:
        "LabTesto is a trusted diagnostic platform providing access to NABL-certified laboratories, professional home sample collection, and accurate medical test reports across India.",
    keywords: [
        "LabTesto",
        "Medical Diagnostics",
        "Pathology Tests",
        "Health Checkup",
        "Blood Test Booking",
        "Home Sample Collection",
    ],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Google tag (gtag.js) */}
                <Script
                    async
                    id="google-analytics-script"
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"></Script>
                <Script id="google-analytics">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', '${GA_ID}');
                    `}
                </Script>

                {/* JSON-LD Structured Data for SEO */}
                <Script
                    id="organization-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
                <Script
                    id="breadcrumb-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            </head>
            <body
                className={`${inter.variable} antialiased font-inter flex flex-col min-h-screen scroll-smooth`}
            >
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />
                <Suspense fallback={<div>Loading...</div>}>
                    <GoogleAnalyticsProvider />
                </Suspense>
                {/* Skip to content link for accessibility */}
                <a href="#main" className="skip-to-content h-0" aria-label="Skip to main content" style={{ color: 'transparent' }}>
                    Skip to main content
                </a>
                {children}
            </body>
        </html>
    );
}
