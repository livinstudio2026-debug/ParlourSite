import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import logoImg from "../assets/logo.png";

const PreloaderContext = createContext(false);

/** Returns true once the preloader has fully exited */
export function usePreloaderReady() {
  return useContext(PreloaderContext);
}

/* ─────────────────────────────────────────────
   Color tokens — mirrors the site design system
───────────────────────────────────────────── */
const C = {
  pink:     "#E75480",
  roseGold: "#D4AFB9",
  cream:    "#FDF6F0",
  gold:     "#D4AF37",
  bg:       "#0C0509",
} as const;

/* ─────────────────────────────────────────────
   Particle canvas — same engine as Hero / Footer
───────────────────────────────────────────── */
function PreloaderParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const ctx = cv.getContext("2d")!;
    const COLS = [
      { r: 231, g: 84,  b: 128 },
      { r: 212, g: 175, b: 185 },
      { r: 212, g: 175, b: 55  },
      { r: 253, g: 246, b: 240 },
    ];

    type P = {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; baseAlpha: number;
      color: { r: number; g: number; b: number };
      drift: number; driftOffset: number; t: number; fadeTopY: number;
    };

    const pts: P[] = [];

    const spawn = (sy?: number) => {
      const c   = COLS[Math.floor(Math.random() * COLS.length)];
      const rnd = Math.random();
      const ftf = rnd < 0.65 ? 0.35 + Math.random() * 0.25
                : rnd < 0.90 ? 0.12 + Math.random() * 0.23
                :               Math.random() * 0.12;
      const ba  = Math.random() * 0.35 + 0.12;
      pts.push({
        x: Math.random() * cv.width,
        y: sy ?? cv.height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1.0 + 0.4),
        r: Math.random() * 2.0 + 0.5,
        alpha: ba, baseAlpha: ba, color: c,
        drift: Math.random() * 0.05 + 0.02,
        driftOffset: Math.random() * Math.PI * 2,
        t: 0, fadeTopY: cv.height * ftf,
      });
    };

    for (let i = 0; i < 28; i++) spawn(Math.random() * (cv.height + 200) - 200);

    let frame = 0, raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (++frame % 2 !== 0) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (frame % 5 === 0 && Math.random() < 0.75) spawn();

      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.t += 0.04;
        p.x += p.vx + Math.sin(p.t * p.drift + p.driftOffset) * 0.6;
        p.y += p.vy;
        const tr = cv.height - p.fadeTopY, dt = p.y - p.fadeTopY, fz = tr * 0.35;
        p.alpha = dt < fz ? p.baseAlpha * Math.max(0, dt / fz) : p.baseAlpha;
        if (p.alpha <= 0.006 || p.y < p.fadeTopY - 10) { pts.splice(i, 1); continue; }
        const { r, g, b } = p.color;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(${r},${g},${b},${(p.alpha * 0.8).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b},${(p.alpha * 0.25).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.6, 1).toFixed(3)})`; ctx.fill();
        if (p.r > 1.6) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 0.7);
          ctx.globalAlpha = p.alpha * 0.45;
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`; ctx.lineWidth = 0.5;
          for (let a = 0; a < 4; a++) {
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.r * 2.8); ctx.stroke();
            ctx.rotate(Math.PI / 2);
          }
          ctx.restore();
        }
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
    />
  );
}

/* ─────────────────────────────────────────────
   Animated ring — orbiting golden arc
───────────────────────────────────────────── */
function OrbitalRing({ size, duration, delay, reverse = false }: {
  size: number; duration: number; delay: number; reverse?: boolean;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: "50%",
        border: `1px solid transparent`,
        borderTopColor: "rgba(212,175,55,0.55)",
        borderRightColor: "rgba(231,84,128,0.30)",
        top: "50%", left: "50%",
        marginTop: -size / 2, marginLeft: -size / 2,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─────────────────────────────────────────────
   Progress bar
───────────────────────────────────────────── */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      position: "relative",
      width: "min(320px, 70vw)",
      height: 1,
      background: "rgba(212,175,185,0.12)",
      borderRadius: 999,
      overflow: "hidden",
    }}>
      <motion.div
        style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          background: `linear-gradient(90deg, ${C.pink}, ${C.gold}, ${C.pink})`,
          backgroundSize: "200% 100%",
          boxShadow: `0 0 10px rgba(231,84,128,0.6)`,
          borderRadius: 999,
        }}
        animate={{
          width: `${progress}%`,
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          width: { duration: 0.4, ease: "easeOut" },
          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
        }}
      />
      {/* Leading glow dot */}
      <motion.div
        style={{
          position: "absolute", top: "-1px", height: 3,
          width: 12,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.95), transparent)",
          filter: "blur(1px)",
          borderRadius: 999,
        }}
        animate={{ left: `calc(${progress}% - 6px)` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Preloader
───────────────────────────────────────────── */
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const logoGlowRef = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);

  /* ── Pulsing glow on logo container ── */
  useEffect(() => {
    if (!logoGlowRef.current) return;
    gsap.to(logoGlowRef.current, {
      boxShadow: `0 0 60px rgba(231,84,128,0.65), 0 0 120px rgba(212,175,55,0.22)`,
      duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1,
    });
  }, []);

  /* ── Logo entrance ── */
  useEffect(() => {
    if (!logoRef.current) return;
    gsap.fromTo(logoRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  /* ── Simulated progress ── */
  useEffect(() => {
    const intervals: ReturnType<typeof setTimeout>[] = [];

    // Fast to 70, then slow, then burst to 100
    const steps = [
      { to: 30, at: 100  },
      { to: 55, at: 350  },
      { to: 70, at: 650  },
      { to: 80, at: 1050 },
      { to: 88, at: 1500 },
      { to: 94, at: 2000 },
      { to: 100, at: 2500 },
    ];

    steps.forEach(({ to, at }) => {
      intervals.push(setTimeout(() => setProgress(to), at));
    });

    intervals.push(setTimeout(() => {
      setPhase("reveal");
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 900);
    }, 3100));

    return () => intervals.forEach(clearTimeout);
  }, [onComplete]);

  const taglines = ["Elegance in every detail.", "Where beauty meets artistry.", "Your glow awaits."];
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTaglineIdx(i => (i + 1) % taglines.length), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: C.bg,
            overflow: "hidden",
          }}
        >
          {/* ── Radial background glow ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            background: `
              radial-gradient(ellipse 70% 55% at 50% 50%, rgba(231,84,128,0.09) 0%, transparent 70%),
              radial-gradient(ellipse 45% 40% at 20% 80%, rgba(212,175,55,0.06) 0%, transparent 65%),
              radial-gradient(ellipse 35% 35% at 80% 15%, rgba(212,175,185,0.07) 0%, transparent 60%)
            `,
          }} />

          {/* ── Ambient orbs ── */}
          <motion.div
            style={{
              position: "absolute", width: 500, height: 500,
              borderRadius: "50%", top: "-15%", left: "-10%",
              background: "radial-gradient(circle, rgba(231,84,128,0.10) 0%, transparent 70%)",
              filter: "blur(80px)", zIndex: 1,
            }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            style={{
              position: "absolute", width: 400, height: 400,
              borderRadius: "50%", bottom: "-10%", right: "-8%",
              background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
              filter: "blur(70px)", zIndex: 1,
            }}
            animate={{ x: [0, -20, 0], y: [0, 18, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />

          {/* ── Grain overlay ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.35,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          }} />

          {/* ── Particles ── */}
          <PreloaderParticles />

          {/* ── Decorative corner lines ── */}
          {[
            { top: 24, left: 24, borderTop: true, borderLeft: true },
            { top: 24, right: 24, borderTop: true, borderRight: true },
            { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
            { bottom: 24, right: 24, borderBottom: true, borderRight: true },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
              style={{
                position: "absolute", width: 40, height: 40, zIndex: 10,
                ...pos,
                borderTop: pos.borderTop ? `1px solid rgba(212,175,55,0.28)` : undefined,
                borderLeft: pos.borderLeft ? `1px solid rgba(212,175,55,0.28)` : undefined,
                borderBottom: pos.borderBottom ? `1px solid rgba(212,175,55,0.28)` : undefined,
                borderRight: pos.borderRight ? `1px solid rgba(212,175,55,0.28)` : undefined,
                borderRadius: pos.top !== undefined && pos.left !== undefined ? "12px 0 0 0"
                  : pos.top !== undefined && pos.right !== undefined ? "0 12px 0 0"
                  : pos.bottom !== undefined && pos.left !== undefined ? "0 0 0 12px"
                  : "0 0 12px 0",
              }}
            />
          ))}

          {/* ── Central content ── */}
          <div
            ref={logoRef}
            style={{
              position: "relative", zIndex: 10, display: "flex",
              flexDirection: "column", alignItems: "center", gap: 32,
              opacity: 0,
            }}
          >
            {/* Logo lockup with orbital rings */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

              {/* Orbital rings */}
              <OrbitalRing size={160} duration={8}  delay={0} />
              <OrbitalRing size={200} duration={13} delay={0.5} reverse />
              <OrbitalRing size={244} duration={18} delay={1} />

              {/* Logo glow container */}
              <div
                ref={logoGlowRef}
                style={{
                  width: 100, height: 100, borderRadius: 26,
                  border: "1px solid rgba(231,84,128,0.35)",
                  background: "linear-gradient(135deg, rgba(231,84,128,0.12) 0%, rgba(212,175,55,0.07) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 30px rgba(231,84,128,0.30)",
                  backdropFilter: "blur(8px)",
                  position: "relative", zIndex: 2,
                  overflow: "hidden",
                }}
              >
                {/* Shimmer sweep on logo box */}
                <motion.div
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)",
                  }}
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                />
                <img
                  src={logoImg}
                  alt="LushGlow Beauty Studio"
                  style={{ width: 72, height: 72, objectFit: "contain" }}
                />
              </div>

              {/* Rotating sparkle dots on the outer ring */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 4, height: 4, borderRadius: "50%",
                    background: i % 2 === 0 ? C.gold : C.pink,
                    boxShadow: `0 0 6px ${i % 2 === 0 ? C.gold : C.pink}`,
                    top: "50%", left: "50%",
                  }}
                  animate={{
                    rotate: [deg, deg + 360],
                    x: Math.cos((deg * Math.PI) / 180) * 122 - 2,
                    y: Math.sin((deg * Math.PI) / 180) * 122 - 2,
                  }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    x: { duration: 10, repeat: Infinity, ease: "linear" },
                    y: { duration: 10, repeat: Infinity, ease: "linear" },
                  }}
                />
              ))}
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
            >
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
                fontWeight: 300, letterSpacing: "0.06em",
                background: `linear-gradient(135deg, ${C.cream} 0%, ${C.roseGold} 50%, ${C.gold} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                lineHeight: 1.15,
              }}>
                LushGlow Beauty Studio
              </span>

              {/* Animated tagline */}
              <div style={{ height: 18, overflow: "hidden", position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={taglineIdx}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: "block",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.62rem", fontWeight: 400,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "rgba(212,175,185,0.6)",
                    }}
                  >
                    {taglines[taglineIdx]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Shimmer divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "min(240px, 55vw)", height: 1,
                background: `linear-gradient(90deg, transparent, ${C.pink} 25%, ${C.gold} 75%, transparent)`,
                boxShadow: `0 0 14px rgba(231,84,128,0.4)`,
              }}
            />

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
            >
              <ProgressBar progress={progress} />

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.58rem", fontWeight: 500,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(212,175,185,0.45)",
                }}>
                  Preparing your experience
                </span>
                {/* Animated dots */}
                <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      style={{
                        display: "block", width: 3, height: 3, borderRadius: "50%",
                        background: C.roseGold,
                      }}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    />
                  ))}
                </span>
              </div>

              {/* Percentage */}
              <motion.span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem", fontWeight: 300,
                  background: `linear-gradient(135deg, ${C.pink}, ${C.gold})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  letterSpacing: "0.05em",
                }}
              >
                {progress}%
              </motion.span>
            </motion.div>
          </div>

          {/* ── Bottom signature line ── */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 10,
              background: `linear-gradient(90deg, transparent 0%, ${C.pink} 20%, ${C.gold} 50%, ${C.roseGold} 80%, transparent 100%)`,
              boxShadow: `0 0 20px rgba(231,84,128,0.5), 0 0 40px rgba(212,175,55,0.18)`,
            }}
          />

          {/* ── Keyframes ── */}
          <style>{`
            @keyframes preloaderShimmer {
              0%   { background-position: -200% center; }
              100% { background-position:  200% center; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   PreloaderWrapper — drop into App.tsx
   Usage:
     <PreloaderWrapper>
       <App />
     </PreloaderWrapper>
───────────────────────────────────────────── */
export function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const handleComplete = useCallback(() => setDone(true), []);

  return (
    <PreloaderContext.Provider value={done}>
      <Preloader onComplete={handleComplete} />
      {children}
    </PreloaderContext.Provider>
  );
}
