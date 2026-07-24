"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProjectCard from "./ProjectCard";
import { featuredProjects } from "@/lib/content";

export default function FeaturedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      {/* oversized section title */}
      <div className="relative text-center">
        <h2 className="display text-6xl text-accent sm:text-8xl md:text-[9rem] md:leading-none">
          Work
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          A few projects I&apos;m proud of. Each one taught me something new
          about shipping software people actually use.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      {/* View all projects CTA card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-10"
      >
        <Link
          href="/work"
          className="group relative mx-auto flex max-w-xl -rotate-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-[2rem] bg-gold px-8 py-12 text-center transition-transform hover:rotate-0 hover:-translate-y-1"
        >
          <h3 className="display text-4xl text-bg md:text-5xl">
            View all projects
          </h3>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform group-hover:translate-x-1">
            Browse everything ↗
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
