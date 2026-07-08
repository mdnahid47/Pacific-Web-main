
import React, { useEffect, useState } from "react";
import Cards from "../Cards";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { FiPackage, FiAlertCircle } from "react-icons/fi"; // আইকন যোগ করুন

const UniversalModal = ({ category }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // loading state যোগ করুন
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("universalCart");
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch category services
    const fetchServices = async () => {
      setLoading(true); // loading শুরু
      try {
        const encodedCategory = encodeURIComponent(category);
        const response = await api.get(`/services/${encodedCategory}`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]); // error হলে খালি array সেট করুন
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load services. Please try again."
        });
      } finally {
        setLoading(false); // loading শেষ
      }
    };

    // Check auth user
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.post(
            "/auth/verify",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) setUser(response.data.user);
        } catch (error) {
          console.error("Auth verification error:", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
      }
    };

    fetchServices();
    checkAuth();
  }, [category]);

  useEffect(() => {
    localStorage.setItem("universalCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please Log In",
        text: "You need to log in to order.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Login Now"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const decreaseFromCart = (id) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    if (item.quantity === 1) {
      setCart(cart.filter((c) => c.id !== id));
    } else {
      setCart(cart.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c)));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart Empty",
        text: "Add some items first!",
        confirmButtonColor: "#3085d6"
      });
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[80vh] overflow-hidden">
      {/* Services */}
      <div className="w-full lg:w-2/3 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">{category} Services</h2>
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400">Loading services...</p>
          </div>
        )}

        {/* No Services Available Message */}
        {!loading && services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-800/50 rounded-lg">
            <FiPackage className="text-6xl text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Services Available</h3>
            <p className="text-white text-center max-w-md">
              We're currently updating our {category} services. 
              Please check back later or explore other categories.
            </p>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-sm btn-primary"
              >
                Refresh
              </button>
              <button 
                onClick={() => navigate("/services")}
                className="btn btn-sm btn-ghost"
              >
                Browse All Services
              </button>
            </div>
          </div>
        )}

        {/* Services List */}
        {!loading && services.length > 0 && (
          <div className="space-y-3">
            {services.map((item) => (
              <Cards key={item.id} item={item} addToCart={addToCart} isLoggedIn={!!user} />
            ))}
          </div>
        )}
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
                  <p className="text-sm text-green-400">৳{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-xs btn-success" 
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                  <button 
                    className="btn btn-xs btn-warning" 
                    onClick={() => decreaseFromCart(item.id)}
                  >
                    -
                  </button>
                  <button 
                    className="btn btn-xs btn-error" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <>
            <div className="mt-4 border-t pt-4 border-gray-600 text-white space-y-3">
              <p className="text-lg font-semibold">
                Total: ৳{cart.reduce((t, i) => t + i.price * i.quantity, 0)}
              </p>
              <button 
                className="btn btn-sm btn-error w-full" 
                onClick={clearCart}
              >
                Clear All
              </button>
              <button 
                className="btn btn-sm btn-success w-full" 
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UniversalModal;