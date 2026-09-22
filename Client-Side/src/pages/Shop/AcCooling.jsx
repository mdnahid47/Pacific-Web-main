import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  FaTools, FaClock, FaShieldAlt, FaStar, FaPhone,
  FaWhatsapp, FaMapMarkerAlt,
} from "react-icons/fa";
import { GiTechnoHeart } from "react-icons/gi";

import HeroCarousel from "../../components/HeroCarousel";
import UniversalModal from "../../components/Modals/UniversalModal";
import useHeroBanners from "../../hooks/useHeroBanners";
import api from "../../api";

// Local assets (fallback)
import cardImage from "../../assets/ac.png";
import Compressore from "../../assets/compressor.jpg";
import Capcitor from "../../assets/ac.png";
import Leack from "../../assets/Leack.jpeg";
import pcb from "../../assets/pcb-board.jpg";
import gasCharge from "../../assets/refrigerant.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const AcCooling = () => {
  const CATEGORY = "ac-cooling";

  // 🎯 Fallback services (backend না থাকলে)
  const defaultServices = [
    { id: 1, image: cardImage, title: "AC Check Up", price: "৳ 500", priceDisplay: "৳ 500", ton: "1-5 Ton", modalId: "my_modal_9" },
    { id: 2, image: gasCharge, title: "AC Gas Charge", price: "৳ 3500", priceDisplay: "৳ 3500", ton: "1-5 Ton", modalId: "my_modal_2" },
    { id: 3, image: Leack, title: "AC Leak Repair", price: "৳ 1500", priceDisplay: "৳ 1500", ton: "1-5 Ton", modalId: "my_modal_3" },
    { id: 4, image: pcb, title: "AC Circuit Repair", price: "৳ 2000", priceDisplay: "৳ 2000", ton: "1-5 Ton", modalId: "my_modal_4" },
    { id: 5, image: Capcitor, title: "AC Capacitor Replace", price: "৳ 1000", priceDisplay: "৳ 1000", ton: "1-5 Ton", modalId: "my_modal_5" },
    { id: 6, image: Compressore, title: "AC Compressor Fitting", price: "৳ 1000", priceDisplay: "৳ 1000", ton: "1-5 Ton", modalId: "my_modal_6" },
  ];

  // 🎯 Fallback hero slides
  const defaultHeroSlides = [
    {
      id: 1,
      badge: "Professional AC Cooling Service",
      title: "Expert AC Cooling",
      highlight: "Repair & Service",
      subtitle: "Get your AC cooling fixed by certified technicians with 90 days service warranty",
      image: "https://images.unsplash.com/photo-1631545806609-35f9b25d02d5?w=1600&q=80",
      ctaPrimary: "Call Now: 09638-787878",
      ctaSecondary: "WhatsApp Service",
      primaryIcon: <FaPhone className="text-sm" />,
      secondaryIcon: <FaWhatsapp className="text-sm" />,
      onPrimaryClick: () => (window.location.href = "tel:09638787878"),
      onSecondaryClick: () => window.open("https://wa.me/8809638787878", "_blank"),
    },
    {
      id: 2,
      badge: "Same Day Service Available",
      title: "AC Not Cooling?",
      highlight: "We Fix It Fast",
      subtitle: "Same day AC repair with 90 days service warranty",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
      ctaPrimary: "Book Now",
      ctaSecondary: "View Services",
      primaryIcon: <FaTools className="text-sm" />,
      secondaryIcon: <FaStar className="text-sm" />,
      onPrimaryClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
      onSecondaryClick: () => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
    },
  ];

  // 🎯 Hooks — backend থেকে data আনব, fail হলে default
  const { slides: heroSlides } = useHeroBanners(CATEGORY, defaultHeroSlides);

  const [services, setServices] = useState(defaultServices);
  const [servicesLoading, setServicesLoading] = useState(true);

  // 🎯 Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      setServicesLoading(true);
      try {
        const res = await api.get(`/services/${CATEGORY}`);

        // Different response formats handle
        let data = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (res.data?.success && Array.isArray(res.data.services)) data = res.data.services;
        else if (res.data?.services && Array.isArray(res.data.services)) data = res.data.services;

        if (data.length > 0) {
          // Backend data কে frontend format এ convert করি
          const formatted = data.map((s, i) => ({
            id: s.id || i + 1,
            image: s.image || defaultServices[i % defaultServices.length].image,
            title: s.title || s.name,
            price: s.price_display || s.price_display || `৳ ${s.price}`,
            priceDisplay: s.price_display || `৳ ${s.price}`,
            ton: s.ton || "1-5 Ton",
            modalId: `my_modal_${s.id || i + 1}`,
          }));

          setServices(formatted);
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        console.warn("Services fetch failed, using defaults:", error.message);
        setServices(defaultServices);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Static data (admin control লাগবে না)
  const warrantyPolicy = [
    { icon: <FaShieldAlt className="text-3xl" />, title: "90 Days Service Warranty", description: "All our AC repairs come with 90 days service warranty" },
    { icon: <FaTools className="text-3xl" />, title: "1 Year Parts Warranty", description: "Genuine AC parts with 1 year replacement warranty" },
    { icon: <FaClock className="text-3xl" />, title: "Free Revisit", description: "Free service revisit if cooling issue persists within warranty" },
    { icon: <GiTechnoHeart className="text-3xl" />, title: "Quality Guarantee", description: "We guarantee optimal cooling performance after service" },
  ];

  const problems = [
    "AC not cooling properly",
    "Weak airflow from vents",
    "AC gas leakage issues",
    "Compressor not working",
    "Water leakage problems",
    "Strange noises from AC",
    "AC tripping circuit",
    "Remote control issues",
  ];

  const brands = ["Gree", "General", "Midea", "Samsung", "LG", "Daikin", "Hitachi", "Carrier"];

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================================
          🎯 HERO CAROUSEL — Backend থেকে data (fallback with defaults)
          ============================================================ */}
      <HeroCarousel slides={heroSlides} />

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">15,000+</div>
              <div className="text-gray-700">AC Units Serviced</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">97%</div>
              <div className="text-gray-700">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">60+</div>
              <div className="text-gray-700">Expert Technicians</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">24/7</div>
              <div className="text-gray-700">Emergency Service</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          🎯 SERVICES CAROUSEL — Backend থেকে data
          ============================================================ */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Our AC Cooling <span className="text-olympic">Services</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Professional AC repair and maintenance services for optimal cooling performance
            </p>
          </div>

          {servicesLoading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-5 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={20}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
              }}
              className="services-carousel"
            >
              {services.map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group h-full">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => { e.target.src = cardImage; }}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-black mb-2">{service.title}</h3>
                      <p className="text-gray-700 mb-1">{service.ton}</p>
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <span className="text-2xl font-bold text-black">{service.price}</span>
                        <button
                          className="bg-olympic text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm hover:bg-blue-700"
                          onClick={() => {
                            const modal = document.getElementById(service.modalId);
                            if (modal) modal.showModal();
                          }}
                        >
                          See Details
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <style>{`
            .services-carousel {
              padding: 20px 10px 60px;
            }
            .services-carousel .swiper-button-next,
            .services-carousel .swiper-button-prev {
              background: white;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              color: #3c8ce7;
              border: 1px solid #e5e5e5;
            }
            .services-carousel .swiper-button-next:after,
            .services-carousel .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            .services-carousel .swiper-pagination-bullet {
              background: #3c8ce7;
              opacity: 0.5;
            }
            .services-carousel .swiper-pagination-bullet-active {
              background: #3c8ce7;
              opacity: 1;
            }
          `}</style>
        </div>
      </section>

      {/* Warranty Policy */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Our <span className="text-olympic">Warranty Policy</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              We stand behind our AC cooling services with comprehensive warranty coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {warrantyPolicy.map((item, index) => (
              <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-olympic flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems & Brands */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black text-black mb-8">
                Common AC Cooling <span className="text-olympic">Problems</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {problems.map((problem, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-gray-200">
                    <FaTools className="text-olympic mr-3 flex-shrink-0" />
                    <span className="text-gray-800">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-black mb-8">
                Brands We <span className="text-olympic">Service</span>
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {brands.map((brand, index) => (
                  <div key={index} className="bg-white border border-gray-300 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:border-olympic">
                    <div className="text-lg font-semibold text-black">{brand}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6 text-black">
            Need Immediate AC Cooling Service?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Don't suffer in the heat! Get professional AC cooling service with warranty today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-olympic text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <FaPhone className="text-sm" />
              Call for Service
            </button>
            <button className="bg-transparent border-2 border-olympic text-olympic px-8 py-4 rounded-xl font-bold text-lg hover:bg-olympic hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
              <FaWhatsapp className="text-sm" />
              Message on WhatsApp
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-sm" />
            <span>Service available in Dhaka, Chittagong, Sylhet & all major cities</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Frequently Asked <span className="text-olympic">Questions</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { question: "How long does AC cooling repair take?", answer: "Most AC cooling repairs are completed within 2-3 hours." },
              { question: "Do you provide service warranty for AC cooling?", answer: "Yes, 90 days service warranty on all repairs, 1 year on parts." },
              { question: "What areas do you serve for AC service?", answer: "Dhaka, Chittagong, Sylhet, and surrounding areas." },
              { question: "Do you charge for AC diagnosis?", answer: "Free if you proceed with the repair. Otherwise ৳200." },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          🎯 MODALS — Dynamic from services
          ============================================================ */}
      {services.map((service) => (
        <dialog key={service.id} id={service.modalId} className="modal">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-black">{service.title}</h3>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>
            <UniversalModal category={service.title} />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn bg-olympic hover:bg-blue-700 text-white">Close</button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      ))}
    </div>
  );
};

export default AcCooling;