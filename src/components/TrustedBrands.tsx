import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Brand Data — each with its own typographic identity
───────────────────────────────────────────── */
const BRANDS = [
  {
    name: "GlowMuse",
    style: "serif-italic-large",       // Cormorant italic, large
    weight: 300,
    size: "clamp(2rem,4vw,3.4rem)",
    font: "'Cormorant Garamond', serif",
    italic: true,
    tracking: "0.01em",
    color: "shimmer-rose",
  },
  {
    name: "VELVET AURA",
    style: "sans-caps-tight",          // Thin caps, tight tracking
    weight: 100,
    size: "clamp(0.65rem,1.4vw,0.9rem)",
    font: "'Montserrat', sans-serif",
    italic: false,
    tracking: "0.45em",
    color: "champagne",
  },
  {
    name: "LumiSkin",
    style: "serif-bold-display",       // Bold Playfair Display
    weight: 700,
    size: "clamp(1.5rem,2.8vw,2.4rem)",
    font: "'Playfair Display', serif",
    italic: false,
    tracking: "-0.02em",
    color: "gold",
  },
  {
    name: "rosé beauty",
    style: "lowercase-elegant",        // Lowercase, light, delicate
    weight: 300,
    size: "clamp(1.1rem,2vw,1.6rem)",
    font: "'Cormorant Garamond', serif",
    italic: false,
    tracking: "0.12em",
    color: "rose-pale",
  },
  {
    name: "ELIXIR",
    style: "ultra-bold-condensed",     // Ultra bold, very large
    weight: 900,
    size: "clamp(2.4rem,5vw,4.5rem)",
    font: "'Playfair Display', serif",
    italic: false,
    tracking: "0.04em",
    color: "white-pure",
  },
  {
    name: "PureSilk",
    style: "thin-serif-italic",        // Thin, italic, mid-size
    weight: 300,
    size: "clamp(1rem,1.9vw,1.5rem)",
    font: "'Cormorant Garamond', serif",
    italic: true,
    tracking: "0.08em",
    color: "champagne",
  },
  {
    name: "MAISON DORÉE",
    style: "editorial-spaced",         // Editorial, wide tracking
    weight: 400,
    size: "clamp(0.7rem,1.3vw,0.88rem)",
    font: "'Montserrat', sans-serif",
    italic: false,
    tracking: "0.38em",
    color: "gold",
  },
  {
    name: "Lumière",
    style: "accent-italic-mid",        // French accent, italic
    weight: 400,
    size: "clamp(1.3rem,2.4vw,2rem)",
    font: "'Cormorant Garamond', serif",
    italic: true,
    tracking: "0.04em",
    color: "shimmer-rose",
  },
  {
    name: "NOIR ESSENCE",
    style: "sans-caps-medium",
    weight: 200,
    size: "clamp(0.6rem,1.2vw,0.8rem)",
    font: "'Montserrat', sans-serif",
    italic: false,
    tracking: "0.5em",
    color: "rose-pale",
  },
  {
    name: "Atelier Séra",
    style: "display-medium-italic",
    weight: 500,
    size: "clamp(1.4rem,2.6vw,2.2rem)",
    font: "'Playfair Display', serif",
    italic: true,
    tracking: "0.01em",
    color: "gold",
  },
  {
    name: "softskin·studio",
    style: "lowercase-mono-thin",
    weight: 300,
    size: "clamp(0.75rem,1.4vw,1rem)",
    font: "'Montserrat', sans-serif",
    italic: false,
    tracking: "0.22em",
    color: "white-dim",
  },
];

const STATS = [
  { number: "2,000+", label: "Happy Clients" },
  { number: "11", label: "Premium Partners" },
  { number: "4.9★", label: "Average Rating" },
];

/* Color map → actual CSS values */
const COLOR_MAP: Record<string, string> = {
  "shimmer-rose": "linear-gradient(135deg,#F9C8D4 0%,#E8889E 40%,#F0CDCB 80%,#E9B8B0 100%)",
  "champagne": "linear-gradient(135deg,#F5E6C8 0%,#E8D5A0 50%,#F0E8D0 100%)",
  "gold": "linear-gradient(135deg,#D4AF37 0%,#F0D060 45%,#C8A020 80%,#E8C840 100%)",
  "rose-pale": "linear-gradient(135deg,#E8C4C4 0%,#D4AFB9 60%,#EAD0D0 100%)",
  "white-pure": "linear-gradient(135deg,#FFFFFF 0%,#FDF6F0 50%,#F8F0E8 100%)",
  "white-dim": "linear-gradient(135deg,rgba(253,246,240,0.55) 0%,rgba(253,246,240,0.38) 100%)",
};

function BrandName({ brand }: { brand: typeof BRANDS[0] }) {
  const el = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={el}
      className="brand-word"
      style={{
        fontFamily: brand.font,
        fontWeight: brand.weight,
        fontSize: brand.size,
        letterSpacing: brand.tracking,
        fontStyle: brand.italic ? "italic" : "normal",
        background: COLOR_MAP[brand.color],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
        cursor: "default",
        userSelect: "none",
        whiteSpace: "nowrap",
        lineHeight: 1,
        transition: "letter-spacing 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.4s",
      }}
    >
      {brand.name}
    </span>
  );
}

/* Marquee Row — duplicated for seamless loop */
function MarqueeRow({ brands, speed = 60, reverse = false }: {
  brands: typeof BRANDS;
  speed?: number;
  reverse?: boolean;
}) {
  // Triplicate for true seamless loop
  const items = [...brands, ...brands, ...brands];
  return (
    <div className="marquee-outer" style={{ overflow: "hidden", width: "100%" }}>
      <div
        className={reverse ? "marquee-track marquee-reverse" : "marquee-track"}
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {items.map((brand, i) => (
          <span key={i} className="marquee-item">
            <BrandName brand={brand} />
            <Ornament />
          </span>
        ))}
      </div>
    </div>
  );
}

function Ornament() {
  return (
    <span
      className="ornament"
      style={{
        display: "inline-block",
        margin: "0 clamp(1.5rem,3.5vw,4rem)",
        color: "rgba(212,175,55,0.35)",
        fontSize: "0.5rem",
        verticalAlign: "middle",
        letterSpacing: 0,
        fontStyle: "normal",
        fontFamily: "serif",
        userSelect: "none",
      }}
    >
      ✦
    </span>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function TrustedBrands() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const divTop = useRef<HTMLDivElement>(null);
  const divBot = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);

  /* Particle canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d")!;
    const COLS = [
      { r: 231, g: 84, b: 128 }, { r: 212, g: 175, b: 185 }, { r: 212, g: 175, b: 55 },
    ];
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; baseAlpha: number; col: { r: number; g: number; b: number }; t: number; drift: number; driftOff: number; fadeTopY: number };
    const ps: P[] = [];
    const spawn = (seedY?: number) => {
      const c = COLS[Math.floor(Math.random() * COLS.length)];
      const frac = Math.random() < 0.6 ? 0.35 + Math.random() * 0.3 : Math.random() * 0.35;
      ps.push({ x: Math.random() * canvas.width, y: seedY ?? canvas.height + 20, vx: (Math.random() - 0.5) * 0.3, vy: -(Math.random() * 0.7 + 0.2), r: Math.random() * 1.8 + 0.5, alpha: 0, baseAlpha: Math.random() * 0.3 + 0.08, col: c, t: 0, drift: Math.random() * 0.04 + 0.015, driftOff: Math.random() * Math.PI * 2, fadeTopY: canvas.height * frac });
    };
    for (let i = 0; i < 12; i++) spawn(Math.random() * (canvas.height + 200) - 200);
    let frame = 0; let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick); frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame % 7 === 0 && Math.random() < 0.5) spawn();
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]; p.t += 0.035; p.x += p.vx + Math.sin(p.t * p.drift + p.driftOff) * 0.45; p.y += p.vy;
        const fZ = (canvas.height - p.fadeTopY) * 0.4, dFT = p.y - p.fadeTopY;
        p.alpha = dFT < fZ ? p.baseAlpha * Math.max(0, dFT / fZ) : p.baseAlpha;
        if (p.alpha <= 0.006 || p.y < p.fadeTopY - 10) { ps.splice(i, 1); continue; }
        const { r, g, b } = p.col;
        const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.5);
        g2.addColorStop(0, `rgba(${r},${g},${b},${(p.alpha * 0.8).toFixed(3)})`);
        g2.addColorStop(0.5, `rgba(${r},${g},${b},${(p.alpha * 0.25).toFixed(3)})`);
        g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4.5, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.8, 1).toFixed(3)})`; ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  /* Orb float */
  useEffect(() => {
    const floatOrb = (el: HTMLDivElement | null, dur: number, dy: number, dx: number, delay: number) => {
      if (!el) return;
      gsap.to(el, { y: dy, x: dx, scale: 1.08, duration: dur, delay, ease: "sine.inOut", yoyo: true, repeat: -1 });
    };
    floatOrb(orb1.current, 18, -28, 12, 0);
    floatOrb(orb2.current, 22, 22, -8, -3);
    floatOrb(orb3.current, 14, -16, 20, 1.5);
  }, []);

  /* Scroll entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        defaults: { ease: "power3.out" },
      });
      tl
        .fromTo(divTop.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, transformOrigin: "left center" })
        .fromTo(headerRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.7")
        .fromTo(statsRef.current ? Array.from(statsRef.current.children) : [], { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7 }, "-=0.6")
        .fromTo(marqueeRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 }, "-=0.4")
        .fromTo(divBot.current, { scaleX: 0 }, { scaleX: 1, duration: 1, transformOrigin: "right center" }, "-=0.7");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Brand name hover: letter-spacing expansion */
  const onBrandOver = (e: React.MouseEvent) => {
    const word = (e.target as HTMLElement).closest(".brand-word") as HTMLElement | null;
    if (word) {
      // const current = parseFloat(word.style.letterSpacing) || 0;
      word.style.letterSpacing = `calc(${word.style.letterSpacing || "0em"} + 0.06em)`;
      word.style.opacity = "1";
      // shimmer sweep
      word.classList.add("brand-shine");
    }
  };
  const onBrandOut = (e: React.MouseEvent) => {
    const word = (e.target as HTMLElement).closest(".brand-word") as HTMLElement | null;
    if (word) {
      word.style.letterSpacing = word.dataset.origTracking || "0em";
      word.classList.remove("brand-shine");
    }
  };

  /* Store original tracking on mount */
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".brand-word").forEach(el => {
      el.dataset.origTracking = el.style.letterSpacing;
    });
  }, []);

  /* Split brands into two rows for visual rhythm */
  const row1 = BRANDS.slice(0, 6);
  const row2 = BRANDS.slice(5); // slight overlap intentional for variety

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(175deg,#0c0810 0%,#180c14 35%,#130b10 65%,#0a0810 100%)",
        paddingTop: "clamp(90px,11vw,160px)",
        paddingBottom: "clamp(90px,11vw,160px)",
      }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div ref={orb1} className="absolute rounded-full" style={{
          width: 700, height: 700, top: -200, right: "-15%",
          background: "radial-gradient(circle,rgba(231,84,128,0.11) 0%,transparent 65%)",
          filter: "blur(100px)", willChange: "transform", transform: "translateZ(0)"
        }} />
        <div ref={orb2} className="absolute rounded-full" style={{
          width: 600, height: 600, bottom: -150, left: "-10%",
          background: "radial-gradient(circle,rgba(212,175,55,0.09) 0%,transparent 65%)",
          filter: "blur(90px)", willChange: "transform", transform: "translateZ(0)"
        }} />
        <div ref={orb3} className="absolute rounded-full" style={{
          width: 400, height: 400, top: "40%", left: "40%",
          background: "radial-gradient(circle,rgba(212,175,185,0.07) 0%,transparent 65%)",
          filter: "blur(80px)", willChange: "transform", transform: "translateZ(0)"
        }} />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 2,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        opacity: 0.35,
      }} />

      {/* ── Content ── */}
      <div className="relative" style={{ zIndex: 10 }}>

        {/* ── Header ── */}
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Top divider */}
          <div ref={divTop} className="mb-14" style={{
            height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(231,84,128,0.4),rgba(212,175,55,0.35),rgba(231,84,128,0.2),transparent)",
          }} />

          {/* Header block */}
          <div ref={headerRef} className="text-center mb-16">
            {/* Label */}
            <div style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 200,
              fontSize: "0.62rem",
              letterSpacing: "0.42em",
              color: "rgba(212,175,185,0.55)",
              textTransform: "uppercase",
              marginBottom: "2rem",
            }}>
              ✦ &nbsp; Trusted Worldwide &nbsp; ✦
            </div>

            {/* Main heading */}
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 300,
              fontSize: "clamp(2.2rem,4.5vw,4rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.01em",
              color: "#FDF6F0",
              marginBottom: "1.2rem",
            }}>
              Preferred by Beauty Lovers
            </h2>
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(2rem,4vw,3.5rem)",
              lineHeight: 1.06,
              letterSpacing: "0.01em",
              background: "linear-gradient(135deg,#E8889E 0%,#D4AFB9 45%,#D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "2.4rem",
            }}>
              &amp; Premium Brands
            </h2>

            <p style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.78rem,1.3vw,0.92rem)",
              letterSpacing: "0.1em",
              color: "rgba(253,246,240,0.38)",
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 2,
            }}>
              Partnered with the world's most distinguished beauty &amp; wellness houses.
            </p>

            {/* Stats */}
            <div ref={statsRef} style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "clamp(2rem,5vw,5rem)",
              marginTop: "3.5rem",
            }}>
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.6rem,2.8vw,2.4rem)",
                    background: "linear-gradient(135deg,#FDF6F0 0%,#D4AFB9 60%,#D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}>{s.number}</div>
                  <div style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontWeight: 200,
                    fontSize: "0.58rem",
                    letterSpacing: "0.3em",
                    color: "rgba(253,246,240,0.35)",
                    textTransform: "uppercase",
                    marginTop: "0.5rem",
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Thin rule before marquee */}
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(212,175,185,0.15),transparent)",
            marginBottom: "clamp(3rem,6vw,6rem)",
          }} />
        </div>

        {/* ── Marquee Section ── */}
        <div ref={marqueeRef} style={{ width: "100%", overflow: "hidden" }}
          onMouseOver={onBrandOver}
          onMouseOut={onBrandOut}
        >
          {/* Row 1 — forward */}
          <div style={{ marginBottom: "clamp(2rem,4vw,4.5rem)" }}>
            <MarqueeRow brands={row1} speed={70} reverse={false} />
          </div>

          {/* Row 2 — reverse, different brands */}
          <div style={{ marginBottom: "clamp(2rem,4vw,4.5rem)" }}>
            <MarqueeRow brands={row2} speed={55} reverse={true} />
          </div>

          {/* Row 3 — full list forward, slowest */}
          <div>
            <MarqueeRow brands={BRANDS} speed={90} reverse={false} />
          </div>
        </div>

        {/* ── Footer accent ── */}
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Thin rule */}
          <div ref={divBot} style={{
            height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),rgba(231,84,128,0.2),transparent)",
            marginTop: "clamp(3rem,6vw,6rem)",
            marginBottom: "2rem",
          }} />

          {/* Sparkle line */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(1rem,3vw,3rem)" }}>
            {["✦", "◈", "✦", "◈", "✦"].map((s, i) => (
              <span key={i} style={{
                fontSize: "0.45rem",
                color: i % 2 === 0 ? "rgba(212,175,55,0.4)" : "rgba(212,175,185,0.25)",
                animation: `sparkle ${2.2 + i * 0.35}s ease-in-out ${i * 0.25}s infinite alternate`,
                display: "inline-block",
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* ── Marquee track ── */
        .marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marqueeForward var(--marquee-duration, 70s) linear infinite;
          will-change: transform;
        }
        .marquee-reverse {
          animation-name: marqueeBackward;
        }
        @keyframes marqueeForward {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        @keyframes marqueeBackward {
          0%   { transform: translateX(-33.3333%); }
          100% { transform: translateX(0); }
        }

        .marquee-outer:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-item {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          padding: 0 clamp(0.5rem,1vw,1rem);
        }

        /* ── Brand word hover: tracking expansion ── */
        .brand-word:hover {
          letter-spacing: calc(var(--orig-tracking, 0.08em) + 0.07em) !important;
          filter: brightness(1.18);
        }

        /* ── Shine sweep on hover ── */
        @keyframes shineSweep {
          0%   { -webkit-mask-position: -200% center; mask-position: -200% center; }
          100% { -webkit-mask-position:  300% center; mask-position:  300% center; }
        }
        .brand-shine {
          -webkit-mask-image: linear-gradient(100deg, black 40%, rgba(255,255,255,0.6) 50%, black 60%);
          mask-image:         linear-gradient(100deg, black 40%, rgba(255,255,255,0.6) 50%, black 60%);
          -webkit-mask-size: 200% 100%;
          mask-size: 200% 100%;
          animation: shineSweep 0.8s ease-out forwards;
        }

        /* ── Ornament pulse ── */
        .ornament {
          animation: ornamentPulse 4s ease-in-out infinite;
        }
        @keyframes ornamentPulse {
          0%,100% { opacity:0.22; transform: scale(1); }
          50%      { opacity:0.45; transform: scale(1.3); }
        }

        /* ── Sparkle ── */
        @keyframes sparkle {
          from { transform: translateY(0) rotate(0deg); opacity:0.3; }
          to   { transform: translateY(-5px) rotate(25deg); opacity:0.7; }
        }

        /* ── Mobile: slightly smaller marquee items ── */
        @media (max-width: 640px) {
          .marquee-item { padding: 0 0.25rem; }
        }
      `}</style>
    </section>
  );
}
