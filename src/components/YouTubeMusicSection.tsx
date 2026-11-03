import YouTubeMusicPlayer from "./YouTubeMusicPlayer";
import collection from "@/data/music.json";
export interface TrackWithMeta { id: string; youtubeId: string; playbackStatus?: string; title: string; artist: string; thumbnail: string }
export default function YouTubeMusicSection({ tracks }: { tracks: {id:string;youtubeId:string;title?:string;artist?:string}[] }) {
  const used = new Set<number>();
  // The original export's like-8 was identified by Eva as a duplicate of like-641.
  const catalog: TrackWithMeta[] = collection.filter(t=>t.id!=="like-8").map(t=>({...t,thumbnail:"/images/music-cover.svg"}));
  const all: TrackWithMeta[] = catalog.map(track => {
    const matchIndex = tracks.findIndex((extra, index) =>
      !used.has(index) && extra.title?.trim().toLocaleLowerCase() === track.title.trim().toLocaleLowerCase() &&
      extra.artist?.trim().toLocaleLowerCase() === track.artist.trim().toLocaleLowerCase()
    );
    if (matchIndex < 0) return track;

    used.add(matchIndex);
    const extra = tracks[matchIndex];
    return {
      ...track,
      youtubeId: track.youtubeId || extra.youtubeId,
      playbackStatus: track.playbackStatus ?? (extra.youtubeId && !track.youtubeId ? "not_checked" : undefined),
    };
  });
  tracks.forEach((track, index) => {
    if (!used.has(index)) all.unshift({...track,title:track.title??"YouTube",artist:track.artist??"",thumbnail:"/images/music-cover.svg"});
  });
  return <YouTubeMusicPlayer tracks={all}/>;
}
