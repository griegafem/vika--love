"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Heart = {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  drift: number;
  opacity: number;
  rise: number;
};

type Spark = {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  drift: number;
  opacity: number;
  rise: number;
  kind: "dot" | "line";
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function HeartConfettiButton({
  label = "Запустить сердечки",
  burstLabel = "Вика, я люблю тебя",
  onBurst
}: {
  label?: string;
  burstLabel?: string;
  onBurst?: () => void;
}) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [cooldown, setCooldown] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const lastBurstAtRef = useRef<number>(0);
  const timeoutsRef = useRef<number[]>([]);
  const burstsRef = useRef(0);

  const seed = useMemo(() => Math.random().toString(16).slice(2), []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  const burst = () => {
    const nowTs = Date.now();
    if (cooldown || nowTs - lastBurstAtRef.current < 650) return;
    lastBurstAtRef.current = nowTs;
    setCooldown(true);
    burstsRef.current += 1;
    const rect = buttonRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight * 0.55;
    const now = nowTs;
    const next: Heart[] = Array.from({ length: 16 }).map((_, i) => ({
      id: `${seed}-${now}-${i}`,
      x: originX + randomBetween(-40, 40),
      y: originY + randomBetween(-10, 10),
      size: randomBetween(14, 28),
      duration: randomBetween(1.6, 2.6),
      delay: randomBetween(0, 0.35),
      rotate: randomBetween(-25, 25),
      drift: randomBetween(-80, 80),
      opacity: randomBetween(0.75, 0.95),
      rise: randomBetween(420, 680)
    }));
    const nextSparks: Spark[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `${seed}-${now}-s-${i}`,
      x: originX + randomBetween(-20, 20),
      y: originY + randomBetween(-10, 10),
      size: randomBetween(6, 12),
      duration: randomBetween(0.9, 1.4),
      delay: randomBetween(0, 0.12),
      rotate: randomBetween(-90, 90),
      drift: randomBetween(-160, 160),
      opacity: randomBetween(0.55, 0.9),
      rise: randomBetween(220, 420),
      kind: Math.random() > 0.55 ? "dot" : "line"
    }));
    setHearts(next);
    setSparks(nextSparks);
    onBurst?.();
    timeoutsRef.current.push(window.setTimeout(() => setHearts([]), 3200));
    timeoutsRef.current.push(window.setTimeout(() => setSparks([]), 1800));
    timeoutsRef.current.push(window.setTimeout(() => setCooldown(false), 650));

    if (burstsRef.current === 7) {
      timeoutsRef.current.push(
        window.setTimeout(() => {
          setEggOpen(true);
        }, 450)
      );
    }
  };

  return (
    <div className="relative">
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {sparks.map((s) => (
            <motion.div
              key={s.id}
              className="absolute select-none"
              style={{
                left: `${s.x}px`,
                top: `${s.y}px`,
                opacity: s.opacity
              }}
              initial={{ y: 0, x: 0, rotate: 0, scale: 0.9 }}
              animate={{
                y: -s.rise,
                x: s.drift,
                rotate: s.rotate,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {s.kind === "dot" ? (
                <span
                  style={{
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    display: "block",
                    borderRadius: 9999,
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,59,132,0.85))",
                    boxShadow: "0 16px 26px rgba(255, 59, 132, 0.16)"
                  }}
                />
              ) : (
                <span
                  style={{
                    width: `${Math.max(10, s.size * 2.2)}px`,
                    height: "2px",
                    display: "block",
                    borderRadius: 9999,
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,59,132,0.85))",
                    boxShadow: "0 16px 26px rgba(255, 59, 132, 0.14)"
                  }}
                />
              )}
            </motion.div>
          ))}
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              className="absolute select-none"
              style={{
                left: `${h.x}px`,
                top: `${h.y}px`,
                fontSize: `${h.size}px`,
                opacity: h.opacity
              }}
              initial={{ y: 0, x: 0, rotate: 0, scale: 0.9 }}
              animate={{
                y: -h.rise,
                x: h.drift,
                rotate: h.rotate,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: h.duration,
                delay: h.delay,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              ❤
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        ref={buttonRef}
        type="button"
        disabled={cooldown}
        onPointerUp={burst}
        onClick={burst}
        className="group relative inline-flex items-center justify-center rounded-full border border-blush-200 bg-white/80 px-5 py-3 text-sm font-medium text-zinc-900 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-blush-300 hover:bg-white active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:border-zinc-800/80 dark:bg-zinc-900/55 dark:text-zinc-100 dark:hover:bg-zinc-900"
        style={{ touchAction: "manipulation" }}
      >
        <span className="mr-2 text-base leading-none text-blush-500">❤</span>
        <span>{label}</span>
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100">
          {burstLabel}
        </span>
      </button>

      <AnimatePresence>
        {eggOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-white/55 backdrop-blur dark:bg-black/55"
              aria-label="Закрыть"
              onClick={() => setEggOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blush-100 bg-white p-6 shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950"
              initial={{ y: 14, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                ПАСХАЛКА
              </p>
              <p className="mt-2 text-pretty text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Вика, ты мой счастливый баг.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                Если ты это нашла — значит ты точно умеешь делать мир красивее. Даня ❤️
              </p>
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEggOpen(false)}
                  className="rounded-full border border-blush-100 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-700 backdrop-blur transition hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:hover:bg-zinc-950"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

