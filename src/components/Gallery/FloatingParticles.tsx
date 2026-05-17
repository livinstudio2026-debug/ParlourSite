import { useEffect, useRef } from "react";

interface FloatingParticlesProps {
  density?: number;
  className?: string;
}

export default function FloatingParticles({ density = 18, className = "" }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;

    const COLORS = [
      { r: 231, g: 84,  b: 128 },
      { r: 212, g: 175, b: 185 },
      { r: 212, g: 175, b: 55  },
      { r: 253, g: 246, b: 240 },
      { r: 255, g: 182, b: 210 },
    ];

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number; baseAlpha: number;
      color: { r: number; g: number; b: number };
      drift: number; driftOffset: number; t: number;
      fadeTopY: number;
    };

    const particles: Particle[] = [];

    const spawn = (seedY?: number) => {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)];
      const rand = Math.random();

      let fadeTopFraction: number;
      if (rand < 0.65) {
        fadeTopFraction = 0.40 + Math.random() * 0.20;
      } else if (rand < 0.90) {
        fadeTopFraction = 0.15 + Math.random() * 0.25;
      } else {
        fadeTopFraction = Math.random() * 0.15;
      }

      const fadeTopY  = canvas.height * fadeTopFraction;
      const baseAlpha = Math.random() * 0.45 + 0.2;

      particles.push({
        x:           Math.random() * canvas.width,
        y:           seedY !== undefined ? seedY : canvas.height + Math.random() * 40,
        vx:          (Math.random() - 0.5) * 0.55,
        vy:          -(Math.random() * 1.1 + 0.45),
        r:           Math.random() * 2.3 + 0.7,
        alpha:       baseAlpha,
        baseAlpha,
        color:       c,
        drift:       Math.random() * 0.06 + 0.02,
        driftOffset: Math.random() * Math.PI * 2,
        t:           0,
        fadeTopY,
      });
    };

    for (let i = 0; i < density; i++) {
      spawn(Math.random() * (canvas.height + 200) - 200);
    }

    let frame = 0;
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (frame % 5 === 0 && Math.random() < 0.7) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t  += 0.04;
        p.x  += p.vx + Math.sin(p.t * p.drift + p.driftOffset) * 0.65;
        p.y  += p.vy;

        const travelRange = canvas.height - p.fadeTopY;
        const distFromTop = p.y - p.fadeTopY;
        const fadeZone    = travelRange * 0.35;
        if (distFromTop < fadeZone) {
          p.alpha = p.baseAlpha * Math.max(0, distFromTop / fadeZone);
        } else {
          p.alpha = p.baseAlpha;
        }

        if (p.alpha <= 0.008 || p.y < p.fadeTopY - 10) { particles.splice(i, 1); continue; }

        const { r, g, b } = p.color;

        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0,   `rgba(${r},${g},${b},${(p.alpha * 0.85).toFixed(3)})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b},${(p.alpha * 0.3).toFixed(3)})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(p.alpha * 1.6, 1).toFixed(3)})`;
        ctx.fill();

        if (p.r > 1.8) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.t * 0.8);
          ctx.globalAlpha = p.alpha * 0.55;
          ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
          ctx.lineWidth   = 0.7;
          for (let arm = 0; arm < 4; arm++) {
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.r * 3);
            ctx.stroke();
            ctx.rotate(Math.PI / 2);
          }
          ctx.restore();
        }
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
