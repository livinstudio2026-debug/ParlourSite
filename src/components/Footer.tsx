import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { scrollToSection } from "../utils/scrollToSection.ts";
import logoImg from "../assets/logo.png";

/* ─────────────────────────────────────────────
   Color tokens  (mirrors Hero / Pricing / Contact)
───────────────────────────────────────────── */
const C = {
  pink:     "#E75480",
  roseGold: "#D4AFB9",
  cream:    "#FDF6F0",
  gold:     "#D4AF37",
} as const;

/* ═══════════════════════════════════════════════
   PARTICLE CANVAS  (identical engine to all sections)
═══════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const ctx = cv.getContext("2d")!;
    const COLS = [
      { r:231,g:84, b:128 }, { r:212,g:175,b:185 },
      { r:212,g:175,b:55  }, { r:253,g:246,b:240 },
    ];
    type P = { x:number;y:number;vx:number;vy:number;r:number;alpha:number;baseAlpha:number;
               color:{r:number;g:number;b:number};drift:number;driftOffset:number;t:number;fadeTopY:number };
    const pts: P[] = [];
    const spawn = (sy?: number) => {
      const c   = COLS[Math.floor(Math.random() * COLS.length)];
      const rnd = Math.random();
      const ftf = rnd < 0.65 ? 0.40 + Math.random() * 0.20
                : rnd < 0.90 ? 0.15 + Math.random() * 0.25
                :               Math.random() * 0.15;
      const ba  = Math.random() * 0.28 + 0.10;
      pts.push({ x:Math.random()*cv.width, y:sy ?? cv.height+Math.random()*40,
        vx:(Math.random()-0.5)*0.5, vy:-(Math.random()*0.8+0.30),
        r:Math.random()*1.8+0.5, alpha:ba, baseAlpha:ba, color:c,
        drift:Math.random()*0.05+0.02, driftOffset:Math.random()*Math.PI*2, t:0, fadeTopY:cv.height*ftf });
    };
    for (let i = 0; i < 20; i++) spawn(Math.random() * (cv.height + 200) - 200);
    let fr = 0, raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (++fr % 6 === 0 && Math.random() < 0.60) spawn();
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.t += 0.04; p.x += p.vx + Math.sin(p.t * p.drift + p.driftOffset) * 0.55; p.y += p.vy;
        const tr = cv.height - p.fadeTopY, dt = p.y - p.fadeTopY, fz = tr * 0.35;
        p.alpha = dt < fz ? p.baseAlpha * Math.max(0, dt / fz) : p.baseAlpha;
        if (p.alpha <= 0.006 || p.y < p.fadeTopY - 10) { pts.splice(i, 1); continue; }
        const { r, g, b } = p.color;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(${r},${g},${b},${(p.alpha * 0.8).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b},${(p.alpha * 0.25).toFixed(3)})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI*2); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.5, 1).toFixed(3)})`; ctx.fill();
        if (p.r > 1.4) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 0.7);
          ctx.globalAlpha = p.alpha * 0.45; ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.lineWidth = 0.5;
          for (let a = 0; a < 4; a++) { ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,p.r*2.5); ctx.stroke(); ctx.rotate(Math.PI/2); }
          ctx.restore();
        }
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3 }} />;
}

/* ═══════════════════════════════════════════════
   LUXURY DIVIDER
═══════════════════════════════════════════════ */
function LuxuryDivider() {
  const lineRef  = useRef<HTMLDivElement>(null);
  const isInView = useInView(lineRef, { once: true });
  useEffect(() => {
    if (!isInView || !lineRef.current) return;
    gsap.fromTo(lineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1.6, ease: "power3.out", delay: 0.1 }
    );
  }, [isInView]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "48px 0 36px" }}>
      <div ref={lineRef} style={{
        flex: 1, height: 1, transformOrigin: "left",
        background: `linear-gradient(to right,transparent,${C.pink} 25%,${C.gold} 75%,transparent)`,
        boxShadow: "0 0 12px rgba(231,84,128,0.30)",
        opacity: 0, transform: "scaleX(0)",
      }} />
      <span style={{ color: C.gold, fontSize: "0.44rem", letterSpacing: "5px", flexShrink: 0 }}>✦ ✦ ✦</span>
      <div style={{
        flex: 1, height: 1, transformOrigin: "right",
        background: `linear-gradient(to left,transparent,${C.pink} 25%,${C.gold} 75%,transparent)`,
        boxShadow: "0 0 12px rgba(231,84,128,0.30)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INLINE SOCIAL SVGs
═══════════════════════════════════════════════ */
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const PinterestIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.25 8.25 0 0 0 4.83 1.55V6.8a4.85 4.85 0 0 1-1.06-.11z"/>
  </svg>
);

/* ═══════════════════════════════════════════════
   FOOTER BRAND COLUMN
═══════════════════════════════════════════════ */
function FooterBrand({ delay }: { delay: number }) {
  const logoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!logoRef.current) return;
    gsap.to(logoRef.current, {
      boxShadow: `0 0 36px rgba(231,84,128,0.55), 0 0 70px rgba(212,175,55,0.18)`,
      duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      {/* logo — same layout as Navbar */}
      <div ref={logoRef} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ height: 48, width: "auto", flexShrink: 0, overflow: "hidden" }}>
          <img
            src={logoImg}
            alt="LushGlow Beauty Studio"
            style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
          />
        </div>
        <span style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "1.35rem", fontWeight: 400, lineHeight: 1.15,
          letterSpacing: "0.01em", whiteSpace: "nowrap",
          background: `linear-gradient(135deg,${C.cream} 0%,${C.roseGold} 55%,${C.gold} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          LushGlow Beauty Studio
        </span>
      </div>

      {/* tagline */}
      <div>
        <p style={{
          fontFamily: "'Jost',sans-serif", fontSize: "0.75rem", fontWeight: 300,
          color: "rgba(253,246,240,0.55)", lineHeight: 1.85, maxWidth: 240,
          margin: 0,
        }}>
          Crafting timeless beauty experiences with elegance, artistry, and premium self-care.
        </p>
      </div>

      {/* decorative glow line */}
      <div style={{
        width: 80, height: 1,
        background: `linear-gradient(90deg,${C.pink},${C.gold},transparent)`,
        boxShadow: "0 0 10px rgba(231,84,128,0.40)",
        animation: "shimmerSweep 3s linear infinite",
      }} />

      {/* social icons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { label: "Instagram", Icon: InstagramIcon },
          { label: "Facebook",  Icon: FacebookIcon  },
          { label: "Pinterest", Icon: PinterestIcon },
          { label: "TikTok",    Icon: TikTokIcon    },
        ].map(({ label, Icon }) => (
          <FooterSocialIcon key={label} label={label} Icon={Icon} />
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SOCIAL ICON BUTTON
═══════════════════════════════════════════════ */
function FooterSocialIcon({ label, Icon }: { label: string; Icon: () => ReactElement }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#" aria-label={label}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center",
        justifyContent: "center", cursor: "pointer", textDecoration: "none",
        background: hov ? "rgba(231,84,128,0.14)" : "rgba(212,175,185,0.06)",
        border: `1px solid ${hov ? "rgba(231,84,128,0.45)" : "rgba(212,175,185,0.14)"}`,
        color: hov ? C.pink : "rgba(212,175,185,0.50)",
        boxShadow: hov ? "0 0 18px rgba(231,84,128,0.28)" : "none",
        transform: hov ? "translateY(-2px) scale(1.08)" : "translateY(0) scale(1)",
        transition: "all 0.26s ease",
      }}
    >
      <Icon />
    </a>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER LINK COLUMN
═══════════════════════════════════════════════ */
function FooterLinkGroup({
  title, links, delay,
}: { title: string; links: { label: string; id: string }[]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* column header */}
      <div style={{ marginBottom: 22 }}>
        <p style={{
          fontFamily: "'Jost',sans-serif", fontSize: "0.72rem", fontWeight: 500,
          letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(212,175,185,0.75)",
          marginBottom: 8,
        }}>
          {title}
        </p>
        <div style={{
          width: 28, height: 1,
          background: `linear-gradient(90deg,${C.pink},transparent)`,
          boxShadow: "0 0 6px rgba(231,84,128,0.35)",
        }} />
      </div>

      {/* links */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {links.map(({ label, id }) => (
          <FooterLink key={label} label={label} id={id} />
        ))}
      </div>
    </motion.div>
  );
}

function FooterLink({ label, id }: { label: string; id: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => scrollToSection(id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7, padding: "6px 0",
        background: "none", border: "none", cursor: "pointer", textAlign: "left",
        color: hov ? C.cream : "rgba(253,246,240,0.40)",
        transition: "color 0.24s ease",
        position: "relative",
      }}
    >
      <ArrowRight
        size={10}
        style={{
          color: hov ? C.pink : "rgba(231,84,128,0.25)",
          transform: hov ? "translateX(3px)" : "translateX(0)",
          transition: "all 0.24s ease", flexShrink: 0,
        }}
      />
      <span style={{
        fontFamily: "'Jost',sans-serif", fontSize: "0.78rem", fontWeight: 300,
        letterSpacing: "0.03em", lineHeight: 1,
        textShadow: hov ? `0 0 14px rgba(231,84,128,0.30)` : "none",
        transition: "text-shadow 0.24s ease",
      }}>
        {label}
      </span>
      {/* shimmer underline */}
      <span style={{
        position: "absolute", bottom: 0, left: 17, right: 0, height: "1px",
        background: `linear-gradient(90deg,${C.pink},${C.gold})`,
        opacity: hov ? 0.45 : 0,
        transition: "opacity 0.24s ease",
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER CONTACT COLUMN
═══════════════════════════════════════════════ */
function FooterContact({ delay }: { delay: number }) {
  const items = [
    { Icon: Phone,  label: "+1 (555) 987-2045",          sub: undefined },
    { Icon: Mail,   label: "hello@lushglowstudio.com",   sub: undefined },
    { Icon: MapPin, label: "21 Rose Avenue, Luxury Plaza",sub: "New York, NY" },
    { Icon: Clock,  label: "Mon – Sat: 9 AM – 9 PM",    sub: "Sun: 10 AM – 6 PM" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div style={{ marginBottom: 22 }}>
        <p style={{
          fontFamily: "'Jost',sans-serif", fontSize: "0.72rem", fontWeight: 500,
          letterSpacing: "0.20em", textTransform: "uppercase", color: "rgba(212,175,185,0.75)",
          marginBottom: 8,
        }}>
          Get In Touch
        </p>
        <div style={{ width: 28, height: 1, background: `linear-gradient(90deg,${C.pink},transparent)`, boxShadow: "0 0 6px rgba(231,84,128,0.35)" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map(({ Icon, label, sub }) => (
          <FooterContactItem key={label} Icon={Icon} label={label} sub={sub} />
        ))}
      </div>
    </motion.div>
  );
}

function FooterContactItem({
  Icon, label, sub,
}: { Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; sub?: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "default" }}
    >
      <div style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: 8,
        background: hov ? "rgba(231,84,128,0.12)" : "rgba(212,175,185,0.06)",
        border: `1px solid ${hov ? "rgba(231,84,128,0.30)" : "rgba(212,175,185,0.10)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: hov ? "0 0 12px rgba(231,84,128,0.22)" : "none",
        transition: "all 0.26s ease",
      }}>
        <Icon size={13} style={{ color: hov ? C.pink : "rgba(212,175,185,0.45)" }} />
      </div>
      <div>
        <p style={{
          fontFamily: "'Jost',sans-serif", fontSize: "0.75rem", fontWeight: 300,
          color: hov ? "rgba(253,246,240,0.90)" : "rgba(253,246,240,0.60)",
          lineHeight: 1.4, transition: "color 0.24s ease",
        }}>
          {label}
        </p>
        {sub && <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "0.72rem", fontWeight: 300, color: "rgba(253,246,240,0.45)", marginTop: 1 }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOTTOM BAR
═══════════════════════════════════════════════ */
function BottomBar() {
  const year = new Date().getFullYear();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="footer-bottom"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}
    >
      <p style={{
        fontFamily: "'Jost',sans-serif", fontSize: "0.78rem", fontWeight: 300,
        letterSpacing: "0.07em", color: "rgba(253,246,240,0.52)",
      }}>
        © {year} LushGlow Beauty Studio. All rights reserved.
      </p>

      {/* centre tagline */}
      <p style={{
        fontFamily: "'Cormorant Garamond',serif", fontSize: "0.96rem", fontWeight: 300,
        fontStyle: "italic", letterSpacing: "0.06em",
        background: `linear-gradient(135deg,${C.roseGold},${C.gold})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>
        ✦ Where Elegance Meets Artistry ✦
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        {["Privacy Policy", "Terms of Service"].map(t => (
          <a key={t} href="#" style={{
            fontFamily: "'Jost',sans-serif", fontSize: "0.76rem", fontWeight: 300,
            letterSpacing: "0.06em", color: "rgba(253,246,240,0.45)",
            textDecoration: "none", transition: "color 0.22s ease",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(212,175,185,0.85)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(253,246,240,0.45)")}
          >
            {t}
          </a>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);
  const orb3Ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const f = (el: HTMLDivElement | null, dur: number, dy: number, delay: number) => {
        if (!el) return;
        gsap.to(el, { y: dy, x: dy * 0.3, scale: 1.04, duration: dur, delay, ease: "sine.inOut", yoyo: true, repeat: -1 });
      };
      f(orb1Ref.current, 20, -26, 0);
      f(orb2Ref.current, 24,  22, -5);
      f(orb3Ref.current, 15, -14, -2);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const NAV_LINKS = [
    { label: "Home",         id: "home"         },
    { label: "About",        id: "about"        },
    { label: "Services",     id: "services"     },
    { label: "Gallery",      id: "gallery"      },
    { label: "Pricing",      id: "pricing"      },
    { label: "Testimonials", id: "testimonials" },
    { label: "Contact",      id: "contact"      },
  ];

  const SERVICE_LINKS = [
    { label: "Bridal Makeup",     id: "services" },
    { label: "Hair Styling",      id: "services" },
    { label: "Luxury Facial",     id: "services" },
    { label: "Spa Therapy",       id: "services" },
    { label: "Nail Art",          id: "services" },
    { label: "Keratin Treatment", id: "services" },
  ];

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg,#0d0810 0%,#0a060e 40%,#060408 100%)",
        paddingTop: 80, paddingBottom: 0,
      }}
    >
      {/* ── BACKGROUND LAYERS ── */}

      {/* radial tints */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: `
        radial-gradient(ellipse 65% 55% at 10% 90%, rgba(231,84,128,0.10) 0%,transparent 58%),
        radial-gradient(ellipse 50% 60% at 90% 10%, rgba(212,175,185,0.07) 0%,transparent 55%),
        radial-gradient(ellipse 38% 38% at 50% 50%, rgba(212,175,55,0.04)  0%,transparent 65%)
      ` }} />

      {/* ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div ref={orb1Ref} className="absolute rounded-full" style={{ width:560,height:560,top:-200,left:"-10%",background:"radial-gradient(circle,rgba(231,84,128,0.14) 0%,rgba(231,84,128,0.04) 55%,transparent 75%)",filter:"blur(90px)",willChange:"transform",transform:"translateZ(0)" }} />
        <div ref={orb2Ref} className="absolute rounded-full" style={{ width:480,height:480,bottom:-180,right:"-5%",background:"radial-gradient(circle,rgba(212,175,185,0.11) 0%,transparent 65%)",filter:"blur(80px)",willChange:"transform",transform:"translateZ(0)" }} />
        <div ref={orb3Ref} className="absolute rounded-full" style={{ width:320,height:320,top:"35%",right:"20%",background:"radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 68%)",filter:"blur(60px)",willChange:"transform",transform:"translateZ(0)" }} />
      </div>

      {/* grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", opacity: 0.4 }} />

      {/* top fade from previous section */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, zIndex: 2, pointerEvents: "none", background: "linear-gradient(to bottom,rgba(13,8,16,0.60) 0%,transparent 100%)" }} />

      <ParticleCanvas />

      {/* ── CONTENT ── */}
      <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14" style={{ zIndex: 10 }}>

        {/* ── BIG EDITORIAL HEADLINE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: 64, position: "relative" }}
        >
          {/* label */}
          <div style={{ marginBottom: 20 }}>
            <span style={{
              fontFamily: "'Jost',sans-serif", fontSize: "0.60rem", fontWeight: 500,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(212,175,185,0.45)",
            }}>
              ✦ &nbsp; The LushGlow Experience &nbsp; ✦
            </span>
          </div>

          {/* grand headline */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(2.6rem,6vw,5.5rem)", fontWeight: 300,
            lineHeight: 1.05, letterSpacing: "-0.02em", color: C.cream,
            margin: "0 auto", maxWidth: 800,
          }}>
            Beauty Is Not a{" "}
            <em style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg,${C.pink} 0%,${C.roseGold} 50%,${C.gold} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Luxury.
            </em>
            <br />
            <span style={{ fontSize: "0.62em", fontWeight: 300, color: "rgba(253,246,240,0.30)", letterSpacing: "0.01em" }}>
              It's a right, and we make it unforgettable.
            </span>
          </h2>

          {/* shimmer underline */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <div style={{
              width: 160, height: 1,
              background: `linear-gradient(90deg,transparent,${C.pink} 30%,${C.gold} 70%,transparent)`,
              boxShadow: "0 0 14px rgba(231,84,128,0.40)",
              animation: "shimmerSweep 3s linear infinite",
            }} />
          </div>
        </motion.div>

        {/* ── FOUR-COLUMN GRID ── */}
        <div className="footer-grid">
          <FooterBrand delay={0.05} />
          <FooterLinkGroup title="Quick Links"  links={NAV_LINKS}     delay={0.15} />
          <FooterLinkGroup title="Our Services" links={SERVICE_LINKS} delay={0.22} />
          <FooterContact   delay={0.29} />
        </div>

        {/* ── LUXURY DIVIDER ── */}
        <LuxuryDivider />

        {/* ── BOTTOM BAR ── */}
        <BottomBar />

        {/* ── CREDITS ── */}
        <div style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid rgba(212,175,185,0.07)",
          display: "flex",
          justifyContent: "center",
        }}>
          <p style={{
            fontFamily: "'Jost',sans-serif",
            fontSize: "0.76rem",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "rgba(253,246,240,0.42)",
          }}>
            Crafted with ♥ by{" "}
            <a
              href="https://livinstudio2026-debug.github.io/Portfolio-Livin-Studio/"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "rgba(212,175,185,0.70)",
                textDecoration: "underline",
                fontWeight: 400,
                letterSpacing: "0.14em",
                transition: "color 0.22s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#E75480";
                (e.currentTarget as HTMLAnchorElement).style.textShadow = "0 0 12px rgba(231,84,128,0.55)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,185,0.70)";
                (e.currentTarget as HTMLAnchorElement).style.textShadow = "none";
              }}
            >
              Leo
            </a>
          </p>
        </div>
      </div>

      {/* ── BOTTOM GLOW FADE ── */}
      <div style={{
        height: 48, marginTop: 32,
        background: "linear-gradient(to bottom,transparent,rgba(6,4,8,1))",
        pointerEvents: "none",
      }} />

      {/* ── VERY BOTTOM SIGNATURE LINE ── */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg,transparent 0%,${C.pink} 20%,${C.gold} 50%,${C.roseGold} 80%,transparent 100%)`,
        boxShadow: "0 0 20px rgba(231,84,128,0.45), 0 0 40px rgba(212,175,55,0.18)",
        animation: "shimmerSweep 4s linear infinite",
      }} />

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes shimmerSweep {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr 1.1fr;
          gap: 40px 48px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 580px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .footer-bottom { flex-direction: column !important; align-items: center !important; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
