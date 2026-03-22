"use client";
import { useInView } from "@/lib/useInView";
import { useRef } from "react";
import Image from "next/image";

export default function AboutPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.2 });

  return (
    <section id="about" className="py-32 bg-ink relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
        <div
          ref={ref}
          className={`relative transition-all duration-1000 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/backgrounds/about-background.jpg"
              alt="Luna Art Studio creative space"
              fill
              className="object-cover"
              quality={95}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Right: 文字内容 - 保持不变 */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gold/60" />
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