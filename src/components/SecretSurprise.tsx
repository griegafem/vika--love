"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function useTypewriter(text: string, isActive: boolean, speedMs = 18) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!isActive) {
      setOut("");
      return;
    }
    let i = 0;
    setOut("");
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speedMs);
    return () => window.clearInterval(id);
  }, [text, isActive, speedMs]);

  return out;
}

export function SecretSurprise() {
  const [open, setOpen] = useState(false);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);

  const messages = useMemo(
    () => [
      [
        "Вика, это маленький секретный подарок внутри открытки.",
        "",
        "Если вдруг ты сомневаешься в чём-то — просто вспомни:",
        "я выбираю тебя. каждый день. снова и снова.",
        "",
        "И да…",
        "я очень хочу однажды проснуться рядом с тобой и сказать:",
        "«доброе утро, моя любовь».",
        "",
        "Твой Даня"
      ].join("\n"),
      [
        "Вика, я смотрю на тебя — и понимаю:",
        "всё самое важное уже рядом.",
        "",
        "Спасибо, что ты есть.",
        "Спасибо, что ты такая — настоящая.",
        "",
        "Я люблю тебя.",
        "",
        "Даня"
      ].join("\n"),
      [
        "Маленький факт:",
        "мне достаточно одной твоей улыбки,",
        "чтобы день стал лучше.",
        "",
        "Я безумно ценю тебя.",
        "",
        "Твой Даня"
      ].join("\n"),
      [
        "Если бы любовь была местом —",
        "то это был бы момент,",
        "когда ты рядом.",
        "",
        "Я люблю тебя, Вика.",
        "",
        "Даня"
      ].join("\n"),
      [
        "Вика, ты — моё вдохновение.",
        "Ты — моя нежность.",
        "Ты — мой самый любимый человек.",
        "",
        "Я рядом. Всегда.",
        "",
        "Даня"
      ].join("\n"),
      [
        "Секрет:",
        "я каждый раз скучаю по тебе чуть сильнее,",
        "чем собирался.",
        "",
        "И каждый раз люблю ещё больше.",
        "",
        "Твой Даня"
      ].join("\n")
    ],
    []
  );

  const message = pickedIdx == null ? "" : messages[pickedIdx];

  const typed = useTypewriter(message, open, 16);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => {
          const idx = Math.floor(Math.random() * messages.length);
          setPickedIdx(idx);
          setOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-2xl border border-blush-200 bg-white/70 px-5 py-4 text-sm font-medium text-zinc-900 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-blush-300 hover:bg-white active:translate-y-0"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      >
        <span className="mr-2 text-base text-blush-500">✉</span>
        Сюрприз для Вики
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Закрыть"
              className="absolute inset-0 cursor-default bg-white/55 backdrop-blur"
              onClick={() => {
                setOpen(false);
                setPickedIdx(null);
              }}
            />

            <motion.div
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft"
              initial={{ y: 18, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="relative p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">
                      СЕКРЕТНОЕ ПИСЬМО
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                      Для Вики — от Дани
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setPickedIdx(null);
                    }}
                    className="rounded-full border border-blush-100 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur transition hover:bg-white"
                  >
                    Закрыть
                  </button>
                </div>

                <div className="mt-5 rounded-2xl border border-blush-100 bg-blush-50/50 p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700">
                    {typed}
                    <span className="inline-block w-[0.6ch] animate-pulse text-blush-400">
                      |
                    </span>
                  </pre>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
                  <span>нажми на фон, чтобы закрыть</span>
                  <span className="text-blush-400">❤</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

