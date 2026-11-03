"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { VideoItem } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import YouTubeEmbed from "./YouTubeEmbed";
import { translations } from "@/translations";

type VideoSectionProps = {
  videos: VideoItem[];
};

export default function VideoSection({ videos }: VideoSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language } = useLanguage();
  const t = translations[language];

  if (!videos.length) return null;

  const video = videos[currentIndex];

  // При смене видео — iframe перестраивается (останавливает воспроизведение)
  const goTo = (index: number) => setCurrentIndex(index);
  const goPrev = () => goTo((currentIndex - 1 + videos.length) % videos.length);
  const goNext = () => goTo((currentIndex + 1) % videos.length);

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
        {t.sections.video}
      </h2>

      <div className="glass-card rounded-3xl overflow-hidden">

        {/* ── Шапка: иконка + название + навигация ── */}
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(244,114,182,0.15)" }}
        >
          {/* Иконка Play */}
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play size={12} fill="white" style={{ color: "white", marginLeft: "1px" }} />
          </motion.div>

          {/* Название текущего видео — анимируется при смене */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="flex-1 font-medium text-sm truncate"
              style={{ color: "#4a1942" }}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {t.videoTitles[video.id] ?? video.title}
            </motion.p>
          </AnimatePresence>

          {/* Навигация (только если видео больше одного) */}
          {videos.length > 1 && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={goPrev}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(244,114,182,0.12)",
                  border: "1px solid rgba(244,114,182,0.25)",
                }}
                aria-label={t.video.prevVideo}
              >
                <ChevronLeft size={13} style={{ color: "#f472b6" }} />
              </button>

              <span className="text-xs" style={{ color: "#c084fc", minWidth: "30px", textAlign: "center" }}>
                {currentIndex + 1}/{videos.length}
              </span>

              <button
                onClick={goNext}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(244,114,182,0.12)",
                  border: "1px solid rgba(244,114,182,0.25)",
                }}
                aria-label={t.video.nextVideo}
              >
                <ChevronRight size={13} style={{ color: "#f472b6" }} />
              </button>
            </div>
          )}
        </div>

        {/* ── Видео ── */}
        {/* AnimatePresence: плавная смена при переключении */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="relative w-full"
            style={{ aspectRatio: "16/9" }}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {video.type === "youtube" && video.youtubeId ? (
              <YouTubeEmbed key={video.youtubeId} videoId={video.youtubeId} title={video.title} />
            ) : video.type === "local" && video.src ? (
              <video
                src={video.src}
                controls
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ accentColor: "#f472b6" }}
              >
                <p>{t.video.browserNotSupported}</p>
              </video>
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #fce7f3, #e9d5ff)" }}
              >
                <span className="text-4xl">🎬</span>
                <p className="text-sm" style={{ color: "#be185d" }}>
                  {t.video.notFound}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Плейлист (если видео больше одного) ── */}
        {videos.length > 1 && (
          <div
            className="px-4 pb-4 pt-3 flex flex-col gap-1.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
            style={{
              borderTop: "1px solid rgba(244,114,182,0.1)",
              maxHeight: "200px",
              scrollbarWidth: "none",
            }}
          >
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => goTo(i)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{
                  background: i === currentIndex
                    ? "rgba(244,114,182,0.14)"
                    : "transparent",
                  border: i === currentIndex
                    ? "1px solid rgba(244,114,182,0.28)"
                    : "1px solid transparent",
                }}
              >
                {/* Номер */}
                <span
                  className="text-xs font-medium w-5 text-center flex-shrink-0"
                  style={{ color: i === currentIndex ? "#ec4899" : "#c084fc" }}
                >
                  {i + 1}
                </span>

                {/* Иконка */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: i === currentIndex
                      ? "linear-gradient(135deg, #f472b6, #c084fc)"
                      : "rgba(244,114,182,0.12)",
                  }}
                >
                  <Play
                    size={10}
                    fill={i === currentIndex ? "white" : "#f472b6"}
                    style={{
                      color: i === currentIndex ? "white" : "#f472b6",
                      marginLeft: "1px",
                    }}
                  />
                </div>

                {/* Название */}
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: i === currentIndex ? "#ec4899" : "#4a1942" }}
                >
                  {t.videoTitles[v.id] ?? v.title}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

