"use client";

import { useEffect, useMemo, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function pluralRu(n: number, one: string, few: string, many: string) {
  const nAbs = Math.abs(n) % 100;
  const n1 = nAbs % 10;
  if (nAbs > 10 && nAbs < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

function diffParts(fromMs: number, toMs: number): Parts {
  let total = Math.max(0, Math.floor((toMs - fromMs) / 1000));
  const days = Math.floor(total / 86400);
  total -= days * 86400;
  const hours = Math.floor(total / 3600);
  total -= hours * 3600;
  const minutes = Math.floor(total / 60);
  total -= minutes * 60;
  const seconds = total;
  return { days, hours, minutes, seconds };
}

const START_MS = Date.parse("2026-02-22T11:05:00.000Z");

export function TimeTogether() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = useMemo(() => diffParts(START_MS, now ?? START_MS), [now]);

  const dayWord = pluralRu(parts.days, "день", "дня", "дней");
  const hourWord = pluralRu(parts.hours, "час", "часа", "часов");
  const minWord = pluralRu(parts.minutes, "минута", "минуты", "минут");
  const secWord = pluralRu(parts.seconds, "секунда", "секунды", "секунд");

  return (
    <div className="w-full">
      <div className="inline-flex w-full items-center justify-center rounded-full border border-blush-200 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-800 shadow-soft backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/55 dark:text-zinc-100 md:justify-end">
        <span className="text-zinc-500 dark:text-zinc-400">мы знакомы</span>
        <span className="mx-2 text-blush-400">•</span>
        <span className="tabular-nums">
          {parts.days} {dayWord} {parts.hours} {hourWord} {parts.minutes} {minWord} {parts.seconds}{" "}
          {secWord}
        </span>
      </div>
    </div>
  );
}
