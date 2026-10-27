"use client";

import { trackEvent } from "@/lib/analytics";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function YouTubeEmbed({ videoId, title, startImmediately = false }: {
  videoId: string;
  title: string;
  startImmediately?: boolean;
}) {
  const [active, setActive] = useState(startImmediately);
  const { language } = useLanguage();
  const ru = language === "ru";
  const url = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  return (
    <div className="absolute inset-0 flex flex-col bg-pink-50">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="min-h-0 flex-1 w-full border-0"
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 text-center text-pink-900">
          <p className="text-sm">{ru ? "YouTube загрузится только по нажатию" : "YouTube loads only when you press play"}</p>
          <button className="rounded-full bg-pink-600 px-5 py-2 text-white focus-visible:outline-2" onClick={() => { setActive(true); trackEvent("media_open", { type: "youtube" }); }}>
            {ru ? "▶ Загрузить плеер" : "▶ Load player"}
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 p-2 text-xs text-pink-900">
        {active && <>
          <span>{ru ? "Не играет? Проверь доступ к YouTube." : "Not playing? Check YouTube access."}</span>
          <button className="underline" onClick={() => setActive(false)}>{ru ? "Закрыть плеер" : "Close player"}</button>
        </>}
        <a className="underline" href={url} target="_blank" rel="noopener noreferrer">{ru ? "Открыть на YouTube ↗" : "Open on YouTube ↗"}</a>
      </div>
    </div>
  );
}
