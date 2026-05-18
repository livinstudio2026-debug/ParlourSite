import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { GalleryItem } from "./galleryTypes";
import { scrollToSection } from "../../utils/scrollToSection";

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  /** ms to wait before the image fades in over the skeleton */
  loadDelay?: number;
}

const BOOKING_CTAS = new Set(["Book Session", "Book Artist"]);
function getCtaDestination(cta: string): string {
  return BOOKING_CTAS.has(cta) ? "contact" : "services";
}

export default function GalleryCard({ item, index, loadDelay = 0 }: GalleryCardProps) {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const imageRef     = useRef<HTMLImageElement>(null);
  const shimRef      = useRef<HTMLDivElement>(null);

  const [loaded,  setLoaded]  = useState(false);
  // `gated` = true means "stagger timer hasn't fired yet, hold the reveal"
  const [gated,   setGated]   = useState(loadDelay > 0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (loadDelay <= 0) return;
    const t = setTimeout(() => setGated(false), loadDelay);
    return () => clearTimeout(t);
  }, [loadDelay]);

  // Show image only once decoded AND stagger timer cleared
  const imageVisible = loaded && !gated;

  /* ── GSAP hover ── */
  const onHoverIn = () => {
    setHovered(true);
    if (imageRef.current)
      gsap.to(imageRef.current, { scale: 1.08, duration: 0.85, ease: "power2.out" });
    if (shimRef.current)
      gsap.fromTo(shimRef.current,
        { x: "-120%", opacity: 1 },
        { x: "120%",  duration: 0.9, ease: "power2.inOut" }
      );
    if (cardInnerRef.current)
      gsap.to(cardInnerRef.current, {
        boxShadow:
          "0 0 0 1.5px rgba(231,84,128,0.55), 0 28px 60px rgba(0,0,0,0.65), 0 0 40px rgba(231,84,128,0.18)",
        duration: 0.4, ease: "power2.out",
      });
  };

  const onHoverOut = () => {
    setHovered(false);
    if (imageRef.current)
      gsap.to(imageRef.current, { scale: 1, duration: 0.7, ease: "power2.out" });
    if (cardInnerRef.current)
      gsap.to(cardInnerRef.current, {
        boxShadow: "0 0 0 1px rgba(212,175,185,0.13), 0 16px 40px rgba(0,0,0,0.45)",
        duration: 0.5, ease: "power2.out",
      });
  };

  const overlayVariants = {
    rest:  { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
  };
  const textVariants = {
    rest:  { y: 16, opacity: 0 },
    hover: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.04 } },
  };

  return (
    /*
      No whileInView / entrance animation on the card.
      Cards are instantly visible as warm-toned skeletons — the grid
      never looks blank. The staggered image reveal IS the "one by one" effect.
    */
    <div className="w-full h-full">
      <div
        ref={cardInnerRef}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        className="relative w-full h-full overflow-hidden cursor-pointer"
        style={{
          borderRadius: 20,
          boxShadow: "0 0 0 1px rgba(212,175,185,0.13), 0 16px 40px rgba(0,0,0,0.45)",
          background: "rgba(20,12,18,0.8)",
        }}
      >

        {/* ─────────────────────────────────────────────
            SKELETON
            Warmer & lighter than the section bg so the
            grid reads as "cards" the instant it renders.
        ───────────────────────────────────────────── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(52,24,36,1) 0%, rgba(38,17,28,1) 50%, rgba(56,26,40,1) 100%)",
            opacity: imageVisible ? 0 : 1,
            transition: "opacity 0.65s ease",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* Diagonal shimmer sweep — clearly a "loading" state */}
          <div
            style={{
              position: "absolute", inset: 0,
              background:
                "linear-gradient(115deg, transparent 20%, rgba(231,84,128,0.13) 42%, rgba(212,175,55,0.08) 54%, transparent 76%)",
              animation: "skeletonShimmer 2s ease-in-out infinite",
              animationDelay: `${index * 0.16}s`,
            }}
          />

          {/* Top edge glow — makes the card boundary crisp */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(231,84,128,0.4), rgba(212,175,55,0.3), transparent)",
            }}
          />
          {/* Left edge accent */}
          <div
            style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: 1,
              background:
                "linear-gradient(180deg, transparent, rgba(231,84,128,0.2), transparent)",
            }}
          />

          {/* Pulsing centre ring */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: "1px solid rgba(231,84,128,0.3)",
                animation: "skeletonRing 1.9s ease-in-out infinite",
                animationDelay: `${index * 0.13}s`,
              }}
            />
          </div>

          {/* Bottom placeholder lines — signals there's text coming */}
          <div style={{ position: "absolute", bottom: 16, left: 14, right: 14, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 7, borderRadius: 4, width: "50%", background: "rgba(212,175,185,0.15)" }} />
            <div style={{ height: 5, borderRadius: 4, width: "72%", background: "rgba(212,175,185,0.09)" }} />
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            IMAGE
            Sits under the skeleton; revealed when
            imageVisible flips to true.
        ───────────────────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
          <img
            ref={imageRef}
            src={item.imageUrl}
            alt={item.title}
            loading="eager"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover object-center"
            style={{
              opacity:   imageVisible ? 1 : 0,
              transform: imageVisible ? "scale(1)" : "scale(1.05)",
              filter:    imageVisible
                ? "brightness(0.87) saturate(1.08)"
                : "brightness(0.87) saturate(1.08) blur(6px)",
              transition:
                "opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94), " +
                "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), " +
                "filter 0.7s ease",
              transformOrigin: "center center",
            }}
          />
        </div>

        {/* Persistent bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top,rgba(8,3,6,0.78) 0%,rgba(8,3,6,0.08) 45%,transparent 100%)",
            zIndex: 3,
          }}
        />

        {/* Shimmer sweep on hover */}
        <div
          ref={shimRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg,transparent 28%,rgba(253,246,240,0.12) 50%,transparent 72%)",
            transform: "translateX(-120%)",
            zIndex: 4,
          }}
        />

        {/* Hover overlay */}
        <motion.div
          variants={overlayVariants}
          animate={hovered ? "hover" : "rest"}
          className="absolute inset-0 flex flex-col justify-end p-5"
          style={{
            background:
              "linear-gradient(160deg,rgba(231,84,128,0.20) 0%,rgba(8,3,6,0.80) 55%,rgba(8,3,6,0.97) 100%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            zIndex: 5,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(231,84,128,0.7),rgba(212,175,55,0.5),transparent)",
            }}
          />

          <motion.div variants={textVariants} animate={hovered ? "hover" : "rest"}>
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-2.5 text-[0.58rem] font-medium tracking-[0.14em] uppercase"
              style={{
                background: "rgba(231,84,128,0.18)",
                border: "1px solid rgba(231,84,128,0.38)",
                color: "#D4AFB9",
              }}
            >
              <span
                className="w-[4px] h-[4px] rounded-full flex-shrink-0"
                style={{ background: "#E75480", boxShadow: "0 0 5px #E75480" }}
              />
              {item.category}
            </div>

            <h3
              className="font-light leading-snug mb-1.5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.05rem,1.8vw,1.35rem)",
                color: "#FDF6F0",
                letterSpacing: "-0.01em",
              }}
            >
              {item.title}
            </h3>

            <p className="text-[0.7rem] font-light leading-relaxed mb-2.5"
              style={{ color: "rgba(253,246,240,0.62)" }}>
              {item.description}
            </p>

            {item.cta && (
              <button
                onClick={() => scrollToSection(getCtaDestination(item.cta!))}
                className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.1em] uppercase border-none bg-transparent cursor-pointer p-0"
                style={{ color: "#E75480", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                {item.cta}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Corner accent */}
        <div
          className="absolute top-3 right-3 pointer-events-none"
          style={{
            width: 26, height: 26,
            borderTop: "1px solid rgba(212,175,55,0.3)",
            borderRight: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "0 8px 0 0",
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 0.3s",
            zIndex: 6,
          }}
        />
      </div>

      {/* Keyframes scoped to this card's usage */}
      <style>{`
        @keyframes skeletonShimmer {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }
        @keyframes skeletonRing {
          0%,100% { transform: scale(1);    opacity: 0.35; }
          50%      { transform: scale(1.28); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
