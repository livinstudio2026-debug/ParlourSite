import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function GalleryBackgroundEffects() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const floatOrb = (el: HTMLDivElement | null, dur: number, dy: number, delay: number) => {
      if (!el) return;
      gsap.to(el, {
        y: dy, x: dy * 0.35, scale: 1.08,
        duration: dur, delay,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });
    };

    floatOrb(orb1Ref.current, 16, -32,  0);
    floatOrb(orb2Ref.current, 20,  26, -4);
    floatOrb(orb3Ref.current, 22, -20, -8);
    floatOrb(orb4Ref.current, 14,  18, -2);

    // Slow pulsing spotlight
    if (spotRef.current) {
      gsap.to(spotRef.current, {
        opacity: 0.18, scale: 1.15,
        duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1,
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>

      {/* Radial base tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 75% 55% at 20% 55%, rgba(231,84,128,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 60% 70% at 80% 40%, rgba(212,175,185,0.07) 0%, transparent 58%),
            radial-gradient(ellipse 50% 50% at 50% 80%, rgba(212,175,55,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated orbs */}
      <div
        ref={orb1Ref}
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: -160, left: "-5%",
          background: "radial-gradient(circle,rgba(231,84,128,0.18) 0%,rgba(231,84,128,0.04) 55%,transparent 75%)",
          filter: "blur(90px)",
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute rounded-full"
        style={{
          width: 480, height: 480,
          bottom: -120, right: "3%",
          background: "radial-gradient(circle,rgba(212,175,185,0.14) 0%,transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        ref={orb3Ref}
        className="absolute rounded-full"
        style={{
          width: 340, height: 340,
          top: "40%", right: "20%",
          background: "radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 70%)",
          filter: "blur(65px)",
        }}
      />
      <div
        ref={orb4Ref}
        className="absolute rounded-full"
        style={{
          width: 260, height: 260,
          top: "18%", left: "28%",
          background: "radial-gradient(circle,rgba(231,84,128,0.10) 0%,transparent 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* Center spotlight glow */}
      <div
        ref={spotRef}
        className="absolute rounded-full"
        style={{
          width: 900, height: 500,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(ellipse,rgba(231,84,128,0.06) 0%,transparent 65%)",
          filter: "blur(40px)",
          opacity: 0.12,
        }}
      />

      {/* Diagonal shimmer lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              135deg,
              transparent,
              transparent 80px,
              rgba(212,175,185,0.012) 80px,
              rgba(212,175,185,0.012) 81px
            )
          `,
        }}
      />

      {/* SVG grain noise */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
