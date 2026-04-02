"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";
import { Send, MapPin, Clock, Mail, Phone } from "lucide-react";

const interests = [
  "Foundation Drawing",
  "Oil Painting",
  "Watercolor & Ink",
  "Figure Drawing",
  "Acrylic Abstraction",
  "Kids Art Camp",
  "Gallery / Purchase",
  "Open Studio",
  "Private Lesson",
  "Other",
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.15 });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", interest: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60" style={{ letterSpacing: "0.35em" }}>
              Get in Touch
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
            Start Your{" "}
            <span className="italic text-accent-warm">Journey</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Info panel */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <p className="font-body text-gray-dark leading-relaxed font-light">
              Whether you want to register for a class, inquire about a piece of artwork,
              arrange a studio visit, or simply say hello — we would love to hear from you.
            </p>

            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Studio", value: "258 King George Rd, Warren, NJ 07059, USA" },
                { icon: Clock, label: "Hours", value: "Mon–Fri 9AM–8PM · Sat–Sun 10AM–6PM" },
                { icon: Mail, label: "Email", value: "Ninglu1088@gmail.com" },
                { icon: Phone, label: "WeChat", value: "happyevan999" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-8 h-8 border border-gray-lighter flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={12} className="text-accent-warm/60" />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker-darker mb-1">{label}</p>
                    <p className="font-body text-sm text-gray-darkest/60 font-light">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative quote */}
            <div className="border-l border-gray-light pl-6 mt-4">
              <p className="font-display text-xl italic text-accent-warm/60 font-light leading-relaxed">
                "Every artist was first an amateur."
              </p>
              <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker-darker mt-3">— Ralph Waldo Emerson</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-gray-lightest">
                <div className="w-14 h-14 border border-gray-light flex items-center justify-center mb-6">
                  <Send size={18} className="text-accent-warm" />
                </div>
                <h3 className="font-display text-3xl text-gray-darkest font-light mb-3">Message Received</h3>
                <p className="font-body text-gray-dark text-sm font-light max-w-sm">
                  Thank you for reaching out. We will be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-8 font-mono text-[10px] tracking-widest uppercase text-accent-warm border-b border-gray-light pb-0.5 hover:border-accent-warm transition-colors"
                >
                  Send Another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field
                    label="Full Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Field
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Field
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="block font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">
                      I'm interested in
                    </label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-lightest px-4 py-3 font-body text-sm text-gray-darkest focus:border-accent-warm focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Select an area...</option>
                      {interests.map((i) => (
                        <option key={i} value={i} className="bg-white text-gray-darkest">
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us a little about yourself and what you are looking for..."
                    className="w-full bg-white border border-gray-lightest px-4 py-3 font-body text-sm text-gray-darkest placeholder:text-gray-darkest/20 focus:border-accent-warm focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex items-center gap-3 px-10 py-4 bg-accent-warm text-white font-body text-xs tracking-widest uppercase font-medium hover:bg-accent-warm/90 transition-all duration-300 disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending..." : "Send Inquiry"}
                    <Send size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  {status === "error" && (
                    <p className="font-mono text-[9px] tracking-wide text-accent-warm uppercase">
                      Something went wrong. Try again.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, type, value, onChange, required,
}: {
  label: string; name: string; type: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white border border-gray-lightest px-4 py-3 font-body text-sm text-gray-darkest placeholder:text-gray-darkest/20 focus:border-accent-warm focus:outline-none transition-colors"
      />
    </div>
  );
}
