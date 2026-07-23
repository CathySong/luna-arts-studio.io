"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { classTypes } from "@/config/classes";

export default function ClassesPreview() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { threshold: 0.3 });

  return (
    <section id="classes" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          ref={titleRef}
          className={`mb-16 md:mb-20 transition-all duration-1000 ${
            titleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span
              className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60"
              style={{ letterSpacing: "0.35em" }}
            >
              Creative Education
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
                Our <span className="italic text-accent-warm">Classes</span>
              </h2>
              <p className="font-body text-gray-dark mt-4 max-w-xl font-light leading-relaxed">
                Four focused class types for Fall enrollment. Drawing and oil painting run 90 minutes.
                Creative and handcraft classes run 60 minutes.
              </p>
            </div>
            <p className="font-body text-gray-dark max-w-xs font-light leading-relaxed text-sm">
              Small class sizes. Expert instruction. A warm studio community for young artists and beginners.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {classTypes.map((cls, i) => (
            <ClassCard key={cls.id} cls={cls} delay={i * 80} />
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-14 border-t border-gray-lightest">
          <div>
            <p className="font-body text-gray-darkest/70 font-light mb-1">
              Not sure which class is right for you?
            </p>
            <p className="font-body text-gray-darker text-sm font-light">
              Tell us your age, experience, and goals. We will help place you in the best fit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="#fall-enrollment"
              className="px-8 py-3 bg-gray-darkest text-white font-body text-xs tracking-widest uppercase hover:bg-accent-warm transition-all duration-300"
            >
              View Fall Schedule
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-gray-light text-accent-warm font-body text-xs tracking-widest uppercase hover:bg-accent-warm hover:text-white transition-all duration-300"
            >
              Ask Luna
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassCard({
  cls,
  delay,
}: {
  cls: (typeof classTypes)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className="group relative border border-gray-lightest bg-white p-8 md:p-10 hover:border-accent-warm/35 hover:shadow-sm transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: cls.color }} />

      <div className="flex items-start justify-between gap-4 mb-8">
        <span
          className="font-display text-5xl md:text-6xl font-light leading-none"
          style={{ color: cls.color, opacity: 0.22 }}
        >
          {cls.number}
        </span>
        <div className="flex flex-col items-end gap-2">
          <span
            className="font-mono text-[8px] tracking-widest uppercase px-2.5 py-1 border"
            style={{ color: cls.color, borderColor: `${cls.color}40` }}
          >
            {cls.level}
          </span>
          <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker">
            {cls.durationLabel}
          </span>
        </div>
      </div>

      <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">
        {cls.subtitle}
      </p>
      <h3 className="font-display text-2xl md:text-3xl text-gray-darkest font-light mb-1 group-hover:text-accent-warm transition-colors duration-300">
        {cls.title}
      </h3>
      <p className="font-body text-sm text-gray-darker mb-5 font-light">{cls.titleZh}</p>
      <p className="font-body text-gray-dark text-sm leading-relaxed font-light mb-8">
        {cls.description}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-gray-lightest">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cls.color }} />
          <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker">
            Offered Mon–Sat in Fall
          </span>
        </div>
        <a
          href="#fall-enrollment"
          className="font-mono text-[9px] tracking-widest uppercase text-accent-warm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          See schedule
        </a>
      </div>
    </div>
  );
}
