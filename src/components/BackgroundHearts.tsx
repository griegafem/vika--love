"use client";

import { useEffect, useState } from "react";

type FloatingHeart = {
  id: string;
  side: "left" | "right";
  topPct: number;
  insetPx: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  lift: number;
  tilt: number;
};

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function BackgroundHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isSmUp = window.matchMedia?.("(min-width: 640px)")?.matches ?? true;
    const seed = Math.random().toString(16).slice(2);
    const make = (side: "left" | "right", count: number) =>
      Array.from({ length: count }).map((_, i) => {
        // Stratified placement: evenly spread along the height (no clumps),
        // with a small random jitter within each "slot".
        const slotTop = 6 + (90 * i) / Math.max(1, count - 1);
        const jitter = rnd(-1.2, 1.2);
        return {
        id: `${seed}-${side}-${i}`,
        side,
        topPct: Math.max(4, Math.min(96, slotTop + jitter)),
        insetPx: rnd(10, 32),
        size: rnd(isSmUp ? 12 : 11, isSmUp ? 22 : 18),
        opacity: rnd(isSmUp ? 0.08 : 0.1, isSmUp ? 0.18 : 0.22),
        duration: rnd(9.0, 16.0),
        delay: rnd(0, 2.0),
        drift: rnd(10, 24) * (side === "left" ? 1 : -1),
        lift: -rnd(14, 26),
        tilt: (side === "left" ? 1 : -1) * rnd(4, 8)
        };
      });

    // More hearts; still smooth because it's pure CSS animation
    const perSide = isSmUp ? 48 : 28;
    setHearts([...make("left", perSide), ...make("right", perSide)]);
  }, []);

  const boostMultiplier = 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0">
        {mounted
          ? hearts.map((h) => (
              <div
                key={h.id}
                className="vika-heart absolute select-none text-blush-500"
                style={{
                  top: `${h.topPct}%`,
                  left: h.side === "left" ? `${h.insetPx}px` : undefined,
                  right: h.side === "right" ? `${h.insetPx}px` : undefined,
                  fontSize: `${h.size}px`,
                  opacity: h.opacity,
                  textShadow: "0 18px 38px rgba(255, 59, 132, 0.10)",
                  animationDuration: `${h.duration}s`,
                  animationDelay: `${h.delay}s`,
                  ["--drift" as any]: `${h.drift * boostMultiplier}px`,
                  ["--lift" as any]: `${h.lift * boostMultiplier}px`,
                  ["--tilt" as any]: `${h.tilt * boostMultiplier}deg`
                }}
              >
                ❤
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

