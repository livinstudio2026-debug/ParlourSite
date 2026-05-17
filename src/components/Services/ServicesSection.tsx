import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ServicesBackgroundEffects from "./ServicesBackgroundEffects.tsx";
import ServicesScrollWrapper from "./ServicesScrollWrapper.tsx";
import PremiumServiceCard from "./PremiumServiceCard.tsx";
import type { ServiceData } from "./types.ts";

// ── Service images ──────────────────────────────────────────
import imgBridalMakeup from "../../assets/services/BridalMakeup.jpg";
import imgHairStyling from "../../assets/services/HairStyling.jpg";
import imgHairColoring from "../../assets/services/HairColoring.jpg";
import imgLuxuryFacial from "../../assets/services/LuxuryFacial.jpg";
import imgSpaTheraphy from "../../assets/services/SpaTheraphy.jpg";
import imgNailArt from "../../assets/services/NailArt.jpg";
import imgSkinTreatment from "../../assets/services/SkinTreatment.jpg";
import imgKeratinTreatment from "../../assets/services/KeratinTreatment.jpg";
import imgAromaTheraphy from "../../assets/services/AromaTheraphy.jpg";
import imgHairSpa from "../../assets/services/HairSpa.jpg";

// gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Service data — real photos + gradient overlays
───────────────────────────────────────────── */
const SERVICES: ServiceData[] = [
  {
    id: 1,
    title: "Bridal Makeup",
    tagline: "Timeless Bridal Radiance",
    price: "₹8,500",
    duration: "3–4 hours",
    description: "A couture artistry experience sculpted around your unique beauty — from dramatic sunset eyes to the softest candlelit glow.",
    features: ["HD & Airbrush Finish", "Long-Wear Formulas", "Trial Session Included", "Bridal Consultation"],
    gradient: "linear-gradient(145deg, rgba(45,10,26,0.45) 0%, rgba(92,26,42,0.35) 50%, rgba(232,96,122,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(20,6,12,0.15) 0%, rgba(20,6,12,0.55) 55%, rgba(10,4,8,0.94) 100%)",
    accentColor: "#E75480",
    icon: "✦",
    badge: "Most Booked",
    image: imgBridalMakeup,
  },
  {
    id: 2,
    title: "Hair Styling",
    tagline: "Editorial Hair Architecture",
    price: "₹1,800",
    duration: "1–2 hours",
    description: "From deconstructed waves to architectural updos — hair shaped with the precision of a couture runway.",
    features: ["Blowout & Texture", "Braid Artistry", "Heat Styling", "Finishing Serums"],
    gradient: "linear-gradient(145deg, rgba(13,10,26,0.45) 0%, rgba(26,16,53,0.35) 50%, rgba(74,48,160,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(8,6,16,0.15) 0%, rgba(8,6,16,0.52) 55%, rgba(4,3,10,0.94) 100%)",
    accentColor: "#9B7FE8",
    icon: "◈",
    badge: "Trending",
    image: imgHairStyling,
  },
  {
    id: 3,
    title: "Hair Coloring",
    tagline: "Chromatic Transformation",
    price: "₹3,500",
    duration: "2–5 hours",
    description: "Bespoke color narratives painted strand by strand — balayage, highlights, or full global color in rare couture tones.",
    features: ["Balayage & Highlights", "Root Touch-Up", "Toning & Gloss", "Ammonia-Free Options"],
    gradient: "linear-gradient(145deg, rgba(10,26,13,0.45) 0%, rgba(26,53,32,0.35) 50%, rgba(106,176,96,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(6,12,8,0.15) 0%, rgba(6,12,8,0.52) 55%, rgba(3,7,4,0.94) 100%)",
    accentColor: "#6AB060",
    icon: "❋",
    image: imgHairColoring,
  },
  {
    id: 4,
    title: "Luxury Facial",
    tagline: "Skin Haute Couture",
    price: "₹4,200",
    duration: "75–90 min",
    description: "A sensory journey through rare botanical actives and clinical-grade technology, leaving skin luminous beyond imagination.",
    features: ["Deep Cleanse & Exfoliation", "Serum Infusion", "Gold Leaf Mask", "Lymphatic Drainage"],
    gradient: "linear-gradient(145deg, rgba(26,20,0,0.45) 0%, rgba(53,42,0,0.35) 50%, rgba(192,152,0,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(12,10,0,0.15) 0%, rgba(12,10,0,0.52) 55%, rgba(6,5,0,0.94) 100%)",
    accentColor: "#D4AF37",
    icon: "◉",
    badge: "Premium",
    image: imgLuxuryFacial,
  },
  {
    id: 5,
    title: "Spa Therapy",
    tagline: "Sanctuary of Serenity",
    price: "₹5,500",
    duration: "2–3 hours",
    description: "A holistic immersion — warm oil rituals, stone therapy, and botanical wraps that dissolve tension into pure euphoria.",
    features: ["Hot Stone Massage", "Aromatherapy Oils", "Body Scrub & Wrap", "Scalp Ritual"],
    gradient: "linear-gradient(145deg, rgba(26,13,10,0.45) 0%, rgba(53,32,5,0.35) 50%, rgba(192,112,64,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(12,8,6,0.15) 0%, rgba(12,8,6,0.52) 55%, rgba(6,4,3,0.94) 100%)",
    accentColor: "#C07840",
    icon: "⬡",
    image: imgSpaTheraphy,
  },
  {
    id: 6,
    title: "Nail Art",
    tagline: "Fingertip Masterpieces",
    price: "₹1,200",
    duration: "45–90 min",
    description: "Hand-painted micro-artistry — from minimalist French couture to baroque floral statements sealed in enduring gel.",
    features: ["Gel & Acrylic Extensions", "3D Embellishments", "Ombre & Chrome", "Cuticle Care"],
    gradient: "linear-gradient(145deg, rgba(26,0,13,0.45) 0%, rgba(53,0,32,0.35) 50%, rgba(224,64,154,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(12,0,8,0.15) 0%, rgba(12,0,8,0.52) 55%, rgba(6,0,4,0.94) 100%)",
    accentColor: "#E0409A",
    icon: "◇",
    badge: "New",
    image: imgNailArt,
  },
  {
    id: 7,
    title: "Skin Treatment",
    tagline: "Advanced Dermal Science",
    price: "₹3,800",
    duration: "60–90 min",
    description: "Clinical-grade skin correction fused with luxurious ritual — targeting hyperpigmentation, texture, and radiance.",
    features: ["Chemical Peel Options", "LED Phototherapy", "Hyaluronic Boosters", "Post-Care Protocol"],
    gradient: "linear-gradient(145deg, rgba(0,26,26,0.45) 0%, rgba(0,53,53,0.35) 50%, rgba(0,180,192,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(0,12,12,0.15) 0%, rgba(0,12,12,0.52) 55%, rgba(0,6,6,0.94) 100%)",
    accentColor: "#40C0C0",
    icon: "✧",
    image: imgSkinTreatment,
  },
  {
    id: 8,
    title: "Keratin Treatment",
    tagline: "Silken Transformation",
    price: "₹6,500",
    duration: "3–4 hours",
    description: "Brazilian-grade keratin infusion that erases frizz, amplifies shine, and leaves hair impossibly silk-smooth for months.",
    features: ["Frizz Elimination", "Intense Shine Boost", "Formaldehyde-Free", "Longevity 3–5 Months"],
    gradient: "linear-gradient(145deg, rgba(26,16,10,0.45) 0%, rgba(53,32,10,0.35) 50%, rgba(192,128,64,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(12,8,6,0.15) 0%, rgba(12,8,6,0.52) 55%, rgba(6,4,3,0.94) 100%)",
    accentColor: "#D4A060",
    icon: "∞",
    image: imgKeratinTreatment,
  },
  {
    id: 9,
    title: "Aromatherapy",
    tagline: "Sensory Alchemy",
    price: "₹2,800",
    duration: "60 min",
    description: "Pure essential oil blends choreographed to your emotional state — calming, uplifting, or restoring with every breath.",
    features: ["Bespoke Oil Blending", "Full-Body Massage", "Chakra Balancing", "Take-Home Blend"],
    gradient: "linear-gradient(145deg, rgba(10,0,26,0.45) 0%, rgba(26,0,53,0.35) 50%, rgba(96,0,192,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(6,0,12,0.15) 0%, rgba(6,0,12,0.52) 55%, rgba(3,0,6,0.94) 100%)",
    accentColor: "#A060E8",
    icon: "☽",
    image: imgAromaTheraphy,
  },
  {
    id: 10,
    title: "Hair Spa",
    tagline: "Deep Restoration Ritual",
    price: "₹2,200",
    duration: "75 min",
    description: "A restorative sanctuary for damaged strands — protein repair, deep moisture infusion, and scalp detox in one ritual.",
    features: ["Protein Reconstruction", "Steam Therapy", "Scalp Exfoliation", "Shine Serum Finish"],
    gradient: "linear-gradient(145deg, rgba(0,26,16,0.45) 0%, rgba(0,53,32,0.35) 50%, rgba(0,192,128,0.15) 100%)",
    overlayGradient: "linear-gradient(180deg, rgba(0,12,8,0.15) 0%, rgba(0,12,8,0.52) 55%, rgba(0,6,4,0.94) 100%)",
    accentColor: "#40C890",
    icon: "〰",
    image: imgHairSpa,
  },
];

/* ─────────────────────────────────────────────
   Header sub-components
───────────────────────────────────────────── */
function SectionHeader() {
  const lineRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: lineRef.current, start: "top 88%", once: true },
        defaults: { ease: "power3.out" },
      });
      tl
        .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, transformOrigin: "left center" })
        .fromTo(".svc-label", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6")
        .fromTo(".svc-h2-line1", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, "-=0.5")
        .fromTo(".svc-h2-line2", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, "-=0.8")
        .fromTo(".svc-sub", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .fromTo(".svc-ornament", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5 }, "-=0.5");
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 pt-[clamp(80px,10vw,140px)] pb-[clamp(3rem,5vw,5rem)]">
      {/* Divider */}
      <div ref={lineRef} style={{
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(231,84,128,0.5), rgba(212,175,55,0.4), transparent)",
        marginBottom: "3rem",
        transformOrigin: "left center",
      }} />

      {/* Label */}
      <div className="svc-label" style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 200,
        fontSize: "0.6rem",
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        color: "rgba(212,175,185,0.55)",
        marginBottom: "1.8rem",
      }}>
        ✦ &nbsp; Luxury Services &nbsp; ✦
      </div>

      {/* Heading */}
      <div style={{ overflow: "hidden", marginBottom: "0.5rem" }}>
        <h2 ref={headRef} className="svc-h2-line1" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(2rem,4.5vw,3.9rem)",
          lineHeight: 1.06,
          color: "#FDF6F0",
          letterSpacing: "-0.01em",
        }}>
          Beauty Experiences
        </h2>
      </div>
      <div style={{ overflow: "hidden", marginBottom: "2rem" }}>
        <h2 className="svc-h2-line2" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "clamp(1.8rem,4vw,3.5rem)",
          lineHeight: 1.06,
          background: "linear-gradient(135deg, #E8889E 0%, #D4AFB9 45%, #D4AF37 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.01em",
        }}>
          Crafted For Perfection
        </h2>
      </div>

      {/* Subheading */}
      <p className="svc-sub" style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 300,
        fontSize: "clamp(0.75rem,1.2vw,0.9rem)",
        letterSpacing: "0.09em",
        color: "rgba(253,246,240,0.4)",
        maxWidth: 520,
        lineHeight: 2,
      }}>
        Discover personalized salon and spa treatments designed to elevate<br />
        your confidence, elegance, and glow.
      </p>

      {/* Sparkle ornaments */}
      <div style={{ display: "flex", gap: "0.8rem", marginTop: "2rem" }}>
        {["✦", "◈", "✦"].map((s, i) => (
          <span key={i} className="svc-ornament" style={{
            fontSize: "0.5rem",
            color: i === 1 ? "rgba(212,175,55,0.55)" : "rgba(212,175,185,0.3)",
            animation: `svcSparkle ${2.3 + i * 0.4}s ease-in-out ${i * 0.28}s infinite alternate`,
            display: "inline-block",
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

const ALL_IMAGE_SRCS = SERVICES.map((s) => s.image);

if (typeof window !== "undefined") {
  ALL_IMAGE_SRCS.forEach((src) => {
    // 1. <link rel="preload"> — highest browser fetch priority
    if (!document.querySelector(`link[href="${src}"]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    }
    // 2. Decode into GPU texture so first paint is instant
    const img = new Image();
    img.src = src;
    img.decode?.().catch(() => { });
  });
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export default function ServicesSection() {
  return (
    <section
      className="svc-section"
      style={{
        background: "linear-gradient(175deg, #0c0810 0%, #180c14 35%, #130b10 65%, #0a0810 100%)",
        position: "relative",
        zIndex: 1,
        isolation: "isolate",
      }}
    >
      {/* Background atmosphere */}
      <ServicesBackgroundEffects />

      {/* ── Header ── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <SectionHeader />
      </div>

      {/* ── Pinned horizontal scroll showcase ── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <ServicesScrollWrapper cardCount={SERVICES.length}>
          {SERVICES.map((svc, i) => (
            <PremiumServiceCard key={svc.id} service={svc} index={i} />
          ))}
        </ServicesScrollWrapper>
      </div>

      {/* ── Bottom ornament ── */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="max-w-[1300px] mx-auto px-6 sm:px-10 lg:px-16 pb-[clamp(60px,8vw,120px)]"
      >
        <div style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(212,175,185,0.25), transparent)",
          marginBottom: "2rem",
        }} />
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(1rem,3vw,3rem)", alignItems: "center" }}>
          {["✦", "◈", "✦", "◈", "✦"].map((s, i) => (
            <span key={i} style={{
              fontSize: "0.42rem",
              color: i % 2 === 0 ? "rgba(212,175,55,0.38)" : "rgba(212,175,185,0.22)",
              animation: `svcSparkle ${2.1 + i * 0.3}s ease-in-out ${i * 0.22}s infinite alternate`,
              display: "inline-block",
            }}>{s}</span>
          ))}
        </div>
      </div>

      <style>{`
              @keyframes svcSparkle {
          from { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          to   { transform: translateY(-5px) rotate(22deg); opacity: 0.8; }
        }
        .svc-section { overflow: hidden; }
        /* Every sibling section after services must sit above the
           GSAP-pinned scroll layer so fast scrolls never bleed over */
        #services ~ section {
          position: relative;
          z-index: 2;
        }
        @media (max-width: 768px) {
          .svc-section { overflow-x: hidden; overflow-y: visible; }
        }
      `}</style>
    </section>
  );
}
