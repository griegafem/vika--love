"use client";

import Link from "next/link";
import { BackgroundBlush } from "@/components/BackgroundBlush";
import { BackgroundHearts } from "@/components/BackgroundHearts";
import { BackgroundEmojiHearts } from "@/components/BackgroundEmojiHearts";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PinGate } from "@/components/PinGate";
import { ThemeToggle } from "@/components/ThemeToggle";
import { istanbulPhotos } from "@/lib/media";

export default function IstanbulPage() {
  return (
    <PinGate>
      <main className="relative min-h-dvh bg-gradient-to-b from-white via-blush-50 to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
        <BackgroundBlush />
        <BackgroundHearts />
        <BackgroundEmojiHearts />

        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-5 sm:pt-12 md:pb-20 md:pt-16">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">АЛЬБОМ</p>
              <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Стамбул <span className="ml-2 align-middle">🇹🇷</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                Все фотографии по порядку. Нажми на любую, чтобы открыть крупнее.
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <Link
                href="/media"
                className="inline-flex items-center justify-center rounded-full border border-blush-200 bg-white/70 px-4 py-2 text-xs font-medium text-zinc-800 shadow-soft backdrop-blur transition hover:border-blush-300 hover:bg-white dark:border-zinc-800/80 dark:bg-zinc-900/55 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                ← Назад к медиа
              </Link>
              <ThemeToggle />
            </div>
          </header>

          <section className="mt-10 md:mt-12">
            <PhotoGallery photos={istanbulPhotos} />
          </section>
        </div>
      </main>
    </PinGate>
  );
}

