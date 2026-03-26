"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* 照片背景 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/hero-background.jpg"
          alt="Luna Art Studio background - Art is the language of soul"
          fill
          priority
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
        {/* 叠加层 - 增强文字可读性（更浅的叠加层） */}
        <div className="absolute inset-0 bg-white/30" />
      </div>

      {/* 装饰性垂直线条 */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-warm/20 to-transparent hidden lg:block z-10" />
      <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-warm/10 to-transparent hidden lg:block z-10" />

      {/* 内容 */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* 眉标 */}
        <div className="flex items-center justify-center gap-4 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <div className="h-px w-12 bg-accent-warm/50" />
          <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/70" style={{ letterSpacing: "0.4em" }}>
            Est. 2020 · Fine Art & Creative Education
          </span>
          <div className="h-px w-12 bg-accent-warm/50" />
        </div>

        {/* 主标题 */}
        <h1
          className="font-display font-light leading-none mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <span className="block text-[clamp(4rem,12vw,10rem)] text-white tracking-tight">
            Luna
          </span>
          <span
            className="block text-[clamp(1.2rem,4vw,3.5rem)] tracking-ultra text-accent-warm/80 font-light italic"
            style={{ letterSpacing: "0.3em" }}
          >
            Art Studio
          </span>
        </h1>

        {/* 副标题 */}
        <p
          className="font-body text-base md:text-lg text-white/70 font-light max-w-xl mx-auto leading-relaxed mb-14 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
        >
          Where imagination meets craft — a sanctuary for artists at every stage of their creative journey.
        </p>

        {/* 行动按钮 */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <a
            href="#gallery"
            className="group px-10 py-4 bg-accent-warm text-white font-body text-xs tracking-widest uppercase font-medium hover:bg-accent-warm/90 transition-all duration-300 flex items-center gap-3"
          >
            Explore Gallery
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
          <a
            href="#classes"
            className="px-10 py-4 border border-white/30 text-white/70 font-body text-xs tracking-widest uppercase hover:border-accent-warm/50 hover:text-accent-warm transition-all duration-300"
          >
            View Classes
          </a>
        </div>
      </div>

      {/* 滚动指示器 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-10">
        <span className="font-mono text-[9px] tracking-widest uppercase text-white/50">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-accent-warm/60 to-transparent animate-float" />
      </div>
    </section>
  );
}