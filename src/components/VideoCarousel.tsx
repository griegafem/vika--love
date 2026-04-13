"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function VideoCarousel({
  videos,
  className
}: {
  videos: { src: string; title?: string }[];
  className?: string;
}) {
  const safe = useMemo(() => (videos.length ? videos : []), [videos]);
  const [active, setActive] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const next = () => setActive((i) => (safe.length ? (i + 1) % safe.length : 0));
  const current = safe[active];

  useEffect(() => {
    // autoplay whenever the src changes
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p && typeof (p as Promise<void>).catch === "function") (p as Promise<void>).catch(() => {});
  }, [current?.src]);

  return (
    <div
      className={cn("w-full", className)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft dark:border-transparent dark:bg-transparent">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <video
                  ref={videoRef}
                  className="h-full w-full bg-black object-contain pointer-events-none"
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  preload="metadata"
                  src={current.src}
                  onEnded={next}
                  onPause={(e) => {
                    const el = e.currentTarget;
                    const p = el.play();
                    if (p && typeof (p as Promise<void>).catch === "function")
                      (p as Promise<void>).catch(() => {});
                  }}
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-zinc-500 dark:text-zinc-400">
                Добавь видео в <code className="rounded bg-white/70 px-2 py-1 dark:bg-zinc-900/60">public/vika</code>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

