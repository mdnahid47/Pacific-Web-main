import React from 'react'
import '../home/Categories.css'
import { FaUsers } from "react-icons/fa";
import { RiCustomerService2Line } from "react-icons/ri";
import { GrUserExpert } from "react-icons/gr";

const Categories = () => {
    return (
        <div className='max-w-screen-2xl  px-10 container mx-auto xl:px-24 mt-10'>
            <div className='text-3xl mb-10 flex items-center justify-center '>
                <h1>Why Choose Us </h1>
            </div>
            <div className='flex flex-col container  justify-center items-center md:flex-row gap-4 md:gap-2 md:px-0'>
                <div className='w-[375px] bg-gradient-to-r from-blue to-olympic border-none rounded-xl shadow-lg'>
                    <div className='card-body text-white'>
                        <h2 className='card-title'>Quality Service</h2>
                        <p>Service quality is a measure of how an organization understands its users’ needs and fulfills their expectations.</p>
                        <div className='card-actions justify-end  '>
                            <GrUserExpert className='h-[40px]  w-[60px]' />
                        </div>
                    </div>
                </div>

                <div className='w-[375px] h-[240px] bg-gradient-to-r from-blue to-olympic border-none rounded-xl shadow-lg'>
                    <div className='card-body text-white'>
                        <h2 className='card-title'>Expert Team </h2>
                        <p>It may seem like just semantics, but to us there’s an important distinction between an expert team...</p>
                        <div className='card-actions justify-end text-6xl'>
                            <FaUsers />
                        </div>
                    </div>
                </div>

                <div className='w-[375px] h-[240px] bg-gradient-to-r from-blue to-olympic border-none rounded-xl shadow-lg'>
                    <div className='card-body text-white'>
                        <h2 className='card-title'>Excellent Support</h2>
                        <p>The key to good customer service is to meet customer`s expectations. Great customer service means doing...</p>
                        <div className='card-actions justify-end text-6xl'>
                            <RiCustomerService2Line />
                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Categories