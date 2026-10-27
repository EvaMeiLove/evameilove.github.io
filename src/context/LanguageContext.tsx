"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, ReactNode } from "react";

export type Language = "ru" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "ru",
  setLanguage: () => {},
});

// Один источник языка для React и localStorage; сервер всегда начинает с ru.
let currentLanguage: Language = "ru";
const listeners = new Set<() => void>();
function readLanguage(): Language {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "ru" || saved === "en") return saved;
  } catch { /* Хранилище может быть отключено браузером. */ }
  return currentLanguage;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
function updateLanguage(lang: Language) {
  currentLanguage = lang;
  try { localStorage.setItem("lang", lang); } catch { /* Остаётся в памяти. */ }
  listeners.forEach((listener) => listener());
}
export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, readLanguage, () => "ru" as Language);
  const setLanguage = updateLanguage;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

