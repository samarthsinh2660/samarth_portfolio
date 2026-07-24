import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import PinnedWork from "@/components/PinnedWork";
import ServicesAbout from "@/components/ServicesAbout";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Statement />
        <PinnedWork />
        <ServicesAbout />
        <Contact />
      </main>
    </>
  );
}
