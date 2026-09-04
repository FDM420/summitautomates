"use client";

import { useEffect, useRef, useState } from "react";

const SPEEDS = [1, 1.5, 2];

/** Compact voice-note player: play/pause, seek, elapsed/total, speed cycle. */
export function AudioPlayer({ src, transcript }: { src: string; transcript?: string | null }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onMeta = () => setDur(Number.isFinite(a.duration) ? a.duration : 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) a.pause(); else void a.play();
    setPlaying(!playing);
  };
  const cycleSpeed = () => {
    const i = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(i);
    if (ref.current) ref.current.playbackRate = SPEEDS[i]!;
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="min-w-[220px]">
      <audio ref={ref} preload="metadata" src={src} />
      <div className="flex items-center gap-2">
        <button
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-300 text-slate-950"
          onClick={toggle}
          type="button"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <input
          aria-label="Seek"
          className="h-1 flex-1 accent-amber-300"
          max={dur || 0}
          min={0}
          onChange={(e) => { if (ref.current) ref.current.currentTime = Number(e.target.value); }}
          step={0.1}
          type="range"
          value={t}
        />
        <span className="mono w-[5.5rem] text-right text-[11px] text-slate-400">
          {fmt(t)} / {fmt(dur)}
        </span>
        <button className="mono rounded bg-white/10 px-1.5 text-[11px] text-slate-200" onClick={cycleSpeed} type="button">
          {SPEEDS[speedIdx]}×
        </button>
      </div>
      {transcript ? <p className="mt-2 text-[13px] italic text-slate-300">“{transcript}”</p> : null}
    </div>
  );
}
