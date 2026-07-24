import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Work — Ankit Dularia",
  description: "Selected design work — apps, interfaces, and case studies.",
};

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-5 pt-32 pb-10 md:pt-40">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-gold"
          >
            ← Back home
          </Link>
          <h1 className="display mt-6 text-5xl sm:text-7xl md:text-8xl">
            All <span className="text-accent">work</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-ink-soft">
            The full archive — {projects.length} projects spanning apps,
            interfaces, branding, and design systems.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
