import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import about1 from "../assets/about/about1.jpg";
import about2 from "../assets/about/about2.jpg";
import { scrollToSection } from "../utils/scrollToSection.ts";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <BadgeCheckIcon />,
    title: "Certified Experts",
    desc: "Our specialists are internationally certified with years of hands-on luxury beauty experience.",
    accent: "#E75480",
  },
  {
    icon: <LeafIcon />,
    title: "Premium Products",
    desc: "We exclusively use organic, dermatologist-tested formulations trusted by top beauty professionals.",
    accent: "#D4AF37",
  },
  {
    icon: <ShieldIcon />,
    title: "Hygienic Environment",
    desc: "Salon-grade sterilization protocols and pristine studio standards maintained for your safety.",
    accent: "#D4AFB9",
  },
  {
    icon: <SparkleIcon />,
    title: "Personalized Care",
    desc: "Every treatment is bespoke — crafted around your unique features, skin type, and beauty vision.",
    accent: "#E75480",
  },
];

const HIGHLIGHTS = [
  { number: "5+",    label: "Years Experience", sub: "Est. 2019" },
  { number: "2000+", label: "Happy Clients",    sub: "& Counting" },
  { number: "100%",  label: "Organic Products", sub: "Certified" },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function AboutSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const descRef      = useRef<HTMLParagraphElement>(null);
  const featuresRef  = useRef<HTMLDivElement>(null);
  const imageColRef  = useRef<HTMLDivElement>(null);
  const statsBarRef  = useRef<HTMLDivElement>(null);
  const orb1Ref      = useRef<HTMLDivElement>(null);
  const orb2Ref      = useRef<HTMLDivElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);

  /* ── Orb float ── */
  const floatOrb = (el: HTMLDivElement | null, dur: number, dy: number, delay: number) => {
    if (!el) return;
    gsap.to(el, { y: dy, x: dy * 0.25, scale: 1.04, duration: dur, delay, ease: "sine.inOut", yoyo: true, repeat: -1 });
  };

  /* ── Scroll-triggered reveal ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      floatOrb(orb1Ref.current, 18, -22, 0);
      floatOrb(orb2Ref.current, 22, 18, -5);

      /* Divider */
      gsap.fromTo(dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, transformOrigin: "left center", ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } });

      /* Left column (image) */
      gsap.fromTo(imageColRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true } });

      /* Right column stagger */
      const rightTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 68%", once: true },
        defaults: { ease: "power3.out" },
      });

      rightTl
        .fromTo(labelRef.current,   { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(headingRef.current, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1   }, "-=0.5")
        .fromTo(descRef.current,    { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
        .fromTo(
          featuresRef.current ? Array.from(featuresRef.current.children) : [],
          { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.65 }, "-=0.5"
        )
        .fromTo(
          statsBarRef.current ? Array.from(statsBarRef.current.children) : [],
          { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.55 }, "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Feature card hover ── */
  const cardIn  = (e: React.MouseEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget, { y: -6, scale: 1.02, duration: 0.3, ease: "power2.out" });
  const cardOut = (e: React.MouseEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget, { y: 0,  scale: 1,    duration: 0.3, ease: "power2.out" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg,#120a10 0%,#1a0d14 35%,#0f0d10 65%,#0d0a0d 100%)",
        paddingTop:    "clamp(90px,11vw,150px)",
        paddingBottom: "clamp(90px,11vw,150px)",
      }}
    >
      {/* ── Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div ref={orb1Ref} className="absolute rounded-full"
          style={{ width:550,height:550,top:-120,left:"-5%", background:"radial-gradient(circle,rgba(231,84,128,0.14) 0%,transparent 68%)", filter:"blur(90px)",willChange:"transform",transform:"translateZ(0)" }} />
        <div ref={orb2Ref} className="absolute rounded-full"
          style={{ width:400,height:400,bottom:-80,right:"3%", background:"radial-gradient(circle,rgba(212,175,55,0.09) 0%,transparent 65%)", filter:"blur(80px)",willChange:"transform",transform:"translateZ(0)" }} />
        <div className="absolute rounded-full"
          style={{ width:280,height:280,top:"35%",right:"30%", background:"radial-gradient(circle,rgba(212,175,185,0.06) 0%,transparent 70%)", filter:"blur(65px)",willChange:"transform",transform:"translateZ(0)" }} />
      </div>

      {/* ── Grain ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        opacity:0.4 }} />

      {/* ── Shimmer sweep ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, overflow:"hidden" }}>
        <div className="about-shimmer" />
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16" style={{ zIndex: 10 }}>

        {/* Animated divider */}
        <div ref={dividerRef} className="mb-16"
          style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(212,175,185,0.4),rgba(231,84,128,0.3),transparent)", transformOrigin:"left center" }} />

        {/* Two-column grid */}
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* ══ LEFT — Image Composition ══ */}
          <div ref={imageColRef} className="relative" style={{ minHeight: 560 }}>

            {/* Primary image card */}
            <div className="about-image-main"
              style={{
                position:"absolute", top:0, left:0, right:"12%", height:460,
                borderRadius:"32px 32px 48px 32px / 32px 32px 44px 32px",
                background:"linear-gradient(145deg,rgba(231,84,128,0.08) 0%,rgba(26,13,20,0.9) 100%)",
                border:"1px solid rgba(212,175,185,0.12)",
                boxShadow:"0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(212,175,185,0.08)",
                overflow:"hidden",
              }}>
              {/* Real salon image */}
              <img
                src={about1}
                alt="LushGlow Beauty Studio interior"
                loading="lazy"
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", filter:"brightness(0.88) saturate(1.05)" }}
              />
              {/* Luxury colour overlay */}
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(165deg,rgba(231,84,128,0.12) 0%,rgba(0,0,0,0.22) 100%)" }} />
              {/* Corner top-left accent */}
              <div style={{ position:"absolute", top:20, left:20, width:48, height:48,
                borderTop:"1px solid rgba(231,84,128,0.3)", borderLeft:"1px solid rgba(231,84,128,0.3)", borderRadius:"12px 0 0 0" }} />
              {/* Floating sparkles */}
              <div className="about-sparkle about-sparkle-1">✦</div>
              <div className="about-sparkle about-sparkle-2">◇</div>
            </div>

            {/* Secondary image card — offset bottom-right */}
            <div className="about-image-secondary"
              style={{
                position:"absolute", bottom:0, right:0, width:"55%", height:220,
                borderRadius:"24px",
                background:"linear-gradient(145deg,rgba(212,175,55,0.05) 0%,rgba(20,12,16,0.95) 100%)",
                border:"1px solid rgba(212,175,55,0.15)",
                boxShadow:"0 16px 48px rgba(0,0,0,0.5)",
                overflow:"hidden",
              }}>
              {/* Real salon image */}
              <img
                src={about2}
                alt="LushGlow beauty treatment"
                loading="lazy"
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", filter:"brightness(0.82) saturate(1.08)" }}
              />
              {/* Rose-gold tint overlay */}
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(135deg,rgba(212,175,55,0.08) 0%,rgba(0,0,0,0.32) 100%)" }} />
            </div>

            {/* Floating mini stat card — top right */}
            <div className="about-float-card about-float-1"
              style={{
                position:"absolute", top:24, right:0,
                background:"rgba(18,10,14,0.82)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                border:"1px solid rgba(212,175,55,0.22)", borderRadius:"18px",
                padding:"14px 18px", zIndex:20,
                boxShadow:"0 8px 28px rgba(0,0,0,0.45)",
              }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", lineHeight:1,
                background:"linear-gradient(135deg,#D4AF37,#FDF6F0)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                5+
              </div>
              <div className="text-[0.6rem] tracking-[0.14em] uppercase mt-1"
                style={{ color:"rgba(253,246,240,0.45)" }}>Years of Luxury</div>
            </div>

            {/* Floating mini card — bottom left */}
            <div className="about-float-card about-float-2"
              style={{
                position:"absolute", bottom:230, left:-16,
                background:"rgba(18,10,14,0.82)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
                border:"1px solid rgba(231,84,128,0.22)", borderRadius:"18px",
                padding:"12px 16px", zIndex:20,
                boxShadow:"0 8px 28px rgba(0,0,0,0.4)",
              }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                  style={{ background:"rgba(231,84,128,0.15)", border:"1px solid rgba(231,84,128,0.3)", color:"#E75480" }}>
                  ✦
                </div>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", lineHeight:1,
                    background:"linear-gradient(135deg,#FDF6F0,#D4AFB9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    2000+
                  </div>
                  <div className="text-[0.58rem] tracking-[0.12em] uppercase" style={{ color:"rgba(253,246,240,0.42)" }}>
                    Happy Clients
                  </div>
                </div>
              </div>
            </div>

            {/* Glow ring behind composition */}
            <div style={{ position:"absolute", top:"30%", left:"25%", width:320, height:320,
              background:"radial-gradient(circle,rgba(231,84,128,0.08) 0%,transparent 65%)",
              filter:"blur(40px)", borderRadius:"50%", pointerEvents:"none", zIndex:0 }} />
          </div>

          {/* ══ RIGHT — Text Content ══ */}
          <div className="flex flex-col gap-7">

            {/* Label */}
            <div ref={labelRef}
              className="inline-flex items-center gap-2 self-start rounded-full px-4 py-[0.36rem] text-[0.68rem] font-medium tracking-[0.18em] uppercase"
              style={{ background:"rgba(231,84,128,0.1)", border:"1px solid rgba(231,84,128,0.28)", color:"#D4AFB9" }}>
              <span className="w-[4px] h-[4px] rounded-full flex-shrink-0"
                style={{ background:"#E75480", boxShadow:"0 0 6px #E75480", animation:"pulseGlowA 2s ease-in-out infinite" }} />
              About LushGlow
            </div>

            {/* Heading */}
            <h2 ref={headingRef}
              className="font-light leading-[1.07]"
              style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,3.8vw,3.4rem)", letterSpacing:"-0.01em", color:"#FDF6F0" }}>
              Where Luxury, Beauty<br />
              <em className="not-italic"
                style={{ background:"linear-gradient(135deg,#E75480 0%,#D4AFB9 48%,#D4AF37 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", fontStyle:"italic" }}>
                &amp; Confidence Meet
              </em>
            </h2>

            {/* Description */}
            <p ref={descRef}
              className="text-[0.97rem] font-light leading-[1.82]"
              style={{ color:"rgba(253,246,240,0.54)", maxWidth:500 }}>
              At LushGlow Beauty Studio, we create personalized beauty experiences that blend elegance, relaxation, and modern artistry. From luxury skincare to flawless bridal transformations, every service is designed to make you feel radiant and confident.
            </p>

            {/* Feature Cards Grid */}
            <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  onMouseEnter={cardIn}
                  onMouseLeave={cardOut}
                  className="relative group cursor-default rounded-2xl p-4 feature-card"
                  style={{
                    background:"rgba(255,255,255,0.032)",
                    backdropFilter:"blur(14px)",
                    WebkitBackdropFilter:"blur(14px)",
                    border:"1px solid rgba(212,175,185,0.1)",
                    transition:"border-color 0.35s, box-shadow 0.35s",
                  }}
                >
                  {/* Glow border */}
                  <div className="feature-glow" style={{ "--ac": f.accent } as React.CSSProperties} />

                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-[2px]"
                      style={{ background:`${f.accent}15`, border:`1px solid ${f.accent}28`, color:f.accent }}>
                      {f.icon}
                    </div>
                    <div>
                      <div className="text-[0.83rem] font-medium mb-1"
                        style={{ color:"#FDF6F0", fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", letterSpacing:"0.01em" }}>
                        {f.title}
                      </div>
                      <div className="text-[0.72rem] font-light leading-[1.65]"
                        style={{ color:"rgba(253,246,240,0.44)" }}>
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats bar */}
            <div ref={statsBarRef}
              className="flex flex-wrap gap-4 mt-2 pt-6"
              style={{ borderTop:"1px solid rgba(212,175,185,0.1)" }}>
              {HIGHLIGHTS.map((h) => (
                <div key={h.label} className="flex flex-col gap-[2px]">
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", lineHeight:1,
                    background:"linear-gradient(135deg,#FDF6F0,#D4AFB9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    {h.number}
                  </div>
                  <div className="text-[0.66rem] tracking-[0.1em] uppercase" style={{ color:"rgba(253,246,240,0.45)" }}>
                    {h.label}
                  </div>
                  <div className="text-[0.58rem] tracking-[0.08em]" style={{ color:"rgba(212,175,55,0.5)" }}>
                    {h.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-1">
              <button
                onClick={() => scrollToSection("services")}
                className="about-cta inline-flex items-center gap-2 rounded-full text-white text-[0.78rem] font-medium tracking-[0.1em] uppercase px-7 py-[0.85rem] border-none cursor-pointer"
                style={{ background:"linear-gradient(135deg,#E75480 0%,#c0376a 100%)", boxShadow:"0 6px 28px rgba(231,84,128,0.38), 0 2px 8px rgba(0,0,0,0.28)" }}>
                <HeartIcon />
                Discover Our Story
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulseGlowA {
          0%,100% { box-shadow: 0 0 6px #E75480; }
          50%      { box-shadow: 0 0 12px #E75480,0 0 20px rgba(231,84,128,0.4); }
        }

        .about-sparkle {
          position: absolute;
          font-size: 0.75rem;
          pointer-events: none;
          user-select: none;
        }
        .about-sparkle-1 {
          top: 22%; right: 18%;
          color: rgba(231,84,128,0.55);
          animation: sparkleA 3s ease-in-out infinite;
        }
        .about-sparkle-2 {
          top: 55%; right: 28%;
          color: rgba(212,175,55,0.45);
          animation: sparkleA 4s ease-in-out 1s infinite;
        }
        @keyframes sparkleA {
          0%,100% { transform: translateY(0) rotate(0deg); opacity:0.5; }
          50%      { transform: translateY(-8px) rotate(25deg); opacity:1; }
        }

        .about-float-1 { animation: floatCardA 5.5s ease-in-out infinite; }
        .about-float-2 { animation: floatCardA 7s ease-in-out 1.5s infinite; }
        @keyframes floatCardA {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }

        .about-shimmer {
          position: absolute;
          top: 0; left: -60%;
          width: 35%; height: 100%;
          background: linear-gradient(105deg,transparent 30%,rgba(253,246,240,0.014) 50%,transparent 70%);
          animation: aboutShimmerSweep 10s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes aboutShimmerSweep {
          0%   { left: -60%; }
          100% { left: 140%; }
        }

        .feature-card {
          position: relative;
          overflow: hidden;
        }
        .feature-card:hover {
          border-color: rgba(212,175,185,0.24) !important;
          box-shadow: 0 10px 36px rgba(0,0,0,0.3), 0 0 0 1px rgba(231,84,128,0.12);
        }
        .feature-glow {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.4s;
          border: 1px solid var(--ac, #E75480);
          pointer-events: none;
        }
        .feature-card:hover .feature-glow {
          opacity: 0.35;
          box-shadow: 0 0 16px var(--ac, #E75480), inset 0 0 16px rgba(231,84,128,0.04);
        }

        .about-cta {
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .about-cta:hover {
          transform: scale(1.04);
          box-shadow: 0 10px 36px rgba(231,84,128,0.5), 0 2px 8px rgba(0,0,0,0.3) !important;
        }

        @media (max-width: 768px) {
          .about-float-1 { top: 16px !important; right: 8px !important; }
          .about-float-2 { left: -8px !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Icon helpers ── */
function BadgeCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 4.9L20 8l-4 3.9 1 5.5-5-2.6L7 17.4l1-5.5L4 8l5.6-1.1z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22c0 0 6-8 10-10s10-2 10-2-2 6-6 8-14 4-14 4z"/>
      <path d="M2 22 L12 12"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
