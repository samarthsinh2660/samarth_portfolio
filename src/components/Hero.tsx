"use client";

import { useRive, Layout, Fit, Alignment, RuntimeLoader } from "@rive-app/react-canvas";
import { profile } from "@/lib/content";

// Serve the Rive wasm from our own domain so the hero works fully offline.
RuntimeLoader.setWasmUrl("/ankit/rive.wasm");

/**
 * Hero — the real Framer Rive animation (avatar + clouds + bubbles) drawn on a
 * transparent canvas, layered over the maroon background and the giant "ANKIT"
 * wordmark, with the role label on the right.
 */
export default function Hero() {
  const { RiveComponent } = useRive({
    src: "/ankit/hero.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.BottomCenter }),
  });

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] overflow-hidden"
      style={{ background: "var(--panel)" }}
    >
      {/* giant name behind */}
      <h1
        aria-hidden
        className="display pointer-events-none absolute inset-x-0 top-[24%] z-0 select-none text-center text-[24vw] leading-none text-black/20"
      >
        {profile.firstName.toUpperCase()}
      </h1>

      {/* role label — right */}
      <span className="pointer-events-none absolute right-[5%] top-[45%] z-0 hidden max-w-[9rem] text-right text-sm font-semibold uppercase tracking-[0.12em] text-black/40 lg:block">
        {profile.role}
      </span>

      {/* rive animation overlay */}
      <RiveComponent className="absolute inset-0 z-10 h-full w-full" />
    </section>
  );
}
