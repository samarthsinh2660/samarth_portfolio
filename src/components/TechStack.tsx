import { techRows } from "@/lib/content";

/**
 * Tech Stack — rows of badges scrolling in alternating directions (a marquee).
 * Pauses on hover.
 */
export default function TechStack() {
  return (
    <section id="stack" className="overflow-hidden bg-bg">
      <div className="mx-auto max-w-6xl px-5 pt-20 md:pt-28">
        <h2 className="display text-4xl text-accent sm:text-5xl md:text-6xl">
          Tech Stack
        </h2>
        <p className="mt-5 max-w-md text-lg text-ink-soft">
          The languages, frameworks, and tools I reach for to design, build, and
          ship reliable products.
        </p>
      </div>

      <div className="relative mt-12 flex flex-col gap-4 pb-20 md:pb-28">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

        {techRows.map((row, i) => (
          <Marquee key={i} badges={row} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function Marquee({ badges, reverse }: { badges: string[]; reverse: boolean }) {
  const items = [...badges, ...badges];
  return (
    <div className="group flex overflow-hidden">
      <div
        className={`flex w-max shrink-0 items-center gap-3 pr-3 ${
          reverse ? "animate-marquee-rev" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
      >
        {items.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="h-8 w-auto shrink-0 rounded-[6px]"
          />
        ))}
      </div>
    </div>
  );
}
