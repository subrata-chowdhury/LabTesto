// app/(mainLayout)/page.tsx
import Footer from "../components/Footer";

import FrequentRequiredTests from "./_components/FrequentRequiredTests";
import { Promises } from "./_components/Promises";
import { Packages } from "./_components/Packages";
import { Achievements } from "./_components/Achievements";
import SliderSection from "./_components/SliderSection";

export default function Home() {
  return (
    <>
      <main
        id="main"
        className="flex-1 overflow-hidden bg-white dark:bg-[#0a0a0a]"
      >
        <SliderSection />
        <FrequentRequiredTests />
        <Promises />
        <Packages />
        <Achievements />
      </main>
      <Footer />
    </>
  );
}
