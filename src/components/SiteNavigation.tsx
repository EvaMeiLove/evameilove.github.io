"use client";

import { useEffect, useState } from "react";
import { Heart, House, Images, Link2, Music2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Props = { showGallery: boolean; showMedia: boolean; showSupport: boolean };

export default function SiteNavigation({ showGallery, showMedia, showSupport }: Props) {
  const { language } = useLanguage();
  const ru = language === "ru";
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("home");
  const items = [
    { id: "home", icon: House, label: ru ? "Главная" : "Home", show: true },
    { id: "links", icon: Link2, label: ru ? "Ссылки" : "Links", show: true },
    { id: "gallery", icon: Images, label: ru ? "Фото" : "Photos", show: showGallery },
    { id: "support", icon: Heart, label: ru ? "Поддержка" : "Support", show: showSupport },
    { id: "wishes", icon: Sparkles, label: ru ? "Мечты" : "Wishes", show: showSupport },
    { id: "media", icon: Music2, label: ru ? "Медиа" : "Media", show: showMedia },
  ].filter(item => item.show);
  const ids = items.map(item => item.id).join(",");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, Math.max(0, window.scrollY / height * 100)) : 0);
      let current = "home";
      for (const id of ids.split(",")) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); if (frame) cancelAnimationFrame(frame); };
  }, [ids]);

  return <nav aria-label={ru ? "Навигация по странице" : "Page navigation"} className="fixed z-40 inset-x-3 bottom-3 sm:bottom-auto sm:top-4 sm:inset-x-4 sm:max-w-2xl sm:mx-auto" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
    <div className="flex flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_8px_35px_rgba(131,24,67,.14)] backdrop-blur-xl">
      <div className="order-last mx-4 mb-2 h-1 overflow-hidden rounded-full bg-pink-100 sm:order-first sm:mb-0 sm:mt-2" aria-hidden="true"><div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400" style={{ width: `${progress}%` }} /></div>
      <div className="order-first flex justify-around px-1 py-1.5 sm:order-last sm:px-2">
        {items.map(({ id, icon: Icon, label }) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} className={`min-w-0 flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 rounded-2xl py-1.5 sm:px-1 text-[9px] sm:text-xs font-medium transition-colors ${active === id ? "bg-pink-100 text-pink-800" : "text-pink-700 hover:bg-pink-50"}`}>
          <Icon size={17} aria-hidden="true" /><span className="truncate">{label}</span>
        </a>)}
      </div>
    </div>
  </nav>;
}
