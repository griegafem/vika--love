"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Photo = { src: string; alt: string };

function pickBatch(photos: Photo[], start: number, size: number) {
  if (!photos.length) return [];
  const out: Photo[] = [];
  for (let i = 0; i < Math.min(size, photos.length); i++) {
    out.push(photos[(start + i) % photos.length]!);
  }
  return out;
}

export function RotatingPhotoStrip({ photos, everyMs = 6000 }: { photos: Photo[]; everyMs?: number }) {
  const safe = useMemo(() => (photos.length ? photos : []), [photos]);
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (safe.length <= 4) return;
    const step = 4;
    const id = window.setInterval(() => setStart((s) => (s + step) % safe.length), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs, safe.length]);

  const batch = useMemo(() => pickBatch(safe, start, 4), [safe, start]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={batch.map((p) => p.src).join("|")}
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {batch.map((p, idx) => (
          <div
            key={p.src}
            className="relative overflow-hidden rounded-2xl border border-blush-100 bg-white shadow-soft dark:border-transparent dark:bg-transparent"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
                priority={idx < 2}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent dark:from-black/25" />
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
