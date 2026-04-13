"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const REASONS = [
  "за твою улыбку, после которой день становится светлее",
  "за то, как ты смеёшься — честно и по-своему",
  "за твою нежность, даже когда ты стараешься быть «сильной»",
  "за твои глаза и то, что в них можно утонуть",
  "за то, что рядом с тобой хочется быть лучше",
  "за твой ум — он безумно привлекательный",
  "за твою честность, даже когда она неудобная",
  "за мелочи: как ты говоришь, молчишь, злишься по-своему",
  "за то, что ты — не копия, а живая, настоящая",
  "за твою красоту, которая не «на выход», а всегда",
  "за то, что с тобой можно быть собой",
  "за твою усталость тоже — она тоже часть тебя",
  "за твой характер — с ним интересно",
  "за твою заботу, даже если ты об этом не кричишь",
  "за то, что ты выбираешь быть рядом",
  "за твои мечты — хочу их поддерживать",
  "за твой голос — лучший звук дня",
  "за твою смелость в маленьких вещах",
  "за то, что ты делаешь мир теплее",
  "за твои «просто так» — они много значат",
  "за твою уникальность, которую невозможно заменить",
  "за то, что ты учишь меня слушать глубже",
  "за твою искренность — редкость",
  "за то, что с тобой «обычное» чувствуется особенным",
  "за твою уязвимость — я её берегу",
  "за твои руки и то, как хочется их держать",
  "за твой смех — он лечит",
  "за то, что ты — мой самый любимый человек"
];

export function ReasonsJar() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  const pick = () => {
    setReason(REASONS[Math.floor(Math.random() * REASONS.length)] ?? "");
    setOpen(true);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={pick}
        className="inline-flex items-center justify-center rounded-2xl border border-blush-200 bg-gradient-to-br from-white to-blush-50/80 px-5 py-4 text-sm font-medium text-zinc-900 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-blush-300 hover:shadow-md active:translate-y-0 dark:border-zinc-800/80 dark:from-zinc-950 dark:to-zinc-900/60 dark:text-zinc-100"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      >
        <span className="mr-2 text-lg" aria-hidden>
          🫙
        </span>
        Баночка «почему я тебя люблю»
      </motion.button>

      <AnimatePresence>
        {open && reason ? (
          <motion.div
            className="fixed inset-0 z-[55] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Закрыть"
              className="absolute inset-0 cursor-default bg-white/55 backdrop-blur dark:bg-black/55"
              onClick={() => {
                setOpen(false);
                setReason(null);
              }}
            />

            <motion.div
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950"
              initial={{ y: 16, scale: 0.98, opacity: 0, rotate: -1 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="relative p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                    ЗАПИСКА ИЗ БАНОЧКИ
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setReason(null);
                    }}
                    className="shrink-0 rounded-full border border-blush-100 bg-white/70 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur transition hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:hover:bg-zinc-950"
                  >
                    Закрыть
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-blush-200 bg-blush-50/40 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/35">
                  <p className="text-lg italic leading-relaxed text-zinc-800 sm:text-xl dark:text-zinc-100">
                    Я люблю тебя…{" "}
                    <span className="text-blush-600">{reason}</span>
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={pick}
                    className="rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-soft transition hover:border-blush-300 hover:bg-blush-50/50 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-100 dark:hover:bg-zinc-950"
                  >
                    Вытащить ещё одну
                  </button>
                  <p className="text-center text-xs text-zinc-500 sm:text-right dark:text-zinc-400">
                    нажми на фон, чтобы закрыть
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
