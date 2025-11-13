// import React from 'react'
// import Banner from '../../components/Banner'
// import install from '../../assets/install.jpg'
// import InstallationModal from '../../components/Modals/AcInstallationModals/InstallationModal';
// import IndorModals from '../../components/Modals/AcInstallationModals/IndorModals';
// import OutdoorModals from '../../components/Modals/AcInstallationModals/OutdoorModals';
// import cardImage from '../../assets/ac-service.jpg';
// import CheckupModals from './../../components/Modals/CheckupModals';
// const AcInstallation = () => {
//   return (
//     <div>
//         <Banner/>

//         {/* pop up */}
//         <dialog id="installl_1" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC  Installation Both Unit</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <InstallationModal/>
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="installl_2" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC  Indoor Unit Installation</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <IndorModals/>
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="installl_3" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC  Outdoor Unit Installation</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <OutdoorModals/>
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>



//         <div className='container px-10 md:px-0 md:gap-2 mx-auto xl:px-24'>
//                 <div className='text-3xl mt-20 mb-10 flex items-center justify-center'>
//                     <h1 >Ac Installation</h1>
//                 </div>

//                 <div className='grid grid-cols-1 md:grid-cols-9 md:px-10 lg:grid-cols-12 gap-10'>
//                     <div className='col-span-4'>
//                     <div className='w-72  rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={install} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Installation <br /> Both Unit</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white'onClick={()=>document.getElementById('installl_1').showModal()} >See Details</button>
//                             </div>
//                         </div>
//                     </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={install} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Indoor Unit  Installation</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('installl_2').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>


//                     <div className='w-72 col-span-4  rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={install} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Outdoor Unit  Installation</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={()=>document.getElementById('installl_3').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>                 
//                 </div>




//             </div>

//     </div>
//   )
// }

// export default AcInstallation

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaTools, FaClock, FaShieldAlt, FaStar, FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { GiTechnoHeart } from 'react-icons/gi';
import Banner from '../../components/Banner'
import install from '../../assets/install.jpg'
import UniversalModal from '../../components/Modals/UniversalModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AcInstallation = () => {
  const installationServices = [
    {
      id: 1,
      image: install,
      title: "AC Installation Both Unit",
      price: "৳ 2,500",
      ton: "1-5 Ton",
      modalId: "install_1",
      features: ["Indoor & Outdoor Unit", "Professional Installation", "Gas Charging"]
    },
    {
      id: 2,
      image: install,
      title: "AC Dismantling",
      price: "৳ 800",
      ton: "1-5 Ton",
      modalId: "install_2",
      features: ["Safe Dismantling", "Gas Recovery", "Unit Protection"]
    },
    {
      id: 3,
      image: install,
      title: "AC Shifting",
      price: "৳ 1,800",
      ton: "1-5 Ton",
      modalId: "install_3",
      features: ["Location Shifting", "Re-installation", "Gas Charging"]
    }
  ];

  const warrantyPolicy = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "7 Days Service Warranty",
      description: "All our installation services come with 7 days service warranty"
    },
    {
      icon: <FaTools className="text-3xl" />,
      title: "Professional Tools",
      description: "We use professional tools and equipment for safe installation"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Quick Service",
      description: "Most installations completed within 2-4 hours"
    },
    {
      icon: <GiTechnoHeart className="text-3xl" />,
      title: "Expert Technicians",
      description: "Certified installation specialists with years of experience"
    }
  ];

  const problems = [
    "Wrong AC installation",
    "Gas leakage after installation",
    "Poor cooling performance",
    "Water leakage issues",
    "Noisy operation",
    "Electrical problems",
    "Unit vibration",
    "Drainage issues"
  ];

  const brands = ["Gree", "General", "Midea", "Samsung", "LG", "Daikin", "Hitachi", "Carrier"];

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
 

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-black py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
            <FaStar className="mr-2" />
            Professional AC Installation
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Expert AC <br />
            <span className="text-olympic  bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
              Installation & Shifting
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-black">
            Get your AC professionally installed, dismantled, or shifted by certified technicians
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <FaPhone className="text-sm" />
              Call Now: 09638-787878
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
              <FaWhatsapp className="text-sm" />
              WhatsApp Service
            </button>
          </div> */}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">15,000+</div>
              <div className="text-gray-600">ACs Installed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">99%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">50+</div>
              <div className="text-gray-600">Expert Technicians</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-olympic mb-2">24/7</div>
              <div className="text-gray-600">Service Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Carousel Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our AC <span className="text-olympic">Installation Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional AC installation, dismantling, and shifting services
            </p>
          </div>

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
                  slidesPerView: 3,
                  spaceBetween: 30
                }
              }}
              className="services-carousel"
            >
              {installationServices.map((service) => (
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
                      <p className="text-gray-600 mb-1">{service.ton}</p>
                      
                      {/* Features List */}
                      <div className="mb-4">
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <span className="text-2xl font-bold text-green-600">{service.price}</span>
                        <button 
                          className="bg-olympic text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm hover:bg-blue-700"
                          onClick={() => document.getElementById(service.modalId).showModal()}
                        >
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
                color: #0085C7;
              }
              .swiper-button-next:after,
              .swiper-button-prev:after {
                font-size: 20px;
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
        </div>
      </section>

      {/* Service Policy Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Our <span className="text-olympic">Service Policy</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional AC installation services with quality assurance
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
                Common Installation <span className="text-olympic">Problems</span>
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
                Brands We <span className="text-olympic">Install</span>
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
            Need AC Installation Service?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get professional AC installation, dismantling, or shifting services with warranty!
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
                question: "How long does AC installation take?",
                answer: "Typically 2-4 hours depending on the complexity and location. Complete installation includes both indoor and outdoor units."
              },
              {
                question: "Do I need to provide any materials for installation?",
                answer: "We provide all necessary installation materials. Additional items like extra copper pipes or special mounts may incur extra charges."
              },
              {
                question: "Is gas charging included in installation?",
                answer: "Yes, gas charging is included for complete AC installation services. For shifting services, gas recovery and recharging are included."
              },
              {
                question: "Do you provide warranty for installation work?",
                answer: "Yes, we provide 7 days service warranty for all installation, dismantling, and shifting work."
              },
              {
                question: "Can you install AC on any type of wall?",
                answer: "We can install on most wall types including concrete, brick, and wood. Special walls may require additional mounting equipment."
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

      {/* Modals */}
      <dialog id="install_1" className="modal">
        <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
              <h1 className='text-2xl font-bold'>AC Installation Both Unit</h1>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>
            <div className="h-full overflow-y-auto w-full mt-16">
              <UniversalModal category="AC-Installation-Both-Unit" />
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="install_2" className="modal">
        <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
              <h1 className='text-2xl font-bold'>AC Dismantling</h1>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>
            <div className="h-full overflow-y-auto w-full mt-16">
              <UniversalModal category="AC-Dismantling" />
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="install_3" className="modal">
        <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
              <h1 className='text-2xl font-bold'>AC Shifting</h1>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>
            <div className="h-full overflow-y-auto w-full mt-16">
              <UniversalModal category="AC-Shifting" />
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default AcInstallation