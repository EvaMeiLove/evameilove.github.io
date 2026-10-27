"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import images from "@/generated/images.json";

interface ImageInfo {
  width: number;
  height: number;
  preview: string;
  variants: { src: string; width: number; bytes: number }[];
}
const catalog: Record<string, ImageInfo> = images;

export default function Photo({ src, alt, sizes, eager = false, full = false, className = "", style, fit = "cover" }: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  full?: boolean;
  className?: string;
  style?: CSSProperties;
  fit?: "cover" | "contain";
}) {
  const wrapper = useRef<HTMLSpanElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const info = catalog[src];
  const variants = info?.variants.filter(v => full || v.width <= 640) ?? [];
  const fallback = variants.at(-1)?.src ?? src;
  const srcSet = variants.map(v => `${v.src} ${v.width}w`).join(", ") || undefined;

  useEffect(() => {
    if (eager || !wrapper.current) return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "200px" });
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    let cancelled = false;
    const node = image.current;
    if (visible && node?.complete && node.naturalWidth > 0) {
      node.decode().catch(() => {}).then(() => { if (!cancelled) setLoaded(true); });
    }
    return () => { cancelled = true; };
  }, [visible]);

  return (
    <span ref={wrapper} className={`photo-frame ${className}`} style={{ ...style, backgroundColor: "#fce7f3" }}>
      {info && <span aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${info.preview})`, filter: "blur(8px)", transform: "scale(1.08)", opacity: loaded ? 0 : 1 }} />}
      {visible && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={image} src={fallback} srcSet={srcSet} sizes={sizes} alt={alt}
          width={info?.width} height={info?.height} decoding="async"
          loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "low"}
          className="photo-image absolute inset-0 w-full h-full"
          style={{ objectFit: fit, opacity: loaded ? 1 : 0 }}
          onLoad={event => { const node = event.currentTarget; node.decode().catch(() => {}).then(() => setLoaded(true)); }}
          onError={() => setFailed(true)} />
      )}
      {failed && <span role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center text-3xl">🌸</span>}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fallback} srcSet={srcSet} sizes={sizes} alt={alt} loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full" style={{ objectFit: fit }} />
      </noscript>
    </span>
  );
}
