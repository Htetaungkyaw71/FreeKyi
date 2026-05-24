import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { store } from "./store";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

const Home = lazy(() => import("./pages/Home"));
const Browse = lazy(() => import("./pages/Browse"));
const Detail = lazy(() => import("./pages/Detail"));
const SearchPage = lazy(() => import("./pages/Search"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));

// Loading fallback for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cinema-bg">
    <div className="w-8 h-8 rounded-full border-4 border-cinema-accent border-t-transparent animate-spin" />
  </div>
);

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Browse mediaType="movie" />} />
              <Route path="/tv" element={<Browse mediaType="tv" />} />
              <Route path="/movie/:id" element={<Detail mediaType="movie" />} />
              <Route path="/tv/:id" element={<Detail mediaType="tv" />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
