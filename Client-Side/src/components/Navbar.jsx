// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthProvider';
// import { FaRegUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
// import {
//   Check,
//   CheckCheck,
//   Trash2,
//   RefreshCw,
//   X,
//   ShoppingCart,
//   AlertCircle,
//   CreditCard,
//   MessageSquare,
//   Package,
//   Filter
// } from 'lucide-react';
// import SigninModals from './Modals/SigninModals';
// import axios from 'axios';
// import { formatDistanceToNow } from 'date-fns';

// const Navbar = () => {
//   const [isSticky, setSticky] = useState(false);
//   const { user, handleLogout } = useContext(AuthContext);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   // Notification states
//   const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const sidebarRef = useRef(null);

//   // Scroll effect
//   useEffect(() => {
//     const handleScroll = () => setSticky(window.scrollY > 0);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Check auth state on initial load
//   useEffect(() => {
//     setIsLoading(false);
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Notification sidebar close
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         if (!event.target.closest('.notification-trigger')) {
//           setNotificationSidebarOpen(false);
//         }
//       }

//       // Close all dropdowns
//       const detailsElements = document.querySelectorAll('details');
//       detailsElements.forEach(detail => {
//         detail.removeAttribute('open');
//       });

//       const dropdowns = document.querySelectorAll('.dropdown:not(.notification-sidebar)');
//       dropdowns.forEach(dropdown => {
//         if (dropdown.hasAttribute('open')) {
//           dropdown.removeAttribute('open');
//         }
//       });
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   // Close all dropdowns function
//   const closeAllDropdowns = () => {
//     const detailsElements = document.querySelectorAll('details');
//     detailsElements.forEach(detail => {
//       detail.removeAttribute('open');
//     });

//     const dropdowns = document.querySelectorAll('.dropdown');
//     dropdowns.forEach(dropdown => {
//       dropdown.removeAttribute('open');
//     });
//     setNotificationSidebarOpen(false);
//   };

//   // Fetch notifications
//   const fetchNotifications = async (showLoading = true) => {
//     try {
//       if (showLoading) setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await axios.get('/api/notifications', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setNotifications(response.data.notifications);
//         setUnreadCount(response.data.unreadCount);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     } finally {
//       if (showLoading) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     }
//   };

//   // Fetch unread count only
//   const fetchUnreadCount = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('/api/notifications/unread-count', {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setUnreadCount(response.data.count);
//       }
//     } catch (error) {
//       console.error('Error fetching unread count:', error);
//     }
//   };

//   // Mark notification as read
//   const markAsRead = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(`/api/notifications/${id}/read`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.map(notif =>
//         notif.id === id ? { ...notif, is_read: true } : notif
//       ));
//       setUnreadCount(prev => Math.max(0, prev - 1));
//     } catch (error) {
//       console.error('Error marking as read:', error);
//     }
//   };

//   // Mark all as read
//   const markAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch('/api/notifications/mark-all-read', {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//     }
//   };

//   // Delete notification
//   const deleteNotification = async (id, e) => {
//     e.stopPropagation();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`/api/notifications/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const deletedNotif = notifications.find(n => n.id === id);
//       setNotifications(prev => prev.filter(notif => notif.id !== id));
//       if (deletedNotif && !deletedNotif.is_read) {
//         setUnreadCount(prev => Math.max(0, prev - 1));
//       }
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//     }
//   };

//   // Refresh notifications
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchNotifications(false);
//     setTimeout(() => setRefreshing(false), 1000);
//   };

//   // Open notification sidebar
//   const handleNotificationClick = () => {
//     setNotificationSidebarOpen(true);
//     fetchNotifications();
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     try {
//       return formatDistanceToNow(new Date(dateString), { addSuffix: true });
//     } catch (error) {
//       return '';
//     }
//   };

//   // Get notification icon
//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'order_cancelled':
//         return <AlertCircle className="w-5 h-5 text-error" />;
//       case 'order_confirmed':
//         return <Check className="w-5 h-5 text-success" />;
//       case 'new_order':
//         return <ShoppingCart className="w-5 h-5 text-info" />;
//       case 'payment_received':
//         return <CreditCard className="w-5 h-5 text-success" />;
//       case 'message':
//         return <MessageSquare className="w-5 h-5 text-primary" />;
//       case 'order_shipped':
//         return <Package className="w-5 h-5 text-warning" />;
//       default:
//         return <FaBell className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   // Get notification color class
//   const getNotificationColor = (type) => {
//     switch (type) {
//       case 'order_cancelled':
//         return 'bg-error/10 border-error/20';
//       case 'order_confirmed':
//         return 'bg-success/10 border-success/20';
//       case 'new_order':
//         return 'bg-info/10 border-info/20';
//       case 'payment_received':
//         return 'bg-success/10 border-success/20';
//       case 'message':
//         return 'bg-primary/10 border-primary/20';
//       default:
//         return 'bg-base-200 border-base-300';
//     }
//   };

//   // Filter notifications
//   const filteredNotifications = notifications.filter(notification => {
//     if (activeFilter === 'all') return true;
//     if (activeFilter === 'unread') return !notification.is_read;
//     if (activeFilter === 'read') return notification.is_read;
//     return true;
//   });

//   // Fetch unread count on user change
//   useEffect(() => {
//     if (user) {
//       fetchUnreadCount();
//       // Poll for new notifications every 30 seconds
//       const interval = setInterval(fetchUnreadCount, 30000);
//       return () => clearInterval(interval);
//     } else {
//       setUnreadCount(0);
//       setNotifications([]);
//     }
//   }, [user]);

//   // Prevent body scroll when sidebar is open
//   useEffect(() => {
//     if (notificationSidebarOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [notificationSidebarOpen]);

//   // Complete navItems with all your menu structure
//   const navItems = (
//     <>
//       <li className='text-md'>
//         <Link to='/' className='hover:text-olympic transition-colors' onClick={closeAllDropdowns}>Home</Link>
//       </li>

//       <li>
//         <details>
//           <summary
//             className='text-md hover:text-olympic transition-colors cursor-pointer'
//             onClick={(e) => e.stopPropagation()}
//           >
//             AC Repair Service
//           </summary>
//           <ul className="p-2 bg-white">
//             <li>
//               <Link
//                 to='/ac-servicing'
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 AC Servicing
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to='/ac-cooling-problem'
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 AC Cooling Problem
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/ac-installation"
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 AC Installation & Uninstallation
//               </Link>
//             </li>
//           </ul>
//         </details>
//       </li>

//       <li className='text-md'>
//         <Link
//           to='/refrigerator-service'
//           className='hover:text-olympic transition-colors'
//           onClick={closeAllDropdowns}
//         >
//           Refrigerator Repair
//         </Link>
//       </li>

//       <li className='text-md'>
//         <Link
//           to='/vrf-vrv-hvac-solution'
//           className='hover:text-olympic transition-colors'
//           onClick={closeAllDropdowns}
//         >
//           VRF/VRV/HVAC Solution
//         </Link>
//       </li>

//       <li>
//         <details>
//           <summary
//             className='text-md hover:text-olympic transition-colors cursor-pointer'
//             onClick={(e) => e.stopPropagation()}
//           >
//             Appliance Repair
//           </summary>
//           <ul className='p-2 bg-white'>
//             <li>
//               <Link
//                 to='/washing-machine-service'
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 Washing Machine Service
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to='/tv-service'
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 TV Service
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/oven-service"
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 Oven Service
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/geyser-service"
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 Geyser Services
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/water-purifier-service"
//                 className='hover:text-olympic transition-colors block py-1'
//                 onClick={closeAllDropdowns}
//               >
//                 Water Purifier Services
//               </Link>
//             </li>
//           </ul>
//         </details>
//       </li>
//     </>
//   );

//   if (isLoading) {
//     return null;
//   }

//   return (
//     <>
//       <header className="text-black bg-white w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
//         <div className={`navbar px-4 lg:px-24 ${isSticky ? "shadow-md bg-white" : ""}`}>

//           {/* Mobile Menu */}
//           <div className="navbar-start">
//             <div className="dropdown">
//               <div
//                 tabIndex={0}
//                 role="button"
//                 className="btn btn-ghost lg:hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
//                 </svg>
//               </div>
//               <ul
//                 tabIndex={0}
//                 className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
//                 onClick={closeAllDropdowns}
//               >
//                 {navItems}
//               </ul>
//             </div>
//             <Link
//               to='/'
//               className="btn btn-ghost text-xl"
//               onClick={closeAllDropdowns}
//             >
//               Pacific
//             </Link>
//           </div>

//           {/* Desktop Menu */}
//           <div className="navbar-center hidden lg:flex">
//             <ul
//               className="menu menu-horizontal px-1 gap-2"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {navItems}
//             </ul>
//           </div>

//           {/* Auth & Notification Section */}
//           <div className="navbar-end flex items-center gap-2">
//             {/* Notification Bell */}
//             {user && (
//               <div className="relative">
//                 <button
//                   className="btn btn-ghost btn-circle notification-trigger"
//                   onClick={handleNotificationClick}
//                 >
//                   <FaBell className="text-xl" />
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 min-h-5 text-xs font-bold text-white bg-error rounded-full px-1 animate-pulse">
//                       {unreadCount > 99 ? '99+' : unreadCount}
//                     </span>
//                   )}
//                 </button>
//               </div>
//             )}

//             {/* User Profile */}
//             {user ? (
//               <div
//                 className="dropdown dropdown-end"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div
//                   tabIndex={0}
//                   role="button"
//                   className="btn btn-ghost btn-circle avatar"
//                 >
//                   <div className="w-10 rounded-full items-center">
//                     {user.photo ? (
//                       <img
//                         src={user.photo.startsWith('http') ? user.photo : `http://localhost:5001${user.photo}`}
//                         alt="Profile"
//                       />
//                     ) : (
//                       <FaRegUser className="text-lg text-center justify-center" />
//                     )}
//                   </div>
//                 </div>
//                 <ul
//                   tabIndex={0}
//                   className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
//                 >
//                   <li>
//                     <Link
//                       to="/profile"
//                       onClick={closeAllDropdowns}
//                     >
//                       Profile
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       to="/orders"
//                       onClick={closeAllDropdowns}
//                     >
//                       Orders
//                     </Link>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         handleLogout();
//                         navigate("/");
//                         closeAllDropdowns();
//                       }}
//                     >
//                       <FaSignOutAlt className="mr-1" /> Logout
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             ) : (
//               <button
//                 onClick={() => document.getElementById("nav_modal").showModal()}
//                 className="btn flex items-center gap-2 rounded-full px-6 bg-olympic text-white hover:bg-olympic-dark"
//               >
//                 <FaRegUser /> Login
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Signin Modal */}
//         <SigninModals />
//       </header>

//       {/* Notification Sidebar */}
//       {notificationSidebarOpen && (
//         <>
//           {/* Backdrop */}
//           <div
//             className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
//             onClick={() => setNotificationSidebarOpen(false)}
//           />

//           {/* Sidebar */}
//           <div
//             ref={sidebarRef}
//             className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out notification-sidebar"
//             style={{ transform: notificationSidebarOpen ? 'translateX(0)' : 'translateX(100%)' }}
//           >
//             <div className="flex flex-col h-full">
//               {/* Header - bg-olympic class ব্যবহার */}
//               <div className="flex items-center justify-between p-4 border-b border-base-300 bg-olympic">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-white/20">
//                     <FaBell className="w-6 h-6 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-white">Notifications</h2>
//                     <p className="text-sm text-white/80">
//                       {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     className={`btn btn-ghost btn-circle btn-sm ${refreshing ? 'loading' : ''} hover:bg-white/20`}
//                     onClick={handleRefresh}
//                     disabled={refreshing}
//                   >
//                     {!refreshing && <RefreshCw className="w-4 h-4 text-white" />}
//                   </button>
//                   <button
//                     className="btn btn-ghost btn-circle btn-sm hover:bg-white/20"
//                     onClick={() => setNotificationSidebarOpen(false)}
//                   >
//                     <X className="w-5 h-5 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Filters */}
//               <div className="p-4 border-b border-base-300">
//                 <div className="flex gap-2 overflow-x-auto pb-1">
//                   <button
//                     className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary bg-olympic border-olympic' : 'btn-ghost'}`}
//                     onClick={() => setActiveFilter('all')}
//                   >
//                     All ({notifications.length})
//                   </button>
//                   <button
//                     className={`btn btn-sm ${activeFilter === 'unread' ? 'btn-primary bg-olympic border-olympic' : 'btn-ghost'}`}
//                     onClick={() => setActiveFilter('unread')}
//                   >
//                     Unread ({notifications.filter(n => !n.is_read).length})
//                   </button>
//                   <button
//                     className={`btn btn-sm ${activeFilter === 'read' ? 'btn-primary bg-olympic border-olympic' : 'btn-ghost'}`}
//                     onClick={() => setActiveFilter('read')}
//                   >
//                     Read ({notifications.filter(n => n.is_read).length})
//                   </button>
//                 </div>
//               </div>

//               {/* Notifications List */}
//               <div className="flex-1 overflow-y-auto">
//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center h-full p-8">
//                     <span className="loading loading-spinner loading-lg text-olympic mb-4"></span>
//                     <p className="text-base-content/60">Loading notifications...</p>
//                   </div>
//                 ) : filteredNotifications.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full p-8 text-center">
//                     <FaBell className="w-20 h-20 text-base-300 mb-4" />
//                     <h3 className="text-lg font-semibold mb-2">No notifications</h3>
//                     <p className="text-base-content/60">
//                       {activeFilter === 'unread'
//                         ? "You're all caught up!"
//                         : "No notifications found"}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-base-300">
//                     {filteredNotifications.map((notification) => (
//                       <div
//                         key={notification.id}
//                         className={`p-4 hover:bg-base-200 transition-colors duration-200 cursor-pointer ${!notification.is_read ? 'bg-olympic/5' : ''
//                           }`}
//                         onClick={() => markAsRead(notification.id)}
//                       >
//                         <div className="flex gap-3">
//                           <div className="flex-shrink-0">
//                             <div className={`p-3 rounded-xl ${getNotificationColor(notification.type)}`}>
//                               {getNotificationIcon(notification.type)}
//                             </div>
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex justify-between items-start mb-1">
//                               <h4 className={`font-semibold ${!notification.is_read ? 'text-olympic' : 'text-base-content'
//                                 }`}>
//                                 {notification.title}
//                               </h4>
//                               <button
//                                 className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-error-content"
//                                 onClick={(e) => deleteNotification(notification.id, e)}
//                               >
//                                 <Trash2 className="w-3 h-3" />
//                               </button>
//                             </div>
//                             <p className="text-sm text-base-content/80 mb-2">
//                               {notification.message}
//                             </p>
//                             <div className="flex items-center justify-between">
//                               <span className="text-xs text-base-content/60">
//                                 {formatDate(notification.created_at)}
//                               </span>
//                               {!notification.is_read && (
//                                 <span className="badge badge-primary badge-sm bg-olympic border-olympic animate-pulse">
//                                   New
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Footer Actions */}
//               <div className="p-4 border-t border-base-300 bg-base-200/50">
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <button
//                     className="btn btn-primary flex-1 bg-olympic border-olympic hover:bg-olympic-dark"
//                     onClick={markAllAsRead}
//                     disabled={unreadCount === 0}
//                   >
//                     <CheckCheck className="w-4 h-4 mr-2" />
//                     Mark all as read
//                   </button>
//                   <button
//                     className="btn btn-outline flex-1 border-olympic text-olympic hover:bg-olympic hover:text-white"
//                     onClick={() => {
//                       setNotificationSidebarOpen(false);
//                       navigate('/notifications');
//                     }}
//                   >
//                     View all
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;

import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import { FaRegUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
import {
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  X,
  ShoppingCart,
  AlertCircle,
  CreditCard,
  MessageSquare,
  Package,
  Filter
} from 'lucide-react';
import SigninModals from './Modals/SigninModals';
import api from '../api'; // Import the configured axios instance
import { formatDistanceToNow } from 'date-fns';

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user, handleLogout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Notification states
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const sidebarRef = useRef(null);

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
    const handleClickOutside = (event) => {
      // Notification sidebar close
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (!event.target.closest('.notification-trigger')) {
          setNotificationSidebarOpen(false);
        }
      }

      // Close all dropdowns
      const detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(detail => {
        detail.removeAttribute('open');
      });

      const dropdowns = document.querySelectorAll('.dropdown:not(.notification-sidebar)');
      dropdowns.forEach(dropdown => {
        if (dropdown.hasAttribute('open')) {
          dropdown.removeAttribute('open');
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close all dropdowns function
  const closeAllDropdowns = () => {
    const detailsElements = document.querySelectorAll('details');
    detailsElements.forEach(detail => {
      detail.removeAttribute('open');
    });

    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.removeAttribute('open');
    });
    setNotificationSidebarOpen(false);
  };

  // Fetch notifications - REMOVED /api prefix
  const fetchNotifications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/notifications', {  // ✅ Removed /api
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      if (showLoading) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Fetch unread count only - REMOVED /api prefix
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/notifications/unread-count', {  // ✅ Removed /api
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read - REMOVED /api prefix
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/notifications/${id}/read`, {}, {  // ✅ Removed /api
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.map(notif =>
        notif.id === id ? { ...notif, is_read: true } : notif
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read - REMOVED /api prefix
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.patch('/notifications/mark-all-read', {}, {  // ✅ Removed /api
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification - REMOVED /api prefix
  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/notifications/${id}`, {  // ✅ Removed /api
        headers: { Authorization: `Bearer ${token}` }
      });

      const deletedNotif = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Refresh notifications
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(false);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Open notification sidebar
  const handleNotificationClick = () => {
    setNotificationSidebarOpen(true);
    fetchNotifications();
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  // Get notification icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_cancelled':
        return <AlertCircle className="w-5 h-5 text-error" />;
      case 'order_confirmed':
        return <Check className="w-5 h-5 text-success" />;
      case 'new_order':
        return <ShoppingCart className="w-5 h-5 text-info" />;
      case 'payment_received':
        return <CreditCard className="w-5 h-5 text-success" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'order_shipped':
        return <Package className="w-5 h-5 text-warning" />;
      default:
        return <FaBell className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get notification color class
  const getNotificationColor = (type) => {
    switch (type) {
      case 'order_cancelled':
        return 'bg-error/10 border-error/20';
      case 'order_confirmed':
        return 'bg-success/10 border-success/20';
      case 'new_order':
        return 'bg-info/10 border-info/20';
      case 'payment_received':
        return 'bg-success/10 border-success/20';
      case 'message':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-base-200 border-base-300';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.is_read;
    if (activeFilter === 'read') return notification.is_read;
    return true;
  });

  // Fetch unread count on user change
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [user]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (notificationSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [notificationSidebarOpen]);

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
    <>
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

          {/* Auth & Notification Section */}
          <div className="navbar-end flex items-center gap-2">
            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  className="btn btn-ghost btn-circle notification-trigger"
                  onClick={handleNotificationClick}
                >
                  <FaBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 min-h-5 text-xs font-bold text-white bg-error rounded-full px-1 animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* User Profile */}
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
                        src={user.photo.startsWith('http') ? user.photo : `${import.meta.env.VITE_API_URL}${user.photo}`}
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

      {/* Notification Sidebar */}
      {notificationSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setNotificationSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            ref={sidebarRef}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out notification-sidebar"
            style={{ transform: notificationSidebarOpen ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="flex flex-col h-full">
              {/* Header - bg-olympic class ব্যবহার */}
              <div className="flex items-center justify-between p-4 border-b border-base-300 bg-olympic">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <FaBell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Notifications</h2>
                    <p className="text-sm text-white/80">
                      {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`btn btn-ghost btn-circle btn-sm ${refreshing ? 'loading' : ''} hover:bg-white/20`}
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {!refreshing && <RefreshCw className="w-4 h-4 text-white" />}
                  </button>
                  <button
                    className="btn btn-ghost btn-circle btn-sm hover:bg-white/20"
                    onClick={() => setNotificationSidebarOpen(false)}
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-base-300">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary bg-olympic border-olympic' : 'btn-ghost'}`}
                    onClick={() => setActiveFilter('all')}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    className={`btn btn-sm ${activeFilter === 'unread' ? 'btn-primary bg-olympic border-olympic' : 'btn-ghost'}`}
                    onClick={() => setActiveFilter('unread')}
                  >
                    Unread ({notifications.filter(n => !n.is_read).length})
                  </button>
                  <button
                    className={`btn btn-sm ${activeFilter === 'read' ? 'btn-primary bg-olympic border-olympic' : 'btn-ghost'}`}
                    onClick={() => setActiveFilter('read')}
                  >
                    Read ({notifications.filter(n => n.is_read).length})
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <span className="loading loading-spinner loading-lg text-olympic mb-4"></span>
                    <p className="text-base-content/60">Loading notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <FaBell className="w-20 h-20 text-base-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-base-content/60">
                      {activeFilter === 'unread'
                        ? "You're all caught up!"
                        : "No notifications found"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-base-300">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-base-200 transition-colors duration-200 cursor-pointer ${!notification.is_read ? 'bg-olympic/5' : ''
                          }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`p-3 rounded-xl ${getNotificationColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`font-semibold ${!notification.is_read ? 'text-olympic' : 'text-base-content'
                                }`}>
                                {notification.title}
                              </h4>
                              <button
                                className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-error-content"
                                onClick={(e) => deleteNotification(notification.id, e)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-sm text-base-content/80 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-base-content/60">
                                {formatDate(notification.created_at)}
                              </span>
                              {!notification.is_read && (
                                <span className="badge badge-primary badge-sm bg-olympic border-olympic animate-pulse">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-base-300 bg-base-200/50">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className="btn btn-primary flex-1 bg-olympic border-olympic hover:bg-olympic-dark"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark all as read
                  </button>
                  <button
                    className="btn btn-outline flex-1 border-olympic text-olympic hover:bg-olympic hover:text-white"
                    onClick={() => {
                      setNotificationSidebarOpen(false);
                      navigate('/notifications');
                    }}
                  >
                    View all
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;