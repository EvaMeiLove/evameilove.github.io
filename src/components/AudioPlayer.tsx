"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { SiteConfig } from "@/config/site.config";

type AudioPlayerProps = {
  tracks: SiteConfig["audio"];
};

export default function AudioPlayer({ tracks }: AudioPlayerProps) {
  // Индекс текущего трека
  const [currentTrack, setCurrentTrack] = useState(0);
  // Воспроизводится ли музыка
  const [isPlaying, setIsPlaying] = useState(false);
  // Текущее время (в секундах)
  const [currentTime, setCurrentTime] = useState(0);
  // Общая длительность трека (в секундах)
  const [duration, setDuration] = useState(0);
  // Заглушен ли звук
  const [isMuted, setIsMuted] = useState(false);
  // Ошибка загрузки обложки текущего трека
  const [coverError, setCoverError] = useState(false);

  // Ссылка на HTML audio элемент
  const audioRef = useRef<HTMLAudioElement>(null);

  // При смене трека — обновляем аудио источник и сбрасываем время
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    setCurrentTime(0);
    setDuration(0);
    setCoverError(false); // сбрасываем ошибку обложки при смене трека

    // Если плеер воспроизводил — автоматически запускаем новый трек
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  // Обработчик: трек загрузил метаданные — получаем длительность
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Обработчик: обновление текущего времени воспроизведения
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Обновляем CSS переменную для отображения прогресса на ползунке
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      audioRef.current.parentElement?.style.setProperty("--progress", `${progress}%`);
    }
  };

  // Обработчик: трек закончился — переходим к следующему
  const handleTrackEnd = () => {
    const nextIndex = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextIndex);
    setIsPlaying(true);
  };

  // Переключить воспроизведение / паузу
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
    setIsPlaying(!isPlaying);
  };

  // Предыдущий трек
  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  // Следующий трек
  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  // Перемотка по ползунку
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Заглушить / включить звук
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Форматировать секунды в MM:SS
  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs === 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const track = tracks[currentTrack];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {/* Заголовок */}
      <h2
        className="text-center text-sm font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#c084fc", letterSpacing: "0.2em" }}
      >
        ✦ музыка ✦
      </h2>

      {/* Карточка плеера */}
      <div className="glass-card rounded-3xl p-5 sm:p-6">
        {/* Скрытый HTML audio элемент (управляется через JS) */}
        <audio
          ref={audioRef}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnd}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
        >
          <source src={track.src} />
          Твой браузер не поддерживает аудио.
        </audio>

        {/* ── Верхняя часть: обложка + информация ── */}
        <div className="flex items-center gap-4 mb-5">
          {/* Обложка альбома */}
          <motion.div
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0"
            style={{
              border: "2px solid rgba(244, 114, 182, 0.3)",
            }}
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              duration: 8,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear",
            }}
          >
            {/* Заглушка — всегда отображается под обложкой */}
            <div
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #fce7f3, #e9d5ff)" }}
            >
              <Music size={28} style={{ color: "#f472b6" }} />
            </div>
            {/* Обложка альбома — только если задана и загрузилась без ошибки */}
            {track.cover && !coverError && (
              <Image
                src={track.cover}
                alt={`Обложка: ${track.title}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => setCoverError(true)}
              />
            )}
          </motion.div>

          {/* Название и исполнитель */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className="font-semibold text-sm sm:text-base truncate"
                  style={{ color: "#4a1942" }}
                >
                  {track.title}
                </p>
                <p
                  className="text-xs sm:text-sm truncate mt-0.5"
                  style={{ color: "#be185d", opacity: 0.7 }}
                >
                  {track.artist}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Счётчик треков если их несколько */}
            {tracks.length > 1 && (
              <p className="text-xs mt-1" style={{ color: "#c084fc", opacity: 0.7 }}>
                {currentTrack + 1} / {tracks.length}
              </p>
            )}
          </div>

          {/* Кнопка заглушить */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "rgba(244, 114, 182, 0.1)",
              border: "1px solid rgba(244, 114, 182, 0.2)",
            }}
            aria-label={isMuted ? "Включить звук" : "Заглушить"}
          >
            {isMuted ? (
              <VolumeX size={14} style={{ color: "#f472b6" }} />
            ) : (
              <Volume2 size={14} style={{ color: "#f472b6" }} />
            )}
          </button>
        </div>

        {/* ── Прогресс-бар ── */}
        <div className="mb-3">
          <input
            type="range"
            className="progress-bar w-full"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={{
              // Кастомный градиент — показывает прогресс
              background: `linear-gradient(to right, #f472b6 ${(currentTime / (duration || 1)) * 100}%, rgba(244, 114, 182, 0.2) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
            aria-label="Прогресс воспроизведения"
          />
          {/* Время */}
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: "#be185d", opacity: 0.6 }}>
              {formatTime(currentTime)}
            </span>
            <span className="text-xs" style={{ color: "#be185d", opacity: 0.6 }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* ── Кнопки управления ── */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {/* Предыдущий трек */}
          <motion.button
            onClick={prevTrack}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "rgba(244, 114, 182, 0.1)",
              border: "1px solid rgba(244, 114, 182, 0.25)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Предыдущий трек"
            disabled={tracks.length <= 1}
          >
            <SkipBack size={16} style={{ color: "#f472b6" }} />
          </motion.button>

          {/* Главная кнопка Play/Pause */}
          <motion.button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f472b6, #c084fc)",
              boxShadow: "0 4px 20px rgba(244, 114, 182, 0.5)",
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 6px 28px rgba(244, 114, 182, 0.7)",
            }}
            whileTap={{ scale: 0.92 }}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? (
              <Pause size={22} fill="white" style={{ color: "white" }} />
            ) : (
              <Play size={22} fill="white" style={{ color: "white", marginLeft: "2px" }} />
            )}
          </motion.button>

          {/* Следующий трек */}
          <motion.button
            onClick={nextTrack}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "rgba(244, 114, 182, 0.1)",
              border: "1px solid rgba(244, 114, 182, 0.25)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Следующий трек"
            disabled={tracks.length <= 1}
          >
            <SkipForward size={16} style={{ color: "#f472b6" }} />
          </motion.button>
        </div>

        {/* ── Список треков (если несколько) ── */}
        {tracks.length > 1 && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(244, 114, 182, 0.15)" }}>
            <div className="flex flex-col gap-1.5">
              {tracks.map((t, index) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setCurrentTrack(index);
                    setIsPlaying(true);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{
                    background:
                      index === currentTrack
                        ? "rgba(244, 114, 182, 0.15)"
                        : "transparent",
                    border:
                      index === currentTrack
                        ? "1px solid rgba(244, 114, 182, 0.3)"
                        : "1px solid transparent",
                  }}
                >
                  {/* Анимация воспроизведения или номер */}
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {index === currentTrack && isPlaying ? (
                      <span className="text-lg" style={{ animation: "bounceSoft 1s ease-in-out infinite" }}>
                        🎵
                      </span>
                    ) : (
                      <span className="text-xs font-medium" style={{ color: "#c084fc" }}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: index === currentTrack ? "#ec4899" : "#4a1942" }}
                    >
                      {t.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: "#be185d", opacity: 0.6 }}>
                      {t.artist}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
