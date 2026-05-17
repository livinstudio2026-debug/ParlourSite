

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────
   Color tokens  (mirrors ContactSection exactly)
───────────────────────────────────────────── */
const C = {
  pink:     "#E75480",
  roseGold: "#D4AFB9",
  cream:    "#FDF6F0",
  gold:     "#D4AF37",
} as const;

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type FormState = "idle" | "loading" | "success";

interface FormData {
  name:    string;
  email:   string;
  phone:   string;
  package: string;
  date:    string;
  message: string;
}

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */
export interface PackageBookingModalProps {
  isOpen:         boolean;
  onClose:        () => void;
  defaultPackage: string;   // package title, e.g. "Bridal Luxury"
  accentColor?:   string;   // card accent (used for top bar & glow)
  glowRgb?:       string;   // "r,g,b" for rgba()
}

/* ─────────────────────────────────────────────
   Input-style builder (matches ContactSection)
───────────────────────────────────────────── */
const inputStyle = (focused: boolean, hasError: boolean): React.CSSProperties => ({
  width:          "100%",
  padding:        "12px 16px",
  borderRadius:   12,
  outline:        "none",
  fontFamily:     "'Jost', sans-serif",
  fontSize:       "0.82rem",
  fontWeight:     300,
  color:          "rgba(253,246,240,0.90)",
  letterSpacing:  "0.025em",
  background:     focused ? "rgba(231,84,128,0.06)" : "rgba(253,246,240,0.03)",
  border:         `1px solid ${hasError ? "rgba(231,84,128,0.65)" : focused ? "rgba(231,84,128,0.55)" : "rgba(212,175,185,0.18)"}`,
  boxShadow:      focused ? "0 0 0 3px rgba(231,84,128,0.10), 0 0 20px rgba(231,84,128,0.12)" : "none",
  transition:     "all 0.28s ease",
  boxSizing:      "border-box",
});

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function FormField({
  label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{
        fontFamily: "'Jost', sans-serif", fontSize: "0.60rem", fontWeight: 500,
        letterSpacing: "0.15em", color: "rgba(212,175,185,0.65)", textTransform: "uppercase",
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.60rem", color: C.pink, letterSpacing: "0.04em", marginTop: -2 }}>
          {error}
        </p>
      )}
    </div>
  );
}

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

const PACKAGES = [
  "Essential Glow",
  "Bridal Luxury",
  "Spa Escape",
  "Royal Transformation",
];

function LuxSelect({ value, onChange, error }: {
  value: string; onChange: (v: string) => void; error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        ...inputStyle(focused, !!error),
        cursor: "pointer",
        appearance: "none", WebkitAppearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AFB9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        paddingRight: 40,
      }}
    >
      {PACKAGES.map(p => (
        <option key={p} value={p} style={{ background: "#140a12", color: "#FDF6F0" }}>{p}</option>
      ))}
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

/* ─────────────────────────────────────────────
   Success card  (mirrors ContactSection exactly)
───────────────────────────────────────────── */
function SuccessCard({ onClose }: { onClose: () => void }) {
  const [sparkles] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      angle: (i / 16) * 360,
      dist: 55 + Math.random() * 40,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.5,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "52px 36px 40px",
        textAlign: "center", position: "relative",
      }}
    >
      {/* sparkle burst */}
      <div style={{ position: "absolute", top: "45%", left: "50%", width: 0, height: 0 }}>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0], scale: [0, 1, 0],
              x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
              y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
            }}
            transition={{ duration: 1.2, delay: 0.3 + s.delay, ease: "easeOut" }}
            style={{
              position: "absolute", width: s.size, height: s.size,
              borderRadius: "50%",
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
          position: "absolute", width: 100, height: 100, borderRadius: "50%",
          border: `2px solid rgba(231,84,128,0.6)`,
          boxShadow: "0 0 40px rgba(231,84,128,0.4)",
          top: "calc(45% - 50px)", left: "calc(50% - 50px)",
        }}
      />

      {/* checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 72, height: 72, borderRadius: "50%", marginBottom: 24,
          background: "linear-gradient(135deg,rgba(231,84,128,0.18) 0%,rgba(212,175,55,0.12) 100%)",
          border: "1.5px solid rgba(231,84,128,0.50)",
          boxShadow: "0 0 40px rgba(231,84,128,0.35), inset 0 0 24px rgba(231,84,128,0.10)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 2,
        }}
      >
        <CheckCircle2 size={34} style={{ color: C.pink }} strokeWidth={1.5} />
      </motion.div>

      {/* text */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        style={{ position: "relative", zIndex: 2 }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
          padding: "4px 14px", borderRadius: 40,
          background: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.28)",
        }}>
          <Sparkles size={11} style={{ color: C.gold }} />
          <span style={{
            fontFamily: "'Jost', sans-serif", fontSize: "0.56rem", fontWeight: 500,
            letterSpacing: "0.18em", color: C.gold, textTransform: "uppercase",
          }}>
            Request Received
          </span>
        </div>

        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300,
          color: C.cream, lineHeight: 1.2, marginBottom: 12,
          letterSpacing: "-0.01em",
        }}>
          Your Package Has Been{" "}
          <em style={{
            fontStyle: "italic",
            background: `linear-gradient(135deg,${C.pink} 0%,${C.roseGold} 50%,${C.gold} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Reserved
          </em>
        </h3>

        <p style={{
          fontFamily: "'Jost', sans-serif", fontSize: "0.80rem", fontWeight: 300,
          color: "rgba(253,246,240,0.45)", lineHeight: 1.8, maxWidth: 340, margin: "0 auto",
        }}>
          Our beauty experts will reach out shortly to confirm your experience.
        </p>

        {/* shimmer line */}
        <div style={{
          width: 200, height: 1, margin: "24px auto 0", borderRadius: 2,
          background: `linear-gradient(90deg,transparent,${C.pink} 30%,${C.gold} 70%,transparent)`,
          boxShadow: "0 0 14px rgba(231,84,128,0.40)",
          animation: "mbShimmerSweep 2.5s linear infinite",
        }} />

        {/* close btn */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          onClick={onClose}
          style={{
            marginTop: 28,
            padding: "10px 28px", borderRadius: 40, border: "1px solid rgba(212,175,185,0.28)",
            background: "transparent", color: "rgba(212,175,185,0.6)",
            fontFamily: "'Jost', sans-serif", fontSize: "0.66rem", fontWeight: 400,
            letterSpacing: "0.14em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,185,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = C.cream;
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,185,0.50)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,175,185,0.6)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,185,0.28)";
          }}
        >
          Close
        </motion.button>
      </motion.div>

      {/* ambient glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: 260, height: 100, pointerEvents: "none",
        background: "radial-gradient(ellipse,rgba(231,84,128,0.16) 0%,transparent 70%)",
        filter: "blur(28px)",
      }} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN MODAL COMPONENT
═══════════════════════════════════════════════ */
export default function PackageBookingModal({
  isOpen,
  onClose,
  defaultPackage,
  accentColor = C.pink,
  glowRgb     = "231,84,128",
}: PackageBookingModalProps) {

  const [formData, setFormData]   = useState<FormData>({
    name: "", email: "", phone: "",
    package: defaultPackage,
    date: "",
    message: "",
  });
  const [errors,    setErrors]    = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [formState, setFormState] = useState<FormState>("idle");

  const btnRef  = useRef<HTMLButtonElement>(null);
  const shimRef = useRef<HTMLSpanElement>(null);

  /* Sync package when modal opens for a different package */
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, package: defaultPackage }));
      setErrors({});
      setFormState("idle");
    }
  }, [isOpen, defaultPackage]);

  /* Lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (k: keyof FormData) => (v: string) =>
    setFormData(prev => ({ ...prev, [k]: v }));

  const validate = (): boolean => {
    const errs: typeof errors = {};
    let ok = true;
    (["name","email","phone","package","date"] as (keyof FormData)[]).forEach(k => {
      if (!formData[k]) { errs[k] = true; ok = false; }
    });
    setErrors(errs);
    return ok;
  };

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setFormState("loading");

    if (shimRef.current) {
      gsap.fromTo(shimRef.current,
        { x: "-115%", opacity: 0.6 },
        { x: "115%",  opacity: 0.6, duration: 0.9, ease: "power1.inOut", repeat: 3 }
      );
    }

    await new Promise(r => setTimeout(r, 2600));
    setFormState("success");
  }, [formData]);

  const isLoading = formState === "loading";
  const isSuccess = formState === "success";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            style={{
              position:   "fixed", inset: 0, zIndex: 1000,
              background: "rgba(6,3,8,0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* ── Modal panel ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{ opacity: 0, scale: 0.94, y: 20  }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position:  "fixed",
              inset:     0,
              zIndex:    1001,
              display:   "flex",
              alignItems: "center",
              justifyContent: "center",
              padding:   "clamp(12px,3vw,32px)",
              pointerEvents: "none",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: "auto",
                position:      "relative",
                width:         "100%",
                maxWidth:      540,
                maxHeight:     "92vh",
                overflowY:     "auto",
                borderRadius:  24,
                background:    "rgba(12,6,10,0.95)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border:        `1px solid rgba(${glowRgb},0.28)`,
                boxShadow: [
                  "0 36px 90px rgba(0,0,0,0.70)",
                  "inset 0 1px 0 rgba(255,255,255,0.04)",
                  `0 0 70px rgba(${glowRgb},0.14)`,
                ].join(", "),

                /* custom scrollbar */
                scrollbarWidth: "thin",
                scrollbarColor: `rgba(${glowRgb},0.35) transparent`,
              }}
            >
              {/* Top accent bar */}
              <div style={{
                height:       3,
                borderRadius: "24px 24px 0 0",
                background:   `linear-gradient(90deg,transparent,${accentColor} 28%,${C.gold} 72%,transparent)`,
                boxShadow:    `0 0 18px rgba(${glowRgb},0.55)`,
              }} />

              {/* Corner accents */}
              <div style={{ position: "absolute", top: 18, right: 18, width: 24, height: 24, borderTop: "1px solid rgba(212,175,185,0.22)", borderRight: "1px solid rgba(212,175,185,0.22)", borderRadius: "0 8px 0 0", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 18, left: 18, width: 24, height: 24, borderBottom: "1px solid rgba(212,175,185,0.22)", borderLeft: "1px solid rgba(212,175,185,0.22)", borderRadius: "0 0 0 8px", pointerEvents: "none" }} />

              {/* Passive shimmer sweep */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
                background: "linear-gradient(105deg,transparent 28%,rgba(212,175,185,0.025) 50%,transparent 72%)",
                animation: "mbShimmerSweep 6s linear infinite",
                borderRadius: 24,
              }} />

              {/* Loading blur overlay */}
              {isLoading && (
                <div style={{
                  position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
                  background: "rgba(12,6,10,0.15)", backdropFilter: "blur(2px)",
                  borderRadius: 24, animation: "mbLoadingPulse 1.5s ease-in-out infinite",
                }} />
              )}

              {/* Content */}
              <div style={{ position: "relative", zIndex: 1, padding: "clamp(24px,4vw,36px)" }}>

                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                    >
                      {/* ── Header row ── */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                        <div>
                          {/* label pill */}
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 7,
                            padding: "4px 12px", borderRadius: 40, marginBottom: 12,
                            background: `rgba(${glowRgb},0.08)`,
                            border: `1px solid rgba(${glowRgb},0.28)`,
                          }}>
                            <span style={{
                              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                              background: accentColor,
                              boxShadow: `0 0 7px ${accentColor}`,
                              animation: "mbPulseGlow 2s ease-in-out infinite",
                            }} />
                            <span style={{
                              fontFamily: "'Jost', sans-serif", fontSize: "0.58rem", fontWeight: 500,
                              letterSpacing: "0.18em", textTransform: "uppercase",
                              color: `rgba(${glowRgb},0.85)`,
                            }}>
                              Book Package
                            </span>
                          </div>

                          <h3 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize:   "clamp(1.4rem,3vw,1.9rem)",
                            fontWeight: 300, lineHeight: 1.1,
                            color: C.cream, letterSpacing: "-0.01em",
                            marginBottom: 6,
                          }}>
                            Reserve Your{" "}
                            <em style={{
                              fontStyle: "italic",
                              background: `linear-gradient(135deg,${accentColor} 0%,${C.roseGold} 50%,${C.gold} 100%)`,
                              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            }}>
                              Experience
                            </em>
                          </h3>
                          <p style={{
                            fontFamily: "'Jost', sans-serif", fontSize: "0.70rem", fontWeight: 300,
                            color: "rgba(253,246,240,0.35)", lineHeight: 1.6,
                          }}>
                            Fill in your details and we'll confirm your booking shortly.
                          </p>
                        </div>

                        {/* Close button */}
                        <button
                          onClick={onClose}
                          aria-label="Close"
                          style={{
                            flexShrink: 0, marginLeft: 12,
                            width: 36, height: 36, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: "rgba(253,246,240,0.04)",
                            border: "1px solid rgba(212,175,185,0.18)",
                            color: "rgba(212,175,185,0.55)",
                            cursor: "pointer", transition: "all 0.25s ease",
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(231,84,128,0.10)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(231,84,128,0.40)";
                            (e.currentTarget as HTMLButtonElement).style.color = C.pink;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(253,246,240,0.04)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,185,0.18)";
                            (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,175,185,0.55)";
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Thin divider */}
                      <div style={{
                        height: 1, marginBottom: 22,
                        background: `linear-gradient(90deg,transparent,rgba(${glowRgb},0.35) 40%,rgba(212,175,55,0.25) 70%,transparent)`,
                      }} />

                      {/* ── Fields ── */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                        {/* Name */}
                        <FormField label="Full Name" error={errors.name ? "Required" : undefined}>
                          <LuxInput
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={set("name")}
                            error={errors.name}
                          />
                        </FormField>

                        {/* Email + Phone — 2-col on wider screens */}
                        <div className="mb-field-row">
                          <FormField label="Email Address" error={errors.email ? "Required" : undefined}>
                            <LuxInput
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={set("email")}
                              type="email"
                              error={errors.email}
                            />
                          </FormField>
                          <FormField label="Phone Number" error={errors.phone ? "Required" : undefined}>
                            <LuxInput
                              placeholder="+91 98765 43210"
                              value={formData.phone}
                              onChange={set("phone")}
                              type="tel"
                              error={errors.phone}
                            />
                          </FormField>
                        </div>

                        {/* Package + Date — 2-col on wider screens */}
                        <div className="mb-field-row">
                          <FormField label="Selected Package" error={errors.package ? "Required" : undefined}>
                            <LuxSelect
                              value={formData.package}
                              onChange={set("package")}
                              error={errors.package}
                            />
                          </FormField>

                          <FormField label="Date of Booking" error={errors.date ? "Required" : undefined}>
                            <LuxInput
                              placeholder="Pick a date"
                              value={formData.date}
                              onChange={set("date")}
                              type="date"
                              error={errors.date}
                            />
                          </FormField>
                        </div>

                        {/* Message — optional */}
                        <FormField label="Message (Optional)">
                          <LuxTextarea
                            placeholder="Any special requests or preferences…"
                            value={formData.message}
                            onChange={set("message")}
                          />
                        </FormField>

                        {/* Submit */}
                        <button
                          ref={btnRef}
                          onClick={handleSubmit}
                          disabled={isLoading}
                          style={{
                            position: "relative", overflow: "hidden", width: "100%",
                            padding: "14px 28px", borderRadius: 14, border: "none",
                            background: isLoading
                              ? "linear-gradient(135deg,#c0376a 0%,#9e2558 100%)"
                              : "linear-gradient(135deg,#E75480 0%,#c0376a 55%,#E75480 100%)",
                            backgroundSize: "200% 100%",
                            color: "#fff", fontFamily: "'Jost', sans-serif",
                            fontSize: "0.76rem", fontWeight: 500,
                            letterSpacing: "0.14em", textTransform: "uppercase",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            boxShadow: isLoading
                              ? "0 0 30px rgba(231,84,128,0.50)"
                              : "0 6px 28px rgba(231,84,128,0.40)",
                            transform: "translateZ(0)",
                            transition: "box-shadow 0.30s ease",
                            marginTop: 4,
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
                            animation: isLoading ? "none" : "mbShimmerSweep 3s linear infinite",
                          }} />
                          {/* glow border inset */}
                          <span style={{ position: "absolute", inset: -1, borderRadius: 15, pointerEvents: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }} />
                          <span style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                            {isLoading ? (
                              <>
                                <Loader2 size={15} style={{ animation: "mbSpin 1s linear infinite" }} />
                                Reserving Your Package...
                              </>
                            ) : (
                              <>
                                Confirm Booking
                                <ArrowRight size={14} />
                              </>
                            )}
                          </span>
                        </button>

                        <p style={{
                          textAlign: "center",
                          fontFamily: "'Jost', sans-serif", fontSize: "0.58rem", fontWeight: 300,
                          letterSpacing: "0.06em", color: "rgba(253,246,240,0.20)", marginTop: 0,
                        }}>
                          ✦ Complimentary consultation included with every package ✦
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="success">
                      <SuccessCard onClose={onClose} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

}

/* ─────────────────────────────────────────────
   Global keyframes injected once
   (Scoped to modal — no collision with page)
───────────────────────────────────────────── */
const MODAL_STYLES = `
  @keyframes mbShimmerSweep {
    0%   { transform: translateX(-115%); }
    100% { transform: translateX(115%); }
  }
  @keyframes mbSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes mbLoadingPulse {
    0%,100% { opacity: 0.4; }
    50%     { opacity: 0.8; }
  }
  @keyframes mbPulseGlow {
    0%,100% { box-shadow: 0 0 7px currentColor; }
    50%     { box-shadow: 0 0 14px currentColor, 0 0 22px rgba(231,84,128,0.4); }
  }

  /* 2-col field row — stacks on narrow screens */
  .mb-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 480px) {
    .mb-field-row { grid-template-columns: 1fr !important; }
  }

  /* Custom scrollbar for Webkit */
  /* (selector targets the modal's scroll container) */
  .mb-modal-scroll::-webkit-scrollbar { width: 4px; }
  .mb-modal-scroll::-webkit-scrollbar-track { background: transparent; }
  .mb-modal-scroll::-webkit-scrollbar-thumb { background: rgba(212,175,185,0.25); border-radius: 4px; }

  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.5) sepia(1) saturate(3) hue-rotate(300deg);
    cursor: pointer;
    opacity: 0.6;
  }

  input::placeholder, textarea::placeholder {
    color: rgba(212,175,185,0.32) !important;
    font-style: italic;
  }
  input, textarea, select { box-sizing: border-box !important; }
`;

/* Inject styles once into <head> */
if (typeof document !== "undefined" && !document.getElementById("pkg-modal-styles")) {
  const tag = document.createElement("style");
  tag.id = "pkg-modal-styles";
  tag.textContent = MODAL_STYLES;
  document.head.appendChild(tag);
}
