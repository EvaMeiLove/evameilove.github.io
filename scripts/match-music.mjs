// Server-side only. Never expose YOUTUBE_API_KEY through NEXT_PUBLIC_*.
import {readFile,writeFile} from 'node:fs/promises';
const file = new URL('../src/data/music.json',import.meta.url);
const cacheFile = new URL('../src/data/music-candidates.json',import.meta.url);
const tracks=JSON.parse(await readFile(file,'utf8'));
let cache={};try{cache=JSON.parse(await readFile(cacheFile,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const pending=tracks.filter(track=>track.needsYouTubeMatch===true&&!track.youtubeId);
if(!pending.length){console.log(JSON.stringify({searched:0,matched:0,pending:0,message:'No new likes are queued for API matching.'}));process.exit(0);}
const key=process.env.YOUTUBE_API_KEY;
if(!key){console.error('Set YOUTUBE_API_KEY as a private GitHub Actions secret.');process.exit(1);}
const limit=Math.min(80,Math.max(1,Number(process.env.MATCH_LIMIT)||25));
const norm=s=>s.normalize('NFKC').toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const words=s=>norm(s).split(' ').filter(Boolean);
const includes=(text,tokens)=>tokens.length>0&&tokens.every(t=>words(text).includes(t));
async function api(endpoint,params){const url=new URL('https://www.googleapis.com/youtube/v3/'+endpoint);Object.entries({...params,key}).forEach(([k,v])=>url.searchParams.set(k,v));const r=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error('YouTube API '+r.status+'; batch stopped, previous results retained.');return r.json();}
function selectCandidate(track,candidates){
 const title=words(track.title.replace(/\s*\((?:prod\.?|feat\.?)[^)]*\)/ig,'').replace(/\bfeat\..*$/i,''));
 const artists=track.artist.split(',').map(words).filter(a=>a.length);
 const variants=words('live remix acoustic slowed reverb instrumental karaoke cover 8d sped up концерт лайв акустика ремикс');
 const ranked=candidates.filter(v=>['RU','GB','US'].every(code=>(!v.regionRestriction?.allowed||v.regionRestriction.allowed.includes(code))&&!v.regionRestriction?.blocked?.includes(code)))
 .map(v=>{
 const text=v.title+' '+v.channel;
 if(!includes(text,title)||!artists.length||!artists.some(a=>includes(text,a)))return null;
 if(variants.some(w=>words(v.title).includes(w)&&!words(track.title).includes(w)))return null;
 const topic=/ - Topic$/i.test(v.channel)&&artists.some(a=>includes(v.channel,a));
 const official=/official audio/i.test(v.title)&&artists.every(a=>includes(text,a));
 const score=topic?30:official?20:0;
 return score?{id:v.youtubeId,score}:null;
 }).filter(Boolean).sort((a,b)=>b.score-a.score);
 return ranked.length&&(!ranked[1]||ranked[0].score>ranked[1].score)?ranked[0].id:'';
}
let searched=0,matched=0;
for(const track of pending){
 if(cache[track.id]){
  const selected=selectCandidate(track,cache[track.id].candidates);
  if(selected){track.youtubeId=selected;track.needsYouTubeMatch=false;cache[track.id].status='matched';matched++;}
  continue;
 }
 if(searched>=limit)break;
 try{
  const result=await api('search',{part:'snippet',type:'video',videoEmbeddable:'true',videoSyndicated:'true',maxResults:'5',q:`${track.artist} ${track.title} official audio`});searched++;
  const ids=result.items.map(i=>i.id.videoId).join(',');
  const details=ids?(await api('videos',{part:'snippet,status,contentDetails',id:ids})).items:[];
  const candidates=details.filter(v=>v.status.embeddable&&v.status.privacyStatus==='public').map(v=>({youtubeId:v.id,title:v.snippet.title,channel:v.snippet.channelTitle,regionRestriction:v.contentDetails.regionRestriction??null}));
  const selected=selectCandidate(track,candidates);
  if(selected){track.youtubeId=selected;track.needsYouTubeMatch=false;matched++;}
  cache[track.id]={checkedAt:new Date().toISOString(),status:track.youtubeId?'matched':'review',candidates};
  await writeFile(file,JSON.stringify(tracks,null,2)+'\n');
  await writeFile(cacheFile,JSON.stringify(cache,null,2)+'\n');
 }catch(e){console.error(e.message);process.exitCode=1;break;}
}
console.log(JSON.stringify({searched,matched,total:tracks.length,playable:tracks.filter(t=>t.youtubeId).length}));

await writeFile(file,JSON.stringify(tracks,null,2)+'\n');
await writeFile(cacheFile,JSON.stringify(cache,null,2)+'\n');
