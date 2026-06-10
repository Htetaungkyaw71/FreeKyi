import { Link } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import { socialLinks } from "../../data/socialLinks";

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M14 8.5h2.2V5.2H14c-2.8 0-4.5 1.7-4.5 4.6v2H7v3.4h2.5V22h3.6v-6.8h2.7l.5-3.4h-3.2V10c0-1 .3-1.5.9-1.5Z" />
    </svg>
  );
}

export function Footer() {
  const socialItems = [
    { label: "Email", href: socialLinks.email, icon: Mail },
    { label: "Telegram", href: socialLinks.telegram, icon: Send },
    {
      label: "Facebook",
      href: socialLinks.facebook,
      icon: FacebookIcon,
      iconClassName: "h-5 w-5",
    },
  ];

  return (
    <footer className="border-t border-cinema-border bg-cinema-card">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[minmax(260px,1.35fr)_repeat(3,minmax(120px,0.65fr))]">
          <div className="col-span-2 max-w-sm md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/favicon.svg" width={40} height={40} alt="" />
              {/* <div className="w-7 h-7 bg-cinema-accent rounded-sm flex items-center justify-center">
                <Clapperboard className="w-3.5 h-3.5 text-white" />
              </div> */}
              <span className="font-display text-xl mt-1 text-white tracking-widest">
                FreeKyi
              </span>
            </Link>
            <p className="text-cinema-muted text-xs leading-relaxed font-body">
              Your premium destination for movies and TV series.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {socialItems.map(
                ({ href, icon: Icon, iconClassName = "h-4 w-4", label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-cinema-border bg-cinema-hover/70 text-cinema-muted transition-colors hover:border-cinema-accent hover:bg-cinema-accent hover:text-white"
                >
                  <Icon className={iconClassName} />
                </a>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white mb-3 text-sm">
              Browse
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Movies", to: "/movies" },
                { label: "TV Series", to: "/tv" },
                { label: "MM Subtitles", to: "/myanmar-subtitles" },
                { label: "Watch Online", to: "/watch-free-movies-online" },
                { label: "Search", to: "/search" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-cinema-muted hover:text-white text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white mb-3 text-sm">
              Genres
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Action", to: "/movies?genre=28" },
                { label: "Horror", to: "/movies?genre=27" },
                { label: "Drama", to: "/movies?genre=18" },
                { label: "Comedy", to: "/movies?genre=35" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-cinema-muted hover:text-white text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-white mb-3 text-sm">
              FreeKyi
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Bookmarks", to: "/bookmarks" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-cinema-muted hover:text-white text-sm font-body transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-cinema-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-cinema-muted text-xs font-body">© 2026 FreeKyi.</p>
          <p className="text-cinema-muted text-xs font-body">
            For entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
