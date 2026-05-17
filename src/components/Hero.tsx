import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import heroBg from "../assets/hero/heroBg.jpg";
import { scrollToSection } from "../utils/scrollToSection.ts";
import { usePreloaderReady } from "./Preloader";

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const STATS = [
  { number: "2000+", label: "Happy Clients" },
  { number: "15+", label: "Beauty Experts" },
  { number: "5+", label: "Years Experience" },
] as const;

const HERO_IMAGE_URL = heroBg;

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function Hero() {
  const ready = usePreloaderReady(); // true once preloader exits

  /* refs – layout */
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);

  /* ref – particle canvas */
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Particle canvas (rising sparkle dots — same as HTML + a bit more) ── */
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;

    const COLORS = [
      { r: 231, g: 84, b: 128 },
      { r: 212, g: 175, b: 185 },
      { r: 212, g: 175, b: 55 },
      { r: 253, g: 246, b: 240 },
      { r: 255, g: 182, b: 210 },
    ];

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number; baseAlpha: number;
      color: { r: number; g: number; b: number };
      drift: number; driftOffset: number; t: number;
      // The canvas Y at which this particle fully fades out (top of its travel)
      fadeTopY: number;
    };

    const particles: Particle[] = [];

    const spawn = (seedY?: number) => {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      const rand = Math.random();

      // Travel-height distribution:
      //   ~65% of particles: die between 40%–60% height  (mid-screen)
      //   ~25% of particles: die between 15%–40% height  (upper area)
      //    ~10% of particles: travel all the way to top   (0%–15%)
      let fadeTopFraction: number;
      if (rand < 0.65) {
        fadeTopFraction = 0.40 + Math.random() * 0.20; // 40–60% from top
      } else if (rand < 0.90) {
        fadeTopFraction = 0.15 + Math.random() * 0.25; // 15–40% from top
      } else {
        fadeTopFraction = Math.random() * 0.15;        // 0–15%  (near top)
      }

      const fadeTopY = canvas.height * fadeTopFraction;
      const baseAlpha = Math.random() * 0.45 + 0.2;

      particles.push({
        x: Math.random() * canvas.width,
        y: seedY !== undefined ? seedY : canvas.height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.55,
        vy: -(Math.random() * 1.1 + 0.45),
        r: Math.random() * 2.3 + 0.7,
        alpha: baseAlpha,
        baseAlpha,
        color: c,
        drift: Math.random() * 0.06 + 0.02,
        driftOffset: Math.random() * Math.PI * 2,
        t: 0,
        fadeTopY,
      });
    };

    // Pre-seed scattered across the full height
    for (let i = 0; i < 22; i++) {
      spawn(Math.random() * (canvas.height + 200) - 200);
    }

    let frame = 0;
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      frame++;
      if (frame % 2 !== 0) return; // ← paint at 30fps, not 60
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sparse spawn
      if (frame % 5 === 0) {
        if (Math.random() < 0.7) spawn();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += 0.04;
        p.x += p.vx + Math.sin(p.t * p.drift + p.driftOffset) * 0.65;
        p.y += p.vy;

        // Fade alpha based on proximity to its personal fadeTopY ceiling
        // Full alpha from bottom → starts fading when within 35% of its travel range
        const travelRange = canvas.height - p.fadeTopY;
        const distFromTop = p.y - p.fadeTopY;
        const fadeZone = travelRange * 0.35;
        if (distFromTop < fadeZone) {
          p.alpha = p.baseAlpha * Math.max(0, distFromTop / fadeZone);
        } else {
          p.alpha = p.baseAlpha;
        }

        if (p.alpha <= 0.008 || p.y < p.fadeTopY - 10) { particles.splice(i, 1); continue; }

        const { r, g, b } = p.color;

        // Soft glow halo
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(${r},${g},${b},${(p.alpha * 0.85).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b},${(p.alpha * 0.3).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.6, 1).toFixed(3)})`;
        ctx.fill();

        // 4-arm star sparkle on larger dots
        if (p.r > 1.8) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.t * 0.8);
          ctx.globalAlpha = p.alpha * 0.55;
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.lineWidth = 0.7;
          for (let arm = 0; arm < 4; arm++) {
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.r * 3);
            ctx.stroke();
            ctx.rotate(Math.PI / 2);
          }
          ctx.restore();
        }
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Ambient orb float (GSAP) ── */
  const floatOrb = (el: HTMLDivElement | null, dur: number, dy: number, delay: number) => {
    if (!el) return;
    gsap.to(el, {
      y: dy, x: dy * 0.4, scale: 1.06,
      duration: dur, delay,
      ease: "sine.inOut", yoyo: true, repeat: -1,
    });
  };

  /* ── Mount: entrance animations + orb floats ── */
  useEffect(() => {
    if (!ready) return; // wait for preloader to finish

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });

      tl.fromTo(badgeRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
        .fromTo(headingRef.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.5")
        .fromTo(subRef.current, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .fromTo(btnsRef.current, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(
          statsRef.current ? Array.from(statsRef.current.children) : [],
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.1 },
          "-=0.45"
        )
        .fromTo(imageWrapRef.current, { x: 52, opacity: 0 }, { x: 0, opacity: 1, duration: 1.15 }, "-=0.9");

      floatOrb(orb1Ref.current, 14, -28, 0);
      floatOrb(orb2Ref.current, 18, 22, -3);
      floatOrb(orb3Ref.current, 20, -18, -6);
      floatOrb(orb4Ref.current, 16, 14, -1.5);
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  /* ── Button hover micro-interactions ── */
  const btnHoverIn = (e: React.MouseEvent<HTMLButtonElement>) =>
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.28, ease: "power2.out" });
  const btnHoverOut = (e: React.MouseEvent<HTMLButtonElement>) =>
    gsap.to(e.currentTarget, { scale: 1, duration: 0.28, ease: "power2.out" });

  /* ── Stat card hover ── */
  const statIn = (e: React.MouseEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget, { y: -4, scale: 1.03, duration: 0.3, ease: "power2.out" });
  const statOut = (e: React.MouseEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });

  /* ─────────────────────────────────────────────
     Render
  ───────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0d0810 0%,#1a0d14 35%,#120a18 65%,#0f0d0a 100%)" }}
    >

      {/* ════════════════ BACKGROUND LAYERS ════════════════ */}

      {/* Layer 0 – radial base tint (matches HTML hero-bg-base) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(231,84,128,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 20% 60%, rgba(212,175,185,0.06) 0%, transparent 55%)
          `,
        }}
      />

      {/* Layer 1 – animated CSS orbs (matches HTML .orb-1 … orb-4) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* orb-1  large rose, top-right */}
        <div
          ref={orb1Ref}
          className="absolute rounded-full"
          style={{
            width: 560, height: 560,
            top: -140, right: "2%",
            background: "radial-gradient(circle,rgba(231,84,128,0.22) 0%,rgba(231,84,128,0.05) 55%,transparent 78%)",
            filter: "blur(80px)",
          }}
        />
        {/* orb-2  rose, bottom-left */}
        <div
          ref={orb2Ref}
          className="absolute rounded-full"
          style={{
            width: 420, height: 420,
            bottom: -100, left: "5%",
            background: "radial-gradient(circle,rgba(212,175,185,0.16) 0%,transparent 68%)",
            filter: "blur(80px)",
          }}
        />
        {/* orb-3  gold, mid-center */}
        <div
          ref={orb3Ref}
          className="absolute rounded-full"
          style={{
            width: 300, height: 300,
            top: "35%", left: "32%",
            background: "radial-gradient(circle,rgba(212,175,55,0.08) 0%,transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* orb-4  extra pink top-left (sprinkle addition) */}
        <div
          ref={orb4Ref}
          className="absolute rounded-full"
          style={{
            width: 220, height: 220,
            top: "12%", left: "14%",
            background: "radial-gradient(circle,rgba(231,84,128,0.10) 0%,transparent 70%)",
            filter: "blur(55px)",
          }}
        />
      </div>

      {/* Layer 2 – SVG fractal-noise grain overlay (matches HTML .shimmer-overlay) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          opacity: 0.45,
        }}
      />

      {/* Layer 3 – Rising sparkle particle canvas */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
      />

      {/* ════════════════ HERO CONTENT ════════════════ */}
      <div
        className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 pb-16"
        style={{ zIndex: 10 }}
      >
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-7 lg:items-start items-center text-center lg:text-left">

            {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-full px-4 py-[0.38rem] text-[0.7rem] font-medium tracking-[0.15em] uppercase"
              style={{
                background: "rgba(231,84,128,0.1)",
                border: "1px solid rgba(231,84,128,0.3)",
                color: "#D4AFB9",
                opacity: 0,
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
              Premium Beauty Studio · Est. 2019
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="font-light leading-[1.07]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3rem,5.5vw,5.4rem)",
                letterSpacing: "-0.01em",
                color: "#FDF6F0",
                opacity: 0,
              }}
            >
              Reveal Your
              <br />
              <em
                className="not-italic block"
                style={{
                  background: "linear-gradient(135deg,#E75480 0%,#D4AFB9 48%,#D4AF37 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontStyle: "italic",
                }}
              >
                Natural Beauty
              </em>
            </h1>

            {/* Subheading */}
            <p
              ref={subRef}
              className="text-[1rem] font-light leading-[1.78] max-w-[460px]"
              style={{ color: "rgba(253,246,240,0.58)", opacity: 0 }}
            >
              Luxury salon &amp; spa experiences crafted to enhance your elegance,
              confidence, and glow. Where artistry meets genuine self-care.
            </p>

            {/* Buttons */}
            <div ref={btnsRef} className="flex flex-wrap gap-4 justify-center lg:justify-start" style={{ opacity: 0 }}>
              <button
                onMouseEnter={btnHoverIn}
                onMouseLeave={btnHoverOut}
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 rounded-full text-white text-[0.8rem] font-medium tracking-[0.09em] uppercase px-7 py-[0.85rem] border-none cursor-pointer"
                style={{
                  background: "linear-gradient(135deg,#E75480 0%,#c0376a 100%)",
                  boxShadow: "0 6px 28px rgba(231,84,128,0.44), 0 2px 8px rgba(0,0,0,0.28)",
                }}
              >
                <CalendarIcon />
                Book Now
              </button>
              <button
                onMouseEnter={btnHoverIn}
                onMouseLeave={btnHoverOut}
                onClick={() => scrollToSection("services")}
                className="inline-flex items-center gap-2 rounded-full text-[0.8rem] font-light tracking-[0.09em] uppercase px-7 py-[0.85rem] cursor-pointer"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,175,185,0.34)",
                  color: "rgba(253,246,240,0.82)",
                }}
              >
                Explore Services
                <ArrowIcon />
              </button>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-4 justify-center lg:justify-start mt-1" style={{ opacity: 0 }}>
              {STATS.map((s) => (
                <div
                  key={s.label}
                  onMouseEnter={statIn}
                  onMouseLeave={statOut}
                  className="rounded-2xl px-5 py-4 cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.038)",
                    border: "1px solid rgba(212,175,185,0.17)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="font-medium leading-none"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.95rem",
                      background: "linear-gradient(135deg,#FDF6F0,#D4AFB9)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.number}
                  </div>
                  <div
                    className="text-[0.69rem] font-normal tracking-[0.1em] uppercase mt-1"
                    style={{ color: "rgba(253,246,240,0.45)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN – Image ── */}
          <div
            ref={imageWrapRef}
            className="relative flex items-center justify-center"
            style={{ height: 580, opacity: 0 }}
          >
            {/* Glow ring behind image */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 460, height: 460,
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(circle,rgba(231,84,128,0.14) 0%,transparent 65%)",
                filter: "blur(10px)",
                animation: "glowPulse 4.5s ease-in-out infinite",
              }}
            />

            {/* Main image card */}
            <div
              className="relative w-full h-full overflow-hidden"
              style={{
                borderRadius: "40px 40px 50% 40px / 40px 40px 44% 40px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,185,0.14)",
              }}
            >
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: "linear-gradient(165deg,rgba(231,84,128,0.08) 0%,rgba(0,0,0,0.18) 100%)",
                }}
              />
              <img
                src={HERO_IMAGE_URL}
                alt="Luxury beauty salon experience – professional spa setting"
                loading="eager"
                className="w-full h-full object-cover object-center"
                style={{ filter: "brightness(0.95) saturate(1.05)" }}
              />
            </div>

            {/* Corner accent lines */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: 16, right: 16,
                width: 70, height: 70,
                borderBottom: "1px solid rgba(212,175,185,0.25)",
                borderRight: "1px solid rgba(212,175,185,0.25)",
                borderRadius: "0 0 18px 0",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                top: 16, left: 8,
                width: 52, height: 52,
                borderTop: "1px solid rgba(231,84,128,0.24)",
                borderLeft: "1px solid rgba(231,84,128,0.24)",
                borderRadius: "14px 0 0 0",
              }}
            />

            {/* Floating badge – reviews */}
            <div
              className="absolute z-20 flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                bottom: 48, left: -24,
                background: "rgba(18,10,14,0.78)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(212,175,185,0.2)",
                boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
                animation: "floatBadge 5s ease-in-out infinite",
              }}
            >
              <div className="flex gap-[2px]">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <div>
                <div className="text-[0.78rem] font-medium leading-none" style={{ color: "#FDF6F0" }}>
                  4.9 / 5.0
                </div>
                <div
                  className="text-[0.62rem] font-normal mt-[3px]"
                  style={{ color: "rgba(253,246,240,0.5)", letterSpacing: "0.06em" }}
                >
                  Verified Reviews
                </div>
              </div>
            </div>

            {/* Floating badge – award */}
            <div
              className="absolute z-20 flex flex-col items-center justify-center gap-[2px] rounded-2xl px-4 py-3"
              style={{
                top: 60, right: -14,
                background: "rgba(18,10,14,0.78)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(212,175,55,0.2)",
                boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
                animation: "floatBadge 6.5s ease-in-out -1.5s infinite",
              }}
            >
              <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>🏆</span>
              <div
                className="text-[0.65rem] font-medium tracking-[0.08em] uppercase text-center"
                style={{ color: "#D4AF37", marginTop: 4 }}
              >
                Top Studio<br />2024
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10, animation: "fadeInUp 1.5s 2s ease both" }}
      >
        <div
          className="w-[1px] h-12"
          style={{
            background: "linear-gradient(to bottom,rgba(231,84,128,0.55),transparent)",
            animation: "scrollLine 2.2s ease-in-out infinite",
          }}
        />
        <span
          className="text-[0.62rem] tracking-[0.22em] uppercase"
          style={{ color: "rgba(253,246,240,0.3)" }}
        >
          Scroll
        </span>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 7px #E75480; }
          50%      { box-shadow: 0 0 14px #E75480, 0 0 22px rgba(231,84,128,0.4); }
        }
        @keyframes glowPulse {
          0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 0.8; }
          50%      { transform: translate(-50%,-50%) scale(1.1); opacity: 1; }
        }
        @keyframes floatBadge {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%,16px); }
          to   { opacity: 1; transform: translate(-50%,0); }
        }

        /* ── Mobile responsiveness ── */
        @media (max-width: 1024px) {
          .hero-image-col { height: 420px !important; }
        }
        @media (max-width: 768px) {
          .hero-image-col { height: 320px !important; }
          .hero-float-left  { left: -8px !important; bottom: 32px !important; }
          .hero-float-right { right: -4px !important; top: 40px !important; }
        }
        @media (max-width: 480px) {
          .hero-image-col { height: 260px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Icon helpers ── */
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
