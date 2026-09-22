import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";
import api from "../api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 🎯 Mock data — backend fail হলে এটা use হবে
const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Rahim Ahmed",
    location: "Gulshan, Dhaka",
    rating: 5,
    comment:
      "Excellent AC installation service. The technician was very professional and completed the work quickly.",
    service: "AC Installation",
  },
  {
    id: 2,
    name: "Fatima Begum",
    location: "Mirpur, Dhaka",
    rating: 5,
    comment:
      "My refrigerator was not cooling. They fixed it perfectly with 90 days warranty. Highly recommended!",
    service: "Refrigerator Repair",
  },
  {
    id: 3,
    name: "Sohel Rana",
    location: "Uttara, Dhaka",
    rating: 4,
    comment:
      "Good washing machine service. Reasonable price and quality work.",
    service: "WM Repair",
  },
  {
    id: 4,
    name: "Nadia Islam",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    comment:
      "Fast, professional and affordable. My AC was fixed within 1 hour.",
    service: "AC Repair",
  },
  {
    id: 5,
    name: "Kamal Hossain",
    location: "Banani, Dhaka",
    rating: 5,
    comment:
      "Very satisfied with their service. Technician was polite and cleaned up after finishing.",
    service: "Refrigerator Repair",
  },
  {
    id: 6,
    name: "Sadia Khan",
    location: "Bashundhara, Dhaka",
    rating: 5,
    comment:
      "Booked washing machine repair — came on time, fixed quickly. Great experience!",
    service: "WM Repair",
  },
];

/**
 * Universal Reviews Carousel
 * 
 * @param {string} endpoint - API endpoint (default: "/reviews")
 * @param {number} limit - Max reviews to fetch (default: 6)
 * @param {string} title - Section title (default: "What Our Customers Say")
 * @param {string} subtitle - Section subtitle
 * @param {boolean} showService - Show service name in card
 */
const ReviewsCarousel = ({
  endpoint = "/reviews",
  limit = 6,
  title = "What Our",
  highlight = "Customers Say",
  subtitle = "Read genuine reviews from our satisfied customers",
  showService = true,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.get(endpoint, { params: { limit } });

        // Different backend response formats handle
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data?.success && Array.isArray(res.data.reviews)) {
          data = res.data.reviews;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        } else if (res.data?.success && Array.isArray(res.data.data)) {
          data = res.data.data;
        }

        if (data.length > 0) {
          setReviews(data.slice(0, limit));
          setUsingMock(false);
        } else {
          // Empty response → mock data
          setReviews(MOCK_REVIEWS.slice(0, limit));
          setUsingMock(true);
        }
      } catch (error) {
        console.warn("Reviews fetch failed, using mock data:", error.message);
        setReviews(MOCK_REVIEWS.slice(0, limit));
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [endpoint, limit]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              {title} <span className="text-olympic">{highlight}</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
            {title} <span className="text-olympic">{highlight}</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="relative reviews-wrapper">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={16}
            loop={reviews.length > 3}
            navigation={{
              nextEl: ".reviews-next",
              prevEl: ".reviews-prev",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            className="reviews-carousel"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={review.id || index} className="h-auto">
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-200 h-full flex flex-col relative">
                  {/* Quote Icon */}
                  <FaQuoteLeft className="absolute top-4 right-4 text-olympic/10 text-4xl" />

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < (review.rating || 5)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 italic text-sm leading-relaxed flex-grow relative z-10">
                    "{review.comment}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-black text-sm">
                      {review.name}
                    </div>
                    {review.location && (
                      <div className="text-gray-600 text-xs">
                        {review.location}
                      </div>
                    )}
                    {showService && review.service && (
                      <div className="text-olympic text-xs font-medium mt-1">
                        {review.service}
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {reviews.length > 3 && (
            <>
              <button className="reviews-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-olympic hover:text-white text-olympic shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 -translate-x-1/2">
                <FaChevronLeft className="text-sm" />
              </button>
              <button className="reviews-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-olympic hover:text-white text-olympic shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 translate-x-1/2">
                <FaChevronRight className="text-sm" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .reviews-carousel {
          padding: 20px 5px 60px;
        }
        .reviews-carousel .swiper-pagination-bullet {
          background: #3c8ce7;
          opacity: 0.3;
          width: 8px;
          height: 8px;
        }
        .reviews-carousel .swiper-pagination-bullet-active {
          background: #3c8ce7;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        .reviews-carousel .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default ReviewsCarousel;