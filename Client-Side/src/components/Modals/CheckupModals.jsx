// import React, { useEffect, useState } from 'react'
// import cardImage from '../../assets/ac-service.jpg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
// import Cards from '../Cards';


// const CheckupModals = () => {
//   const [checkup, setCheckup] = useState([]);
//   const [cart,setCart] = useState([]);
//   useEffect(() => {
//     fetch("/menu.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const Checkup = data.filter((item) => item.category === "Ac Checkup");
//         // console.log(specials)
//         setCheckup(Checkup);
//       });
//   }, []);
//   return (
//     <div>
//          {
//                     checkup.map((item,i) => (
//                         <Cards item={item} key={i} 
//                         />
//                     ))
//                 }
//     </div>
//   )
// }

// export default CheckupModals

// import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
// import Cards from '../Cards';
// import axios from 'axios';

// const CheckupModals = () => {
//   const [checkup, setCheckup] = useState([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5001/api/services?category") // Ensure the category matches your database
//       .then((res) => {
//         if (res.data.success) {
//           setCheckup(res.data.services);
//         }
//         console.log("Checkup services fetched successfully:", res.data.services);
//       })
//       .catch((err) => {
//         console.error("Error fetching checkup services:", err);
//       });
      
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
     

//       {checkup.map((item, i) => (
//         <Cards item={item} key={i} />
        
//       ))}
//     </div>
//   );
// };

// export default CheckupModals;

// CheckupModals.jsx
// import React, { useEffect, useState } from "react";
// import Cards from "../Cards";
// import axios from "axios";

// const CheckupModals = () => {
//   const [checkup, setCheckup] = useState([]);
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//   const fetchServices = async () => {
//     try {
//       const response = await axios.get('http://localhost:5001/api/services', {
//         params: {
//           category: "Ac Checkup" // ডাটাবেসে থাকা সঠিক নাম ব্যবহার করুন
//         }
//       });
      
//       console.log('API Response:', response.data);
      
//       if (response.data.success) {
//         setCheckup(response.data.services);
//       } else {
//         console.warn('No services found');
//         setCheckup([]);
//       }
//     } catch (error) {
//       console.error('API Error:', {
//         message: error.message,
//         response: error.response?.data
//       });
//       setCheckup([]);
//     }
//   };

//   fetchServices();
// }, []);


//   const handleAddToCart = (item) => {
//     const exists = cart.find((ci) => ci.id === item._id);
//     if (!exists) {
//       setCart([...cart, { id: item._id, name: item.name, price: item.price }]);
//       alert(`${item.name} added to cart`);
//     } else {
//       alert("Item already in cart");
//     }
//   };

//   return (
//     <div>
//       {checkup.map((item, i) => (
//         <Cards key={i} item={item} onAddToCart={() => handleAddToCart(item)} />
//       ))}
//     </div>
//   );
// };

// export default CheckupModals;
// src/components/CheckupModals.js
// import React, { useEffect, useState } from 'react';
// import Cards from '../Cards';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// const CheckupModals = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchServices = async () => {
//     try {
//       const category = encodeURIComponent("Ac-Checkup-2");
//       const response = await fetch(`http://localhost:5001/api/services/${category}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//        console.log('Fetched services:', data);  // <-- এখানে দিন
      
//       setServices(data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   fetchServices();
// }, []);


//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <FontAwesomeIcon icon={faSpinner} spin size="2x" />
//         <p>Loading services...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="alert alert-danger">
//         Error loading services: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="container py-5">
      
//       {services.length === 0 ? (
//         <div className="alert alert-info">No services found in this category</div>
//       ) : (
//         <div className="row">
//           {services.map((item) => (
//             <Cards item={item} key={item.id} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckupModals;
import React, { useEffect, useState } from "react";
import Cards from "../Cards";
import Swal from "sweetalert2";

const CheckupModals = () => {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const category = encodeURIComponent("Ac-Checkup-2");
      const res = await fetch(`http://localhost:5001/api/services/${category}`);
      const data = await res.json();
      setServices(data);
    };

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("http://localhost:5001/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    };

    fetchServices();
    checkAuth();
  }, []);

  const addToCart = (item) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please Log In",
        text: "You need to log in to order.",
        showConfirmButton: true,
      });
      return;
    }

    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      Swal.fire({
        position: "top-end",
        icon: "info",
        title: "Item already in cart",
        showConfirmButton: false,
        timer: 1200,
      });
      return;
    }

    setCart([...cart, { ...item, quantity: 1 }]);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Added to cart",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Services Section */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl font-bold  text-white">AC Checkup Services</h2>
        <div className="">
          {services.map((item) => (
            <Cards key={item.id} item={item} addToCart={addToCart}
  isLoggedIn={!!user}/>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-1/3 bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-white text-lg font-semibold mb-3">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-400">Cart is empty</p>
        ) : (
          <ul className="space-y-3">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-gray-900 p-3 rounded">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div>
                  <p className="text-white">৳{item.price * item.quantity}</p>
                  <button className="text-red-400 text-xs" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="mt-4 border-t pt-4 border-gray-600 text-white">
            <p className="mb-2">Total: ৳{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
            <button className="btn btn-success btn-sm w-full">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckupModals;
