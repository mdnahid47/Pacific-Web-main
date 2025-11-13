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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // Close all dropdowns by removing their open attribute
      const detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(detail => {
        detail.removeAttribute('open');
      });
      
      // Close DaisyUI dropdowns
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        if (dropdown.hasAttribute('open')) {
          dropdown.removeAttribute('open');
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(detail => {
      detail.removeAttribute('open');
    });
    
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.removeAttribute('open');
    });
  };

  // Complete navItems with all your menu structure
  const navItems = (
    <>
      <li className='text-md'>
        <Link to='/' className='hover:text-olympic transition-colors' onClick={closeAllDropdowns}>Home</Link>
      </li>
      
      <li>
        <details>
          <summary 
            className='text-md hover:text-olympic transition-colors cursor-pointer'
            onClick={(e) => e.stopPropagation()}
          >
            AC Repair Service
          </summary>
          <ul className="p-2 bg-white">
            <li>
              <Link 
                to='/ac-servicing' 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                AC Servicing
              </Link>
            </li>
            <li>
              <Link 
                to='/ac-cooling-problem' 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                AC Cooling Problem
              </Link>
            </li>
            <li>
              <Link 
                to="/ac-installation" 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                AC Installation & Uninstallation
              </Link>
            </li>
          </ul>
        </details>
      </li>

      <li className='text-md'>
        <Link 
          to='/refrigerator-service' 
          className='hover:text-olympic transition-colors'
          onClick={closeAllDropdowns}
        >
          Refrigerator Repair
        </Link>
      </li>

      <li className='text-md'>
        <Link 
          to='/vrf-vrv-hvac-solution' 
          className='hover:text-olympic transition-colors'
          onClick={closeAllDropdowns}
        >
          VRF/VRV/HVAC Solution
        </Link>
      </li>

      <li>
        <details>
          <summary 
            className='text-md hover:text-olympic transition-colors cursor-pointer'
            onClick={(e) => e.stopPropagation()}
          >
            Appliance Repair
          </summary>
          <ul className='p-2 bg-white'>
            <li>
              <Link 
                to='/washing-machine-service' 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                Washing Machine Service
              </Link>
            </li>
            <li>
              <Link 
                to='/tv-service' 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                TV Service
              </Link>
            </li>
            <li>
              <Link 
                to="/oven-service" 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                Oven Service
              </Link>
            </li>
            <li>
              <Link 
                to="/geyser-service" 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                Geyser Services
              </Link>
            </li>
            <li>
              <Link 
                to="/water-purifier-service" 
                className='hover:text-olympic transition-colors block py-1'
                onClick={closeAllDropdowns}
              >
                Water Purifier Services
              </Link>
            </li>
          </ul>
        </details>
      </li>
    </>
  );

  if (isLoading) {
    return null;
  }

  return (
    <header className="text-black bg-white w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div className={`navbar px-4 lg:px-24 ${isSticky ? "shadow-md bg-white" : ""}`}>
        
        {/* Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost lg:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              onClick={closeAllDropdowns}
            >
              {navItems}
            </ul>
          </div>
          <Link 
            to='/' 
            className="btn btn-ghost text-xl"
            onClick={closeAllDropdowns}
          >
            Pacific
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul 
            className="menu menu-horizontal px-1 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems}
          </ul>
        </div>

        {/* Auth Section */}
        <div className="navbar-end">
          {user ? (
            <div 
              className="dropdown dropdown-end"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full items-center">
                  {user.photo ? (
                    <img  
                      src={user.photo.startsWith('http') ? user.photo : `http://localhost:5001${user.photo}`}
                      alt="Profile" 
                    />
                  ) : (
                    <FaRegUser className="text-lg text-center justify-center" />
                  )}
                </div>
              </div>
              <ul 
                tabIndex={0} 
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link 
                    to="/profile"
                    onClick={closeAllDropdowns}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/orders"
                    onClick={closeAllDropdowns}
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      handleLogout();
                      navigate("/");
                      closeAllDropdowns();
                    }}
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </li>
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