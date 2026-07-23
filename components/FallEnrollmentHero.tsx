"use client";
import { useState } from "react";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";

export default function FallEnrollmentHero() {
  const [showBanner, setShowBanner] = useState(true);
  const session1 = fallEnrollmentConfig.sessions[0];
  const session2 = fallEnrollmentConfig.sessions[1];

  return (
    <section className="relative">
      {/* Promo banner under navbar */}
      {showBanner && (
        <div className="bg-accent-warm text-white py-4 px-6 relative mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-mono text-xs tracking-widest uppercase font-bold">
                  🍂 {fallEnrollmentConfig.seasonLabel}
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
                Fall Class Registration Open!
              </h3>
              <p className="font-body text-sm md:text-base font-light opacity-90">
                Session 1 starts {session1.startDisplay} · Session 2 starts{" "}
                {session2.startDisplay} · Mon–Sat · 4 class types · Limited spots
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#fall-enrollment"
                className="bg-white text-accent-warm font-mono text-xs tracking-widest uppercase font-bold px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-300 whitespace-nowrap"
              >
                View Sessions
              </a>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white hover:text-white/70 transition-colors p-2"
                aria-label="Close notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fall hero content */}
      <div className="relative w-full bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="inline-block bg-accent-warm/15 text-accent-warm font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-full mb-8">
                🍂 Fall Art Classes 2026
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                Fall <span className="text-accent-warm">Enrollment</span>
                <br />
                <span className="text-gray-700">Now Open</span>
              </h1>
              <p className="font-body text-2xl md:text-3xl text-gray-700 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
                {fallEnrollmentConfig.subheadline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <a
                href="#fall-enrollment"
                className="bg-white border-2 border-gray-300 text-gray-900 font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Fall Sessions
              </a>
              <a
                href={fallEnrollmentConfig.registrationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent-warm hover:bg-accent-warm/90 text-white font-display text-xl font-bold px-10 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Register Now
              </a>
              <a
                href="#contact"
                className="bg-transparent border-2 border-accent-warm text-accent-warm font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-accent-warm/5 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-accent-warm font-display text-4xl font-bold mb-3">
                  {session1.startDisplay}
                </div>
                <p className="font-body text-gray-700 font-medium">Session 1 Starts</p>
                <p className="font-mono text-sm text-gray-500 mt-2">
                  {session1.classCount} weekly classes · Mon–Sat
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-accent-warm font-display text-4xl font-bold mb-3">
                  {session2.startDisplay}
                </div>
                <p className="font-body text-gray-700 font-medium">Session 2 Starts</p>
                <p className="font-mono text-sm text-gray-500 mt-2">
                  {session2.classCount} weekly classes · Mon–Sat
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-accent-warm font-display text-4xl font-bold mb-3">2</div>
                <p className="font-body text-gray-700 font-medium">Fall Sessions Open</p>
                <p className="font-mono text-sm text-gray-500 mt-2">Enroll for one or both</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
