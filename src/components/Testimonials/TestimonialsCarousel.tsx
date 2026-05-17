import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import TestimonialCard from "./TestimonialCard.tsx";
import type { TestimonialData } from "./TestimonialCard.tsx";

interface Props {
  testimonials: TestimonialData[];
}

const AUTO_INTERVAL = 3800; // ms between slides

export default function TestimonialsCarousel({ testimonials }: Props) {
  const total = testimonials.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimating = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ── slot: -1=left  0=center  1=right  null=hidden ── */
  const getSlot = (idx: number, active: number) => {
    const diff = ((idx - active) % total + total) % total;
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === total - 1) return -1;
    return null;
  };

  /* ── Apply positions via GSAP ── */
  const applyLayout = useCallback(
    (active: number, animate: boolean) => {
      const isMobile = (wrapperRef.current?.offsetWidth ?? 900) < 640;
      // How far side cards are pushed from center (as % of card width)
      const sideShift = isMobile ? 270 : 370; // px

      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const slot = getSlot(idx, active);

        let x: number, scale: number, opacity: number, zIndex: number;

        if (slot === 0) {
          x = 0; scale = 1; opacity = 1; zIndex = 10;
        } else if (slot === 1) {
          x = sideShift; scale = 0.78; opacity = 0.45; zIndex = 5;
        } else if (slot === -1) {
          x = -sideShift; scale = 0.78; opacity = 0.45; zIndex = 5;
        } else {
          // Snap off-screen to the nearest side so it's ready to slide in
          const diff = ((idx - active) % total + total) % total;
          const side = diff <= Math.floor(total / 2) ? 1 : -1;
          x = side * sideShift * 2.5; scale = 0.7; opacity = 0; zIndex = 0;
        }

        gsap.to(el, {
          x,
          scale,
          opacity,
          zIndex,
          duration: animate ? 0.75 : 0,
          ease: "power3.inOut",
          overwrite: true,
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [total]
  );

  /* ── Navigate to a specific index ── */
  const goTo = useCallback(
    (next: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      const idx = ((next % total) + total) % total;
      setActiveIndex(idx);
      applyLayout(idx, true);
      setTimeout(() => { isAnimating.current = false; }, 800);
    },
    [applyLayout, total]
  );

  /* ── Initial (instant) layout ── */
  useEffect(() => {
    applyLayout(0, false);
  }, [applyLayout]);

  /* ── Auto-advance timer ── */
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((cur) => {
        const next = (cur + 1) % total;
        applyLayout(next, true);
        return next;
      });
    }, AUTO_INTERVAL);
  }, [applyLayout, total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  /* ── Arrow helpers ── */
  const prev = () => { stopTimer(); goTo(activeIndex - 1); startTimer(); };
  const nextSlide = () => { stopTimer(); goTo(activeIndex + 1); startTimer(); };

  /* ── Touch/drag swipe ── */
  const dragStart = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => { dragStart.current = e.clientX; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) > 50) delta < 0 ? nextSlide() : prev();
  };

  return (
    <div
      ref={wrapperRef}
      className="relative select-none"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* ── Stage ── */}
      <div
        style={{
          position: "relative",
          height: "clamp(540px, 58vw, 630px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0" style={{
          width: "22%", zIndex: 20,
          background: "linear-gradient(90deg, #0d0a0d 0%, transparent 100%)",
        }} />
        <div className="pointer-events-none absolute inset-y-0 right-0" style={{
          width: "22%", zIndex: 20,
          background: "linear-gradient(270deg, #0d0a0d 0%, transparent 100%)",
        }} />

        {/* Cards — all absolutely stacked on the same centre point */}
        {testimonials.map((t, i) => (
          <div
            key={t.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              // translate centres each card — GSAP moves x from there
              transform: "translate(-50%, -50%)",
              willChange: "transform, opacity",
              cursor: getSlot(i, activeIndex) !== 0 ? "pointer" : "default",
            }}
            onClick={() => {
              const slot = getSlot(i, activeIndex);
              if (slot !== 0) { stopTimer(); goTo(i); startTimer(); }
            }}
          >
            <TestimonialCard data={t} isActive={i === activeIndex} />
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-center gap-5 mt-8">
        <button onClick={prev} className="tc-arrow-btn" aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-[10px]">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { stopTimer(); goTo(i); startTimer(); }}
              style={{
                width: i === activeIndex ? 22 : 6,
                height: 6,
                borderRadius: 99,
                background: i === activeIndex
                  ? "linear-gradient(90deg, #E75480, #D4AF37)"
                  : "rgba(212,175,185,0.2)",
                transition: "width 0.4s ease, background 0.4s ease",
                border: "none",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <button onClick={nextSlide} className="tc-arrow-btn" aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <style>{`
        .tc-arrow-btn {
          width: 46px; height: 46px; border-radius: 50%;
          background: rgba(253,246,240,0.04);
          border: 1px solid rgba(212,175,185,0.16);
          color: rgba(253,246,240,0.55);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s ease;
          backdrop-filter: blur(8px); flex-shrink: 0;
        }
        .tc-arrow-btn:hover {
          background: rgba(231,84,128,0.12);
          border-color: rgba(231,84,128,0.35);
          color: #E75480; transform: scale(1.08);
          box-shadow: 0 0 18px rgba(231,84,128,0.2);
        }
      `}</style>
    </div>
  );
}
