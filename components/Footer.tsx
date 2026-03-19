import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-ink">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex flex-col leading-none mb-6">
              <span className="font-display text-3xl font-light tracking-widest text-parchment" style={{ letterSpacing: "0.2em" }}>
                LUNA
              </span>
              <span className="font-mono text-[9px] tracking-ultra text-gold" style={{ letterSpacing: "0.35em" }}>
                Arts Studio
              </span>
            </div>
            <p className="font-body text-parchment/30 text-sm leading-relaxed font-light max-w-xs">
              A creative sanctuary where art is practiced, celebrated, and shared — for all ages and all levels.
            </p>
            <div className="flex gap-4 mt-6">
              {["Instagram", "Facebook", "Pinterest"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-mono text-[9px] tracking-widest uppercase text-parchment/25 hover:text-gold transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-parchment/30 mb-5">Explore</p>
            <ul className="space-y-3">
              {["About", "Gallery", "Classes", "Schedule", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="font-body text-sm text-parchment/40 hover:text-gold transition-colors font-light"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact snippet */}
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-parchment/30 mb-5">Visit</p>
            <address className="not-italic space-y-3">
              <p className="font-body text-sm text-parchment/40 font-light">123 Art Lane</p>
              <p className="font-body text-sm text-parchment/40 font-light">Basking Ridge, NJ 07920</p>
              <p className="font-body text-sm text-parchment/40 font-light mt-4">(908) 555-0192</p>
              <p className="font-body text-sm text-gold/50 font-light">hello@lunaartsstudio.com</p>
            </address>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gold/5">
          <p className="font-mono text-[9px] tracking-widest uppercase text-parchment/20">
            © {new Date().getFullYear()} Luna Arts Studio · All rights reserved
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-[9px] tracking-widest uppercase text-parchment/20 hover:text-parchment/50 transition-colors">
              Privacy
            </a>
            <a href="#" className="font-mono text-[9px] tracking-widest uppercase text-parchment/20 hover:text-parchment/50 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
