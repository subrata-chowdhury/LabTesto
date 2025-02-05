import Image from "next/image";
import Slide from "./components/Slide";
import Menubar from "./components/Menubar";
import Footer from "./components/Footer";

export default function Home() {
    return (
        <>
            <Menubar />
            <div className="flex-1"></div>
            <Footer />
        </>
    );
}
