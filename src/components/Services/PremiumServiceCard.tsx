import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles, ArrowUpRight } from "lucide-react";
import type { ServiceData } from "./types.ts";
import { scrollToSection } from "../../utils/scrollToSection.ts";

// fetchPriority is not in all React @types versions yet — augment here
declare module "react" {
  interface ImgHTMLAttributes<T> {
    fetchPriority?: "high" | "low" | "auto";
  }
}

interface Props {
  service: ServiceData;
  index: number; // kept for API compatibility; no longer used for staggered animation
}

export default function PremiumServiceCard({ service, index: _index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    });
  };

  const spotlightX = `${mousePos.x * 100}%`;
  const spotlightY = `${mousePos.y * 100}%`;

  return (
    <motion.div
      ref={cardRef}
      className="service-card relative flex-shrink-0 cursor-pointer select-none"
      style={{ borderRadius: 28, overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* ── Real photo background ── */}
      {/*
        Using <img> instead of CSS backgroundImage for two reasons:
        1. The browser can assign fetchpriority="high" and start the
           network request immediately — CSS backgrounds are discovered
           only when the element is painted, which is too late here.
        2. The browser's image decoder runs as soon as the fetch
           completes, not when the card first scrolls into view.
      */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src={service.image}
          alt={service.title}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </motion.div>

      {/*
        Colour-tinted gradient layer.
        Was: mixBlendMode "multiply" (prevents GPU layer promotion).
        Now: straight rgba overlay — visually equivalent at these opacity levels,
        but the browser can composite this element independently.
      */}
      <div
        className="absolute inset-0"
        style={{
          background: service.gradient,
          opacity: 0.82,
        }}
      />

      {/* Cinematic noise texture */}
      <div className="absolute inset-0" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        // mixBlendMode removed here too — kept as plain overlay
      }} />

      {/* Dark vignette overlay */}
      <div className="absolute inset-0" style={{ background: service.overlayGradient }} />

      {/* Mouse-follow spotlight */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(circle 180px at ${spotlightX} ${spotlightY}, rgba(255,255,255,0.07) 0%, transparent 70%)`,
          transition: "background 0.05s linear",
        }} />
      )}

      {/* Glow border */}
      <motion.div
        className="absolute inset-0 rounded-[28px]"
        style={{ border: `1px solid ${service.accentColor}25`, boxSizing: "border-box" }}
        animate={{
          boxShadow: hovered
            ? `0 0 0 1px ${service.accentColor}40, 0 0 40px ${service.accentColor}20, inset 0 0 40px ${service.accentColor}08`
            : `0 0 0 1px ${service.accentColor}15`,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="shimmer"
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%", skewX: "-15deg" }}
            animate={{ x: "200%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
              width: "60%",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Card content ── */}
      <div className="absolute inset-0 flex flex-col justify-between p-7" style={{ zIndex: 5 }}>

        {/* Top row: badge + icon */}
        <div className="flex items-start justify-between">
          {service.badge ? (
            <motion.div
              animate={{ opacity: hovered ? 1 : 0.7 }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "0.52rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: service.accentColor,
                background: `${service.accentColor}18`,
                border: `1px solid ${service.accentColor}35`,
                borderRadius: 100,
                padding: "4px 12px",
                // backdropFilter removed from badge too — tiny element, large cost
              }}
            >
              {service.badge}
            </motion.div>
          ) : (
            <div />
          )}
          <motion.div
            animate={{ rotate: hovered ? 15 : 0, scale: hovered ? 1.15 : 1 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "1.6rem",
              filter: `drop-shadow(0 0 10px ${service.accentColor}80)`,
              marginLeft: "auto",
            }}
          >
            {service.icon}
          </motion.div>
        </div>

        {/* Bottom block */}
        <div>
          {/* Decorative line */}
          <motion.div
            animate={{ width: hovered ? "3rem" : "1.5rem", opacity: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.5 }}
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${service.accentColor}, transparent)`,
              marginBottom: "1rem",
            }}
          />

          {/* Title */}
          <motion.h3
            animate={{ y: hovered ? -4 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)",
              color: "#FDF6F0",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              marginBottom: "0.45rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            {service.title}
          </motion.h3>

          {/* Tagline */}
          <motion.p
            animate={{ opacity: hovered ? 0 : 0.65, y: hovered ? 4 : 0 }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(253,246,240,0.85)",
              marginBottom: "1rem",
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}
          >
            {service.tagline}
          </motion.p>

          {/* Price */}
          <motion.div
            animate={{ opacity: hovered ? 0 : 1, y: hovered ? 8 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}
          >
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 200,
              fontSize: "0.58rem",
              letterSpacing: "0.25em",
              color: service.accentColor,
              textTransform: "uppercase",
            }}>from</span>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: "1.5rem",
              color: service.accentColor,
              filter: `drop-shadow(0 0 8px ${service.accentColor}60)`,
            }}>{service.price}</span>
          </motion.div>

          {/* ── Hover reveal panel ── */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key="hover-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  left: 0, right: 0, bottom: 0,
                  padding: "2rem 1.75rem 1.75rem",
                  /*
                    Was: backdropFilter blur(18px) + semi-transparent bg.
                    Now: fully opaque dark gradient — same visual result,
                    zero compositor overhead.
                  */
                  background: "linear-gradient(0deg, rgba(6,3,8,0.97) 40%, rgba(6,3,8,0.92) 70%, transparent 100%)",
                  borderTop: `1px solid ${service.accentColor}20`,
                  zIndex: 20,
                  borderRadius: "0 0 28px 28px",
                }}
              >
                {/* Description */}
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                  lineHeight: 1.65,
                  color: "rgba(253,246,240,0.72)",
                  marginBottom: "1rem",
                }}>
                  {service.description}
                </p>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "1.2rem" }}>
                  {service.features.map((f, fi) => (
                    <motion.div
                      key={fi}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: fi * 0.07 + 0.1, duration: 0.4 }}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <Sparkles size={9} color={service.accentColor} style={{ flexShrink: 0 }} />
                      <span style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                        color: "rgba(253,246,240,0.6)",
                        textTransform: "uppercase",
                      }}>{f}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Duration + CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Clock size={11} color={service.accentColor} />
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      color: "rgba(253,246,240,0.45)",
                      textTransform: "uppercase",
                    }}>{service.duration}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => scrollToSection("contact")}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 400,
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#0a060c",
                      background: `linear-gradient(135deg, ${service.accentColor}, ${service.accentColor}cc)`,
                      border: "none",
                      borderRadius: 100,
                      padding: "0.55rem 1.2rem",
                      cursor: "pointer",
                      boxShadow: `0 4px 20px ${service.accentColor}50`,
                    }}
                  >
                    Explore
                    <ArrowUpRight size={12} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Corner glow accent */}
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{
        width: 120, height: 120,
        background: `radial-gradient(circle, ${service.accentColor}22 0%, transparent 70%)`,
        filter: "blur(20px)",
        transform: "translate(-30%, 30%)",
      }} />

      {/* Card sizing */}
      <style>{`
        .service-card {
          width:  clamp(280px, 30vw, 400px);
          height: clamp(480px, 65vh, 620px);
        }
        @media (max-width: 768px) {
          .service-card {
            width:  clamp(260px, 78vw, 330px) !important;
            height: clamp(460px, 72vh, 560px) !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
