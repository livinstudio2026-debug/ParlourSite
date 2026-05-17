import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Phone, Mail, MapPin, Clock,
  ArrowRight, Sparkles, CheckCircle2, Loader2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Color tokens  (mirrors Hero / Pricing)
───────────────────────────────────────────── */
const C = {
  pink:     "#E75480",
  roseGold: "#D4AFB9",
  cream:    "#FDF6F0",
  gold:     "#D4AF37",
  dark:     "#1A1A1A",
  beige:    "#F5E6DA",
} as const;

/* ─────────────────────────────────────────────
   Form state type
───────────────────────────────────────────── */
type FormState = "idle" | "loading" | "success";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  service: string;
  package: string;
  date: string;
  time: string;
  notes: string;
}

const INITIAL_DATA: BookingData = {
  name: "", email: "", phone: "", service: "",
  package: "", date: "", time: "", notes: "",
};

const SERVICES = [
  "Bridal Makeup", "Hair Styling", "Hair Coloring",
  "Luxury Facial", "Spa Therapy", "Nail Art", "Keratin Treatment",
];

const PACKAGES = [
  "Essential Glow", "Bridal Luxury", "Spa Escape", "Royal Transformation",
];

const TIMES = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

/* ═══════════════════════════════════════════════
   PARTICLE CANVAS  (identical engine to Pricing)
═══════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const ctx = cv.getContext("2d")!;
    const COLS = [
      { r:231,g:84,b:128 }, { r:212,g:175,b:185 },
      { r:212,g:175,b:55  }, { r:253,g:246,b:240 },
    ];
    type P = { x:number;y:number;vx:number;vy:number;r:number;alpha:number;baseAlpha:number;color:{r:number;g:number;b:number};drift:number;driftOffset:number;t:number;fadeTopY:number };
    const pts: P[] = [];
    const spawn = (sy?: number) => {
      const c = COLS[Math.floor(Math.random() * COLS.length)];
      const rnd = Math.random();
      const ftf = rnd < 0.65 ? 0.40 + Math.random() * 0.20 : rnd < 0.90 ? 0.15 + Math.random() * 0.25 : Math.random() * 0.15;
      const ba = Math.random() * 0.32 + 0.13;
      pts.push({ x:Math.random()*cv.width, y:sy??cv.height+Math.random()*40, vx:(Math.random()-0.5)*0.5, vy:-(Math.random()*0.9+0.35), r:Math.random()*2.0+0.6, alpha:ba, baseAlpha:ba, color:c, drift:Math.random()*0.05+0.02, driftOffset:Math.random()*Math.PI*2, t:0, fadeTopY:cv.height*ftf });
    };
    for (let i = 0; i < 22; i++) spawn(Math.random() * (cv.height + 200) - 200);
    let fr = 0, raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (++fr % 6 === 0 && Math.random() < 0.65) spawn();
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i]; p.t += 0.04; p.x += p.vx + Math.sin(p.t * p.drift + p.driftOffset) * 0.6; p.y += p.vy;
        const tr = cv.height - p.fadeTopY, dt = p.y - p.fadeTopY, fz = tr * 0.35;
        p.alpha = dt < fz ? p.baseAlpha * Math.max(0, dt / fz) : p.baseAlpha;
        if (p.alpha <= 0.006 || p.y < p.fadeTopY - 10) { pts.splice(i, 1); continue; }
        const { r, g, b } = p.color;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(${r},${g},${b},${(p.alpha * 0.8).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b},${(p.alpha * 0.25).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.5, 1).toFixed(3)})`; ctx.fill();
        if (p.r > 1.6) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 0.7); ctx.globalAlpha = p.alpha * 0.5; ctx.strokeStyle = `rgba(${r},${g},${b},1)`; ctx.lineWidth = 0.6; for (let a = 0; a < 4; a++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.r * 2.8); ctx.stroke(); ctx.rotate(Math.PI / 2); } ctx.restore(); }
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }} />;
}

/* ═══════════════════════════════════════════════
   LUXURY DIVIDER  (mirrors Pricing)
═══════════════════════════════════════════════ */
function LuxuryDivider({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-3" style={{ margin: "20px 0" }}>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right,transparent,${color}44)` }} />
      <span style={{ color, fontSize: "0.42rem", opacity: 0.8, letterSpacing: "4px" }}>✦ ✦ ✦</span>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left,transparent,${color}44)` }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════ */
function SectionHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);
  const isInView  = useInView(headerRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.set(Array.from(headerRef.current.children), { y: 22, opacity: 0 });
  }, []);

  useEffect(() => {
    if (!isInView || !headerRef.current) return;
    gsap.to(Array.from(headerRef.current.children), {
      y: 0, opacity: 1, duration: 0.85, stagger: 0.10, ease: "power3.out", delay: 0.1,
    });
  }, [isInView]);

  useEffect(() => {
    if (!isInView || !lineRef.current) return;
    gsap.fromTo(lineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1.4, ease: "power3.out", delay: 0.55 }
    );
  }, [isInView]);

  return (
    <div ref={headerRef} className="text-center" style={{ marginBottom: 64 }}>
      {/* label */}
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-[6px]" style={{
        background: "rgba(231,84,128,0.10)",
        border: "1px solid rgba(231,84,128,0.30)",
        color: C.roseGold,
        fontFamily: "'Jost',sans-serif",
        fontSize: "0.66rem", fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase",
        marginBottom: 24, display: "inline-flex",
      }}>
        <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{
          background: C.pink, boxShadow: `0 0 7px ${C.pink}`,
          animation: "pulseGlowPink 2s ease-in-out infinite",
        }} />
        Book Your Experience
      </div>

      {/* heading */}
      <h2 style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: "clamp(2.1rem,4.0vw,3.8rem)",
        fontWeight: 300, lineHeight: 1.1,
        letterSpacing: "-0.01em", color: C.cream, maxWidth: 720, margin: "0 auto",
      }}>
        Reserve Your{" "}
        <em style={{
          fontStyle: "italic",
          background: `linear-gradient(135deg,${C.pink} 0%,${C.roseGold} 48%,${C.gold} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Luxury Beauty Session
        </em>
      </h2>

      {/* shimmer underline */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18, marginBottom: 20 }}>
        <div ref={lineRef} style={{
          width: 220, height: "1px", transformOrigin: "center",
          background: `linear-gradient(90deg,transparent,${C.pink} 28%,${C.gold} 72%,transparent)`,
          boxShadow: "0 0 14px rgba(231,84,128,0.38)",
          opacity: 0, transform: "scaleX(0)",
        }} />
      </div>

      <p style={{
        fontFamily: "'Jost',sans-serif",
        fontSize: "0.88rem", fontWeight: 300, lineHeight: 1.88,
        color: "rgba(253,246,240,0.48)", maxWidth: 540, margin: "0 auto",
      }}>
        Book personalized beauty and wellness experiences crafted to enhance
        your elegance, confidence, and glow.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONTACT INFO ITEM
═══════════════════════════════════════════════ */
function ContactItem({
  icon, label, value, sub, delay,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "flex-start", gap: 16,
        padding: "16px 18px", borderRadius: 14, cursor: "default",
        background: hov ? "rgba(231,84,128,0.06)" : "transparent",
        border: `1px solid ${hov ? "rgba(231,84,128,0.22)" : "rgba(212,175,185,0.08)"}`,
        transition: "all 0.32s ease",
      }}
    >
      <div style={{
        flexShrink: 0, width: 40, height: 40, borderRadius: 11,
        background: "rgba(231,84,128,0.10)", border: "1px solid rgba(231,84,128,0.28)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.pink,
        boxShadow: hov ? "0 0 18px rgba(231,84,128,0.32)" : "none",
        transition: "box-shadow 0.32s ease",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.14em", color: "rgba(212,175,185,0.6)", textTransform: "uppercase", marginBottom: 2 }}>
          {label}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 400, color: C.cream, lineHeight: 1.3 }}>
          {value}
        </p>
        {sub && <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "rgba(253,246,240,0.38)", marginTop: 2 }}>{sub}</p>}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SOCIAL ICON
═══════════════════════════════════════════════ */
function SocialIcon({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href} aria-label={label} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 42, height: 42, borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? "rgba(231,84,128,0.15)" : "rgba(212,175,185,0.06)",
        border: `1px solid ${hov ? "rgba(231,84,128,0.45)" : "rgba(212,175,185,0.15)"}`,
        color: hov ? C.pink : "rgba(212,175,185,0.55)",
        boxShadow: hov ? "0 0 18px rgba(231,84,128,0.30)" : "none",
        transition: "all 0.28s ease", cursor: "pointer", textDecoration: "none",
      }}
    >
      {icon}
    </a>
  );
}

/* Facebook SVG (not in Lucide) */
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

/* Instagram SVG (not in Lucide) */
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

/* Pinterest SVG (not in Lucide) */
const PinterestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.25 8.25 0 0 0 4.83 1.55V6.8a4.85 4.85 0 0 1-1.06-.11z"/>
  </svg>
);

/* ═══════════════════════════════════════════════
   CONTACT INFO PANEL (left side)
═══════════════════════════════════════════════ */
function ContactInfoPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const orb1Ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orb1Ref.current)
        gsap.to(orb1Ref.current, { y: -22, x: 10, scale: 1.06, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 });
      if (imgRef.current)
        gsap.to(imgRef.current, { y: -8, duration: 10, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* image composition */}
      <div style={{ position: "relative", marginBottom: 36, borderRadius: 22, overflow: "hidden", height: 280 }}>
        {/* ambient orb */}
        <div ref={orb1Ref} style={{
          position: "absolute", width: 320, height: 320, top: -80, left: -60, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(circle,rgba(231,84,128,0.22) 0%,transparent 70%)", filter: "blur(60px)",
        }} />
        {/* image */}
        <div ref={imgRef} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85"
            alt="Luxury salon interior"
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        {/* dark overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(160deg,rgba(13,8,16,0.55) 0%,rgba(13,8,16,0.20) 50%,rgba(13,8,16,0.75) 100%)",
        }} />
        {/* rose gold overlay tint */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
          background: "linear-gradient(135deg,rgba(212,175,185,0.08) 0%,transparent 60%,rgba(231,84,128,0.10) 100%)",
        }} />
        {/* shimmer */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none",
          background: "linear-gradient(105deg,transparent 30%,rgba(212,175,185,0.06) 50%,transparent 70%)",
          animation: "shimmerSweep 4s linear infinite",
        }} />
        {/* studio badge */}
        <div style={{
          position: "absolute", bottom: 18, left: 18, zIndex: 5,
          padding: "8px 16px", borderRadius: 40,
          background: "rgba(13,8,16,0.72)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(231,84,128,0.30)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.pink, boxShadow: `0 0 8px ${C.pink}`, animation: "pulseGlowPink 2s ease-in-out infinite", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.15em", color: C.cream, textTransform: "uppercase" }}>
            LushGlow Beauty Studio
          </span>
        </div>
        {/* corner accent */}
        <div style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, zIndex: 5, borderTop: `1px solid rgba(212,175,185,0.35)`, borderRight: `1px solid rgba(212,175,185,0.35)`, borderRadius: "0 10px 0 0" }} />
        <div style={{ position: "absolute", bottom: 14, left: 14, width: 30, height: 30, zIndex: 5, borderBottom: `1px solid rgba(212,175,185,0.35)`, borderLeft: `1px solid rgba(212,175,185,0.35)`, borderRadius: "0 0 0 10px" }} />
      </div>

      {/* contact details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <ContactItem
          icon={<Phone size={17} />}
          label="Call Us"
          value="+1 (555) 987-2045"
          delay={0.1}
        />
        <ContactItem
          icon={<Mail size={17} />}
          label="Email Us"
          value="hello@lushglowstudio.com"
          delay={0.18}
        />
        <ContactItem
          icon={<MapPin size={17} />}
          label="Visit Us"
          value="21 Rose Avenue, Luxury Plaza"
          sub="New York, NY"
          delay={0.26}
        />
        <ContactItem
          icon={<Clock size={17} />}
          label="Working Hours"
          value="Mon – Sat: 9:00 AM – 9:00 PM"
          sub="Sunday: 10:00 AM – 6:00 PM"
          delay={0.34}
        />
      </div>

      <LuxuryDivider color={C.roseGold} />

      {/* social media */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.16em", color: "rgba(212,175,185,0.5)", textTransform: "uppercase" }}>
          Follow Our Journey
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <SocialIcon href="#" label="Instagram" icon={<InstagramIcon />} />
          <SocialIcon href="#" label="Facebook"  icon={<FacebookIcon />} />
          <SocialIcon href="#" label="Pinterest" icon={<PinterestIcon />} />
          <SocialIcon href="#" label="TikTok"    icon={<TikTokIcon />} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   PREMIUM FORM FIELD
═══════════════════════════════════════════════ */
function FormField({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "'Jost',sans-serif", fontSize: "0.62rem", fontWeight: 500,
        letterSpacing: "0.15em", color: "rgba(212,175,185,0.65)", textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.62rem", color: C.pink, letterSpacing: "0.04em" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* shared input style builder */
const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
  width: "100%", padding: "12px 16px", borderRadius: 12, outline: "none",
  fontFamily: "'Jost',sans-serif", fontSize: "0.82rem", fontWeight: 300,
  color: "rgba(253,246,240,0.90)", letterSpacing: "0.025em",
  background: focused ? "rgba(231,84,128,0.06)" : "rgba(253,246,240,0.03)",
  border: `1px solid ${hasError ? "rgba(231,84,128,0.65)" : focused ? "rgba(231,84,128,0.55)" : "rgba(212,175,185,0.18)"}`,
  boxShadow: focused ? "0 0 0 3px rgba(231,84,128,0.10), 0 0 20px rgba(231,84,128,0.12)" : "none",
  transition: "all 0.28s ease",
  backdropFilter: "blur(8px)",
});

function LuxInput({ placeholder, value, onChange, type = "text", error }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={inputStyle(focused, !!error)}
    />
  );
}

function LuxSelect({ placeholder, value, onChange, options, error }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  options: string[]; error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused, !!error), cursor: "pointer",
        appearance: "none", WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AFB9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        paddingRight: 40,
      }}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map(o => <option key={o} value={o} style={{ background: "#140a12", color: "#FDF6F0" }}>{o}</option>)}
    </select>
  );
}

function LuxTextarea({ placeholder, value, onChange }: {
  placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      rows={3}
      style={{ ...inputStyle(focused, false), resize: "none", lineHeight: 1.6 }}
    />
  );
}

/* ═══════════════════════════════════════════════
   SUCCESS ANIMATION
═══════════════════════════════════════════════ */
function SuccessCard() {
  const [sparkles] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      angle: (i / 16) * 360,
      dist: 60 + Math.random() * 50,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.5,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "60px 40px", textAlign: "center", position: "relative", minHeight: 480,
      }}
    >
      {/* sparkle burst */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 0, height: 0 }}>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
              y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
            }}
            transition={{ duration: 1.2, delay: 0.3 + s.delay, ease: "easeOut" }}
            style={{
              position: "absolute", width: s.size, height: s.size, borderRadius: "50%",
              background: s.id % 3 === 0 ? C.pink : s.id % 3 === 1 ? C.gold : C.roseGold,
              transform: "translate(-50%,-50%)",
            }}
          />
        ))}
      </div>

      {/* glow ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.5, 0], scale: [0.5, 2.2, 2.8] }}
        transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
        style={{
          position: "absolute", width: 120, height: 120, borderRadius: "50%",
          border: `2px solid rgba(231,84,128,0.6)`,
          boxShadow: "0 0 40px rgba(231,84,128,0.4)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        }}
      />

      {/* checkmark circle */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 80, height: 80, borderRadius: "50%", marginBottom: 28,
          background: "linear-gradient(135deg,rgba(231,84,128,0.18) 0%,rgba(212,175,55,0.12) 100%)",
          border: "1.5px solid rgba(231,84,128,0.50)",
          boxShadow: "0 0 40px rgba(231,84,128,0.35), inset 0 0 24px rgba(231,84,128,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 2,
        }}
      >
        <CheckCircle2 size={38} style={{ color: C.pink }} strokeWidth={1.5} />
      </motion.div>

      {/* text reveal */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16,
          padding: "5px 14px", borderRadius: 40,
          background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.28)",
        }}>
          <Sparkles size={11} style={{ color: C.gold }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.58rem", fontWeight: 500, letterSpacing: "0.18em", color: C.gold, textTransform: "uppercase" }}>
            Appointment Reserved
          </span>
        </div>

        <h3 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 300,
          color: C.cream, lineHeight: 1.2, marginBottom: 16,
          letterSpacing: "-0.01em",
        }}>
          Your Luxury Appointment{" "}
          <em style={{
            fontStyle: "italic",
            background: `linear-gradient(135deg,${C.pink} 0%,${C.roseGold} 50%,${C.gold} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Has Been Reserved
          </em>
        </h3>

        <p style={{
          fontFamily: "'Jost',sans-serif", fontSize: "0.82rem", fontWeight: 300,
          color: "rgba(253,246,240,0.48)", lineHeight: 1.8, maxWidth: 380, margin: "0 auto",
        }}>
          Our beauty experts will contact you shortly to confirm your
          personalized experience.
        </p>

        {/* floating glow beneath text */}
        <div style={{
          width: 240, height: 2, margin: "28px auto 0", borderRadius: 2,
          background: `linear-gradient(90deg,transparent,${C.pink} 30%,${C.gold} 70%,transparent)`,
          boxShadow: "0 0 18px rgba(231,84,128,0.45)",
          animation: "shimmerSweep 2.5s linear infinite",
        }} />
      </motion.div>

      {/* ambient bottom glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 300, height: 120, pointerEvents: "none",
        background: "radial-gradient(ellipse,rgba(231,84,128,0.18) 0%,transparent 70%)",
        filter: "blur(30px)",
      }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   BOOKING FORM PANEL (right side)
═══════════════════════════════════════════════ */
function BookingFormPanel() {
  const [data, setData] = useState<BookingData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, boolean>>>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const btnRef = useRef<HTMLButtonElement>(null);
  const shimRef = useRef<HTMLSpanElement>(null);

  const set = (k: keyof BookingData) => (v: string) =>
    setData(prev => ({ ...prev, [k]: v }));

  const validate = (): boolean => {
    const req: (keyof BookingData)[] = ["name","email","phone","service","package","date","time"];
    const errs: typeof errors = {};
    let ok = true;
    req.forEach(k => { if (!data[k]) { errs[k] = true; ok = false; } });
    setErrors(errs);
    return ok;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setFormState("loading");

    // shimmer sweep on btn
    if (shimRef.current) {
      gsap.fromTo(shimRef.current,
        { x: "-115%", opacity: 0.6 },
        { x: "115%", opacity: 0.6, duration: 0.9, ease: "power1.inOut", repeat: 3 }
      );
    }

    await new Promise(r => setTimeout(r, 2600));
    setFormState("success");
  }, [data]);

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative" }}
    >
      {/* ambient glow behind card */}
      <div style={{
        position: "absolute", inset: -40, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 50%,rgba(231,84,128,0.10) 0%,transparent 75%)",
        filter: "blur(20px)",
        transition: "opacity 0.6s ease",
        opacity: isLoading ? 1.5 : 1,
      }} />

      {/* glass card */}
      <div style={{
        position: "relative", zIndex: 1, borderRadius: 24, overflow: "hidden",
        background: "rgba(15,6,11,0.78)", backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(231,84,128,0.22)",
        boxShadow: [
          "0 32px 80px rgba(0,0,0,0.55)",
          "inset 0 1px 0 rgba(255,255,255,0.04)",
          "0 0 60px rgba(231,84,128,0.10)",
        ].join(", "),
      }}>
        {/* top accent bar */}
        <div style={{
          height: 2, background: `linear-gradient(90deg,transparent,${C.pink} 28%,${C.gold} 72%,transparent)`,
          boxShadow: "0 0 18px rgba(231,84,128,0.5)",
        }} />

        {/* corner accents */}
        <div style={{ position: "absolute", top: 14, right: 14, width: 28, height: 28, borderTop: "1px solid rgba(212,175,185,0.25)", borderRight: "1px solid rgba(212,175,185,0.25)", borderRadius: "0 8px 0 0", pointerEvents: "none", zIndex: 5 }} />
        <div style={{ position: "absolute", bottom: 14, left: 14, width: 28, height: 28, borderBottom: "1px solid rgba(212,175,185,0.25)", borderLeft: "1px solid rgba(212,175,185,0.25)", borderRadius: "0 0 0 8px", pointerEvents: "none", zIndex: 5 }} />

        {/* floating particle shimmer */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
          background: "linear-gradient(105deg,transparent 28%,rgba(212,175,185,0.03) 50%,transparent 72%)",
          animation: "shimmerSweep 6s linear infinite",
        }} />

        {/* loading blur intensifier */}
        {isLoading && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
            background: "rgba(13,8,16,0.12)", backdropFilter: "blur(2px)",
            borderRadius: 24, animation: "loadingPulse 1.5s ease-in-out infinite",
          }} />
        )}

        {/* CONTENT */}
        <div style={{ padding: "36px 32px 32px" }}>
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                {/* form header */}
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: "1.7rem", fontWeight: 300, color: C.cream,
                    letterSpacing: "-0.01em", marginBottom: 6,
                  }}>
                    Book Your Appointment
                  </h3>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "rgba(253,246,240,0.36)", lineHeight: 1.6 }}>
                    Fill in the details below and our team will confirm your luxury session.
                  </p>
                </div>

                {/* ── fields ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* row 1 */}
                  <div className="form-row-2">
                    <FormField label="Full Name" error={errors.name ? "Required" : undefined}>
                      <LuxInput placeholder="Your full name" value={data.name} onChange={set("name")} error={errors.name} />
                    </FormField>
                    <FormField label="Email Address" error={errors.email ? "Required" : undefined}>
                      <LuxInput placeholder="your@email.com" value={data.email} onChange={set("email")} type="email" error={errors.email} />
                    </FormField>
                  </div>

                  {/* row 2 */}
                  <div className="form-row-2">
                    <FormField label="Phone Number" error={errors.phone ? "Required" : undefined}>
                      <LuxInput placeholder="+1 (555) 000-0000" value={data.phone} onChange={set("phone")} type="tel" error={errors.phone} />
                    </FormField>
                    <FormField label="Select Service" error={errors.service ? "Required" : undefined}>
                      <LuxSelect placeholder="Choose a service" value={data.service} onChange={set("service")} options={SERVICES} error={errors.service} />
                    </FormField>
                  </div>

                  {/* row 3 */}
                  <FormField label="Select Package" error={errors.package ? "Required" : undefined}>
                    <LuxSelect placeholder="Choose a package" value={data.package} onChange={set("package")} options={PACKAGES} error={errors.package} />
                  </FormField>

                  {/* row 4 */}
                  <div className="form-row-2">
                    <FormField label="Preferred Date" error={errors.date ? "Required" : undefined}>
                      <LuxInput placeholder="Pick a date" value={data.date} onChange={set("date")} type="date" error={errors.date} />
                    </FormField>
                    <FormField label="Preferred Time" error={errors.time ? "Required" : undefined}>
                      <LuxSelect placeholder="Select time" value={data.time} onChange={set("time")} options={TIMES} error={errors.time} />
                    </FormField>
                  </div>

                  {/* notes */}
                  <FormField label="Additional Notes">
                    <LuxTextarea placeholder="Any special requests or preferences…" value={data.notes} onChange={set("notes")} />
                  </FormField>

                  {/* submit button */}
                  <button
                    ref={btnRef}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    style={{
                      position: "relative", overflow: "hidden", width: "100%",
                      padding: "15px 28px", borderRadius: 14, border: "none",
                      background: isLoading
                        ? "linear-gradient(135deg,#c0376a 0%,#9e2558 100%)"
                        : "linear-gradient(135deg,#E75480 0%,#c0376a 55%,#E75480 100%)",
                      backgroundSize: "200% 100%",
                      color: "#fff", fontFamily: "'Jost',sans-serif",
                      fontSize: "0.78rem", fontWeight: 500,
                      letterSpacing: "0.14em", textTransform: "uppercase",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      boxShadow: isLoading
                        ? "0 0 30px rgba(231,84,128,0.50)"
                        : "0 6px 28px rgba(231,84,128,0.40)",
                      transform: "translateZ(0)",
                      transition: "box-shadow 0.30s ease, transform 0.22s ease",
                      marginTop: 6,
                    }}
                    onMouseEnter={e => {
                      if (isLoading) return;
                      gsap.to(e.currentTarget, { scale: 1.025, duration: 0.22, ease: "power2.out" });
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 40px rgba(231,84,128,0.65)";
                    }}
                    onMouseLeave={e => {
                      if (isLoading) return;
                      gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: "power2.out" });
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(231,84,128,0.40)";
                    }}
                  >
                    {/* shimmer sweep */}
                    <span ref={shimRef} style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.20) 50%,transparent 70%)",
                      transform: "translateX(-115%)",
                      animation: isLoading ? "none" : "shimmerSweep 3s linear infinite",
                    }} />
                    {/* glow pulse border */}
                    <span style={{
                      position: "absolute", inset: -1, borderRadius: 15, pointerEvents: "none",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                    }} />
                    <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      {isLoading ? (
                        <>
                          <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                          Booking Your Experience...
                        </>
                      ) : (
                        <>
                          Book Appointment
                          <ArrowRight size={14} />
                        </>
                      )}
                    </span>
                  </button>

                  <p style={{ textAlign: "center", fontFamily: "'Jost',sans-serif", fontSize: "0.60rem", fontWeight: 300, letterSpacing: "0.06em", color: "rgba(253,246,240,0.22)", marginTop: 2 }}>
                    ✦ Complimentary consultation included with every appointment ✦
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="success">
                <SuccessCard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);
  const orb3Ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const f = (el: HTMLDivElement | null, dur: number, dy: number, delay: number) => {
        if (!el) return;
        gsap.to(el, { y: dy, x: dy * 0.35, scale: 1.05, duration: dur, delay, ease: "sine.inOut", yoyo: true, repeat: -1 });
      };
      f(orb1Ref.current, 18, -28, 0);
      f(orb2Ref.current, 22,  22, -4);
      f(orb3Ref.current, 14, -14, -2);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg,#0d0810 0%,#140a12 30%,#0f0a0d 65%,#0d0c09 100%)",
        paddingTop: 80, paddingBottom: 100,
      }}
    >
      {/* radial base tints */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: `
        radial-gradient(ellipse 70% 55% at 15% 80%,rgba(231,84,128,0.09) 0%,transparent 60%),
        radial-gradient(ellipse 55% 65% at 88% 20%,rgba(212,175,185,0.07) 0%,transparent 58%),
        radial-gradient(ellipse 40% 40% at 50% 50%,rgba(212,175,55,0.04)  0%,transparent 65%)
      ` }} />

      {/* ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div ref={orb1Ref} className="absolute rounded-full" style={{ width:600,height:600,top:-180,left:"-8%",background:"radial-gradient(circle,rgba(231,84,128,0.16) 0%,rgba(231,84,128,0.04) 55%,transparent 76%)",filter:"blur(90px)",willChange:"transform",transform:"translateZ(0)" }}/>
        <div ref={orb2Ref} className="absolute rounded-full" style={{ width:500,height:500,bottom:-150,right:"0%",background:"radial-gradient(circle,rgba(212,175,185,0.13) 0%,transparent 65%)",filter:"blur(85px)",willChange:"transform",transform:"translateZ(0)" }}/>
        <div ref={orb3Ref} className="absolute rounded-full" style={{ width:340,height:340,top:"42%",right:"22%",background:"radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 68%)",filter:"blur(65px)",willChange:"transform",transform:"translateZ(0)" }}/>
      </div>

      {/* grain overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:2, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity:0.4 }} />

      <ParticleCanvas />

      {/* ── CONTENT ── */}
      <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14" style={{ zIndex: 10 }}>
        <SectionHeader />

        {/* split layout */}
        <div className="contact-grid">
          <ContactInfoPanel />
          <BookingFormPanel />
        </div>

        {/* footnote */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            textAlign: "center", marginTop: 56,
            fontFamily: "'Jost',sans-serif", fontSize: "0.68rem", fontWeight: 300,
            letterSpacing: "0.09em", color: "rgba(253,246,240,0.22)",
          }}
        >
          All bookings include complimentary consultation &amp; aftercare guidance.
          <span style={{ margin: "0 12px", color: "rgba(212,175,55,0.36)" }}>✦</span>
          Custom experiences available on request.
        </motion.p>
      </div>

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes pulseGlowPink {
          0%,100% { box-shadow:0 0 7px #E75480; }
          50%      { box-shadow:0 0 14px #E75480,0 0 22px rgba(231,84,128,0.4); }
        }
        @keyframes shimmerSweep {
          0%   { transform:translateX(-115%); }
          100% { transform:translateX(115%); }
        }
        @keyframes spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes loadingPulse {
          0%,100% { opacity:0.4; }
          50%      { opacity:0.8; }
        }

        .contact-grid {
          display:grid;
          grid-template-columns:1fr 1.35fr;
          gap:40px;
          align-items:start;
        }
        .form-row-2 {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter:invert(0.5) sepia(1) saturate(3) hue-rotate(300deg);
          cursor:pointer; opacity:0.6;
        }
        input::placeholder, textarea::placeholder, select option[disabled] {
          color:rgba(212,175,185,0.32) !important;
          font-style:italic;
        }
        input, textarea, select { box-sizing:border-box; }

        @media (max-width:900px) {
          .contact-grid { grid-template-columns:1fr !important; }
        }
        @media (max-width:520px) {
          .form-row-2 { grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}
