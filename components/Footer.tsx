import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-lightest bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/luna.png"
                  alt="Luna Art Studio Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-3xl font-light tracking-widest text-gray-darkest" style={{ letterSpacing: "0.2em" }}>
                  LUNA
                </span>
                <span className="font-mono text-[9px] tracking-ultra text-accent-warm" style={{ letterSpacing: "0.35em" }}>
                  Art Studio
                </span>
              </div>
            </div>
            <p className="font-body text-gray font-light text-sm leading-relaxed max-w-xs">
              A creative sanctuary where art is practiced, celebrated, and shared — for all ages and all levels.
            </p>
            <div className="flex gap-4 mt-6">
              {["Instagram", "Facebook", "Pinterest"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-mono text-[9px] tracking-widest uppercase text-gray-dark hover:text-accent-warm transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-gray mb-5">Explore</p>
            <ul className="space-y-3">
              {["About", "Gallery", "Classes", "Schedule", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="font-body text-sm text-gray-dark hover:text-accent-warm transition-colors font-light"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact snippet */}
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-gray mb-5">Visit</p>
            <address className="not-italic space-y-3">
              <p className="font-body text-sm text-gray-dark font-light">258 King George Rd</p>
              <p className="font-body text-sm text-gray-dark font-light">Warren, NJ 07059, USA</p>
              <p className="font-body text-sm text-gray-dark font-light mt-4">(908) 555-0192</p>
              <p className="font-body text-sm text-accent-warm font-light">Ninglu1088@gmail.com</p>
            </address>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-lightest">
          <p className="font-mono text-[9px] tracking-widest uppercase text-gray">
            © {new Date().getFullYear()} Luna Art Studio · All rights reserved
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-[9px] tracking-widest uppercase text-gray hover:text-gray-dark transition-colors">
              Privacy
            </a>
            <a href="#" className="font-mono text-[9px] tracking-widest uppercase text-gray hover:text-gray-dark transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
