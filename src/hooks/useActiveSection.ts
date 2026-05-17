// src/hooks/useActiveSection.ts
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "../config/navigationConfig.ts";
import type { NavId } from "../config/navigationConfig.ts";

/**
 * Tracks which section is currently active in the viewport.
 *
 * WHY NOT IntersectionObserver with rootMargin:
 * A fixed rootMargin band (e.g. "-20% 0px -60% 0px") works fine for
 * equal-height sections but breaks when sections have very different heights
 * (pinned scroll sections, tall galleries, etc.). The next section never
 * crosses the threshold band before the user scrolls past it entirely,
 * causing the active indicator to freeze on the previous item.
 *
 * FIX: On every scroll tick, measure each section's top edge relative to
 * the viewport. The active section is the last one whose top edge is at or
 * above a trigger line (35% down from the top of the viewport). This is
 * robust regardless of section height.
 */
export function useActiveSection(): NavId {
  const [active, setActive] = useState<NavId>("home");
  // Track the last active id to avoid redundant setState calls
  const activeRef = useRef<NavId>("home");

  useEffect(() => {
    // Trigger line: 35% from the top of the viewport.
    // A section becomes "active" once its top edge has passed this line.
    const TRIGGER_RATIO = 0.35;

    const calculate = () => {
      const triggerY = window.innerHeight * TRIGGER_RATIO;
      let current: NavId = "home";

      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // Once the section's top has crossed the trigger line, it's a candidate.
        // We keep overwriting so the LAST qualifying section wins —
        // i.e. the one furthest down that has already entered the trigger zone.
        if (top <= triggerY) {
          current = id as NavId;
        }
      }

      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }
    };

    // Run once immediately so the initial state is correct without a scroll
    calculate();

    window.addEventListener("scroll", calculate, { passive: true });
    // Also recalculate on resize (viewport height changes the trigger line)
    window.addEventListener("resize", calculate, { passive: true });

    return () => {
      window.removeEventListener("scroll", calculate);
      window.removeEventListener("resize", calculate);
    };
  }, []);

  return active;
}

/**
 * Returns a value 0–1 representing how far the page has been scrolled.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
