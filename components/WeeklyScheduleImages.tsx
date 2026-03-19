"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";

const weeklySchedules = [
  {
    id: 1,
    day: "Monday",
    focus: "Foundation & Drawing",
    description: "Start your week with solid foundational skills",
    classes: [
      { time: "10:00 AM", name: "Foundation Drawing", instructor: "Ms. Chen", level: "Beginner", spots: 4 },
      { time: "6:30 PM", name: "Oil Painting", instructor: "Mr. Rivera", level: "Intermediate", spots: 2 },
    ],
    color: "#c9a96e"
  },
  {
    id: 2,
    day: "Tuesday",
    focus: "Watercolor & Figure",
    description: "Explore fluid mediums and human form",
    classes: [
      { time: "9:00 AM", name: "Watercolor & Ink", instructor: "Ms. Park", level: "All Levels", spots: 6 },
      { time: "5:00 PM", name: "Figure Drawing", instructor: "Mr. Rivera", level: "Intermediate+", spots: 8 },
      { time: "7:00 PM", name: "Acrylic Abstraction", instructor: "Ms. Chen", level: "All Levels", spots: 3 },
    ],
    color: "#7a8c7e"
  },
  {
    id: 3,
    day: "Wednesday",
    focus: "Youth & Foundation",
    description: "Young artists and building core skills",
    classes: [
      { time: "10:00 AM", name: "Kids Art Camp", instructor: "Ms. Thompson", level: "Youth", spots: 5 },
      { time: "6:00 PM", name: "Foundation Drawing", instructor: "Ms. Park", level: "Beginner", spots: 7 },
    ],
    color: "#b0d4b8"
  },
  {
    id: 4,
    day: "Thursday",
    focus: "Oil & Watercolor",
    description: "Master traditional painting techniques",
    classes: [
      { time: "10:00 AM", name: "Oil Painting", instructor: "Mr. Rivera", level: "Intermediate", spots: 1 },
      { time: "6:30 PM", name: "Watercolor & Ink", instructor: "Ms. Chen", level: "All Levels", spots: 5 },
    ],
    color: "#c4785a"
  },
  {
    id: 5,
    day: "Friday - Sunday",
    focus: "Weekend Workshops",
    description: "Extended hours for immersive creative sessions",
    classes: [
      { time: "9:00 AM", name: "Acrylic Abstraction", instructor: "Ms. Park", level: "All Levels", spots: 4 },
      { time: "5:30 PM", name: "Figure Drawing", instructor: "Mr. Rivera", level: "Intermediate+", spots: 6 },
      { time: "10:00 AM", name: "Kids Art Camp", instructor: "Ms. Thompson", level: "Youth", spots: 8 },
      { time: "1:00 PM", name: "Foundation Drawing", instructor: "Ms. Chen", level: "Beginner", spots: 3 },
      { time: "3:30 PM", name: "Oil Painting", instructor: "Mr. Rivera", level: "Intermediate", spots: 2 },
      { time: "6:00 PM", name: "Open Studio", instructor: "Self-Guided", level: "All Levels", spots: 10 },
    ],
    color: "#6a8a80"
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
              Weekly Overview
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-parchment leading-tight">
            Day-by-Day <span className="italic text-gold">Schedule</span>
          </h2>
          <p className="font-body text-parchment/50 text-lg mt-6 max-w-2xl leading-relaxed font-light">
            A detailed breakdown of our weekly programming. Each day has a specific focus 
            to help you plan your creative journey throughout the week.
          </p>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {weeklySchedules.slice(0, 3).map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {weeklySchedules.slice(3).map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>

        {/* Schedule Legend */}
        <div className="mt-12 pt-8 border-t border-gold/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl text-parchment font-light mb-3">Schedule Key</h3>
              <p className="font-body text-parchment/40 text-sm font-light max-w-2xl">
                Each day is color-coded by focus area. Class details include time, instructor, 
                skill level, and current availability. Spots update in real-time.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              {[
                { color: "#c9a96e", label: "Drawing Focus" },
                { color: "#7a8c7e", label: "Watercolor" },
                { color: "#b0d4b8", label: "Youth Programs" },
                { color: "#c4785a", label: "Painting" },
                { color: "#6a8a80", label: "Weekend" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Note */}
        <div className="mt-10 p-6 border border-gold/10 bg-ink/50">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 border border-gold/20 flex items-center justify-center shrink-0">
              <span className="font-mono text-[10px] text-gold">i</span>
            </div>
            <div>
              <h4 className="font-display text-lg text-parchment font-light mb-2">How This Complements Our Interactive Schedule</h4>
              <p className="font-body text-parchment/40 text-sm font-light">
                This day-by-day overview gives you the big picture of our weekly focus areas. 
                For detailed class times, real-time availability, and registration, 
                use the interactive schedule below where you can filter by day and see exact spot counts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleCard({ schedule }: { schedule: typeof weeklySchedules[0] }) {
  return (
    <div className="group relative overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-500 bg-ink">
      {/* Header */}
      <div className="p-6 border-b border-gold/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-2xl text-parchment font-light">{schedule.day}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ background: schedule.color }} />
              <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/40">
                {schedule.focus}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-[8px] tracking-widest uppercase text-gold/60">
              {schedule.classes.length} {schedule.classes.length === 1 ? "class" : "classes"}
            </span>
          </div>
        </div>
        
        <p className="font-body text-parchment/50 text-sm font-light leading-relaxed">
          {schedule.description}
        </p>
      </div>

      {/* Classes List */}
      <div className="p-6">
        <div className="space-y-4">
          {schedule.classes.map((cls, index) => (
            <div key={index} className="flex items-start justify-between pb-4 border-b border-gold/5 last:border-0 last:pb-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gold/70">{cls.time}</span>
                  <div className="w-1 h-1 rounded-full bg-parchment/20" />
                  <span className="font-mono text-[8px] tracking-widest uppercase text-parchment/30">
                    {cls.level}
                  </span>
                </div>
                <h4 className="font-display text-base text-parchment font-light">{cls.name}</h4>
                <p className="font-body text-parchment/40 text-xs font-light mt-1">with {cls.instructor}</p>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm ${
                  cls.spots <= 3 ? "bg-clay/10" : "bg-sage/10"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${cls.spots <= 3 ? "bg-clay" : "bg-sage"}`} />
                  <span className="font-mono text-[8px] tracking-widest uppercase text-parchment/40">
                    {cls.spots} spot{cls.spots !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gold/5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">
            Daily focus: {schedule.focus}
          </span>
          <button className="font-mono text-[8px] tracking-widest uppercase text-parchment/40 hover:text-gold transition-colors flex items-center gap-1 group">
            View details
            <span className="text-gold group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-all duration-500 pointer-events-none" />
    </div>
  );
}