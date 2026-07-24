"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  services,
  servicesIntro,
  profile,
  aboutStats,
} from "@/lib/content";
import CountUp from "./CountUp";

const DESK = "/ankit/OU2N8fmCZPy5UcRl850My3naOU.jpg";
const PORTRAIT = "/ankit/WOo33WfHeltZg5anoAMOWEDGI4E.jpg";

/**
 * Services → About. The left column scrolls from the "What I can do for you"
 * accordion to the "About me" block, while a single pinned card on the right
 * flips (Y-axis) from the desk photo to the portrait — one card, one flip,
 * mirroring the reference.
 */
export default function ServicesAbout() {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // Flip the card from desk (front) to portrait (back) around the midpoint.
  const rotateY = useTransform(scrollYProgress, [0.32, 0.58], [0, 180]);

  return (
    <section ref={section} className="relative bg-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 md:grid-cols-2">
        {/* left column — scrolls Services then About */}
        <div>
          <ServicesBlock />
          <AboutBlock />
        </div>

        {/* right column — one pinned flip card */}
        <div className="hidden md:block">
          <div
            className="sticky top-0 flex h-screen items-center justify-center"
            style={{ perspective: 1600 }}
          >
            <motion.div
              style={{ rotateY, transformStyle: "preserve-3d", rotate: 4 }}
              className="relative aspect-[3/4] w-full max-w-sm"
            >
              {/* front — desk */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/30 [backface-visibility:hidden]">
                <Image src={DESK} alt="Selected design work" fill sizes="384px" className="object-cover" />
              </div>
              {/* back — portrait */}
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-black/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <Image src={PORTRAIT} alt={profile.name} fill sizes="384px" className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesBlock() {
  const [open, setOpen] = useState(-1);
  return (
    <div
      id="services"
      className="flex min-h-screen flex-col justify-center py-20 md:py-0"
    >
      <h2 className="display text-4xl text-accent sm:text-5xl md:text-6xl">
        What I can do for you
      </h2>
      <p className="mt-5 max-w-md text-lg text-ink-soft">{servicesIntro}</p>

      {/* mobile image */}
      <div className="relative mt-8 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-[2rem] md:hidden">
        <Image src={DESK} alt="Selected design work" fill sizes="320px" className="object-cover" />
      </div>

      <div className="mt-10">
        {services.map((s, i) => {
          const isOpen = open === i;
          return (
            <div key={s.title} className="border-b border-line">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span
                  className={`text-xl font-semibold transition-colors md:text-2xl ${
                    isOpen ? "text-gold" : "text-ink"
                  }`}
                >
                  {s.title}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-5 w-5 shrink-0 transition-transform ${
                    isOpen ? "rotate-180 text-gold" : "text-ink-soft"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2 pb-6 text-ink-soft">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AboutBlock() {
  return (
    <div
      id="about"
      className="flex min-h-screen flex-col justify-center py-20 md:py-0"
    >
      <h2 className="display text-5xl text-accent sm:text-6xl">About me</h2>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
        {profile.bio}
      </p>

      {/* mobile image */}
      <div className="relative mt-8 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-[2rem] md:hidden">
        <Image src={PORTRAIT} alt={profile.name} fill sizes="320px" className="object-cover" />
      </div>

      <div className="mt-10 grid grid-cols-3 gap-4">
        {aboutStats.map((s) => (
          <div key={s.label}>
            <div className="display text-3xl text-gold sm:text-4xl">
              <CountUp value={s.value} />
            </div>
            <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <a
        href="#contact"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
      >
        More About Me ↗
      </a>
    </div>
  );
}
