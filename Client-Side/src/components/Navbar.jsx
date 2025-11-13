import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { FaRegUser, FaSignOutAlt } from 'react-icons/fa';
import SigninModals from './Modals/SigninModals';

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, handleLogout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check auth state on initial load
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Complete navItems with all your menu structure
  const navItems = (
    <>
      <li className='text-md'>
        <Link to='/' className='hover:text-olympic transition-colors'>Home</Link>
      </li>
      
      <li>
        <details>
          <summary className='text-md hover:text-olympic transition-colors'>
            AC Repair Service
          </summary>
          <ul className="p-2 bg-white">
            <li>
              <Link to='/ac-servicing' className='hover:text-olympic transition-colors block py-1'>
                AC Servicing
              </Link>
            </li>
            <li>
              <Link to='/ac-cooling-problem' className='hover:text-olympic transition-colors block py-1'>
                AC Cooling Problem
              </Link>
            </li>
            <li>
              <Link to="/ac-installation" className='hover:text-olympic transition-colors block py-1'>
                AC Installation & Uninstallation
              </Link>
            </li>
          </ul>
        </details>
      </li>

      <li>
      
          <summary className='text-md hover:text-olympic transition-colors'>
           <Link to='/refrigerator-service'>  Refrigerator Repair</Link>
          </summary>
          
     
      </li>
      <li>
          <summary className='text-md hover:text-olympic transition-colors'>
           <Link to=''>  VRF/VRV/HVAC Solution</Link>
          </summary>
      </li>

      <li>
        <details>
          <summary className='text-md hover:text-olympic transition-colors'>
            Appliance Repair
          </summary>
          <ul className='p-2 bg-white'>
            <li>
              <Link to='/washing-machine-service' className='hover:text-olympic transition-colors block py-1'>
                Washing Machine Service
              </Link>
            </li>
            <li>
              <Link to='/tv-service' className='hover:text-olympic transition-colors block py-1'>
                TV Service
              </Link>
            </li>
            <li>
              <Link to="/oven-service" className='hover:text-olympic transition-colors block py-1'>
                Oven Service
              </Link>
            </li>
            <li>
              <Link to="/computer-service" className='hover:text-olympic transition-colors block py-1'>
                Geyser Services
              </Link>
            </li>
            <li>
              <Link to="/computer-service" className='hover:text-olympic transition-colors block py-1'>
                Water Purifier Services
              </Link>
            </li>
          </ul>
        </details>
      </li>
    </>
  );

  if (isLoading) {
    return null; // or return a loading spinner
  }

  return (
    <header className="text-black bg-white w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div className={`navbar px-4 lg:px-24 ${isSticky ? "shadow-md bg-white" : ""}`}>
        
        {/* Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              {navItems}
            </ul>
          </div>
          <Link to='/' className="btn btn-ghost text-xl">Pacific</Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navItems}
          </ul>
        </div>

        {/* Auth Section */}
        <div className="navbar-end">
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar ">
                <div className="w-10 rounded-full items-center ">
                  {user.photo ? (
                    <img  src={user.photo.startsWith('http') ? user.photo : `http://localhost:5001${user.photo}`}
    alt="Profile" />
                  ) : (
                    <FaRegUser className="text-lg text-center justify-center" />
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><button onClick={() => {
                            handleLogout();
                            navigate("/");}}><FaSignOutAlt className="mr-1" /> Logout</button></li>
              </ul>
            </div>
          ) : (
            <button
              onClick={() => document.getElementById("nav_modal").showModal()}
              className="btn flex items-center gap-2 rounded-full px-6 bg-olympic text-white hover:bg-olympic-dark"
            >
              <FaRegUser /> Login
            </button>
          )}
        </div>
      </div>

      {/* Signin Modal */}
      <SigninModals />
    </header>
  );
};

export default Navbar;



// Exclusive Combo Offer
// Oven Services
// TV Services
// Washing Machine Services
// Kitchen Hood Services
// IPS Services
// Treadmill Services
// Water Purifier Services
// Geyser Services
// Gas Stove/Burner Services
// Generator Services