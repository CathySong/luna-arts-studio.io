"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";

const classes = [
  {
    id: "01",
    title: "Foundation Drawing",
    subtitle: "For Beginners",
    description:
      "Master the fundamentals — line, form, value, and perspective. A nurturing entry point into the world of fine art.",
    duration: "10 weeks",
    level: "Beginner",
    color: "#c9a96e",
  },
  {
    id: "02",
    title: "Oil Painting",
    subtitle: "Intermediate Studio",
    description:
      "Explore color mixing, impasto techniques, and classical glazing methods. Work from still life and reference.",
    duration: "12 weeks",
    level: "Intermediate",
    color: "#c4785a",
  },
  {
    id: "03",
    title: "Watercolor & Ink",
    subtitle: "All Levels",
    description:
      "Embrace the luminous, unpredictable beauty of watercolor. Learn wet-on-wet, dry brush, and ink linework.",
    duration: "8 weeks",
    level: "All Levels",
    color: "#7a8c7e",
  },
  {
    id: "04",
    title: "Figure Drawing",
    subtitle: "Life Drawing Session",
    description:
      "Weekly live model sessions. Develop gesture, proportion, and expressive mark-making with the human form.",
    duration: "Ongoing",
    level: "Intermediate+",
    color: "#9ba8b0",
  },
  {
    id: "05",
    title: "Acrylic Abstraction",
    subtitle: "Expressive Studio",
    description:
      "Move beyond representation into color, texture, and emotion. Explore process-driven, intuitive painting.",
    duration: "8 weeks",
    level: "All Levels",
    color: "#d4845a",
  },
  {
    id: "06",
    title: "Kids Art Camp",
    subtitle: "Ages 6–14",
    description:
      "A joyful introduction to art-making for young creatives. Drawing, painting, collage, and sculpture projects.",
    duration: "Seasonal",
    level: "Youth",
    color: "#b0d4b8",
  },
];

export default function ClassesPreview() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { threshold: 0.3 });

  return (
    <section id="classes" className="py-32 relative overflow-hidden" style={{ background: "#0b0a09" }}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-gray-darkest/[0.02] leading-none select-none pointer-events-none pl-4">
        03
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={titleRef}
          className={`mb-20 transition-all duration-1000 ${titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60" style={{ letterSpacing: "0.35em" }}>
              Creative Education
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
              Our <span className="italic text-accent-warm">Classes</span>
            </h2>
            <p className="font-body text-gray max-w-sm font-light leading-relaxed text-sm">
              Small class sizes. Expert instruction. A supportive community of fellow artists.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-lightest">
          {classes.map((cls, i) => (
            <ClassCard key={cls.id} cls={cls} delay={i * 80} />
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-14 border-t border-gray-lightest">
          <div>
            <p className="font-body text-gray-darkest/60 font-light mb-1">
              Not sure which class is right for you?
            </p>
            <p className="font-body text-gray-darker text-sm font-light">
              We offer free 15-minute consultations with our instructors.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 px-8 py-3 border border-gray-light text-accent-warm font-body text-xs tracking-widest uppercase hover:bg-accent-warm hover:text-white transition-all duration-300"
          >
            Book a Consult
          </a>
        </div>
      </div>
    </section>
  );
}

function ClassCard({ cls, delay }: { cls: (typeof classes)[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="group bg-white p-8 hover:bg-[#111009] transition-all duration-500 cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, background 0.3s ease`,
      }}
    >
      <div className="flex items-start justify-between mb-8">
        <span
          className="font-display text-6xl font-light leading-none"
          style={{ color: cls.color, opacity: 0.2 }}
        >
          {cls.id}
        </span>
        <span
          className="font-mono text-[8px] tracking-widest uppercase px-2.5 py-1 border"
          style={{ color: cls.color, borderColor: `${cls.color}40` }}
        >
          {cls.level}
        </span>
      </div>

      <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">
        {cls.subtitle}
      </p>
      <h3 className="font-display text-2xl text-gray-darkest font-light mb-4 group-hover:text-accent-warm transition-colors duration-300">
        {cls.title}
      </h3>
      <p className="font-body text-gray text-sm leading-relaxed font-light mb-6">
        {cls.description}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-gray-lightest">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-accent-warm/50" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker">
            {cls.duration}
          </span>
        </div>
        <span
          className="font-mono text-[9px] tracking-widest uppercase transition-colors duration-300 group-hover:opacity-100 opacity-0"
          style={{ color: cls.color }}
        >
          Learn more →
        </span>
      </div>
    </div>
  );
}
