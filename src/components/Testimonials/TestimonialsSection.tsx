import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TestimonialsBackgroundEffects from "./TestimonialsBackgroundEffects.tsx";
import TestimonialsCarousel from "./TestimonialsCarousel.tsx";
import FloatingGlowParticles from "./FloatingGlowParticles.tsx";
import type { TestimonialData } from "./TestimonialCard.tsx";
import test1 from "../../assets/TestimonialSection/test1.jpg";
import test2 from "../../assets/TestimonialSection/test2.jpg";
import test3 from "../../assets/TestimonialSection/test3.jpg";
import test4 from "../../assets/TestimonialSection/test4.jpg";
import test5 from "../../assets/TestimonialSection/test5.jpg";
import test6 from "../../assets/TestimonialSection/test6.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Testimonial Data — premium Unsplash portraits
───────────────────────────────────────────── */
const TESTIMONIALS: TestimonialData[] = [
  {
    id: 1,
    name: "Isabelle Moreau",
    service: "Bridal Makeup",
    location: "Paris, France",
    rating: 5,
    review:
      "My wedding day was everything I dreamed of. The team sculpted a look so ethereal, so perfectly me — I still get emotional looking at the photographs. Absolute magic.",
    imageUrl:
      test1,
    accentColor: "#E75480",
  },
  {
    id: 2,
    name: "Priya Nair",
    service: "Luxury Hair Spa",
    location: "Mumbai, India",
    rating: 5,
    review:
      "Three hours of pure indulgence. My hair has never felt this silky and alive. The aromatherapy scalp ritual alone is worth every single visit. Truly unmatched.",
    imageUrl:
      test2,
    accentColor: "#D4AF37",
  },
  {
    id: 3,
    name: "Amelia Chen",
    service: "Facial Treatment",
    location: "Singapore",
    rating: 5,
    review:
      "I walked in exhausted and walked out luminous. Their bespoke facial is not just a treatment — it's a ritual. My skin has never looked this radiant in my forty years.",
    imageUrl:
      test3,
    accentColor: "#D4AFB9",
  },
  {
    id: 4,
    name: "Sofia Andersson",
    service: "Keratin Therapy",
    location: "Stockholm, Sweden",
    rating: 5,
    review:
      "Six months of perfectly smooth, frizz-free hair. The keratin treatment here is genuinely transformative. I've tried dozens of salons — nothing comes close to LushGlow.",
    imageUrl:
      test4,
    accentColor: "#E75480",
  },
  {
    id: 5,
    name: "Layla Al Rashid",
    service: "Luxury Nail Art",
    location: "Dubai, UAE",
    rating: 5,
    review:
      "Every detail was handled with such artistry. The nail artist understood my vision before I even finished describing it. The result was editorial, bold, breathtaking.",
    imageUrl:
      test5,
    accentColor: "#D4AF37",
  },
  {
    id: 6,
    name: "Nicolette Dubois",
    service: "Luxury Spa Day",
    location: "Lyon, France",
    rating: 5,
    review:
      "An entire day wrapped in gold and warmth. I arrived with tension in my shoulders and left feeling reborn. LushGlow doesn't just offer services — they offer transformation.",
    imageUrl:
      test6,
    accentColor: "#D4AFB9",
  },
];

/* ─────────────────────────────────────────────
   Utility — Shimmer underline
───────────────────────────────────────────── */
function ShimmerUnderline() {
  return (
    <div
      style={{
        position: "relative",
        height: 2,
        width: "100%",
        maxWidth: 260,
        margin: "0 auto",
        background:
          "linear-gradient(90deg, transparent, rgba(212,175,185,0.5), rgba(231,84,128,0.55), rgba(212,175,55,0.35), transparent)",
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(253,246,240,0.7) 50%, transparent 100%)",
          animation: "shimmerLine 2.4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const labelRef     = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Top divider */
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          transformOrigin: "left center",
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      /* Header stagger */
      const hTl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true },
        defaults: { ease: "power3.out" },
      });
      hTl
        .fromTo(labelRef.current,    { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
        .fromTo(headingRef.current,  { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.45")
        .fromTo(underlineRef.current,{ scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, transformOrigin: "center" }, "-=0.55")
        .fromTo(subRef.current,      { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, "-=0.5");

      /* Carousel fade-in */
      gsap.fromTo(
        carouselRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: carouselRef.current, start: "top 85%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#0d0a0d 0%,#120a10 30%,#1a0d14 65%,#0f0d10 100%)",
        paddingTop:    "clamp(90px,11vw,150px)",
        paddingBottom: "clamp(90px,11vw,150px)",
      }}
    >
      {/* Background Effects */}
      <TestimonialsBackgroundEffects />

      {/* Floating particles */}
      <FloatingGlowParticles count={20} />

      {/* Content */}
      <div className="relative max-w-[1400px] mx-auto px-2 sm:px-0 sm:px-10 lg:px-16" style={{ zIndex: 10 }}>

        {/* Top divider */}
        <div
          ref={dividerRef}
          style={{
            height: 1,
            background:
              "linear-gradient(90deg,transparent,rgba(212,175,185,0.4),rgba(231,84,128,0.3),transparent)",
            transformOrigin: "left center",
            marginBottom: "clamp(48px,7vw,88px)",
          }}
        />

        {/* ── Section Header ── */}
        <div className="text-center mb-16" style={{ maxWidth: 720, margin: "0 auto clamp(48px,7vw,88px)" }}>
          {/* Small label */}
          <div
            ref={labelRef}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 28, height: 1, background: "rgba(212,175,185,0.4)" }} />
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#D4AFB9",
              }}
            >
              Client Love
            </span>
            <div style={{ width: 28, height: 1, background: "rgba(212,175,185,0.4)" }} />
          </div>

          {/* Main heading */}
          <h2
            ref={headingRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.1rem, 5vw, 3.5rem)",
              fontWeight: 400,
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
              marginBottom: 16,
              background:
                "linear-gradient(135deg,#FDF6F0 0%,#D4AFB9 45%,#E75480 80%,#D4AF37 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Beauty Experiences<br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>Our Clients Adore</em>
          </h2>

          {/* Shimmer underline */}
          <div ref={underlineRef} style={{ marginBottom: 22 }}>
            <ShimmerUnderline />
          </div>

          {/* Subheading */}
          <p
            ref={subRef}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(0.88rem,1.5vw,1.05rem)",
              fontWeight: 300,
              lineHeight: 1.85,
              color: "rgba(253,246,240,0.48)",
              letterSpacing: "0.02em",
            }}
          >
            Discover why thousands of clients trust LushGlow Beauty Studio for luxury
            beauty transformations and unforgettable self-care experiences.
          </p>
        </div>

        {/* ── Carousel ── */}
        <div ref={carouselRef}>
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>

        {/* ── Bottom trust bar ── */}
        <div
          style={{
            marginTop: "clamp(56px,8vw,96px)",
            paddingTop: 32,
            borderTop: "1px solid rgba(212,175,185,0.08)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(24px,4vw,60px)",
          }}
        >
          {[
            { value: "2,400+", label: "Happy Clients" },
            { value: "4.98", label: "Average Rating" },
            { value: "98%", label: "Would Return" },
            { value: "5★", label: "Google Reviews" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.6rem,3vw,2.2rem)",
                  fontWeight: 400,
                  background:
                    "linear-gradient(135deg, #FDF6F0, #D4AFB9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "rgba(253,246,240,0.36)",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Decorative sparkles in header area */}
      <div
        className="pointer-events-none absolute"
        style={{ top: "8%", left: "5%", zIndex: 3 }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            color: "rgba(231,84,128,0.4)",
            animation: "sparkTc 4s ease-in-out infinite",
            display: "block",
          }}
        >
          ✦
        </span>
      </div>
      <div
        className="pointer-events-none absolute"
        style={{ top: "15%", right: "7%", zIndex: 3 }}
      >
        <span
          style={{
            fontSize: "0.55rem",
            color: "rgba(212,175,55,0.45)",
            animation: "sparkTc 5.5s ease-in-out 1.2s infinite",
            display: "block",
          }}
        >
          ◇
        </span>
      </div>

      <style>{`
        @keyframes shimmerLine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sparkTc {
          0%,100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50%      { transform: translateY(-10px) rotate(22deg); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
