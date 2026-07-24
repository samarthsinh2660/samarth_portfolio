"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { experiences } from "@/lib/content";

/**
 * Experience — the heading pins on the left while the timeline scrolls on the
 * right, with an accent line that fills as you scroll (scroll-linked progress).
 */
export default function Experience() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="bg-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-20 md:grid-cols-[0.75fr_1.25fr] md:py-28">
        {/* pinned heading */}
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="display text-4xl text-accent sm:text-5xl md:text-6xl">
            Experience
          </h2>
          <p className="mt-5 max-w-xs text-lg text-ink-soft">
            Shipping production software across payroll, enterprise, and mobile —
            and contributing to open-source core.
          </p>
          <p className="mt-8 font-mono text-sm text-gold">
            {experiences.filter((e) => e.kind === "work").length} roles ·
            open-source contributor
          </p>
        </div>

        {/* timeline with progress line */}
        <div ref={track} className="relative pl-8 md:pl-10">
          <div className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-line" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-0 top-2 w-px bg-accent"
          />

          {experiences.map((e, i) => (
            <motion.div
              key={e.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative pb-14 last:pb-0"
            >
              {/* node */}
              <span className="absolute -left-[38px] top-1.5 h-3.5 w-3.5 rounded-full bg-accent ring-4 ring-bg md:-left-[46px]" />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-gold">
                <span>{e.date}</span>
                {e.location && (
                  <span className="text-ink-soft">· {e.location}</span>
                )}
                {e.kind === "opensource" && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent">
                    Open Source
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-xl font-bold text-ink md:text-2xl">
                {e.title}
                <span className="text-ink-soft"> · </span>
                {e.link ? (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-gold"
                  >
                    {e.company}
                  </a>
                ) : (
                  <span className="text-ink-soft">{e.company}</span>
                )}
              </h3>

              <ul className="mt-4 space-y-2.5">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-3 text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
