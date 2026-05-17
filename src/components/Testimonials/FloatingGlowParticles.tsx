import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  symbol: string;
}

const SYMBOLS = ["✦", "◇", "✧", "·", "⋆", "∘"];
const COLORS = [
  "rgba(231,84,128,0.6)",
  "rgba(212,175,55,0.5)",
  "rgba(212,175,185,0.55)",
  "rgba(253,246,240,0.4)",
];

export default function FloatingGlowParticles({ count = 18 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.55 + Math.random() * 0.55,
    color: COLORS[i % COLORS.length],
    duration: 5 + Math.random() * 9,
    delay: Math.random() * -12,
    symbol: SYMBOLS[i % SYMBOLS.length],
  }));

  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll<HTMLSpanElement>(".fgp");
    const ctx = gsap.context(() => {
      els.forEach((el, i) => {
        const p = particles[i];
        gsap.to(el, {
          y: -18 - Math.random() * 20,
          x: (Math.random() - 0.5) * 22,
          rotation: (Math.random() - 0.5) * 40,
          opacity: 0.15 + Math.random() * 0.7,
          scale: 0.85 + Math.random() * 0.35,
          duration: p.duration,
          delay: p.delay,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {particles.map((p, i) => (
        <span
          key={i}
          className="fgp absolute select-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            color: p.color,
            opacity: 0.3,
            textShadow: `0 0 8px ${p.color}`,
            lineHeight: 1,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
