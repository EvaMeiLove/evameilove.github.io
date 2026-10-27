import { siteConfig } from "@/config/site.config";
import FloatingBackground from "@/components/FloatingBackground";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SocialLinks from "@/components/SocialLinks";
import Gallery from "@/components/Gallery";
import YouTubeMusicSection from "@/components/YouTubeMusicSection";
import VideoSection from "@/components/VideoSection";
import Support from "@/components/Support";
import Footer from "@/components/Footer";
import SiteNavigation from "@/components/SiteNavigation";
import { supportConfig } from "@/config/support.config";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-dreamy overflow-hidden">
      {/* Декоративные плавающие элементы на фоне */}
      <FloatingBackground />
      <SiteNavigation showGallery={siteConfig.sections.gallery && siteConfig.gallery.length > 0} showMedia={(siteConfig.sections.youtubeMusicTracks && siteConfig.youtubeMusicTracks.length > 0) || (siteConfig.sections.videos && siteConfig.videos.length > 0)} showSupport={supportConfig.enabled} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12 pb-28 sm:pt-28 sm:pb-16 flex flex-col gap-8">

        {/* 👤 Аватар, имя, биография */}
        <div id="home" className="scroll-target"><Hero profile={siteConfig.profile} /></div>

        <About />

        {/* 🔗 Ссылки на соцсети */}
        <div id="links" className="scroll-target"><SocialLinks links={siteConfig.links} /></div>

        {/* 🖼️ Фотогалерея */}
        {siteConfig.sections.gallery && siteConfig.gallery.length > 0 && (
          <div id="gallery" className="scroll-target"><Gallery items={siteConfig.gallery} /></div>
        )}

        {/* Поддержка и желания */}
        <Support />

        {/* 🎵 YouTube Music — треки с автоматическим подтягиванием обложки и метаданных */}
        <div id="media" className="scroll-target flex flex-col gap-8">
        {siteConfig.sections.youtubeMusicTracks &&
          siteConfig.youtubeMusicTracks.length > 0 && (
            <YouTubeMusicSection tracks={siteConfig.youtubeMusicTracks} />
          )}

        {/* 🎬 Видео (YouTube или локальные) */}
        {siteConfig.sections.videos && siteConfig.videos.length > 0 && (
          <VideoSection videos={siteConfig.videos} />
        )}
        </div>

        {/* 🌸 Подвал */}
        <Footer name={siteConfig.profile.name} />
      </div>
    </main>
  );
}

