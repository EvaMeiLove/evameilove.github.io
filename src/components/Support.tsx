"use client";

import { useState } from "react";
import { Heart, Copy, Check, ExternalLink, Sparkles, ChevronDown, Wallet } from "lucide-react";
import { supportConfig } from "@/config/support.config";
import { useLanguage } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { QRCodeSVG } from "qrcode.react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

function CryptoSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) {
  return <div className="min-w-0 space-y-1.5">
    <span className="block text-xs font-medium text-pink-800">{label}</span>
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger aria-label={`${label}: ${options.find(option => option.value === value)?.label ?? value}`} className="flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl border border-pink-200 bg-white/90 px-3.5 text-left text-sm font-medium text-pink-950 shadow-sm outline-none transition-colors hover:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2">
        <span className="min-w-0 truncate">{options.find(option => option.value === value)?.label ?? value}</span><ChevronDown size={17} className="shrink-0 text-pink-500" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal><DropdownMenu.Content sideOffset={6} align="start" className="z-[70] max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-pink-200 bg-white p-1.5 text-pink-950 shadow-[0_12px_32px_rgba(131,24,67,.16)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>{options.map(option => <DropdownMenu.RadioItem key={option.value} value={option.value} className="relative flex min-h-10 cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2 text-sm outline-none data-[highlighted]:bg-pink-50 data-[state=checked]:text-pink-700">
          {option.label}<DropdownMenu.ItemIndicator className="ml-auto text-pink-500"><Check size={16} /></DropdownMenu.ItemIndicator>
        </DropdownMenu.RadioItem>)}</DropdownMenu.RadioGroup>
      </DropdownMenu.Content></DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>;
}

function publicLink(value?: string) {
  if (!value) return undefined;
  try { return new URL(value).protocol === "https:" ? value : undefined; } catch { return undefined; }
}

const groups = [
  { id: "all", ru: "Все", en: "All", ids: [] },
  { id: "style", ru: "Стиль и красота", en: "Style & beauty", ids: ["clothes", "accessories", "skincare", "hair", "beauty-care", "perfume"] },
  { id: "experiences", ru: "Впечатления", en: "Experiences", ids: ["travel", "sport", "motorbike", "hobbies", "food"] },
  { id: "home", ru: "Дом и уют", en: "Home", ids: ["home", "home-comfort", "housing", "support"] },
  { id: "care", ru: "Забота о себе", en: "Self-care", ids: ["health", "personal-care", "smile", "wellbeing"] },
  { id: "growth", ru: "Развитие", en: "Growth", ids: ["technology", "software", "learning"] },
  { id: "dreams", ru: "Большие мечты", en: "Big dreams", ids: ["car", "family", "new-chapter", "gifts", "giving"] },
];
const featured = ["clothes", "skincare", "travel", "technology", "home", "health"];
const icons: Record<string, string> = { clothes: "👗", accessories: "👜", skincare: "🧴", hair: "🎀", "beauty-care": "💅", perfume: "🌷", travel: "✈️", home: "🏡", "home-comfort": "🕯️", housing: "🗝️", health: "🌸", "personal-care": "✨", smile: "🦷", wellbeing: "🫶", sport: "🧘‍♀️", motorbike: "🏍️", car: "🚗", technology: "💻", software: "🤖", learning: "📚", hobbies: "🎨", food: "🍓", family: "💕", "new-chapter": "🌍", support: "☁️", gifts: "🎁", giving: "💝" };

export default function Support() {
  const { language } = useLanguage();
  const ru = language === "ru";
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState(false);
  const [selectedId, setSelectedId] = useState(supportConfig.wallets[0]?.id || "");
  const [group, setGroup] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [openWish, setOpenWish] = useState("");
  if (!supportConfig.enabled) return null;
  const links = supportConfig.links.filter(item => publicLink(item.url));
  const wallets = supportConfig.wallets.filter(item => item.address.trim() && item.asset.trim() && item.network.trim());
  const current = wallets.find(item => item.id === selectedId) || wallets[0];
  const assets = [...new Set(wallets.map(item => item.asset))];
  const networks = current ? wallets.filter(item => item.asset === current.asset) : [];
  const filter = groups.find(item => item.id === group) || groups[0];
  const wishes = group === "all"
    ? [...supportConfig.wishes].sort((a, b) => { const ai = featured.indexOf(a.id), bi = featured.indexOf(b.id); return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi); })
    : supportConfig.wishes.filter(item => filter.ids.includes(item.id));
  const visible = showAll ? wishes : wishes.slice(0, 6);
  const money = (value: number, currency: string) => {
    if (!Number.isFinite(value)) return "—";
    try { return new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value); }
    catch { return `${value.toLocaleString(ru ? "ru-RU" : "en-US")} ${currency}`; }
  };
  async function copy(id: string, address: string) {
    try { await navigator.clipboard.writeText(address); setCopied(id); setCopyError(false); trackEvent("wallet_copy", { id }); window.setTimeout(() => setCopied(current => current === id ? "" : current), 2500); }
    catch { setCopyError(true); }
  }
  function setAsset(asset: string) { const next = wallets.find(item => item.asset === asset); if (next) setSelectedId(next.id); setCopyError(false); }
  return <section className="w-full space-y-8 scroll-target" id="support">
    <div className="space-y-4">
      <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-purple-400">{ru ? "✦ Поддержать меня ✦" : "✦ Support me ✦"}</h2>
      <div className="glass-card rounded-[28px] p-5 sm:p-7 space-y-5">
        <div className="flex items-start gap-3"><div className="shrink-0 rounded-2xl bg-pink-100 p-3 text-pink-500"><Heart size={22} /></div><div>
          <h3 className="font-semibold text-lg text-pink-950">{ru ? "Спасибо, что ты рядом" : "Thank you for being here"}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-pink-800">{ru ? "Если хочется сделать мне приятно, здесь можно поддержать меня и мои маленькие и большие мечты. Я буду очень благодарна 💕" : "If you would like to support me and my little and big dreams, you can do it here. It means a lot 💕"}</p>
        </div></div>
        {links.length > 0 && <div className="flex flex-wrap gap-3">{links.map(item => <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("support_click", { id: item.id })} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-pink-500 text-white text-sm font-medium">{item.label}<ExternalLink size={14} /></a>)}</div>}
        {current && <div className="rounded-3xl border border-pink-200/80 bg-white/60 p-4 sm:p-5 space-y-4" id="crypto">
          <div className="flex items-center gap-2 text-sm font-semibold text-pink-950"><Wallet size={18} className="text-pink-500" />{ru ? "Криптовалютой" : "With crypto"}</div>
          <div className="grid grid-cols-2 gap-3">
            <CryptoSelect label={ru ? "Валюта" : "Asset"} value={current.asset} options={assets.map(asset => ({ value: asset, label: asset }))} onChange={setAsset} />
            <CryptoSelect label={ru ? "Сеть" : "Network"} value={current.id} options={networks.map(item => ({ value: item.id, label: item.network }))} onChange={value => { setSelectedId(value); setCopyError(false); }} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-pink-50/80 p-4">
            <div className="shrink-0 rounded-xl bg-white p-1"><QRCodeSVG value={current.address} size={148} marginSize={4} bgColor="#ffffff" fgColor="#000000" role="img" aria-label={ru ? `QR-код адреса ${current.asset}, сеть ${current.network}` : `Address QR code for ${current.asset} on ${current.network}`} /></div>
            <div className="w-full min-w-0 text-center sm:text-left"><p className="font-semibold text-pink-950">{current.asset} <span className="font-normal text-pink-700">· {current.network}</span></p>
              <p className="mt-1 text-xs leading-relaxed text-pink-800">{ru ? "Выбери эту же валюту и сеть в своём кошельке." : "Select this same asset and network in your wallet."}</p>
              <code className="ym-hide-content mt-3 block break-all select-all text-xs text-pink-900">{current.address}</code>
              <button type="button" onClick={() => copy(current.id, current.address)} className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white hover:bg-pink-600"><span>{copied === current.id ? (ru ? "Скопировано" : "Copied") : (ru ? "Скопировать адрес" : "Copy address")}</span>{copied === current.id ? <Check size={14} /> : <Copy size={14} />}</button>
            </div>
          </div>
          <p role="status" aria-live="polite" className="text-xs text-pink-800">{copyError ? (ru ? "Не удалось скопировать. Выдели адрес вручную." : "Copy failed. Select the address manually.") : ""}</p>
        </div>}
      </div>
    </div>
    {supportConfig.wishes.length > 0 && <div id="wishes" className="space-y-4 scroll-target">
      <div className="text-center"><h2 className="text-lg font-medium text-pink-950 flex justify-center items-center gap-2"><Sparkles size={18} className="text-purple-400" />{ru ? "Мои мечты и желания" : "My dreams and wishes"}</h2><p className="mt-1 text-sm text-pink-700">{ru ? "То, к чему я стремлюсь — от маленьких радостей до больших мечтаний ✨" : "Things I dream about, from little joys to big plans ✨"}</p></div>
      <div className="wish-filters flex flex-nowrap gap-2 overflow-x-auto pb-3" role="group" aria-label={ru ? "Категории желаний" : "Wish categories"}>
        {groups.map(item => <button key={item.id} type="button" aria-pressed={group === item.id} onClick={() => { setGroup(item.id); setShowAll(false); setOpenWish(""); }} className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-colors ${group === item.id ? "bg-pink-500 border-pink-500 text-white" : "bg-white/70 border-pink-200 text-pink-800 hover:bg-pink-50"}`}>{ru ? item.ru : item.en}</button>)}
      </div>
      <div className="columns-1 sm:columns-2 gap-3">
        {visible.map(item => {
          const title = ru ? item.title : item.titleEn || item.title;
          const description = ru ? item.description : item.descriptionEn || item.description;
          const category = ru ? item.category : item.categoryEn || item.category;
          const expanded = openWish === item.id;
          const target = item.target;
          const hasTarget = typeof target === "number" && Number.isFinite(target) && target > 0;
          const raised = Number.isFinite(item.raised) ? Math.max(0, item.raised) : 0;
          const percent = hasTarget ? Math.min(100, raised / target * 100) : 0;
          const href = publicLink(item.link);
          return <article key={item.id} className="glass-card mb-3 break-inside-avoid rounded-3xl overflow-hidden">
            <button type="button" onClick={() => setOpenWish(expanded ? "" : item.id)} aria-expanded={expanded} className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/40 transition-colors">
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-xl">{icons[item.id] || "✨"}</span>
              <span className="min-w-0 flex-1"><span className="block text-xs text-purple-600">{category}</span><span className="block mt-1 font-medium text-sm text-pink-950">{title}</span></span>
              <ChevronDown size={18} className={`shrink-0 text-pink-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
            {expanded && <div className="px-4 pb-4 space-y-3">
              <p className="text-sm leading-relaxed text-pink-800">{description}</p>
              {hasTarget && <div className="space-y-2"><div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)} className="h-2 rounded-full bg-pink-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400" style={{ width: `${percent}%` }} /></div><p className="text-xs text-pink-900">{money(raised, item.currency)} / {money(target, item.currency)} · {Math.round(percent)}%</p>{item.updatedAt && <p className="text-xs text-pink-700">{ru ? "Обновлено вручную" : "Manually updated"}: {item.updatedAt}</p>}</div>}
              {href && <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("wish_click", { id: item.id })} className="inline-flex items-center gap-1 text-xs text-pink-700 underline">{ru ? "Подробнее" : "Details"}<ExternalLink size={12} /></a>}
              <a href="#support" className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-4 py-2 text-xs font-medium text-pink-800 hover:bg-pink-200"><Heart size={14} />{ru ? "Поддержать Еву" : "Support Eva"}</a>
            </div>}
          </article>;
        })}
      </div>
      {!showAll && wishes.length > visible.length && <div className="text-center"><button type="button" onClick={() => setShowAll(true)} className="rounded-full border border-pink-200 bg-white/70 px-5 py-2.5 text-sm font-medium text-pink-800 hover:bg-pink-50">{ru ? `Показать ещё (${wishes.length - visible.length})` : `Show more (${wishes.length - visible.length})`}</button></div>}
      <div className="text-center"><a href="#support" className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-600"><Heart size={15} />{ru ? "Поддержать мои мечты" : "Support my dreams"}</a></div>
    </div>}
  </section>;
}
