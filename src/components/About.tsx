"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

export default function About() {
  const { language } = useLanguage();
  const about = translations[language].about;

  return (
    <section className="w-full space-y-4">
      <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-purple-400">{about.title}</h2>
      <div className="glass-card rounded-3xl px-6 py-5 sm:px-8 sm:py-6">
        <p className="text-center text-sm leading-relaxed text-pink-900 sm:text-base">{about.text}</p>
      </div>
    </section>
  );
}
