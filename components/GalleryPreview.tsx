"use client";
import { useRef, useState, useEffect } from "react";
import { useInView } from "@/lib/useInView";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define artwork types
type Artwork = {
  id: number;
  title: string;
  medium: string;
  size: string;
  year: string;
  color: string;
  accent: string;
  available: boolean;
  price: string;
  imagePath: string;
  category: "oil" | "sketch" | "handicraft";
};

// Oil Paintings
const oilPaintings: Artwork[] = [
  {
    "id": 1,
    "title": "Sunset Over Mountains",
    "medium": "Oil on Canvas",
    "size": "30 × 40 in",
    "year": "2024",
    "color": "from-orange-100 to-purple-100",
    "accent": "#d4b483",
    "available": true,
    "price": "$2,500",
    "imagePath": "/images/artworks/oil-paintings/oil1.jpg",
    "category": "oil"
  },
  {
    "id": 2,
    "title": "Forest Path",
    "medium": "Oil on Linen",
    "size": "24 × 36 in",
    "year": "2024",
    "color": "from-green-100 to-emerald-100",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$1,800",
    "imagePath": "/images/artworks/oil-paintings/oil2.jpg",
    "category": "oil"
  },
  {
    "id": 3,
    "title": "Ocean Waves",
    "medium": "Oil on Canvas",
    "size": "36 × 48 in",
    "year": "2024",
    "color": "from-blue-100 to-teal-100",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$3,200",
    "imagePath": "/images/artworks/oil-paintings/oil3.jpg",
    "category": "oil"
  },
  {
    "id": 4,
    "title": "Autumn Leaves",
    "medium": "Oil on Board",
    "size": "20 × 24 in",
    "year": "2023",
    "color": "from-red-50 to-orange-50",
    "accent": "#d4b483",
    "available": false,
    "price": "$1,200",
    "imagePath": "/images/artworks/oil-paintings/oil4.jpg",
    "category": "oil"
  },
  {
    "id": 5,
    "title": "Mountain Lake",
    "medium": "Oil on Canvas",
    "size": "28 × 36 in",
    "year": "2024",
    "color": "from-blue-100 to-gray-100",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$2,800",
    "imagePath": "/images/artworks/oil-paintings/oil5.jpg",
    "category": "oil"
  },
  {
    "id": 6,
    "title": "Floral Still Life",
    "medium": "Oil on Canvas",
    "size": "18 × 24 in",
    "year": "2024",
    "color": "from-pink-100 to-purple-100",
    "accent": "#d4b483",
    "available": true,
    "price": "$1,500",
    "imagePath": "/images/artworks/oil-paintings/oil6.jpg",
    "category": "oil"
  },
  {
    "id": 7,
    "title": "Desert Sunrise",
    "medium": "Oil on Wood",
    "size": "22 × 28 in",
    "year": "2024",
    "color": "from-amber-100 to-yellow-100",
    "accent": "#d4b483",
    "available": true,
    "price": "$1,900",
    "imagePath": "/images/artworks/oil-paintings/oil7.jpg",
    "category": "oil"
  },
  {
    "id": 8,
    "title": "Coastal Cliffs",
    "medium": "Oil on Canvas",
    "size": "30 × 40 in",
    "year": "2024",
    "color": "from-gray-100 to-blue-100",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$2,600",
    "imagePath": "/images/artworks/oil-paintings/oil8.jpg",
    "category": "oil"
  }
];

// Sketches
const sketches: Artwork[] = [
  {
    "id": 2,
    "title": "Sage Silence",
    "medium": "Charcoal & Graphite",
    "size": "18 × 24 in",
    "year": "2024",
    "color": "from-gray-100 to-gray-200",
    "accent": "#a8b8a8",
    "available": false,
    "price": "$680",
    "imagePath": "/images/artworks/artwork2.jpg",
    "category": "sketch"
  },
  {
    "id": 4,
    "title": "Lunar Drift",
    "medium": "Ink & Graphite",
    "size": "16 × 20 in",
    "year": "2024",
    "color": "from-gray-100 to-gray-200",
    "accent": "#c0c0c0",
    "available": true,
    "price": "$540",
    "imagePath": "/images/artworks/artwork4.jpg",
    "category": "sketch"
  },
  {
    "id": 5,
    "title": "Embers",
    "medium": "Charcoal & Pastel",
    "size": "12 × 16 in",
    "year": "2023",
    "color": "from-gray-100 to-gray-200",
    "accent": "#d4b483",
    "available": false,
    "price": "$420",
    "imagePath": "/images/artworks/artwork5.jpg",
    "category": "sketch"
  },
  {
    "id": 9,
    "title": "Urban Echoes",
    "medium": "Graphite & Ink",
    "size": "24 × 36 in",
    "year": "2024",
    "color": "from-gray-100 to-gray-200",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$750",
    "imagePath": "/images/artworks/artwork9.jpg",
    "category": "sketch"
  },
  {
    "id": 15,
    "title": "Morning Lines",
    "medium": "Pen & Ink",
    "size": "14 × 18 in",
    "year": "2024",
    "color": "from-gray-100 to-gray-200",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$380",
    "imagePath": "/images/artworks/artwork3.jpg",
    "category": "sketch"
  },
  {
    "id": 16,
    "title": "Botanical Study",
    "medium": "Graphite on Paper",
    "size": "11 × 14 in",
    "year": "2023",
    "color": "from-gray-100 to-gray-200",
    "accent": "#a8b8a8",
    "available": true,
    "price": "$320",
    "imagePath": "/images/artworks/artwork4.jpg",
    "category": "sketch"
  }
];

// Handicrafts
const handicrafts: Artwork[] = [
  {
    "id": 6,
    "title": "Still Waters",
    "medium": "Ceramic & Glaze",
    "size": "8 × 8 × 6 in",
    "year": "2024",
    "color": "from-blue-50 to-cyan-50",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$760",
    "imagePath": "/images/artworks/handicrafts/handicraft1.jpg",
    "category": "handicraft"
  },
  {
    "id": 7,
    "title": "Violet Dreams",
    "medium": "Textile & Embroidery",
    "size": "22 × 30 in",
    "year": "2024",
    "color": "from-purple-50 to-violet-50",
    "accent": "#d4b483",
    "available": true,
    "price": "$890",
    "imagePath": "/images/artworks/handicrafts/handicraft2.jpg",
    "category": "handicraft"
  },
  {
    "id": 10,
    "title": "Coastal Memory",
    "medium": "Mixed Media Collage",
    "size": "14 × 18 in",
    "year": "2023",
    "color": "from-teal-50 to-blue-50",
    "accent": "#a8b8c8",
    "available": false,
    "price": "$580",
    "imagePath": "/images/artworks/handicrafts/handicraft3.jpg",
    "category": "handicraft"
  },
  {
    "id": 12,
    "title": "Autumn Light",
    "medium": "Wood & Resin",
    "size": "16 × 20 × 2 in",
    "year": "2023",
    "color": "from-red-50 to-orange-50",
    "accent": "#d4b483",
    "available": true,
    "price": "$720",
    "imagePath": "/images/artworks/handicrafts/handicraft4.jpg",
    "category": "handicraft"
  },
  {
    "id": 17,
    "title": "Weathered Textures",
    "medium": "Clay & Natural Fibers",
    "size": "10 × 12 × 4 in",
    "year": "2024",
    "color": "from-brown-50 to-amber-50",
    "accent": "#d4b483",
    "available": true,
    "price": "$650",
    "imagePath": "/images/artworks/handicrafts/handicraft5.jpg",
    "category": "handicraft"
  },
  {
    "id": 18,
    "title": "Ocean Rhythm",
    "medium": "Glass & Metal",
    "size": "14 × 18 × 3 in",
    "year": "2024",
    "color": "from-blue-50 to-teal-50",
    "accent": "#a8b8c8",
    "available": true,
    "price": "$920",
    "imagePath": "/images/artworks/handicrafts/handicraft6.jpg",
    "category": "handicraft"
  }
];

// ArtCard Component
function ArtCard({ art, delay }: { art: Artwork; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative cursor-pointer transition-all duration-700 flex-shrink-0`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Artwork image */}
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${art.color} border border-white/5 overflow-hidden`}>
        <Image
          src={art.imagePath}
          alt={`${art.title} - ${art.medium}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 20vw"
          priority={art.id <= 3}
        />
        
        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-white/90 flex flex-col justify-end p-5 transition-all duration-400 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <p className="font-mono text-[9px] tracking-widest uppercase text-accent-warm/70 mb-1">{art.medium}</p>
          <p className="font-display text-xl text-gray-darkest font-light mb-1">{art.title}</p>
          <p className="font-mono text-[9px] text-gray-dark">{art.size} · {art.year}</p>
          {art.available && (
            <div className="mt-3 flex items-center justify-between">
              <span className="font-body text-sm text-accent-warm font-light">{art.price}</span>
              <button className="px-4 py-1.5 border border-gray-light text-accent-warm font-mono text-[9px] tracking-widest uppercase hover:bg-accent-warm hover:text-white transition-all duration-300">
                Inquire
              </button>
            </div>
          )}
          {!art.available && (
            <p className="mt-3 font-mono text-[9px] tracking-widest uppercase text-gray-darker-darker">Sold</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Gallery Section Component
function GallerySection({ 
  title, 
  description, 
  artworks, 
  sectionId 
}: { 
  title: string; 
  description: string; 
  artworks: Artwork[]; 
  sectionId: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  
  // Calculate items per view based on screen width
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 4;
    const width = window.innerWidth;
    if (width < 640) return 2; // Mobile
    if (width < 1024) return 3; // Tablet
    return 4; // Desktop
  };
  
  // Update items per view on resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const totalSlides = Math.ceil(artworks.length / itemsPerView);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setCurrentIndex(prev => Math.max(0, prev - 1));
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setCurrentIndex(prev => Math.min(totalSlides - 1, prev + 1));
    }
  };

  return (
    <div className="mb-20 last:mb-0">
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-accent-warm/60" />
          <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60" style={{ letterSpacing: "0.35em" }}>
            {sectionId}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl md:text-4xl font-light text-gray-darkest leading-tight">
              {title}
            </h3>
            <p className="font-body text-gray-dark text-sm mt-3 max-w-2xl font-light leading-relaxed">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 border border-gray-light text-accent-warm hover:bg-gray-lightest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll left"
                disabled={currentIndex === 0}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 border border-gray-light text-accent-warm hover:bg-gray-lightest transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Scroll right"
                disabled={currentIndex === totalSlides - 1}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker">
              {currentIndex + 1} of {totalSlides} • {artworks.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-4 lg:gap-6" style={{ width: `${totalSlides * 100}%` }}>
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const startIndex = slideIndex * itemsPerView;
              const slideArtworks = artworks.slice(startIndex, startIndex + itemsPerView);
              
              return (
                <div 
                  key={slideIndex} 
                  className="flex-shrink-0"
                  style={{ width: `${100 / totalSlides}%` }}
                >
                  <div className={`grid gap-4 lg:gap-6 ${
                    itemsPerView === 2 ? 'grid-cols-2' :
                    itemsPerView === 3 ? 'grid-cols-3' :
                    'grid-cols-4'
                  }`}>
                    {slideArtworks.map((art, index) => (
                      <ArtCard 
                        key={art.id} 
                        art={art} 
                        delay={index * 80} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Scroll gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Section Footer */}
      <div className="mt-6 flex items-center justify-between text-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-0.5 bg-accent-warm" />
            <span className="font-mono text-[8px] tracking-widest uppercase">{itemsPerView} per view</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-0.5 bg-accent-warm" />
            <span className="font-mono text-[8px] tracking-widest uppercase">Swipe or use arrows</span>
          </div>
        </div>
        <a
          href="#contact"
          className="font-mono text-[9px] tracking-widest uppercase text-accent-warm hover:text-accent-warm/80 transition-colors duration-300"
        >
          View All {title} →
        </a>
      </div>
    </div>
  );
}

// Main GalleryPreview Component
export default function GalleryPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  return (
    <section id="gallery" className="py-32 bg-white relative overflow-hidden">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Main Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60" style={{ letterSpacing: "0.35em" }}>
              My Gallery
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
            My <span className="italic text-accent-warm">Gallery</span>
          </h2>
          <p className="font-body text-gray-dark text-lg mt-6 max-w-2xl leading-relaxed font-light">
            Explore my artistic journey through three distinct collections. 
            Each section represents a different medium and creative approach.
          </p>
        </div>

        {/* Gallery Sections */}
        <div className="space-y-20">
          <GallerySection
            title="Oil Paintings"
            description="A collection of traditional oil paintings showcasing mastery of color, texture, and light. Each piece represents hours of meticulous brushwork and layering techniques."
            artworks={oilPaintings}
            sectionId="Collection 01"
          />
          
          <GallerySection
            title="Sketches & Drawings"
            description="Raw and expressive works on paper capturing moments of inspiration. From quick gesture drawings to detailed studies, these pieces reveal the foundation of artistic practice."
            artworks={sketches}
            sectionId="Collection 02"
          />
          
          <GallerySection
            title="Handicrafts & Mixed Media"
            description="Innovative works combining traditional craftsmanship with contemporary materials. Each piece explores texture, form, and materiality in unique ways."
            artworks={handicrafts}
            sectionId="Collection 03"
          />
        </div>

        {/* Gallery Footer */}
        <div className="mt-20 pt-10 border-t border-gray-lightest">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl text-gray-darkest font-light mb-3">Gallery Information</h3>
              <p className="font-body text-gray-dark text-sm font-light max-w-2xl">
                All artworks are original creations. Prices include framing where applicable. 
                Commission inquiries welcome for custom pieces in any of the featured styles.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              {[
                { color: "#d4b483", label: "Oil Paintings" },
                { color: "#a8b8a8", label: "Sketches" },
                { color: "#a8b8c8", label: "Handicrafts" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker-darker">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-lightest">
            <p className="font-mono text-[9px] tracking-wide uppercase text-gray-darker">
              * All prices in USD. Shipping and handling additional. Contact for international rates.
            </p>
            <a
              href="#contact"
              className="font-mono text-[9px] tracking-widest uppercase text-accent-warm border border-gray-light px-4 py-2 hover:bg-accent-warm hover:text-white transition-all duration-300"
            >
              Schedule Studio Visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}