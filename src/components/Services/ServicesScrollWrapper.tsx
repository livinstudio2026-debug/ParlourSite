'use client';

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  cardCount: number;
}

export default function ServicesScrollWrapper({ children }: Props) {
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateProgress = () => {
      const max = track.scrollWidth - track.clientWidth;
      const pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    };

    // Desktop mouse wheels only produce vertical delta. Since this track is
    // a plain horizontally-scrollable div (no more GSAP pin/scrub), we
    // forward vertical wheel input into horizontal scroll so a normal mouse
    // still "just works" here — trackpads/touch already scroll horizontally
    // on their own and are left alone.
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    };

    updateProgress();
    track.addEventListener("scroll", updateProgress, { passive: true });
    track.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      track.removeEventListener("scroll", updateProgress);
      track.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <div className="svc-outer-wrapper">

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
        }

        /* Plain native horizontal scroller — smooth momentum on
           touch/trackpad, smooth-scroll behavior for programmatic jumps,
           scrollbar hidden for a clean carousel look. */
        .svc-track {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 1.5rem clamp(1rem, 5vw, 7rem) 3.5rem;
        }
        .svc-track::-webkit-scrollbar { display: none; }

        .svc-inner {
          display: flex;
          align-items: center;
          gap: clamp(1rem, 2.5vw, 2.2rem);
          width: max-content;
        }

        .svc-inner > * {
          scroll-snap-align: start;
        }

        .svc-progress-wrap {
          position: absolute;
          bottom: 1.75rem;
          left: 50%;
          transform: translateX(-50%);
          width: clamp(100px, 25vw, 220px);
          height: 1px;
          background: rgba(212,175,185,0.15);
          border-radius: 100px;
          overflow: hidden;
          z-index: 5;
          pointer-events: none;
        }
        .svc-progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #E75480, #D4AF37);
          border-radius: 100px;
        }

        .svc-hint {
          position: absolute;
          bottom: 0.4rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0.4;
          white-space: nowrap;
          pointer-events: none;
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
            padding: 1rem 1.25rem 3rem;
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
            bottom: 2.25rem;
            width: clamp(100px, 40vw, 180px);
          }
        }
      `}</style>
    </>
  );
}
