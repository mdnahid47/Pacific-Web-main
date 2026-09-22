import { useState, useEffect } from "react";
import api from "../api";

/**
 * Fetch hero banners for a category
 * Falls back to default slides if API fails
 */
const useHeroBanners = (category, defaultSlides = []) => {
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/hero/${category}`);

        if (res.data.success && res.data.banners?.length > 0) {
          // Backend data ব্যবহার করি
          const formatted = res.data.banners.map((b) => ({
            id: b.id,
            badge: b.badge,
            title: b.title,
            highlight: b.highlight,
            subtitle: b.subtitle,
            image: b.image,
            ctaPrimary: b.ctaPrimary,
            ctaSecondary: b.ctaSecondary,
            onPrimaryClick: b.ctaPrimaryLink
              ? () => {
                  if (b.ctaPrimaryLink.startsWith("tel:")) {
                    window.location.href = b.ctaPrimaryLink;
                  } else if (b.ctaPrimaryLink.startsWith("http")) {
                    window.open(b.ctaPrimaryLink, "_blank");
                  } else {
                    window.location.href = b.ctaPrimaryLink;
                  }
                }
              : undefined,
            onSecondaryClick: b.ctaSecondaryLink
              ? () => {
                  if (b.ctaSecondaryLink.startsWith("http")) {
                    window.open(b.ctaSecondaryLink, "_blank");
                  } else {
                    window.location.href = b.ctaSecondaryLink;
                  }
                }
              : undefined,
          }));

          setSlides(formatted);
        } else {
          // Fallback to defaults
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.warn("Hero fetch failed, using defaults:", error.message);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchHero();
    }
  }, [category]);

  return { slides, loading };
};

export default useHeroBanners;