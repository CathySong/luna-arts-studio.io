"use client";
import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/lib/useInView";

const highlights = [
  {
    title: "Fine art foundation",
    body: "University of Vienna graduate with years of drawing, painting, and studio practice.",
  },
  {
    title: "Hands-on craft",
    body: "Fiber arts, quilting, sewing, and mixed media that deepen creative confidence.",
  },
  {
    title: "Student-centered teaching",
    body: "A warm studio where every learner builds skill, joy, and a personal art voice.",
  },
];

export default function FounderBio() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.15 });

  return (
    <section id="about-luna" className="py-28 md:py-32 bg-white-warm relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div className="lg:col-span-5">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="absolute -inset-3 md:-inset-4 border border-accent-warm/30 pointer-events-none" />
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-lightest shadow-sm">
                <Image
                  src="/images/luna-founder.jpg"
                  alt="Luna, founder and instructor of Luna Art Studio"
                  fill
                  className="object-cover object-top"
                  quality={92}
                  sizes="(max-width: 768px) 90vw, 40vw"
                  priority={false}
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl text-gray-darkest font-light tracking-wide">
                    Luna
                  </p>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent-warm mt-1">
                    Founder and Instructor
                  </p>
                </div>
                <p className="font-body text-xs text-gray-darker text-right leading-relaxed max-w-[10rem]">
                  Luna Art Studio
                  <br />
                  Warren, New Jersey
                </p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent-warm/60" />
              <span
                className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/70"
                style={{ letterSpacing: "0.35em" }}
              >
                About Luna
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-gray-darkest leading-tight mb-6">
              Meet the artist guiding{" "}
              <span className="italic text-accent-warm">your creative path</span>
            </h2>

            <div className="space-y-5 font-body text-gray-dark leading-relaxed font-light max-w-2xl">
              <p>
                Hello. I am Luna, founder and instructor of Luna Art Studio. Art has been a lifelong
                passion, and teaching is how I share that passion with every student who walks into
                our studio.
              </p>
              <p>
                After graduating from the University of Vienna, I continued building my practice
                through years of drawing, painting, and creative exploration. Alongside fine art, I
                work in fiber arts, quilting, sewing, mixed media, and other handcrafted forms.
                Creativity grows through both artistic skill and hands-on making.
              </p>
              <p>
                My vision is simple and steady: help every student build confidence, develop
                creativity, and discover the joy of making art in a warm, inspiring, and supportive
                environment. Whether you are holding a brush for the first time or returning to a
                lifelong craft, you will be guided with care, clarity, and encouragement.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-10">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="border border-gray-lightest bg-white p-5 h-full"
                >
                  <p className="font-display text-lg text-gray-darkest font-light mb-2">
                    {item.title}
                  </p>
                  <p className="font-body text-sm text-gray-dark leading-relaxed font-light">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#fall-enrollment"
                className="inline-flex items-center justify-center px-7 py-3 bg-gray-darkest text-white font-body text-xs tracking-widest uppercase hover:bg-accent-warm transition-colors duration-300"
              >
                Enroll this fall
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-3 border border-gray-darkest/20 text-gray-darkest font-body text-xs tracking-widest uppercase hover:border-accent-warm hover:text-accent-warm transition-colors duration-300"
              >
                Ask Luna a question
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
