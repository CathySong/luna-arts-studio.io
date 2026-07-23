"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  sectionId?: string;
};

const links: NavLink[] = [
  { href: "/#about-luna", label: "About Luna", sectionId: "about-luna" },
  { href: "/#classes", label: "Classes", sectionId: "classes" },
  { href: "/#fall-enrollment", label: "Fall Enrollment", sectionId: "fall-enrollment" },
  { href: "/sewing", label: "Tailor & Sewing" },
  { href: "/events", label: "Birthday Parties" },
  { href: "/#contact", label: "Contact", sectionId: "contact" },
];

const sectionOrder = ["about-luna", "classes", "fall-enrollment", "contact"];

function linkClass(active: boolean) {
  return [
    "font-body text-[11px] lg:text-xs tracking-widest uppercase transition-colors duration-300 whitespace-nowrap",
    active ? "text-accent-warm" : "text-gray-dark hover:text-accent-warm",
  ].join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const updateActiveSection = useCallback(() => {
    if (pathname !== "/" && pathname !== "") {
      setActiveSection("");
      return;
    }

    const offset = 120;
    let current = "";

    for (const id of sectionOrder) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top - offset <= 0) {
        current = id;
      }
    }

    // Near page top: no section highlight yet
    if (window.scrollY < 80) {
      current = "";
    }

    setActiveSection(current);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      updateActiveSection();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [updateActiveSection]);

  const isLinkActive = (link: NavLink) => {
    if (link.href === "/sewing") return pathname?.startsWith("/sewing");
    if (link.href === "/events") return pathname?.startsWith("/events");
    if (link.sectionId) {
      return pathname === "/" && activeSection === link.sectionId;
    }
    return false;
  };

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId?: string
  ) => {
    if (!sectionId) return;
    if (pathname !== "/" && pathname !== "") return;

    const el = document.getElementById(sectionId);
    if (!el) return;

    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveSection(sectionId);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-lightest shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center gap-4 lg:gap-6">
        {/* Logo — reserved space so tabs never crowd it */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0 min-w-[148px] lg:min-w-[168px] mr-2 lg:mr-4"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-10 h-10 shrink-0">
            <Image
              src="/luna.jpg"
              alt="Luna Art Studio Logo"
              fill
              className="object-contain"
              sizes="40px"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-2xl font-light text-gray-darkest"
              style={{ letterSpacing: "0.18em" }}
            >
              LUNA
            </span>
            <span
              className="font-mono text-[9px] text-accent-warm uppercase"
              style={{ letterSpacing: "0.28em" }}
            >
              Art Studio
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center justify-end flex-1 gap-4 lg:gap-5 xl:gap-6 min-w-0">
          {links.map((l) => {
            const active = isLinkActive(l);
            return (
              <li key={l.href} className="shrink-0">
                {l.sectionId ? (
                  <a
                    href={l.href}
                    onClick={(e) => handleAnchorClick(e, l.sectionId)}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
          <li className="shrink-0 pl-1 lg:pl-2">
            <a
              href="/#fall-enrollment"
              onClick={(e) => handleAnchorClick(e, "fall-enrollment")}
              className="inline-flex px-5 lg:px-6 py-2.5 border border-accent-warm/40 text-accent-warm font-body text-[11px] lg:text-xs tracking-widest uppercase hover:bg-accent-warm hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              Enroll
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto text-gray-dark hover:text-accent-warm transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        } bg-white/98 backdrop-blur-md border-t border-gray-lightest`}
      >
        <ul className="px-6 py-6 flex flex-col gap-5">
          {links.map((l) => {
            const active = isLinkActive(l);
            return (
              <li key={l.href}>
                {l.sectionId ? (
                  <a
                    href={l.href}
                    onClick={(e) => handleAnchorClick(e, l.sectionId)}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={linkClass(active)}
                    aria-current={active ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <a
              href="/#fall-enrollment"
              onClick={(e) => handleAnchorClick(e, "fall-enrollment")}
              className="inline-block px-6 py-2.5 border border-accent-warm/40 text-accent-warm font-body text-xs tracking-widest uppercase"
            >
              Enroll
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
