import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaTools, FaClock, FaShieldAlt, FaStar, FaCheck, FaArrowRight, FaPhone, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import { GiTechnoHeart } from 'react-icons/gi';

import UniversalModal from '../components/Modals/UniversalModal';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const WashingMachine = () => {
    const services = [
        {
            id: 1,
            title: "Washing Machine Checkup",
            price: "৳ 400",
            capacity: "All Types",
            modalId: "washing_1",
            features: ["Complete Diagnosis", "Performance Testing", "Issue Identification"]
        },
        {
            id: 2,
            title: "Washing Machine Cleaning",
            price: "৳ 600",
            capacity: "All Types",
            modalId: "washing_2",
            features: ["Deep Interior Cleaning", "Mold Removal", "Drum Cleaning"]
        },
        {
            id: 3,
            title: "Washing Machine Servicing",
            price: "৳ 800",
            capacity: "All Types",
            modalId: "washing_3",
            features: ["Full Maintenance", "Part Lubrication", "Performance Optimization"]
        },
        {
            id: 4,
            title: "Washing Machine Install",
            price: "৳ 500",
            capacity: "All Types",
            modalId: "washing_4",
            features: ["Professional Installation", "Water Connection", "Electrical Setup"]
        },
        {
            id: 5,
            title: "Washing Machine Uninstall",
            price: "৳ 400",
            capacity: "All Types",
            modalId: "washing_5",
            features: ["Safe Removal", "Water Disconnection", "Proper Packing"]
        }
    ];

    const warrantyPolicy = [
        {
            icon: <FaShieldAlt className="text-3xl" />,
            title: "30 Days Service Warranty",
            description: "All our washing machine repairs come with 30 days service warranty"
        },
        {
            icon: <FaTools className="text-3xl" />,
            title: "Genuine Parts",
            description: "We use genuine and high-quality replacement parts"
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Quick Service",
            description: "Most services completed within 1-2 hours"
        },
        {
            icon: <GiTechnoHeart className="text-3xl" />,
            title: "Expert Technicians",
            description: "Certified washing machine specialists"
        }
    ];

    const problems = [
        "Washing machine not starting",
        "Water leakage problems",
        "Not spinning properly",
        "Strange noises during operation",
        "Not draining water",
        "Display error codes",
        "Vibration issues",
        "Door lock problems"
    ];

    const brands = ["Samsung", "LG", "Whirlpool", "Vision", "Walton", "Sharp", "Hisense", "Singer"];

    return (
        <div className="min-h-screen bg-white">
            {/* Banner */}


            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-black py-20">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center mb-4 bg-white/20 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                        <FaStar className="mr-2" />
                        Professional Washing Machine Service
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        Expert Washing Machine <br />
                        <span className="text-olympic bg-clip-text bg-gradient-to-r from-blue-200 to-blue-100">
                            Repair & Service
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                        Get your washing machine fixed by certified technicians with 30 days service warranty
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-olympic px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                            <FaPhone className="text-sm" />
                            Call Now: 09638-787878
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-olympic transition-all duration-300 flex items-center justify-center gap-2">
                            <FaWhatsapp className="text-sm" />
                            WhatsApp Service
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">8,000+</div>
                            <div className="text-gray-600">Washing Machines Serviced</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">96%</div>
                            <div className="text-gray-600">Success Rate</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">40+</div>
                            <div className="text-gray-600">Expert Technicians</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-olympic mb-2">24/7</div>
                            <div className="text-gray-600">Service Available</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Carousel Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Our Washing Machine <span className="text-olympic">Services</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Professional washing machine repair, maintenance, and installation services
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
                                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full">
                                        {/* Placeholder for image - you can add later */}
                                        <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                                            <div className="text-gray-500 text-center">
                                                <FaTools className="text-4xl mx-auto mb-2" />
                                                <p className="text-sm">Image Coming Soon</p>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                                            <p className="text-gray-600 mb-1">{service.capacity}</p>
                                            
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

            {/* Warranty Policy Section */}
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
                                Common Washing Machine <span className="text-olympic">Problems</span>
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
                        Need Washing Machine Service?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Don't let washing machine problems disrupt your daily routine. Get professional service with warranty today!
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
                                question: "How long does washing machine repair take?",
                                answer: "Most repairs are completed within 1-2 hours. Complex issues might require additional time for parts replacement."
                            },
                            {
                                question: "Do you provide service warranty?",
                                answer: "Yes, we provide 30 days service warranty on all repairs and 90 days warranty on replaced parts."
                            },
                            {
                                question: "What areas do you serve?",
                                answer: "We serve all major cities including Dhaka, Chittagong, Sylhet, and surrounding areas."
                            },
                            {
                                question: "Do you charge for diagnosis?",
                                answer: "Diagnosis is completely free if you proceed with the repair. Otherwise, a minimal diagnosis fee of ৳200 applies."
                            },
                            {
                                question: "Can you service all types of washing machines?",
                                answer: "Yes, we service all types including top-load, front-load, semi-automatic, and fully automatic machines."
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
            <dialog id="washing_1" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>Washing Machine Checkup</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Washing-Machine-Checkup" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="washing_2" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>Washing Machine Cleaning</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Washing-Machine-Cleaning" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="washing_3" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>Washing Machine Servicing</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Washing-Machine-Servicing" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="washing_4" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>Washing Machine Install</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Washing-Machine-Install" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="washing_5" className="modal">
                <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-hidden">
                    <div className="flex flex-col lg:flex-row h-full">
                        <div className="absolute top-0 left-0 right-0 bg-base-200 p-4 flex justify-between items-center z-10">
                            <h1 className='text-2xl font-bold'>Washing Machine Uninstall</h1>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <div className="h-full overflow-y-auto w-full mt-16">
                            <UniversalModal category="Washing-Machine-Uninstall" />
                        </div>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default WashingMachine;