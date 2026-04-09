"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PhotoStrip({
  photos
}: {
  photos: { src: string; alt: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {photos.map((p, idx) => (
        <motion.div
          key={p.src}
          className="relative overflow-hidden rounded-2xl border border-blush-100 bg-white shadow-soft"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              priority={idx < 2}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

