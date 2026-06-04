import { registerSW } from "virtual:pwa-register";

const standaloneMediaQuery = window.matchMedia("(display-mode: standalone)");

function updateStandaloneClass() {
  const isStandalone =
    standaloneMediaQuery.matches ||
    ("standalone" in window.navigator &&
      Boolean(
        (window.navigator as Navigator & { standalone?: boolean }).standalone,
      ));

  document.documentElement.classList.toggle("pwa-standalone", isStandalone);
}

updateStandaloneClass();
standaloneMediaQuery.addEventListener("change", updateStandaloneClass);

export const updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("pwa:update-ready"));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent("pwa:offline-ready"));
  },
});
