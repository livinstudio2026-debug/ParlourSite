// src/components/MobileMenu.tsx
import { useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { NAV_ITEMS } from "../config/navigationConfig.ts";
import type { NavId } from "../config/navigationConfig.ts";
import { scrollToSection } from "../utils/scrollToSection.ts";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  active: NavId;
}

/* ─── Orb: floating ambient glow bubble ─── */
function FloatingOrb({
  color,
  size,
  top,
  left,
  delay,
}: {
  color: string;
  size: number;
  top: string;
  left: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: color,
        filter: "blur(60px)",
        opacity: 0,
      }}
      animate={{ opacity: [0, 0.18, 0], y: [0, -30, 0] }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const containerVariants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.5, ease: [0.64, 0, 0.78, 0] as const },
  },
} satisfies Variants;

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
} satisfies Variants;

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
} satisfies Variants;

export default function MobileMenu({ isOpen, onClose, active }: MobileMenuProps) {
  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleNav = (id: string) => {
    onClose();
    // Let close animation play a beat before scrolling
    setTimeout(() => scrollToSection(id), 480);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-40 flex flex-col overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, rgba(12,5,9,0.97) 0%, rgba(18,8,14,0.99) 100%)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
          }}
          aria-modal="true"
          role="dialog"
        >
          {/* ── Ambient orbs ── */}
          <FloatingOrb color="radial-gradient(circle,#E75480,transparent)" size={320} top="10%" left="60%" delay={0} />
          <FloatingOrb color="radial-gradient(circle,#D4AF37,transparent)" size={260} top="55%" left="10%" delay={2.5} />
          <FloatingOrb color="radial-gradient(circle,#D4AFB9,transparent)" size={200} top="75%" left="70%" delay={5} />

          {/* ── Spacer for navbar ── */}
          <div className="flex-shrink-0" style={{ height: "max(76px, env(safe-area-inset-top, 0px) + 76px)" }} />

          {/* ── Gradient rule ── */}
          <div
            className="mx-auto w-[55%] mb-3 flex-shrink-0"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(231,84,128,0.4), rgba(212,175,55,0.4), transparent)",
            }}
          />

          {/* ── Nav links ── */}
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-start flex-1 gap-5 sm:gap-7 px-8 pb-12 list-none m-0 p-0 overflow-y-auto"
            style={{ paddingTop: "clamp(1.5rem, 5vh, 3.5rem)" }}
          >
            {NAV_ITEMS.map(({ label, id }) => {
              const isActive = active === id;
              return (
                <motion.li key={id} variants={itemVariants} className="w-full text-center">
                  <button
                    onClick={() => handleNav(id)}
                    className="relative inline-block bg-transparent border-none cursor-pointer select-none group"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(2rem, 9vw, 3rem)",
                      fontWeight: isActive ? 500 : 300,
                      letterSpacing: "0.05em",
                      color: isActive ? "#E75480" : "rgba(253,246,240,0.6)",
                      transition: "color 0.3s ease",
                      lineHeight: 1.1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(253,246,240,0.92)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = "rgba(253,246,240,0.6)";
                    }}
                  >
                    {/* Number prefix */}
                    <span
                      className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs tracking-widest transition-opacity duration-300"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        color: "rgba(212,175,55,0.5)",
                        opacity: isActive ? 1 : 0,
                        fontSize: "0.6rem",
                      }}
                    >
                      ✦
                    </span>

                    {label}

                    {/* Animated underline */}
                    <span
                      className="block absolute bottom-0 left-0 h-[1px] w-full"
                      style={{
                        background: "linear-gradient(90deg,#E75480,#D4AF37)",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </button>
                </motion.li>
              );
            })}

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="w-10 flex-shrink-0"
              style={{
                height: "1px",
                background: "linear-gradient(90deg,#E75480,#D4AF37)",
                opacity: 0.55,
                marginTop: "0.5rem",
              }}
            />

            {/* CTA */}
            <motion.div variants={itemVariants}>
              <button
                onClick={() => handleNav("contact")}
                className="relative overflow-hidden text-white font-medium tracking-[0.12em] uppercase rounded-full px-10 py-3.5 text-sm select-none cursor-pointer border-none"
                style={{
                  background: "linear-gradient(135deg,#E75480 0%,#b02e60 100%)",
                  boxShadow: "0 0 36px rgba(231,84,128,0.5), 0 0 80px rgba(231,84,128,0.2)",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.14em",
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.05,
                    boxShadow: "0 0 52px rgba(231,84,128,0.7), 0 0 100px rgba(231,84,128,0.3)",
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    boxShadow: "0 0 36px rgba(231,84,128,0.5), 0 0 80px rgba(231,84,128,0.2)",
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <CalendarIcon />
                  Book Appointment
                </span>
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
                    animation: "shimmer 2.4s infinite",
                  }}
                />
              </button>
            </motion.div>
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}
