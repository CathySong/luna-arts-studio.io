"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  MapPin,
  Palette,
} from "lucide-react";

import {
  GOOGLE_MAPS_PLACE_URL,
  reviewExperienceOptions,
  type ReviewExperienceId,
  type ReviewLanguage,
} from "@/config/google-review";

type ReviewOption = {
  id: string;
  title: string;
  body: string;
  keywordsUsed: string[];
};

type Step = "compose" | "choose" | "posted";

const roles = [
  { id: "parent", label: "Parent", labelZh: "家长" },
  { id: "adult", label: "Adult student", labelZh: "成人学员" },
  { id: "teen", label: "Teen student", labelZh: "青少年" },
  { id: "visitor", label: "Visitor / friend", labelZh: "访客" },
] as const;

const languages: { id: ReviewLanguage; label: string }[] = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "bilingual", label: "EN + 中文" },
];

export default function GoogleReviewGenerator() {
  const [step, setStep] = useState<Step>("compose");
  const [experienceId, setExperienceId] =
    useState<ReviewExperienceId>("creative");
  const [language, setLanguage] = useState<ReviewLanguage>("en");
  const [roleId, setRoleId] = useState<(typeof roles)[number]["id"]>("parent");
  const [highlight, setHighlight] = useState("");
  const [reviews, setReviews] = useState<ReviewOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selected = reviews.find((r) => r.id === selectedId) ?? null;

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedId(null);
    setCopied(false);

    const role = roles.find((r) => r.id === roleId);
    const reviewerRole = role
      ? `${role.label} / ${role.labelZh}`
      : "satisfied customer";

    try {
      const res = await fetch("/api/google-reviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          language,
          highlight,
          reviewerRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }
      setReviews(data.reviews);
      setStep("choose");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [experienceId, language, highlight, roleId]);

  const copyAndGo = useCallback(async (review: ReviewOption) => {
    setSelectedId(review.id);
    try {
      await navigator.clipboard.writeText(review.body);
      setCopied(true);
    } catch {
      // Fallback: still open Maps; user can copy manually
      setCopied(false);
    }
    setStep("posted");
    window.open(GOOGLE_MAPS_PLACE_URL, "_blank", "noopener,noreferrer");
  }, []);

  const copyAgain = useCallback(async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.body);
      setCopied(true);
    } catch {
      setError("Could not copy — please select the text manually");
    }
  }, [selected]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Handmade atmospheric layers */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(122, 140, 126, 0.18), transparent 55%),
            radial-gradient(ellipse 70% 45% at 95% 15%, rgba(196, 120, 90, 0.12), transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(155, 168, 176, 0.16), transparent 55%),
            linear-gradient(165deg, #f7f4ef 0%, #efe8df 42%, #e8efe9 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Ink brush accent strokes */}
      <svg
        className="pointer-events-none absolute -left-8 top-24 h-64 w-48 opacity-20"
        viewBox="0 0 120 200"
        aria-hidden
      >
        <path
          d="M20 10 C40 40, 10 70, 35 100 S10 150, 40 190"
          fill="none"
          stroke="#3a3a36"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M55 20 C70 55, 45 90, 68 130 S50 170, 72 195"
          fill="none"
          stroke="#7a8c7e"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -right-4 bottom-32 h-56 w-40 opacity-15"
        viewBox="0 0 100 180"
        aria-hidden
      >
        <path
          d="M80 5 C50 40, 90 80, 55 110 S85 150, 40 175"
          fill="none"
          stroke="#c4785a"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10 sm:px-8 sm:py-14">
        {/* Brand hero — one composition */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mx-auto mb-6 h-px w-16 origin-center bg-[#7a8c7e]/60"
          />
          <p
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-[#7a8c7e]"
          >
            Google Review Studio
          </p>
          <h1 className="font-display text-5xl font-light leading-[1.05] tracking-tight text-[#2f2e2b] sm:text-6xl md:text-7xl">
            Luna{" "}
            <span className="italic text-[#8a6a4a]">Art</span> Studio
          </h1>
          <p className="mx-auto mt-5 max-w-md font-body text-sm font-light leading-relaxed text-[#5c5a55] sm:text-base">
            Craft a warm, keyword-rich Google review in seconds — then post it
            on our Maps page to help neighbors find our Warren NJ art classes.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 text-[#7a8c7e]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Warren, New Jersey
            </span>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {step === "compose" && (
            <motion.section
              key="compose"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="flex flex-1 flex-col"
            >
              <label className="mb-3 block font-display text-xl italic text-[#2f2e2b]">
                What did you experience?
              </label>
              <div className="mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {reviewExperienceOptions.map((opt, i) => {
                  const active = experienceId === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i, duration: 0.4 }}
                      onClick={() => setExperienceId(opt.id)}
                      className={`group relative overflow-hidden px-3 py-3.5 text-left transition-colors duration-300 ${
                        active
                          ? "bg-[#2f2e2b] text-[#f7f4ef]"
                          : "bg-white/45 text-[#3a3935] hover:bg-white/70"
                      }`}
                      style={{
                        borderRadius: "2px 12px 2px 12px",
                        boxShadow: active
                          ? "none"
                          : "inset 0 0 0 1px rgba(47,46,43,0.08)",
                      }}
                    >
                      <span className="block font-body text-sm font-medium">
                        {opt.label}
                      </span>
                      <span
                        className={`mt-0.5 block font-mono text-[10px] tracking-wide ${
                          active ? "text-[#c9b8a0]" : "text-[#8a8882]"
                        }`}
                      >
                        {opt.labelZh}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mb-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8882]">
                    Language
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setLanguage(lang.id)}
                        className={`px-3 py-1.5 font-body text-xs transition-colors ${
                          language === lang.id
                            ? "bg-[#7a8c7e] text-white"
                            : "bg-white/50 text-[#5c5a55] hover:bg-white/80"
                        }`}
                        style={{ borderRadius: "2px 10px 2px 10px" }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8882]">
                    I am a…
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setRoleId(role.id)}
                        className={`px-3 py-1.5 font-body text-xs transition-colors ${
                          roleId === role.id
                            ? "bg-[#c4785a]/90 text-white"
                            : "bg-white/50 text-[#5c5a55] hover:bg-white/80"
                        }`}
                        style={{ borderRadius: "10px 2px 10px 2px" }}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label
                htmlFor="highlight"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8882]"
              >
                Optional — one thing you loved
              </label>
              <textarea
                id="highlight"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                maxLength={280}
                rows={3}
                placeholder="e.g. patient teachers, my daughter’s first oil painting, cozy studio vibe…"
                className="mb-8 w-full resize-none border-0 bg-white/55 px-4 py-3 font-body text-sm font-light text-[#2f2e2b] outline-none ring-1 ring-[#2f2e2b]/10 placeholder:text-[#a09e97] focus:ring-[#7a8c7e]/40"
                style={{ borderRadius: "4px 16px 4px 16px" }}
              />

              {error && (
                <p className="mb-4 font-body text-sm text-[#a85a45]">{error}</p>
              )}

              <button
                type="button"
                onClick={generate}
                disabled={loading}
                className="group relative mx-auto flex w-full max-w-sm items-center justify-center gap-2.5 overflow-hidden bg-[#2f2e2b] px-8 py-4 font-body text-sm tracking-wide text-[#f7f4ef] transition-transform duration-300 hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                style={{ borderRadius: "2px 18px 2px 18px" }}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(201,169,110,0.25) 50%, transparent 60%)",
                  }}
                />
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Painting your words…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-[#c9a96e]" />
                    Generate 2 reviews
                  </>
                )}
              </button>

              <p className="mt-6 text-center font-body text-xs font-light text-[#8a8882]">
                Reviews include course &amp; local keywords to support SEO / GEO —
                still written to sound like you.
              </p>
            </motion.section>
          )}

          {step === "choose" && (
            <motion.section
              key="choose"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-light text-[#2f2e2b]">
                    Choose your voice
                  </h2>
                  <p className="mt-1 font-body text-sm font-light text-[#5c5a55]">
                    Tap one to copy &amp; open Google Maps — then paste &amp; post.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generate}
                  disabled={loading}
                  className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a8c7e] hover:text-[#2f2e2b]"
                >
                  {loading ? "…" : "Regenerate"}
                </button>
              </div>

              {error && (
                <p className="mb-4 font-body text-sm text-[#a85a45]">{error}</p>
              )}

              <div className="flex flex-col gap-5">
                {reviews.map((review, i) => (
                  <motion.button
                    key={review.id}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    onClick={() => copyAndGo(review)}
                    className="group relative w-full overflow-hidden bg-white/60 p-6 text-left transition-all duration-300 hover:bg-white/85 hover:shadow-[0_12px_40px_rgba(47,46,43,0.08)] sm:p-7"
                    style={{
                      borderRadius: i % 2 === 0 ? "4px 28px 4px 28px" : "28px 4px 28px 4px",
                      boxShadow: "inset 0 0 0 1px rgba(47,46,43,0.06)",
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="font-display text-lg italic text-[#8a6a4a]">
                        {review.title}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#7a8c7e] opacity-0 transition-opacity group-hover:opacity-100">
                        Select
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                    <p className="font-body text-[15px] font-light leading-relaxed text-[#3a3935]">
                      {review.body}
                    </p>
                    {review.keywordsUsed.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#2f2e2b]/06 pt-3">
                        <Palette className="mr-1 h-3 w-3 text-[#c9a96e]" />
                        {review.keywordsUsed.map((kw) => (
                          <span
                            key={kw}
                            className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8a8882]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep("compose");
                  setReviews([]);
                }}
                className="mt-8 block w-full text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8882] hover:text-[#2f2e2b]"
              >
                ← Edit preferences
              </button>
            </motion.section>
          )}

          {step === "posted" && selected && (
            <motion.section
              key="posted"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-[#7a8c7e] text-white"
                style={{ borderRadius: "40% 60% 55% 45%" }}
              >
                <Check className="h-6 w-6" strokeWidth={1.75} />
              </motion.div>
              <h2 className="font-display text-3xl font-light text-[#2f2e2b] sm:text-4xl">
                Review copied
              </h2>
              <p className="mx-auto mt-3 max-w-sm font-body text-sm font-light leading-relaxed text-[#5c5a55]">
                Google Maps opened in a new tab. Paste your review there, leave
                5 stars if you loved us, and hit Post — thank you for helping
                Luna Art Studio shine in Warren NJ.
              </p>

              <div
                className="mx-auto mt-8 max-w-lg bg-white/65 p-5 text-left sm:p-6"
                style={{
                  borderRadius: "4px 24px 4px 24px",
                  boxShadow: "inset 0 0 0 1px rgba(47,46,43,0.06)",
                }}
              >
                <p className="font-body text-sm font-light leading-relaxed text-[#3a3935]">
                  {selected.body}
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={copyAgain}
                  className="inline-flex items-center gap-2 bg-[#2f2e2b] px-6 py-3 font-body text-sm text-[#f7f4ef]"
                  style={{ borderRadius: "2px 14px 2px 14px" }}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#c9a96e]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied again" : "Copy again"}
                </button>
                <a
                  href={GOOGLE_MAPS_PLACE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 font-body text-sm text-[#2f2e2b] ring-1 ring-[#2f2e2b]/15 hover:bg-white/50"
                  style={{ borderRadius: "14px 2px 14px 2px" }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Google Maps
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep("compose");
                  setReviews([]);
                  setSelectedId(null);
                  setCopied(false);
                }}
                className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8882] hover:text-[#2f2e2b]"
              >
                Write another
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        <footer className="mt-auto pt-14 text-center">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#a09e97]">
            Luna Art Studio · Handmade reviews for local discovery
          </p>
        </footer>
      </div>
    </div>
  );
}
