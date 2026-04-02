"use client";
import Image from "next/image";
import { useState } from "react";
import { summerCampConfig } from "@/config/summer-camp";

export default function SummerCampHero() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <section className="relative">
      {/* 红色通知Banner - 放在Navbar下面 */}
      {showBanner && (
        <div className="bg-red-600 text-white py-4 px-6 relative mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="font-mono text-xs tracking-widest uppercase font-bold">
                  🏕️ Summer Camp 2026
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
                <span className="underline">Early Bird Registration Now Open!</span>
              </h3>
              <p className="font-body text-sm md:text-base font-light opacity-90">
                Limited spots available! Register before May 1st and save 10% on all summer camp programs.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="#camps"
                className="bg-white text-red-600 font-mono text-xs tracking-widest uppercase font-bold px-6 py-3 rounded-full hover:bg-red-50 transition-all duration-300 whitespace-nowrap"
              >
                View Camps
              </a>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white hover:text-red-200 transition-colors p-2"
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

      {/* 完整展示的Summer Camp图片 */}
      <div className="relative w-full">
        <div className="relative h-[70vh] min-h-[600px]">
          <Image
            src="/images/camp-summer-intro.jpg"
            alt="Summer Camp at Luna Art Studio - Young artists creating, painting, and learning together in our vibrant studio"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            quality={90}
          />
          
          {/* 图片上的文字叠加 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6 max-w-4xl">
                <div className="mb-8">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                    Summer Art Adventures 2026
                  </span>
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                    🏕️ Summer <span className="text-red-300">Camp</span><br />
                    2026 <span className="text-yellow-300">Registration Open</span>
                  </h1>
                  <p className="font-body text-xl md:text-2xl text-white/90 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                    June 22 - August 28 • Small class sizes • Art + Crafts + Outdoor activities
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="#camps"
                    className="bg-white text-gray-900 font-display text-lg font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    Explore Camp Programs
                  </a>
                  <a
                    href={summerCampConfig.registrationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white font-display text-lg font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Register Now
                  </a>
                  <a
                    href="/flyer"
                    className="bg-transparent border-2 border-white text-white font-display text-lg font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    View Flyer & Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest uppercase text-white/70 mb-2">
              Scroll to explore
            </span>
            <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* 快速信息栏 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-red-600 font-display text-3xl font-bold mb-2">10%</div>
              <p className="font-body text-gray-700 font-light">Early Bird Discount</p>
              <p className="font-mono text-xs text-gray-500 mt-1">Register by May 1</p>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-display text-3xl font-bold mb-2">6/22</div>
              <p className="font-body text-gray-700 font-light">Camp Start Date</p>
              <p className="font-mono text-xs text-gray-500 mt-1">June 22 - August 28</p>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-display text-3xl font-bold mb-2">$130</div>
              <p className="font-body text-gray-700 font-light">Full Day with Lunch</p>
              <p className="font-mono text-xs text-gray-500 mt-1">9am - 5pm</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}