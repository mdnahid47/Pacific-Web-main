// import React from 'react';
// import Banner from '../../components/Banner';
// import cardImage from '../../assets/ac.png';
// import Compressore from '../../assets/compressor.jpg';
// import Capcitor from '../../assets/ac.png';
// import Leack from '../../assets/Leack.jpeg';
// import pcb from '../../assets/pcb-board.jpg';
// import gasCharge from '../../assets/refrigerant.jpg';
// import GasChargeModal from '../../components/Modals/CoolingModal/GasChargeModal';
// import LeackModals from '../../components/Modals/CoolingModal/LeackModals';
// import CircuitModals from '../../components/Modals/CoolingModal/CircuitModals';
// import CapacitorModals from '../../components/Modals/CoolingModal/CapacitorModals';
// import CompressoreModals from '../../components/Modals/CoolingModal/CompressoreModals';
// import CheckupModals from './../../components/Modals/CheckupModals';

// const AcCooling = () => {
//     return (
//         <div>
//             {/* Banner */}
//             <Banner />

//             {/* Modals */}

//             <dialog id="my_modal_9" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC Checkup</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <CheckupModals />
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="cooling_1" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC Gas Charge</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <GasChargeModal />
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="cooling_2" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC Leack Repair</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <LeackModals />
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="cooling_3" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC Circuit Repair</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <CircuitModals />
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="cooling_4" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC Capacitor Replace</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <CapacitorModals />
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>

//             <dialog id="cooling_5" className="modal modal-bottom sm:modal-middle">
//                 <div className="modal-box">
//                     <h1 className='text-xl'>AC Compressore Fitting & Gas Charge</h1>
//                     <form method="dialog">
//                         {/* if there is a button in form, it will close the modal */}
//                         <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//                     </form>
//                     <CompressoreModals />
//                     <div className="modal-action">
//                         <form method="dialog">
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className="btn">Close</button>
//                         </form>
//                     </div>
//                 </div>
//             </dialog>
//             {/* card item  */}
//             <div className='container px-10 md:px-0 md:gap-2 mx-auto xl:px-24'>
//                 <div className='text-3xl mt-20 mb-10 flex items-center justify-center'>
//                     <h1 >Ac Servicing</h1>
//                 </div>


//                 <div className='grid grid-cols-1 md:grid-cols-9 md:px-10 lg:grid-cols-12 gap-10'>

//                 <div className='col-span-4'>
//                     <div className='w-72  rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={cardImage} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Check Up</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                               <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white'onClick={()=>document.getElementById('my_modal_9').showModal()} >See Details</button>
//                             </div>
//                         </div>
//                     </div>
//                     </div>


//                     <div className='col-span-4'>
//                         <div className='w-72  rounded-xl border shadow-lg'>
//                             <img className='w-96 rounded-t-xl' src={gasCharge} alt="" />
//                             <div className='card-body'>
//                                 <h2 className='card-title'>Ac Gas Charge</h2>
//                                 <p className='text-xl'>1-5 Ton</p>
//                                 <div className='card-actions mt-6 justify-end '>
//                                     <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_1').showModal()} >See Details</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={Leack} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Leack Repair </h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                                 <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_2').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>


//                     <div className='w-72 col-span-4  rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={pcb} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Circuit Repair</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                                 <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_3').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={Capcitor} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Capacitor Replace</h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                                 <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_4').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='w-72 col-span-4 rounded-xl border shadow-lg'>
//                         <img className='w-96 rounded-t-xl' src={Compressore} alt="" />
//                         <div className='card-body'>
//                             <h2 className='card-title'>Ac Compressor
//                                 <br />Fitting & Gas Charge
//                             </h2>
//                             <p className='text-xl'>1-5 Ton</p>
//                             <div className='card-actions mt-6 justify-end '>
//                                 <button className='btn bg-gradient-to-r from-sky to-olympic border-none text-white' onClick={() => document.getElementById('cooling_5').showModal()}>See Details</button>
//                             </div>
//                         </div>
//                     </div>

//                 </div>




//             </div>




//         </div>
//     )
// }

// export default AcCooling


import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaTools, FaClock, FaShieldAlt, FaStar, FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { GiTechnoHeart } from 'react-icons/gi';
import Banner from '../../components/Banner';
import cardImage from '../../assets/ac.png';
import Compressore from '../../assets/compressor.jpg';
import Capcitor from '../../assets/ac.png';
import Leack from '../../assets/Leack.jpeg';
import pcb from '../../assets/pcb-board.jpg';
import gasCharge from '../../assets/refrigerant.jpg';
import UniversalModal from '../../components/Modals/UniversalModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AcCooling = () => {
    const services = [
        {
            id: 1,
            image: cardImage,
            title: "AC Check Up",
            price: "৳ 500",
            ton: "1-5 Ton",
            modalId: "my_modal_9"
        },
        {
            id: 2,
            image: gasCharge,
            title: "AC Gas Charge",
            price: "৳ 3500",
            ton: "1-5 Ton",
            modalId: "my_modal_2"
        },
        {
            id: 3,
            image: Leack,
            title: "AC Leak Repair",
            price: "৳ 1500",
            ton: "1-5 Ton",
            modalId: "my_modal_3"
        },
        {
            id: 4,
            image: pcb,
            title: "AC Circuit Repair",
            price: "৳ 2000",
            ton: "1-5 Ton",
            modalId: "my_modal_4"
        },
        {
            id: 5,
            image: Capcitor,
            title: "AC Capacitor Replace",
            price: "৳ 1000",
            ton: "1-5 Ton",
            modalId: "my_modal_5"
        },
        {
            id: 6,
            image: Compressore,
            title: "AC Compressor Fitting",
            price: "৳ 1000",
            ton: "1-5 Ton",
            modalId: "my_modal_6"
        }
    ];

    const warrantyPolicy = [
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: "90 Days Service Warranty",
            description: "All our AC repairs come with 90 days service warranty"
        },
        {
            icon: <FaTools className="text-3xl" />,
            title: "1 Year Parts Warranty",
            description: "Genuine AC parts with 1 year replacement warranty"
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Free Revisit",
            description: "Free service revisit if cooling issue persists within warranty"
        },
        {
            icon: <GiTechnoHeart className="text-3xl" />,
            title: "Quality Guarantee",
            description: "We guarantee optimal cooling performance after service"
        }
    ];

    const problems = [
        "AC not cooling properly",
        "Weak airflow from vents",
        "AC gas leakage issues",
        "Compressor not working",
        "Water leakage problems",
        "Strange noises from AC",
        "AC tripping circuit",
        "Remote control issues"
    ];

    const brands = ["Gree", "General", "Midea", "Samsung", "LG", "Daikin", "Hitachi", "Carrier"];

    return (
        <div className="min-h-screen bg-white">
            {/* Banner */}
            <Banner />

            {/* Hero Section */}
            <section className="relative bg-white py-20 border-b border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center mb-4 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-black">
                        <FaStar className="mr-2" />
                        Professional AC Cooling Service
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-black">
                        Expert AC Cooling <br />
                        <span className="text-olympic">
                            Repair & Service
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
                        Get your AC cooling fixed by certified technicians with 90 days service warranty
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-olympic text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            <FaPhone className="text-sm" />
                            Call Now: 09638-787878
                        </button>
                        <button className="border-2 border-olympic text-olympic px-8 py-4 rounded-xl font-bold text-lg hover:bg-olympic hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                            <FaWhatsapp className="text-sm" />
                            WhatsApp Service
                        </button>
                    </div>
                </div>
            </section>

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

            {/* Services Carousel Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-black mb-4">
                            Our AC Cooling <span className="text-olympic">Services</span>
                        </h2>
                        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                            Professional AC repair and maintenance services for optimal cooling performance
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
                                    slidesPerView: 4,
                                    spaceBetween: 30
                                }
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
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-semibold text-black mb-2">{service.title}</h3>
                                            <p className="text-gray-700 mb-1">{service.ton}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                <span className="text-2xl font-bold text-black">{service.price}</span>
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
                                border: 1px solid #e5e5e5;
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

            {/* Warranty Policy Section */}
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

            {/* Problems & Brands Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Common Problems */}
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

                        {/* Supported Brands */}
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

            {/* CTA Section */}
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

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-black mb-4">
                            Frequently Asked <span className="text-olympic">Questions</span>
                        </h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-6">
                        {[
                            {
                                question: "How long does AC cooling repair take?",
                                answer: "Most AC cooling repairs are completed within 2-3 hours. Complex compressor or gas leakage issues might require additional time."
                            },
                            {
                                question: "Do you provide service warranty for AC cooling?",
                                answer: "Yes, we provide 90 days service warranty on all AC cooling repairs and 1 year warranty on replaced parts."
                            },
                            {
                                question: "What areas do you serve for AC service?",
                                answer: "We serve all major cities including Dhaka, Chittagong, Sylhet, and surrounding areas with expert AC technicians."
                            },
                            {
                                question: "Do you charge for AC diagnosis?",
                                answer: "AC diagnosis is completely free if you proceed with the repair. Otherwise, a minimal diagnosis fee of ৳200 applies."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                <h3 className="text-xl font-bold text-black mb-3">{faq.question}</h3>
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modals */}
            <dialog id="my_modal_9" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-black">AC Checkup Service</h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </form>
                    </div>
                    <UniversalModal category="Ac-Checkup-2" />
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

            <dialog id="my_modal_2" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-black">AC Gas Charge</h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </form>
                    </div>
                    <UniversalModal category="Ac Gas Charge" />
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

            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-black">AC Leak Repair</h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </form>
                    </div>
                    <UniversalModal category="Ac Leak Repair" />
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

            <dialog id="my_modal_4" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-black">AC PCB Board Repair</h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </form>
                    </div>
                    <UniversalModal category="Ac PCB Board Repair" />
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

            <dialog id="my_modal_5" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-black">AC Capacitor Change</h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </form>
                    </div>
                    <UniversalModal category="AC Capacitor Change" />
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

            <dialog id="my_modal_6" className="modal">
                <div className="modal-box max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-black">AC Compressor Change</h3>
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                        </form>
                    </div>
                    <UniversalModal category="Ac Compressor" />
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
        </div>
    );
};

export default AcCooling;