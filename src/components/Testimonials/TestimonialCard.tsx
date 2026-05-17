import { useRef } from "react";
import { gsap } from "gsap";

export interface TestimonialData {
  id: number;
  name: string;
  service: string;
  location: string;
  rating: number;
  review: string;
  imageUrl: string;
  accentColor: string;
}

interface Props {
  data: TestimonialData;
  isActive?: boolean;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24"
      fill={filled ? "#D4AF37" : "none"}
      stroke="#D4AF37" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function TestimonialCard({ data, isActive = false }: Props) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const avatarRef  = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current,    { y: -8, scale: 1.02, duration: 0.4, ease: "power2.out" });
    gsap.to(glowRef.current,    { opacity: 1, duration: 0.35 });
    gsap.to(shimmerRef.current, { left: "130%", duration: 0.78, ease: "power2.inOut" });
    gsap.to(avatarRef.current,  { scale: 1.08, duration: 0.45, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current,    { y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
    gsap.to(glowRef.current,    { opacity: 0, duration: 0.4 });
    gsap.to(shimmerRef.current, { left: "-60%", duration: 0, delay: 0.25 });
    gsap.to(avatarRef.current,  { scale: 1, duration: 0.45, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "clamp(290px, 28vw, 360px)",
        borderRadius: 24,
        padding: "28px 26px 24px",
        /* Glass */
        background: isActive
          ? "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
          : "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 100%)",
        backdropFilter: "blur(28px) saturate(1.7) brightness(1.1)",
        WebkitBackdropFilter: "blur(28px) saturate(1.7) brightness(1.1)",
        border: isActive
          ? `1px solid ${data.accentColor}48`
          : "1px solid rgba(255,255,255,0.11)",
        boxShadow: isActive
          ? `0 0 0 1px ${data.accentColor}16, 0 24px 64px rgba(0,0,0,0.20), 0 0 90px ${data.accentColor}12, inset 0 1px 0 rgba(255,255,255,0.14)`
          : "0 0 0 1px rgba(255,255,255,0.04), 0 12px 36px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "hidden",
        willChange: "transform",
        transition: "border-color 0.45s ease, box-shadow 0.45s ease",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      {/* Glass rim highlight */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.20) 40%, rgba(255,255,255,0.24) 60%, transparent 95%)",
        zIndex: 7, pointerEvents: "none",
      }} />

      {/* Hover border glow */}
      <div ref={glowRef} style={{
        position: "absolute", inset: 0, borderRadius: 24,
        opacity: 0, pointerEvents: "none", zIndex: 5,
        border: `1px solid ${data.accentColor}58`,
        boxShadow: `inset 0 0 28px ${data.accentColor}07, 0 0 28px ${data.accentColor}16`,
      }} />

      {/* Shimmer sweep */}
      <div ref={shimmerRef} style={{
        position: "absolute", top: 0, bottom: 0,
        left: "-60%", width: "38%",
        background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.07) 50%, transparent 80%)",
        transform: "skewX(-14deg)",
        pointerEvents: "none", zIndex: 6,
      }} />

      {/* ── Circle avatar — top right ── */}
      <div
        ref={avatarRef}
        style={{
          position: "absolute",
          top: 22,
          right: 22,
          width: 54,
          height: 54,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${data.accentColor}55`,
          boxShadow: `0 0 0 3px rgba(255,255,255,0.06), 0 0 20px ${data.accentColor}28`,
          willChange: "transform",
          flexShrink: 0,
          zIndex: 8,
        }}
      >
        <img
          src={data.imageUrl}
          alt={data.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>

      {/* ── Quote mark ── */}
      <div style={{
        fontSize: "3.6rem", lineHeight: 0.7,
        color: data.accentColor, opacity: 0.18,
        fontFamily: "Georgia, serif",
        marginBottom: 14, userSelect: "none",
      }}>
        "
      </div>

      {/* ── Review text ── */}
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "0.93rem", fontWeight: 300,
        lineHeight: 1.85, fontStyle: "italic",
        color: "rgba(253,246,240,0.80)",
        letterSpacing: "0.012em",
        margin: "0 0 20px",
        /* leave space so text doesn't run under avatar */
        paddingRight: 64,
      }}>
        {data.review}
      </p>

      {/* ── Divider ── */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, ${data.accentColor}30, rgba(255,255,255,0.06), transparent)`,
        marginBottom: 16,
      }} />

      {/* ── Client info row ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>

        {/* Name + service + location */}
        <div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.05rem", fontWeight: 500,
            color: "#FDF6F0", letterSpacing: "0.02em", lineHeight: 1.2,
          }}>
            {data.name}
          </div>
          <div style={{
            fontSize: "0.6rem", letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: data.accentColor,
            opacity: 0.75, marginTop: 3,
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            {data.service}
          </div>
          {data.location && (
            <div style={{
              fontSize: "0.57rem", letterSpacing: "0.09em",
              textTransform: "uppercase" as const,
              color: "rgba(253,246,240,0.35)", marginTop: 2,
            }}>
              {data.location}
            </div>
          )}
        </div>

        {/* Star rating */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < data.rating} />
            ))}
          </div>
          <span style={{
            fontSize: "0.56rem", color: "rgba(212,175,55,0.55)",
            letterSpacing: "0.08em",
            fontFamily: "'Cormorant Garamond', serif",
          }}>
            {data.rating}.0 / 5.0
          </span>
        </div>
      </div>

      {/* Corner sparkle */}
      <div style={{
        position: "absolute", bottom: 14, right: 18,
        fontSize: "0.55rem", color: data.accentColor,
        opacity: 0.25, userSelect: "none", zIndex: 4,
      }}>
        ✦
      </div>
    </div>
  );
}
