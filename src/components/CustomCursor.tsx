import { useEffect, useRef, useState } from "react";
import brushImg from "../assets/makeupBrush.png";

// ─── Beauty brand palette for particles ────────────────────────────────────
const PALETTE = [
  "#E8B4B8", // blush pink
  "#D4AF37", // champagne gold
  "#E75480", // deep rose
  "#F4C2C2", // baby pink
  "#FDF6F0", // cream white
  "#C9956C", // rose gold
  "#F8DDD0", // peach shimmer
  "#EDCDD6", // dusty rose
  "#F0C8A0", // warm gold shimmer
];

// ─── Types ──────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotVel: number;
  isDiamond: boolean;
  life: number;
  maxLife: number;
}

// ─── Utilities ───────────────────────────────────────────────────────────────
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createParticles(originX: number, originY: number): Particle[] {
  // 10 – 14 cosmetic sprinkle particles per click
  const count = 10 + Math.floor(Math.random() * 5);

  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 3.6;
    const maxLife = 50 + Math.floor(Math.random() * 38);

    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.0, // slight upward burst
      size: 2.8 + Math.random() * 4.2,
      color: pickRandom(PALETTE),
      alpha: 0.82 + Math.random() * 0.18,
      rotation: Math.random() * Math.PI * 2,
      rotVel: (Math.random() - 0.5) * 0.22,
      isDiamond: Math.random() > 0.42, // mix of circles & diamonds
      life: 0,
      maxLife,
    };
  });
}

// CSS selector for interactive / hoverable elements
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, label, select, textarea, [tabindex]";

// ─── Component ───────────────────────────────────────────────────────────────
export default function CustomCursor() {
  /*
   * isDesktop is intentionally false on first render so that on
   * touch / mobile we never mount the cursor DOM nodes at all.
   * Detection runs inside the first useEffect (after hydration).
   */
  const [isDesktop, setIsDesktop] = useState(false);

  // DOM refs
  const brushRef  = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable state stored in refs so RAF doesn't need re-renders
  const particles    = useRef<Particle[]>([]);
  const mouse        = useRef({ x: -500, y: -500 });
  const brushPos     = useRef({ x: -500, y: -500 });
  const ringPos      = useRef({ x: -500, y: -500 });
  const brushScale   = useRef(1);
  const targetScale  = useRef(1);
  const rafId        = useRef<number>(0);

  // ── Step 1 : Device detection ─────────────────────────────────────────────
  useEffect(() => {
    const isTouch  = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isTouch && !isMobile) {
      setIsDesktop(true);
      // Class-based cursor:none so we only suppress the OS cursor on desktop
      document.body.classList.add("lush-custom-cursor");
    }

    return () => {
      document.body.classList.remove("lush-custom-cursor");
    };
  }, []);

  // ── Step 2 : Cursor logic (only runs when isDesktop becomes true) ─────────
  useEffect(() => {
    if (!isDesktop) return;

    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    // ── Canvas sizing ──
    const resizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ── Event handlers ──
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseDown = (e: MouseEvent) => {
      // Slight press-down scale
      targetScale.current = Math.max(targetScale.current - 0.08, 0.85);
      particles.current.push(...createParticles(e.clientX, e.clientY));
    };

    const onMouseUp = () => {
      targetScale.current = 1;
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE_SELECTOR)) {
        targetScale.current = 1.55;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE_SELECTOR)) {
        targetScale.current = 1;
      }
    };

    document.addEventListener("mousemove",  onMouseMove, { passive: true });
    document.addEventListener("mousedown",  onMouseDown);
    document.addEventListener("mouseup",    onMouseUp);
    document.addEventListener("mouseover",  onMouseOver);
    document.addEventListener("mouseout",   onMouseOut);

    // ── Canvas draw helpers ──
    const drawDiamond = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      angle: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.62, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.62, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Add a subtle shimmer sparkle for special particles
    const drawSparkle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      angle: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      // 4-point star
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const b = a + Math.PI / 4;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(b) * (r * 0.38), Math.sin(b) * (r * 0.38));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ── Brush: update directly on mousemove — zero frame lag ────────────
    //    Scale is applied here too so the hover-grow is instant on position.
    const onMouseMoveBrush = (e: MouseEvent) => {
      if (brushRef.current) {
        brushRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) rotate(-38deg) scale(${brushScale.current})`;
      }
    };
    document.addEventListener("mousemove", onMouseMoveBrush, { passive: true });

    // ── Main animation loop ───────────────────────────────────────────────
    const tick = () => {
      // — Brush: mirror the raw mouse exactly (no lerp, no lag)
      brushPos.current.x = mouse.current.x;
      brushPos.current.y = mouse.current.y;

      // — Ring: slow dreamy lag — the only element that trails
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.07);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.07);

      // — Scale: lerp for silky hover grow/shrink
      brushScale.current = lerp(brushScale.current, targetScale.current, 0.11);

      // — Apply brush transform every RAF tick so scale changes land smoothly
      if (brushRef.current) {
        brushRef.current.style.transform =
          `translate(${brushPos.current.x}px, ${brushPos.current.y}px) rotate(-38deg) scale(${brushScale.current})`;
      }

      if (ringRef.current) {
        const rx = ringPos.current.x;
        const ry = ringPos.current.y;
        // Ring size expands subtly on hover
        const ringDiameter = 20 + (brushScale.current - 1) * 22;
        ringRef.current.style.width  = `${ringDiameter}px`;
        ringRef.current.style.height = `${ringDiameter}px`;
        ringRef.current.style.transform =
          `translate(${rx - ringDiameter / 2}px, ${ry - ringDiameter / 2}px)`;
      }

      // ── Particle canvas ──────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Remove dead particles first (avoids per-frame array growth)
      particles.current = particles.current.filter((p) => p.life < p.maxLife);

      for (const p of particles.current) {
        const t = p.life / p.maxLife;

        // Quadratic ease-out opacity
        const alpha = p.alpha * Math.pow(1 - t, 1.6);

        // Slight size decay in last 30 % of life
        const sizeMult = t > 0.7 ? 1 - (t - 0.7) / 0.3 * 0.4 : 1;
        const size = p.size * sizeMult;

        ctx.globalAlpha = alpha;
        ctx.fillStyle   = p.color;

        // Glow in first 25 % of life for that "bloom on click" feel
        if (t < 0.25) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur  = 12;
        } else {
          ctx.shadowBlur = 0;
        }

        // Alternate between circles, diamonds, and sparkles
        // const shapeType = Math.floor((p.life === 0 ? Math.random() * 3 : 0)); // stable per particle via life===0 trick is imperfect; use isDiamond flag instead
        if (p.isDiamond) {
          if (p.size > 5.5) {
            drawSparkle(ctx, p.x, p.y, size * 0.9, p.rotation);
          } else {
            drawDiamond(ctx, p.x, p.y, size, p.rotation);
          }
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // ── Physics update ──
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.082;  // gravity
        p.vx *= 0.972;  // horizontal drag
        p.vy *= 0.972;  // vertical drag
        p.rotation += p.rotVel;
        p.life++;
      }

      // Reset canvas state
      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize",       resizeCanvas);
      document.removeEventListener("mousemove",  onMouseMove);
      document.removeEventListener("mousemove",  onMouseMoveBrush);
      document.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mouseup",    onMouseUp);
      document.removeEventListener("mouseover",  onMouseOver);
      document.removeEventListener("mouseout",   onMouseOut);
    };
  }, [isDesktop]);

  // On mobile / touch → render nothing
  if (!isDesktop) return null;

  return (
    <>
      {/* ── Particle canvas layer (z: 99 997) ── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99997,
          pointerEvents: "none",
        }}
      />

      {/* ── Trailing glow ring (z: 99 998) ──
          Lags behind the brush with slower lerp, creating a luxurious
          "aura" that follows the cursor path. */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "1px solid rgba(231,84,128,0.5)",
          background:
            "radial-gradient(circle, rgba(231,84,128,0.08) 0%, rgba(212,175,55,0.04) 60%, transparent 100%)",
          boxShadow:
            "0 0 16px 4px rgba(231,84,128,0.18), 0 0 6px 2px rgba(212,175,55,0.14)",
          pointerEvents: "none",
          zIndex: 99998,
          // CSS transition for ring border colour on hover (fallback feel)
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          willChange: "transform, width, height",
        }}
      />

      {/* ── Brush cursor (z: 99 999) ──
          Fast lerp so it feels responsive while still being silky.
          transform-origin near the top of the image keeps the bristle
          tip close to the pointer hotspot regardless of brush image orientation. */}
      <div
        ref={brushRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "38px",
          pointerEvents: "none",
          zIndex: 99999,
          transformOrigin: "4px 4px", // near top-left → bristle-tip hotspot
          filter:
            "drop-shadow(0 3px 12px rgba(231,84,128,0.5)) " +
            "drop-shadow(0 1px 4px rgba(0,0,0,0.22))",
          willChange: "transform",
        }}
      >
        <img
          src={brushImg}
          alt=""
          draggable={false}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            userSelect: "none",
            // Slight brightness boost so the brush pops on dark backgrounds
            filter: "brightness(1.08) saturate(1.1)",
          }}
        />
      </div>
    </>
  );
}
