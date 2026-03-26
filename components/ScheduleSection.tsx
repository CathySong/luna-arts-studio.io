"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const schedule: Record<string, { time: string; class: string; instructor: string; level: string; spots: number; color: string }[]> = {
  Monday: [
    { time: "10:00 AM", class: "Foundation Drawing", instructor: "Ms. Chen", level: "Beginner", spots: 4, color: "#c9a96e" },
    { time: "6:30 PM", class: "Oil Painting", instructor: "Mr. Rivera", level: "Intermediate", spots: 2, color: "#c4785a" },
  ],
  Tuesday: [
    { time: "9:00 AM", class: "Watercolor & Ink", instructor: "Ms. Park", level: "All Levels", spots: 6, color: "#7a8c7e" },
    { time: "5:00 PM", class: "Figure Drawing", instructor: "Mr. Rivera", level: "Intermediate+", spots: 8, color: "#9ba8b0" },
    { time: "7:00 PM", class: "Acrylic Abstraction", instructor: "Ms. Chen", level: "All Levels", spots: 3, color: "#d4845a" },
  ],
  Wednesday: [
    { time: "10:00 AM", class: "Kids Art Camp", instructor: "Ms. Thompson", level: "Youth", spots: 5, color: "#b0d4b8" },
    { time: "6:00 PM", class: "Foundation Drawing", instructor: "Ms. Park", level: "Beginner", spots: 7, color: "#c9a96e" },
  ],
  Thursday: [
    { time: "10:00 AM", class: "Oil Painting", instructor: "Mr. Rivera", level: "Intermediate", spots: 1, color: "#c4785a" },
    { time: "6:30 PM", class: "Watercolor & Ink", instructor: "Ms. Chen", level: "All Levels", spots: 5, color: "#7a8c7e" },
  ],
  Friday: [
    { time: "9:00 AM", class: "Acrylic Abstraction", instructor: "Ms. Park", level: "All Levels", spots: 4, color: "#d4845a" },
    { time: "5:30 PM", class: "Figure Drawing", instructor: "Mr. Rivera", level: "Intermediate+", spots: 6, color: "#9ba8b0" },
  ],
  Saturday: [
    { time: "10:00 AM", class: "Kids Art Camp", instructor: "Ms. Thompson", level: "Youth", spots: 8, color: "#b0d4b8" },
    { time: "1:00 PM", class: "Foundation Drawing", instructor: "Ms. Chen", level: "Beginner", spots: 3, color: "#c9a96e" },
    { time: "3:30 PM", class: "Oil Painting", instructor: "Mr. Rivera", level: "Intermediate", spots: 2, color: "#c4785a" },
    { time: "6:00 PM", class: "Open Studio", instructor: "Self-Guided", level: "All Levels", spots: 10, color: "#6a8a80" },
  ],
  Sunday: [
    { time: "11:00 AM", class: "Watercolor & Ink", instructor: "Ms. Park", level: "All Levels", spots: 4, color: "#7a8c7e" },
    { time: "2:00 PM", class: "Open Studio", instructor: "Self-Guided", level: "All Levels", spots: 10, color: "#6a8a80" },
  ],
};

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState("Saturday");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <section id="schedule" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-gray-darkest/[0.02] leading-none select-none pointer-events-none pr-4">
        04
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60" style={{ letterSpacing: "0.35em" }}>
              Weekly Timetable
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
            Class <span className="italic text-accent-warm">Schedule</span>
          </h2>
        </div>

        {/* Day selector */}
        <div className="flex flex-wrap gap-2 mb-10">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                activeDay === day
                  ? "bg-accent-warm text-white"
                  : "border border-gray-lightest text-gray-dark hover:border-gray-light hover:text-accent-warm/60"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Schedule grid */}
        <div className="border border-gray-lightest">
          {/* Header */}
          <div className="grid grid-cols-5 gap-0 border-b border-gray-lightest bg-white/50 px-6 py-3">
            {["Time", "Class", "Instructor", "Level", "Availability"].map((h) => (
              <p key={h} className="font-mono text-[9px] tracking-widest uppercase text-gray-darker-darker">{h}</p>
            ))}
          </div>

          {/* Rows */}
          {(schedule[activeDay] || []).map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-0 px-6 py-5 border-b border-gray-lightest hover:bg-gray-lightest/50 transition-colors duration-200 group"
            >
              <div>
                <p className="font-mono text-xs text-gray-darkest/70">{item.time}</p>
              </div>
              <div>
                <p
                  className="font-display text-lg font-light"
                  style={{ color: item.color }}
                >
                  {item.class}
                </p>
              </div>
              <div className="flex items-center">
                <p className="font-body text-sm text-gray-dark font-light">{item.instructor}</p>
              </div>
              <div className="flex items-center">
                <span
                  className="font-mono text-[8px] tracking-widest uppercase px-2 py-1 border"
                  style={{ color: item.color, borderColor: `${item.color}30` }}
                >
                  {item.level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: item.spots <= 3 ? "#c4785a" : "#7a8c7e" }}
                  />
                  <p className="font-mono text-[10px] text-gray-dark">
                    {item.spots} {item.spots === 1 ? "spot" : "spots"} left
                  </p>
                </div>
                <a
                  href="#contact"
                  className="opacity-0 group-hover:opacity-100 font-mono text-[8px] tracking-widest uppercase text-accent-warm border border-gray-light px-3 py-1.5 hover:bg-accent-warm hover:text-white transition-all duration-200"
                >
                  Register
                </a>
              </div>
            </div>
          ))}

          {(!schedule[activeDay] || schedule[activeDay].length === 0) && (
            <div className="px-6 py-12 text-center">
              <p className="font-display text-2xl text-gray-darkest/20 font-light italic">
                No classes scheduled
              </p>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-lightest">
          <p className="font-mono text-[9px] tracking-wide uppercase text-gray-darker">
            * Schedule subject to change. Spots shown are approximate. Contact us to confirm availability.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-warm" />
              <span className="font-mono text-[9px] text-gray-darker uppercase tracking-widest">Filling fast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-cool" />
              <span className="font-mono text-[9px] text-gray-darker uppercase tracking-widest">Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
