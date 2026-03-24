"use client";
import { useRef, useState, useEffect } from "react";
import { useInView } from "@/lib/useInView";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const artworks = [
  {
    "id": 1,
    "title": "Golden Hour",
    "medium": "Oil on Canvas",
    "size": "24 × 36 in",
    "year": "2024",
    "color": "from-amber-900/40 to-gold/20",
    "accent": "#c9a96e",
    "available": true,
    "price": "$1,200",
    "imagePath": "/images/artworks/artwork1.jpg"
  },
  {
    "id": 2,
    "title": "Sage Silence",
    "medium": "Watercolor",
    "size": "18 × 24 in",
    "year": "2024",
    "color": "from-sage/30 to-emerald-900/20",
    "accent": "#7a8c7e",
    "available": false,
    "price": "$680",
    "imagePath": "/images/artworks/artwork2.jpg"
  },
  {
    "id": 3,
    "title": "Terra Firma",
    "medium": "Acrylic & Charcoal",
    "size": "30 × 40 in",
    "year": "2023",
    "color": "from-clay/30 to-amber-900/20",
    "accent": "#c4785a",
    "available": true,
    "price": "$1,800",
    "imagePath": "/images/artworks/artwork3.jpg"
  },
  {
    "id": 4,
    "title": "Lunar Drift",
    "medium": "Ink & Gouache",
    "size": "16 × 20 in",
    "year": "2024",
    "color": "from-slate-700/40 to-mist/20",
    "accent": "#9ba8b0",
    "available": true,
    "price": "$540",
    "imagePath": "/images/artworks/artwork4.jpg"
  },
  {
    "id": 5,
    "title": "Embers",
    "medium": "Oil Pastel",
    "size": "12 × 16 in",
    "year": "2023",
    "color": "from-red-900/30 to-amber-700/20",
    "accent": "#d4845a",
    "available": false,
    "price": "$420",
    "imagePath": "/images/artworks/artwork5.jpg"
  },
  {
    "id": 6,
    "title": "Still Waters",
    "medium": "Watercolor",
    "size": "20 × 28 in",
    "year": "2024",
    "color": "from-blue-900/30 to-cyan-900/20",
    "accent": "#6a9ab0",
    "available": true,
    "price": "$760",
    "imagePath": "/images/artworks/artwork6.jpg"
  },
  {
    "id": 7,
    "title": "Violet Dreams",
    "medium": "Mixed Media",
    "size": "22 × 30 in",
    "year": "2024",
    "color": "from-purple-900/30 to-violet-900/20",
    "accent": "#8a6bb0",
    "available": true,
    "price": "$890",
    "imagePath": "/images/artworks/artwork7.jpg"
  },
  {
    "id": 8,
    "title": "Desert Bloom",
    "medium": "Acrylic on Wood",
    "size": "20 × 24 in",
    "year": "2024",
    "color": "from-orange-900/30 to-yellow-900/20",
    "accent": "#d9a96e",
    "available": true,
    "price": "$950",
    "imagePath": "/images/artworks/artwork8.jpg"
  },
  {
    "id": 9,
    "title": "Urban Echoes",
    "medium": "Spray Paint & Collage",
    "size": "36 × 48 in",
    "year": "2024",
    "color": "from-gray-800/40 to-slate-600/20",
    "accent": "#6a7a8e",
    "available": true,
    "price": "$2,200",
    "imagePath": "/images/artworks/artwork9.jpg"
  },
  {
    "id": 10,
    "title": "Coastal Memory",
    "medium": "Watercolor & Ink",
    "size": "14 × 18 in",
    "year": "2023",
    "color": "from-teal-900/30 to-blue-900/20",
    "accent": "#5a9a8e",
    "available": false,
    "price": "$580",
    "imagePath": "/images/artworks/artwork10.jpg"
  },
  {
    "id": 11,
    "title": "Mountain Mist",
    "medium": "Oil on Linen",
    "size": "28 × 36 in",
    "year": "2024",
    "color": "from-blue-800/40 to-gray-900/20",
    "accent": "#7a8a9e",
    "available": true,
    "price": "$1,500",
    "imagePath": "/images/artworks/artwork11.jpg"
  },
  {
    "id": 12,
    "title": "Autumn Light",
    "medium": "Pastel on Paper",
    "size": "16 × 20 in",
    "year": "2023",
    "color": "from-red-800/30 to-orange-900/20",
    "accent": "#c96a5a",
    "available": true,
    "price": "$720",
    "imagePath": "/images/artworks/artwork12.jpg"
  }
];

function ArtCard({ art, delay }: { art: (typeof artworks)[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative cursor-pointer transition-all duration-700 flex-shrink-0 w-full`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artwork image */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${art.color} border border-white/5 overflow-hidden`}>
        <Image
          src={art.imagePath}
          alt={`${art.title} - ${art.medium}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={art.id <= 3}
        />
        
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-ink/90 flex flex-col justify-end p-5 transition-all duration-400 ${hovered ? "opacity-100" : "opacity-0"}`}
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Calculate total groups (6 items per view, 2 columns × 3 rows)
  const itemsPerView = 6;
  const totalGroups = Math.ceil(artworks.length / itemsPerView);
  
  // Update scroll buttons state
  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px tolerance
    }
  };
  
  // Scroll to specific group
  const scrollToGroup = (groupIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / artworks.length;
      const scrollPosition = groupIndex * (itemsPerView * itemWidth);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentIndex(groupIndex);
    }
  };
  
  // Scroll left/right
  const scrollLeft = () => {
    if (currentIndex > 0) {
      scrollToGroup(currentIndex - 1);
    }
  };
  
  const scrollRight = () => {
    if (currentIndex < totalGroups - 1) {
      scrollToGroup(currentIndex + 1);
    }
  };
  
  // Handle scroll events
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons(); // Initial check
      
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollLeft();
      } else if (e.key === 'ArrowRight') {
        scrollRight();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <section id="gallery" className="py-32 bg-ink relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[20rem] font-light text-parchment/[0.02] leading-none select-none pointer-events-none pr-4">
        02
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-gold/60" />
              <span className="font-mono text-[10px] tracking-ultra uppercase text-gold/60" style={{ letterSpacing: "0.35em" }}>
                Featured Gallery
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-light text-parchment leading-tight">
              Scroll Through <span className="italic text-gold">Art</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-body text-parchment/40 max-w-sm font-light leading-relaxed text-sm">
              Explore our curated collection. Scroll horizontally to view more works.
              Each piece tells a unique story. <span className="text-gold/60">Purchase inquiries welcome.</span>
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-parchment/30" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Sold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-2 border ${canScrollLeft ? 'border-gold/40 text-gold hover:bg-gold/10' : 'border-parchment/10 text-parchment/20 cursor-not-allowed'} transition-all duration-300`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 border ${canScrollRight ? 'border-gold/40 text-gold hover:bg-gold/10' : 'border-parchment/10 text-parchment/20 cursor-not-allowed'} transition-all duration-300`}
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
            <span className="font-mono text-[10px] tracking-widest uppercase text-parchment/40">
              {currentIndex + 1} / {totalGroups}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-widest uppercase text-parchment/30">Use ← → arrows or drag to scroll</span>
          </div>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 lg:gap-6" style={{ width: `${artworks.length * 25}%` }}>
              {/* Group artworks into sets of 6 (2 columns × 3 rows) */}
              {Array.from({ length: totalGroups }).map((_, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className="flex-shrink-0 w-full"
                  style={{ width: '100vw', maxWidth: 'calc(100vw - 3rem)' }}
                >
                  <div className="grid grid-cols-2 gap-4 lg:gap-6">
                    {artworks.slice(groupIndex * itemsPerView, (groupIndex + 1) * itemsPerView).map((art, index) => (
                      <ArtCard 
                        key={art.id} 
                        art={art} 
                        delay={index * 80} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Scroll gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-ink to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalGroups }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToGroup(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-gold scale-125' : 'bg-parchment/20 hover:bg-parchment/40'}`}
              aria-label={`Go to group ${index + 1}`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-14 text-center">
          <p className="font-mono text-[10px] tracking-widest uppercase text-parchment/30 mb-4">
            Full collection available by appointment • {artworks.length} works in total
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 font-body text-xs tracking-widest uppercase text-gold border-b border-gold/30 pb-0.5 hover:border-gold transition-colors duration-300"
          >
            Schedule a Private Viewing →
          </a>
        </div>
      </div>
    </section>
  );
}