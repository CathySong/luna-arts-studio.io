"use client";
import Link from "next/link";
import { Share2, ArrowLeft } from "lucide-react";
import { fallEnrollmentConfig } from "@/config/fall-enrollment";

export default function FlyerPage() {
  const { sessions, registrationFormUrl, contact } = fallEnrollmentConfig;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Luna Art Studio Fall Enrollment 2026",
          text: "Fall Wednesday art classes are open for registration!",
          url: window.location.href,
        });
      } catch {
        // sharing cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-body font-medium">Back to Home</span>
            </Link>

            <h1 className="font-display text-2xl font-light text-gray-900">
              Fall Enrollment 2026
            </h1>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-body text-sm font-medium hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-8 md:p-12">
            <div className="text-center mb-12">
              <span className="inline-block bg-accent-warm/15 text-accent-warm font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-full mb-6">
                🍂 Fall 2026
              </span>
              <h2 className="font-display text-4xl font-light text-gray-900 mb-4">
                Fall Class Enrollment Details
              </h2>
              <p className="font-body text-gray-600 max-w-2xl mx-auto">
                Weekly Wednesday art classes at Luna Art Studio. Choose Session 1, Session 2, or both.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {sessions.map((session, index) => (
                <div key={session.id} className="border border-gray-200 p-8 rounded-xl">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-accent-warm mb-2">
                    {session.label}
                  </p>
                  <h3 className="font-display text-3xl text-gray-900 font-light mb-4">
                    {session.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-accent-warm/30 text-accent-warm">
                      {session.classCount} classes
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-gray-200 text-gray-600">
                      Wednesdays
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-gray-200 text-gray-600">
                      {session.startDisplay} – {session.endDisplay}
                    </span>
                  </div>
                  <p className="font-body text-sm text-gray-600 mb-4">{session.note}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {session.dates.map((date) => (
                      <span
                        key={date}
                        className="font-mono text-[11px] px-2.5 py-1.5 bg-gray-50 text-gray-800 border border-gray-100"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                  <a
                    href={registrationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-accent-warm border border-accent-warm/30 px-5 py-3 hover:bg-accent-warm hover:text-white transition-all duration-300"
                  >
                    Enroll in Session {index + 1} →
                  </a>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-gray-200">
              <div>
                <h3 className="font-display text-2xl font-light text-gray-800 mb-4">
                  📅 Key Info
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-warm rounded-full mt-2" />
                    <span className="font-body text-gray-700">
                      Session 1 starts Sep 9 · 9 Wednesday classes through Nov 4
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-warm rounded-full mt-2" />
                    <span className="font-body text-gray-700">
                      Session 2 starts Nov 11 · 10 classes through Feb 3
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-warm rounded-full mt-2" />
                    <span className="font-body text-gray-700">
                      Session 2 skips late-December holiday weeks, resumes in January
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent-warm rounded-full mt-2" />
                    <span className="font-body text-gray-700">
                      Small class sizes · Limited spots available
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display text-2xl font-light text-gray-800 mb-4">
                  📞 Contact
                </h3>
                <div className="space-y-3">
                  <p className="font-body text-gray-700">
                    <span className="font-medium">Email:</span> {contact.email}
                  </p>
                  <p className="font-body text-gray-700">
                    <span className="font-medium">WeChat:</span> {contact.wechat}
                  </p>
                  <p className="font-body text-gray-700">
                    <span className="font-medium">Phone:</span> {contact.phone}
                  </p>
                  <p className="font-body text-gray-700">
                    <span className="font-medium">Address:</span> {contact.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-200 text-center">
              <h3 className="font-display text-2xl font-light text-gray-900 mb-6">
                Ready to Join Fall Classes?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-warm hover:bg-accent-warm/90 text-white font-display text-xl font-bold px-10 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Register Online Now
                </a>
                <a
                  href="/#contact"
                  className="bg-white border-2 border-gray-300 text-gray-900 font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-gray-50 transition-all duration-300"
                >
                  Have Questions? Contact Us
                </a>
              </div>
              <p className="font-body text-gray-600 mt-6">
                Limited spots available! Early registration recommended.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
