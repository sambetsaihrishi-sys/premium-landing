"use client";

import { useEffect, useState } from "react";

const BREAKPOINT = 768;

/**
 * True for viewports <= 768px. Used to gate the heavy image-sequence
 * experience off small screens in favor of a single static frame.
 */
export function useIsSmallViewport(): boolean {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth <= BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isSmall;
}
