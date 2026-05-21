import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import GalleryGrid from "./GalleryGrid.tsx";
import GalleryBackgroundEffects from "./GalleryBackgroundEffects.tsx";
import FloatingParticles from "./FloatingParticles.tsx";
import { scrollToSection } from "../../utils/scrollToSection.ts";

/* ── Sparkle SVG helper ── */
function Sparkle({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill="url(#sparkleGrad)"
      />
      <defs>
        <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E75480" />
          <stop offset="50%" stopColor="#D4AFB9" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Animated luxury divider ── */
function LuxuryDivider({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isVisible ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-3 my-5"
      style={{ transformOrigin: "center" }}
    >
      <div
        className="flex-1 h-[1px]"
        style={{
          background: "linear-gradient(to right,transparent,rgba(212,175,185,0.4),rgba(231,84,128,0.6),rgba(212,175,55,0.4),transparent)",
        }}
      />
      <div
        className="w-[5px] h-[5px] rounded-full flex-shrink-0"
        style={{
          background: "#E75480",
          boxShadow: "0 0 10px rgba(231,84,128,0.7), 0 0 20px rgba(231,84,128,0.3)",
          animation: "pulseGlow 2s ease-in-out infinite",
        }}
      />
      <Sparkle size={12} />
      <div
        className="w-[5px] h-[5px] rounded-full flex-shrink-0"
        style={{
          background: "#D4AF37",
          boxShadow: "0 0 10px rgba(212,175,55,0.6)",
          animation: "pulseGlow 2.5s ease-in-out infinite",
        }}
      />
      <div
        className="flex-1 h-[1px]"
        style={{
          background: "linear-gradient(to left,transparent,rgba(212,175,185,0.4),rgba(231,84,128,0.6),rgba(212,175,55,0.4),transparent)",
        }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════ */
export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hasAnimated, setHasAnimated] = useState(false);

  // Force animation to trigger immediately on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready, but much faster than scroll trigger
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Use either scroll trigger or immediate mount trigger
  const shouldAnimate = hasAnimated || isInView;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-24 lg:py-36"
      style={{
        background: "linear-gradient(160deg,#0d0810 0%,#130a12 30%,#1a0d14 55%,#0f0d0a 100%)",
      }}
    >
      {/* ── Layered backgrounds ── */}
      <GalleryBackgroundEffects />

      {/* ── Rising sparkle particles ── */}
      <FloatingParticles density={20} className="z-[1]" />

      {/* ── CONTENT WRAPPER ── */}
      <div
        className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16"
        style={{ zIndex: 10 }}
      >

        {/* ══════════ SECTION HEADER ══════════ */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16 lg:mb-20">

          {/* Small label badge - ANIMATE IMMEDIATELY */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-[0.38rem] text-[0.65rem] sm:text-[0.68rem] font-medium tracking-[0.14em] sm:tracking-[0.18em] uppercase mb-5 sm:mb-6 max-w-full"
            style={{
              background: "rgba(231,84,128,0.10)",
              border: "1px solid rgba(231,84,128,0.3)",
              color: "#D4AFB9",
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{
                background: "#E75480",
                boxShadow: "0 0 7px #E75480",
                animation: "pulseGlow 2s ease-in-out infinite",
              }}
            />
            Luxury Portfolio
            <Sparkle size={10} />
          </motion.div>

          {/* Main heading - ANIMATE IMMEDIATELY */}
          <motion.h2
            initial={{ y: 38, opacity: 0 }}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: 38, opacity: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-light leading-[1.06] max-w-[720px]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem,5vw,4.4rem)",
              letterSpacing: "-0.01em",
              color: "#FDF6F0",
            }}
          >
            Beauty Transformations &amp;{" "}
            <em
              className="not-italic"
              style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg,#E75480 0%,#D4AFB9 48%,#D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Elegant Moments
            </em>
          </motion.h2>

          {/* Animated divider */}
          <LuxuryDivider isVisible={shouldAnimate} />

          {/* Subheading - ANIMATE IMMEDIATELY */}
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            className="text-[0.98rem] font-light leading-[1.82] max-w-[560px]"
            style={{ color: "rgba(253,246,240,0.52)" }}
          >
            Explore our curated collection of luxury beauty experiences, flawless
            transformations, and premium salon artistry.
          </motion.p>

          {/* Decorative sparkles row - ANIMATE IMMEDIATELY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex items-center gap-4 mt-8"
          >
            <Sparkle
              size={10}
              style={{ opacity: 0.45, animation: "sparklePop 3s ease-in-out infinite" }}
            />
            <Sparkle
              size={14}
              style={{ opacity: 0.65, animation: "sparklePop 3s ease-in-out 0.6s infinite" }}
            />
            <Sparkle
              size={9}
              style={{ opacity: 0.38, animation: "sparklePop 3s ease-in-out 1.2s infinite" }}
            />
          </motion.div>
        </div>

        {/* ══════════ GALLERY GRID ══════════ */}
        <GalleryGrid />

        {/* ══════════ BOTTOM CTA STRIP ══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-4 mt-10 sm:mt-16 lg:mt-20"
        >
          {/* Decorative line — hidden on mobile to save space */}
          <div className="hidden sm:flex w-full items-center gap-4">
            <div
              className="h-[1px] flex-1"
              style={{ background: "linear-gradient(to right,transparent,rgba(212,175,185,0.3))" }}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 rounded-full px-8 py-[0.88rem] text-white text-[0.8rem] font-medium tracking-[0.09em] uppercase cursor-pointer border-none"
                style={{
                  background: "linear-gradient(135deg,#E75480 0%,#c0376a 100%)",
                  boxShadow: "0 6px 28px rgba(231,84,128,0.44), 0 2px 8px rgba(0,0,0,0.28)",
                  transition: "transform 0.25s,box-shadow 0.25s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.04)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 36px rgba(231,84,128,0.55), 0 2px 12px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(231,84,128,0.44), 0 2px 8px rgba(0,0,0,0.28)";
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Book a Consultation
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="inline-flex items-center gap-2 rounded-full px-8 py-[0.88rem] text-[0.8rem] font-light tracking-[0.09em] uppercase cursor-pointer"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,185,0.34)",
                  color: "rgba(253,246,240,0.82)",
                  transition: "transform 0.25s,border-color 0.25s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,84,128,0.5)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,185,0.34)";
                }}
              >
                View All Services
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <div
              className="h-[1px] flex-1"
              style={{ background: "linear-gradient(to left,transparent,rgba(212,175,185,0.3))" }}
            />
          </div>

          {/* Mobile: stacked full-width buttons */}
          <div className="flex flex-col gap-3 w-full sm:hidden">
            <button
              onClick={() => scrollToSection("contact")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-white text-[0.78rem] font-medium tracking-[0.09em] uppercase cursor-pointer border-none"
              style={{
                background: "linear-gradient(135deg,#E75480 0%,#c0376a 100%)",
                boxShadow: "0 6px 28px rgba(231,84,128,0.44)",
                transition: "transform 0.2s,box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book a Consultation
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-[0.78rem] font-light tracking-[0.09em] uppercase cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid rgba(212,175,185,0.34)",
                color: "rgba(253,246,240,0.82)",
                transition: "transform 0.2s,border-color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(231,84,128,0.5)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,185,0.34)";
              }}
            >
              View All Services
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ══════════ KEYFRAMES ══════════ */}
      <style>{`
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 7px #E75480; }
          50%      { box-shadow: 0 0 14px #E75480, 0 0 22px rgba(231,84,128,0.4); }
        }
        @keyframes sparklePop {
          0%,100% { transform: scale(1) rotate(0deg); opacity: var(--base-op, 0.5); }
          40%     { transform: scale(1.35) rotate(18deg); opacity: 1; }
          60%     { transform: scale(0.9) rotate(-8deg); }
        }
        @keyframes shimmerSkeleton {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
