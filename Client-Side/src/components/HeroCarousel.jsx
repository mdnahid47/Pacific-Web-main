import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/**
 * Universal Hero Carousel
 * 
 * @param {Array} slides - Array of slide objects:
 *   {
 *     id: number,
 *     badge: string,
 *     title: string,
 *     highlight: string,
 *     subtitle: string,
 *     image: string (URL),
 *     ctaPrimary: string,
 *     ctaSecondary: string,
 *     primaryIcon: JSX element,
 *     secondaryIcon: JSX element,
 *     onPrimaryClick: function (optional),
 *     onSecondaryClick: function (optional),
 *   }
 * @param {boolean} autoplay - Enable autoplay (default: true)
 * @param {number} autoplayDelay - Delay in ms (default: 5500)
 * @param {string} height - Tailwind height class (default: responsive)
 */
const HeroCarousel = ({
  slides = [],
  autoplay = true,
  autoplayDelay = 5500,
  height = "h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px]",
}) => {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative hero-carousel-section">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        slidesPerView={1}
        spaceBetween={0}
        loop={slides.length > 1}
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        className="hero-carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className={`relative w-full ${height} overflow-hidden`}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-3xl">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-flex items-center justify-center mb-5 sm:mb-6 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white">
                        <FaStar className="mr-2 text-yellow-400" />
                        {slide.badge}
                      </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight text-white">
                      {slide.title}
                      {slide.highlight && (
                        <>
                          <br />
                          <span className="text-olympic">
                            {slide.highlight}
                          </span>
                        </>
                      )}
                    </h1>

                    {/* Subtitle */}
                    {slide.subtitle && (
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-100 max-w-2xl leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}

                    {/* CTAs */}
                    {(slide.ctaPrimary || slide.ctaSecondary) && (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {slide.ctaPrimary && (
                          <button
                            onClick={slide.onPrimaryClick}
                            className="bg-olympic text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                          >
                            {slide.primaryIcon}
                            {slide.ctaPrimary}
                          </button>
                        )}
                        {slide.ctaSecondary && (
                          <button
                            onClick={slide.onSecondaryClick}
                            className="border-2 border-white/80 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm bg-white/5"
                          >
                            {slide.secondaryIcon}
                            {slide.ctaSecondary}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      {slides.length > 1 && (
        <>
          <button className="hero-prev absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-olympic shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
            <FaChevronLeft className="text-sm sm:text-base" />
          </button>
          <button className="hero-next absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-olympic shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
            <FaChevronRight className="text-sm sm:text-base" />
          </button>
        </>
      )}

      {/* Custom Styles */}
      <style>{`
        .hero-carousel .swiper-pagination {
          bottom: 20px !important;
        }
        .hero-carousel .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .hero-carousel .swiper-pagination-bullet-active {
          background: #3c8ce7;
          width: 30px;
          border-radius: 5px;
        }
        @media (max-width: 640px) {
          .hero-carousel .hero-prev,
          .hero-carousel .hero-next {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;