import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // যদি hash থাকে (e.g., #home-appliance-section), সেই section এ scroll
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        // Delay যাতে page render হয়ে যায়
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        return;
      }
    }

    // Normal route change → top এ scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;