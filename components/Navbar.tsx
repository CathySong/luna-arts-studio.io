"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#classes", label: "Classes" },
  { href: "#camps", label: "Art Camp" },
  { href: "#schedule", label: "Schedule" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-lightest"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/luna.jpg"
              alt="Luna Art Studio Logo"
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-2xl font-light tracking-widest text-gray-darkest"
              style={{ letterSpacing: "0.2em" }}
            >
              LUNA
            </span>
            <span
              className="font-mono text-[9px] tracking-ultra text-accent-warm uppercase"
              style={{ letterSpacing: "0.35em" }}
            >
              Art Studio
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-body text-xs tracking-widest uppercase text-gray-dark hover:text-accent-warm transition-colors duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="ml-4 px-6 py-2.5 border border-accent-warm/40 text-accent-warm font-body text-xs tracking-widest uppercase hover:bg-accent-warm hover:text-white transition-all duration-300"
            >
              Inquire
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-dark hover:text-accent-warm transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 backdrop-blur-md border-t border-gray-lightest`}
      >
        <ul className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-body text-xs tracking-widest uppercase text-gray-dark hover:text-accent-warm transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
