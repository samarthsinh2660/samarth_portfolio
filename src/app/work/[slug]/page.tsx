import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { projects, getProject } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return { title: `${project.title} — Samarth Vala`, description: project.blurb };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="relative z-10">
        {/* hero */}
        <section
          className="relative isolate overflow-hidden"
          style={{ background: "var(--panel)" }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-bg/50 blur-3xl" />
            <div className="absolute -right-20 bottom-0 h-64 w-80 rounded-full bg-gold/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl px-5 pt-32 pb-16 md:pt-40">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink/80 transition-colors hover:text-gold"
            >
              ← All work
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-ink/80">
              <span className="rounded-full bg-black/20 px-3 py-1 font-semibold">
                {project.category}
              </span>
              <span>{project.year}</span>
            </div>

            <h1 className="display mt-4 text-4xl text-ink sm:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-ink/90">{project.blurb}</p>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-bg px-6 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              View live ↗
            </a>
          </div>

          {/* cover image */}
          <div className="mx-auto max-w-4xl px-5 pb-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line shadow-2xl">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* body */}
        <section className="mx-auto max-w-4xl px-5 py-16">
          {/* meta row */}
          <div className="grid grid-cols-2 gap-6 border-b border-line pb-10 sm:grid-cols-4">
            <Meta label="Role" value={project.role} />
            <Meta label="Timeline" value={project.timeline} />
            <Meta label="Year" value={project.year} />
            <Meta label="Category" value={project.category} />
          </div>

          {/* stats */}
          {project.stats && (
            <div className="mt-10 grid grid-cols-2 gap-4">
              {project.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-line bg-card px-6 py-6"
                >
                  <div className="display text-4xl text-gold sm:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm uppercase tracking-wide text-ink-soft">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* overview */}
          <div className="mt-12">
            <h2 className="display text-2xl text-accent">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              {project.overview}
            </p>
          </div>

          {/* highlights */}
          <div className="mt-12">
            <h2 className="display text-2xl text-accent">Highlights</h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-lg text-ink-soft">
                  <span className="mt-1 text-gold">◆</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* tags */}
          <div className="mt-12 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>

          {/* cta */}
          <div className="mt-14 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="rounded-full border border-line px-6 py-3 font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
            >
              ← Back to all work
            </Link>
            <Link
              href="/#contact"
              className="rounded-full bg-accent px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Start a project ↗
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink-soft">{label}</div>
      <div className="mt-1 font-semibold text-ink">{value}</div>
    </div>
  );
}
