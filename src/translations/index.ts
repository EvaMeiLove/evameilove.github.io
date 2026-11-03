// ============================================================
// 🌸 ПЕРЕВОДЫ САЙТА — РУССКИЙ И АНГЛИЙСКИЙ 🌸
// ============================================================
// Здесь хранятся все текстовые строки интерфейса
// ru — русский язык (по умолчанию)
// en — английский язык
// ============================================================

export const translations = {
  ru: {
    // ── Профиль ──
    profile: {
      name: "Ева Мэй",
      tagline: "✨ просто девочка с большими мечтами ✨",
      bio: "Добро пожаловать в мой маленький и уютный уголок интернета 🌸 Туть можно найти все мои ссылочки 💕",
      badges: ["✈️ Путешественница", "👗 Модница", "💻 Вайб-кодерша", "🤖 ИИ-энтузиастка", "⛓️ Блокчейн-энтузиастка", "💼 Деловая девочка", "📈 Трейдерка"],
    },

    about: {
      title: "✦ немного обо мне ✦",
      text: "Люблю мечтать, придумывать идеи и превращать их в реальность. Меня увлекают технологии, искусственный интеллект и крипта, а ещё я обожаю красивые образы, путешествия, прогулки на природе и у моря. Люблю искренние разговоры, в которых можно узнать друг друга чуть глубже 💕",
    },

    // ── Описания ссылок (ключ = id из site.config.ts) ──
    links: {
      telegram: "Туть можно написать мне 💌",
      instagram: "Мои фоточки и истории ✨",
      reddit: "Постики и обсуждения 🌿",
      pinterest: "Эстетика и вдохновение 🌸",
      youtube: "Когда-нибудь запишу видео ✨",
      discord: "Мой профиль в Discord 🎀",
      twitter: "Когда-нибудь сделаю пост 🐣",
      tiktok: "Возможно туть будут видео ✨",
      bluesky: "Мой уголок в Bluesky 🦋",
      github: "Мои проектики 💻",
    } as Record<string, string>,

    // ── Заголовки секций ──
    sections: {
      findMe: "✦ найти меня ✦",
      gallery: "✦ моя галерея ✦",
      music: "✦ музыка ✦",
      video: "✦ видео ✦",
    },

    // ── Названия видео (ключ = id из site.config.ts) ──
    videoTitles: {
      "1": "Моё любимое видео",
      "2": "Ещё одно любимое",
    } as Record<string, string>,

    // ── Галерея ──
    gallery: {
      swipe: "листай →",
      photoCount: (n: number) => `${n} фото`,
      photoNotFound: "фотка куда-то потерялась 🌸",
      prevPhoto: "Предыдущее фото",
      nextPhoto: "Следующее фото",
      close: "Закрыть",
      viewer: "Просмотр фотографий",
      openPhoto: "Открыть фотографию",
    },

    // ── Видео ──
    video: {
      notFound: "Видео куда-то пропало 🎬",
      browserNotSupported: "Твой браузер не поддерживает видео.",
      prevVideo: "Предыдущее видео",
      nextVideo: "Следующее видео",
    },

    // ── Музыкальный плеер ──
    music: {
      unknownTrack: "Неизвестный трек",
      unknownArtist: "Неизвестный артист",
      openOnYouTube: "Слушать на YouTube",
      prevTrack: "Предыдущий трек",
      nextTrack: "Следующий трек",
      close: "Закрыть",
    },

    // ── Подвал ──
    footer: {
      madeWith: "сделала с",
    },
  },

  en: {
    // ── Профиль ──
    profile: {
      name: "Eva Mei",
      tagline: "✨ Just a girl with big dreams ✨",
      bio: "Welcome to my little cozy corner of the internet 🌸 All my links are right here 💕",
      badges: ["✈️ Wanderlust Girl", "👗 Fashionista", "💻 Vibe Coder", "🤖 AI Enthusiast", "⛓️ Blockchain Enthusiast", "💼 Business Girl", "📈 Trader Girl"],
    },

    about: {
      title: "✦ a little about me ✦",
      text: "I love dreaming, coming up with ideas and bringing them to life. I'm fascinated by technology, AI and crypto, and I also adore beautiful outfits, travelling, walks in nature and by the sea. I love heartfelt conversations where we can get to know each other a little better 💕",
    },

    // ── Описания ссылок ──
    links: {
      telegram: "Come message me 💌",
      instagram: "My photos & stories ✨",
      reddit: "Posts & discussions 🌿",
      pinterest: "Aesthetics & inspiration 🌸",
      youtube: "Maybe I'll record a video someday ✨",
      discord: "My Discord profile 🎀",
      twitter: "One day I'll post something 🐣",
      tiktok: "Maybe there'll be videos here ✨",
      bluesky: "My corner of Bluesky 🦋",
      github: "My lil projects 💻",
    } as Record<string, string>,

    // ── Заголовки секций ──
    sections: {
      findMe: "✦ find me ✦",
      gallery: "✦ my gallery ✦",
      music: "✦ music ✦",
      video: "✦ videos ✦",
    },

    // ── Названия видео (ключ = id из site.config.ts) ──
    videoTitles: {
      "1": "My favourite video 🌸",
      "2": "Another favourite ✨",
    } as Record<string, string>,

    // ── Галерея ──
    gallery: {
      swipe: "Scroll thru →",
      photoCount: (n: number) => n === 1 ? "1 photo" : `${n} photos`,
      photoNotFound: "Photo got lost somewhere 🌸",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo",
      close: "Close",
      viewer: "Photo viewer",
      openPhoto: "Open photo",
    },

    // ── Видео ──
    video: {
      notFound: "Video got lost somewhere 🎬",
      browserNotSupported: "Your browser doesn't support video.",
      prevVideo: "Previous video",
      nextVideo: "Next video",
    },

    // ── Музыкальный плеер ──
    music: {
      unknownTrack: "Unknown track",
      unknownArtist: "Unknown artist",
      openOnYouTube: "Listen on YouTube",
      prevTrack: "Previous track",
      nextTrack: "Next track",
      close: "Close",
    },

    // ── Подвал ──
    footer: {
      madeWith: "Made with",
    },
  },
};

export type Lang = keyof typeof translations;
