"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, Laptop, Send, Sparkles } from "lucide-react";
import { useInView } from "@/lib/useInView";

type FormStatus = "idle" | "sending" | "sent" | "error";

const initialForm = {
  parentName: "",
  studentName: "",
  studentAge: "",
  email: "",
  phone: "",
  experience: "",
  notes: "",
  smsConsent: false,
};

export default function DigitalArtClasses() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { threshold: 0.1 });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState(initialForm);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value =
      event.target instanceof HTMLInputElement && event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setForm((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const message = [
      "Digital Art Classes — 4-Week Introductory Program registration",
      `Student: ${form.studentName}`,
      `Student age: ${form.studentAge}`,
      `Digital art experience: ${form.experience || "Not provided"}`,
      `Notes: ${form.notes || "None"}`,
    ].join("\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.parentName,
          email: form.email,
          phone: form.phone,
          interest: "Digital Art Classes",
          message,
          smsConsent: form.smsConsent,
        }),
      });

      if (!response.ok) throw new Error("Registration could not be submitted");

      setForm(initialForm);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="digital-art" className="relative overflow-hidden bg-gray-darkest py-24 md:py-32">
      <div className="absolute -right-28 top-10 h-80 w-80 rounded-full border border-accent-warm/15" />
      <div className="absolute -right-10 top-28 h-48 w-48 rounded-full border border-accent-warm/20" />

      <div
        ref={sectionRef}
        className={`relative mx-auto max-w-7xl px-6 transition-all duration-1000 lg:px-12 ${
          inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center">
            <div className="relative mb-10 overflow-hidden border border-white/10 bg-white shadow-2xl">
              <Image
                src="/images/digital-art-classes-how-i-see-myself.jpg"
                alt="How I See Myself digital art lessons poster with a winged fantasy character and class details"
                width={989}
                height={1280}
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="h-auto w-full"
                priority={false}
              />
            </div>

            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-8 bg-accent-warm" />
              <span className="font-mono text-[10px] uppercase tracking-ultra text-accent-warm">
                New at Luna Art Studio
              </span>
            </div>

            <div className="mb-8 flex h-14 w-14 items-center justify-center border border-accent-warm/40 text-accent-warm">
              <Laptop size={24} strokeWidth={1.4} />
            </div>

            <h2 className="font-display text-5xl font-light leading-[0.95] text-white md:text-7xl">
              Digital Art
              <br />
              <span className="italic text-accent-warm">Classes</span>
            </h2>

            <div className="my-9 flex flex-wrap items-center gap-4">
              <span className="bg-accent-warm px-5 py-3 font-display text-2xl font-semibold text-gray-darkest">
                $20 / Session
              </span>
              <span className="border border-white/20 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-white/80">
                4-Week Introductory Program
              </span>
            </div>

            <div className="space-y-4 border-y border-white/10 py-7">
              {[
                "Mondays · 4:00–5:00 PM",
                "Beginner Friendly · Ages 9+",
                "Four guided, creative digital art sessions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 font-body text-white/80">
                  <Check size={15} className="shrink-0 text-accent-warm" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-9 font-display text-3xl font-light italic text-white">
              Explore. Create. Express Yourself.
            </p>
          </div>

          <div className="bg-white p-7 shadow-2xl sm:p-10">
            {status === "sent" ? (
              <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center border border-accent-warm/50 text-accent-warm-dark">
                  <Sparkles size={24} />
                </div>
                <h3 className="mb-3 font-display text-4xl font-light text-gray-darkest">
                  Registration Received
                </h3>
                <p className="max-w-sm font-body text-sm font-light leading-relaxed text-gray-darker">
                  Thank you! We will contact you within 24 hours to confirm availability and next
                  steps.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 border-b border-accent-warm font-mono text-[10px] uppercase tracking-widest text-accent-warm-dark"
                >
                  Register another student
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-warm-dark">
                    Reserve a spot
                  </p>
                  <h3 className="font-display text-4xl font-light text-gray-darkest">
                    Digital Art Registration
                  </h3>
                  <p className="mt-3 font-body text-sm font-light text-gray-darker">
                    Complete the form below. We will confirm your place within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Parent / Guardian Name" name="parentName" value={form.parentName} onChange={handleChange} required />
                    <FormField label="Student Name" name="studentName" value={form.studentName} onChange={handleChange} required />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Student Age" name="studentAge" type="number" min="9" value={form.studentAge} onChange={handleChange} required />
                    <FormField label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                  </div>
                  <FormField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />

                  <div>
                    <FormLabel htmlFor="digital-experience">Digital Art Experience</FormLabel>
                    <select
                      id="digital-experience"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-lighter bg-white px-4 py-3 font-body text-sm text-gray-darkest outline-none transition-colors focus:border-accent-warm"
                    >
                      <option value="">Select one...</option>
                      <option value="None — complete beginner">None — complete beginner</option>
                      <option value="A little experience">A little experience</option>
                      <option value="Regularly creates digital art">Regularly creates digital art</option>
                    </select>
                  </div>

                  <div>
                    <FormLabel htmlFor="digital-notes">Notes (optional)</FormLabel>
                    <textarea
                      id="digital-notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Questions, learning goals, or anything we should know..."
                      className="w-full resize-none border border-gray-lighter bg-white px-4 py-3 font-body text-sm text-gray-darkest outline-none transition-colors placeholder:text-gray/70 focus:border-accent-warm"
                    />
                  </div>

                  <label className="flex items-start gap-3 border border-gray-lighter bg-white-warm p-4">
                    <input
                      type="checkbox"
                      name="smsConsent"
                      checked={form.smsConsent}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-accent-warm-dark"
                    />
                    <span className="font-body text-[11px] font-light leading-5 text-gray-darker">
                      I agree to receive registration confirmations, class reminders, and schedule
                      updates by text. Message and data rates may apply. Reply STOP to opt out.
                      Consent is not a condition of purchase. See our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
                    </span>
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="flex items-center justify-center gap-3 bg-accent-warm-dark px-8 py-4 font-body text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#714817] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "sending" ? "Submitting..." : "Submit Registration"}
                      <Send size={13} />
                    </button>
                    {status === "error" ? (
                      <p role="alert" className="font-body text-xs text-red-700">
                        We could not submit the form. Please try again.
                      </p>
                    ) : null}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FormLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-gray-darker">
      {children}
    </label>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: string;
}) {
  const id = `digital-${name}`;
  return (
    <div>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <input
        id={id}
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-lighter bg-white px-4 py-3 font-body text-sm text-gray-darkest outline-none transition-colors focus:border-accent-warm"
      />
    </div>
  );
}
