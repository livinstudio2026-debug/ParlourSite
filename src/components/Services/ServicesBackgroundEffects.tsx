import FloatingLuxuryParticles from "./FloatingLuxuryParticles.tsx";

export default function ServicesBackgroundEffects() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        // Isolate this layer so its children don't contaminate the scroll
        // compositor layer of the parent.
        isolation: "isolate",
      }}
    >
      {/* ── Ambient orbs — CSS-animated, no GSAP ── */}
      <div className="svc-orb svc-orb-1" />
      <div className="svc-orb svc-orb-2" />
      <div className="svc-orb svc-orb-3" />
      <div className="svc-orb svc-orb-4" />

      {/* Noise grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height%3D'100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      {/* Slow shimmer sweep */}
      <div
        className="services-bg-shimmer"
        style={{
          position: "absolute",
          top: 0,
          left: "-70%",
          width: "50%",
          height: "100%",
          background:
            "linear-gradient(105deg, transparent 30%, rgba(253,246,240,0.012) 50%, transparent 70%)",
          animation: "bgShimmerSweep 14s ease-in-out infinite",
          zIndex: 2,
        }}
      />

      {/* Particles */}
      <FloatingLuxuryParticles intensity={1.2} />

      <style>{`
        /* ── Orb base ── */
        .svc-orb {
          position: absolute;
          border-radius: 50%;
          /* will-change:transform tells the browser to promote these to their
             own GPU layers. Combined with CSS animation (not GSAP), the browser
             can animate them entirely off the main thread. */
          will-change: transform;
        }

        /* Orb 1 — top right, pink */
        .svc-orb-1 {
          width: 800px; height: 800px;
          top: -300px; right: -20%;
          background: radial-gradient(circle, rgba(231,84,128,0.13) 0%, transparent 65%);
          filter: blur(110px);
          animation: orbFloat1 18s ease-in-out infinite;
        }

        /* Orb 2 — bottom left, gold */
        .svc-orb-2 {
          width: 700px; height: 700px;
          bottom: -200px; left: -15%;
          background: radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%);
          filter: blur(100px);
          animation: orbFloat2 22s ease-in-out infinite;
          animation-delay: -3.5s;
        }

        /* Orb 3 — centre, rose */
        .svc-orb-3 {
          width: 500px; height: 500px;
          top: 30%; left: 35%;
          background: radial-gradient(circle, rgba(212,175,185,0.09) 0%, transparent 65%);
          filter: blur(85px);
          animation: orbFloat3 15s ease-in-out infinite;
          animation-delay: -1.8s;
        }

        /* Orb 4 — bottom right, pink lighter */
        .svc-orb-4 {
          width: 400px; height: 400px;
          bottom: 10%; right: 20%;
          background: radial-gradient(circle, rgba(231,84,128,0.07) 0%, transparent 65%);
          filter: blur(70px);
          animation: orbFloat4 26s ease-in-out infinite;
          animation-delay: -1.2s;
        }

        /* ── Keyframes — mirror the original GSAP dy/dx values ── */
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(16px, -32px) scale(1.1); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-12px, 26px) scale(1.1); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(24px, -18px) scale(1.1); }
        }
        @keyframes orbFloat4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 14px) scale(1.1); }
        }

        @keyframes bgShimmerSweep {
          0%   { left: -70%; }
          100% { left: 150%; }
        }
      `}</style>
    </div>
  );
}
