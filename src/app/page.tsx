"use client";

import { HeartConfettiButton } from "@/components/HeartConfetti";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { BackgroundBlush } from "@/components/BackgroundBlush";
import { BackgroundHearts } from "@/components/BackgroundHearts";
import { BackgroundEmojiHearts } from "@/components/BackgroundEmojiHearts";
import { SecretSurprise } from "@/components/SecretSurprise";
import { ReasonsJar } from "@/components/ReasonsJar";
import { PinGate } from "@/components/PinGate";
import { LazyVideo } from "@/components/LazyVideo";
import { LoveClock } from "@/components/LoveClock";

const photos = [
  { src: "/vika/vika-1.jpg", alt: "Вика" },
  { src: "/vika/vika-2.jpg", alt: "Вика" },
  { src: "/vika/vika-3.jpg", alt: "Вика" },
  { src: "/vika/vika-5.jpg", alt: "Вика" },
  { src: "/vika/vika-6.jpg", alt: "Вика" },
  { src: "/vika/vika-7.jpg", alt: "Вика" }
];

export default function Page() {
  return (
    <PinGate>
      <main className="relative min-h-dvh bg-gradient-to-b from-white via-blush-50 to-white">
        <BackgroundBlush />
        <BackgroundHearts />
        <BackgroundEmojiHearts />
        <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-5 sm:pt-12 md:pb-20 md:pt-16">
          <header className="flex flex-col items-start gap-6 md:flex-row md:items-start md:justify-between">
            <div className="vika-intro max-w-2xl">
              <p className="text-xs font-medium tracking-[0.2em] text-zinc-500">
                ОТКРЫТКА ДЛЯ ВИКИ
              </p>
              <h1 className="mt-3 text-balance text-4xl font-semibold leading-tight text-zinc-900 sm:text-[44px] md:text-5xl">
                Вика, я от тебя без ума
              </h1>
              <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-600 md:text-lg">
                Ты — мой дом, мое спокойствие и мой самый красивый мир. Спасибо тебе за
                улыбки, тепло и за то, что ты просто есть. Я рядом. Всегда.
              </p>
              <div className="mt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="transition-transform hover:-translate-y-0.5 active:scale-[0.98]">
                    <HeartConfettiButton
                      label="Нажми, если хочешь еще любви"
                      burstLabel="Даня → Вика"
                    />
                  </div>
                  <a
                    href="https://t.me/griegafem"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-blush-200 bg-white/70 px-5 py-3 text-sm font-medium text-zinc-900 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-blush-300 hover:bg-white active:scale-[0.98]"
                  >
                    Напиши Дане
                    <span className="ml-2 text-xs text-zinc-500">@griegafem</span>
                  </a>
                </div>

                <div className="mt-3 flex sm:mt-4 sm:justify-end">
                  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-blush-100 bg-white/70 px-5 py-3 text-sm text-zinc-600 backdrop-blur">
                    с любовью, Даня
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-4 md:w-auto md:items-end">
              <LoveClock />
              <div className="w-full rounded-3xl border border-blush-100 bg-white/80 p-5 shadow-soft backdrop-blur sm:max-w-sm md:w-[360px]">
              <p className="text-sm text-zinc-700">
                Мини-обещание:
                <span className="block pt-2 text-zinc-600">
                  беречь тебя, поддерживать, слушать и делать твои дни чуть-чуть
                  светлее.
                </span>
              </p>
              <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-blush-200 to-transparent" />
              <p className="mt-4 text-sm text-zinc-600">
                P.S. Нажми на кнопку — полетят сердечки.
              </p>
              </div>
            </div>
          </header>

          <section className="mt-12 md:mt-14">
            <h2 className="text-lg font-semibold text-zinc-900">Немного Вики (самой красивой)</h2>

            <div className="mt-6">
              <PhotoCarousel photos={photos} />
            </div>
          </section>

          <section className="mt-12 md:mt-14">
            <h2 className="text-lg font-semibold text-zinc-900">Видео с Викой</h2>

            <div className="mt-4 overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-soft">
              <LazyVideo src="/vika/vika-video.mp4" />
            </div>
          </section>

          <section className="mt-12 md:mt-14">
            <h2 className="text-lg font-semibold text-zinc-900">Ещё кое-что</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Небольшой сюрприз внутри. Открой, когда захочешь.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
              <SecretSurprise />
              <ReasonsJar />
            </div>
          </section>

          <footer className="mt-14 md:mt-16">
            <div className="rounded-3xl border border-blush-100 bg-white/70 p-6 text-sm text-zinc-600 shadow-soft backdrop-blur">
              <p className="text-zinc-700">
                Вика, если ты читаешь это — знай: ты невероятная. Я люблю тебя всем
                сердцем.
              </p>
              <p className="mt-3">
                <span className="text-zinc-500">Даня</span>
                <span className="mx-2 text-blush-400">•</span>
                <span className="text-zinc-500">одностраничное признание</span>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </PinGate>
  );
}
