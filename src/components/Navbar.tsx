// src/components/Navbar.tsx
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import logoImg from "../assets/logo.png";

import { NAV_ITEMS } from "../config/navigationConfig.ts";
import { useActiveSection, useScrollProgress } from "../hooks/useActiveSection.ts";
import { scrollToSection } from "../utils/scrollToSection.ts";
import MobileMenu from "./MobileMenu.tsx";

// ─────────────────────────────────────────────────────────
// Scroll-progress bar at very top of viewport
// ─────────────────────────────────────────────────────────
function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
      {/* Track */}
      <div className="absolute inset-0" style={{ background: "rgba(212,175,185,0.1)" }} />
      {/* Fill */}
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{
          width: `${progress * 100}%`,
          background: "linear-gradient(90deg, #E75480, #D4AF37, #E75480)",
          backgroundSize: "200% 100%",
          boxShadow: "0 0 12px rgba(231,84,128,0.7)",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Leading glow dot */}
      <motion.div
        className="absolute top-0 h-[2px] w-5"
        style={{
          left: `calc(${progress * 100}% - 20px)`,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.9), transparent)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Hamburger button with animated lines → X morph
// ─────────────────────────────────────────────────────────
function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="lg:hidden relative flex flex-col justify-center gap-[5px] p-2 -mr-1 bg-transparent border-none cursor-pointer"
      style={{ zIndex: 60 }} // above mobile overlay
    >
      {/* ── Glow ring on open ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.span
            key="ring"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute inset-[-6px] rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(231,84,128,0.35)",
              boxShadow: "0 0 16px rgba(231,84,128,0.25)",
            }}
          />
        )}
      </AnimatePresence>

      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{
            width: i === 1 ? "18px" : "24px",
            height: "1.5px",
            background:
              isOpen
                ? "linear-gradient(90deg,#E75480,#D4AF37)"
                : "#FDF6F0",
            transformOrigin: "center",
          }}
          animate={
            i === 0
              ? isOpen
                ? { y: 6.5, rotate: 45, width: "24px" }
                : { y: 0, rotate: 0, width: "24px" }
              : i === 1
                ? isOpen
                  ? { opacity: 0, scaleX: 0 }
                  : { opacity: 1, scaleX: 1 }
                : isOpen
                  ? { y: -6.5, rotate: -45 }
                  : { y: 0, rotate: 0 }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Main Navbar
// ─────────────────────────────────────────────────────────
export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const active = useActiveSection();
  const progress = useScrollProgress();

  // ── Initial reveal animation ──────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(navRef.current, { y: -32, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(logoRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, "-=0.6")
        .fromTo(
          linksRef.current ? Array.from(linksRef.current.children) : [],
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.065 },
          "-=0.55"
        )
        .fromTo(ctaRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, "-=0.4");
    });
    return () => ctx.revert();
  }, []);

  // ── Glassmorphism on scroll ───────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    gsap.to(navRef.current, {
      backgroundColor: scrolled ? "rgba(12,6,10,0.82)" : "rgba(0,0,0,0)",
      backdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
      WebkitBackdropFilter: scrolled ? "blur(24px)" : "blur(0px)",
      borderBottomColor: scrolled
        ? "rgba(212,175,185,0.12)"
        : "rgba(0,0,0,0)",
      boxShadow: scrolled
        ? "0 4px 40px rgba(0,0,0,0.35), 0 1px 0 rgba(212,175,185,0.08)"
        : "none",
      paddingTop: scrolled ? "0.5rem" : "1.1rem",
      paddingBottom: scrolled ? "0.5rem" : "1.1rem",
      duration: 0.6,
      ease: "power2.out",
    });
  }, [scrolled]);

  // ── CTA micro-interactions ────────────────────────────
  const handleCtaEnter = () =>
    gsap.to(ctaRef.current, {
      scale: 1.06,
      boxShadow: "0 8px 40px rgba(231,84,128,0.65)",
      duration: 0.3,
      ease: "power2.out",
    });

  const handleCtaLeave = () =>
    gsap.to(ctaRef.current, {
      scale: 1,
      boxShadow: "0 4px 22px rgba(231,84,128,0.38)",
      duration: 0.3,
      ease: "power2.out",
    });

  return (
    <>
      {/* ─────────────────── Navbar ─────────────────── */}
      <motion.nav
        ref={navRef as React.RefObject<HTMLElement>}
        className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 md:px-12 lg:px-16"
        style={{ borderBottomWidth: "1px", borderBottomStyle: "solid" }}
      >
        {/* Scroll progress bar */}
        <ScrollProgressBar progress={progress} />

        {/* Animated gradient top accent line (always visible) */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(231,84,128,0.0) 20%, rgba(231,84,128,0.35) 50%, rgba(212,175,55,0.35) 80%, transparent 100%)",
            opacity: scrolled ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        <div className="max-w-[1400px] mx-auto flex items-center justify-between">

          {/* ── Brand ───────────────────────────────── */}
          <motion.a
            ref={logoRef}
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}
            className="flex items-center gap-2 sm:gap-3 no-underline flex-shrink-0"
            aria-label="LushGlow Beauty Studio – back to top"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <div className="relative h-10 w-auto sm:h-12 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src={logoImg}
                alt="LushGlow Beauty Studio"
                className="h-full w-auto object-contain"
              />
            </div>
            <span
              className="text-base sm:text-xl lg:text-2xl font-medium tracking-wide whitespace-nowrap hidden sm:block"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                background: "linear-gradient(135deg,#FDF6F0 0%,#D4AFB9 55%,#D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LushGlow Beauty Studio
            </span>
          </motion.a>

          {/* ── Desktop nav links ────────────────────── */}
          <ul
            ref={linksRef}
            className="hidden lg:flex items-center gap-8 xl:gap-10 list-none m-0 p-0"
          >
            {NAV_ITEMS.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <li key={id} className="relative">
                  <button
                    onClick={() => scrollToSection(id)}
                    className="relative inline-block bg-transparent border-none cursor-pointer select-none py-1 group"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.72rem",
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: isActive ? "#E75480" : "rgba(253,246,240,0.72)",
                      transition: "color 0.3s ease, font-weight 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color = "rgba(253,246,240,0.95)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive)
                        e.currentTarget.style.color = "rgba(253,246,240,0.72)";
                    }}
                  >
                    {label}

                    {/* ── Active sliding underline (Framer Motion layoutId) ── */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute bottom-[-2px] left-0 right-0"
                        style={{
                          height: "1.5px",
                          background: "linear-gradient(90deg,#E75480,#D4AF37)",
                          borderRadius: "999px",
                          boxShadow: "0 0 8px rgba(231,84,128,0.6)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 28,
                        }}
                      />
                    )}

                    {/* ── Hover underline (separate, non-active) ── */}
                    {!isActive && (
                      <span
                        className="absolute bottom-[-2px] left-0 right-0 h-[1px] block"
                        style={{
                          background: "linear-gradient(90deg,#E75480,#D4AF37)",
                          transform: "scaleX(0)",
                          transformOrigin: "left",
                          transition:
                            "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                          opacity: 0.5,
                        }}
                        /* We rely on group-hover via GSAP on the parent btn.
                           A CSS-only approach is simpler: */
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform =
                            "scaleX(1)";
                          (e.currentTarget as HTMLElement).style.transformOrigin =
                            "left";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform =
                            "scaleX(0)";
                          (e.currentTarget as HTMLElement).style.transformOrigin =
                            "right";
                        }}
                      />
                    )}

                    {/* ── Active glow dot above text ── */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          key={`dot-${id}`}
                          initial={{ opacity: 0, scale: 0, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full"
                          style={{
                            background: "#D4AF37",
                            boxShadow: "0 0 6px #D4AF37",
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA ─────────────────────────── */}
          <motion.a
            ref={ctaRef}
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
            onMouseEnter={handleCtaEnter}
            onMouseLeave={handleCtaLeave}
            className="hidden lg:inline-flex items-center gap-2 no-underline text-white text-[0.68rem] font-semibold tracking-[0.12em] uppercase rounded-full px-6 py-[0.62rem] select-none relative overflow-hidden"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              background: "linear-gradient(135deg,#E75480 0%,#b8325e 100%)",
              boxShadow: "0 4px 22px rgba(231,84,128,0.38)",
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
              }}
              animate={{ backgroundPosition: ["-100% 0", "200% 0"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <CalendarIcon />
              Book Appointment
            </span>
          </motion.a>

          {/* ── Hamburger ──────────────────────────── */}
          <HamburgerButton
            isOpen={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          />
        </div>
      </motion.nav>

      {/* ─────────────────── Mobile Menu ─────────────────── */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        active={active}
      />
    </>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
