export interface SupportLink {
  id: string;
  label: string;
  url: string;
}

export interface SupportWallet {
  id: string;
  asset: string;
  network: string;
  address: string;
}

export interface Wish {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  category: string;
  categoryEn?: string;
  target?: number;
  raised: number;
  currency: string;
  updatedAt?: string;
  link?: string;
}

export const supportConfig: {
  enabled: boolean;
  links: SupportLink[];
  wallets: SupportWallet[];
  wishes: Wish[];
} = {
  enabled: true,
  links: [],
  wallets: [
    { id: "usdt-tron", asset: "USDT", network: "TRON (TRC-20)", address: "TESMDWhH1CHJGPiPkGTXHBGkRxkAPGhfaQ" },
    { id: "usdt-bsc", asset: "USDT", network: "BNB Smart Chain (BEP-20)", address: "0xEb105066Cb7F535a71cBE96b01D9A10C0455Ab05" },
    { id: "usdt-ethereum", asset: "USDT", network: "Ethereum (ERC-20)", address: "0xEb105066Cb7F535a71cBE96b01D9A10C0455Ab05" },
    { id: "usdc-base", asset: "USDC", network: "Base", address: "0xEb105066Cb7F535a71cBE96b01D9A10C0455Ab05" },
    { id: "usdc-ethereum", asset: "USDC", network: "Ethereum (ERC-20)", address: "0xEb105066Cb7F535a71cBE96b01D9A10C0455Ab05" },
    { id: "btc", asset: "BTC", network: "Bitcoin", address: "bc1qtd8anma4n25gttdnz5lmnvmyxl8fjd0hx4erac" },
    { id: "eth", asset: "ETH", network: "Ethereum", address: "0xEb105066Cb7F535a71cBE96b01D9A10C0455Ab05" },
    { id: "bnb", asset: "BNB", network: "BNB Smart Chain (BEP-20)", address: "0xEb105066Cb7F535a71cBE96b01D9A10C0455Ab05" },
    { id: "sol", asset: "SOL", network: "Solana", address: "J1fmuHp8WsYqpo6ZoGmhRZmo86U37YR3nzJorQfN5PN1" },
    { id: "trx", asset: "TRX", network: "TRON", address: "TESMDWhH1CHJGPiPkGTXHBGkRxkAPGhfaQ" },
  ],
  wishes: [
    { id: "clothes", category: "Стиль", categoryEn: "Style", title: "Одежда и обувь", titleEn: "Clothes and shoes", description: "Красивые образы для каждого дня и особенных моментов.", descriptionEn: "Beautiful outfits for everyday life and special moments.", raised: 0, currency: "USD" },
    { id: "accessories", category: "Стиль", categoryEn: "Style", title: "Аксессуары и украшения", titleEn: "Accessories and jewellery", description: "Сумки, украшения, часы и очки, которые дополнят образы.", descriptionEn: "Bags, jewellery, watches and glasses to complete an outfit.", raised: 0, currency: "USD" },
    { id: "skincare", category: "Красота", categoryEn: "Beauty", title: "Косметика и уход", titleEn: "Beauty and skincare", description: "Средства для макияжа и ухода за кожей.", descriptionEn: "Makeup and skincare essentials.", raised: 0, currency: "USD" },
    { id: "hair", category: "Красота", categoryEn: "Beauty", title: "Красивые волосы", titleEn: "Hair care", description: "Уход, салонные процедуры и всё для красивых волос.", descriptionEn: "Hair care, salon visits and treatments.", raised: 0, currency: "USD" },
    { id: "beauty-care", category: "Красота", categoryEn: "Beauty", title: "Уход и приятные процедуры", titleEn: "Beauty treatments", description: "Маникюр, уходовые процедуры, массаж и спа.", descriptionEn: "Manicures, beauty treatments, massages and spa days.", raised: 0, currency: "USD" },
    { id: "perfume", category: "Красота", categoryEn: "Beauty", title: "Парфюмерия", titleEn: "Fragrances", description: "Ароматы под настроение и новые парфюмерные открытия.", descriptionEn: "Fragrances for every mood and new scent discoveries.", raised: 0, currency: "USD" },
    { id: "travel", category: "Впечатления", categoryEn: "Experiences", title: "Путешествия", titleEn: "Travel", description: "Новые места, море, природа и яркие впечатления.", descriptionEn: "New places, the sea, nature and memorable experiences.", raised: 0, currency: "USD" },
    { id: "home", category: "Дом", categoryEn: "Home", title: "Дом мечты у моря", titleEn: "A dream home by the sea", description: "Уютный дом рядом с природой и тёплым побережьем.", descriptionEn: "A cosy home near nature and a warm coast.", raised: 0, currency: "USD" },
    { id: "home-comfort", category: "Дом", categoryEn: "Home", title: "Уютное пространство", titleEn: "A cosy space", description: "Мебель, техника, сад и всё, что делает дом уютным.", descriptionEn: "Furniture, appliances, a garden and everything that makes a home cosy.", raised: 0, currency: "USD" },
    { id: "housing", category: "Дом", categoryEn: "Home", title: "Комфортное жильё", titleEn: "A comfortable place to live", description: "Пространство, в котором приятно жить и строить планы.", descriptionEn: "A place to feel at home and plan for the future.", raised: 0, currency: "USD" },
    { id: "health", category: "Забота о себе", categoryEn: "Self-care", title: "Здоровье и забота о себе", titleEn: "Health and self-care", description: "Консультации, обследования и поддержка здоровья.", descriptionEn: "Appointments, check-ups and support for my health.", raised: 0, currency: "USD" },
    { id: "personal-care", category: "Забота о себе", categoryEn: "Self-care", title: "Личные цели и процедуры", titleEn: "Personal goals and care", description: "Процедуры и забота о себе на пути к комфорту и уверенности.", descriptionEn: "Personal care and treatments for comfort and confidence.", raised: 0, currency: "USD" },
    { id: "smile", category: "Забота о себе", categoryEn: "Self-care", title: "Здоровая улыбка", titleEn: "A healthy smile", description: "Забота о зубах и красивая улыбка.", descriptionEn: "Dental care and a healthy smile.", raised: 0, currency: "USD" },
    { id: "wellbeing", category: "Забота о себе", categoryEn: "Self-care", title: "Хорошее самочувствие", titleEn: "Wellbeing", description: "Качественное питание, поддержка специалистов и полезные привычки.", descriptionEn: "Good nutrition, professional support and healthy habits.", raised: 0, currency: "USD" },
    { id: "sport", category: "Активная жизнь", categoryEn: "Active life", title: "Спорт и движение", titleEn: "Sport and movement", description: "Тренировки, занятия с тренером и любимые активности.", descriptionEn: "Workouts, coaching and activities I enjoy.", raised: 0, currency: "USD" },
    { id: "motorbike", category: "Активная жизнь", categoryEn: "Active life", title: "Мотоциклы", titleEn: "Motorcycles", description: "Курсы вождения, защитная экипировка и мечта о спортивном или эндуро мотоцикле.", descriptionEn: "Riding lessons, protective gear and dreams of a sport or enduro motorcycle.", raised: 0, currency: "USD" },
    { id: "car", category: "Большие мечты", categoryEn: "Big dreams", title: "Автомобиль", titleEn: "A car", description: "Машина для путешествий, свободы и новых маршрутов.", descriptionEn: "A car for travel, freedom and new adventures.", raised: 0, currency: "USD" },
    { id: "technology", category: "Технологии", categoryEn: "Technology", title: "Техника и гаджеты", titleEn: "Tech and gadgets", description: "Полезная техника для жизни, творчества и проектов.", descriptionEn: "Useful devices for everyday life, creativity and projects.", raised: 0, currency: "USD" },
    { id: "software", category: "Технологии", categoryEn: "Technology", title: "Инструменты для проектов", titleEn: "Tools for projects", description: "Программы, облачные сервисы и подписки на ИИ.", descriptionEn: "Software, cloud services and AI subscriptions.", raised: 0, currency: "USD" },
    { id: "learning", category: "Развитие", categoryEn: "Growth", title: "Английский и обучение", titleEn: "English and learning", description: "Курсы, книги и возможности учиться новому.", descriptionEn: "Courses, books and opportunities to learn something new.", raised: 0, currency: "USD" },
    { id: "hobbies", category: "Впечатления", categoryEn: "Experiences", title: "Хобби и развлечения", titleEn: "Hobbies and fun", description: "Интересные занятия, события и маленькие радости.", descriptionEn: "Fun activities, events and little joys.", raised: 0, currency: "USD" },
    { id: "food", category: "Маленькие радости", categoryEn: "Little joys", title: "Вкусная еда", titleEn: "Good food", description: "Качественные продукты, уютные кафе и новые вкусы.", descriptionEn: "Good ingredients, cosy cafés and new flavours.", raised: 0, currency: "USD" },
    { id: "family", category: "Большие мечты", categoryEn: "Big dreams", title: "Мечты о семье", titleEn: "Dreams of family", description: "Возможность однажды создать семью и заботиться о близких.", descriptionEn: "The possibility of building a family and caring for loved ones.", raised: 0, currency: "USD" },
    { id: "new-chapter", category: "Большие мечты", categoryEn: "Big dreams", title: "Новые возможности", titleEn: "New opportunities", description: "Подготовка к переменам, документы и новые возможности для жизни.", descriptionEn: "Preparing for change, paperwork and new possibilities for life.", raised: 0, currency: "USD" },
    { id: "support", category: "На каждый день", categoryEn: "Everyday life", title: "Комфорт и спокойствие", titleEn: "Comfort and peace of mind", description: "Повседневные расходы, профессиональная помощь и забота о безопасности.", descriptionEn: "Everyday expenses, professional support and peace of mind.", raised: 0, currency: "USD" },
    { id: "gifts", category: "Тепло", categoryEn: "Kindness", title: "Подарки близким", titleEn: "Gifts for loved ones", description: "Возможность радовать дорогих мне людей.", descriptionEn: "A chance to bring joy to the people I love.", raised: 0, currency: "USD" },
    { id: "giving", category: "Тепло", categoryEn: "Kindness", title: "Помогать другим", titleEn: "Helping others", description: "Поддержка добрых дел, которые мне близки.", descriptionEn: "Supporting causes that are close to my heart.", raised: 0, currency: "USD" },
  ],
};
