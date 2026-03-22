"use client";
import { useRef, useState } from "react";
import { useInView } from "@/lib/useInView";

const artworks = [
  {
    id: 1,
    title: "Golden Hour",
    medium: "Oil on Canvas",
    size: "24 × 36 in",
    year: "2024",
    color: "from-amber-900/40 to-gold/20",
    accent: "#c9a96e",
    available: true,
    price: "$1,200",
  },
  {
    id: 2,
    title: "Sage Silence",
    medium: "Watercolor",
    size: "18 × 24 in",
    year: "2024",
    color: "from-sage/30 to-emerald-900/20",
    accent: "#7a8c7e",
    available: false,
    price: "$680",
  },
  {
    id: 3,
    title: "Terra Firma",
    medium: "Acrylic & Charcoal",
    size: "30 × 40 in",
    year: "2023",
    color: "from-clay/30 to-amber-900/20",
    accent: "#c4785a",
    available: true,
    price: "$1,800",
  },
  {
    id: 4,
    title: "Lunar Drift",
    medium: "Ink & Gouache",
    size: "16 × 20 in",
    year: "2024",
    color: "from-slate-700/40 to-mist/20",
    accent: "#9ba8b0",
    available: true,
    price: "$540",
  },
  {
    id: 5,
    title: "Embers",
    medium: "Oil Pastel",
    size: "12 × 16 in",
    year: "2023",
    color: "from-red-900/30 to-amber-700/20",
    accent: "#d4845a",
    available: false,
    price: "$420",
  },
  {
    id: 6,
    title: "Still Waters",
    medium: "Watercolor",
    size: "20 × 28 in",
    year: "2024",
    color: "from-blue-900/30 to-cyan-900/20",
    accent: "#6a9ab0",
    available: true,
    price: "$760",
  },
];

function ArtCard({ art, delay }: { art: (typeof artworks)[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative cursor-pointer transition-all duration-700`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artwork placeholder */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${art.color} border border-white/5 overflow-hidden`}>
        {/* Generative art pattern */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id={`grad${art.id}`} cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={art.accent} stopOpacity="0.3" />
              <stop offset="100%" stopColor={art.accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="300" height="400" fill={`url(#grad${art.id})`} />
          {art.id === 1 && (
            <>
              <circle cx="150" cy="160" r="90" fill="none" stroke={art.accent} strokeWidth="0.4" opacity="0.6" />
              <circle cx="150" cy="160" r="60" fill={art.accent} opacity="0.15" />
              <line x1="0" y1="220" x2="300" y2="180" stroke={art.accent} strokeWidth="0.3" opacity="0.4" />
              <line x1="0" y1="240" x2="300" y2="200" stroke={art.accent} strokeWidth="0.3" opacity="0.3" />
            </>
          )}
          {art.id === 2 && (
            <>
              <ellipse cx="150" cy="200" rx="100" ry="140" fill="none" stroke={art.accent} strokeWidth="0.4" opacity="0.5" />
              <path d="M50,350 Q150,200 250,350" fill={art.accent} opacity="0.1" />
              <path d="M80,320 Q150,180 220,320" fill="none" stroke={art.accent} strokeWidth="0.4" opacity="0.4" />
            </>
          )}
          {art.id === 3 && (
            <>
              <rect x="40" y="60" width="220" height="280" fill="none" stroke={art.accent} strokeWidth="0.4" opacity="0.4" />
              <rect x="70" y="90" width="160" height="220" fill={art.accent} opacity="0.08" />
              <line x1="40" y1="60" x2="260" y2="340" stroke={art.accent} strokeWidth="0.3" opacity="0.3" />
            </>
          )}
          {art.id === 4 && (
            <>
              <path d="M20,400 Q100,100 280,200 Q200,350 150,50" fill="none" stroke={art.accent} strokeWidth="0.5" opacity="0.5" />
              <circle cx="150" cy="200" r="30" fill={art.accent} opacity="0.2" />
            </>
          )}
          {art.id === 5 && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <ellipse key={i} cx={80 + i * 40} cy={200 + (i % 2) * 30} rx="20" ry="60" fill={art.accent} opacity="0.12" transform={`rotate(${i * 15} ${80 + i * 40} ${200 + (i % 2) * 30})`} />
              ))}
            </>
          )}
          {art.id === 6 && (
            <>
              <path d="M0,250 Q75,180 150,250 Q225,320 300,250" fill="none" stroke={art.accent} strokeWidth="0.5" opacity="0.6" />
              <path d="M0,230 Q75,160 150,230 Q225,300 300,230" fill="none" stroke={art.accent} strokeWidth="0.3" opacity="0.3" />
            </>
          )}
        </svg>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-ink/80 flex flex-col justify-end p-5 transition-all duration-400 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-mono text-[9px] tracking-widest uppercase text-gold/70 mb-1">{art.medium}</p>
          <p className="font-display text-xl text-parchment font-light mb-1">{art.title}</p>
          <p className="font-mono text-[9px] text-parchment/40">{art.size} · {art.year}</p>
          {art.available && (
            <div className="mt-3 flex items-center justify-between">
              <span className="font-body text-sm text-gold font-light">{art.price}</span>
              <button className="px-4 py-1.5 border border-gold/40 text-gold font-mono text-[9px] tracking-widest uppercase hover:bg-gold hover:text-ink transition-all duration-300">
                Inquire
              </button>
            </div>
          )}
          {!art.available && (
            <p className="mt-3 font-mono text-[9px] tracking-widest uppercase text-parchment/30">Sold</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPreview() {
  return (
    <section id="gallery" className="py-32 bg-ink relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-parchment/[0.02] leading-none select-none pointer-events-none pr-4">
        02
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-gold/60" />
              <span className="font-mono text-[10px] tracking-ultra uppercase text-gold/60" style={{ letterSpacing: "0.35em" }}>
                Selected Works
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-parchment leading-tight">
              The <span className="italic text-gold">Gallery</span>
            </h2>
          </div>
          <p className="font-body text-parchment/40 max-w-sm font-light leading-relaxed text-sm">
            Original works by our resident artists and instructors. Each piece tells a story.
            Hover to explore. <span className="text-gold/60">Purchase inquiries welcome.</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {artworks.map((art, i) => (
            <ArtCard key={art.id} art={art} delay={i * 80} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-parchment/30 mb-4">
            Full collection available by appointment
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 font-body text-xs tracking-widest uppercase text-gold border-b border-gold/30 pb-0.5 hover:border-gold transition-colors duration-300"
          >
            Schedule a Viewing →
          </a>
        </div>
      </div>
    </section>
  );
}
