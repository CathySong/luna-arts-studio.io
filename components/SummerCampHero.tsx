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

      {/* Summer Camp Hero Content without Background Image */}
      <div className="relative w-full bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="inline-block bg-red-100 text-red-700 font-mono text-xs tracking-widest uppercase px-6 py-3 rounded-full mb-8">
                🏕️ Summer Art Adventures 2026
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                Summer <span className="text-red-600">Camp</span><br />
                <span className="text-yellow-600">Registration Open</span>
              </h1>
              <p className="font-body text-2xl md:text-3xl text-gray-700 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
                June 22 - August 28 • Small class sizes • Art + Crafts + Outdoor activities
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <a
                href="#camps"
                className="bg-white border-2 border-gray-300 text-gray-900 font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Camp Programs
              </a>
              <a
                href={summerCampConfig.registrationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-display text-xl font-bold px-10 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Register Now
              </a>
              <a
                href="/flyer"
                className="bg-transparent border-2 border-red-600 text-red-600 font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-red-50 transition-all duration-300"
              >
                View Flyer & Details
              </a>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-red-600 font-display text-4xl font-bold mb-3">10%</div>
                <p className="font-body text-gray-700 font-medium">Early Bird Discount</p>
                <p className="font-mono text-sm text-gray-500 mt-2">Register by May 1</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-red-600 font-display text-4xl font-bold mb-3">6/22</div>
                <p className="font-body text-gray-700 font-medium">Camp Start Date</p>
                <p className="font-mono text-sm text-gray-500 mt-2">June 22 - August 28</p>
              </div>
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="text-red-600 font-display text-4xl font-bold mb-3">$130</div>
                <p className="font-body text-gray-700 font-medium">Full Day with Lunch</p>
                <p className="font-mono text-sm text-gray-500 mt-2">9am - 5pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}