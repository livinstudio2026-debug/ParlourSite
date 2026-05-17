'use client';

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  cardCount: number;
}

export default function ServicesScrollWrapper({ children, cardCount }: Props) {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track   = trackRef.current;
    if (!wrapper || !track) return;

    // ── Identical to HoriCards getScrollAmount ───────────────────────────────
    const getScrollAmount = () => {
      const vp      = window.innerWidth;
      const padding = vp <= 768 ? vp * 0.45 : 120;
      return Math.max(track.scrollWidth - vp + padding, 0);
    };

    // ── gsap.context scopes every trigger created inside to this wrapper ─────
    // ctx.revert() on cleanup kills only these triggers, never other sections.
    const ctx = gsap.context(() => {

      // ── Main horizontal scroll timeline — HoriCards pattern exactly ─────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,               // same value as HoriCards
          anticipatePin: 1,       // prevents pin-jump white flash on fast scroll
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Direct DOM write — no React state, no re-render cost
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      // Single `to` translating the track — same pattern as HoriCards
      tl.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",   // 1:1 with scroll position, no drift
      });

      // Per-card entrance animation intentionally removed.
      // Cards are pre-rendered fully visible so they appear instantly
      // as they scroll into view with no fade/scale pop-in delay.

    }, wrapper); // scope to wrapper element

    // ── Resize: refresh only, never rebuild ─────────────────────────────────
    // HoriCards uses the same pattern. ScrollTrigger.refresh() recalculates
    // scroll distances in-place — no timeline teardown, no orphaned triggers,
    // no white flash.
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert(); // surgical cleanup — only kills triggers from this context
    };
  }, [cardCount]);

  return (
    <>
      <div ref={wrapperRef} className="svc-outer-wrapper">

        <div ref={trackRef} className="svc-track">
          <div className="svc-inner">
            {children}
          </div>
        </div>

        {/* Progress bar — identical markup to original */}
        <div className="svc-progress-wrap">
          <div ref={progressRef} className="svc-progress-fill" />
        </div>

        {/* Scroll hint — identical markup to original */}
        <div className="svc-hint">
          <span className="svc-hint-label">Scroll to Explore</span>
          <div className="svc-hint-line" />
        </div>

      </div>

      {/* All CSS identical to original — zero visual changes */}
      <style>{`
        .svc-outer-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          /* contain:paint stops the browser repainting the full page on
             every scroll tick — this is what eliminates the white flash */
          contain: paint;
          transform: translateZ(0);
        }

        .svc-track {
          position: absolute;
          top: 0; left: 0;
          height: 100%;
          display: flex;
          align-items: center;
          /* Promote to GPU compositor layer immediately —
             without this the browser uploads the layer on the
             first scroll tick, causing a 1-frame white flash. */
          will-change: transform;
          transform: translateZ(0);
          padding-left:  clamp(1rem, 5vw, 7rem);
          padding-right: clamp(1rem, 5vw, 7rem);
        }

        .svc-inner {
          display: flex;
          align-items: center;
          gap: clamp(1rem, 2.5vw, 2.2rem);
        }

        /* Force every service card to be rendered immediately —
           even those off-screen to the right. This is the key fix:
           the browser normally skips layout/paint for off-screen
           flex children, which causes the blank flash when they
           scroll into view. contain:none overrides that. */
        .service-card {
          contain: none !important;
          content-visibility: visible !important;
        }

        .svc-progress-wrap {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(100px, 25vw, 220px);
          height: 1px;
          background: rgba(212,175,185,0.15);
          border-radius: 100px;
          overflow: hidden;
          z-index: 20;
        }
        .svc-progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #E75480, #D4AF37);
          border-radius: 100px;
        }

        .svc-hint {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0.4;
          white-space: nowrap;
        }
        .svc-hint-label {
          font-family: 'Montserrat', sans-serif;
          font-weight: 200;
          font-size: 0.55rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #D4AFB9;
        }
        .svc-hint-line {
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, #D4AFB9, transparent);
        }

        @media (max-width: 768px) {
          .svc-track {
            padding-left:  1.25rem;
            padding-right: 1.25rem;
          }
          .svc-inner {
            gap: 1rem;
          }
          .svc-inner > div {
            width:  clamp(260px, 78vw, 320px) !important;
            height: clamp(440px, 68vh, 540px) !important;
            flex-shrink: 0 !important;
          }
          .svc-progress-wrap {
            bottom: 3rem;
            width: clamp(100px, 40vw, 180px);
          }
          .svc-hint {
            bottom: 1rem;
          }
        }
      `}</style>
    </>
  );
}
