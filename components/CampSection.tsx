"use client";
import { useRef } from "react";
import Image from "next/image";
import { useInView } from "@/lib/useInView";

export default function CampSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  const camps = [
    {
      id: 1,
      title: "One-Day Camp",
      subtitle: "Explore & Create",
      duration: "6 Hours",
      ageRange: "Ages 6-12",
      description: "Perfect for first-time campers or those looking for a creative day out. Drop-in style with no experience needed.",
      highlights: [
        "Creative icebreakers & warm-up activities",
        "Guided art projects in multiple mediums",
        "Gallery walk to appreciate peers' work",
        "Take-home art bag with supplies"
      ],
      price: "$120",
      color: "warm"
    },
    {
      id: 2,
      title: "One-Week Camp",
      subtitle: "Around the World in Art",
      duration: "5 Days, 6 Hours/Day",
      ageRange: "Ages 8-14",
      description: "An immersive cultural journey exploring artistic traditions from around the globe. Each day focuses on a different region.",
      highlights: [
        "Daily cultural themes (Japanese, African, Mexican, etc.)",
        "Traditional art techniques from each culture",
        "Cultural storytelling and inspiration sessions",
        "Friday gallery show for families"
      ],
      price: "$550",
      color: "cool"
    },
    {
      id: 3,
      title: "Summer Camp",
      subtitle: "The Artist's Journey",
      duration: "4 Weeks",
      ageRange: "Ages 10-16",
      description: "A comprehensive summer program that builds skills week by week, culminating in a professional gallery exhibition.",
      highlights: [
        "Week 1: Foundations (drawing, color theory)",
        "Week 2: Painting Studio (acrylic, watercolor)",
        "Week 3: Mixed Media & Sculpture",
        "Week 4: Portfolio & Exhibition preparation"
      ],
      price: "$2,200",
      color: "warm"
    }
  ];

  const ageGroups = [
    {
      range: "Ages 4-6",
      title: "Little Artists",
      description: "Sensory exploration, basic shapes, color mixing, and creative play. Focus on process over product.",
      activities: "Finger painting, play-doh sculpting, collage with safe materials"
    },
    {
      range: "Ages 7-9", 
      title: "Creative Explorers",
      description: "Introduction to basic techniques, storytelling through art, and developing fine motor skills.",
      activities: "Watercolor basics, simple drawing, mixed media projects"
    },
    {
      range: "Ages 10-12",
      title: "Developing Artists",
      description: "Skill-building in specific mediums, perspective drawing, and more complex projects.",
      activities: "Acrylic painting, charcoal drawing, printmaking basics"
    },
    {
      range: "Ages 13+",
      title: "Young Masters",
      description: "Portfolio development, advanced techniques, and personal artistic voice exploration.",
      activities: "Oil painting, figure drawing, digital art, exhibition preparation"
    }
  ];

  return (
    <section id="camps" className="py-32 bg-white relative overflow-hidden">

      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-12 transition-all duration-1000 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Summer Camp Introduction Image */}
        <div className="mb-16 overflow-hidden rounded-lg">
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src="/images/camp-summer-intro.jpg"
              alt="Summer Camp at Luna Art Studio - Young artists creating and learning together"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="font-display text-3xl md:text-4xl font-light mb-3">
                  Summer <span className="italic text-accent-warm">Art Adventures</span>
                </h3>
                <p className="font-body text-lg font-light max-w-2xl">
                  Where creativity meets summer fun! Join us for unforgettable art experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-accent-warm/60" />
            <span className="font-mono text-[10px] tracking-ultra uppercase text-accent-warm/60" style={{ letterSpacing: "0.35em" }}>
              Youth Programs
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-light text-gray-darkest leading-tight">
            Art <span className="italic text-accent-warm">Camps</span>
          </h2>
          <p className="font-body text-gray-dark text-lg mt-6 max-w-2xl leading-relaxed font-light">
            Creative summer adventures designed to inspire young artists at every age and skill level. 
            Our camps blend skill-building with creative exploration in a supportive, nurturing environment.
          </p>
        </div>

        {/* Camp Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {camps.map((camp) => (
            <div key={camp.id} className="bg-white border border-gray-lightest p-8 hover:border-accent-warm/30 transition-all duration-300 group">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${camp.color === 'warm' ? 'bg-accent-warm' : 'bg-accent-cool'}`} />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker">{camp.title}</span>
                </div>
                <h3 className="font-display text-2xl text-gray-darkest font-light mb-2">{camp.subtitle}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gray-dark">{camp.duration}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent-warm">{camp.ageRange}</span>
                </div>
                <p className="font-body text-gray-dark text-sm font-light mb-4">{camp.description}</p>
                
                <div className="space-y-2">
                  {camp.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${camp.color === 'warm' ? 'bg-accent-warm/40' : 'bg-accent-cool/40'}`} />
                      <span className="font-body text-gray-dark text-xs font-light">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-lightest">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-gray-darkest font-light">{camp.price}</span>
                  <a
                    href="#contact"
                    className={`font-mono text-[9px] tracking-widest uppercase ${camp.color === 'warm' ? 'text-accent-warm border-accent-warm/30 hover:bg-accent-warm' : 'text-accent-cool border-accent-cool/30 hover:bg-accent-cool'} border px-4 py-2 hover:text-white transition-all duration-300`}
                  >
                    Inquire
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Age Group Information */}
        <div className="border border-gray-lightest p-8 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-6 bg-accent-warm/60" />
            <h3 className="font-display text-2xl text-gray-darkest font-light">Age-Appropriate Programming</h3>
          </div>
          
          <p className="font-body text-gray-dark text-sm font-light mb-8 max-w-3xl">
            We carefully design our curriculum for different age groups, ensuring each child receives instruction 
            that matches their developmental stage and artistic interests. All camps are staffed with experienced 
            instructors trained in age-appropriate teaching methods.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageGroups.map((group, index) => (
              <div key={index} className="border border-gray-lightest p-6">
                <h4 className="font-display text-xl text-gray-darkest font-light mb-2">{group.range}</h4>
                <p className="font-body text-gray-darkest text-sm font-light mb-3">{group.title}</p>
                <p className="font-body text-gray-dark text-xs font-light mb-4">{group.description}</p>
                <div className="pt-4 border-t border-gray-lightest">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-gray-darker mb-2">Sample Activities</p>
                  <p className="font-body text-gray text-xs font-light">{group.activities}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Camp Philosophy */}
        <div className="border border-gray-lightest p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6 bg-accent-cool/60" />
            <h3 className="font-display text-2xl text-gray-darkest font-light">Our Camp Philosophy</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">What We Believe</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Every Child is an Artist</p>
                    <p className="font-body text-gray-dark text-xs font-light">We focus on nurturing individual creativity rather than cookie-cutter projects.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Process Over Product</p>
                    <p className="font-body text-gray-dark text-xs font-light">The creative journey matters more than the final artwork.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Safe & Supportive Environment</p>
                    <p className="font-body text-gray-dark text-xs font-light">We maintain small instructor-to-camper ratios for personalized attention.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">What to Expect</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Skill Development</p>
                    <p className="font-body text-gray-dark text-xs font-light">Age-appropriate techniques taught by professional artists.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Creative Confidence</p>
                    <p className="font-body text-gray-dark text-xs font-light">Building self-expression and artistic voice.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Community & Friendship</p>
                    <p className="font-body text-gray-dark text-xs font-light">Collaborative projects and peer appreciation activities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-lightest">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="font-body text-gray-dark text-sm font-light">
                  Have questions about which camp is right for your child?
                </p>
              </div>
              <a
                href="#contact"
                className="font-mono text-[9px] tracking-widest uppercase text-accent-warm border border-accent-warm/30 px-6 py-3 hover:bg-accent-warm hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                Contact Us for Personalized Guidance
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}