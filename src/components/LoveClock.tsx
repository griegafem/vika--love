"use client";

import { useEffect, useState } from "react";

function handAngles(date: Date) {
  const s = date.getSeconds() + date.getMilliseconds() / 1000;
  const m = date.getMinutes() + s / 60;
  const h = (date.getHours() % 12) + m / 60;
  return {
    hour: h * 30,
    minute: m * 6,
    second: s * 6
  };
}

export function LoveClock() {
  const [angles, setAngles] = useState<{ hour: number; minute: number; second: number } | null>(
    null
  );

  useEffect(() => {
    setAngles(handAngles(new Date()));
    const id = window.setInterval(() => setAngles(handAngles(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const ticks = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex w-full flex-col items-center gap-2 md:items-end">
      <p className="text-[10px] font-medium tracking-[0.25em] text-zinc-400 sm:text-xs dark:text-zinc-400">
        {"сейчас".toUpperCase()}
      </p>
      <div
        className="relative aspect-square w-[min(148px,42vw)] shrink-0 rounded-full border border-blush-200/90 bg-gradient-to-br from-white via-blush-50/80 to-white p-2 shadow-soft ring-2 ring-blush-100/60 dark:border-zinc-800/80 dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 dark:ring-zinc-800/50"
        aria-label="Часы по местному времени"
      >
        <div className="absolute inset-3 rounded-full bg-white/85 shadow-[inset_0_2px_12px_rgba(255,59,132,0.06)] dark:bg-zinc-950/70 dark:shadow-[inset_0_2px_18px_rgba(0,0,0,0.45)]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[85%] w-[85%]">
            {ticks.map((i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 h-[46%] w-px origin-bottom"
                style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg)` }}
              >
                <div
                  className={
                    i % 3 === 0
                      ? "mx-auto h-2 w-0.5 rounded-full bg-blush-400/90 dark:bg-blush-400/70"
                      : "mx-auto h-1 w-px rounded-full bg-blush-200 dark:bg-zinc-700/80"
                  }
                />
              </div>
            ))}

            <div
              className="absolute bottom-1/2 left-1/2 w-1 origin-bottom rounded-full bg-zinc-800/90 dark:bg-zinc-200/90"
              style={{
                height: "28%",
                opacity: angles ? 1 : 0,
                transform: `translateX(-50%) rotate(${angles?.hour ?? 0}deg)`
              }}
              suppressHydrationWarning
            />
            <div
              className="absolute bottom-1/2 left-1/2 w-0.5 origin-bottom rounded-full bg-zinc-700/85 dark:bg-zinc-200/70"
              style={{
                height: "36%",
                opacity: angles ? 1 : 0,
                transform: `translateX(-50%) rotate(${angles?.minute ?? 0}deg)`
              }}
              suppressHydrationWarning
            />
            <div
              className="absolute bottom-1/2 left-1/2 w-px origin-bottom rounded-full bg-blush-500"
              style={{
                height: "40%",
                opacity: angles ? 1 : 0,
                transform: `translateX(-50%) rotate(${angles?.second ?? 0}deg)`
              }}
              suppressHydrationWarning
            />

            <div className="absolute left-1/2 top-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blush-200 bg-gradient-to-br from-blush-100 to-white shadow-sm dark:border-zinc-800/80 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-950" />

            <div
              className="absolute left-1/2 top-[10%] -translate-x-1/2 text-[11px] text-blush-400/90"
              aria-hidden
            >
              ❤
            </div>
          </div>
        </div>
      </div>
      <p className="max-w-[10rem] text-center text-[10px] leading-snug text-zinc-400 md:text-right dark:text-zinc-500">
        по времени на твоём устройстве
      </p>
    </div>
  );
}
