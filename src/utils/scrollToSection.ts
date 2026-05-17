// src/utils/scrollToSection.ts
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

/**
 * Cinematically smooth scroll to a section by its id.
 *
 * ⚠️  CSS `scroll-behavior: smooth` on <html>/<body> MUST be removed.
 *     It fights GSAP ScrollToPlugin and causes a shake at animation start.
 *     This function temporarily forces `scroll-behavior: auto` before GSAP
 *     takes control, then restores it on completion.
 *
 * @param id        – DOM element id (without #)
 * @param navOffset – px to subtract for the fixed navbar (default 76)
 */
export function scrollToSection(id: string, navOffset = 76): void {
  const el = document.getElementById(id);
  if (!el) return;

  // Step 1 — strip CSS smooth scroll so it cannot intercept GSAP's writes
  document.documentElement.style.scrollBehavior = "auto";
  document.body.style.scrollBehavior = "auto";

  // Step 2 — snapshot target position AFTER disabling smooth-scroll
  const targetY =
    el.getBoundingClientRect().top + window.scrollY - navOffset;

  // Step 3 — GSAP owns the scroll from here
  gsap.to(window, {
    scrollTo: { y: targetY, autoKill: true },
    duration: 1.2,
    ease: "power3.inOut",          // power3 feels silkier than power4 at the start
    onComplete: () => {
      // Restore so anchor links / hash navigation still work normally
      document.documentElement.style.scrollBehavior = "";
      document.body.style.scrollBehavior = "";
    },
  });
}

/**
 * Instant scroll (no animation) — used after the mobile menu closes.
 */
export function scrollToSectionImmediate(id: string, navOffset = 76): void {
  const el = document.getElementById(id);
  if (!el) return;
  const targetY =
    el.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: targetY });
}
