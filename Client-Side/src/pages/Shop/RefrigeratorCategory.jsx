// import React, { useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import { FaTools, FaClock, FaShieldAlt, FaStar, FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
// import { GiTechnoHeart } from 'react-icons/gi';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// const RefrigeratorCategory = () => {
//   const [activeTab, setActiveTab] = useState('overview');

//   const services = [
//     {
//       id: 1,
//       image: "https://images.unsplash.com/photo-1584568695804-9a37bc21e4c9?w=400",
//       title: "Refrigerator Check Up",
//       price: "৳ 500",
//       capacity: "All Types"
//     },
//     {
//       id: 2,
//       image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
//       title: "Refrigerator Gas Charge",
//       price: "৳ 2500",
//       capacity: "All Types"
//     },
//     {
//       id: 3,
//       image: "https://images.unsplash.com/photo-1600431521340-491eca880813?w=400",
//       title: "Refrigerator Leak Repair",
//       price: "৳ 1200",
//       capacity: "All Types"
//     },
//     {
//       id: 4,
//       image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400",
//       title: "Refrigerator Circuit Repair",
//       price: "৳ 1800",
//       capacity: "All Types"
//     },
//     {
//       id: 5,
//       image: "https://images.unsplash.com/photo-1584568695804-9a37bc21e4c9?w=400",
//       title: "Thermostat Replace",
//       price: "৳ 800",
//       capacity: "All Types"
//     },
//     {
//       id: 6,
//       image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
//       title: "Compressor Fitting",
//       price: "৳ 1500",
//       capacity: "All Types"
//     }
//   ];

//   const warrantyPolicy = [
//     {
//       icon: <FaShieldAlt className="text-3xl" />,
//       title: "90 Days Service Warranty",
//       description: "All our repairs come with 90 days service warranty"
//     },
//     {
//       icon: <FaTools className="text-3xl" />,
//       title: "1 Year Parts Warranty",
//       description: "Genuine parts with 1 year replacement warranty"
//     },
//     {
//       icon: <FaClock className="text-3xl" />,
//       title: "Free Revisit",
//       description: "Free service revisit if issue persists within warranty period"
//     },
//     {
//       icon: <GiTechnoHeart className="text-3xl" />,
//       title: "Quality Guarantee",
//       description: "We guarantee the quality of our workmanship and parts"
//     }
//   ];

//   const problems = [
//     "Refrigerator not cooling",
//     "Water leakage",
//     "Strange noises",
//     "Ice maker not working",
//     "Compressor issues",
//     "Temperature problems",
//     "Freezer not freezing",
//     "Display panel errors"
//   ];

//   const brands = ["Samsung", "LG", "Whirlpool", "Vision", "Walton", "Sharp", "Hisense", "Marcel"];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="relative container mx-auto px-4 text-center">
//           <div className="inline-flex items-center justify-center mb-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
//             <FaStar className="mr-2" />
//             Professional Refrigerator Service
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
//             Expert Refrigerator <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
//               Repair & Service
//             </span>
//           </h1>
//           <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
//             Get your refrigerator fixed by certified technicians with 90 days service warranty
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
//               <FaPhone className="text-sm" />
//               Call Now: 09638-787878
//             </button>
//             <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
//               <FaWhatsapp className="text-sm" />
//               WhatsApp Service
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-12 bg-white border-b border-gray-100">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             <div>
//               <div className="text-3xl font-bold text-olympic mb-2">10,000+</div>
//               <div className="text-gray-600">Refrigerators Serviced</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-olympic mb-2">98%</div>
//               <div className="text-gray-600">Success Rate</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-olympic mb-2">50+</div>
//               <div className="text-gray-600">Expert Technicians</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-olympic mb-2">24/7</div>
//               <div className="text-gray-600">Service Available</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Carousel Section */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-black text-gray-900 mb-4">
//               Our <span className="text-olympic">Services</span>
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Professional refrigerator repair and maintenance services
//             </p>
//           </div>

//           <div className="mb-16">
//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]}
//               slidesPerView={1}
//               spaceBetween={20}
//               navigation={{
//                 nextEl: '.custom-next',
//                 prevEl: '.custom-prev',
//               }}
//               pagination={{
//                 clickable: true,
//                 el: '.custom-pagination',
//               }}
//               autoplay={{
//                 delay: 4000,
//                 disableOnInteraction: false,
//               }}
//               breakpoints={{
//                 640: {
//                   slidesPerView: 2,
//                   spaceBetween: 20
//                 },
//                 768: {
//                   slidesPerView: 3,
//                   spaceBetween: 25
//                 },
//                 1024: {
//                   slidesPerView: 4,
//                   spaceBetween: 30
//                 }
//               }}
//               className="pb-12"
//             >
//               {services.map((service) => (
//                 <SwiperSlide key={service.id}>
//                   <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full mx-2">
//                     <div className="h-48 overflow-hidden">
//                       <img 
//                         src={service.image} 
//                         alt={service.title} 
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     </div>
//                     <div className="p-6 flex flex-col flex-grow">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
//                       <p className="text-gray-600 mb-1">{service.capacity}</p>
//                       <div className="flex items-center justify-between mt-auto pt-4">
//                         <span className="text-2xl font-bold text-green-600">{service.price}</span>
//                         <button className="bg-olympic text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm hover:bg-blue-700">
//                           See Details
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </SwiperSlide>
//               ))}
//             </Swiper>

//             {/* Custom Navigation */}
//             <div className="flex items-center justify-center gap-4 mt-8">
//               <button className="custom-prev w-12 h-12 rounded-full bg-olympic text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
              
//               <div className="custom-pagination flex gap-2"></div>
              
//               <button className="custom-next w-12 h-12 rounded-full bg-olympic text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 flex items-center justify-center">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Warranty Policy Section (Replaces Features Section) */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-black text-gray-900 mb-4">
//               Our <span className="text-olympic">Warranty Policy</span>
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               We stand behind our work with comprehensive warranty coverage
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {warrantyPolicy.map((item, index) => (
//               <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
//                 <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-olympic flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
//                   {item.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
//                 <p className="text-gray-600">{item.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Problems & Brands Section */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//             {/* Common Problems */}
//             <div>
//               <h2 className="text-3xl font-black text-gray-900 mb-8">
//                 Common Refrigerator <span className="text-olympic">Problems</span>
//               </h2>
//               <div className="grid grid-cols-2 gap-4">
//                 {problems.map((problem, index) => (
//                   <div key={index} className="flex items-center bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-gray-100">
//                     <FaTools className="text-olympic mr-3 flex-shrink-0" />
//                     <span className="text-gray-700">{problem}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Supported Brands */}
//             <div>
//               <h2 className="text-3xl font-black text-gray-900 mb-8">
//                 Brands We <span className="text-olympic">Service</span>
//               </h2>
//               <div className="grid grid-cols-4 gap-4">
//                 {brands.map((brand, index) => (
//                   <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:border-blue-300">
//                     <div className="text-lg font-semibold text-gray-800">{brand}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-olympic text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-4xl font-black mb-6">
//             Ready to Fix Your Refrigerator?
//           </h2>
//           <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
//             Don't let refrigerator problems spoil your food. Get professional service with warranty today!
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
//               <FaPhone className="text-sm" />
//               Call for Service
//             </button>
//             <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
//               <FaWhatsapp className="text-sm" />
//               Message on WhatsApp
//             </button>
//           </div>
//           <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
//             <FaMapMarkerAlt className="text-sm" />
//             <span>Service available in Dhaka, Chittagong, Sylhet & all major cities</span>
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-black text-gray-900 mb-4">
//               Frequently Asked <span className="text-olympic">Questions</span>
//             </h2>
//           </div>
          
//           <div className="max-w-4xl mx-auto space-y-6">
//             {[
//               {
//                 question: "How long does refrigerator repair take?",
//                 answer: "Most repairs are completed within 2-3 hours. Complex issues might require additional time."
//               },
//               {
//                 question: "Do you provide service warranty?",
//                 answer: "Yes, we provide 90 days service warranty on all repairs and 1 year warranty on replaced parts."
//               },
//               {
//                 question: "What areas do you serve?",
//                 answer: "We serve all major cities including Dhaka, Chittagong, Sylhet, and surrounding areas."
//               },
//               {
//                 question: "Do you charge for diagnosis?",
//                 answer: "Diagnosis is completely free if you proceed with the repair. Otherwise, a minimal diagnosis fee applies."
//               }
//             ].map((faq, index) => (
//               <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//                 <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
//                 <p className="text-gray-600">{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Custom Styles */}
//       <style jsx>{`
//         .custom-pagination .swiper-pagination-bullet {
//           width: 10px;
//           height: 10px;
//           background: #cbd5e1;
//           opacity: 0.7;
//           transition: all 0.3s ease;
//         }
        
//         .custom-pagination .swiper-pagination-bullet-active {
//           background: #0085C7;
//           opacity: 1;
//           transform: scale(1.2);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RefrigeratorCategory;

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaTools, FaClock, FaShieldAlt, FaStar, FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { GiTechnoHeart } from 'react-icons/gi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RefrigeratorCategory = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const services = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1584568695804-9a37bc21e4c9?w=400",
      title: "Refrigerator Checkup",
      price: "৳ 500",
      capacity: "All Types"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
      title: "Deep Freezer Cleaning",
      price: "৳ 800",
      capacity: "All Types"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600431521340-491eca880813?w=400",
      title: "Refrigerator Cleaning",
      price: "৳ 700",
      capacity: "All Types"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400",
      title: "Refrigerator Repair and Servicing",
      price: "৳ 1200",
      capacity: "All Types"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1584568695804-9a37bc21e4c9?w=400",
      title: "Compressor Fitting",
      price: "৳ 1500",
      capacity: "All Types"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
      title: "Gas Charge",
      price: "৳ 2500",
      capacity: "All Types"
    }
  ];

  const warrantyPolicy = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "90 Days Service Warranty",
      description: "All our repairs come with 90 days service warranty"
    },
    {
      icon: <FaTools className="text-3xl" />,
      title: "1 Year Parts Warranty",
      description: "Genuine parts with 1 year replacement warranty"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Free Revisit",
      description: "Free service revisit if issue persists within warranty period"
    },
    {
      icon: <GiTechnoHeart className="text-3xl" />,
      title: "Quality Guarantee",
      description: "We guarantee the quality of our workmanship and parts"
    }
  ];

  const problems = [
    "Refrigerator not cooling",
    "Water leakage",
    "Strange noises",
    "Ice maker not working",
    "Compressor issues",
    "Temperature problems",
    "Freezer not freezing",
    "Display panel errors"
  ];

  const brands = ["Samsung", "LG", "Whirlpool", "Vision", "Walton", "Sharp", "Hisense", "Marcel"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-black py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
            <FaStar className="mr-2" />
            Professional Refrigerator Service
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Expert Refrigerator <br />
            <span className="text-olympic bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
              Repair & Service
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Get your refrigerator fixed by certified technicians with 90 days service warranty
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <FaPhone className="text-sm" />
              Call Now: 09638-787878
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
              <FaWhatsapp className="text-sm" />
             Request A service
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">10,000+</div>
              <div className="text-gray-600">Refrigerators Serviced</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">50+</div>
              <div className="text-gray-600">Expert Technicians</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">24/7</div>
              <div className="text-gray-600">Service Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section - AC Cooling Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our <span className="text-olympic">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional refrigerator repair and maintenance services
            </p>
          </div>

          {/* Carousel Container */}
          <div className="mb-16">
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
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 25
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30
                }
              }}
              className="services-carousel"
            >
              {services.map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-1">{service.capacity}</p>
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <span className="text-2xl font-bold text-green-600">{service.price}</span>
                        <button className="bg-olympic text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm hover:bg-blue-700">
                          See Details
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Swiper Navigation Styles */}
            <style jsx>{`
              .services-carousel {
                padding: 20px 10px;
              }
              .swiper-button-next,
              .swiper-button-prev {
                background: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                color: #3c8ce7;
              }
              .swiper-button-next:after,
              .swiper-button-prev:after {
                font-size: 20px;
                font-weight: bold;
              }
              .swiper-pagination-bullet {
                background: #3c8ce7;
                opacity: 0.5;
              }
              .swiper-pagination-bullet-active {
                background: #3c8ce7;
                opacity: 1;
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Warranty Policy Section (Replaces Features Section) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our <span className="text-olympic">Warranty Policy</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We stand behind our work with comprehensive warranty coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {warrantyPolicy.map((item, index) => (
              <div key={index} className="group text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-olympic flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems & Brands Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Common Problems */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-8">
                Common Refrigerator <span className="text-olympic">Problems</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {problems.map((problem, index) => (
                  <div key={index} className="flex items-center bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    <FaTools className="text-olympic mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Brands */}
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-8">
                Brands We <span className="text-olympic">Service</span>
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {brands.map((brand, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    <div className="text-lg font-semibold text-gray-800">{brand}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-olympic text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">
            Ready to Fix Your Refrigerator?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't let refrigerator problems spoil your food. Get professional service with warranty today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <FaPhone className="text-sm" />
              Call for Service
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
              <FaWhatsapp className="text-sm" />
              Message on WhatsApp
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
            <FaMapMarkerAlt className="text-sm" />
            <span>Service available in Dhaka, Chittagong, Sylhet & all major cities</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Frequently Asked <span className="text-olympic">Questions</span>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "How long does refrigerator repair take?",
                answer: "Most repairs are completed within 2-3 hours. Complex issues might require additional time."
              },
              {
                question: "Do you provide service warranty?",
                answer: "Yes, we provide 90 days service warranty on all repairs and 1 year warranty on replaced parts."
              },
              {
                question: "What areas do you serve?",
                answer: "We serve all major cities including Dhaka, Chittagong, Sylhet, and surrounding areas."
              },
              {
                question: "Do you charge for diagnosis?",
                answer: "Diagnosis is completely free if you proceed with the repair. Otherwise, a minimal diagnosis fee applies."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefrigeratorCategory;