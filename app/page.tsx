'use client'
import Menubar, { SearchBar } from "./components/Menubar";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
    const navigate = useRouter();

    return (
        <>
            <Menubar />
            <div className="flex-1 p-2">
                <SearchBar className="md:hidden" active={true} onSelect={(test) => navigate.push('/tests/' + test._id)} />
            </div>
            <Footer />
        </>
    );
}
