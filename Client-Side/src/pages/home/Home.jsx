import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { 
  FaTools, 
  FaSnowflake, 
  FaTint, 
  FaBolt, 
  FaShieldAlt, 
  FaStar, 
  FaCheck, 
  FaArrowRight, 
  FaPhone, 
  FaWhatsapp, 
  FaMapMarkerAlt,
  FaGooglePlay,
  FaApple,
  FaClock,
  FaUsers,
  FaAward,
  FaHeadset,
  FaLaptop,
  FaTv,
  FaFire,
  FaUserPlus,
  FaCalendarAlt
} from 'react-icons/fa';
import { GiTechnoHeart, GiWashingMachine, GiHeatHaze } from 'react-icons/gi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SigninModals from '../../components/Modals/SigninModals';
import RegisterBookingSection from '../../components/RegisterBookingSection';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const homeApplianceSectionRef = useRef(null);

  const categories = [
    {
      id: 'ac',
      icon: <FaSnowflake className="text-3xl" />,
      title: 'AC Service',
      description: 'Installation, Repair & Maintenance',
      color: 'bg-olympic',
      link: '/ac-servicing'
    },
    {
      id: 'refrigerator',
      icon: <FaTint className="text-3xl" />,
      title: 'Refrigerator Service',
      description: 'Repair & Maintenance',
      color: 'bg-olympic',
      link: '/refrigerator'
    },
    {
      id: 'washing',
      icon: <GiWashingMachine className="text-3xl" />,
      title: 'Washing Machine Service',
      description: 'Repair & Installation',
      color: 'bg-olympic',
      link: '/washing-machine'
    },
    {
      id: 'vrf',
      icon: <GiHeatHaze className="text-3xl" />,
      title: 'VRF/HVAC',
      description: 'Commercial HVAC Solutions',
      color: 'bg-olympic',
      link: '/vrf-hvac'
    },
    {
      id: 'home-appliance',
      icon: <FaTools className="text-3xl" />,
      title: 'Home Appliance Service',
      description: 'All Home Appliances Repair',
      color: 'bg-olympic',
      link: '#home-appliance-section'
    }
  ];

  const featuredServices = [
    {
      id: 1,
      category: 'ac',
      title: 'AC Service',
      price: '৳ 500',
      description: 'Professional AC servicing and maintenance',
      rating: 4.8,
      reviews: 1247,
      link: '/ac-servicing'
    },
    {
      id: 2,
      category: 'ac',
      title: 'AC Cooling Problem',
      price: '৳ 1,200',
      description: 'Fix all AC cooling related issues',
      rating: 4.7,
      reviews: 892,
      link: '/ac-cooling'
    },
    {
      id: 3,
      category: 'ac',
      title: 'AC Installation/Uninstallation',
      price: '৳ 2,500',
      description: 'Professional AC installation and removal',
      rating: 4.9,
      reviews: 723,
      link: '/ac-installation'
    },
    {
      id: 4,
      category: 'refrigerator',
      title: 'Refrigerator Repair',
      price: '৳ 800',
      description: 'Expert refrigerator repair service',
      rating: 4.6,
      reviews: 567,
      link: '/refrigerator'
    },
    {
      id: 5,
      category: 'washing',
      title: 'Washing Machine Repair',
      price: '৳ 700',
      description: 'Professional washing machine repair',
      rating: 4.5,
      reviews: 445,
      link: '/washing-machine'
    },
    {
      id: 6,
      category: 'vrf',
      title: 'VRF/HVAC Solution',
      price: 'Contact',
      description: 'Commercial HVAC system solutions',
      rating: 4.8,
      reviews: 234,
      link: '/vrf-hvac'
    },
    {
      id: 7,
      category: 'home-appliance',
      title: 'Oven Service',
      price: '৳ 600',
      description: 'Professional oven repair and maintenance',
      rating: 4.4,
      reviews: 189,
      link: '/oven-service'
    },
    {
      id: 8,
      category: 'home-appliance',
      title: 'Laptop/Desktop Service',
      price: '৳ 800',
      description: 'Computer repair and maintenance',
      rating: 4.7,
      reviews: 356,
      link: '/computer-service'
    },
    {
      id: 9,
      category: 'home-appliance',
      title: 'Electrical Service',
      price: '৳ 400',
      description: 'Home electrical solutions',
      rating: 4.6,
      reviews: 678,
      link: '/electrical-service'
    }
  ];

  const homeApplianceServices = [
    {
      icon: <FaFire className="text-2xl" />,
      title: 'Oven Service',
      description: 'Microwave & OTG repair',
      link: '/oven-service'
    },
    {
      icon: <FaLaptop className="text-2xl" />,
      title: 'Laptop/Desktop Service',
      description: 'Computer repair & maintenance',
      link: '/computer-service'
    },
    {
      icon: <FaBolt className="text-2xl" />,
      title: 'Electrical Service',
      description: 'Wiring & electrical solutions',
      link: '/electrical-service'
    },
    {
      icon: <FaTint className="text-2xl" />,
      title: 'Water Purifier Service',
      description: 'RO & water purifier repair',
      link: '/water-purifier-service'
    },
    {
      icon: <FaTv className="text-2xl" />,
      title: 'TV Service',
      description: 'LED & Smart TV repair',
      link: '/tv-service'
    },
    {
      icon: <GiHeatHaze className="text-2xl" />,
      title: 'Geyser Service',
      description: 'Water heater repair',
      link: '/geyser-service'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '100+', label: 'Expert Technicians' },
    { number: '15+', label: 'Cities Covered' },
    { number: '24/7', label: 'Service Available' }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Book Service',
      description: 'Choose your service and book online',
      icon: '📱'
    },
    {
      step: '2',
      title: 'Get Expert',
      description: 'Our certified technician visits you',
      icon: '👨‍🔧'
    },
    {
      step: '3',
      title: 'Quality Service',
      description: 'Get professional service at doorstep',
      icon: '⚡'
    },
    {
      step: '4',
      title: 'Enjoy Warranty',
      description: 'Relax with service warranty',
      icon: '🛡️'
    }
  ];

  const testimonials = [
    {
      name: 'Rahim Ahmed',
      location: 'Gulshan, Dhaka',
      rating: 5,
      comment: 'Excellent AC installation service. The technician was very professional and completed the work quickly.',
      service: 'AC Installation'
    },
    {
      name: 'Fatima Begum',
      location: 'Mirpur, Dhaka',
      rating: 5,
      comment: 'My refrigerator was not cooling. They fixed it perfectly with 90 days warranty. Highly recommended!',
      service: 'Refrigerator Repair'
    },
    {
      name: 'Sohel Rana',
      location: 'Uttara, Dhaka',
      rating: 4,
      comment: 'Good washing machine service. Reasonable price and quality work.',
      service: 'WM Repair'
    }
  ];

  // Handle category click
  const handleCategoryClick = (category) => {
    if (category.id === 'home-appliance') {
      // Scroll to home appliance section
      homeApplianceSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Navigate to other category pages
      window.location.href = category.link;
    }
  };

  const filteredServices = activeCategory === 'all' 
    ? featuredServices 
    : featuredServices.filter(service => service.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20 lg:py-32 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center justify-center mb-6 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-black">
              <FaStar className="mr-2 text-olympic" />
              Bangladesh's Most Trusted Home Service Platform
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-black">
              Home Services
              <br />
              <span className="text-olympic">
                At Your Doorstep
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl">
              Professional AC, refrigerator, washing machine repair and installation services by certified technicians
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-olympic text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                <FaPhone className="text-sm" />
                Call Now: 09638-787878
              </button>
              <button className="border-2 border-olympic text-olympic px-8 py-4 rounded-xl font-bold text-lg hover:bg-olympic hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                <FaWhatsapp className="text-sm" />
                Book via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-olympic mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Our <span className="text-olympic">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive home appliance services by certified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${category.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{category.title}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
            <div>
              <h2 className="text-4xl font-black text-black mb-4">
                Featured <span className="text-olympic">Services</span>
              </h2>
              <p className="text-xl text-gray-600">Most popular services booked by customers</p>
            </div>
            <div className="flex gap-2 mt-4 lg:mt-0 flex-wrap">
              <button
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                  activeCategory === 'all' 
                    ? 'bg-olympic text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                All Services
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                    activeCategory === category.id 
                      ? 'bg-olympic text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
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
                    <span className="bg-white text-olympic px-3 py-1 rounded-full text-sm font-semibold">
                      {service.price}
                    </span>
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

      {/* Home Appliance Services Section */}
      <section 
        ref={homeApplianceSectionRef}
        id="home-appliance-section"
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Home Appliance <span className="text-olympic">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete repair and maintenance for all your home appliances
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {homeApplianceServices.map((service, index) => (
              <a
                key={index}
                href={service.link}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer block"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-olympic/10 flex items-center justify-center text-olympic shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-sm font-bold text-black mb-2">{service.title}</h3>
                <p className="text-gray-600 text-xs">{service.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              How It <span className="text-olympic">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get professional home services in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-1/2"></div>
                )}
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 text-olympic rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  {step.icon}
                </div>
                <div className="w-10 h-10 bg-olympic text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 -mt-16 relative z-10">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-black mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Why Choose <span className="text-olympic">Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaShieldAlt className="text-3xl" />,
                title: 'Service Warranty',
                description: '90 days warranty on all services'
              },
              {
                icon: <FaClock className="text-3xl" />,
                title: 'Quick Service',
                description: 'Same day service available'
              },
              {
                icon: <FaUsers className="text-3xl" />,
                title: 'Expert Technicians',
                description: 'Certified and experienced professionals'
              },
              {
                icon: <FaAward className="text-3xl" />,
                title: 'Quality Guarantee',
                description: '100% satisfaction guarantee'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-olympic/10 flex items-center justify-center text-olympic shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              What Our <span className="text-olympic">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read genuine reviews from our satisfied customers
            </p>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={20}
            navigation={true}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 25
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30
              }
            }}
            className="testimonials-carousel"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-sm ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic text-sm">"{testimonial.comment}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-black text-sm">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs">{testimonial.location}</div>
                    <div className="text-olympic text-xs font-medium">{testimonial.service}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <style jsx>{`
            .testimonials-carousel {
              padding: 20px 10px;
            }
            .swiper-button-next,
            .swiper-button-prev {
              background: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              color: #0085C7;
              border: 1px solid #e5e5e5;
            }
            .swiper-button-next:after,
            .swiper-button-prev:after {
              font-size: 16px;
              font-weight: bold;
            }
            .swiper-pagination-bullet {
              background: #0085C7;
              opacity: 0.5;
            }
            .swiper-pagination-bullet-active {
              background: #0085C7;
              opacity: 1;
            }
          `}</style>
        </div>
      </section>

      {/* Register & Booking Section */}
      {/* <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black text-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Register now and book your service in just a few clicks
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-olympic text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3">
                <FaUserPlus className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs text-blue-100">GET STARTED</div>
                  <div className="text-lg">Register Now</div>
                </div>
              </button>
              <button className="bg-green-600 text-black px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-3">
                <FaCalendarAlt className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs text-green-100">BOOK SERVICE</div>
                  <div className="text-lg">Book a Service</div>
                </div>
              </button>
            </div>
            <p 
             onClick={() => document.getElementById("nav_modal").showModal()}
            className="text-gray-500 mt-6 text-sm">
              Already have an account? <a className="text-olympic font-semibold cursor-pointer">Login here</a>
            </p>
          </div>
        </div>
        <SigninModals />
      </section> */}
      <RegisterBookingSection/>
    </div>
  );
};

export default Home;