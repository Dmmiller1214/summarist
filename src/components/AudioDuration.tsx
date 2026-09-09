"use client";

import { useState } from "react";
import { FiClock } from "react-icons/fi";

type AudioDurationProps = {
  src: string;
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default function AudioDuration({ src }: AudioDurationProps) {
  const [duration, setDuration] = useState<number | null>(null);

  return (
    <span className="flex items-center gap-1.5">
      <audio
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      />
      <FiClock className="h-4 w-4" aria-hidden="true" />
      <span>{duration === null ? "Loading..." : formatDuration(duration)}</span>
    </span>
  );
}
