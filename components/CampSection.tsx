"use client";
import { useRef } from "react";
import { useInView } from "@/lib/useInView";

export default function CampSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1 });

  const camps = [
    {
      id: 1,
      title: "Half Day Camp (Morning)",
      subtitle: "Art Exploration",
      duration: "3 Hours",
      ageRange: "Ages 6-12",
      description: "Perfect for young artists to explore creativity in a focused morning session. No lunch included.",
      highlights: [
        "Creative drawing & basic sketching",
        "Acrylic painting techniques",
        "Watercolor exploration",
        "Take-home art projects"
      ],
      price: "$70",
      color: "warm",
      time: "9:00am - 12:00pm"
    },
    {
      id: 2,
      title: "Half Day Camp (Afternoon)",
      subtitle: "Crafts & Activities",
      duration: "3.5 Hours",
      ageRange: "Ages 6-12",
      description: "Afternoon session focusing on crafts, outdoor activities, and creative play.",
      highlights: [
        "Sewing & beading projects",
        "Handmade soap making",
        "Yarn crafts & team games",
        "Nature exploration activities"
      ],
      price: "$90",
      color: "cool",
      time: "1:30pm - 5:00pm"
    },
    {
      id: 3,
      title: "Full Day Camp",
      subtitle: "Complete Summer Experience",
      duration: "8 Hours",
      ageRange: "Ages 6-12",
      description: "Full day camp including all activities plus healthy lunch. The complete summer camp experience.",
      highlights: [
        "Morning art classes (drawing, painting)",
        "Afternoon crafts & outdoor activities",
        "Healthy lunch provided (pizza/sandwiches/fruit)",
        "Team building & creative sports"
      ],
      price: "$130",
      color: "warm",
      time: "9:00am - 5:00pm",
      includesLunch: true
    }
  ];

  const ageGroups = [
    {
      range: "Ages 6-8",
      title: "Young Creators",
      description: "Focus on creativity, basic art skills, and fun exploration. Emphasis on process over product.",
      activities: "Creative drawing, basic painting, simple crafts, team games"
    },
    {
      range: "Ages 9-10", 
      title: "Skill Builders",
      description: "Developing technical skills while maintaining creative freedom. Introduction to various mediums.",
      activities: "Acrylic painting, watercolor, sewing basics, nature crafts"
    },
    {
      range: "Ages 11-12",
      title: "Art Explorers",
      description: "More complex projects, skill refinement, and creative expression. Building artistic confidence.",
      activities: "Advanced painting, handmade soap, beading projects, creative sports"
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
                  <span className="font-mono text-[10px] tracking-widest uppercase text-gray-dark">{camp.time}</span>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent-warm">{camp.ageRange}</span>
                </div>
                <div className="mb-3">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-gray-darker bg-gray-lightest px-2 py-1 rounded">
                    {camp.duration}
                    {camp.includesLunch && " • Lunch Included"}
                  </span>
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

        {/* Camp Highlights & Activities */}
        <div className="border border-gray-lightest p-8 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-6 bg-accent-warm/60" />
            <h3 className="font-display text-2xl text-gray-darkest font-light">🌟 Camp Highlights & Activities</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">🎨 Art Activities</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Creative drawing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Basic sketching</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Acrylic painting</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Watercolor</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">🧵 Crafts Activities</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Sewing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Beading</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Handmade soap</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Yarn crafts</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">🌳 Outdoor Activities</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Team games</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Creative sports</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <span className="font-body text-gray-dark text-sm font-light">Nature exploration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discounts & Lunch Information */}
        <div className="border border-gray-lightest p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-6 bg-accent-cool/60" />
            <h3 className="font-display text-2xl text-gray-darkest font-light">💰 Discounts & 🍱 Lunch Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">🎁 Discounts (Weekly Registration Only)</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Early Bird Discount</p>
                    <p className="font-body text-gray-dark text-xs font-light">Register before May 1st → <span className="font-bold">10% OFF</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Referral Discount</p>
                    <p className="font-body text-gray-dark text-xs font-light">Refer a friend → <span className="font-bold">5% OFF</span> for both</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Multi-Week Discount</p>
                    <p className="font-body text-gray-dark text-xs font-light">Register for 2+ weeks → Additional <span className="font-bold">5% OFF</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gray-darker mb-4">🍱 Lunch Options</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Healthy Lunch Provided</p>
                    <p className="font-body text-gray-dark text-xs font-light">Pizza / Sandwiches / Fresh fruit included with full day camp</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-warm mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Bring Your Own Lunch</p>
                    <p className="font-body text-gray-dark text-xs font-light">Allergies or dietary preferences? Feel free to bring your own healthy meal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent-cool mt-1" />
                  <div>
                    <p className="font-body text-gray-darkest text-sm font-light mb-1">Camp Focus Areas</p>
                    <p className="font-body text-gray-dark text-xs font-light">We emphasize: Creativity • Hands-on skills • Teamwork</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-lightest">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="font-body text-gray-dark text-sm font-light">
                  📅 Camp Dates: June 22 - August 28 • Small class sizes • Art + Crafts + Outdoor activities
                </p>
              </div>
              <a
                href="#contact"
                className="font-mono text-[9px] tracking-widest uppercase text-accent-warm border border-accent-warm/30 px-6 py-3 hover:bg-accent-warm hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                Register Now for Summer Camp 2026
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}