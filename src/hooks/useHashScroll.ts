import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useHashScroll = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small delay to ensure the DOM is ready
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else if (pathname === "/") {
      // Scroll to top when navigating to home without hash
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);
};
