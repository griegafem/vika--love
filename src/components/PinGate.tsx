"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SESSION_KEY = "vika_love_unlocked_v1";

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function getPin() {
  // Configure via env: NEXT_PUBLIC_PIN=126534
  return (process.env.NEXT_PUBLIC_PIN ?? "126534").trim();
}

export function PinGate({ children }: { children: React.ReactNode }) {
  const pin = useMemo(() => getPin(), []);
  const [unlocked, setUnlocked] = useState(false);
  const [digits, setDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") setUnlocked(true);
    } catch {}
  }, []);

  const joined = digits.join("");
  const expected = onlyDigits(pin).slice(0, 6);

  useEffect(() => {
    if (unlocked) return;
    if (joined.length !== 6) return;
    if (joined === expected) {
      setUnlocked(true);
      setError(null);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    } else {
      setError("Неверный пин-код");
      setDigits(Array.from({ length: 6 }, () => ""));
      window.setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }
  }, [expected, joined, unlocked]);

  const onChangeAt = (idx: number, value: string) => {
    const cleaned = onlyDigits(value).slice(0, 6);
    setError(null);

    if (cleaned.length <= 1) {
      const next = [...digits];
      next[idx] = cleaned;
      setDigits(next);
      if (cleaned && idx < 5) inputRefs.current[idx + 1]?.focus();
      return;
    }

    // Paste / fast input
    const next = [...digits];
    for (let i = 0; i < 6; i++) next[i] = cleaned[i] ?? "";
    setDigits(next);
    inputRefs.current[Math.min(cleaned.length, 6) - 1]?.focus();
  };

  const onKeyDownAt = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputRefs.current[idx + 1]?.focus();
    if (e.key === "Enter") inputRefs.current[Math.min(idx + 1, 5)]?.focus();
  };

  return (
    <div className="relative">
      <div className={unlocked ? "" : "select-none blur-[2px]"} aria-hidden={!unlocked}>
        {children}
      </div>

      <AnimatePresence>
        {!unlocked ? (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-white/55 backdrop-blur-md" />

            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft"
              initial={{ y: 18, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="p-6 sm:p-7">
                <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">
                  ЗАЩИЩЕНО
                </p>
                <h2 className="mt-2 text-pretty text-xl font-semibold text-zinc-900">
                  Введи пин-код, чтобы открыть открытку
                </h2>

                <div className="mt-5 flex justify-center gap-2">
                  {digits.map((d, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      value={d}
                      onChange={(e) => onChangeAt(idx, e.target.value)}
                      onKeyDown={(e) => onKeyDownAt(idx, e)}
                      className="h-12 w-10 rounded-xl border border-blush-200 bg-white text-center text-lg font-semibold text-zinc-900 shadow-soft outline-none transition focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
                      aria-label={`Цифра ${idx + 1}`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error ? (
                    <motion.p
                      className="mt-4 text-center text-sm font-medium text-blush-600"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      {error}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <p className="mt-5 text-center text-xs text-zinc-500">
                  Совет: можно вставить код целиком.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

