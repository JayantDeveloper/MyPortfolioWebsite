import { useEffect, useState } from "react";

const COMPACT_BREAKPOINT = 480;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

function getViewportState() {
  if (typeof window === "undefined") {
    return {
      width: 1280,
      isCompact: false,
      isMobile: false,
      isTablet: false,
    };
  }

  const width = window.innerWidth;

  return {
    width,
    isCompact: width <= COMPACT_BREAKPOINT,
    isMobile: width <= MOBILE_BREAKPOINT,
    isTablet: width <= TABLET_BREAKPOINT,
  };
}

export default function useResponsive() {
  const [viewport, setViewport] = useState(getViewportState);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportState());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}
