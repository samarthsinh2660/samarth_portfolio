"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { featuredProjects, type Project } from "@/lib/content";

/**
 * Work — the "WORK" wordmark stays pinned in the centre while each card scrolls
 * up and over it: project 1, project 2, then the "View all projects" card
 * (which rises and stays). Project cards are cream, turning red on hover.
 */
export default function PinnedWork() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });

  // [rise-in, reach-centre, start-exit, exit-up]
  const cardWindows: [number, number, number, number][] = [
    [0, 0.05, 0.3, 0.37],
    [0.37, 0.44, 0.66, 0.73],
  ];
  const viewWindow: [number, number, number, number] = [0.73, 0.8, 0.999, 1];
  const exitOut = ["110vh", "0vh", "0vh", "-110vh"];
  const stayOut = ["110vh", "0vh", "0vh", "0vh"];

  return (
    <section id="work" className="relative bg-bg">
      <div ref={track} className="relative h-[440vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* pinned wordmark behind */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="display select-none text-6xl text-accent sm:text-8xl md:text-[11rem] md:leading-none">
              Work
            </h2>
          </div>

          {featuredProjects.map((project, i) => (
            <Fly
              key={project.slug}
              progress={scrollYProgress}
              window={cardWindows[i]}
              outputs={exitOut}
            >
              <ProjectCard project={project} />
            </Fly>
          ))}

          <Fly progress={scrollYProgress} window={viewWindow} outputs={stayOut}>
            <ViewAllCard />
          </Fly>
        </div>
      </div>
    </section>
  );
}

/** Positions a card and scrolls it vertically through the pinned stage. */
function Fly({
  progress,
  window: w,
  outputs,
  children,
}: {
  progress: MotionValue<number>;
  window: [number, number, number, number];
  outputs: string[];
  children: React.ReactNode;
}) {
  const y = useTransform(progress, w, outputs);
  return (
    <motion.div
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center px-5"
    >
      {children}
    </motion.div>
  );
}

const themes = {
  red: {
    panel: "var(--panel)",
    tag: "bg-black/20 text-ink",
    title: "text-ink",
    desc: "text-ink/80",
    divider: "bg-black/15",
    statBox: "bg-black/20",
    statNum: "text-gold",
    statLabel: "text-ink/90",
  },
  cream: {
    panel: "#e7dfc1",
    tag: "bg-[#e8a54d] text-[#3a2c18]",
    title: "text-[#241d18]",
    desc: "text-[#241d18]/70",
    divider: "bg-black/10",
    statBox: "bg-[#f3edcf]",
    statNum: "text-[#241d18]",
    statLabel: "text-[#241d18]/70",
  },
} as const;

function ProjectCard({ project }: { project: Project }) {
  const [hover, setHover] = useState(false);
  const t = hover ? themes.red : themes.cream;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex w-full max-w-4xl -rotate-[1.5deg] flex-col items-stretch gap-6 md:flex-row md:items-center"
    >
      {/* image */}
      <div className="relative z-10 md:w-[44%] md:shrink-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-[#14100e] shadow-2xl ring-1 ring-black/30">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 44vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* panel */}
      <div
        className="relative flex flex-1 flex-col rounded-[2rem] p-7 shadow-2xl transition-colors duration-300 md:-ml-16 md:py-9 md:pl-24 md:pr-9"
        style={{ background: t.panel }}
      >
        {/* red pointer notch toward the image */}
        <span className="absolute left-20 top-1/2 hidden h-0 w-0 -translate-y-1/2 border-y-[12px] border-r-[16px] border-y-transparent border-r-accent md:block" />

        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wide transition-colors duration-300 ${t.tag}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className={`mt-4 text-2xl font-bold leading-snug transition-colors duration-300 md:text-3xl ${t.title}`}>
          {project.title}
        </h3>
        <p className={`mt-3 text-sm leading-relaxed transition-colors duration-300 md:text-base ${t.desc}`}>
          {project.blurb}
        </p>

        <div className={`my-6 h-px w-full transition-colors duration-300 ${t.divider}`} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.stats.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 rounded-2xl px-5 py-4 transition-colors duration-300 ${t.statBox}`}
            >
              <div
                className={`display shrink-0 text-4xl italic leading-none transition-colors duration-300 md:text-5xl ${t.statNum}`}
              >
                {s.value}
              </div>
              <div className={`text-sm font-medium leading-tight transition-colors duration-300 ${t.statLabel}`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            View Project ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

function ViewAllCard() {
  return (
    <Link
      href="/work"
      className="group relative flex w-full max-w-2xl rotate-2 flex-col items-center justify-center gap-6 overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#f4ecd0] to-[#d9cfa6] px-8 py-16 text-center transition-transform hover:rotate-0"
    >
      <h3 className="display text-5xl leading-none text-bg md:text-6xl">
        View all
        <br />
        projects
      </h3>
      <span className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform group-hover:translate-x-1">
        View Project ↗
      </span>
    </Link>
  );
}
