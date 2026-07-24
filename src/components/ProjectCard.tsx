"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/content";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08 }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card p-6 transition-colors hover:border-gold/50"
      >
        {/* preview image */}
        <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/10] overflow-hidden border-b border-line">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          <span
            className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white"
          >
            {project.category}
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 font-mono text-xs text-ink backdrop-blur">
            {project.year}
          </span>
        </div>

        <h3 className="display text-2xl text-ink">{project.title}</h3>
        <p className="mt-3 flex-1 text-ink-soft">{project.blurb}</p>

        {project.stats && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {project.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-bg2 px-4 py-3">
                <div className="display text-3xl leading-none text-gold">
                  {s.value}
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-wide text-ink-soft">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto text-sm font-semibold text-gold transition-transform group-hover:translate-x-1">
            View project ↗
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
