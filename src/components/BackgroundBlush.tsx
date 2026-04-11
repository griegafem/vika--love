export function BackgroundBlush() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="vika-blush-orb vika-blush-orb-a absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blush-200/40 blur-3xl"
        aria-hidden
      />
      <div
        className="vika-blush-orb vika-blush-orb-b absolute -bottom-24 -left-24 h-[520px] w-[520px] rounded-full bg-blush-100/70 blur-3xl"
        aria-hidden
      />
      <div
        className="vika-blush-orb vika-blush-orb-c absolute right-[-160px] top-[25%] h-[440px] w-[440px] rounded-full bg-white/70 blur-3xl"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,59,132,0.08),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,59,132,0.06),transparent_40%),radial-gradient(circle_at_50%_95%,rgba(255,59,132,0.05),transparent_50%)]" />
    </div>
  );
}
