"use client";

import { useEffect } from "react";
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  RuntimeLoader,
} from "@rive-app/react-canvas";
import { profile } from "@/lib/content";

// Serve the Rive wasm from our own domain so the hero works fully offline.
RuntimeLoader.setWasmUrl("/ankit/rive.wasm");

/**
 * Hero — the Rive animation (avatar + clouds). The subtitle is an editable text
 * run, overridden at runtime with the role. The big wordmark is baked as vector
 * outlines in the .riv, so it's covered with our own watermark of the name.
 */
export default function Hero() {
  const { rive, RiveComponent } = useRive({
    src: "/ankit/hero.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.BottomCenter }),
  });

  useEffect(() => {
    if (!rive) return;
    try {
      rive.setTextRunValue("Run 1", profile.role.toUpperCase());
    } catch {
      /* run not present */
    }
  }, [rive]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] overflow-hidden"
      style={{ background: "var(--panel)" }}
    >
      <h1 className="sr-only">
        {profile.name} — {profile.role.replace(/^A\s+/, "")}
      </h1>

      {/* rive art (wordmark + subtitle overridden with the current name/role) */}
      <RiveComponent className="absolute inset-0 z-10 h-full w-full" />
    </section>
  );
}
