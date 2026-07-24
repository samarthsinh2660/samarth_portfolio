"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

const links = [
  { label: "Home", href: "/#top", id: "top" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Work", href: "/#work", id: "work" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

/** Scroll-spy: returns the id of the section currently in view. */
function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="mx-auto max-w-5xl px-5 py-4">
        <div className="flex items-center justify-between rounded-full border border-line bg-card/80 px-4 py-2 backdrop-blur-md">
          {/* brand + status */}
          <a href="/#top" className="flex items-center gap-2.5 pl-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-xs font-bold tracking-tight text-white">
              SV
            </span>
            <span className="hidden items-center gap-2 text-sm text-ink-soft sm:flex">
              Available for work
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
            </span>
          </a>

          {/* center links */}
          <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`underline-offset-[6px] transition-colors hover:text-gold ${
                      isActive
                        ? "text-gold underline decoration-wavy decoration-gold decoration-2"
                        : "text-ink"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* resume */}
          <a
            href={profile.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            View Resume ↗
          </a>

          {/* mobile toggle */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center md:hidden"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>

        {open && (
          <ul className="mt-2 space-y-1 rounded-3xl border border-line bg-card p-3 md:hidden">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl px-4 py-3 font-medium hover:bg-bg2 ${
                    active === l.id ? "text-gold" : ""
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resumeHref}
                onClick={() => setOpen(false)}
                className="block rounded-2xl bg-gold px-4 py-3 font-semibold text-bg"
              >
                View Resume ↗
              </a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
