// app/api/admin/cloudinary/usage/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await cloudinary.api.usage();

    if (response?.storage) {
      return NextResponse.json(
        {
          usage: response.storage.usage || 0,
          limit: response.storage.limit || 0,
          usedPercent: response.storage.used_percent || 0,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "Storage data not found in Cloudinary response." },
      { status: 404 },
    );
  } catch (error: any) {
    console.error("Failed to fetch Cloudinary usage API:", error);

    // Specifically handle the Cloudinary 403 Permissions Error
    if (error?.http_code === 403 || error?.error?.http_code === 403) {
      return NextResponse.json(
        {
          error: "Cloudinary API Key lacks Admin permissions.",
          // Returning dummy data allows the frontend UI to fail gracefully
          // without breaking the whole dashboard.
          usage: 0,
          limit: 1,
          usedPercent: 0,
          isForbidden: true,
        },
        { status: 200 }, // Return 200 so the fetcher populates the card with empty values instead of crashing
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error while fetching Cloudinary stats." },
      { status: 500 },
    );
  }
}
