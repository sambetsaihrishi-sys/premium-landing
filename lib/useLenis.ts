"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Exponential ease-out, clamped to 1 — the same curve used for the
// smoothed frame playhead, applied here to the scroll momentum itself.
const easeOutExpo = (t: number) => (t === 1 ? 1 : Math.min(1, 1.001 - Math.pow(2, -10 * t)));

/**
 * Boots Lenis, drives it from a single GSAP ticker rAF loop, and keeps
 * ScrollTrigger in sync with Lenis's virtual scroll position. Returns
 * nothing — consumers read scroll state via ScrollTrigger / getBoundingClientRect.
 *
 * When `disabled` is true (prefers-reduced-motion, or small viewport),
 * Lenis is never instantiated and native scrolling is left untouched.
 */
export function useLenis(disabled: boolean) {
  useEffect(() => {
    if (disabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 1.6,
      easing: easeOutExpo,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Single requestAnimationFrame loop: GSAP's ticker drives Lenis,
    // and Lenis in turn drives ScrollTrigger via the "scroll" event above.
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [disabled]);
}
