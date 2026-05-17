import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function TestimonialsBackgroundEffects() {
  const orb1 = useRef<HTMLDivElement>(null);
  const orb2 = useRef<HTMLDivElement>(null);
  const orb3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const floatOrb = (
        el: HTMLDivElement | null,
        dur: number,
        dy: number,
        dx: number,
        delay: number
      ) => {
        if (!el) return;
        gsap.to(el, {
          y: dy,
          x: dx,
          scale: 1.06,
          duration: dur,
          delay,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      };
      floatOrb(orb1.current, 20, -28, 10, 0);
      floatOrb(orb2.current, 25, 22, -14, -6);
      floatOrb(orb3.current, 17, -16, 8, -3);
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Primary pink orb — top left */}
      <div
        ref={orb1}
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: -200,
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(231,84,128,0.13) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      {/* Gold orb — bottom right */}
      <div
        ref={orb2}
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: -100,
          right: "-6%",
          background:
            "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />
      {/* Rose gold orb — center */}
      <div
        ref={orb3}
        className="absolute rounded-full"
        style={{
          width: 360,
          height: 360,
          top: "40%",
          left: "38%",
          background:
            "radial-gradient(circle, rgba(212,175,185,0.07) 0%, transparent 70%)",
          filter: "blur(75px)",
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          opacity: 0.4,
        }}
      />

      {/* Shimmer sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-60%",
            width: "35%",
            height: "100%",
            background:
              "linear-gradient(105deg,transparent 30%,rgba(253,246,240,0.012) 50%,transparent 70%)",
            animation: "tSweep 12s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      </div>

      <style>{`
        @keyframes tSweep {
          0%   { left: -60%; }
          100% { left: 140%; }
        }
      `}</style>
    </div>
  );
}
