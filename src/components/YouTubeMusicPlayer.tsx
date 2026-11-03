"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, LoaderCircle, ChevronLeft, ChevronRight, Shuffle, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { TrackWithMeta } from "./YouTubeMusicSection";
import { musicPlatforms } from "@/data/music-platforms";

type Player = { destroy(): void; playVideo(): void; pauseVideo(): void };
type YTWindow = Window & { YT?: { Player: new (el: HTMLElement, options: object) => Player }; onYouTubeIframeAPIReady?: () => void };
let loading: Promise<void> | undefined;
function loadAPI() {
  if ((window as YTWindow).YT?.Player) return Promise.resolve();
  return loading ??= new Promise<void>((resolve, reject) => {
    const w = window as YTWindow;
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); };
    const script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { loading = undefined; script.remove(); reject(new Error("YouTube unavailable")); };
    document.head.appendChild(script);
  });
}
export default function YouTubeMusicPlayer({tracks}: {tracks: TrackWithMeta[]}) {
  const {language} = useLanguage(); const ru = language === "ru";
  const [index,setIndex]=useState(0); const [open,setOpen]=useState(false);
  const [selected,setSelected]=useState(false);
  const [platformsOpen,setPlatformsOpen]=useState(false);
  const [query,setQuery]=useState(""); const [limit,setLimit]=useState(40);
  const [shuffle,setShuffle]=useState(false); const [error,setError]=useState(false);
  const [attempt,setAttempt]=useState(0);
  const [playerState,setPlayerState]=useState<"idle"|"loading"|"playing"|"paused"|"error">("idle");
  const host=useRef<HTMLDivElement>(null);
  const playerRef=useRef<Player | null>(null);
  const current=tracks[index];
  const platforms=(current && musicPlatforms[current.id]) || {};
  const playable=useMemo(()=>tracks.map((t,i)=>t.youtubeId?i:-1).filter(i=>i>=0),[tracks]);
  const filtered=useMemo(()=>tracks.map((t,i)=>({t,i})).filter(({t})=>`${t.title} ${t.artist}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())),[tracks,query]);
  const nextRef=useRef<()=>void>(()=>{});
  function move(direction:number) {
    if(!playable.length)return;
    const pool=playable.filter(i=>i!==index);
    const currentPosition=playable.indexOf(index);
    const next=shuffle&&pool.length?pool[Math.floor(Math.random()*pool.length)]:currentPosition<0?(direction>0?playable[0]:playable[playable.length-1]):playable[(currentPosition+direction+playable.length)%playable.length];
    setIndex(next); setPlatformsOpen(false); setError(false); if(open)setPlayerState("loading"); setAttempt(n=>n+1);
  }
  function togglePlayback() {
    if(!current.youtubeId)return;
    if(!open){setSelected(true);setOpen(true);setError(false);setPlayerState("loading");return;}
    if(error){setError(false);setPlayerState("loading");setAttempt(n=>n+1);return;}
    if(!playerRef.current)return;
    if(playerState==="playing")playerRef.current.pauseVideo();
    else {setPlayerState("loading");playerRef.current.playVideo();}
  }
  useEffect(()=>{nextRef.current=()=>move(1);});
  useEffect(()=>{
    if(!open||!current?.youtubeId||!host.current)return;
    let cancelled=false; let player:Player|undefined;
    const mount=document.createElement("div"); host.current.replaceChildren(mount);
    loadAPI().then(()=>{
      if(cancelled)return;
      const YT=(window as YTWindow).YT!;
      player=new YT.Player(mount,{host:"https://www.youtube-nocookie.com",videoId:current.youtubeId,width:"100%",height:"100%",playerVars:{autoplay:1,origin:window.location.origin,playsinline:1},events:{onReady:()=>{if(!cancelled) setPlayerState("paused");},onStateChange:(e:{data:number})=>{if(cancelled)return;if(e.data===0)nextRef.current();else if(e.data===1)setPlayerState("playing");else if(e.data===2||e.data===5)setPlayerState("paused");else if(e.data===3)setPlayerState("loading");},onAutoplayBlocked:()=>{if(!cancelled)setPlayerState("paused");},onError:()=>{if(!cancelled){setError(true);setPlayerState("error");}}}});
      playerRef.current=player;
    }).catch(()=>{if(!cancelled){setError(true);setPlayerState("error");}});
    return()=>{cancelled=true;if(playerRef.current===player)playerRef.current=null;player?.destroy();};
  },[open,current?.youtubeId,attempt]);
  if(!current)return null;
  return <section className="w-full">
    <h2 className="text-center text-sm font-semibold uppercase tracking-widest mb-4 text-purple-400">{ru?"✦ Музыка ✦":"✦ Music ✦"}</h2>
    <div className="glass-card rounded-3xl overflow-hidden text-pink-950">
      <div className="p-5 flex items-center gap-4">
        <button disabled={!current.youtubeId} onClick={togglePlayback} aria-label={playerState==="playing"?(ru?"Пауза":"Pause"):(ru?"Воспроизвести":"Play")} className="rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 p-5 disabled:opacity-40 focus-visible:outline-2">{playerState==="loading"?<LoaderCircle className="animate-spin"/>:playerState==="playing"?<Pause/>:<Play/>}</button>
        <div className="min-w-0 flex-1"><p className="font-semibold truncate">{current.title}</p><p className="text-sm text-pink-700 truncate">{current.artist}</p>{open&&<p role="status" className="mt-1 text-xs text-purple-600">{playerState==="loading"?(ru?"Загрузка…":"Loading…"):playerState==="playing"?(ru?"Играет":"Playing"):playerState==="error"?(ru?"Не удалось включить":"Unable to play"):(ru?"На паузе":"Paused")}</p>}
        <div className="flex flex-wrap gap-2 items-center mt-3">
          <button aria-label={ru?"Предыдущий трек":"Previous track"} onClick={()=>move(-1)} disabled={!playable.length} className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-200 bg-white/70 hover:bg-pink-100 focus-visible:outline-2 disabled:opacity-40"><ChevronLeft/></button>
          <button aria-label={ru?"Следующий трек":"Next track"} onClick={()=>move(1)} disabled={!playable.length} className="flex h-11 w-11 items-center justify-center rounded-xl border border-pink-200 bg-white/70 hover:bg-pink-100 focus-visible:outline-2 disabled:opacity-40"><ChevronRight/></button>
          <button aria-label={ru?"Случайный порядок":"Shuffle"} aria-pressed={shuffle} onClick={()=>setShuffle(!shuffle)} className={`flex h-11 w-11 items-center justify-center rounded-xl border focus-visible:outline-2 ${shuffle?"border-pink-400 bg-pink-100 text-pink-700":"border-pink-200 bg-white/70 text-purple-500 hover:bg-pink-100"}`}><Shuffle size={19}/></button>
          <span className="ml-1 text-xs text-purple-500">{tracks.length} {ru?"треков":"tracks"}</span>
        </div></div>
      </div>
      {open&&current.youtubeId&&<div className="px-4 pb-4"><div ref={host} className="aspect-video w-full"/>{error&&<p role="status" className="text-sm mt-2">{ru?"Не удалось воспроизвести запись. Она может быть недоступна в твоём регионе или для встраивания.":"This recording could not be played. It may be unavailable in your region or for embedding."}</p>}{error&&<><button className="text-xs underline mr-3" onClick={()=>{setError(false);setPlayerState("loading");setAttempt(n=>n+1);}}>{ru?"Попробовать ещё раз":"Try again"}</button><a className="text-xs underline" target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${current.artist} ${current.title}`)}`}>{ru?"Найти другую версию ↗":"Find another version ↗"}</a><br/></>}<a className="text-xs underline" target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/watch?v=${current.youtubeId}`}>{ru?"Открыть запись на YouTube ↗":"Open recording on YouTube ↗"}</a></div>}
      {selected&&<details key={current.id} open={platformsOpen} onToggle={e=>setPlatformsOpen(e.currentTarget.open)} className="mx-4 mb-4 rounded-xl border border-pink-200 bg-white/60 px-4 py-3 text-sm"><summary className="cursor-pointer font-medium text-pink-800">{ru?"Слушать на других площадках":"Listen on other services"}</summary><div className="mt-3 flex flex-wrap gap-2">{([
        ...(!current.youtubeId?[{name:"YouTube", direct:undefined, search:`https://www.youtube.com/results?search_query=${encodeURIComponent(`${current.artist} ${current.title}`)}`}]:[]),
        {name:"Яндекс Музыка", direct:platforms.yandex, search:`https://music.yandex.ru/search?text=${encodeURIComponent(`${current.artist} ${current.title}`)}`},
        {name:"Spotify", direct:platforms.spotify, search:`https://open.spotify.com/search/${encodeURIComponent(`${current.artist} ${current.title}`)}`},
        {name:"Apple Music", direct:platforms.apple, search:`https://music.apple.com/us/search?term=${encodeURIComponent(`${current.artist} ${current.title}`)}`},
      ]).map(service=><a key={service.name} href={service.direct||service.search} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-3 py-2 text-pink-800 underline-offset-2 hover:underline focus-visible:outline-2">{service.direct?service.name:`${ru?"Найти в":"Search"} ${service.name}`} ↗</a>)}</div></details>}
      <div className="mx-4 mb-3 flex gap-2 items-center rounded-xl border border-pink-200 bg-white/70 px-3"><Search size={17}/><input aria-label={ru?"Поиск музыки":"Search music"} placeholder={ru?"Название или исполнитель":"Song or artist"} value={query} onChange={e=>{setQuery(e.target.value);setLimit(40);}} className="w-full min-w-0 py-3 bg-transparent outline-none"/></div>
      <div className="max-h-80 overflow-y-auto px-3 pb-4">
        {filtered.slice(0,limit).map(({t,i})=><div key={t.id} className={`rounded-xl mb-1 ${i===index?"bg-pink-100":""}`}>
          <button onClick={()=>{setIndex(i);setSelected(true);setPlatformsOpen(!t.youtubeId);setOpen(Boolean(t.youtubeId));setError(false);setPlayerState(t.youtubeId?"loading":"idle");setAttempt(n=>n+1);}} aria-current={i===index&&selected?"true":undefined} className="w-full px-3 py-2 text-left rounded-xl focus-visible:outline-2"><p className="text-sm font-medium truncate">{t.title}</p><p className="text-xs text-pink-700 truncate">{t.artist}</p></button>
        </div>)}
        {!filtered.length&&<p className="p-3 text-sm">{ru?"Ничего не найдено":"No results"}</p>}
        {filtered.length>limit&&<button className="w-full rounded-xl py-3 text-sm text-pink-700 bg-pink-50" onClick={()=>setLimit(limit+40)}>{ru?"Показать ещё":"Show more"}</button>}
      </div>
    </div>
  </section>;
}
