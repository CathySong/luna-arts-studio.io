"use client";
import Image from "next/image";
import Link from "next/link";
import { Download, Printer, Share2, ArrowLeft } from "lucide-react";
import { summerCampConfig } from "@/config/summer-camp";

export default function FlyerPage() {
  const handleDownload = () => {
    // 创建一个虚拟链接来触发下载
    const link = document.createElement('a');
    link.href = '/images/camp-summer-intro.jpg';
    link.download = 'Luna-Art-Studio-Summer-Camp-2026-Flyer.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Luna Art Studio Summer Camp 2026',
          text: 'Check out our Summer Camp 2026 program!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-body font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <h1 className="font-display text-2xl font-light text-gray-900">
                Summer Camp 2026 Flyer
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-body text-sm font-medium hidden sm:inline">Share</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Print"
              >
                <Printer className="w-4 h-4" />
                <span className="font-body text-sm font-medium hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
                <span className="font-body text-sm font-medium hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Flyer Image */}
          <div className="relative aspect-[3/4] md:aspect-[4/3]">
            <Image
              src="/images/camp-summer-intro.jpg"
              alt="Luna Art Studio Summer Camp 2026 Flyer - Young artists creating, painting, and learning together"
              fill
              className="object-cover"
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            
            {/* Flyer Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center text-white max-w-4xl">
                  <div className="mb-8">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white font-mono text-sm tracking-widest uppercase px-6 py-3 rounded-full mb-8">
                      🏕️ Summer Art Adventures 2026
                    </span>
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                      Where <span className="text-red-300">Creativity</span><br />
                      Meets <span className="text-yellow-300">Summer Fun</span>
                    </h1>
                    <p className="font-body text-2xl md:text-3xl text-white/90 font-light mb-10 max-w-3xl mx-auto leading-relaxed">
                      June 22 - August 28 • Small class sizes • Art + Crafts + Outdoor activities
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-red-300 font-display text-4xl font-bold mb-2">10%</div>
                      <p className="font-body text-lg font-light">Early Bird Discount</p>
                      <p className="font-mono text-sm text-white/70 mt-1">Register by May 1</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-red-300 font-display text-4xl font-bold mb-2">6/22</div>
                      <p className="font-body text-lg font-light">Camp Start Date</p>
                      <p className="font-mono text-sm text-white/70 mt-1">June 22 - August 28</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <div className="text-red-300 font-display text-4xl font-bold mb-2">$130</div>
                      <p className="font-body text-lg font-light">Full Day with Lunch</p>
                      <p className="font-mono text-sm text-white/70 mt-1">9am - 5pm</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={summerCampConfig.registrationFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      Register Now
                    </a>
                    <a
                      href="/#contact"
                      className="bg-transparent border-2 border-white text-white font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-white/10 transition-all duration-300"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flyer Details */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Camp Information */}
              <div>
                <h2 className="font-display text-3xl font-light text-gray-900 mb-8">
                  🏕️ Summer Camp 2026 Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-light text-gray-800 mb-3">📅 Dates & Times</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-body text-gray-700">June 22 - August 28, 2026</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-body text-gray-700">Half Day (Morning): 9:00am - 12:00pm • $70</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-body text-gray-700">Half Day (Afternoon): 1:30pm - 5:00pm • $90</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-body text-gray-700">Full Day: 9:00am - 5:00pm • $130 (lunch included)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-xl font-light text-gray-800 mb-3">🎨 Activities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-body font-medium text-gray-700 mb-2">Art Classes</h4>
                        <ul className="space-y-1">
                          <li className="font-body text-sm text-gray-600">• Creative drawing</li>
                          <li className="font-body text-sm text-gray-600">• Basic sketching</li>
                          <li className="font-body text-sm text-gray-600">• Acrylic painting</li>
                          <li className="font-body text-sm text-gray-600">• Watercolor</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-gray-700 mb-2">Crafts & Outdoor</h4>
                        <ul className="space-y-1">
                          <li className="font-body text-sm text-gray-600">• Sewing & beading</li>
                          <li className="font-body text-sm text-gray-600">• Handmade soap</li>
                          <li className="font-body text-sm text-gray-600">• Team games</li>
                          <li className="font-body text-sm text-gray-600">• Nature exploration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Registration & Contact */}
              <div>
                <h2 className="font-display text-3xl font-light text-gray-900 mb-8">
                  📝 Registration Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-light text-gray-800 mb-3">🎁 Discounts</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-body text-gray-700 font-medium">Early Bird Discount</p>
                          <p className="font-body text-sm text-gray-600">Register before May 1st → <span className="font-bold">10% OFF</span></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-body text-gray-700 font-medium">Referral Discount</p>
                          <p className="font-body text-sm text-gray-600">Refer a friend → <span className="font-bold">5% OFF</span> for both</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                        <div>
                          <p className="font-body text-gray-700 font-medium">Multi-Week Discount</p>
                          <p className="font-body text-sm text-gray-600">Register for 2+ weeks → Additional <span className="font-bold">5% OFF</span></p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-display text-xl font-light text-gray-800 mb-3">🍱 Lunch Options</h3>
                    <p className="font-body text-gray-700 mb-2">
                      Full day camp includes healthy lunch: Pizza / Sandwiches / Fresh fruit
                    </p>
                    <p className="font-body text-sm text-gray-600">
                      Allergies or dietary preferences? Feel free to bring your own healthy meal.
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-display text-xl font-light text-gray-800 mb-4">📞 Contact Us</h3>
                    <div className="space-y-3">
                      <p className="font-body text-gray-700">
                        <span className="font-medium">Email:</span> {summerCampConfig.contact.email}
                      </p>
                      <p className="font-body text-gray-700">
                        <span className="font-medium">Phone:</span> {summerCampConfig.contact.phone}
                      </p>
                      <p className="font-body text-gray-700">
                        <span className="font-medium">Address:</span> {summerCampConfig.contact.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 pt-12 border-t border-gray-200">
              <div className="text-center">
                <h3 className="font-display text-2xl font-light text-gray-900 mb-6">
                  Ready to Join Our Summer Art Adventure?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={summerCampConfig.registrationFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white font-display text-xl font-bold px-10 py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Register Online Now
                  </a>
                  <a
                    href="/#contact"
                    className="bg-white border-2 border-gray-300 text-gray-900 font-display text-xl font-bold px-10 py-5 rounded-full hover:bg-gray-50 transition-all duration-300"
                  >
                    Have Questions? Contact Us
                  </a>
                </div>
                <p className="font-body text-gray-600 mt-6">
                  Limited spots available! Early registration recommended to secure your preferred dates.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            header, button, .no-print {
              display: none !important;
            }
            body {
              background: white !important;
            }
            .shadow-xl, .border {
              box-shadow: none !important;
              border: 1px solid #ddd !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}