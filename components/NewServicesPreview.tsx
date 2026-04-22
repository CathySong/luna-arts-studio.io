"use client";
import Link from "next/link";
import { PartyPopper, Scissors, ArrowRight } from "lucide-react";

export default function NewServicesPreview() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-lightest/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-light text-gray-darkest mb-4">
            New Creative Services
          </h2>
          <p className="font-body text-lg text-gray-dark max-w-3xl mx-auto">
            Discover our latest offerings for creative celebrations and professional tailoring
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Birthday Parties Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:shadow-xl transition-all duration-500">
            <div className="absolute top-6 right-6">
              <PartyPopper className="w-12 h-12 text-pink-300 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-8">
              <div className="mb-6">
                <span className="font-mono text-xs tracking-widest uppercase text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                  New Service
                </span>
              </div>
              <h3 className="font-display text-2xl font-medium text-gray-darkest mb-4">
                Creative Birthday Parties
              </h3>
              <p className="font-body text-gray-dark mb-6">
                Make your celebration unforgettable with hands-on creative workshops. 
                Choose from 5 exciting themes where every child creates their own masterpiece to take home.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="font-body text-gray-dark">5 creative party themes</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="font-body text-gray-dark">All materials included</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="font-body text-gray-dark">Studio or on-site options</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="font-body text-gray-dark">Perfect for ages 5-16</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl font-medium text-gray-darkest">
                    From $320
                  </div>
                  <div className="font-body text-sm text-gray-dark">
                    for up to 6 children
                  </div>
                </div>
                <Link
                  href="/events"
                  className="flex items-center gap-2 text-pink-600 font-body text-sm tracking-widest uppercase hover:text-pink-700 transition-colors"
                >
                  Explore Parties
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Tailor & Sewing Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-xl transition-all duration-500">
            <div className="absolute top-6 right-6">
              <Scissors className="w-12 h-12 text-blue-300 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-8">
              <div className="mb-6">
                <span className="font-mono text-xs tracking-widest uppercase text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  New Service
                </span>
              </div>
              <h3 className="font-display text-2xl font-medium text-gray-darkest mb-4">
                Professional Tailoring & Sewing
              </h3>
              <p className="font-body text-gray-dark mb-6">
                Expert alterations, custom clothing design, and sewing classes for all skill levels. 
                Perfect fit, professional results, and creative education.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-body text-gray-dark">Alterations & tailoring</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-body text-gray-dark">Custom clothing design</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-body text-gray-dark">Sewing classes & workshops</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="font-body text-gray-dark">Quick turnaround available</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl font-medium text-gray-darkest">
                    From $15
                  </div>
                  <div className="font-body text-sm text-gray-dark">
                    for basic alterations
                  </div>
                </div>
                <Link
                  href="/sewing"
                  className="flex items-center gap-2 text-blue-600 font-body text-sm tracking-widest uppercase hover:text-blue-700 transition-colors"
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="font-body text-gray-dark mb-8 max-w-2xl mx-auto">
            Whether you're planning a special celebration or need professional tailoring services, 
            we're here to bring creativity and precision to every project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="px-8 py-3 bg-pink-600 text-white font-body text-sm tracking-widest uppercase rounded-lg hover:bg-pink-700 transition-colors duration-300"
            >
              Book a Party
            </Link>
            <Link
              href="/sewing"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-body text-sm tracking-widest uppercase rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Sewing Services
            </Link>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-gray-dark text-gray-dark font-body text-sm tracking-widest uppercase rounded-lg hover:bg-gray-dark hover:text-white transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}