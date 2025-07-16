import React from 'react';
import { FaUsers } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { GiProgression } from "react-icons/gi";

const Categories = () => {
    return (
        <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="text-center ">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                    Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">Us</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-teal-400 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {/* Card 1 - Quality Service */}
                <div className="group relative bg-white bg-gradient-to-r from-blue to-olympic rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="p-8">
                        <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <GiProgression className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Quality Service</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Service quality is a measure of how an organization understands its users' needs and fulfills their expectations with excellence.
                        </p>
                        <div className="absolute bottom-6 right-6 text-blue-600 dark:text-white opacity-70 group-hover:opacity-100 transition-opacity">
                            <GiProgression className="text-4xl" />
                        </div>
                    </div>
                </div>

                {/* Card 2 - Expert Team */}
                <div className="group relative bg-white bg-gradient-to-r from-blue to-olympic rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="p-8">
                        <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <FaUsers className="text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Expert Team</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Our team consists of industry veterans with specialized knowledge to deliver exceptional results tailored to your needs.
                        </p>
                        <div className="absolute bottom-6 right-6 text-blue-600 dark:text-white opacity-70 group-hover:opacity-100 transition-opacity">
                            <FaUsers className="text-4xl" />
                        </div>
                    </div>
                </div>

                {/* Card 3 - Excellent Support */}
                <div className="group relative bg-white bg-gradient-to-r from-blue to-olympic rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div className="p-8">
                        <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                            <RiCustomerService2Fill className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Excellent Support</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            24/7 dedicated support to ensure your complete satisfaction at every step of your journey with us.
                        </p>
                        <div className="absolute bottom-6 right-6 text-blue-600 dark:text-white opacity-70 group-hover:opacity-100 transition-opacity">
                            <RiCustomerService2Fill className="text-4xl" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;

// bg-gradient-to-r from-blue to-olympic