"use client";
import { useState } from "react";
import Link from "next/link";
import { Scissors, Ruler, Zap, Clock, Users, CheckCircle, ArrowRight } from "lucide-react";

// Sewing services data
const sewingServices = [
  {
    id: 1,
    title: "Alterations & Hemming",
    iconName: "Scissors",
    description: "Professional alterations for the perfect fit — hemming, taking in, letting out, and more",
    services: [
      "Hemming (pants, skirts, dresses)",
      "Taking in / letting out seams",
      "Sleeve adjustments",
      "Waistband alterations",
      "Dress and gown resizing",
      "Zipper repairs and replacements"
    ],
    turnaround: "2–5 business days",
    bestFor: "Everyday wear, special occasions, thrift store finds"
  },
  {
    id: 2,
    title: "Custom Apparel Design",
    iconName: "Ruler",
    description: "Personalized hoodies and apparel with hand-painted art or fabric patches",
    services: [
      "Custom hoodie & sweatshirt design",
      "Hand-painted artwork on apparel",
      "Fabric patch appliqué and embroidery",
      "Personalized lettering and motifs",
      "Bring your own garment for customization",
      "Design consultation and sketching"
    ],
    turnaround: "3–7 business days",
    bestFor: "Birthday gifts, team merch, personal style statements"
  }
];



const serviceIcons: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="w-8 h-8" />,
  Ruler: <Ruler className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  Clock: <Clock className="w-8 h-8" />
};

export default function SewingPage() {
  const [selectedService, setSelectedService] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-lightest/30 pt-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-light text-gray-darkest mb-6">
            Tailor & Sewing Services
          </h1>
          <p className="font-body text-lg text-gray-dark max-w-3xl mx-auto mb-8">
            Expert tailoring, custom design, and sewing classes — from quick repairs to
            bespoke creations. Located in the heart of Brooklyn.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Scissors className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">Professional Alterations</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Ruler className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">Custom Garments</span>
            </div>
            <div className="flex items-center gap-2 bg-accent-warm/10 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-accent-warm" />
              <span className="font-body text-sm text-gray-dark">Sewing Classes</span>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Service Cards */}
          <div className="space-y-4">
            {sewingServices.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                  selectedService === service.id
                    ? "bg-white border-2 border-accent-warm shadow-lg"
                    : "bg-white/50 border border-gray-light hover:bg-white hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-accent-warm mt-1">
                    {serviceIcons[service.iconName]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-medium text-gray-darkest mb-2">
                      {service.title}
                    </h3>
                    <p className="font-body text-gray-dark mb-3">{service.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="font-mono text-xs px-3 py-1 bg-gray-lightest rounded-full text-gray-dark">
                        {service.turnaround}
                      </span>
                      <span className="font-mono text-xs px-3 py-1 bg-accent-warm/10 rounded-full text-accent-warm font-medium">
                        Contact for quote
                      </span>
                    </div>
                  </div>
                  {selectedService === service.id && (
                    <CheckCircle className="w-6 h-6 text-accent-warm flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Service Details */}
          <div className="sticky top-32">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-light">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-accent-warm">
                  {serviceIcons[sewingServices.find(s => s.id === selectedService)?.iconName || "Scissors"]}
                </div>
                <h3 className="font-display text-2xl font-medium text-gray-darkest">
                  {sewingServices.find(s => s.id === selectedService)?.title}
                </h3>
              </div>

              <div className="mb-8">
                <h4 className="font-body font-medium text-gray-darkest mb-4">What We Offer:</h4>
                <ul className="space-y-3">
                  {sewingServices.find(s => s.id === selectedService)?.services.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-warm mt-2 flex-shrink-0" />
                      <span className="font-body text-gray-dark">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-lightest/50 rounded-xl">
                <div>
                  <h4 className="font-body text-xs tracking-widest uppercase text-gray-dark mb-1">Turnaround</h4>
                  <p className="font-body font-medium text-gray-darkest">
                    {sewingServices.find(s => s.id === selectedService)?.turnaround}
                  </p>
                </div>
                <div>
                  <h4 className="font-body text-xs tracking-widest uppercase text-gray-dark mb-1">Pricing</h4>
                  <p className="font-body font-medium text-accent-warm">
                    Contact for quote
                  </p>
                </div>
                <div className="col-span-2">
                  <h4 className="font-body text-xs tracking-widest uppercase text-gray-dark mb-1">Best For</h4>
                  <p className="font-body text-gray-dark">
                    {sewingServices.find(s => s.id === selectedService)?.bestFor}
                  </p>
                </div>
              </div>

              <Link
                href="#consultation-form"
                className="block w-full bg-accent-warm text-white font-body text-sm tracking-widest uppercase py-4 px-8 rounded-lg text-center hover:bg-accent-warm/90 transition-colors duration-300"
              >
                Book a Consultation
                <ArrowRight className="inline-block ml-2 w-4 h-4" />
              </Link>
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
                How do I prepare for my first sewing class?
              </h4>
              <p className="font-body text-gray-dark">
                Just bring yourself! We provide all sewing machines, tools, and materials for beginners. Wear comfortable clothing and tie back long hair.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                Do I need my own sewing machine?
              </h4>
              <p className="font-body text-gray-dark">
                No. Our studio is fully equipped with modern sewing machines, sergers, and all necessary tools. You're welcome to bring your own machine if you prefer.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                How long do alterations typically take?
              </h4>
              <p className="font-body text-gray-dark">
                Most alterations are completed within 2–5 business days. Rush service (24–48 hours) is available for an additional fee — just ask!
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-light">
              <h4 className="font-body font-medium text-gray-darkest mb-3">
                Can I bring my own fabric for custom garments?
              </h4>
              <p className="font-body text-gray-dark">
                Absolutely. We also offer fabric sourcing assistance if you need help choosing the right material for your project.
              </p>
            </div>
          </div>
        </div>

        {/* Consultation Form */}
        <div id="consultation-form" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-light mb-20">
          <h2 className="font-display text-3xl font-light text-gray-darkest text-center mb-8">
            Book a Consultation
          </h2>
          <p className="font-body text-gray-dark text-center mb-10 max-w-xl mx-auto">
            Tell us about your project and we'll get back to you within 24 hours with a
            quote and availability.
          </p>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                  Your Name *
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

            <div>
              <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                Service Interested In *
              </label>
              <select className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none">
                <option value="">Select a service</option>
                <option value="alterations">Alterations & Tailoring</option>
                <option value="custom">Custom Clothing Design</option>
                <option value="repairs">Repairs & Restoration</option>
                <option value="home-decor">Home Decor Sewing</option>
                <option value="class-beginner">Sewing 101: Machine Basics</option>
                <option value="class-pattern">Pattern Making Fundamentals</option>
                <option value="class-alterations">Alterations & Mending Workshop</option>
                <option value="class-teens">Fashion Design for Teens</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-sm font-medium text-gray-darkest mb-2">
                Describe Your Project *
              </label>
              <textarea
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-light rounded-lg font-body text-gray-dark focus:border-accent-warm focus:outline-none"
                placeholder="Tell us about what you need — garment type, fabric, timeline, any special requirements..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-warm text-white font-body text-sm tracking-widest uppercase py-4 px-8 rounded-lg hover:bg-accent-warm/90 transition-colors duration-300"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
