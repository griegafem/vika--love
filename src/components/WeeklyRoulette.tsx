"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

type FireParticle = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
};

type Prize = {
  title: string;
  subtitle?: string;
  kind: "sex" | "together" | "games" | "cute" | "gold" | "diamond" | "ruby";
  emoji: string;
  weight: number;
  theme: {
    card: string;
    badge: string;
    title: string;
  };
};

function shuffleOnce<T>(items: T[], seed: number) {
  // deterministic-ish shuffle for one mount
  const a = [...items];
  let t = seed || 1;
  const rnd = () => {
    // xorshift32
    t ^= t << 13;
    t ^= t >> 17;
    t ^= t << 5;
    return ((t >>> 0) % 1_000_000) / 1_000_000;
  };
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const PRIZES: Prize[] = [
  {
    kind: "gold",
    title: "ЗОЛОТОЙ ПРИЗ: Вика — королева вечера",
    subtitle: "Твой вечер, твои правила. Даня исполняет с удовольствием."
    ,
    emoji: "👑",
    weight: 2,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-soft dark:border-amber-500/40 dark:from-amber-500/10 dark:to-yellow-500/10",
      badge:
        "text-xs font-semibold tracking-[0.2em] text-amber-700 dark:text-amber-200",
      title: "mt-2 text-pretty text-base font-semibold text-amber-900 dark:text-amber-50"
    }
  },
  {
    kind: "diamond",
    title: "БРИЛЛИАНТОВЫЙ ПРИЗ: Мужской стриптиз",
    subtitle: "Да. Прямо для тебя. И только по твоим правилам.",
    emoji: "💎",
    weight: 1,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4 shadow-soft dark:border-sky-500/40 dark:from-sky-500/10 dark:via-indigo-500/10 dark:to-zinc-900/30",
      badge: "text-xs font-semibold tracking-[0.2em] text-sky-700 dark:text-sky-200",
      title: "mt-2 text-pretty text-base font-semibold text-sky-950 dark:text-sky-50"
    }
  },
  {
    kind: "together",
    title: "Свидание-сюрприз",
    subtitle: "Ты выбираешь место, я соглашаюсь.",
    emoji: "💐",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-blush-100 bg-gradient-to-br from-white to-blush-50/80 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Ночной созвон",
    subtitle: "30 минут только про нас и нежность.",
    emoji: "🌙",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Прогулка + кофе",
    subtitle: "И держаться за руки как в кино.",
    emoji: "☕️",
    weight: 7,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Мини-пикник дома",
    subtitle: "Сладкое, музыка, плед.",
    emoji: "🧺",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-lime-100 bg-gradient-to-br from-white to-lime-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Спа-вечер дома",
    subtitle: "Душ/ванна + свечи + плед + вкусняшки.",
    emoji: "🕯️",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Закат/ночной город",
    subtitle: "Выбираем красивое место и гуляем без спешки.",
    emoji: "🌆",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Завтрак в постель",
    subtitle: "И потом валяемся ещё 30 минут.",
    emoji: "🥐",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Танец на кухне",
    subtitle: "1 песня. Медленно. В обнимку.",
    emoji: "🎶",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "together",
    title: "Добавление нового приза в рулетку",
    subtitle: "Вика придумывает новый приз — и мы добавляем его сюда.",
    emoji: "➕",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50 p-4 shadow-soft dark:border-emerald-500/35 dark:from-emerald-500/10 dark:to-lime-500/10",
      badge: "text-xs font-medium tracking-[0.2em] text-emerald-700 dark:text-emerald-200",
      title: "mt-2 text-pretty text-base font-semibold text-emerald-950 dark:text-emerald-50"
    }
  },

  {
    kind: "games",
    title: "Игра: 20 вопросов",
    subtitle: "Про мечты, желания и «а если…».",
    emoji: "🎲",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "games",
    title: "Игра: кто лучше знает",
    subtitle: "По 10 вопросов друг о друге.",
    emoji: "🧠",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-cyan-100 bg-gradient-to-br from-white to-cyan-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "games",
    title: "Кино + правила",
    subtitle: "Смотрим фильм. На определённые моменты — маленькие задания (поцелуй/объятие/комплимент).",
    emoji: "🎬",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-pink-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "games",
    title: "Игра: «да/нет/может быть»",
    subtitle: "По очереди предлагаем идеи на вечер.",
    emoji: "✅",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "games",
    title: "Игра: «камень-ножницы-бумага»",
    subtitle: "Проиграл — выполняет маленькое желание.",
    emoji: "✂️",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "games",
    title: "Игра: «правда или действие» (мягко)",
    subtitle: "Только то, что приятно и безопасно.",
    emoji: "🎭",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },

  {
    kind: "cute",
    title: "Письмо от Дани",
    subtitle: "Я пишу тебе самое тёплое сегодня.",
    emoji: "💌",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "cute",
    title: "Комплименты-шторм",
    subtitle: "10 комплиментов подряд — без споров.",
    emoji: "💖",
    weight: 6,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-pink-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "cute",
    title: "Массаж 15 минут",
    subtitle: "Плечи/шея/руки — как захочешь.",
    emoji: "🫶",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "cute",
    title: "Селфи-ритуал",
    subtitle: "Сделаем 5 смешных фоток и 1 красивую.",
    emoji: "📸",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "cute",
    title: "Тёплый плейлист",
    subtitle: "Соберём по 5 песен «про нас».",
    emoji: "🎧",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "cute",
    title: "Обнимашки 5 минут",
    subtitle: "Без слов. Просто держаться.",
    emoji: "🤍",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-zinc-100 bg-gradient-to-br from-white to-zinc-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },

  {
    kind: "sex",
    title: "Медленный вечер",
    subtitle: "Тепло, музыка и максимум внимания.",
    emoji: "🔥",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Поцелуи по сценарию",
    subtitle: "Ты задаёшь темп и правила.",
    emoji: "💋",
    weight: 5,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Нежный челлендж",
    subtitle: "Только ласка и шёпот. Без спешки.",
    emoji: "🫦",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Роль: «первое свидание»",
    subtitle: "Флирт как будто мы только знакомы.",
    emoji: "🥂",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Вечер «руки выше»",
    subtitle: "Только поцелуи, объятия и дразнить.",
    emoji: "🙈",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-pink-100 bg-gradient-to-br from-white to-pink-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Шёпот и дыхание",
    subtitle: "10 минут очень близко. Медленно.",
    emoji: "🌡️",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Вика командует",
    subtitle: "Ты говоришь «ещё/стоп/медленнее» — и всё.",
    emoji: "🎀",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Дорожка поцелуев",
    subtitle: "По очереди: шея/плечи/ключицы (как приятно).",
    emoji: "💞",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Запрет на одежду: 1 вещь",
    subtitle: "Оставь на мне одну вещь на выбор.",
    emoji: "🖤",
    weight: 3,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "sex",
    title: "Сюрприз-выбор",
    subtitle: "Ты выбираешь один из 3 вариантов, я выполняю.",
    emoji: "🎁",
    weight: 4,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-4 shadow-soft dark:border-zinc-800/70 dark:from-zinc-950/40 dark:to-zinc-900/40",
      badge: "text-xs font-semibold tracking-[0.2em] text-zinc-600 dark:text-zinc-300",
      title: "mt-2 text-pretty text-base font-semibold text-zinc-900 dark:text-zinc-50"
    }
  },
  {
    kind: "ruby",
    title: "РУБИНОВЫЙ ПРИЗ: Интимка",
    subtitle: "1 фото любого плана от Дани.",
    emoji: "📸",
    weight: 1,
    theme: {
      card:
        "w-64 shrink-0 rounded-2xl border border-rose-300 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 p-4 shadow-soft dark:border-rose-500/40 dark:from-rose-500/15 dark:via-pink-500/10 dark:to-red-500/10",
      badge: "text-xs font-semibold tracking-[0.2em] text-rose-700 dark:text-rose-200",
      title: "mt-2 text-pretty text-base font-semibold text-rose-950 dark:text-rose-50"
    }
  }
];

const LS_LAST_AT = "vika_weekly_wheel_last_at_v1";
const LS_LAST_PRIZE = "vika_weekly_wheel_last_prize_v1";
const LS_HISTORY = "vika_weekly_wheel_history_v1";
const PERIOD_MS = 3 * 24 * 60 * 60 * 1000;

type HistoryEntry = {
  at: number;
  title: string;
  kind: Prize["kind"];
  emoji: string;
};

function nowMs() {
  return Date.now();
}

function msToNextSpin(lastAt: number) {
  const nextAt = lastAt + PERIOD_MS;
  return Math.max(0, nextAt - nowMs());
}

function formatCountdown(ms: number) {
  const total = Math.ceil(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (d > 0) return `${d}д ${h}ч ${m}м`;
  if (h > 0) return `${h}ч ${m}м`;
  return `${m}м`;
}

function chancePct(p: Prize, sum: number) {
  if (!sum) return 0;
  const raw = (Math.max(0, p.weight || 0) / sum) * 100;
  return Math.max(0, Math.round(raw * 10) / 10);
}

function pickPrize() {
  const sum = PRIZES.reduce((acc, p) => acc + Math.max(0, p.weight || 0), 0);
  const r = Math.random() * (sum || 1);
  let walk = 0;
  for (const p of PRIZES) {
    walk += Math.max(0, p.weight || 0);
    if (r <= walk) return p;
  }
  return PRIZES[0]!;
}

export function WeeklyRoulette() {
  const [spinning, setSpinning] = useState(false);
  const [lastAt, setLastAt] = useState<number | null>(null);
  const [prize, setPrize] = useState<Prize | null>(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const tickerRef = useRef<number | null>(null);
  const trackControls = useAnimation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const currentXRef = useRef(0);
  const dimsRef = useRef({ containerW: 360, cardW: 256, gap: 12, span: 268, cycle: 268 * PRIZES.length });
  const spinTimeoutRef = useRef<number | null>(null);
  const pendingPrizeRef = useRef<Prize | null>(null);
  const REPEATS = isMobile ? 7 : 9;
  const track = useMemo(() => shuffleOnce(PRIZES, Math.floor(Math.random() * 2 ** 31)), []);

  const weightSum = useMemo(
    () => PRIZES.reduce((acc, p) => acc + Math.max(0, p.weight || 0), 0),
    []
  );

  const lockedMs = useMemo(() => (lastAt ? msToNextSpin(lastAt) : 0), [lastAt]);
  const locked = lockedMs > 0;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const sortedByChance = useMemo(() => {
    return [...PRIZES].sort((a, b) => {
      const aw = Math.max(0, a.weight || 0);
      const bw = Math.max(0, b.weight || 0);
      if (aw !== bw) return aw - bw;
      return a.title.localeCompare(b.title, "ru");
    });
  }, []);

  useEffect(() => {
    try {
      const sAt = window.localStorage.getItem(LS_LAST_AT);
      const sPrize = window.localStorage.getItem(LS_LAST_PRIZE);
      const sHistory = window.localStorage.getItem(LS_HISTORY);
      if (sAt) setLastAt(Number(sAt));
      if (sPrize) setPrize(JSON.parse(sPrize));
      if (sHistory) setHistory(JSON.parse(sHistory));
    } catch {}
  }, []);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const containerW = containerRef.current?.getBoundingClientRect().width ?? 360;
      const cardW = cardRef.current?.getBoundingClientRect().width ?? 256;
      const gap = 12;
      const span = cardW + gap;
      const cycle = span * track.length;
      dimsRef.current = { containerW, cardW, gap, span, cycle };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [track.length]);

  useEffect(() => {
    if (!lastAt) return;
    if (tickerRef.current) window.clearInterval(tickerRef.current);
    tickerRef.current = window.setInterval(() => {
      // trigger rerender for countdown
      setLastAt((v) => (v == null ? v : v));
    }, 30_000);
    return () => {
      if (tickerRef.current) window.clearInterval(tickerRef.current);
      tickerRef.current = null;
    };
  }, [lastAt]);

  const startIdle = async () => {
    const { cycle } = dimsRef.current;
    const normalized = normalizeX(currentXRef.current, cycle);
    trackControls.set({ x: normalized });
    currentXRef.current = normalized;
    // запустим плавную бесконечную прокрутку; используем 0..-cycle и повтор
    await trackControls.start({
      x: [normalized, normalized - cycle],
      transition: { duration: 95, ease: "linear", repeat: Infinity }
    });
  };

  useEffect(() => {
    // автозапуск idle-вращения
    if (spinning) return;
    // После выпадения приза держим ленту статичной до конца кулдауна
    if (locked && prize) return;
    void startIdle();
    // важно: не останавливаем controls в cleanup, иначе при setSpinning(true)
    // cleanup может "убить" начавшуюся анимацию spin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, locked, prize]);

  useEffect(() => {
    return () => {
      trackControls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForDev = () => {
    try {
      window.localStorage.removeItem(LS_LAST_AT);
      window.localStorage.removeItem(LS_LAST_PRIZE);
      window.localStorage.removeItem(LS_HISTORY);
    } catch {}
    setLastAt(null);
    setPrize(null);
    setOpen(false);
    setSpinning(false);
    setHistory([]);
  };

  const spin = () => {
    if (spinning) return;
    if (locked) {
      setOpen(true);
      return;
    }

    const p = pickPrize();
    pendingPrizeRef.current = p;
    setSpinning(true);
    setOpen(false);

    const idx = track.findIndex((x) => x.title === p.title && x.kind === p.kind);
    const safeIdx = idx >= 0 ? idx : 0;

    // остановимся на карточке во "втором круге" и докрутим несколько циклов
    const { containerW, cardW, span, cycle } = dimsRef.current;
    const center = containerW / 2;
    const normalized = normalizeX(currentXRef.current, cycle);
    trackControls.set({ x: normalized });
    currentXRef.current = normalized;

    const mid = Math.floor(REPEATS / 2);
    const idxGlobal = mid * track.length + safeIdx;
    const posCenter = idxGlobal * span + cardW / 2;
    const extraCycles = 3;
    const targetX = center - posCenter - extraCycles * cycle;

    trackControls.stop();
    void trackControls.start({
      x: targetX,
      transition: { duration: 8, ease: [0.08, 0.92, 0.12, 1] }
    });

    const at = nowMs();
    setLastAt(at);
    try {
      window.localStorage.setItem(LS_LAST_AT, String(at));
    } catch {}

    if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = window.setTimeout(() => {
      const won = pendingPrizeRef.current;
      if (won) {
        setPrize(won);
        const entry: HistoryEntry = { at: nowMs(), title: won.title, kind: won.kind, emoji: won.emoji };
        setHistory((prev) => {
          const next = [entry, ...prev].slice(0, 100);
          try {
            window.localStorage.setItem(LS_LAST_PRIZE, JSON.stringify(won));
            window.localStorage.setItem(LS_HISTORY, JSON.stringify(next));
          } catch {}
          return next;
        });
      }
      setSpinning(false);
      setCelebrateKey((k) => k + 1);
      setOpen(true);
    }, 8_150);
  };

  return (
    <div className="w-full rounded-3xl border border-blush-100 bg-white/70 p-5 shadow-soft backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/55">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            РУЛЕТКА ДЛЯ ВИКИ
          </p>
          <h3 className="mt-2 text-pretty text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Крути один раз в 3 дня — получи “приз”
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Идеи для близости, игр и совместного времени.
          </p>
        </div>
        <button
          type="button"
          onClick={spin}
          disabled={spinning || locked}
          className="inline-flex items-center justify-center rounded-full border border-blush-200 bg-white/80 px-5 py-3 text-sm font-medium text-zinc-900 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-blush-300 hover:bg-white disabled:opacity-60 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:hover:bg-zinc-950"
        >
          {locked ? `Уже крутили • ${formatCountdown(lockedMs)}` : spinning ? "Крутим…" : "Крутить"}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-blush-100 bg-white/50 p-4 dark:border-zinc-800/70 dark:bg-zinc-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            <span className="font-medium text-zinc-800 dark:text-zinc-100">Варианты призов</span>{" "}
            — чтобы было честно и интересно.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-blush-100 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-700 shadow-soft backdrop-blur transition hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-950"
            >
              История призов
            </button>
            {process.env.NODE_ENV !== "production" ? (
              <button
                type="button"
                onClick={resetForDev}
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-amber-50/70 px-4 py-2 text-xs font-semibold text-amber-900 shadow-soft backdrop-blur transition hover:bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
              >
                Сбросить (тест)
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center justify-center rounded-full border border-blush-100 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-700 shadow-soft backdrop-blur transition hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:bg-zinc-950"
            >
              {showAll ? "Скрыть список" : "Показать список"}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showAll ? (
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {sortedByChance.map((p) => (
                <span
                  key={`${p.kind}-${p.title}`}
                  className={
                    p.kind === "gold"
                      ? "inline-flex items-center gap-1 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-soft dark:border-amber-500/40 dark:from-amber-500/10 dark:to-yellow-500/10 dark:text-amber-200"
                      : p.kind === "diamond"
                        ? "inline-flex items-center gap-1 rounded-full border border-sky-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-3 py-1 text-xs font-semibold text-sky-800 shadow-soft dark:border-sky-500/40 dark:from-sky-500/10 dark:via-indigo-500/10 dark:to-zinc-900/30 dark:text-sky-200"
                        : p.kind === "ruby"
                          ? "inline-flex items-center gap-1 rounded-full border border-rose-300 bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 px-3 py-1 text-xs font-semibold text-rose-800 shadow-soft dark:border-rose-500/40 dark:from-rose-500/15 dark:via-pink-500/10 dark:to-red-500/10 dark:text-rose-200"
                          : "inline-flex items-center rounded-full border border-blush-100 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:text-zinc-200"
                  }
                  title={p.subtitle ?? p.title}
                >
                  {p.kind === "gold" ? "✨" : p.kind === "diamond" ? "💎" : p.kind === "ruby" ? "♦" : null}
                  <span aria-hidden className="mr-1">
                    {p.emoji}
                  </span>
                  {p.title}
                  <span className={p.kind === "gold" ? "ml-2 text-[10px] font-semibold opacity-80" : "ml-2 text-[10px] opacity-70"}>
                    {chancePct(p, weightSum)}%
                  </span>
                </span>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-6 grid gap-4 md:gap-6 md:grid-cols-[minmax(0,1fr)_380px] md:items-start">
        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Карусель призов</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Маркер по центру показывает итог</p>
          </div>

          <div
            ref={containerRef}
            className="relative mt-3 overflow-hidden rounded-3xl border border-blush-100 bg-white/60 p-3 sm:p-4 shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950/30"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white/80 to-transparent dark:from-zinc-950/60" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white/80 to-transparent dark:from-zinc-950/60" />

            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[2px] -translate-x-1/2 rounded-full bg-blush-500/80" />

            <motion.div
              className="flex items-stretch gap-3 will-change-transform"
              animate={trackControls}
              onUpdate={(latest) => {
                if (typeof latest.x === "number") currentXRef.current = latest.x;
              }}
            >
              {Array.from({ length: REPEATS }).flatMap(() => track).map((p, i) => (
                <div
                  key={`${p.kind}-${p.title}-${i}`}
                  ref={i === 0 ? cardRef : undefined}
                  className={p.theme.card}
                  style={{ width: isMobile ? "min(78vw, 18rem)" : undefined }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={p.theme.badge}>
                      {p.kind === "gold"
                        ? "ЗОЛОТО"
                        : p.kind === "diamond"
                          ? "БРИЛЛИАНТ"
                          : p.kind === "ruby"
                            ? "РУБИН • 18+"
                          : p.kind === "sex"
                            ? "18+"
                            : p.kind.toUpperCase()}
                      <span className="ml-2 text-[10px] opacity-70">{chancePct(p, weightSum)}%</span>
                    </p>
                    <span className="text-xl leading-none" aria-hidden>
                      {p.emoji}
                    </span>
                  </div>

                  <p className={p.theme.title}>
                    {p.kind === "gold" ? "✨ " : ""}
                    {p.title}
                  </p>
                  {p.subtitle ? (
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {p.subtitle}
                    </p>
                  ) : null}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="rounded-3xl border border-blush-100 bg-white/60 p-5 text-zinc-700 dark:border-zinc-800/70 dark:bg-zinc-950/30 dark:text-zinc-200">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Нажми “Крутить”. Если 3 дня ещё не прошли — покажем прошлый приз.
          </p>
          {spinning ? (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Крутим… приз появится после остановки.</p>
          ) : prize ? (
            <div className="mt-4 rounded-2xl border border-blush-100 bg-white/70 p-4 dark:border-zinc-800/70 dark:bg-zinc-950/40">
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                ПРИЗ
              </p>
              <p
                className={
                  prize.kind === "gold"
                    ? "mt-2 text-lg font-semibold text-amber-800 dark:text-amber-200"
                    : "mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
                }
              >
                {prize.kind === "gold" ? "✨ " : ""}
                {prize.title}
              </p>
              {prize.subtitle ? (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{prize.subtitle}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Пока пусто. Крути!</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {historyOpen ? (
          <motion.div
            className="fixed inset-0 z-[74] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-white/55 backdrop-blur dark:bg-black/55"
              aria-label="Закрыть"
              onClick={() => setHistoryOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-blush-100 bg-white p-6 shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950"
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                ИСТОРИЯ ПРИЗОВ
              </p>
              <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Все выигрыши Вики</p>

              <div className="mt-4 overflow-hidden rounded-2xl border border-blush-100 dark:border-zinc-800/70">
                <div className="grid grid-cols-[160px_1fr] bg-white/70 text-xs font-medium text-zinc-600 dark:bg-zinc-950/30 dark:text-zinc-300">
                  <div className="px-4 py-3">Дата</div>
                  <div className="px-4 py-3">Приз</div>
                </div>
                <div className="max-h-[46vh] overflow-auto bg-white/50 text-sm dark:bg-zinc-950/20">
                  {history.length ? (
                    history.map((h) => (
                      <div key={`${h.at}-${h.title}`} className="grid grid-cols-[160px_1fr] border-t border-blush-100 dark:border-zinc-800/70">
                        <div className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">
                          {new Date(h.at).toLocaleString()}
                        </div>
                        <div className="px-4 py-3 text-zinc-800 dark:text-zinc-100">
                          <span className="mr-2" aria-hidden>
                            {h.emoji}
                          </span>
                          {h.title}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400">Пока нет выигрышей.</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setHistoryOpen(false)}
                  className="rounded-full border border-blush-100 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-700 backdrop-blur transition hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:hover:bg-zinc-950"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open && prize ? (
          <motion.div
            className="fixed inset-0 z-[75] grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-white/55 backdrop-blur dark:bg-black/55"
              aria-label="Закрыть"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-blush-100 bg-white p-6 shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950"
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Fireworks key={celebrateKey} isMobile={isMobile} />
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                ВИКА, ТВОЙ ПРИЗ
              </p>
              <p
                className={
                  prize.kind === "gold"
                    ? "mt-2 text-pretty text-2xl font-semibold text-amber-800 dark:text-amber-200"
                    : "mt-2 text-pretty text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
                }
              >
                {prize.kind === "gold" ? "✨ " : ""}
                {prize.title}
              </p>
              {prize.subtitle ? (
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {prize.subtitle}
                </p>
              ) : null}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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

function Fireworks({ isMobile }: { isMobile: boolean }) {
  const particles = useMemo<FireParticle[]>(() => {
    const colors = ["#ff3b84", "#ff9fbe", "#ffd166", "#4cc9f0", "#b5179e", "#9b5de5"];
    const bursts = [
      { x: 18, y: 18 },
      { x: 80, y: 22 },
      { x: 55, y: 45 }
    ];
    const out: FireParticle[] = [];
    let n = 0;
    for (let b = 0; b < bursts.length; b += 1) {
      const base = bursts[b]!;
      const count = isMobile ? 10 : 16;
      for (let i = 0; i < count; i += 1) {
        const a = (Math.PI * 2 * i) / count;
        const r = 22 + Math.random() * 34;
        out.push({
          id: `p-${b}-${i}-${Math.random().toString(16).slice(2)}`,
          x: base.x,
          y: base.y,
          dx: Math.cos(a) * r,
          dy: Math.sin(a) * r,
          size: 3 + Math.random() * 3,
          delay: b * 0.18 + Math.random() * 0.06,
          duration: 0.8 + Math.random() * 0.4,
          color: colors[(n++ + b) % colors.length]!
        });
      }
    }
    return out;
  }, [isMobile]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.7 }}
          animate={{ opacity: [0, 1, 0], x: p.dx, y: p.dy, scale: [0.7, 1, 0.9] }}
          transition={{ delay: p.delay, duration: p.duration, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function normalizeX(x: number, cycle: number) {
  if (!cycle) return x;
  const mod = ((x % cycle) + cycle) % cycle; // 0..cycle
  return -mod; // -cycle..0
}

