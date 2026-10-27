"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import Photo from "./Photo";
import { SiteConfig } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

type GalleryProps = {
  items: SiteConfig["gallery"];
};


export default function Gallery({ items }: GalleryProps) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const errorIds = new Set<string>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedIndex >= 0 && !dialog.open) dialog.showModal();
    if (selectedIndex < 0 && dialog.open) dialog.close();
  }, [selectedIndex]);

  if (!items.length) return null;

  // ── Лайтбокс ──
  const closeLightbox = () => {
    dialogRef.current?.close();
    setSelectedIndex(-1);
  };
  const goNextLightbox = () =>
    setSelectedIndex((p) => (p + 1) % items.length);
  const goPrevLightbox = () =>
    setSelectedIndex((p) => (p - 1 + items.length) % items.length);
  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) closeLightbox();
  };

  // ── Карусель: листаем на одну карточку ──
  const scrollCarousel = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    // Ширина карточки + gap (12px)
    const step = child ? child.offsetWidth + 12 : el.offsetWidth * 0.5;
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <h2
        className="text-center text-sm font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#c084fc", letterSpacing: "0.2em" }}
      >
        {t.sections.gallery}
      </h2>

      <div className="glass-card rounded-3xl p-4">
        {/* Карусель + кнопки навигации */}
        <div className="relative">

          {/* Кнопка ← */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(244,114,182,0.3)",
              boxShadow: "0 2px 12px rgba(244,114,182,0.2)",
            }}
            aria-label={t.gallery.prevPhoto}
          >
            <ChevronLeft size={15} style={{ color: "#f472b6" }} />
          </button>

          {/* Кнопка → */}
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(244,114,182,0.3)",
              boxShadow: "0 2px 12px rgba(244,114,182,0.2)",
            }}
            aria-label={t.gallery.nextPhoto}
          >
            <ChevronRight size={15} style={{ color: "#f472b6" }} />
          </button>

          {/* Горизонтальная карусель со scroll-snap */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto p-1 [&::-webkit-scrollbar]:hidden"
            style={{
              scrollSnapType: "x mandatory",
              scrollPaddingInline: "4px",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {items.slice(0, visibleCount).map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => { setSelectedIndex(index); trackEvent("gallery_open", { id: item.id }); }}
                aria-label={`${t.gallery.openPhoto}: ${language === "ru" ? item.alt : item.altEn}`}
                // На mobile: ~2 карточки видно (45%), на sm: ~3 карточки (30%)
                className="relative flex-shrink-0 min-w-[45%] sm:min-w-[30%] rounded-2xl overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400"
                style={{ aspectRatio: "3/4", scrollSnapAlign: "start" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                initial={false}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {/* Розовый фон-заглушка */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #fce7f3 0%, #f3e5f5 100%)",
                  }}
                />

                {/* Фото */}
                {errorIds.has(item.id) ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🌸</span>
                  </div>
                ) : (
                  <Photo src={item.src} alt={language === "ru" ? item.alt : item.altEn} className="absolute inset-0"
                    sizes="(max-width: 640px) 42vw, 190px" />
                )}

                {/* Затемнение + подпись при наведении */}
                <div
                  className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(131,24,67,0.65) 0%, transparent 55%)",
                  }}
                >
                  {item.caption && (
                    <p className="text-white text-xs font-medium">
                      {item.caption}
                    </p>
                  )}
                </div>

                {/* Иконка лупы */}
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.92)" }}
                >
                  <ImageIcon size={12} style={{ color: "#f472b6" }} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {visibleCount < items.length && (
          <button onClick={() => setVisibleCount(count => count + 12)}
            className="block mx-auto mt-4 rounded-full px-4 py-2 text-sm bg-pink-100 text-pink-900">
            {language === "ru" ? "Показать ещё" : "Show more"}
          </button>
        )}

        {/* Подсказка */}
        <p
          className="text-center text-xs mt-3"
          style={{ color: "#c084fc", opacity: 0.65 }}
        >
          {t.gallery.photoCount(items.length)} &nbsp;·&nbsp; {t.gallery.swipe}
        </p>
      </div>

      {/* ── Лайтбокс ── */}
      <dialog
        ref={dialogRef}
        aria-label={t.gallery.viewer}
        onClose={() => setSelectedIndex(-1)}
        onClick={handleBackdropClick}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); goNextLightbox(); }
          if (event.key === "ArrowLeft") { event.preventDefault(); goPrevLightbox(); }
        }}
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-4 backdrop:bg-[rgba(74,25,66,0.88)] backdrop:backdrop-blur-lg"
      >
        {selectedIndex >= 0 && (
          <motion.div
            className="flex min-h-full items-center justify-center"
            initial={false}
            animate={{ opacity: 1 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className="relative w-full glass-card rounded-3xl overflow-hidden flex flex-col"
              style={{ maxWidth: "min(90vw, 600px)", maxHeight: "90vh" }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Закрытие */}
              <button
                onClick={closeLightbox}
                autoFocus
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(244,114,182,0.3)",
                }}
                aria-label={t.gallery.close}
              >
                <X size={16} style={{ color: "#be185d" }} />
              </button>

              {/* Фото в натуральных пропорциях */}
              <div
                className="flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #fce7f3 0%, #f3e5f5 100%)",
                  maxHeight: "70vh",
                  minHeight: "200px",
                }}
              >
                {errorIds.has(items[selectedIndex].id) ? (
                  <div className="flex flex-col items-center justify-center p-12 gap-3">
                    <span className="text-5xl">🌸</span>
                    <p className="text-sm" style={{ color: "#be185d" }}>
                      {t.gallery.photoNotFound}
                    </p>
                  </div>
                ) : (
                  <Photo key={items[selectedIndex].src} src={items[selectedIndex].src}
                    alt={language === "ru" ? items[selectedIndex].alt : items[selectedIndex].altEn} full eager fit="contain"
                    sizes="(max-width: 667px) 90vw, 600px"
                    className="relative w-full"
                    style={{ height: "70vh" }} />
                )}
              </div>

              {/* Навигация и счётчик */}
              <div className="px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
                {items.length > 1 ? (
                  <button
                    onClick={goPrevLightbox}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                    style={{
                      background: "rgba(244,114,182,0.15)",
                      border: "1px solid rgba(244,114,182,0.3)",
                    }}
                    aria-label={t.gallery.prevPhoto}
                  >
                    <ChevronLeft size={18} style={{ color: "#f472b6" }} />
                  </button>
                ) : (
                  <div className="w-9" />
                )}

                <div className="flex-1 text-center min-w-0">
                  {items[selectedIndex].caption && (
                    <p className="text-sm font-medium" style={{ color: "#6b2d5e" }}>
                      {items[selectedIndex].caption}
                    </p>
                  )}
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "#be185d", opacity: 0.55 }}
                  >
                    {selectedIndex + 1} / {items.length}
                  </p>
                </div>

                {items.length > 1 ? (
                  <button
                    onClick={goNextLightbox}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                    style={{
                      background: "rgba(244,114,182,0.15)",
                      border: "1px solid rgba(244,114,182,0.3)",
                    }}
                    aria-label={t.gallery.nextPhoto}
                  >
                    <ChevronRight size={18} style={{ color: "#f472b6" }} />
                  </button>
                ) : (
                  <div className="w-9" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </dialog>
    </motion.section>
  );
}

