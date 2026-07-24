import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import PinnedWork from "@/components/PinnedWork";
import TechStack from "@/components/TechStack";
import ServicesAbout from "@/components/ServicesAbout";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Experience />
        <PinnedWork />
        <TechStack />
        <ServicesAbout />
        <Contact />
      </main>
    </>
  );
}
