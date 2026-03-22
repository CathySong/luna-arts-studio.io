"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; color: string;
    }[] = [];

    const colors = ["#c9a96e", "#e8c99a", "#f5f0e8", "#7a8c7e"];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink">
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,169,110,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 70%, rgba(122,140,126,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Floating canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Decorative vertical lines */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />
      <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <div className="h-px w-12 bg-gold/50" />
          <span className="font-mono text-[10px] tracking-ultra uppercase text-gold/70" style={{ letterSpacing: "0.4em" }}>
            Est. 2020 · Fine Art & Creative Education
          </span>
          <div className="h-px w-12 bg-gold/50" />
        </div>

        {/* Main headline */}
        <h1
          className="font-display font-light leading-none mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <span className="block text-[clamp(4rem,12vw,10rem)] text-parchment tracking-tight">
            Luna
          </span>
          <span
            className="block text-[clamp(1.2rem,4vw,3.5rem)] tracking-ultra text-gold/80 font-light italic"
            style={{ letterSpacing: "0.3em" }}
          >
            Art Studio
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-body text-base md:text-lg text-parchment/50 font-light max-w-xl mx-auto leading-relaxed mb-14 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
        >
          Where imagination meets craft — a sanctuary for artists at every stage of their creative journey.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <a
            href="#gallery"
            className="group px-10 py-4 bg-gold text-ink font-body text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 flex items-center gap-3"
          >
            Explore Gallery
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
          <a
            href="#classes"
            className="px-10 py-4 border border-parchment/20 text-parchment/70 font-body text-xs tracking-widest uppercase hover:border-gold/50 hover:text-gold transition-all duration-300"
          >
            View Classes
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/50">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent animate-float" />
      </div>
    </section>
  );
}
