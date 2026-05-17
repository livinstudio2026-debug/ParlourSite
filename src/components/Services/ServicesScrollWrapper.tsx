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

    const getScrollAmount = () => {
      const vp      = window.innerWidth;
      const padding = vp <= 768 ? vp * 0.45 : 120;
      return Math.max(track.scrollWidth - vp + padding, 0);
    };

    // ── Grab the sibling section that sits ABOVE this one in the DOM ─────────
    // When we scroll back up into it, it must paint over the pinned wrapper.
    // We elevate it while the services section is inactive so it always wins
    // the stacking contest during the un-pin transition.
    const prevSection = wrapper.previousElementSibling as HTMLElement | null;
    const nextSection = wrapper.nextElementSibling  as HTMLElement | null;

    const setActive = () => {
      // Services section is pinned and in view — it should be on top
      wrapper.style.zIndex = "10";
      if (prevSection) prevSection.style.zIndex = "0";
      if (nextSection) nextSection.style.zIndex  = "0";
    };

    const setInactive = () => {
      // Services section is NOT active — surrounding sections must win
      wrapper.style.zIndex = "0";
      if (prevSection) prevSection.style.zIndex = "11"; // paint OVER services when scrolling back up
      if (nextSection) nextSection.style.zIndex  = "11"; // paint OVER services when scrolling down past
    };

    // Start inactive — section hasn't been entered yet
    setInactive();

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          pinReparent: false,
          onEnter:      setActive,
          onLeave:      setInactive,
          onEnterBack:  setActive,
          onLeaveBack:  setInactive,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      });

      tl.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
      });

    }, wrapper);

    const handleResize = () => { ScrollTrigger.refresh(); };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Restore siblings to neutral on unmount
      if (prevSection) prevSection.style.zIndex = "";
      if (nextSection) nextSection.style.zIndex  = "";
      ctx.revert();
    };
  }, [cardCount]);

  return (
    <>
      {/*
        Initial z-index is 0 (not 10) — the CSS no longer hard-codes elevation.
        Elevation is managed entirely by the JS callbacks above, so there's no
        race between a static CSS value and the onLeaveBack JS assignment.
      */}
      <div ref={wrapperRef} className="svc-outer-wrapper">

        <div ref={trackRef} className="svc-track">
          <div className="svc-inner">
            {children}
          </div>
        </div>

        <div className="svc-progress-wrap">
          <div ref={progressRef} className="svc-progress-fill" />
        </div>

        <div className="svc-hint">
          <span className="svc-hint-label">Scroll to Explore</span>
          <div className="svc-hint-line" />
        </div>

      </div>

      <style>{`
        .svc-outer-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          /*
            'contain: paint' was creating an isolated stacking context that
            fought with the JS z-index management. Replaced with
            'contain: size layout' which still gives the performance gains
            (no overflow paint bleed, layout isolation) without locking the
            element into its own stacking context.
          */
          contain: size layout;
          transform: translateZ(0);
          /* z-index starts at 0 — JS callbacks own elevation from here */
          z-index: 0;
        }

        .svc-track {
          position: absolute;
          top: 0; left: 0;
          height: 100%;
          display: flex;
          align-items: center;
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
