"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { MediaPhoto } from "@/lib/media";
import { cn } from "@/lib/cn";

export function PhotoGallery({
  photos,
  className
}: {
  photos: MediaPhoto[];
  className?: string;
}) {
  const [openSrc, setOpenSrc] = useState<string | null>(null);
  const open = useMemo(() => photos.find((p) => p.src === openSrc) ?? null, [openSrc, photos]);

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3", className)}>
        {photos.map((p) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpenSrc(p.src)}
            className="group relative overflow-hidden rounded-2xl border border-blush-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-blush-200 dark:border-transparent dark:bg-transparent"
            aria-label={`Открыть фото ${p.n}`}
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/25" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpenSrc(null)}
              aria-label="Закрыть"
            />

            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-black/40 shadow-soft ring-1 ring-white/10"
              initial={{ scale: 0.98, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.99, y: 10, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={open.src}
                  alt={open.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="absolute right-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/80">
                  {open.n}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenSrc(null)}
                  className="rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white/90 transition hover:bg-black/60"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

