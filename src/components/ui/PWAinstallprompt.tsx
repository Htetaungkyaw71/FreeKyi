import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, Share, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean(
        (window.navigator as Navigator & { standalone?: boolean }).standalone,
      ))
  );
}

function isAppleMobileBrowser() {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
}

function isMobileBrowser() {
  return /android|iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase(),
  );
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(isStandaloneApp);
  const [isIOS] = useState(isAppleMobileBrowser);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (installed) return;

    // Don't show if already installed or dismissed recently
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed && Date.now() - Number(dismissed) < 1000 * 60 * 60 * 24 * 7)
      return; // 7 days

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 5000);
    };
    const installedHandler = () => setInstalled(true);
    const updateHandler = () => {
      setUpdateReady(true);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);
    window.addEventListener("pwa:update-ready", updateHandler);

    if (isMobileBrowser() && isIOS) {
      setTimeout(() => setShow(true), 7000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      window.removeEventListener("pwa:update-ready", updateHandler);
    };
  }, [installed, isIOS]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-prompt-dismissed", String(Date.now()));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (installed || !show) return null;
  const canInstall = Boolean(deferredPrompt);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] z-[10000] mx-auto max-w-md md:inset-x-auto md:right-6 md:bottom-6 md:w-80 md:max-w-none"
      >
        <div className="bg-cinema-card border border-cinema-border rounded-2xl p-3 shadow-2xl shadow-black/50 backdrop-blur-sm min-[420px]:p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cinema-accent rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-body font-semibold text-[15px] leading-tight">
                {updateReady ? "Update FreeKyi App" : "Install FreeKyi App"}
              </p>
              <p className="text-cinema-muted text-xs mt-1 font-body leading-relaxed">
                {updateReady
                  ? "A new version is ready. Refresh to get the latest app."
                  : isIOS && !canInstall
                    ? "Tap Share, then Add to Home Screen to install on iPhone."
                    : "Add to your home screen for faster access and app-like viewing."}
              </p>
              <div className="grid grid-cols-1 gap-2 mt-3 min-[420px]:grid-cols-[1fr_auto]">
                {updateReady ? (
                  <button
                    onClick={handleRefresh}
                    className="flex min-h-11 w-full items-center justify-center gap-1.5 bg-cinema-accent hover:bg-red-700 text-white text-xs font-body font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Update
                  </button>
                ) : canInstall ? (
                  <button
                    onClick={handleInstall}
                    className="flex min-h-11 w-full items-center justify-center gap-1.5 bg-cinema-accent hover:bg-red-700 text-white text-xs font-body font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Install
                  </button>
                ) : (
                  <div className="flex min-h-11 w-full items-center justify-center gap-1.5 text-white text-xs font-body font-semibold px-3 py-2 rounded-lg bg-cinema-hover border border-cinema-border text-center">
                    <Share className="w-3.5 h-3.5" />
                    Add to Home Screen
                  </div>
                )}
                <button
                  onClick={handleDismiss}
                  className="min-h-10 text-cinema-muted hover:text-white text-xs font-body px-3 py-2 rounded-lg transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-cinema-muted hover:text-white transition-colors flex-shrink-0 -m-1 p-1"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
