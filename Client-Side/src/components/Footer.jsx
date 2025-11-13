import React from 'react';
import { FaHeadset, FaMapMarkerAlt, FaPhone, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Pacific</h3>
            <p className="text-gray-400 mb-4">
              Trusted home service platform. Professional services at your doorstep.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <FaHeadset className="text-olympic" />
              <span>Support: 09638-009900</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>AC Services</li>
              <li>Refrigerator Repair</li>
              <li>Washing Machine</li>
              <li>Electrical Services</li>
              <li>Plumbing Services</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Blog</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-olympic" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-olympic" />
                <span>09638-787878</span>
              </div>
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-olympic" />
                <span>WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Pacific. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;