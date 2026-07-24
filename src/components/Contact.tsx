"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/content";

const footerLinks = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "View Resume", href: profile.resumeHref },
  { label: "404", href: "/404" },
];

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date()
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          .toLowerCase()
      );
    tick();
    const id = setInterval(tick, 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Contact() {
  const time = useClock();

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden"
      style={{ background: "var(--panel)" }}
    >
      {/* cream clouds along the top edge */}
      <div className="pointer-events-none absolute -top-10 inset-x-0 z-0 flex justify-between text-gold">
        <Cloud scale={1.3} />
        <Cloud scale={1.5} className="hidden sm:block" />
        <Cloud scale={1.3} />
      </div>

      {/* giant CONTACT ME behind */}
      <h2
        aria-hidden
        className="display pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center text-[18vw] leading-none text-black/15"
      >
        CONTACT ME
      </h2>

      <div className="relative z-10 mx-auto max-w-4xl px-5 pt-28 pb-10">
        {/* footer nav */}
        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-ink">
          {footerLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="transition-colors hover:text-gold">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* pager */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 w-full max-w-md rounded-[2rem] bg-neutral-900 p-5 shadow-2xl ring-1 ring-black/40"
        >
          {/* screen */}
          <div className="rounded-2xl bg-[#3ddc84] p-5 font-mono text-black shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>2G</span>
              <span>{time || "--:--"}</span>
            </div>
            <p className="mt-6 text-center text-sm">Contact me via email</p>
            <p className="mt-1 break-all text-center text-lg font-bold sm:text-xl">
              {profile.email}
            </p>
          </div>

          <p className="mt-4 text-left text-sm font-semibold italic text-ink-soft">
            {profile.brand}
          </p>

          {/* buttons */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-6 w-1.5 -skew-x-12 rounded bg-neutral-700" />
              <span className="h-6 w-1.5 -skew-x-12 rounded bg-neutral-700" />
              <span className="h-6 w-1.5 -skew-x-12 rounded bg-neutral-700" />
            </div>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-neutral-800 px-4 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-neutral-700"
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-neutral-800 px-4 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-neutral-700"
            >
              GitHub
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex-1 rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>

      {/* bottom bar */}
      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-center px-5 pb-8 pt-10 text-sm text-ink/70">
        <p className="text-center">
          Copyright@{new Date().getFullYear()} · {profile.name}
        </p>
      </div>
    </section>
  );
}

/** Cloud silhouette built from overlapping circles. */
function Cloud({
  className = "",
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  return (
    <svg
      width={280 * scale}
      height={160 * scale}
      viewBox="0 0 320 200"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <circle cx="70" cy="140" r="70" />
      <circle cx="150" cy="110" r="95" />
      <circle cx="240" cy="140" r="70" />
      <rect x="60" y="130" width="200" height="80" />
    </svg>
  );
}
