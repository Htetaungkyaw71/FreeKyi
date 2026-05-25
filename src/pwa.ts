import { registerSW } from "virtual:pwa-register";

export const updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("pwa:update-ready"));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent("pwa:offline-ready"));
  },
});
