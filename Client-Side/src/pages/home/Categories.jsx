// import React from 'react';
// import { FaUsers } from "react-icons/fa";
// import { RiCustomerService2Fill } from "react-icons/ri";
// import { GiProgression } from "react-icons/gi";

// const Categories = () => {
//     return (
//         <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ">
//             <div className="text-center ">
//                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
//                     Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">Us</span>
//                 </h2>
//                 <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-teal-400 mx-auto mt-4"></div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
//                 {/* Card 1 - Quality Service */}
//                 <div className="group relative bg-white bg-gradient-to-r from-blue to-olympic rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                     <div className="p-8">
//                         <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                             <GiProgression className="text-2xl" />
//                         </div>
//                         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Quality Service</h3>
//                         <p className="text-gray-600 dark:text-gray-300 mb-6">
//                             Service quality is a measure of how an organization understands its users' needs and fulfills their expectations with excellence.
//                         </p>
//                         <div className="absolute bottom-6 right-6 text-blue-600 dark:text-white opacity-70 group-hover:opacity-100 transition-opacity">
//                             <GiProgression className="text-4xl" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Card 2 - Expert Team */}
//                 <div className="group relative bg-white bg-gradient-to-r from-blue to-olympic rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                     <div className="p-8">
//                         <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                             <FaUsers className="text-xl" />
//                         </div>
//                         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Expert Team</h3>
//                         <p className="text-gray-600 dark:text-gray-300 mb-6">
//                             Our team consists of industry veterans with specialized knowledge to deliver exceptional results tailored to your needs.
//                         </p>
//                         <div className="absolute bottom-6 right-6 text-blue-600 dark:text-white opacity-70 group-hover:opacity-100 transition-opacity">
//                             <FaUsers className="text-4xl" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Card 3 - Excellent Support */}
//                 <div className="group relative bg-white bg-gradient-to-r from-blue to-olympic rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
//                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
//                     <div className="p-8">
//                         <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
//                             <RiCustomerService2Fill className="text-2xl" />
//                         </div>
//                         <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Excellent Support</h3>
//                         <p className="text-gray-600 dark:text-gray-300 mb-6">
//                             24/7 dedicated support to ensure your complete satisfaction at every step of your journey with us.
//                         </p>
//                         <div className="absolute bottom-6 right-6 text-blue-600 dark:text-white opacity-70 group-hover:opacity-100 transition-opacity">
//                             <RiCustomerService2Fill className="text-4xl" />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Categories;

import React, { useState, useEffect } from 'react';
import { FaUsers, FaStar, FaRocket, FaShieldAlt, FaAward, FaRegClock } from "react-icons/fa";
import { RiCustomerService2Fill, RiMoneyDollarCircleFill, RiLeafFill } from "react-icons/ri";
import { GiProgression, GiAchievement, GiThreeFriends } from "react-icons/gi";
import { MdSpeed, MdSecurity, MdWorkspacePremium } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";

const Categories = () => {
    const [stats, setStats] = useState({
        projects: 0,
        clients: 0,
        support: 0
    });

    useEffect(() => {
        // Animate counters
        const animateCounter = (target, setter, key) => {
            let count = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    count = target;
                    clearInterval(timer);
                }
                setter(prev => ({ ...prev, [key]: Math.floor(count) }));
            }, 30);
        };

        animateCounter(2500, setStats, 'projects');
        animateCounter(980, setStats, 'clients');
        animateCounter(247, setStats, 'support');
    }, []);

    return (
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-10 left-5 w-6 h-6 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute top-32 right-10 w-4 h-4 bg-teal-400 rounded-full opacity-30 animate-pulse delay-75"></div>
            <div className="absolute bottom-20 left-10 w-8 h-8 bg-blue-500 rounded-full opacity-10 animate-ping"></div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Enhanced Header */}
            <div className="text-center mb-16 lg:mb-20 relative">
                <div className="inline-flex items-center justify-center mb-4 bg-gradient-to-r from-blue-600 to-teal-500 text-black px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30 animate-pulse">
                    🚀 Trusted by Industry Leaders
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight">
                    Why <span className="text-olympic">Thousands Choose</span> Us
                </h2>
                <div className="relative inline-block">
                    <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full mx-auto"></div>
                    <div className="w-8 h-1.5 bg-black dark:bg-gray-900 rounded-full absolute top-0 left-1/2 -translate-x-1/2 animate-ping-slow"></div>
                </div>
                <p className="text-lg text-gray-900 mt-8 max-w-2xl mx-auto leading-relaxed">
                    Join <span className="font-bold text-blue-600">{stats.clients}+</span> satisfied clients who trust us for exceptional results and unparalleled service
                </p>
            </div>

            {/* Live Stats Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-xl shadow-blue-500/10 border border-gray-100 dark:border-gray-700 group hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                        <IoStatsChart className="text-2xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stats.projects}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">Projects Completed</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-xl shadow-blue-500/10 border border-gray-100 dark:border-gray-700 group hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                        <FaUsers className="text-xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stats.clients}+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">Happy Clients</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-xl shadow-blue-500/10 border border-gray-100 dark:border-gray-700 group hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
                        <RiCustomerService2Fill className="text-2xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        24/{stats.support}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-semibold">Support Available</div>
                </div>
            </div>

            {/* Enhanced Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 relative">
                {/* Background Decorations */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 animate-float"></div>
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-teal-100 dark:bg-teal-900/20 rounded-full blur-3xl opacity-30 animate-float-delayed"></div>
                
                {/* Card 1 - Quality Service */}
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-3 border border-gray-100 dark:border-gray-700">
                        {/* Premium Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                            <FaStar className="text-xs" /> POPULAR
                        </div>
                        
                        <div className="p-8 lg:p-10 relative z-10">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-30"></div>
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <GiProgression className="text-2xl" />
                                </div>
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Premium Quality
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Award-winning service quality with 99.8% client satisfaction rate and industry-leading standards.
                            </p>

                            {/* Features List */}
                            <div className="space-y-3 mb-6">
                                {['ISO 9001 Certified', '5-Star Rated', 'Quality Guaranteed', 'Award Winning'].map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-600 ">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} className="text-sm" />
                                    ))}
                                    <span className="text-gray-600 text-sm ml-2">5.0</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-300 shadow-lg shadow-blue-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 - Expert Team */}
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-3 border border-gray-100 dark:border-gray-700">
                        {/* Best Value Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                            <GiThreeFriends className="text-xs" /> BEST VALUE
                        </div>

                        <div className="p-8 lg:p-10 relative z-10">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-30"></div>
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <FaUsers className="text-xl" />
                                </div>
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Elite Experts
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                50+ certified professionals with 10+ years average experience in their respective fields.
                            </p>

                            {/* Team Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">50+</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">Experts</div>
                                </div>
                                <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                                    <div className="text-lg font-bold text-teal-600 dark:text-teal-400">10+</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-300">Years Avg.</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-blue-600 dark:text-blue-400">
                                    <GiAchievement className="text-xl mr-2" />
                                    <span className="text-sm font-semibold">Certified Team</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-300 shadow-lg shadow-blue-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 - Excellent Support */}
                <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-3 border border-gray-100 dark:border-gray-700">
                        {/* 24/7 Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                            <FaRegClock className="text-xs" /> 24/7 SUPPORT
                        </div>

                        <div className="p-8 lg:p-10 relative z-10">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-30"></div>
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                    <RiCustomerService2Fill className="text-2xl" />
                                </div>
                            </div>

                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                24/7 Premium Support
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                Instant support with 2-minute average response time and 98% first-contact resolution rate.
                            </p>

                            {/* Support Features */}
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Response Time</span>
                                    <span className="font-semibold text-green-600"> 2 min</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Resolution Rate</span>
                                    <span className="font-semibold text-green-600">98%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Availability</span>
                                    <span className="font-semibold text-blue-600">24/7/365</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-green-600 dark:text-green-400">
                                    <MdSpeed className="text-xl mr-2" />
                                    <span className="text-sm font-semibold">Live Chat</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-45 transition-all duration-300 shadow-lg shadow-blue-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    

            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float 8s ease-in-out infinite 2s;
                }
                @keyframes ping-slow {
                    0% { transform: translateX(-50%) scale(1); opacity: 1; }
                    75%, 100% { transform: translateX(-50%) scale(2); opacity: 0; }
                }
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </section>
    );
};

export default Categories;