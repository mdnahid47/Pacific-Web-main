import React, { useContext, useEffect, useState } from 'react'
import { TbPhoneCall } from "react-icons/tb";
import SigninModals from './Modals/SigninModals';
import { AuthContext } from './../contexts/AuthProvider';
import Profile from './Profile';
import { FaRegUser } from 'react-icons/fa';



const Navbar = () => {
    const [isSticky, setSticky] = useState(false);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const handeleScroll = () => {
            const offset = window.scrollY;
            if (offset > 0) {
                setSticky(true)
            } else {
                setSticky(false)
            }
        };

        window.addEventListener("scroll", handeleScroll);

        return () => {
            window.addEventListener("scroll", handeleScroll)
        }
    }, [])


    const navItems = <>
        <li className='text-md'><a href='/'>Home</a></li>
        <li>
            <details>
                <summary className='text-md'>Ac Repair Service</summary>
                <ul className="p-2 ">
                    <li className='w-40text-md'><a href='/ac-servicing'>Ac Servicing</a></li>
                    <li className='w-40text-md'><a href='/ac-cooling-problem'>Ac Cooling Problem</a></li>
                    <li className='w-40text-md'><a href="/ac-installation">Ac Installation & Unistallation</a></li>
                </ul>
            </details>
        </li>
        <li>
            <details>
                <summary className=''>Refrigerator Repair Service</summary>
                <ul className='p-2'>
                    <li className='w-48text-md'><a href='/'>Refrigerator Check Up</a></li>
                    <li className='w-48text-md'><a href='/'>Refrigerator Cleaning</a></li>
                    <li className='w-48text-md'><a href="/">Refrigerator Repair & Servicing </a></li>
                </ul>
            </details>
        </li>

        <li>
            <details>
                <summary>Appliance Repair</summary>
                <ul className='p-2'>
                    <li className='w-48text-md'><a href='/'>Washing Machine Service </a></li>
                    <li className='w-48text-md'><a href='/'>TV Service </a></li>
                    <li className='w-48text-md'><a href="/">Oven Service</a></li>
                    <li className='w-48text-md'><a href="/">Laptop & Computer Service</a></li>
                </ul>
            </details>
        </li>
    </>
    return (
        <header className='text-black bg-white max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out '>
            <div className={`navbar xl:px-24 ${isSticky
                    ? "shadow-md bg-white transition-all duration-300 ease-in-out"
                    : ""
                }`}>
                <div className="navbar-start ">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {navItems}
                        </ul>
                    </div>
                    <a href='/' className="btn btn-ghost text-xl ">Pacific</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navItems}
                    </ul>
                </div>
                <div className="navbar-end">
                {
          user? <Profile user={user}/> :  <button
          onClick={() => document.getElementById("nav_modal").showModal()}
          className="btn flex items-center gap-2 rounded-full px-6 bg-olympic text-white"
        >
          <FaRegUser /> Login
        </button>
         }
                 

                </div>
                <SigninModals />

            </div>
        </header>
    )
}

export default Navbar