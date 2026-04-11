"use client";

import { useEffect, useState } from "react";

type EmojiHeart = {
  id: string;
  leftPct: number;
  topPct: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  lift: number;
  tilt: number;
  emoji: "💗" | "💞" | "💕" | "💖";
};

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function BackgroundEmojiHearts() {
  const [items, setItems] = useState<EmojiHeart[]>([]);

  useEffect(() => {
    const seed = Math.random().toString(16).slice(2);
    const isSmUp = window.matchMedia?.("(min-width: 640px)")?.matches ?? true;
    const count = isSmUp ? 8 : 5;
    const emojis: EmojiHeart["emoji"][] = ["💗", "💞", "💕", "💖"];

    const next: EmojiHeart[] = Array.from({ length: count }).map((_, i) => {
      const slotTop = 7 + (86 * i) / Math.max(1, count - 1);
      return {
        id: `${seed}-${i}`,
        leftPct: rnd(6, 94),
        topPct: Math.max(6, Math.min(94, slotTop + rnd(-3.2, 3.2))),
        size: rnd(isSmUp ? 14 : 12, isSmUp ? 24 : 20),
        opacity: rnd(0.12, 0.22),
        duration: rnd(10, 16),
        delay: rnd(0, 2.5),
        drift: rnd(-22, 22),
        lift: -rnd(12, 22),
        tilt: rnd(-8, 8),
        emoji: emojis[i % emojis.length]
      };
    });

    setItems(next);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((h) => (
        <div
          key={h.id}
          className="vika-heart absolute select-none"
          style={{
            left: `${h.leftPct}%`,
            top: `${h.topPct}%`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            ["--drift" as any]: `${h.drift}px`,
            ["--lift" as any]: `${h.lift}px`,
            ["--tilt" as any]: `${h.tilt}deg`
          }}
        >
          {h.emoji}
        </div>
      ))}
    </div>
  );
}

