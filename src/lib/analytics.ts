import { siteConfig } from "@/config/site.config";

declare global {
  interface Window { ym?: (...args: unknown[]) => void; gtag?: (...args: unknown[]) => void; }
}

export function trackEvent(name: string, params?: { id?: string; type?: string }) {
  const id = Number(siteConfig.analytics.yandexMetrikaId);
  if (typeof window !== "undefined") {
    if (id > 0) window.ym?.(id, "reachGoal", name, params ?? {});
    window.gtag?.("event", name, params ?? {});
  }
}
