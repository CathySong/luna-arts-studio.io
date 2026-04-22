"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, Gift, Star, CheckCircle, ArrowRight } from "lucide-react";

// Party options data
const partyOptions = [
  {
    id: 1,
    title: "Hair Accessories Design Party",
    emoji: "🎀",
    description: "Create beautiful bows, pearl clips, fabric flowers, and crystal decorations",
    activities: [
      "Design and create hair accessories",
      "Choose from various materials and colors",
      "Wear your creations for birthday photos",
      "Take home your handmade accessories"
    ],
    ageRange: "Ages 6-14",
    duration: "2 hours",
    bestFor: "Birthdays, Girl Scout troops, Special celebrations"
  },
  {
    id: 2,
    title: "Jewelry Design Party",
    emoji: "💎",
    description: "Make beautiful bracelets, phone charms, or earrings with wide bead selection",
    activities: [
      "Choose from hundreds of beads and charms",
      "Create matching jewelry sets",
      "Personalize with names and birthstones",
      "Professional jewelry-making techniques"
    ],
    ageRange: "Ages 7-16",
    duration: "2 hours",
    bestFor: "Birthdays, Mother-Daughter events, Team building"
  },
  {
    id: 3,
    title: "Soap Handmaking Party",
    emoji: "🧼",
    description: "Create custom soaps with colors, fragrances, and personalized packaging",
    activities: [
      "Choose colors and natural fragrances",
      "Design soap shapes and layers",
      "Create custom packaging and labels",
      "Learn about natural ingredients"
    ],
    ageRange: "Ages 5-12",
    duration: "2 hours",
    bestFor: "Birthdays, School events, Holiday parties"
  },
  {
    id: 4,
    title: "Custom Fashion Studio Party",
    emoji: "🎨",
    description: "Design and paint your own canvas bag or T-shirt with professional fabric paints",
    activities: [
      "Choose between canvas bag or T-shirt",
      "Learn fabric painting techniques",
      "Create unique wearable art",
      "Use professional-grade materials"
    ],
    ageRange: "Ages 8-18",
    duration: "2 hours",
    bestFor: "Birthdays, Teen parties, Creative workshops"
  },
  {
    id: 5,
    title: "Design Your Own Mug Party",
    emoji: "☕️",
    description: "Decorate your own mug with ceramic-safe paints and personal designs",
    activities: [
      "Choose mug style and size",
      "Design with ceramic-safe paints",
      "Personalize with names and artwork",
      "Food-safe finished product"
    ],
    ageRange: "Ages 6-16",
    duration: "2 hours",
    bestFor: "Birthdays, Family events, Gift-making parties"
  }
];

export default function EventsPage() {
  const [selectedParty, setSelectedParty] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-lightest/30 pt-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-light text-gray-darkest mb-6">
            Creative Birthday Parties & Group Events
          </h1>
          <p className="font-body text-lg text-gray-dark max-w-3xl mx-auto mb-8">
            Make your special celebration unforgettable with our hands-on creative workshops. 
            Perfect for birthdays, school events, scout troops, and group celebrations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">2-Hour Workshops</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">Up to 12 Children</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Gift className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">Take-Home Creations</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">All Materials Included</span>
            </div>
          </div>
        </div>

        {/* Party Selection */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Party Options */}
          <div>
            <h2 className="font-display text-3xl font-light text-gray-darkest mb-8">
              Choose Your Creative Party Theme
            </h2>
            <div className="space-y-4">
              {partyOptions.map((party) => (
                <button
                  key={party.id}
                  onClick={() => setSelectedParty(party.id)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                    selectedParty === party.id
                      ? "bg-white border-2 border-accent-warm shadow-lg"
                      : "bg-white/50 border border-gray-light hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{party.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-medium text-gray-darkest mb-2">
                        {party.title}
                      </h3>
                      <p className="font-body text-gray-dark mb-3">
                        {party.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="font-mono text-xs px-3 py-1 bg-gray-lightest rounded-full text-gray-dark">
                          {party.ageRange}
                        </span>
                        <span className="font-mono text-xs px-3 py-1 bg-gray-lightest rounded-full text-gray-dark">
                          {party.duration}
                        </span>
                      </div>
                    </div>
                    {selectedParty === party.id && (
                      <CheckCircle className="w-6 h-6 text-accent-warm flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Party Details */}
          <div className="sticky top-32">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-light">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">
                  {partyOptions.find(p => p.id === selectedParty)?.emoji}
                </div>
                <h3 className="font-display text-2xl font-medium text-gray-darkest">
                  {partyOptions.find(p => p.id === selectedParty)?.title}
                </h3>
              </div>
              
              <div className="mb-8">
                <h4 className="font-body font-medium text-gray-darkest mb-4">What's Included:</h4>
                <ul className="space-y-3">
                  {partyOptions.find(p => p.id === selectedParty)?.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-warm mt-2 flex-shrink-0" />
                      <span className="font-body text-gray-dark">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8 p-6 bg-gray-lightest/50 rounded-xl">
                <h4 className="font-body font-medium text-gray-darkest mb-4">Perfect For:</h4>
                <p className="font-body text-gray-dark">
                  {partyOptions.find(p => p.id === selectedParty)?.bestFor}
                </p>
              </div>

              {/* Pricing */}
              <div className="border-t border-gray-light pt-8">
                <h4 className="font-display text-2xl font-light text-gray-darkest mb-6">
                  Party Packages
                </h4>
                
                <div className="space-y-6">
                  <div className="p-6 bg-accent-warm/5 border border-accent-warm/20 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-display text-xl font-medium text-gray-darkest">
                          Studio Party
                        </h5>
                        <p className="font-body text-sm text-gray-dark mt-1">
                          Hosted at Luna Art Studio
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl font-medium text-gray-darkest">
                          $320
                        </div>
                        <div className="font-body text-sm text-gray-dark">
                          up to 6 children
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-body text-sm text-gray-dark">
                        Additional child: <span className="font-medium">$45 per person</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-accent-cool/5 border border-accent-cool/20 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-display text-xl font-medium text-gray-darkest">
                          On-Site Party
                        </h5>
                        <p className="font-body text-sm text-gray-dark mt-1">
                          We bring the Art Studio to you
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl font-medium text-gray-darkest">
                          $350
                        </div>
                        <div className="font-body text-sm text-gray-dark">
                          up to 6 children
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="font-body text-sm text-gray-dark">
                        Additional child: <span className="font-medium">$50 per person</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-lightest rounded-lg">
                  <p className="font-body text-sm text-gray-dark">
                    <span className="font-medium">⚠️ Not included:</span> venue decoration & food/catering
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10">
                <Link
                  href="#contact-form"
                  className="block w-full bg-accent-warm text-white font-body text-sm tracking-widest uppercase py-4 px-8 rounded-lg text-center hover:bg-accent-warm/90 transition-colors duration-300"
                >
                  Book Your Party Now
                  <ArrowRight className="inline-block ml-2 w-4 h-4" />
                </Link>
                <p className="font-body text-sm text-gray-dark text-center mt-4">
                  Limited weekend slots available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="font-display text-3xl font-light text-gray-darkest text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                How far in advance should I book?
              </h4>
              <p className="font-body text-gray-dark">
                We recommend booking at least 4-6 weeks in advance for weekend parties. Weekday parties can often be scheduled with 2 weeks notice.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                What's included in the party package?
              </h4>
              <p className="font-body text-gray-dark">
                All art materials, step-by-step instruction by our professional artists, setup and cleanup. Each child takes home their finished creation.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                Can adults participate too?
              </h4>
              <p className="font-body text-gray-dark">
                Absolutely! Our parties are great for all ages. We offer adult-only parties and family events as well.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                What if I need to cancel or reschedule?
              </h4>
              <p className="font-body text-gray-dark">
                We require 7 days notice for cancellations with full refund. Rescheduling is free with 48 hours notice.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-light">
          <h2 className="font-display text-3xl font-light text-gray-darkest text-center mb-8">
            Book Your Creative Party
          </h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                  Parent's Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                  Preferred Party Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                Party Theme *
              </label>
              <select className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none">
                <option value="">Select a party theme</option>
                {partyOptions.map((party) => (
                  <option key={party.id} value={party.id}>
                    {party.emoji} {party.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                Number of Children *
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                placeholder="6"
              />
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                Additional Notes or Special Requests
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                placeholder="Tell us about your celebration, any allergies, special needs, or other requests..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-warm text-white font-body text-sm tracking-widest uppercase py-4 px-8 rounded-lg hover:bg-accent-warm/90 transition-colors duration-300"
            >
              Submit Party Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}