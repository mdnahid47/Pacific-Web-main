// import React, { createContext, useState, useContext } from 'react';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   const addToCart = (service) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item._id === service._id);
//       if (existingItem) {
//         return prevCart.map(item => 
//           item._id === service._id 
//             ? { ...item, quantity: item.quantity + 1 } 
//             : item
//         );
//       }
//       return [...prevCart, { ...service, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(prevCart => prevCart.filter(item => item._id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   return (
//     <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [services, setServices] = useState([]); // universal service list

  const addToCart = (item) => {
    const exists = cart.find(i => i.id === item.id);
    if (exists) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const decreaseFromCart = (id) => {
    const updated = cart.map(i =>
      i.id === id ? { ...i, quantity: i.quantity - 1 } : i
    ).filter(i => i.quantity > 0);
    setCart(updated);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      decreaseFromCart, services, setServices
    }}>
      {children}
    </CartContext.Provider>
  );
};
