import React, { useEffect, useState } from "react";
import Cards from "../Cards";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UniversalModal = ({ category }) => {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("universalCart");
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch category services
    const fetchServices = async () => {
      const encodedCategory = encodeURIComponent(category);
      const res = await fetch(`http://localhost:5001/api/services/${encodedCategory}`);
      const data = await res.json();
      setServices(data);
     

    };

    // Check auth user
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch("http://localhost:5001/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      }
    };

    fetchServices();
    checkAuth();
  }, [category]);

  useEffect(() => {
    // Whenever cart changes, save to localStorage
    localStorage.setItem("universalCart", JSON.stringify(cart));
  }, [cart]);

  // Add item or increase quantity
  const addToCart = (item) => {
    if (!user) {
      Swal.fire({ icon: "warning", title: "Please Log In", text: "You need to log in to order." });
      return;
    }
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Decrease quantity or remove item
  const decreaseFromCart = (id) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    if (item.quantity === 1) {
      setCart(cart.filter((c) => c.id !== id));
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c)));
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => setCart([]);

  // Checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({ icon: "warning", title: "Cart Empty", text: "Add some items first!" });
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[80vh] overflow-hidden">
      {/* Services */}
      <div className="w-full lg:w-2/3 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">{category} Services</h2>
        <div className="space-y-3">
          {services.map((item) => (
            <Cards key={item.id} item={item} addToCart={addToCart} isLoggedIn={!!user} />
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-full lg:w-1/3 bg-gray-800 p-4 rounded-lg shadow overflow-y-auto">
        <h3 className="text-white text-lg font-semibold mb-3">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-400">Cart is empty</p>
        ) : (
          <ul className="space-y-3 max-h-[60vh] overflow-auto">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-gray-900 p-3 rounded">
                <div>
                  <p className="text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-xs btn-success" onClick={() => addToCart(item)}>+</button>
                  <button className="btn btn-xs btn-warning" onClick={() => decreaseFromCart(item.id)}>-</button>
                  <button className="btn btn-xs btn-error" onClick={() => removeFromCart(item.id)}>X</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <>
            <div className="mt-4 border-t pt-4 border-gray-600 text-white space-y-3">
              <p>Total: ৳{cart.reduce((t, i) => t + i.price * i.quantity, 0)}</p>
              <button className="btn btn-sm btn-error w-full" onClick={clearCart}>Clear All</button>
              <button className="btn btn-sm btn-success w-full" onClick={proceedToCheckout}>Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UniversalModal;
