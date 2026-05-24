import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bookmark, Menu, X } from "lucide-react";
import { useAppSelector } from "../../hooks/useStore";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const bookmarkCount = useAppSelector((s) => s.bookmarks.items.length);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setSearchOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Movies", to: "/movies" },
    { label: "TV Series", to: "/tv" },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cinema-bg/95 backdrop-blur-md shadow-xl shadow-black/30"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex justify-center items-center gap-2 group">
            <img src="/f.png" width={70} height={70} alt="" />
            {/* <div className="w-8 h-8 bg-cinema-accent rounded-sm flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-white" />
            </div> */}
            {/* <span className="font-display text-2xl text-white tracking-widest">
              FreeKyi
            </span> */}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-medium transition-colors relative ${
                  location.pathname === link.to
                    ? "text-white"
                    : "text-cinema-muted hover:text-white"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cinema-accent"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {location.pathname !== "/search" && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            <Link
              to="/bookmarks"
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinema-accent text-white text-[9px] rounded-full flex items-center justify-center font-mono">
                  {bookmarkCount > 9 ? "9+" : bookmarkCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-cinema-muted hover:text-white"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setSearchOpen(false);
              }}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSearch}
                className="max-w-2xl mx-auto px-4 py-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted" />
                  <input
                    autoFocus
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movies, TV shows..."
                    className="w-full bg-cinema-card border border-cinema-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cinema-text placeholder-cinema-muted focus:outline-none focus:border-cinema-accent transition-colors"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-y-0 right-0 w-64 z-40 bg-cinema-card border-l border-cinema-border shadow-2xl pt-16"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block font-body text-lg text-cinema-muted hover:text-white py-2 border-b border-cinema-border transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/bookmarks"
                className="block font-body text-lg text-cinema-muted hover:text-white py-2"
              >
                Bookmarks
                {bookmarkCount > 0 && (
                  <span className="ml-2 bg-cinema-accent text-white text-xs px-2 py-0.5 rounded-full">
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
