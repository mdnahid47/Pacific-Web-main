import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';
import SigninModals from './Modals/SigninModals';
import { FaCalendarAlt, FaUserPlus } from 'react-icons/fa';


const RegisterBookingSection = () => {
  const { user, isLoggedIn } = useContext(AuthContext);

  return (
    <section className="py-20 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-black mb-6">
            {isLoggedIn ? 'Book Your Service Now' : 'Ready to Get Started?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {isLoggedIn 
              ? 'Get professional service at your doorstep with just one click' 
              : 'Register now and book your service in just a few clicks'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Show Register button only when logged out */}
            {!isLoggedIn && (
              <button className="bg-olympic text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3">
                <FaUserPlus className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs text-blue-100">GET STARTED</div>
                  <div className="text-lg">Register Now</div>
                </div>
              </button>
            )}
            
            {/* Book Service button - more prominent when logged in */}
            <button 
              className={`px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoggedIn 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-black hover:shadow-green-500/30 transform hover:-translate-y-1' 
                  : 'bg-green-600 text-black hover:shadow-green-500/30'
              }`}
            >
              <FaCalendarAlt className="text-2xl" />
              <div className="text-left">
                <div className={`text-xs ${isLoggedIn ? 'text-green-100' : 'text-green-100'}`}>
                  {isLoggedIn ? 'QUICK BOOKING' : 'BOOK SERVICE'}
                </div>
                <div className="text-lg">
                  {isLoggedIn ? 'Book Now' : 'Book a Service'}
                </div>
              </div>
            </button>
          </div>

          {/* Conditional messages */}
          {!isLoggedIn ? (
            <p className="text-gray-500 mt-6 text-sm">
              Already have an account?{' '}
              <a 
                onClick={() => document.getElementById("nav_modal").showModal()}
                className="text-olympic font-semibold cursor-pointer hover:underline"
              >
                Login here
              </a>
            </p>
          ) : (
            <p className="text-gray-500 mt-6 text-sm">
              Welcome back, <span className="text-olympic font-semibold">{user?.name || user?.email}</span>! 
              Need help? <a href="/contact" className="text-olympic hover:underline">Contact support</a>
            </p>
          )}
        </div>
      </div>
      <SigninModals />
    </section>
  );
};

export default RegisterBookingSection;