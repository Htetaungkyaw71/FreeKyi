import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { socialLinks } from "../../data/socialLinks";

export function Footer() {
  return (
    <footer className="bg-cinema-card border-t border-cinema-border ">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
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

          <div>
            <h4 className="font-body font-semibold text-white mb-3 text-sm">
              Social
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Email", href: socialLinks.email },
                { label: "Telegram", href: socialLinks.telegram },
                { label: "Facebook", href: socialLinks.facebook },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-cinema-muted hover:text-white text-sm font-body transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
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
