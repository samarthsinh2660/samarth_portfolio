import { profile } from "@/lib/content";

/** Intro statement band shown between the hero and the work section. */
export default function Statement() {
  return (
    <section className="bg-bg px-5 py-24 md:py-32">
      <p className="mx-auto max-w-4xl text-center text-2xl font-medium leading-relaxed text-ink sm:text-3xl md:text-4xl md:leading-[1.35]">
        {profile.statement}
      </p>
    </section>
  );
}
