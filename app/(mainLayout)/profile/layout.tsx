import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import verifyToken from "@/lib/tokenVerify";
import { redirect } from "next/navigation";
import Menubar from "./components/Menubar";

const Layout = async ({ children }: { children: ReactNode }) => {
  const token = (await cookies()).get("token")?.value;
  const isValid = await verifyToken<{ id: string }>(token, "user");

  if (!isValid) {
    redirect("/login?redirect=/profile");
  }

  return (
    <div className="flex justify-center bg-gray-50 dark:bg-black min-h-screen">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 shrink-0">
          <div className="md:sticky md:top-24">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 hidden md:block tracking-tight">
              My Account
            </h1>
            <Menubar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
