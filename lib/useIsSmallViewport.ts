"use client";

import { useEffect, useState } from "react";

const BREAKPOINT = 768;

export function useIsSmallViewport(): boolean {
  const [isSmall, setIsSmall] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${BREAKPOINT}px)`
    );

    const checkViewport = () => {
      setIsSmall(mediaQuery.matches);
    };

    checkViewport();
    mediaQuery.addEventListener("change", checkViewport);

    return () => {
      mediaQuery.removeEventListener("change", checkViewport);
    };
  }, []);

  return isSmall;
}