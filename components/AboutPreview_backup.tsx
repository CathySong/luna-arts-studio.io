"use client";
import { useInView } from "@/lib/useInView";
import { useRef } from "react";

export default function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });

  return (
    <section id="about" className="py-32 bg-ink relative overflow-hidden">
      {/* Decorative numeral */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-parchment/[0.02] leading-none select-none pointer-events-none pr-4">
        01
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left: image collage */}
        <div
          ref={ref}
          className={`relative transition-all duration-1000 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          <div className="relative aspect-[4/5] bg-gradient-to-br from-parchment/10 to-sage/10 border border-gold/10 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(122,140,126,0.06) 50%, rgba(196,120,90,0.05) 100%)",
              }}
            />
            {/* Placeholder artwork pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 500">
              <circle cx="200" cy="200" r="120" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="80" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
              <circle cx="200" cy="200" r="40" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
              <line x1="80" y1="200" x2="320" y2="200" stroke="#c9a96e" strokeWidth="0.5" />
              <line x1="200" y1="80" x2="200" y2="320" stroke="#c9a96e" strokeWidth="0.5" />
              <ellipse cx="200" cy="350" rx="60" ry="80" fill="none" stroke="#7a8c7e" strokeWidth="0.5" opacity="0.6" />
              <path d="M 80 400 Q 150 350 200 380 Q 250 350 320 400" fill="none" stroke="#c4785a" strokeWidth="0.5" opacity="0.8" />
            </svg>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display italic text-2xl text-gold/70 font-light leading-snug">
                "Art is the language of the soul"
              </p>
            </div>
          </div>

          {/* Floating accent card */}
          <div className="absolute -bottom-6 -right-6 bg-ink border border-gold/20 p-6 w-44">
            <p className="font-mono text-[9px] tracking-widest uppercase text-gold/60 mb-2">Founded</p>
            <p className="font-display text-4xl text-parchment font-light">2020</p>
            <p className="font-mono text-[9px] tracking-wide text-parchment/40 mt-1">New Jersey</p>
          </div>
        </div>

        {/* Right: text */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-gold/60" style={{ letterSpacing: "0.35em" }}>
              Our Story
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl font-light text-parchment leading-tight mb-8">
            A Space to{" "}
            <span className="italic text-gold">Create,</span>
            <br />
            Explore & Grow
          </h2>

          <p className="font-body text-parchment/50 leading-relaxed mb-6 font-light">
            Luna Art Studio was born from a simple belief: that creativity is not a gift reserved for a few,
            but a language anyone can learn. Nestled in the heart of New Jersey, our studio offers a warm,
            inspiring environment where students of all levels find their voice through paint, charcoal, and imagination.
          </p>
          <p className="font-body text-parchment/50 leading-relaxed font-light">
            Led by working artists with decades of combined experience, our classes blend technical rigor
            with expressive freedom — so whether you are picking up a brush for the first time or refining
            a lifelong practice, you will find a home here.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gold/10">
            {[
              { n: "500+", label: "Students" },
              { n: "12", label: "Class Types" },
              { n: "5 yrs", label: "Experience" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl text-gold font-light">{s.n}</p>
                <p className="font-mono text-[9px] tracking-widest uppercase text-parchment/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
