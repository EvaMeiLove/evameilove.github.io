"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="fixed top-4 right-4 z-50"
    >
      <div
        className="flex items-center gap-0.5 rounded-full px-1 py-1"
        style={{
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 182, 193, 0.35)",
          boxShadow: "0 4px 16px rgba(244, 114, 182, 0.12)",
        }}
      >
        <LangButton
          label="РУ"
          active={language === "ru"}
          onClick={() => setLanguage("ru")}
        />
        <span
          className="text-xs select-none"
          style={{ color: "rgba(192, 132, 252, 0.5)" }}
        >
          ·
        </span>
        <LangButton
          label="EN"
          active={language === "en"}
          onClick={() => setLanguage("en")}
        />
      </div>
    </motion.div>
  );
}

// ── Отдельная кнопка языка ──
function LangButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      className="relative px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 focus:outline-none"
      style={{
        color: active ? "transparent" : "rgba(155, 89, 145, 0.55)",
        fontSize: "11px",
        letterSpacing: "0.08em",
      }}
    >
      {/* Активный фон с градиентом */}
      {active && (
        <motion.span
          layoutId="lang-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {/* Текст поверх фона */}
      <span
        className="relative z-10 font-semibold"
        style={{
          background: active
            ? "linear-gradient(135deg, #fff 0%, #fce7f3 100%)"
            : "none",
          WebkitBackgroundClip: active ? "text" : "unset",
          WebkitTextFillColor: active ? "transparent" : "rgba(155, 89, 145, 0.55)",
          backgroundClip: active ? "text" : "unset",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
