"use client";

import { trackEvent } from "@/lib/analytics";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import type { TrackWithMeta } from "./YouTubeMusicSection";
import { useLanguage } from "@/context/LanguageContext";
import YouTubeEmbed from "./YouTubeEmbed";
import { translations } from "@/translations";

interface YouTubeMusicPlayerProps {
  tracks: TrackWithMeta[];
}

export default function YouTubeMusicPlayer({ tracks }: YouTubeMusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [coverErrors, setCoverErrors] = useState<Set<string>>(new Set());
  const { language } = useLanguage();
  const t = translations[language];

  const track = tracks[currentIndex];

  const handleCoverError = (id: string) =>
    setCoverErrors((prev) => new Set([...prev, id]));

  // При смене трека — закрываем плеер (чтобы не играл предыдущий)
  const goTo = (index: number) => {
    setIsOpen(false);
    // Небольшая задержка чтобы iframe успел выгрузиться
    setTimeout(() => setCurrentIndex(index), 150);
  };

  const goPrev = () => goTo((currentIndex - 1 + tracks.length) % tracks.length);
  const goNext = () => goTo((currentIndex + 1) % tracks.length);

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
        {t.sections.music}
      </h2>

      <div className="glass-card rounded-3xl overflow-hidden">

        {/* ── Верхняя часть: обложка + информация + кнопки ── */}
        <div className="p-5 sm:p-6 flex items-center gap-4">

          {/* Обложка — нажатие открывает/закрывает плеер */}
          <motion.button
            onClick={() => { if (!isOpen) trackEvent("media_open", { type: "music" }); setIsOpen(v => !v); }}
            className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden group focus:outline-none"
            style={{ border: "2px solid rgba(244, 114, 182, 0.3)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? t.music.close : t.music.openOnYouTube}
          >
            {/* Розовый фон-заглушка */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #fce7f3, #e9d5ff)" }}
            >
              <Music2 size={28} style={{ color: "#f472b6" }} />
            </div>

            {/* Обложка YouTube */}
            {!coverErrors.has(track.id) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={track.thumbnail}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => handleCoverError(track.id)}
              />
            )}

            {/* Оверлей с иконкой play/pause */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
              style={{ background: "rgba(74,25,66,0.5)" }}
            >
              <motion.div
                animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <X size={22} fill="white" style={{ color: "white" }} />
              </motion.div>
              <motion.div
                animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Play size={22} fill="white" style={{ color: "white", marginLeft: "2px" }} />
              </motion.div>
            </div>
          </motion.button>

          {/* Название, артист, навигация */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-semibold text-sm sm:text-base truncate" style={{ color: "#4a1942" }}>
                  {track.title}
                </p>
                <p className="text-xs sm:text-sm truncate mt-0.5" style={{ color: "#be185d", opacity: 0.75 }}>
                  {track.artist}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Навигация между треками */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={goPrev}
                disabled={tracks.length <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
                style={{ background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.25)" }}
                aria-label={t.music.prevTrack}
              >
                <ChevronLeft size={15} style={{ color: "#f472b6" }} />
              </button>

              {/* Большая кнопка Play */}
              <motion.button
                onClick={() => { if (!isOpen) trackEvent("media_open", { type: "music" }); setIsOpen(v => !v); }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isOpen
                    ? "rgba(244,114,182,0.15)"
                    : "linear-gradient(135deg, #f472b6, #c084fc)",
                  boxShadow: isOpen ? "none" : "0 4px 16px rgba(244,114,182,0.45)",
                  border: isOpen ? "1px solid rgba(244,114,182,0.4)" : "none",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isOpen ? t.music.close : t.music.openOnYouTube}
              >
                {isOpen ? (
                  <X size={15} style={{ color: "#f472b6" }} />
                ) : (
                  <Play size={15} fill="white" style={{ color: "white", marginLeft: "1px" }} />
                )}
              </motion.button>

              <button
                onClick={goNext}
                disabled={tracks.length <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
                style={{ background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.25)" }}
                aria-label={t.music.nextTrack}
              >
                <ChevronRight size={15} style={{ color: "#f472b6" }} />
              </button>

              {/* Счётчик треков */}
              {tracks.length > 1 && (
                <span className="text-xs ml-1" style={{ color: "#c084fc", opacity: 0.7 }}>
                  {currentIndex + 1} / {tracks.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Встроенный YouTube плеер ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="mx-4 mb-0" style={{ height: "1px", background: "rgba(244,114,182,0.15)" }} />
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <YouTubeEmbed key={track.youtubeId} videoId={track.youtubeId} title={track.title} startImmediately />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Плейлист (если больше одного трека) ── */}
        {tracks.length > 1 && (
          <div
            className="px-4 pb-4 pt-3 flex flex-col gap-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{
              borderTop: "1px solid rgba(244,114,182,0.1)",
              // Максимум ~4 трека видны, остальные прокручиваются
              maxHeight: "212px",
              scrollbarWidth: "none",
            }}
          >
            {tracks.map((t, i) => (
              <button
                key={t.id}
                onClick={() => goTo(i)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{
                  background: i === currentIndex ? "rgba(244,114,182,0.14)" : "transparent",
                  border: i === currentIndex ? "1px solid rgba(244,114,182,0.28)" : "1px solid transparent",
                }}
              >
                {/* Номер или иконка текущего */}
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {i === currentIndex && isOpen ? (
                    <span style={{ animation: "bounceSoft 1s ease-in-out infinite" }}>🎵</span>
                  ) : (
                    <span className="text-xs font-medium" style={{ color: "#c084fc" }}>{i + 1}</span>
                  )}
                </div>

                {/* Обложка-мини */}
                <div
                  className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #fce7f3, #e9d5ff)" }}
                >
                  {!coverErrors.has(t.id) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() => handleCoverError(t.id)}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: i === currentIndex ? "#ec4899" : "#4a1942" }}>
                    {t.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: "#be185d", opacity: 0.6 }}>
                    {t.artist}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

