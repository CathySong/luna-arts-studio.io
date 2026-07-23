"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";

export default function FallSessionsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });
  const { sessions, registrationFormUrl, contact, classTimes } = fallEnrollmentConfig;

  return (
    <section id="fall-enrollment" className="py-32 bg-white relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span
              className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60"
              style={{ letterSpacing: "0.35em" }}
            >
              Fall Enrollment
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight mb-6">
            Fall <span className="italic text-accent-warm">Sessions</span>
          </h2>
          <p className="font-body text-gray-dark max-w-2xl font-light leading-relaxed">
            Join our weekly Wednesday art classes this fall. Choose Session 1, Session 2, or both.
            Two time slots: {classTimes.map((t) => t.label).join(" and ")}.
            Small class sizes and a supportive studio environment for young artists and beginners alike.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {classTimes.map((time) => (
              <span
                key={time.id}
                className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-accent-warm/30 text-accent-warm bg-accent-warm/5"
              >
                {time.label}
              </span>
            ))}
          </div>
        </div>

        {/* Registration callout */}
        <div className="mb-14 p-6 md:p-8 border border-accent-warm/20 bg-accent-warm/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-gray-darkest font-light mb-2">
              📝 Easy Online Registration
            </h3>
            <p className="font-body text-gray-dark text-sm font-light">
              Click "Register Now" to fill out our form. You'll receive a confirmation within 24 hours.
            </p>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-accent-warm">5 min</p>
                <p className="font-body text-xs text-gray-darker">to complete</p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-accent-warm">24h</p>
                <p className="font-body text-xs text-gray-darker">confirmation</p>
              </div>
            </div>
          </div>
          <a
            href={registrationFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-8 py-4 bg-accent-warm text-white font-mono text-xs tracking-widest uppercase hover:bg-accent-warm/90 transition-all duration-300 text-center"
          >
            Register Now
          </a>
        </div>

        {/* Session cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="border border-gray-lightest p-8 hover:border-accent-warm/30 transition-all duration-300 bg-white"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-accent-warm mb-2 block">
                    {session.label}
                  </span>
                  <h3 className="font-display text-3xl text-gray-darkest font-light">
                    {session.name}
                  </h3>
                </div>
                <span className="font-display text-5xl font-light text-accent-warm/20 leading-none">
                  0{index + 1}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-accent-warm/30 text-accent-warm">
                  {session.classCount} Classes
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-gray-lightest text-gray-dark">
                  Wednesdays
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-gray-lightest text-gray-dark">
                  {session.startDisplay} – {session.endDisplay}
                </span>
              </div>

              <p className="font-body text-sm text-gray-dark font-light mb-6">{session.note}</p>

              <div className="border-t border-gray-lightest pt-6 mb-8">
                <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-4">
                  Class Dates
                </p>
                <div className="flex flex-wrap gap-2">
                  {session.dates.map((date) => (
                    <span
                      key={date}
                      className="font-mono text-[11px] px-2.5 py-1.5 bg-gray-50 text-gray-darkest border border-gray-100"
                    >
                      {date}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={registrationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-accent-warm border border-accent-warm/30 px-5 py-3 hover:bg-accent-warm hover:text-white transition-all duration-300"
              >
                Enroll in {session.name}
                <span>→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-3 gap-8 pt-10 border-t border-gray-lightest">
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-3">
              📅 Schedule
            </p>
            <p className="font-body text-sm text-gray-darkest font-light mb-1">
              Weekly Wednesday classes
            </p>
            <p className="font-body text-xs text-gray-dark font-light">
              Session 1: {sessions[0].startDisplay} – {sessions[0].endDisplay}
              <br />
              Session 2: {sessions[1].startDisplay} – {sessions[1].endDisplay}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-3">
              📍 Studio
            </p>
            <p className="font-body text-sm text-gray-darkest font-light mb-1">
              {contact.address}
            </p>
            <p className="font-body text-xs text-gray-dark font-light">
              2nd Floor: Luna Art Studio
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-3">
              📞 Questions?
            </p>
            <p className="font-body text-sm text-gray-darkest font-light mb-1">
              {contact.phone}
            </p>
            <p className="font-body text-xs text-gray-dark font-light">
              WeChat: {contact.wechat}
              <br />
              {contact.email}
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="font-body text-gray-dark text-sm font-light mb-6">
            Ready to join? Register online or contact us for availability and placement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={registrationFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-accent-warm text-white font-mono text-xs tracking-widest uppercase hover:bg-accent-warm/90 transition-all duration-300"
            >
              Register for Fall
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-accent-warm/30 text-accent-warm font-mono text-xs tracking-widest uppercase hover:bg-accent-warm hover:text-white transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
