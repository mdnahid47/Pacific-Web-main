// /* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable react/prop-types */
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import WaringImage from "../../public/images/alert.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";

// const Cards = ({ item,onAddToCart  }) => {
//      console.log("Cards item:", item); 
//        console.log("Image URL:", item.image);
//   const [user, setUser] = useState(null);
//   const [cart, setCart] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Check user authentication status
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       fetch("http://localhost:5001/api/auth/verify", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.success) {
//             setUser(data.user);
//           } else {
//             setUser(null);
//           }
//         })
//         .catch((error) => {
//           console.error("Error verifying user:", error);
//           setUser(null);
//         });
//     }
//   }, []);

//   const handleAddToCart = (item) => {
//     if (user) {
//       const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

//       if (existingItemIndex === -1) {
//         const newCartItem = {
//           id: item._id,
//           name: item.name,
//           price: item.price,
//           category: item.category,
//           quantity: 1,
//           email: user.email,
//         };

//         setCart([...cart, newCartItem]);
//         navigate(`/checkout`, { state: { cart: [newCartItem] } });
//       } else {
//         console.log("Item already in cart.");
//       }
//     } else {
//       document.getElementById("warning").showModal();
//     }
//   };

//   return (
//     <div id="#modal">
//       <div className="card card-side bg-base-100 shadow-xl flex items-center mt-10">
//         <figure>
//           <img src={item.image} alt="" className="w-36" />
//         </figure>
//         <div className="card-body flex flex-col">
//           <h2 className="card-title">{item.name}</h2>
//           <p>Extra Charges will be applicable for Additional Work</p>
//           <div className="card-actions flex items-center">
//             <p className="font-semibold text-green">
//               <FontAwesomeIcon icon={faBangladeshiTakaSign} /> &nbsp;{item.price} BDT{" "}
//               <span className="text-slate-500 text-sm">/ Piece</span>
//             </p>
//             <button className="btn btn-primary" onClick={() => handleAddToCart(item)}>
//               Order Now
//             </button>
//           </div>
//         </div>
//       </div>

//       <dialog id="warning" className="modal modal-bottom sm:modal-middle">
//         <div className="modal-box">
//           <div className="flex flex-col items-center justify-center gap-5">
//             <img src={WaringImage} alt="warning" className="w-28" />
//             <div className="flex flex-col items-center justify-center">
//               <h3 className="font-bold text-lg">Please Log in!</h3>
//               <p className="py-4">Without an account, you won’t be able to Order!</p>
//             </div>
//           </div>
//           <div className="modal-action justify-center gap-5">
//             <form method="dialog" className="flex gap-5">
//               <button className="btn">Cancel</button>
//               <button className="btn bg-olympic text-white">
//                 <a href="/signup">Sign Up</a>
//               </button>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     </div>
     
//   );
// };

// export default Cards;


import React from "react";
import WaringImage from "../../public/images/alert.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";

const Cards = ({ item, addToCart, isLoggedIn }) => {
  console.log("Service item image URL:", item.image);
  const handleAdd = () => {
    if (!isLoggedIn) {
      document.getElementById("warning").showModal();
      return;
    }

    addToCart(item);
  };

  return (
    <div>
      {/* Product Card */}
      <div className="card card-side bg-base-100 shadow-xl flex items-center ">
        <figure>
          <img
            src={item.image}
            alt={item.name}
            className="w-36 h-36 object-contain"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{item.name}</h2>
          <p className="text-gray-600">
            {item.description ||
              "Extra Charges will be applicable for Additional Work"}
          </p>
          <div className="flex justify-between items-center mt-4">
            <p className="font-semibold text-green-600">
              <FontAwesomeIcon icon={faBangladeshiTakaSign} /> {item.price} BDT
              <span className="text-slate-500 text-sm ml-1">/ Piece</span>
            </p>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}>
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <dialog id="warning" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={WaringImage} alt="warning" className="w-24" />
            <div className="text-center">
              <h3 className="font-bold text-lg">Please Log In!</h3>
              <p className="py-3">You need to be logged in to place an order.</p>
            </div>
          </div>
          <div className="modal-action justify-center gap-4">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <a href="/login" className="btn bg-olympic text-white">Log In</a>
            <a href="/signup" className="btn btn-outline">Sign Up</a>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Cards;
