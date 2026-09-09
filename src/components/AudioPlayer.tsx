"use client";

import { useRef, useState } from "react";
import {
  FiPause,
  FiPlay,
  FiRotateCcw,
  FiRotateCw,
  FiVolume2,
} from "react-icons/fi";

type AudioPlayerProps = {
  src: string;
  title: string;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  }

  function seekTo(nextTime: number) {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function skip(seconds: number) {
    seekTo(Math.min(Math.max(currentTime + seconds, 0), duration));
  }

  function changePlaybackRate() {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];

    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }

    setPlaybackRate(nextRate);
  }

  function changeVolume(nextVolume: number) {
    if (audioRef.current) {
      audioRef.current.volume = nextVolume;
    }

    setVolume(nextVolume);
  }

  return (
    <div className="mt-4 rounded-xl bg-[#032b41] p-5 text-white shadow-lg">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />

      <p className="truncate text-sm font-semibold">{title}</p>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => skip(-10)}
          aria-label="Rewind 10 seconds"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <FiRotateCcw className="text-xl" />
          <span className="absolute text-[9px] font-bold">10</span>
        </button>

        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2bd97c] text-xl text-[#032b41] transition-transform hover:scale-105"
        >
          {isPlaying ? <FiPause /> : <FiPlay className="ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={() => skip(10)}
          aria-label="Skip forward 10 seconds"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
        >
          <FiRotateCw className="text-xl" />
          <span className="absolute text-[9px] font-bold">10</span>
        </button>

        <span className="w-10 text-right text-xs tabular-nums">
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seekTo(Number(event.target.value))}
          aria-label="Audio progress"
          className="h-1 w-full cursor-pointer accent-[#2bd97c]"
        />

        <span className="w-10 text-xs tabular-nums">
          {formatTime(duration)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-5 border-t border-white/15 pt-4">
        <button
          type="button"
          onClick={changePlaybackRate}
          aria-label={`Playback speed ${playbackRate} times`}
          className="min-w-12 rounded px-2 py-1 text-sm font-semibold hover:bg-white/10"
        >
          {playbackRate}x
        </button>

        <div className="flex w-full max-w-40 items-center gap-2">
          <FiVolume2 className="shrink-0" aria-hidden="true" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
            aria-label="Volume"
            className="h-1 w-full cursor-pointer accent-[#2bd97c]"
          />
        </div>
      </div>
    </div>
  );
}
