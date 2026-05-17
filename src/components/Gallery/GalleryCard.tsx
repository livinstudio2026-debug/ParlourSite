import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import type { GalleryItem } from "./galleryTypes";
import { scrollToSection } from "../../utils/scrollToSection";

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
}

const BOOKING_CTAS = new Set(["Book Session", "Book Artist"]);

function getCtaDestination(cta: string): string {
  return BOOKING_CTAS.has(cta) ? "contact" : "services";
}

// Shared entrance variants — used by the card's outer motion.div.
// The TRIGGER (initial/animate/whileInView) lives in the parent grid,
// not here. Framer Motion propagates the variant name down automatically.
export const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      // Tiny stagger so cards don't feel robotic, but max delay is only
      // 8 * 0.04 = 0.32 s — imperceptible as "waiting", feels like a ripple.
      delay: index * 0.04,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function GalleryCard({ item, index }: GalleryCardProps) {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const imageRef     = useRef<HTMLImageElement>(null);
  const shimRef      = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded]   = useState(false);
  const [hovered, setHovered] = useState(false);

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
        boxShadow: "0 0 0 1.5px rgba(231,84,128,0.55), 0 28px 60px rgba(0,0,0,0.65), 0 0 40px rgba(231,84,128,0.18)",
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
    hover: { y: 0,  opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.04 } },
  };

  return (
    /*
      No whileInView / viewport here.
      The parent grid wrapper owns `initial="hidden"` + `whileInView="visible"`.
      Framer Motion sees `variants` on this child and propagates the active
      variant name down automatically — all cards flip to "visible" the instant
      the grid enters the viewport, with only the tiny per-card delay above.
    */
    <motion.div
      className="w-full h-full"
      variants={cardVariants}
      custom={index}
    >
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
        {/* Skeleton loader */}
        {!loaded && (
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{
              background: "linear-gradient(135deg,rgba(26,14,20,0.95),rgba(40,18,28,0.95))",
              borderRadius: 20,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg,transparent 20%,rgba(231,84,128,0.08) 50%,transparent 80%)",
                animation: "shimmerSkeleton 1.8s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={imageRef}
            src={item.imageUrl}
            alt={item.title}
            loading="eager"
            fetchPriority="high"
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover object-center"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.65s ease",
              transformOrigin: "center center",
              filter: "brightness(0.87) saturate(1.08)",
            }}
          />
        </div>

        {/* Persistent bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to top,rgba(8,3,6,0.78) 0%,rgba(8,3,6,0.08) 45%,transparent 100%)",
          }}
        />

        {/* Shimmer sweep */}
        <div
          ref={shimRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "linear-gradient(105deg,transparent 28%,rgba(253,246,240,0.12) 50%,transparent 72%)",
            transform: "translateX(-120%)",
          }}
        />

        {/* Hover overlay */}
        <motion.div
          variants={overlayVariants}
          animate={hovered ? "hover" : "rest"}
          className="absolute inset-0 z-20 flex flex-col justify-end p-5"
          style={{
            background: "linear-gradient(160deg,rgba(231,84,128,0.20) 0%,rgba(8,3,6,0.80) 55%,rgba(8,3,6,0.97) 100%)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{
              background: "linear-gradient(90deg,transparent,rgba(231,84,128,0.7),rgba(212,175,55,0.5),transparent)",
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

            <p
              className="text-[0.7rem] font-light leading-relaxed mb-2.5"
              style={{ color: "rgba(253,246,240,0.62)" }}
            >
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
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Corner accent */}
        <div
          className="absolute top-3 right-3 z-30 pointer-events-none"
          style={{
            width: 26, height: 26,
            borderTop: "1px solid rgba(212,175,55,0.3)",
            borderRight: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "0 8px 0 0",
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 0.3s",
          }}
        />
      </div>
    </motion.div>
  );
}
