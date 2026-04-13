"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function PhotoCarousel({
  photos,
  className
}: {
  photos: { src: string; alt: string }[];
  className?: string;
}) {
  const safePhotos = useMemo(() => (photos.length ? photos : []), [photos]);
  const [active, setActive] = useState(0);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);
  // placeholder to keep future drag-scroll enhancements localized

  const prev = () =>
    setActive((i) => (safePhotos.length ? (i - 1 + safePhotos.length) % safePhotos.length : 0));
  const next = () =>
    setActive((i) => (safePhotos.length ? (i + 1) % safePhotos.length : 0));

  const current = safePhotos[active];

  const pauseBriefly = (ms = 2200) => {
    setPaused(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => setPaused(false), ms);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    if (safePhotos.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % safePhotos.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, safePhotos.length]);

  return (
    <div
      className={cn("w-full", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft dark:border-transparent dark:bg-transparent">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] md:aspect-[16/9]">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragStart={() => pauseBriefly(3200)}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 70) prev();
                  if (info.offset.x < -70) next();
                  pauseBriefly(2600);
                }}
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  priority={active === 0}
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blush-50/25 via-transparent to-transparent" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-sm text-zinc-500">
                Добавь фото в <code className="rounded bg-white/70 px-2 py-1">public/vika</code>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-blush-100 bg-white/80 px-3 py-2 text-xs font-medium text-zinc-700 backdrop-blur transition hover:bg-white dark:border-transparent dark:bg-zinc-950/45 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
            aria-label="Предыдущее фото"
          >
            ←
          </button>

          <div className="flex items-center gap-1.5">
            {safePhotos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition",
                  i === active ? "bg-blush-500" : "bg-blush-200 hover:bg-blush-300"
                )}
                aria-label={`Фото ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="rounded-full border border-blush-100 bg-white/80 px-3 py-2 text-xs font-medium text-zinc-700 backdrop-blur transition hover:bg-white dark:border-transparent dark:bg-zinc-950/45 dark:text-zinc-200 dark:hover:bg-zinc-950/60"
            aria-label="Следующее фото"
          >
            →
          </button>
        </div>
      </div>

      {safePhotos.length > 1 ? (
        <div className="mt-4">
          <div
            ref={thumbsRef}
            className="relative mx-auto flex max-w-[min(520px,100%)] justify-start overflow-x-auto rounded-2xl border border-blush-100 bg-white/40 p-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-transparent dark:bg-zinc-950/15"
            onWheel={(e) => {
              const el = thumbsRef.current;
              if (!el) return;
              if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
              el.scrollLeft += e.deltaY;
            }}
          >
            <div className="flex w-max gap-2 pr-6">
              {safePhotos.map((p, i) => (
                <button
                  key={p.src}
                  type="button"
                  data-idx={i}
                  onClick={() => {
                    setActive(i);
                    pauseBriefly(2600);
                  }}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-xl border transition",
                    i === active
                      ? "border-blush-400 ring-2 ring-blush-200"
                      : "border-blush-100 hover:border-blush-200"
                  )}
                  aria-label={`Открыть фото ${i + 1}`}
                >
                  <div className="relative h-[58px] w-[46px] sm:h-[64px] sm:w-[52px]">
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  {i === active ? (
                    <div className="pointer-events-none absolute inset-0 bg-blush-500/10 transition-opacity" />
                  ) : null}
                </button>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/70 to-transparent dark:from-zinc-950/40" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/70 to-transparent dark:from-zinc-950/40" />
          </div>
        </div>
      ) : (
        <p className="mt-3 text-xs text-zinc-500">Листай свайпом влево/вправо.</p>
      )}
    </div>
  );
}

