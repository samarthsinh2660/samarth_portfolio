import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-ink-soft sm:flex-row">
        <p>Copyright@{new Date().getFullYear()} {profile.name}</p>
        <div className="flex items-center gap-5">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              {s.label}
            </a>
          ))}
        </div>
        <a href="#top" className="font-medium transition-colors hover:text-gold">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
