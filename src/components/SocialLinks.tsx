"use client";

import { motion } from "framer-motion";
import {
  Send,
  Globe,
  Link,
  Heart,
  Star,
  Camera,
  Coffee,
  ExternalLink,
  Music,
} from "lucide-react";
import type { FC, SVGProps } from "react";
import { trackEvent } from "@/lib/analytics";
import { SiteConfig } from "@/config/site.config";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

type SocialLinksProps = {
  links: SiteConfig["links"];
};

// Тип для компонентов иконок
type IconComponent = FC<SVGProps<SVGSVGElement> & { size?: number }>;

// ── Брендовые SVG-иконки (их нет в lucide-react, рисуем сами) ──

const InstagramIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.94A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterXIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.53a8.16 8.16 0 0 0 4.77 1.52V7.58a4.85 4.85 0 0 1-1.01-.89z" />
  </svg>
);

const BlueskyIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026" />
  </svg>
);

const VkIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.8 13.54h-1.61c-.6 0-.79-.48-1.87-1.57-.93-.93-1.34-.83-1.57-.83s-.3.07-.3.54v1.43c0 .39-.12.61-1.17.61a5.98 5.98 0 0 1-4.82-2.89A12.94 12.94 0 0 1 5 8.08c0-.23.07-.44.46-.44h1.61c.34 0 .46.15.6.53.65 1.87 1.74 3.51 2.19 3.51.17 0 .24-.08.24-.51V9.35c-.06-1.01-.58-1.1-.58-1.46a.3.3 0 0 1 .3-.3h2.54c.28 0 .37.15.37.49v2.65c0 .29.13.38.21.38.17 0 .31-.09.63-.41 1.03-1.14 1.76-2.9 1.76-2.9.1-.22.28-.42.65-.42h1.61c.48 0 .59.25.48.53-.2.93-2.1 3.58-2.1 3.58-.17.27-.22.39 0 .69.16.23.69.71 1.04 1.14.65.75 1.14 1.37 1.27 1.8.12.42-.09.64-.52.64z" />
  </svg>
);

const RedditIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.731-1.514l.891-4.402a.209.209 0 0 1 .165-.18l2.65-.553a1.251 1.251 0 0 1 2.498-.052l-.004.003zm-8.412 8.053c-.854 0-1.55.695-1.55 1.551 0 .858.696 1.552 1.55 1.552.853 0 1.549-.694 1.549-1.552 0-.856-.696-1.551-1.549-1.551zm6.779 0c-.854 0-1.551.695-1.551 1.551 0 .858.697 1.552 1.551 1.552.853 0 1.549-.694 1.549-1.552 0-.856-.696-1.551-1.549-1.551z" />
  </svg>
);

const PinterestIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
);

const DiscordIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const GithubIcon: IconComponent = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

// ── Маппинг: название → компонент иконки ──
// Добавляй новые иконки сюда
const iconMap: Record<string, IconComponent> = {
  // Брендовые иконки
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterXIcon,
  tiktok: TikTokIcon,
  bluesky: BlueskyIcon,
  vk: VkIcon,
  reddit: RedditIcon,
  pinterest: PinterestIcon,
  discord: DiscordIcon,
  github: GithubIcon,
  // Генерические иконки из lucide-react
  send: Send as unknown as IconComponent,       // Telegram
  globe: Globe as unknown as IconComponent,     // Сайт
  link: Link as unknown as IconComponent,
  heart: Heart as unknown as IconComponent,
  star: Star as unknown as IconComponent,
  camera: Camera as unknown as IconComponent,
  coffee: Coffee as unknown as IconComponent,   // Buy Me a Coffee
  music: Music as unknown as IconComponent,
};

// Анимации контейнера
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  },
};

export default function SocialLinks({ links }: SocialLinksProps) {
  const { language } = useLanguage();
  const t = translations[language];

  // Пустой url = ссылка отключена (карточка скрыта, настройки в site.config сохраняются)
  const visibleLinks = links.filter((link) => link.url.trim().length > 0);

  if (!visibleLinks.length) return null;

  return (
    <motion.section
      variants={containerVariants}
      initial={false}
      animate="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full"
    >
      {/* Заголовок секции */}
      <motion.h2
        variants={cardVariants}
        className="text-center text-sm font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#c084fc", letterSpacing: "0.2em" }}
      >
        {t.sections.findMe}
      </motion.h2>

      {/* Сетка ссылок — 1 колонка на мобайле, 2 на планшете */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {visibleLinks.map((link) => {
          const IconComponent = iconMap[link.icon] ?? (Globe as unknown as IconComponent);

          return (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              className="glass-card glass-card-hover h-full rounded-2xl p-4 flex items-center gap-4 group no-underline"
              style={{ textDecoration: "none" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => trackEvent("social_click", { id: link.id })}
            >
              {/* Иконка в цветном круге */}
              <motion.div
                className="social-icon relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${link.color}22, ${link.color}44)`,
                  border: `1px solid ${link.color}44`,
                }}

              >
                <IconComponent
                  size={22}
                  style={{ color: link.color }}
                />
                {/* Блик на иконке */}
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full opacity-60"
                  style={{ background: "radial-gradient(circle, white, transparent)" }}
                />
              </motion.div>

              {/* Текст ссылки */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate" style={{ color: "#4a1942" }}>
                  {link.label}
                </p>
                {link.username && (
                  <p className="text-xs truncate mt-0.5" style={{ color: "#be185d", opacity: 0.8 }}>
                    {link.username}
                  </p>
                )}
                {(t.links[link.id] ?? link.description) && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#9d174d", opacity: 0.6 }}>
                    {t.links[link.id] ?? link.description}
                  </p>
                )}
              </div>

              {/* Стрелка — появляется при наведении */}
              <div
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: link.color }}
              >
                <ExternalLink size={16} strokeWidth={2} />
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}

