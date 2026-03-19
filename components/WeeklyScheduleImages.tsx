"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import Image from "next/image";

const scheduleImages = [
  {
    id: 1,
    title: "Monday Schedule",
    description: "Start your week with creative inspiration",
    image: "/schedule-images/luna-schedule1.jpg",
    day: "Monday",
    focus: "Foundation & Drawing"
  },
  {
    id: 2,
    title: "Tuesday Schedule",
    description: "Explore watercolor and figure drawing techniques",
    image: "/schedule-images/luna-schedule2.jpg",
    day: "Tuesday",
    focus: "Watercolor & Figure"
  },
  {
    id: 3,
    title: "Wednesday Schedule",
    description: "Youth programs and foundation classes",
    image: "/schedule-images/luna-schedule3.jpg",
    day: "Wednesday",
    focus: "Youth & Foundation"
  },
  {
    id: 4,
    title: "Thursday Schedule",
    description: "Oil painting mastery and watercolor sessions",
    image: "/schedule-images/luna-schedule4.jpg",
    day: "Thursday",
    focus: "Oil & Watercolor"
  },
  {
    id: 5,
    title: "Weekend Schedule",
    description: "Extended hours for weekend creativity",
    image: "/schedule-images/luna-schedule5.jpg",
    day: "Friday-Sunday",
    focus: "Weekend Workshops"
  }
];

export default function WeeklyScheduleImages() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <section className="py-32 bg-ink relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-parchment/[0.02] leading-none select-none pointer-events-none pl-4">
        03
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-gold/60" style={{ letterSpacing: "0.35em" }}>
              Visual Schedule
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-parchment leading-tight">
            Weekly <span className="italic text-gold">Visual</span> Guide
          </h2>
          <p className="font-body text-parchment/50 text-lg mt-6 max-w-2xl leading-relaxed font-light">
            Browse our beautifully designed weekly schedules. Each day has its own creative focus and 
            specialized programming to match your artistic journey.
          </p>
        </div>

        {/* Schedule Images Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scheduleImages.slice(0, 3).map((item) => (
            <ScheduleImageCard key={item.id} item={item} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {scheduleImages.slice(3).map((item) => (
            <ScheduleImageCard key={item.id} item={item} />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 pt-8 border-t border-gold/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl text-parchment font-light mb-3">How to Read Our Visual Schedules</h3>
              <p className="font-body text-parchment/40 text-sm font-light max-w-2xl">
                Each schedule is color-coded by class type and includes instructor details, 
                skill levels, and real-time availability. Look for the spot indicators to 
                see current openings.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Drawing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-clay" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Painting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sage" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Watercolor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400/60" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Youth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleImageCard({ item }: { item: typeof scheduleImages[0] }) {
  return (
    <div className="group relative overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-500">
      {/* Image Container */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-ink/50">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/0 to-ink/0" />
        
        {/* Day Badge */}
        <div className="absolute top-4 left-4">
          <span className="font-mono text-[8px] tracking-widest uppercase bg-ink/90 text-gold px-3 py-1.5 border border-gold/30">
            {item.day}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-ink">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl text-parchment font-light">{item.title}</h3>
          <div className="w-2 h-2 rounded-full bg-gold group-hover:scale-150 transition-transform duration-300" />
        </div>
        
        <p className="font-body text-parchment/50 text-sm mb-4 font-light leading-relaxed">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gold/5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-gold/60">
            Focus: {item.focus}
          </span>
          <button className="font-mono text-[8px] tracking-widest uppercase text-parchment/40 hover:text-gold transition-colors flex items-center gap-1">
            View Details
            <span className="text-gold group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-all duration-500 pointer-events-none" />
    </div>
  );
}