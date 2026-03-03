import React, { cache } from "react";
import MainTestPage from "./componenets/MainTestPage"; // Note: Left your folder spelling exactly as-is
import "@/styles/tiptap.css";
import Test, { ITest } from "@/models/Test";
import dbConnect from "@/config/db";
import { Metadata } from "next";

// 1. Revalidate time (e.g., 3600 seconds = 1 hour).
// This keeps your static pages updated if you change test details in MongoDB.
export const revalidate = 604800;

interface PageProps {
  params: Promise<{ id: string }>;
}

// 2. Memoize the database fetch.
// This prevents Next.js from querying the DB twice per page during the build.
const getTestById = cache(async (id: string) => {
  await dbConnect();
  const test = await Test.findById(id).lean();
  return test ? (test as unknown as ITest) : null;
});

// 3. Generate static parameters at build time
export async function generateStaticParams() {
  await dbConnect();
  // We use a projection { _id: 1 } to ONLY fetch the IDs.
  // Fetching entire documents here would consume too much memory during the build.
  const tests = await Test.find({}, { _id: 1 }).lean();

  return tests.map((test) => ({
    id: test._id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = (await params).id;
  const test = await getTestById(id);

  // Failsafe in case a test ID exists in the URL but was deleted from the DB
  if (!test) {
    return { title: "Test Not Found - LabTesto" };
  }

  return {
    title: `${test.name} - LabTesto`,
    description:
      test.description?.split(".")[0] ||
      "Book lab tests easily online with LabTesto.",
    openGraph: {
      title: `${test.name} - LabTesto`,
      description:
        test.description?.split(".")[0] ||
        "Book lab tests easily online with LabTesto.",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://labtesto.vercel.app"}/tests/${test._id}`,
    },
  };
}

export default async function TestPage({ params }: PageProps) {
  const id = (await params).id;
  const test = await getTestById(id);

  if (!test) {
    return <div>Test not found</div>;
  }

  // JSON.parse(JSON.stringify()) is perfect here to strip non-serializable Mongoose ObjectIDs
  // before passing the data to the client component.
  return <MainTestPage test={JSON.parse(JSON.stringify(test))} />;
}
