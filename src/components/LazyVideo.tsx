"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  className?: string;
};

export function LazyVideo({ src, className }: Props) {
  const [load, setLoad] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setLoad(true);
      },
      { rootMargin: "120px", threshold: 0.01 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      {load ? (
        <video
          className="h-auto w-full"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src={src}
        />
      ) : (
        <div
          className="aspect-video w-full animate-pulse rounded-3xl bg-blush-50/80 dark:bg-zinc-900/40"
          aria-hidden
        />
      )}
    </div>
  );
}
