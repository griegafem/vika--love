"use client";

import { motion } from "framer-motion";

export function BackgroundBlush() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blush-200/40 blur-3xl"
        animate={{ y: [0, 26, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -left-24 h-[520px] w-[520px] rounded-full bg-blush-100/70 blur-3xl"
        animate={{ x: [0, 28, 0], y: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-160px] top-[25%] h-[440px] w-[440px] rounded-full bg-white/70 blur-3xl"
        animate={{ x: [0, -22, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,59,132,0.08),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,59,132,0.06),transparent_40%),radial-gradient(circle_at_50%_95%,rgba(255,59,132,0.05),transparent_50%)]" />
    </div>
  );
}

