import React, { useState, useRef } from "react";
import {
  FaTools, FaSnowflake, FaTint, FaBolt, FaShieldAlt, FaStar,
  FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt,
  FaClock, FaUsers, FaAward, FaLaptop, FaTv, FaFire,
} from "react-icons/fa";
import { GiWashingMachine, GiHeatHaze } from "react-icons/gi";

// ✅ Universal Components
import HeroCarousel from "../../components/HeroCarousel";
import ReviewsCarousel from "../../components/ReviewsCarousel";
import RegisterBookingSection from "../../components/RegisterBookingSection";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const homeApplianceSectionRef = useRef(null);

  // ============================================================
  // 🎯 HERO SLIDES
  // ============================================================
  const heroSlides = [
    {
      id: 1,
      badge: "Bangladesh's Most Trusted Home Service Platform",
      title: "Home Services",
      highlight: "At Your Doorstep",
      subtitle:
        "Professional AC, refrigerator, washing machine repair and installation services by certified technicians",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80",
      ctaPrimary: "Call Now: 09638-787878",
      ctaSecondary: "Book via WhatsApp",
      primaryIcon: <FaPhone className="text-sm" />,
      secondaryIcon: <FaWhatsapp className="text-sm" />,
      onPrimaryClick: () => (window.location.href = "tel:09638787878"),
    },
    {
      id: 2,
      badge: "Certified & Verified Technicians",
      title: "Expert AC Repair",
      highlight: "Save Up To 40%",
      subtitle:
        "Get your AC serviced by certified technicians with 90 days service warranty",
      image:
        "https://images.unsplash.com/photo-1631545806609-35f9b25d02d5?w=1600&q=80",
      ctaPrimary: "Book AC Service",
      ctaSecondary: "Explore Services",
      primaryIcon: <FaSnowflake className="text-sm" />,
      secondaryIcon: <FaArrowRight className="text-sm" />,
    },
    {
      id: 3,
      badge: "Same Day Service Available",
      title: "Quick & Reliable",
      highlight: "Home Appliance Repair",
      subtitle:
        "Refrigerator, washing machine, oven, TV & more — all fixed at your doorstep",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
      ctaPrimary: "Book Now",
      ctaSecondary: "View All Services",
      primaryIcon: <FaTools className="text-sm" />,
      secondaryIcon: <FaArrowRight className="text-sm" />,
    },
  ];

  const categories = [
    { id: "ac", icon: <FaSnowflake className="text-3xl" />, title: "AC Service", description: "Installation, Repair & Maintenance", color: "bg-olympic", link: "/ac-servicing" },
    { id: "refrigerator", icon: <FaTint className="text-3xl" />, title: "Refrigerator Service", description: "Repair & Maintenance", color: "bg-olympic", link: "/refrigerator" },
    { id: "washing", icon: <GiWashingMachine className="text-3xl" />, title: "Washing Machine Service", description: "Repair & Installation", color: "bg-olympic", link: "/washing-machine" },
    { id: "vrf", icon: <GiHeatHaze className="text-3xl" />, title: "VRF/HVAC", description: "Commercial HVAC Solutions", color: "bg-olympic", link: "/vrf-hvac" },
    { id: "home-appliance", icon: <FaTools className="text-3xl" />, title: "Home Appliance Service", description: "All Home Appliances Repair", color: "bg-olympic", link: "#home-appliance-section" },
  ];

  const featuredServices = [
    { id: 1, category: "ac", title: "AC Service", price: "৳ 500", description: "Professional AC servicing and maintenance", rating: 4.8, reviews: 1247, link: "/ac-servicing" },
    { id: 2, category: "ac", title: "AC Cooling Problem", price: "৳ 1,200", description: "Fix all AC cooling related issues", rating: 4.7, reviews: 892, link: "/ac-cooling" },
    { id: 3, category: "ac", title: "AC Installation/Uninstallation", price: "৳ 2,500", description: "Professional AC installation and removal", rating: 4.9, reviews: 723, link: "/ac-installation" },
    { id: 4, category: "refrigerator", title: "Refrigerator Repair", price: "৳ 800", description: "Expert refrigerator repair service", rating: 4.6, reviews: 567, link: "/refrigerator" },
    { id: 5, category: "washing", title: "Washing Machine Repair", price: "৳ 700", description: "Professional washing machine repair", rating: 4.5, reviews: 445, link: "/washing-machine" },
    { id: 6, category: "vrf", title: "VRF/HVAC Solution", price: "Contact", description: "Commercial HVAC system solutions", rating: 4.8, reviews: 234, link: "/vrf-hvac" },
    { id: 7, category: "home-appliance", title: "Oven Service", price: "৳ 600", description: "Professional oven repair and maintenance", rating: 4.4, reviews: 189, link: "/oven-service" },
    { id: 8, category: "home-appliance", title: "Laptop/Desktop Service", price: "৳ 800", description: "Computer repair and maintenance", rating: 4.7, reviews: 356, link: "/computer-service" },
    { id: 9, category: "home-appliance", title: "Electrical Service", price: "৳ 400", description: "Home electrical solutions", rating: 4.6, reviews: 678, link: "/electrical-service" },
  ];

  const homeApplianceServices = [
    { icon: <FaFire className="text-2xl" />, title: "Oven Service", description: "Microwave & OTG repair", link: "/oven-service" },
    { icon: <FaLaptop className="text-2xl" />, title: "Laptop/Desktop Service", description: "Computer repair & maintenance", link: "/computer-service" },
    { icon: <FaBolt className="text-2xl" />, title: "Electrical Service", description: "Wiring & electrical solutions", link: "/electrical-service" },
    { icon: <FaTint className="text-2xl" />, title: "Water Purifier Service", description: "RO & water purifier repair", link: "/water-purifier-service" },
    { icon: <FaTv className="text-2xl" />, title: "TV Service", description: "LED & Smart TV repair", link: "/tv-service" },
    { icon: <GiHeatHaze className="text-2xl" />, title: "Geyser Service", description: "Water heater repair", link: "/geyser-service" },
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "100+", label: "Expert Technicians" },
    { number: "15+", label: "Cities Covered" },
    { number: "24/7", label: "Service Available" },
  ];

  const howItWorks = [
    { step: "1", title: "Book Service", description: "Choose your service and book online", icon: "📱" },
    { step: "2", title: "Get Expert", description: "Our certified technician visits you", icon: "👨‍🔧" },
    { step: "3", title: "Quality Service", description: "Get professional service at doorstep", icon: "⚡" },
    { step: "4", title: "Enjoy Warranty", description: "Relax with service warranty", icon: "🛡️" },
  ];

  const handleCategoryClick = (category) => {
    if (category.id === "home-appliance") {
      homeApplianceSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = category.link;
    }
  };

  const filteredServices =
    activeCategory === "all"
      ? featuredServices
      : featuredServices.filter((service) => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Universal Hero Carousel */}
      <HeroCarousel slides={heroSlides} />

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-olympic mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              Our <span className="text-olympic">Services</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive home appliance services by certified professionals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl ${category.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-xl sm:text-3xl">{category.icon}</div>
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-black mb-1 sm:mb-2">{category.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-12">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-2 sm:mb-4">
                Featured <span className="text-olympic">Services</span>
              </h2>
              <p className="text-base sm:text-xl text-gray-600">Most popular services booked by customers</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm ${activeCategory === "all" ? "bg-olympic text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm ${activeCategory === category.id ? "bg-olympic text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <a
                key={service.id}
                href={service.link}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group block"
              >
                <div className="h-40 bg-gradient-to-br from-olympic to-blue-700 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-olympic px-3 py-1 rounded-full text-sm font-semibold">{service.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-black">{service.title}</h3>
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="text-gray-600 font-semibold text-sm">{service.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{service.reviews} reviews</span>
                    <button className="bg-olympic text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm">
                      Book Now <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Home Appliance Services */}
      <section ref={homeApplianceSectionRef} id="home-appliance-section" className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              Home Appliance <span className="text-olympic">Services</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Complete repair and maintenance for all your home appliances
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {homeApplianceServices.map((service, index) => (
              <a
                key={index}
                href={service.link}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer block"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-2xl bg-olympic/10 flex items-center justify-center text-olympic shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-black mb-1 sm:mb-2">{service.title}</h3>
                <p className="text-gray-600 text-[10px] sm:text-xs">{service.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              How It <span className="text-olympic">Works</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Get professional home services in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 text-olympic rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                  {step.icon}
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-olympic text-white rounded-full flex items-center justify-center text-sm sm:text-lg font-bold mx-auto mb-3 sm:mb-4 -mt-12 sm:-mt-16 relative z-10">
                  {step.step}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-black mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black mb-3 sm:mb-4">
              Why Choose <span className="text-olympic">Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: <FaShieldAlt className="text-2xl sm:text-3xl" />, title: "Service Warranty", description: "90 days warranty on all services" },
              { icon: <FaClock className="text-2xl sm:text-3xl" />, title: "Quick Service", description: "Same day service available" },
              { icon: <FaUsers className="text-2xl sm:text-3xl" />, title: "Expert Technicians", description: "Certified and experienced professionals" },
              { icon: <FaAward className="text-2xl sm:text-3xl" />, title: "Quality Guarantee", description: "100% satisfaction guarantee" },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-olympic/10 flex items-center justify-center text-olympic shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-black mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Universal Reviews Carousel — API + Fallback */}
      <ReviewsCarousel endpoint="/reviews" limit={6} />

      <RegisterBookingSection />
    </div>
  );
};

export default Home;