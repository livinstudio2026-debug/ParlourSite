import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  alpha: number; baseAlpha: number;
  color: { r: number; g: number; b: number };
  t: number;
  drift: number; driftOff: number;
  fadeTopY: number;
  sparkle: boolean;
  rot: number; rotV: number;
}

const COLS = [
  { r: 231, g: 84,  b: 128 },
  { r: 212, g: 175, b: 185 },
  { r: 212, g: 175, b: 55  },
  { r: 253, g: 246, b: 240 },
];

export default function FloatingLuxuryParticles({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d", { alpha: true })!;
    // Hint to the browser: this canvas changes every frame
    // so skip the "is it dirty?" check.
    ctx.imageSmoothingEnabled = false;

    const COUNT = Math.round(22 * intensity);
    const ps: Particle[] = [];

    const spawn = (seedY?: number): void => {
      const c = COLS[Math.floor(Math.random() * COLS.length)];
      const frac = Math.random() < 0.55
        ? 0.3 + Math.random() * 0.35
        : Math.random() * 0.3;
      ps.push({
        x: Math.random() * canvas.width,
        y: seedY ?? canvas.height + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.25),
        r: Math.random() * 2.2 + 0.5,
        alpha: 0, baseAlpha: Math.random() * 0.32 + 0.1,
        color: c, t: 0,
        drift: Math.random() * 0.05 + 0.018,
        driftOff: Math.random() * Math.PI * 2,
        fadeTopY: canvas.height * frac,
        sparkle: Math.random() < 0.35,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.04,
      });
    };

    for (let i = 0; i < COUNT; i++) spawn(Math.random() * (canvas.height + 200) - 200);

    // ── Pre-build one offscreen glow sprite per colour ──────────────────
    // Instead of calling createRadialGradient() every frame per particle
    // (the original hot-path cost), we render each colour's halo once into
    // a tiny offscreen canvas and drawImage() it — GPU blit, no JS gradient math.
    const SPRITE_SIZE = 64; // px — large enough for glow, small enough to blit fast
    const sprites = new Map<string, HTMLCanvasElement>();

    const makeSprite = (r: number, g: number, b: number): HTMLCanvasElement => {
      const key = `${r},${g},${b}`;
      if (sprites.has(key)) return sprites.get(key)!;

      const off = document.createElement("canvas");
      off.width = off.height = SPRITE_SIZE;
      const oc = off.getContext("2d")!;
      const half = SPRITE_SIZE / 2;
      const grd = oc.createRadialGradient(half, half, 0, half, half, half);
      grd.addColorStop(0,   `rgba(${r},${g},${b},0.75)`);
      grd.addColorStop(0.5, `rgba(${r},${g},${b},0.22)`);
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      oc.beginPath();
      oc.arc(half, half, half, 0, Math.PI * 2);
      oc.fillStyle = grd;
      oc.fill();
      sprites.set(key, off);
      return off;
    };

    // Pre-warm all sprites so first frame is instant
    COLS.forEach(({ r, g, b }) => makeSprite(r, g, b));

    let frame = 0;
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (frame % 5 === 0 && Math.random() < 0.6 && ps.length < COUNT * 1.4) spawn();

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.t   += 0.038;
        p.rot += p.rotV;
        p.x   += p.vx + Math.sin(p.t * p.drift + p.driftOff) * 0.55;
        p.y   += p.vy;

        const fZ  = (canvas.height - p.fadeTopY) * 0.38;
        const dFT = p.y - p.fadeTopY;
        p.alpha   = dFT < fZ ? p.baseAlpha * Math.max(0, dFT / fZ) : p.baseAlpha;

        if (p.alpha <= 0.005 || p.y < p.fadeTopY - 12) { ps.splice(i, 1); continue; }

        const { r, g, b } = p.color;
        const glowR = p.r * 5;

        // ── Glow halo: blit pre-built sprite instead of building gradient ──
        const sprite = makeSprite(r, g, b);
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(
          sprite,
          p.x - glowR, p.y - glowR,
          glowR * 2, glowR * 2,
        );
        ctx.globalAlpha = 1;

        // ── Core dot ──
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.7, 1).toFixed(3)})`;
        ctx.fill();

        // ── Sparkle cross (only larger particles) ──
        if (p.sparkle && p.r > 1.5) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.alpha * 0.55;
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.lineWidth = 0.7;
          for (let a = 0; a < 4; a++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, p.r * 3.5);
            ctx.stroke();
            ctx.rotate(Math.PI / 2);
          }
          ctx.restore();
        }
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      sprites.clear();
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
