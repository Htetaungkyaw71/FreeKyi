// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Bookmark, ListPlus, Home, Film, Tv } from "lucide-react";
// import { useAppSelector } from "../../hooks/useStore";

// export function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [mobileNavHidden, setMobileNavHidden] = useState(false);
//   const [query, setQuery] = useState("");
//   const lastScrollY = useRef(0);
//   const touchLastY = useRef<number | null>(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const bookmarkCount = useAppSelector((s) => s.bookmarks.items.length);
//   const watchlistCount = useAppSelector((s) => s.watchlist.items.length);
//   const isDetailPage = /^\/(movie|tv)\/\d+/.test(location.pathname);

//   useEffect(() => {
//     const isMobileScreen = () => window.matchMedia("(max-width: 767px)").matches;

//     const onScroll = () => {
//       const currentScrollY = window.scrollY;
//       const isMobile = isMobileScreen();
//       const scrollDelta = currentScrollY - lastScrollY.current;

//       setScrolled(currentScrollY > 50);

//       if (searchOpen && currentScrollY > 20) {
//         setSearchOpen(false);
//       }

//       if (!isMobile || searchOpen) {
//         setMobileNavHidden(false);
//       } else if (currentScrollY < 24) {
//         setMobileNavHidden(false);
//       } else if (scrollDelta > 8) {
//         setMobileNavHidden(true);
//       } else if (scrollDelta < -8) {
//         setMobileNavHidden(false);
//       }

//       lastScrollY.current = Math.max(0, currentScrollY);
//     };

//     const onTouchStart = (event: TouchEvent) => {
//       if (!isMobileScreen() || searchOpen) return;
//       touchLastY.current = event.touches[0]?.clientY ?? null;
//     };

//     const onTouchMove = (event: TouchEvent) => {
//       if (!isMobileScreen() || searchOpen || touchLastY.current === null) return;

//       const currentY = event.touches[0]?.clientY;
//       if (currentY === undefined) return;

//       const fingerDelta = touchLastY.current - currentY;
//       if (window.scrollY < 24) {
//         setMobileNavHidden(false);
//       } else if (fingerDelta > 6) {
//         setMobileNavHidden(true);
//       } else if (fingerDelta < -6) {
//         setMobileNavHidden(false);
//       }

//       touchLastY.current = currentY;
//     };

//     const onTouchEnd = () => {
//       touchLastY.current = null;
//     };

//     window.addEventListener("scroll", onScroll);
//     window.addEventListener("resize", onScroll);
//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchmove", onTouchMove, { passive: true });
//     window.addEventListener("touchend", onTouchEnd);
//     window.addEventListener("touchcancel", onTouchEnd);

//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("resize", onScroll);
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchmove", onTouchMove);
//       window.removeEventListener("touchend", onTouchEnd);
//       window.removeEventListener("touchcancel", onTouchEnd);
//     };
//   }, [searchOpen]);

//   useEffect(() => {
//     setSearchOpen(false);
//     setMobileNavHidden(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     const updateViewportBottom = () => {
//       const viewport = window.visualViewport;
//       const bottomOffset = viewport
//         ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
//         : 0;

//       document.documentElement.style.setProperty(
//         "--visual-viewport-bottom",
//         `${bottomOffset}px`,
//       );
//     };

//     updateViewportBottom();
//     window.visualViewport?.addEventListener("resize", updateViewportBottom);
//     window.visualViewport?.addEventListener("scroll", updateViewportBottom);
//     window.addEventListener("resize", updateViewportBottom);

//     return () => {
//       window.visualViewport?.removeEventListener("resize", updateViewportBottom);
//       window.visualViewport?.removeEventListener("scroll", updateViewportBottom);
//       window.removeEventListener("resize", updateViewportBottom);
//     };
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (query.trim()) {
//       navigate(`/search?q=${encodeURIComponent(query.trim())}`);
//       setSearchOpen(false);
//       setQuery("");
//     }
//   };

//   const navLinks = [
//     { label: "Home", to: "/" },
//     { label: "Movies", to: "/movies" },
//     { label: "TV Series", to: "/tv" },
//   ];
//   const mobileNavLinks = [
//     { label: "Home", to: "/", icon: Home },
//     { label: "Movies", to: "/movies", icon: Film },
//     { label: "TV", to: "/tv", icon: Tv },
//     { label: "Saved", to: "/bookmarks", icon: Bookmark, count: bookmarkCount },
//     { label: "List", to: "/watchlist", icon: ListPlus, count: watchlistCount },
//   ];

//   return (
//     <>
//       <motion.nav
//         className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
//           isDetailPage ? "hidden md:block" : ""
//         } ${
//           scrolled
//             ? "bg-cinema-bg/95 backdrop-blur-md shadow-xl shadow-black/30"
//             : "bg-transparent"
//         }`}
//         initial={{ y: -100 }}
//         animate={{ y: mobileNavHidden ? -96 : 0 }}
//         transition={{ duration: 0.4 }}
//       >
//         <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
//           {/* Logo */}
//           <Link to="/" className="flex justify-center items-center gap-2 group">
//             <img src="/favicon.svg" width={70} height={70} alt="" />
//             {/* <div className="w-8 h-8 bg-cinema-accent rounded-sm flex items-center justify-center">
//               <Clapperboard className="w-4 h-4 text-white" />
//             </div> */}
//             {/* <span className="font-display text-2xl text-white tracking-widest">
//               FreeKyi
//             </span> */}
//           </Link>

//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.to}
//                 to={link.to}
//                 className={`font-body text-sm font-medium transition-colors relative ${
//                   location.pathname === link.to
//                     ? "text-white"
//                     : "text-cinema-muted hover:text-white"
//                 }`}
//               >
//                 {link.label}
//                 {location.pathname === link.to && (
//                   <motion.div
//                     layoutId="nav-indicator"
//                     className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cinema-accent"
//                   />
//                 )}
//               </Link>
//             ))}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center gap-3">
//             {location.pathname !== "/search" && (
//               <button
//                 onClick={() => {
//                   setMobileNavHidden(false);
//                   setSearchOpen(!searchOpen);
//                 }}
//                 className="w-9 h-9 rounded-full flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
//                 aria-label="Search"
//               >
//                 <Search className="w-5 h-5" />
//               </button>
//             )}

//             <Link
//               to="/bookmarks"
//               className="relative w-9 h-9 rounded-full hidden md:flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
//             >
//               <Bookmark className="w-5 h-5" />
//               {bookmarkCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinema-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
//                   {bookmarkCount > 9 ? "9+" : bookmarkCount}
//                 </span>
//               )}
//             </Link>

//             <Link
//               to="/watchlist"
//               className="relative w-9 h-9 rounded-full hidden md:flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
//             >
//               <ListPlus className="w-5 h-5" />
//               {watchlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinema-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
//                   {watchlistCount > 9 ? "9+" : watchlistCount}
//                 </span>
//               )}
//             </Link>

//           </div>
//         </div>

//         {/* Search Bar */}
//         <AnimatePresence>
//           {searchOpen && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: "auto", opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               className="overflow-hidden"
//             >
//               <form
//                 onSubmit={handleSearch}
//                 className="max-w-2xl mx-auto px-4 py-3"
//               >
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted" />
//                   <input
//                     autoFocus
//                     type="text"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     placeholder="Search movies, TV shows..."
//                     className="w-full bg-cinema-card border border-cinema-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cinema-text placeholder-cinema-muted focus:outline-none focus:border-cinema-accent transition-colors"
//                   />
//                 </div>
//               </form>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.nav>

//       <nav
//         className={`fixed left-0 right-0 z-[70] md:hidden border-t border-cinema-border bg-cinema-bg/95 backdrop-blur-xl shadow-2xl shadow-black/60 pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out ${
//           mobileNavHidden ? "pointer-events-none" : ""
//         }`}
//         style={{
//           bottom: "var(--visual-viewport-bottom, 0px)",
//           transform: mobileNavHidden
//             ? "translateY(calc(100% + env(safe-area-inset-bottom) + 24px))"
//             : "translateY(0)",
//         }}
//       >
//         <div className="grid h-16 grid-cols-5">
//           {mobileNavLinks.map(({ label, to, icon: Icon, count }) => {
//             const active =
//               to === "/"
//                 ? location.pathname === "/"
//                 : location.pathname === to ||
//                   (to !== "/search" && location.pathname.startsWith(`${to}/`));

//             return (
//               <Link
//                 key={to}
//                 to={to}
//                 aria-label={label}
//                 className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-body font-medium transition-colors ${
//                   active ? "text-white" : "text-cinema-muted"
//                 }`}
//               >
//                 <Icon
//                   className={`h-5 w-5 ${
//                     active ? "text-cinema-accent" : "text-current"
//                   }`}
//                 />
//                 <span>{label}</span>
//                 {count ? (
//                   <span className="absolute top-2 right-[calc(50%-1.35rem)] min-w-4 h-4 px-1 rounded-full bg-cinema-accent text-[9px] leading-4 text-black font-bold text-center">
//                     {count > 9 ? "9+" : count}
//                   </span>
//                 ) : null}
//               </Link>
//             );
//           })}
//         </div>
//       </nav>
//     </>
//   );
// }

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bookmark, ListPlus, Home, Film, Tv } from "lucide-react";
import { useAppSelector } from "../../hooks/useStore";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(true);
  const [topVisible, setTopVisible] = useState(true);
  const [query, setQuery] = useState("");

  const accumulatedDelta = useRef(0);
  const lastY = useRef(0);
  const rafId = useRef<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const bookmarkCount = useAppSelector((s) => s.bookmarks.items.length);
  const watchlistCount = useAppSelector(
    (s) =>
      (s as { watchlist?: { items: unknown[] } }).watchlist?.items.length ?? 0,
  );

  const isDetailPage = /^\/(movie|tv)\/\d+/.test(location.pathname);

  // ── Single scroll handler with accumulated delta ──────────────────────────
  const handleScroll = useCallback(() => {
    if (rafId.current) return; // already scheduled

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;

      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;

      setScrolled(y > 50);

      // Close search if scrolled meaningfully
      if (searchOpen && Math.abs(delta) > 8) {
        setSearchOpen(false);
      }

      // Don't hide when near top
      if (y < 60) {
        accumulatedDelta.current = 0;
        setBottomVisible(true);
        setTopVisible(!isDetailPage);
        return;
      }

      accumulatedDelta.current += delta;

      if (accumulatedDelta.current > 40) {
        accumulatedDelta.current = 0;
        setBottomVisible(false);
        setTopVisible(false);
      } else if (accumulatedDelta.current < -20) {
        accumulatedDelta.current = 0;
        setBottomVisible(true);
        setTopVisible(true);
      }
    });
  }, [isDetailPage, searchOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  // Reset on route change
  useEffect(() => {
    setSearchOpen(false);
    setBottomVisible(true);
    setTopVisible(!isDetailPage || window.scrollY > 80);
    accumulatedDelta.current = 0;
    lastY.current = window.scrollY;
  }, [isDetailPage, location.pathname]);

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

  const mobileNavLinks = [
    { label: "Home", to: "/", icon: Home, count: 0 },
    { label: "Movies", to: "/movies", icon: Film, count: 0 },
    { label: "TV", to: "/tv", icon: Tv, count: 0 },
    { label: "Saved", to: "/bookmarks", icon: Bookmark, count: bookmarkCount },
    { label: "List", to: "/watchlist", icon: ListPlus, count: watchlistCount },
  ];

  return (
    <>
      {/* ── Top nav ───────────────────────────────────────────────────── */}
      <nav
        className={`pwa-top-nav fixed top-0 left-0 right-0 z-[9999] ${
          isDetailPage ? "hidden md:block" : ""
        } ${
          scrolled
            ? "bg-cinema-bg/95 backdrop-blur-md shadow-xl shadow-black/30"
            : "bg-transparent"
        }`}
        style={{
          transform: topVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" width={60} height={60} alt="FreeKyi" />
            <span className="hidden text-lg font-body font-bold tracking-wide text-white md:inline">
              FreeKyi
            </span>
          </Link>

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

          <div className="flex items-center gap-3">
            {location.pathname !== "/search" && (
              <button
                onClick={() => {
                  setTopVisible(true);
                  setSearchOpen((v) => !v);
                }}
                className="hidden h-10 min-w-64 items-center justify-between gap-3 rounded-full border border-cinema-border bg-cinema-card/80 px-4 text-sm text-cinema-muted transition-colors hover:border-cinema-accent/50 hover:text-white lg:flex"
                aria-label="Search"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search titles...
                </span>
              </button>
            )}
            {location.pathname !== "/search" && (
              <button
                onClick={() => {
                  setTopVisible(true);
                  setSearchOpen((v) => !v);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-cinema-muted max-md:text-slate-300  hover:text-white hover:bg-cinema-hover transition-all lg:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <Link
              to="/bookmarks"
              className="relative w-9 h-9 rounded-full hidden md:flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinema-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {bookmarkCount > 9 ? "9+" : bookmarkCount}
                </span>
              )}
            </Link>
            <Link
              to="/watchlist"
              className="relative w-9 h-9 rounded-full hidden md:flex items-center justify-center text-cinema-muted hover:text-white hover:bg-cinema-hover transition-all"
            >
              <ListPlus className="w-5 h-5" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cinema-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {watchlistCount > 9 ? "9+" : watchlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
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
      </nav>

      {/* ── Bottom mobile nav ─────────────────────────────────────────────
          Strategy: always `bottom: 0`, use CSS transform to slide off-screen.
          NO dynamic bottom value — that's what caused the jank.
          Safe-area handled purely with padding-bottom via CSS env().
      ──────────────────────────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed left-0 right-0 z-[9998] border-t border-cinema-border bg-cinema-bg/95 backdrop-blur-xl"
        style={{
          bottom: 0,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          transform: bottomVisible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        <div className="grid h-16 grid-cols-5">
          {mobileNavLinks.map(({ label, to, icon: Icon, count }) => {
            const active =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);

            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-body font-medium transition-colors ${
                  active ? "text-white" : "text-cinema-muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "text-cinema-accent" : "text-current"
                  }`}
                />
                <span>{label}</span>
                {count > 0 && (
                  <span className="absolute top-2 right-[calc(50%-1.4rem)] min-w-[1rem] h-4 px-1 rounded-full bg-cinema-accent text-[9px] leading-4 text-black font-bold text-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
