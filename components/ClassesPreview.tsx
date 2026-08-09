"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";

export default function ClassesPreview() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { threshold: 0.3 });
  const { weeklySchedule, privateLesson } = fallEnrollmentConfig;

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
                One weekly schedule — pick the day, time, and age group that fits. Full session dates
                and registration are in Fall Enrollment below.
              </p>
            </div>
            <p className="font-body text-gray-dark max-w-xs font-light leading-relaxed text-sm">
              Small class sizes. Expert instruction. A warm studio community.
            </p>
          </div>
        </div>

        <div className="border border-gray-lightest divide-y divide-gray-lightest mb-14">
          {weeklySchedule.map((day) => (
            <div key={day.day} className="grid lg:grid-cols-12">
              <div className="lg:col-span-2 px-6 py-5 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-lightest flex items-center">
                <p className="font-display text-xl text-gray-darkest font-light">{day.day}</p>
              </div>
              <div className="lg:col-span-10 divide-y divide-gray-lightest">
                {day.slots.map((slot) => (
                  <div
                    key={`${day.day}-${slot.time}-${slot.title}`}
                    className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <p className="font-display text-lg text-gray-darkest font-light">{slot.title}</p>
                      {slot.ages ? (
                        <p className="font-body text-sm text-gray-darker mt-0.5">{slot.ages}</p>
                      ) : null}
                    </div>
                    <p className="font-mono text-[11px] tracking-wide uppercase text-gray-dark shrink-0">
                      {slot.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-2 px-6 py-5 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-lightest flex items-center">
              <p className="font-display text-xl text-gray-darkest font-light">Private</p>
            </div>
            <div className="lg:col-span-10 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-display text-lg text-gray-darkest font-light">
                  {privateLesson.title}
                </p>
                <p className="font-body text-sm text-gray-darker mt-0.5">{privateLesson.note}</p>
              </div>
              <a
                href="#contact"
                className="font-mono text-[10px] tracking-widest uppercase text-accent-warm hover:underline shrink-0"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-14 border-t border-gray-lightest">
          <div>
            <p className="font-body text-gray-darkest/70 font-light mb-1">
              Ready to enroll for Fall?
            </p>
            <p className="font-body text-gray-darker text-sm font-light">
              Session dates and online registration are below.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="#fall-enrollment"
              className="px-8 py-3 bg-gray-darkest text-white font-body text-xs tracking-widest uppercase hover:bg-accent-warm transition-all duration-300"
            >
              Fall Enrollment
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
