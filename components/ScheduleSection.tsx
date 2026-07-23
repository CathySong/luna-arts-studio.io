"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";
import { getClassType } from "@/config/classes";

export default function ScheduleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });
  const { sessions, registrationFormUrl, weeklySchedule, classTypes } = fallEnrollmentConfig;

  return (
    <section id="schedule" className="py-32 bg-white relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span
              className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60"
              style={{ letterSpacing: "0.35em" }}
            >
              Fall Class Calendar
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
            Class <span className="italic text-accent-warm">Schedule</span>
          </h2>
          <p className="font-body text-gray-dark mt-4 max-w-2xl font-light">
            Four class types across Monday–Saturday. Drawing and oil painting are 90 minutes.
            Creative and handcraft classes are 60 minutes. Session windows match the established
            Wednesday calendar.
          </p>
        </div>

        {/* Duration legend */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {classTypes.map((cls) => (
            <div key={cls.id} className="border border-gray-lightest px-5 py-4">
              <p className="font-display text-xl text-gray-darkest font-light">{cls.title}</p>
              <p className="font-body text-xs text-gray-darker mt-1">{cls.titleZh}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-accent-warm mt-3">
                {cls.durationLabel}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly grid */}
        <div className="border border-gray-lightest mb-14 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-lightest bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] tracking-widest uppercase text-accent-warm mb-1">
                Weekly Timetable
              </p>
              <h3 className="font-display text-2xl text-gray-darkest font-light">
                Mon · Tue · Wed · Thu · Fri · Sat
              </h3>
            </div>
            <p className="font-body text-sm text-gray-dark font-light">
              All four class types offered in Fall
            </p>
          </div>

          <div className="divide-y divide-gray-lightest">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-2 px-6 py-5 bg-gray-50/40 border-b lg:border-b-0 lg:border-r border-gray-lightest flex lg:flex-col lg:justify-center gap-2">
                  <p className="font-display text-xl text-gray-darkest font-light">{day.day}</p>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker">
                    {day.slots.length} classes
                  </p>
                </div>
                <div className="lg:col-span-10 grid sm:grid-cols-2">
                  {day.slots.map((slot) => {
                    const cls = getClassType(slot.classTypeId);
                    return (
                      <div
                        key={`${day.day}-${slot.time}-${slot.classTypeId}`}
                        className="px-6 py-5 border-b sm:border-r border-gray-lightest last:border-b-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-display text-lg text-gray-darkest font-light">
                            {cls.title}
                          </p>
                          <span className="font-mono text-[8px] tracking-widest uppercase text-accent-warm shrink-0">
                            {slot.duration}
                          </span>
                        </div>
                        <p className="font-body text-xs text-gray-darker mb-2">{cls.titleZh}</p>
                        <p className="font-mono text-[11px] tracking-wide uppercase text-gray-dark">
                          {slot.time}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session windows */}
        <div className="space-y-10">
          {sessions.map((session, index) => (
            <div key={session.id} className="border border-gray-lightest">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-gray-lightest bg-gray-50/50">
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-accent-warm mb-1">
                    Session Window · Mon–Sat
                  </p>
                  <h3 className="font-display text-2xl text-gray-darkest font-light">
                    {session.name}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gray-dark">
                    {session.startDisplay} – {session.endDisplay}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 border border-accent-warm/30 text-accent-warm">
                    {session.classCount} classes
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-0">
                {session.dates.map((date, i) => (
                  <div
                    key={date}
                    className="px-6 py-5 border-b border-r border-gray-lightest hover:bg-gray-50/80 transition-colors"
                  >
                    <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">
                      Week {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="font-display text-lg text-gray-darkest font-light">{date}</p>
                    <p className="font-body text-xs text-gray-dark mt-1">Wed reference</p>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <p className="font-body text-sm text-gray-dark font-light">{session.note}</p>
                <a
                  href={registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] tracking-widest uppercase text-accent-warm border border-accent-warm/30 px-4 py-2 hover:bg-accent-warm hover:text-white transition-all duration-200 text-center"
                >
                  Enroll in Session {index + 1}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-lightest">
          <p className="font-mono text-[9px] tracking-wide uppercase text-gray-darker">
            Session 2 skips late-December holiday weeks, then resumes in January. Same window for all
            weekdays.
          </p>
          <a
            href="#fall-enrollment"
            className="font-mono text-[9px] tracking-widest uppercase text-accent-warm hover:underline"
          >
            Back to Fall Enrollment
          </a>
        </div>
      </div>
    </section>
  );
}
