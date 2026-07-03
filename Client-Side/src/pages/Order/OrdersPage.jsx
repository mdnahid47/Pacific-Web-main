// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import {
//   FaShoppingBag,
//   FaClock,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaFilter,
//   FaUndo,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaBan,
//   FaSearch,
//   FaStar,
//   FaUser,
//   FaPhone,
//   FaTruck,
//   FaEye,
//   FaListUl,
//   FaHome,
//   FaBuilding,
//   FaInfoCircle,
//   FaUserTag,
//   FaPhoneAlt,
//   FaCog,
//   FaUserCheck,
//   FaMotorcycle,
//   FaExclamationTriangle,
//   FaMoneyBillWave,
//   FaPlayCircle,
//   FaUserTie,
//   FaBriefcase,
//   FaHistory,
//   FaCertificate,
//   FaUserTimes,
//   FaUserShield
// } from "react-icons/fa";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [filterType, setFilterType] = useState("active");
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [cancelReason, setCancelReason] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showTrackModal, setShowTrackModal] = useState(false);
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [detailedOrder, setDetailedOrder] = useState(null);
//   const [vendorDetails, setVendorDetails] = useState(null);
//   const [reviewData, setReviewData] = useState({
//     serviceExpert: 5,
//     websiteService: 5,
//     comments: ""
//   });
//   const [cancelFeeAccepted, setCancelFeeAccepted] = useState(false);
//   const [showHoldChargeModal, setShowHoldChargeModal] = useState(false);
//   const [showCancellationSummary, setShowCancellationSummary] = useState(false);
//   const [vendorLoading, setVendorLoading] = useState(false);
//   const [userRole, setUserRole] = useState('user');
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [newSchedule, setNewSchedule] = useState({
//     date: "",
//     timeSlot: ""
//   });

//   // 8 AM থেকে 9 PM পর্যন্ত টাইম স্লট
//   const timeSlots = [
//     "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
//     "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
//     "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
//     "20:00-21:00"
//   ];

//   // Check user role on component mount
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         setUserRole(payload.role || 'user');
//       } catch (error) {
//         console.error('Error parsing token:', error);
//       }
//     }
//   }, []);

//   // Fetch orders function
//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5001/api/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const processedOrders = res.data.orders.map(order => {
//         let status = order.status;
//         let serviceStarted = checkServiceStartStatus(order);

//         // Parse addresses with improved logic
//         const parseAddress = (address) => {
//           if (!address || address === "null" || address === "") return {};
//           try {
//             if (typeof address === "string") {
//               // Clean the string
//               let cleanStr = address.trim();
//               // Remove surrounding quotes if present
//               if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
//                 cleanStr = cleanStr.slice(1, -1);
//               }
//               if (cleanStr.startsWith("'") && cleanStr.endsWith("'")) {
//                 cleanStr = cleanStr.slice(1, -1);
//               }

//               // Try to parse as JSON
//               try {
//                 const parsed = JSON.parse(cleanStr);
//                 if (parsed && typeof parsed === 'object') {
//                   return parsed;
//                 }
//               } catch (e) {
//                 // If not JSON, check format
//                 if (cleanStr.includes('{') || cleanStr.includes('}')) {
//                   // Might be malformed JSON, try to fix
//                   try {
//                     const fixed = cleanStr
//                       .replace(/(\w+):/g, '"$1":')
//                       .replace(/'/g, '"');
//                     const parsed = JSON.parse(fixed);
//                     if (parsed && typeof parsed === 'object') {
//                       return parsed;
//                     }
//                   } catch (fixError) {
//                     console.log('Failed to fix JSON:', fixError);
//                   }
//                 }
//                 // Return as simple address object
//                 return { full_address: cleanStr };
//               }
//             } else if (typeof address === 'object') {
//               return address;
//             }
//           } catch (error) {
//             console.error("Error parsing address:", error);
//           }
//           return {};
//         };

//         return {
//           ...order,
//           status: status,
//           service_started: serviceStarted,
//           parsed_cart_items: order.cart_items ?
//             (typeof order.cart_items === "string" ? JSON.parse(order.cart_items) : order.cart_items) : [],
//           parsed_home_address: parseAddress(order.home_address),
//           parsed_office_address: parseAddress(order.office_address),
//           parsed_temp_address: parseAddress(order.temp_address),
//           cancelled_by: order.cancelled_by || null,
//           schedule_changed: order.schedule_changed || false,
//           schedule_changed_date: order.schedule_changed_date,
//           original_order_date: order.original_order_date,
//           original_time_slot: order.original_time_slot
//         };
//       });

//       const sortedOrders = [...processedOrders].sort((a, b) =>
//         new Date(b.order_date) - new Date(a.order_date)
//       );

//       setOrders(sortedOrders);

//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       Swal.fire("Error", "Failed to load orders", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check service start status
//   const checkServiceStartStatus = (order) => {
//     try {
//       if (order.service_started_date) {
//         return true;
//       }

//       if (order.time_slot && order.order_date) {
//         const orderDate = new Date(order.order_date);
//         const [startTimeStr] = order.time_slot.split('-');
//         const [hours, minutes] = startTimeStr.split(':').map(Number);

//         const serviceStartTime = new Date(orderDate);
//         serviceStartTime.setHours(hours, minutes, 0, 0);

//         const now = new Date();
//         return now >= serviceStartTime;
//       }

//       return false;
//     } catch (error) {
//       console.error("Error checking service start:", error);
//       return false;
//     }
//   };

//   const hasServiceStarted = (order) => {
//     if (!order) return false;

//     const validStatuses = ['Active', 'Processing', 'Started', 'Expert Assigned'];
//     if (!validStatuses.includes(order.status)) {
//       return false;
//     }

//     return order.service_started || checkServiceStartStatus(order);
//   };

//   // শিডিউল চেঞ্জ মোডাল ওপেন
//   const openScheduleModal = (order) => {
//     setSelectedOrder(order);
//     // Current date থেকে 1 দিন পরের date সেট করুন
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const formattedDate = tomorrow.toISOString().split('T')[0];

//     setNewSchedule({
//       date: formattedDate,
//       timeSlot: order.time_slot || ""
//     });
//     setShowScheduleModal(true);
//   };

//   // শিডিউল চেঞ্জ ক্লোজ
//   const closeScheduleModal = () => {
//     setShowScheduleModal(false);
//     setSelectedOrder(null);
//     setNewSchedule({
//       date: "",
//       timeSlot: ""
//     });
//   };

//   // শিডিউল আপডেট করুন
//   const handleScheduleChange = async () => {
//     if (!selectedOrder || !newSchedule.date || !newSchedule.timeSlot) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Please select both date and time slot!',
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const orderId = selectedOrder.order_id;

//       const response = await axios.patch(
//         `http://localhost:5001/api/orders/${encodeURIComponent(orderId)}/schedule`,
//         {
//           newDate: newSchedule.date,
//           newTimeSlot: newSchedule.timeSlot
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Schedule Updated!',
//           html: `
//             <div class="text-center">
//               <p><strong>Order ID:</strong> ${orderId}</p>
//               <p><strong>Old Schedule:</strong> ${new Date(selectedOrder.order_date).toLocaleDateString()} at ${formatTimeSlotDisplay(selectedOrder.time_slot)}</p>
//               <p><strong>New Schedule:</strong> ${new Date(newSchedule.date).toLocaleDateString()} at ${formatTimeSlotDisplay(newSchedule.timeSlot)}</p>
//               <p class="text-sm text-green-600 mt-2">
//                 Schedule has been updated successfully!
//               </p>
//             </div>
//           `,
//           timer: 3000,
//           showConfirmButton: true
//         });

//         await fetchOrders();
//         closeScheduleModal();

//         if (showDetailsModal) closeDetailsModal();
//         if (showTrackModal) closeTrackModal();
//       }
//     } catch (error) {
//       console.error("Schedule change error:", error);

//       let errorMessage = 'Failed to update schedule. Please try again.';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }

//       Swal.fire({
//         icon: 'error',
//         title: 'Failed',
//         text: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const openTrackModal = async (order) => {
//     setSelectedOrder(order);
//     setVendorDetails(null);

//     if (order.vendor_id || order.service_expert) {
//       await fetchVendorDetails(order.vendor_id || order.service_expert);
//     }

//     setShowTrackModal(true);
//   };

//   const closeTrackModal = () => {
//     setShowTrackModal(false);
//     setSelectedOrder(null);
//     setVendorDetails(null);
//   };

//   // Fetch vendor details
//   const fetchVendorDetails = async (vendorId) => {
//     if (!vendorId) return null;

//     try {
//       setVendorLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5001/api/vendors/${vendorId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         const vendor = res.data.vendor;
//         setVendorDetails(vendor);
//         return vendor;
//       }

//       return getMockVendorData(vendorId);
//     } catch (error) {
//       console.error("Error fetching vendor details:", error);
//       return getMockVendorData(vendorId);
//     } finally {
//       setVendorLoading(false);
//     }
//   };

//   const getMockVendorData = (vendorId) => {
//     const mockData = {
//       id: vendorId,
//       name: "Md. Rahim Khan",
//       phone: "+8801712345678",
//       email: "rahim.khan@example.com",
//       photo_url: null,
//       rating: 4.7,
//       completed_orders: 124,
//       experience_years: 3,
//       specialization: "Home Cleaning & Maintenance",
//       vehicle_type: "Motorcycle",
//       working_hours: "9:00 AM - 6:00 PM",
//       location: "Mirpur, Dhaka",
//       service_radius: 15,
//       verified: true,
//       success_rate: 98,
//       avg_rating: 4.7,
//       wallet_balance: 12500,
//       join_date: "2022-05-15",
//       languages: ["Bengali", "English"],
//       skills: ["Cleaning", "Repair", "Maintenance"]
//     };

//     setVendorDetails(mockData);
//     return mockData;
//   };

//   const openCancelModal = async (order) => {
//     setSelectedOrder(order);
//     setCancelReason("");
//     setCancelFeeAccepted(false);

//     const serviceStarted = hasServiceStarted(order);
//     const isVendorAssigned = !!(order.vendor_id || order.service_expert);
//     const canCancel = !(order.status === 'Completed' || order.status === 'Cancelled');

//     if (!canCancel) {
//       Swal.fire({
//         icon: 'info',
//         title: 'Cannot Cancel',
//         text: 'This order cannot be cancelled.',
//         timer: 2000
//       });
//       return;
//     }

//     if (serviceStarted && isVendorAssigned) {
//       setShowHoldChargeModal(true);
//     } else {
//       setShowCancelModal(true);
//     }
//   };

//   const closeCancelModal = () => {
//     setShowCancelModal(false);
//     setSelectedOrder(null);
//     setCancelReason("");
//   };

//   const closeHoldChargeModal = () => {
//     setShowHoldChargeModal(false);
//     setSelectedOrder(null);
//     setCancelReason("");
//     setCancelFeeAccepted(false);
//   };

//   const closeCancellationSummary = () => {
//     setShowCancellationSummary(false);
//     setSelectedOrder(null);
//     setCancelReason("");
//     setCancelFeeAccepted(false);
//   };

//   // Handle hold charge
//   const handleHoldCharge = async () => {
//     if (!selectedOrder || !selectedOrder.order_id) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'No order selected.',
//       });
//       return;
//     }

//     if (!cancelReason) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Please select a cancel reason!',
//       });
//       return;
//     }

//     setShowHoldChargeModal(false);
//     setShowCancellationSummary(true);
//   };

//   // Confirm cancellation with penalty
//   const confirmCancellation = async () => {
//     if (!selectedOrder || !selectedOrder.order_id) {
//       console.error("❌ No order selected");
//       return;
//     }

//     if (!cancelReason) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Please select a cancel reason!',
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const orderId = selectedOrder.order_id;

//       const encodedOrderId = encodeURIComponent(orderId);
//       const url = `http://localhost:5001/api/orders/${encodedOrderId}/cancel`;

//       const response = await axios.patch(
//         url,
//         {
//           reason: cancelReason,
//           penaltyFee: 500,
//           accept_fee: true
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Order Cancelled!',
//           html: `
//             <div class="text-center">
//               <p><strong>Order ID:</strong> ${orderId}</p>
//               <p><strong>Status:</strong> Cancelled by You</p>
//               <p><strong>Penalty Fee:</strong> ৳500</p>
//               <p><strong>Reason:</strong> ${cancelReason}</p>
//               <p class="text-sm text-gray-600 mt-2">
//                 The penalty fee has been charged for service time and transportation.
//               </p>
//             </div>
//           `,
//           timer: 3000,
//           showConfirmButton: true
//         });

//         await fetchOrders();

//         setShowCancellationSummary(false);
//         if (showTrackModal) setShowTrackModal(false);
//         if (showDetailsModal) setShowDetailsModal(false);

//         setSelectedOrder(null);
//         setCancelReason("");
//         setCancelFeeAccepted(false);
//       }
//     } catch (error) {
//       console.error("❌ Cancellation error:", error);

//       let errorMessage = 'Failed to cancel order. Please try again.';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.status === 404) {
//         errorMessage = 'Order not found.';
//       } else if (error.response?.status === 400) {
//         errorMessage = error.response.data.message || 'Cannot cancel this order.';
//       }

//       Swal.fire({
//         icon: 'error',
//         title: 'Failed',
//         text: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle regular cancellation (no penalty)
//   const handleCancelOrder = async () => {
//     if (!selectedOrder || !selectedOrder.order_id) {
//       console.error("❌ No order selected");
//       return;
//     }

//     if (!cancelReason) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Oops...',
//         text: 'Please select a cancel reason!',
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const orderId = selectedOrder.order_id;

//       const encodedOrderId = encodeURIComponent(orderId);
//       const url = `http://localhost:5001/api/orders/${encodedOrderId}/cancel`;

//       const response = await axios.patch(
//         url,
//         {
//           reason: cancelReason,
//           penaltyFee: 0
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Cancelled!',
//           text: response.data.message || 'Order cancelled successfully.',
//           timer: 2000,
//           showConfirmButton: false
//         });

//         await fetchOrders();
//         closeCancelModal();
//         if (showTrackModal) setShowTrackModal(false);
//         if (showDetailsModal) setShowDetailsModal(false);
//       }
//     } catch (error) {
//       console.error("Regular cancel error:", error);

//       let errorMessage = 'Failed to cancel order.';
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }

//       Swal.fire({
//         icon: 'error',
//         title: 'Failed',
//         text: errorMessage,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openReviewModal = (order) => {
//     setSelectedOrder(order);
//     setShowReviewModal(true);
//   };

//   const closeReviewModal = () => {
//     setShowReviewModal(false);
//     setSelectedOrder(null);
//     setReviewData({
//       serviceExpert: 5,
//       websiteService: 5,
//       comments: ""
//     });
//   };

//   const openDetailsModal = async (order) => {
//     if (!order) {
//       console.error("No order provided to openDetailsModal");
//       Swal.fire("Error", "Order data not found", "error");
//       return;
//     }

//     setSelectedOrder(order);

//     setDetailedOrder({
//       order_id: order.order_id,
//       status: order.status || "Pending",
//       order_date: order.order_date,
//       time_slot: order.time_slot,
//       address_type: order.address_type,
//       recipient_name: order.recipient_name,
//       recipient_phone: order.recipient_phone,
//       notes: order.notes,
//       vendor_id: order.vendor_id,
//       service_expert: order.service_expert,
//       parsed_cart_items: order.parsed_cart_items || [],
//       parsed_home_address: order.parsed_home_address || {},
//       parsed_office_address: order.parsed_office_address || {},
//       parsed_temp_address: order.parsed_temp_address || {},
//       delivery_charge: order.delivery_charge || 0,
//       discount: order.discount || 0,
//       checkout_charge: order.checkout_charge || 0,
//       cancel_reason: order.cancel_reason,
//       cancelled_by: order.cancelled_by,
//       service_started: order.service_started,
//       service_started_date: order.service_started_date,
//       vendor_assigned_date: order.vendor_assigned_date,
//       processing_date: order.processing_date,
//       completed_date: order.completed_date,
//       cancelled_date: order.cancelled_date,
//       reviews: order.reviews,
//       charge_status: order.charge_status,
//       penalty_fee: order.penalty_fee,
//       schedule_changed: order.schedule_changed,
//       schedule_changed_date: order.schedule_changed_date,
//       original_order_date: order.original_order_date,
//       original_time_slot: order.original_time_slot
//     });

//     setShowDetailsModal(true);

//     if (order.vendor_id) {
//       try {
//         await fetchVendorDetails(order.vendor_id);
//       } catch (error) {
//         console.error("Error fetching vendor details:", error);
//       }
//     }
//   };

//   const closeDetailsModal = () => {
//     setShowDetailsModal(false);
//     setTimeout(() => {
//       setDetailedOrder(null);
//       setVendorDetails(null);
//       setSelectedOrder(null);
//     }, 300);
//   };

//   const handleSubmitReview = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `http://localhost:5001/api/orders/${encodeURIComponent(selectedOrder.order_id)}/review`,
//         reviewData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       await Swal.fire({
//         icon: 'success',
//         title: 'Review Submitted!',
//         text: 'Thank you for your feedback.',
//         timer: 2000,
//         showConfirmButton: false
//       });

//       fetchOrders();
//       closeReviewModal();
//     } catch (error) {
//       console.error("Review error:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Failed',
//         text: 'Failed to submit review.',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReorder = async (order) => {
//     const token = localStorage.getItem("token");
//     try {
//       const cartItems = order.parsed_cart_items || [];

//       let address = {};
//       let addressType = "home";

//       if (order.address_type === "office" && order.parsed_office_address) {
//         address = order.parsed_office_address;
//         addressType = "office";
//       } else if (order.address_type === "another" && order.parsed_temp_address) {
//         address = order.parsed_temp_address;
//         addressType = "another";
//       } else if (order.parsed_home_address) {
//         address = order.parsed_home_address;
//         addressType = "home";
//       }

//       const reorderData = {
//         category: order.order_id.split("#")[1]?.replace(/\d+/g, "") || "General",
//         cart: cartItems,
//         selectedDate: new Date().toISOString().split('T')[0],
//         selectedSlot: order.time_slot,
//         notes: order.notes || "",
//         addressType: addressType,
//         address: JSON.stringify(address),
//         recipientName: order.recipient_name || "Customer",
//         recipientPhone: order.recipient_phone || ""
//       };

//       const response = await axios.post(
//         "http://localhost:5001/api/place-order",
//         reorderData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       if (response.data.success) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Success!',
//           text: `Order placed successfully! Order ID: ${response.data.orderId}`,
//         });
//         fetchOrders();
//       }
//     } catch (err) {
//       console.error("Reorder failed:", err.response?.data || err);
//       Swal.fire({
//         icon: 'error',
//         title: 'Reorder Failed',
//         text: err.response?.data?.message || 'Failed to reorder. Please try again.',
//       });
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "Pending": return <FaClock className="text-yellow-500" />;
//       case "Processing": return <FaCog className="text-orange-500" />;
//       case "Expert Assigned": return <FaUserCheck className="text-blue-500" />;
//       case "Active": return <FaTruck className="text-blue-500" />;
//       case "Started": return <FaPlayCircle className="text-green-500" />;
//       case "Completed": return <FaCheckCircle className="text-green-500" />;
//       case "Cancelled": return <FaTimesCircle className="text-red-500" />;
//       default: return <FaClock className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending": return "bg-yellow-100 text-yellow-800";
//       case "Processing": return "bg-orange-100 text-orange-800";
//       case "Expert Assigned": return "bg-blue-100 text-blue-800";
//       case "Active": return "bg-blue-100 text-blue-800";
//       case "Started": return "bg-green-100 text-green-800";
//       case "Completed": return "bg-green-100 text-green-800";
//       case "Cancelled": return "bg-red-100 text-red-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   // এড্রেস দেখানোর ফাংশন - ইউজার ফ্রেন্ডলি
//   const getAddressForDisplay = (order) => {
//     if (!order) return "No address specified";

//     try {
//       // Priority: parsed addresses > original addresses
//       let addressObj = {};

//       // Check which address to use based on address_type
//       if (order.address_type === "office" && order.parsed_office_address && Object.keys(order.parsed_office_address).length > 0) {
//         addressObj = order.parsed_office_address;
//       } else if (order.address_type === "another" && order.parsed_temp_address && Object.keys(order.parsed_temp_address).length > 0) {
//         addressObj = order.parsed_temp_address;
//       } else if (order.parsed_home_address && Object.keys(order.parsed_home_address).length > 0) {
//         addressObj = order.parsed_home_address;
//       }

//       // If parsed addresses are empty, try original addresses
//       if (!addressObj || Object.keys(addressObj).length === 0) {
//         if (order.home_address && order.home_address !== "null") {
//           try {
//             if (typeof order.home_address === 'string') {
//               // Try to parse as JSON
//               try {
//                 addressObj = JSON.parse(order.home_address);
//               } catch (e) {
//                 // If parsing fails, use as string
//                 return order.home_address;
//               }
//             } else {
//               addressObj = order.home_address;
//             }
//           } catch (e) {
//             // If parsing fails, use as string
//             return order.home_address || "Address not specified";
//           }
//         }
//       }

//       // Format the address for display
//       if (addressObj && typeof addressObj === 'object') {
//         // First check for full_address
//         if (addressObj.full_address && addressObj.full_address !== "null" && addressObj.full_address !== "") {
//           return addressObj.full_address;
//         }

//         // Build address from components
//         const addressParts = [];

//         // Add flat/house details
//         if (addressObj.flat_no) addressParts.push(`Flat: ${addressObj.flat_no}`);
//         if (addressObj.house_no) addressParts.push(`House: ${addressObj.house_no}`);
//         if (addressObj.road_no) addressParts.push(`Road: ${addressObj.road_no}`);

//         // Add address lines
//         if (addressObj.address_line1) addressParts.push(addressObj.address_line1);
//         if (addressObj.address_line2) addressParts.push(addressObj.address_line2);

//         // Add area and city
//         if (addressObj.area) addressParts.push(addressObj.area);
//         if (addressObj.city) addressParts.push(addressObj.city);

//         // Add any other fields
//         const otherFields = ['street', 'sector', 'block', 'building', 'apartment'];
//         otherFields.forEach(field => {
//           if (addressObj[field]) addressParts.push(addressObj[field]);
//         });

//         // If we have parts, join them
//         if (addressParts.length > 0) {
//           const formattedAddress = addressParts.join(', ');
//           return formattedAddress;
//         }

//         // Try to use any values from the object
//         const values = Object.values(addressObj).filter(val =>
//           val && val !== "null" && val !== "" && typeof val === 'string'
//         );

//         if (values.length > 0) {
//           return values.join(', ');
//         }
//       }

//       return "Address not specified";

//     } catch (error) {
//       console.error("Error getting address:", error);
//       return "Address information unavailable";
//     }
//   };

//   // Filter orders
//   const filteredOrders = orders.filter((order) => {
//     let typeMatch = true;

//     const hasVendorAssigned = order.vendor_id || order.service_expert;
//     const displayStatus = hasVendorAssigned && order.status === 'Pending' ? 'Active' : order.status;
//     const serviceStarted = hasServiceStarted(order);

//     if (filterType === "pending") {
//       typeMatch = order.status === "Pending" && !hasVendorAssigned;
//     } else if (filterType === "processing") {
//       typeMatch = order.status === "Processing";
//     } else if (filterType === "active") {
//       typeMatch = (displayStatus === "Active" || order.status === "Processing") && !serviceStarted;
//     } else if (filterType === "started") {
//       typeMatch = serviceStarted && order.status !== "Completed" && order.status !== "Cancelled";
//     } else if (filterType === "completed") {
//       typeMatch = order.status === "Completed";
//     } else if (filterType === "cancelled") {
//       typeMatch = order.status === "Cancelled";
//     } else if (filterType === "user_cancelled") {
//       typeMatch = order.status === "Cancelled" && order.cancelled_by === 'user';
//     } else if (filterType === "vendor_cancelled") {
//       typeMatch = order.status === "Cancelled" && order.cancelled_by === 'vendor';
//     } else if (filterType === "admin_cancelled") {
//       typeMatch = order.status === "Cancelled" && order.cancelled_by === 'admin';
//     } else if (filterType === "all") {
//       typeMatch = true;
//     }

//     const searchMatch = order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (order.recipient_name && order.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()));

//     return typeMatch && searchMatch;
//   });

//   const getTotalItems = (order) => {
//     try {
//       const cart = order.parsed_cart_items || [];
//       return cart.reduce((total, item) => total + (item.quantity || 0), 0);
//     } catch {
//       return 0;
//     }
//   };

//   const getTotalPrice = (order) => {
//     try {
//       const cart = order.parsed_cart_items || [];
//       return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
//     } catch {
//       return 0;
//     }
//   };

//   const formatTimeSlotDisplay = (timeSlot) => {
//     if (!timeSlot) return "Not specified";

//     if (timeSlot.includes('-')) {
//       const [start, end] = timeSlot.split('-').map(t => t.trim());

//       const formatTime = (timeStr) => {
//         if (timeStr.includes(':')) {
//           const [hoursStr, minutesStr] = timeStr.split(':');
//           const hours = parseInt(hoursStr, 10);
//           const minutes = parseInt(minutesStr) || 0;

//           if (!isNaN(hours)) {
//             const ampm = hours >= 12 ? 'PM' : 'AM';
//             const displayHour = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
//             const displayMinutes = minutes.toString().padStart(2, '0');
//             return `${displayHour}:${displayMinutes} ${ampm}`;
//           }
//         }
//         return timeStr;
//       };

//       return `${formatTime(start)} - ${formatTime(end)}`;
//     }
//     return timeSlot;
//   };

//   const renderStars = (rating, onChange = null) => {
//     return [1, 2, 3, 4, 5].map((star) => (
//       <button
//         key={star}
//         type="button"
//         onClick={() => onChange && onChange(star)}
//         className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} ${onChange ? 'hover:scale-110 transition-transform' : ''}`}
//       >
//         <FaStar />
//       </button>
//     ));
//   };

//   const handleImageError = (e) => {
//     e.target.style.display = 'none';
//     if (e.target.nextElementSibling) {
//       e.target.nextElementSibling.style.display = 'flex';
//     }
//   };

//   // Calculate filter counts
//   const filterCounts = {
//     active: orders.filter(o => {
//       const hasVendorAssigned = o.vendor_id || o.service_expert;
//       const displayStatus = hasVendorAssigned && o.status === 'Pending' ? 'Active' : o.status;
//       const serviceStarted = hasServiceStarted(o);
//       return (displayStatus === "Active" || o.status === "Processing") && !serviceStarted;
//     }).length,
//     started: orders.filter(o => {
//       const serviceStarted = hasServiceStarted(o);
//       return serviceStarted && o.status !== "Completed" && o.status !== "Cancelled";
//     }).length,
//     processing: orders.filter(o => o.status === "Processing").length,
//     pending: orders.filter(o => o.status === "Pending" && !o.vendor_id && !o.service_expert).length,
//     completed: orders.filter(o => o.status === "Completed").length,
//     cancelled: orders.filter(o => o.status === "Cancelled").length,
//     user_cancelled: orders.filter(o => o.status === "Cancelled" && o.cancelled_by === 'user').length,
//     vendor_cancelled: orders.filter(o => o.status === "Cancelled" && o.cancelled_by === 'vendor').length,
//     admin_cancelled: orders.filter(o => o.status === "Cancelled" && o.cancelled_by === 'admin').length,
//     all: orders.length
//   };

//   // Hold Charge Modal
//   const HoldChargeModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full">
//         <div className="bg-red-600 text-white p-6 rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <FaBan className="text-2xl" />
//             <h3 className="font-bold text-lg">Cancel Order</h3>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="mb-4">
//             <div className="flex items-center gap-2 mb-2">
//               <FaExclamationTriangle className="text-red-600" />
//               <h4 className="font-bold text-red-800">Service Has Started</h4>
//             </div>
//             <p className="text-red-700 mb-4">
//               Service expert has started working. Cancelling now will incur a checkout charge of ৳500.
//             </p>

//             <div className="bg-red-50 p-4 rounded-lg border border-red-200">
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-red-800 mb-2">৳500</div>
//                 <p className="text-red-700 font-medium">Checkout Charge</p>
//                 <p className="text-sm text-red-600 mt-1">
//                   For service expert's time and travel expenses
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="form-control w-full mb-6">
//             <label className="label">
//               <span className="label-text font-semibold">Cancellation Reason *</span>
//             </label>
//             <select
//               className="select select-bordered w-full rounded-xl"
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               required
//             >
//               <option value="">Select a reason</option>
//               <option value="Changed my mind">Changed my mind</option>
//               <option value="Ordered by mistake">Ordered by mistake</option>
//               <option value="Found better price">Found better price</option>
//               <option value="Service expert delayed">Service expert delayed</option>
//               <option value="Emergency situation">Emergency situation</option>
//               <option value="Other">Other reason</option>
//             </select>
//           </div>

//           <div className="form-control mb-6">
//             <label className="label cursor-pointer justify-start gap-3">
//               <input
//                 type="checkbox"
//                 className="checkbox checkbox-error"
//                 checked={cancelFeeAccepted}
//                 onChange={(e) => setCancelFeeAccepted(e.target.checked)}
//                 required
//               />
//               <span className="label-text font-semibold">
//                 I understand and accept the ৳500 checkout charge
//               </span>
//             </label>
//           </div>
//         </div>

//         <div className="modal-action p-6 pt-0">
//           <button
//             onClick={closeHoldChargeModal}
//             className="btn btn-ghost rounded-xl"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleHoldCharge}
//             className="btn btn-error rounded-xl flex items-center gap-2"
//             disabled={loading || !cancelReason || !cancelFeeAccepted}
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FaBan />
//                 Proceed to Confirm
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Cancellation Summary Modal
//   const CancellationSummaryModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full">
//         <div className="bg-red-600 text-white p-6 rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <FaExclamationTriangle className="text-2xl" />
//             <div>
//               <h3 className="font-bold text-lg">Confirm Cancellation</h3>
//               <p className="text-sm opacity-90">Service has started - Penalty applies</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="mb-6">
//             <h4 className="font-bold text-gray-900 mb-3">Cancellation Summary</h4>

//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700">Order ID:</span>
//                 <span className="font-semibold">{selectedOrder?.order_id}</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700">Cancelled by:</span>
//                 <span className="font-semibold text-blue-600">You (Customer)</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-700">Cancellation Reason:</span>
//                 <span className="font-semibold">{cancelReason}</span>
//               </div>

//               <div className="border-t pt-3">
//                 <div className="bg-red-50 p-4 rounded-lg">
//                   <div className="text-center mb-3">
//                     <div className="text-3xl font-bold text-red-800">৳500</div>
//                     <p className="text-red-700 font-medium">Checkout Charge</p>
//                     <p className="text-sm text-red-600 mt-1">
//                       This amount will be charged to your account.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
//                 <div className="flex items-start gap-2">
//                   <FaInfoCircle className="text-yellow-600 mt-0.5" />
//                   <p className="text-sm text-yellow-800">
//                     <strong>Important:</strong> This cancellation is initiated by you. The penalty fee compensates for the service expert's time and transportation expenses.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="modal-action p-6 pt-0">
//           <button
//             onClick={closeCancellationSummary}
//             className="btn btn-ghost rounded-xl"
//             disabled={loading}
//           >
//             Go Back
//           </button>
//           <button
//             onClick={confirmCancellation}
//             className="btn btn-error rounded-xl flex items-center gap-2"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <FaBan />
//                 Confirm & Pay ৳500
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Regular Cancel Modal (no penalty)
//   const RegularCancelModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full">
//         <div className="bg-yellow-600 text-white p-6 rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <FaBan className="text-2xl" />
//             <h3 className="font-bold text-lg">Cancel Order</h3>
//           </div>
//         </div>

//         <div className="p-6">
//           <p className="text-gray-700 mb-4">
//             Are you sure you want to cancel order <span className="font-semibold">{selectedOrder?.order_id}</span>?
//           </p>
//           <div className="bg-green-50 p-3 rounded-lg mb-4">
//             <div className="flex items-center gap-2">
//               <FaCheckCircle className="text-green-600" />
//               <span className="text-green-700 font-medium">
//                 No penalty fee will be charged
//               </span>
//             </div>
//             <p className="text-sm text-green-600 mt-1">
//               Service hasn't started yet. You can cancel without any charge.
//             </p>
//           </div>

//           <div className="form-control w-full mb-6">
//             <label className="label">
//               <span className="label-text font-semibold">Cancellation Reason *</span>
//             </label>
//             <select
//               className="select select-bordered w-full rounded-xl"
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               required
//             >
//               <option value="">Select a reason</option>
//               <option value="Changed my mind">Changed my mind</option>
//               <option value="Ordered by mistake">Ordered by mistake</option>
//               <option value="Found better price">Found better price</option>
//               <option value="Service time not suitable">Service time not suitable</option>
//               <option value="Other">Other reason</option>
//             </select>
//           </div>
//         </div>

//         <div className="modal-action p-6 pt-0">
//           <button
//             onClick={closeCancelModal}
//             className="btn btn-ghost rounded-xl"
//             disabled={loading}
//           >
//             Close
//           </button>
//           <button
//             onClick={handleCancelOrder}
//             className="btn btn-error rounded-xl flex items-center gap-2"
//             disabled={loading || !cancelReason}
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Cancelling...
//               </>
//             ) : (
//               <>
//                 <FaBan />
//                 Confirm Cancellation
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Schedule Change Modal
//   const ScheduleChangeModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-md w-full">
//         <div className="bg-green-600 text-white p-6 rounded-t-2xl">
//           <div className="flex items-center gap-3">
//             <FaCalendarAlt className="text-2xl" />
//             <h3 className="font-bold text-lg">Change Schedule</h3>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="mb-6">
//             <p className="text-gray-700 mb-4">
//               Change schedule for order: <span className="font-semibold">{selectedOrder?.order_id}</span>
//             </p>

//             <div className="grid grid-cols-1 gap-4">
//               {/* Current Schedule */}
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h4 className="font-semibold text-gray-900 mb-2">Current Schedule</h4>
//                 <div className="flex items-center gap-2 text-gray-700">
//                   <FaCalendarAlt className="text-gray-500" />
//                   <span>{new Date(selectedOrder?.order_date).toLocaleDateString()}</span>
//                   <FaClock className="text-gray-500 ml-3" />
//                   <span>{formatTimeSlotDisplay(selectedOrder?.time_slot)}</span>
//                 </div>

//                 {selectedOrder?.schedule_changed && (
//                   <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
//                     <div className="flex items-center gap-1">
//                       <FaInfoCircle className="text-yellow-600 text-sm" />
//                       <p className="text-xs text-yellow-800">
//                         Previously rescheduled
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* New Date */}
//               <div className="form-control w-full">
//                 <label className="label">
//                   <span className="label-text font-semibold">New Date *</span>
//                 </label>
//                 <input
//                   type="date"
//                   className="input input-bordered w-full rounded-xl"
//                   value={newSchedule.date}
//                   onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
//                   min={(() => {
//                     const tomorrow = new Date();
//                     tomorrow.setDate(tomorrow.getDate() + 1);
//                     return tomorrow.toISOString().split('T')[0];
//                   })()}
//                   required
//                 />
//               </div>

//               {/* New Time Slot */}
//               <div className="form-control w-full">
//                 <label className="label">
//                   <span className="label-text font-semibold">New Time Slot *</span>
//                 </label>
//                 <select
//                   className="select select-bordered w-full rounded-xl"
//                   value={newSchedule.timeSlot}
//                   onChange={(e) => setNewSchedule({ ...newSchedule, timeSlot: e.target.value })}
//                   required
//                 >
//                   <option value="">Select time slot</option>
//                   {timeSlots.map((slot, index) => (
//                     <option key={index} value={slot}>
//                       {formatTimeSlotDisplay(slot)}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Address Preview */}
//               <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                 <div className="flex items-start gap-2">
//                   <FaMapMarkerAlt className="text-blue-600 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-blue-800 mb-1">Service Address</h4>
//                     <p className="text-sm text-blue-700">
//                       {getAddressForDisplay(selectedOrder)}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Note */}
//               <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
//                 <div className="flex items-start gap-2">
//                   <FaInfoCircle className="text-yellow-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm text-yellow-800">
//                       <strong>Important:</strong> Schedule can only be changed once. A notification will be sent to the service expert.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="modal-action p-6 pt-0">
//           <button
//             onClick={closeScheduleModal}
//             className="btn btn-ghost rounded-xl"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleScheduleChange}
//             className="btn bg-green-600 border-none text-white rounded-xl flex items-center gap-2 hover:bg-green-700"
//             disabled={loading || !newSchedule.date || !newSchedule.timeSlot}
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Updating...
//               </>
//             ) : (
//               <>
//                 <FaCalendarAlt />
//                 Update Schedule
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-olympic rounded-lg">
//                 <FaShoppingBag className="text-white text-2xl" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
//                 <p className="text-gray-600">Manage and track your orders</p>
//                 {userRole === 'admin' && (
//                   <div className="mt-2">
//                     <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
//                       <FaUserShield className="text-xs" />
//                       Admin View
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="relative lg:w-72">
//               <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="input input-bordered w-full pl-10 rounded-lg bg-white border-gray-300"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Filter Section */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
//           <div className="flex items-center gap-2 mb-4">
//             <FaFilter className="text-gray-700" />
//             <h3 className="font-semibold text-lg text-gray-900">Filter Orders</h3>
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {[
//               { key: "active", label: "Active", icon: FaTruck, count: filterCounts.active },
//               { key: "started", label: "Started", icon: FaPlayCircle, count: filterCounts.started },
//               { key: "processing", label: "Processing", icon: FaCog, count: filterCounts.processing },
//               { key: "pending", label: "Pending", icon: FaClock, count: filterCounts.pending },
//               { key: "completed", label: "Completed", icon: FaCheckCircle, count: filterCounts.completed },
//               { key: "cancelled", label: "All Cancelled", icon: FaTimesCircle, count: filterCounts.cancelled },
//               { key: "user_cancelled", label: "Cancelled by Me", icon: FaUserTimes, count: filterCounts.user_cancelled },
//               { key: "vendor_cancelled", label: "Cancelled by Vendor", icon: FaUserShield, count: filterCounts.vendor_cancelled },
//               { key: "all", label: "All Orders", icon: FaShoppingBag, count: filterCounts.all }
//             ].map((filter) => (
//               <button
//                 key={filter.key}
//                 onClick={() => setFilterType(filter.key)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${filterType === filter.key
//                   ? `bg-olympic text-white shadow-sm`
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//               >
//                 <filter.icon />
//                 <span>{filter.label}</span>
//                 <span className={`px-2 py-0.5 text-xs rounded-full ${filterType === filter.key
//                   ? 'bg-white/30 text-white'
//                   : 'bg-gray-200 text-gray-700'
//                   }`}>
//                   {filter.count}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders List */}
//         {loading ? (
//           <div className="flex flex-col justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-olympic mb-4"></div>
//             <p className="text-gray-600">Loading your orders...</p>
//           </div>
//         ) : filteredOrders.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
//             <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
//             <p className="text-gray-600">
//               {searchTerm ? "No orders match your search criteria" : "You haven't placed any orders yet"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredOrders.map((order) => {
//               const hasVendorAssigned = order.vendor_id || order.service_expert;
//               const displayStatus = hasVendorAssigned && order.status === 'Pending' ? 'Active' : order.status;
//               const serviceStarted = hasServiceStarted(order);

//               const isCancelled = displayStatus === "Cancelled";
//               const isCompleted = displayStatus === "Completed";
//               const isActive = displayStatus === "Active" && !serviceStarted;
//               const isStarted = serviceStarted && !isCompleted && !isCancelled;
//               const isProcessing = order.status === "Processing";
//               const isPending = order.status === "Pending" && !hasVendorAssigned;
//               const totalItems = getTotalItems(order);
//               const totalPrice = getTotalPrice(order);

//               // Cancellation badge - শুধুমাত্র ক্যান্সেল করা অর্ডারের জন্য দেখাবে
//               let cancellationBadge = null;
//               if (isCancelled && order.cancelled_by === 'user') {
//                 cancellationBadge = (
//                   <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                     <FaUserTimes className="text-xs" />
//                     Cancelled by You
//                   </span>
//                 );
//               }

//               return (
//                 <div
//                   key={order.order_id}
//                   className={`bg-white rounded-2xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow duration-300 ${isCancelled ? 'border-red-500' :
//                     isCompleted ? 'border-green-500' :
//                       isStarted ? 'border-green-500' :
//                         isActive ? 'border-blue-500' :
//                           isProcessing ? 'border-orange-500' :
//                             'border-yellow-500'
//                     }`}
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//                     {/* Order Info */}
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-3">
//                         <h3 className="text-xl font-bold text-gray-900">{order.order_id}</h3>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(displayStatus)}`}>
//                           {getStatusIcon(displayStatus)}
//                           {displayStatus}
//                           {hasVendorAssigned && order.status === 'Pending' && (
//                             <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded ml-1">Expert Assigned</span>
//                           )}
//                           {serviceStarted && (displayStatus === "Active" || displayStatus === "Started") && !isCompleted && !isCancelled && (
//                             <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded ml-1">Service Started</span>
//                           )}
//                         </span>
//                         {cancellationBadge}
//                         {isCancelled && order.penalty_fee > 0 && order.cancelled_by === 'user' && (
//                           <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
//                             <FaMoneyBillWave className="text-xs" />
//                             Penalty: ৳{order.penalty_fee}
//                           </span>
//                         )}
//                         {order.schedule_changed && (
//                           <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
//                             <FaCalendarAlt className="text-xs" />
//                             Rescheduled
//                           </span>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-3">
//                         <div className="flex items-center gap-2">
//                           <FaCalendarAlt className="text-gray-500" />
//                           <span className="text-gray-800">{new Date(order.order_date).toLocaleDateString()}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <FaClock className="text-gray-500" />
//                           <span className="text-gray-800">{formatTimeSlotDisplay(order.time_slot)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <FaMapMarkerAlt className="text-gray-500" />
//                           <span className="text-gray-800">{getAddressForDisplay(order)}</span>
//                         </div>
//                       </div>

//                       {/* Vendor Information */}
//                       {(isActive || isStarted || isProcessing) && hasVendorAssigned && (
//                         <div className="mt-3 p-3 rounded-lg border border-blue-100 bg-blue-50">
//                           <div className="flex items-center gap-2">
//                             <FaUser className="text-blue-600" />
//                             <span className="text-sm font-medium text-blue-800">
//                               Service Expert: {order.service_expert?.name || 'Assigned'}
//                             </span>
//                             <button
//                               onClick={() => openTrackModal(order)}
//                               className="ml-auto text-xs bg-olympic text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
//                             >
//                               Track Order
//                             </button>
//                           </div>
//                         </div>
//                       )}

//                       <div className="mt-4 flex flex-wrap gap-4 text-sm">
//                         <div className="bg-gray-50 px-3 py-2 rounded-lg">
//                           <span className="text-gray-600">Items:</span>
//                           <span className="font-medium ml-1 text-gray-900">{totalItems}</span>
//                         </div>
//                         <div className="bg-gray-50 px-3 py-2 rounded-lg">
//                           <span className="text-gray-600">Total:</span>
//                           <span className="font-medium ml-1 text-gray-900">৳{totalPrice}</span>
//                         </div>
//                         {order.cancel_reason && (
//                           <div className="bg-red-50 px-3 py-2 rounded-lg">
//                             <span className="text-gray-600">Cancel Reason:</span>
//                             <span className="font-medium ml-1 text-red-600">{order.cancel_reason}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex flex-wrap gap-2">
//                       <button
//                         onClick={() => openDetailsModal(order)}
//                         className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2 min-w-[120px] justify-center"
//                       >
//                         <FaEye />
//                         View Details
//                       </button>

//                       {(isActive || isStarted || isProcessing || isCompleted) && (
//                         <button
//                           onClick={() => openTrackModal(order)}
//                           className="btn bg-olympic border-none text-white hover:bg-blue-600 flex items-center gap-2 min-w-[120px] justify-center"
//                         >
//                           <FaTruck />
//                           Track Order
//                         </button>
//                       )}

//                       {/* Cancel Button - only show if not completed or already cancelled */}
//                       {!isCancelled && !isCompleted && (
//                         <button
//                           onClick={() => openCancelModal(order)}
//                           className="btn btn-outline btn-error border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 flex items-center gap-2 min-w-[120px] justify-center"
//                         >
//                           <FaBan />
//                           Cancel
//                           {serviceStarted && (
//                             <span className="text-xs">(৳500)</span>
//                           )}
//                         </button>
//                       )}

//                       {/* Schedule Change Button - only for Pending and Processing orders */}
//                       {(isPending || isProcessing) && !hasVendorAssigned && !serviceStarted && (
//                         <button
//                           onClick={() => openScheduleModal(order)}
//                           className="btn bg-green-100 border-green-300 text-green-700 hover:bg-green-200 hover:border-green-400 flex items-center gap-2 min-w-[140px] justify-center"
//                         >
//                           <FaCalendarAlt />
//                           Reschedule
//                         </button>
//                       )}

//                       {isCompleted && !order.reviews && (
//                         <button
//                           onClick={() => openReviewModal(order)}
//                           className="btn bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200 hover:border-yellow-400 flex items-center gap-2 min-w-[120px] justify-center"
//                         >
//                           <FaStar />
//                           Review
//                         </button>
//                       )}

//                       {isCancelled && (
//                         <button
//                           onClick={() => handleReorder(order)}
//                           className="btn bg-cyan-100 border-cyan-300 text-cyan-700 hover:bg-cyan-200 hover:border-cyan-400 flex items-center gap-2 min-w-[120px] justify-center"
//                         >
//                           <FaUndo />
//                           Reorder
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Modals */}
//         {showHoldChargeModal && <HoldChargeModal />}
//         {showCancellationSummary && <CancellationSummaryModal />}
//         {showCancelModal && selectedOrder && <RegularCancelModal />}
//         {showScheduleModal && selectedOrder && <ScheduleChangeModal />}

//         {/* Track Order Modal */}
//         {/* Track Order Modal - Fixed Version */}
//         {showTrackModal && selectedOrder && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
//               {/* Header - Fixed */}
//               <div className="sticky top-0 bg-white z-50 border-b border-gray-200 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
//                     <div className="flex items-center gap-2 mt-1">
//                       <span className="text-sm text-gray-600">ID: {selectedOrder.order_id}</span>
//                       <span className={`text-xs px-2 py-1 rounded-full ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
//                         selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
//                           selectedOrder.status === 'Processing' ? 'bg-orange-100 text-orange-800' :
//                             selectedOrder.status === 'Active' ? 'bg-blue-100 text-blue-800' :
//                               'bg-yellow-100 text-yellow-800'}`}>
//                         {selectedOrder.status}
//                         {selectedOrder.cancelled_by === 'user' && selectedOrder.status === 'Cancelled' && (
//                           <span className="ml-1 text-xs">(by You)</span>
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                   <button
//                     onClick={closeTrackModal}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Scrollable Content */}
//               <div className="flex-1 overflow-y-auto p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* Left Column - Timeline & Progress */}
//                   <div className="lg:col-span-2">
//                     {/* Current Status Summary */}
//                     <div className="mb-8">
//                       <div className={`p-4 rounded-lg flex items-center gap-4 ${selectedOrder.status === 'Completed' ? 'bg-green-50 border border-green-200' :
//                         selectedOrder.status === 'Cancelled' ? 'bg-red-50 border border-red-200' :
//                           selectedOrder.status === 'Processing' ? 'bg-orange-50 border border-orange-200' :
//                             selectedOrder.status === 'Active' ? 'bg-blue-50 border border-blue-200' :
//                               'bg-yellow-50 border border-yellow-200'}`}>
//                         <div className={`p-3 rounded ${selectedOrder.status === 'Completed' ? 'bg-green-100' :
//                           selectedOrder.status === 'Cancelled' ? 'bg-red-100' :
//                             selectedOrder.status === 'Processing' ? 'bg-orange-100' :
//                               'bg-blue-100'}`}>
//                           {getStatusIcon(selectedOrder.status)}
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-gray-900 text-lg">Current Status: {selectedOrder.status}</h3>
//                           <p className="text-gray-600 mt-1">
//                             {selectedOrder.status === 'Cancelled' && selectedOrder.cancelled_by === 'user'
//                               ? "You cancelled this order"
//                               : `Updated: ${new Date(selectedOrder.order_date).toLocaleDateString()}`
//                             }
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Timeline Steps */}
//                     <div className="mb-8">
//                       <h3 className="font-bold text-lg text-gray-900 mb-4">Order Progress Timeline</h3>

//                       <div className="relative">
//                         {/* Vertical Timeline Line */}
//                         <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

//                         {/* Step 1: Order Placed */}
//                         <div className="relative mb-8">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 z-10 ${selectedOrder.order_date ? 'bg-green-500' : 'bg-gray-400'} rounded-full p-3`}>
//                               <FaShoppingBag className="text-white w-5 h-5" />
//                             </div>
//                             <div className="ml-8">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">Order Placed</h4>
//                                   <p className="text-sm text-gray-600">Your order has been received</p>
//                                 </div>
//                                 <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
//                                   Completed
//                                 </span>
//                               </div>
//                               {selectedOrder.order_date && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   {new Date(selectedOrder.order_date).toLocaleDateString('en-US', {
//                                     weekday: 'short',
//                                     year: 'numeric',
//                                     month: 'short',
//                                     day: 'numeric',
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   })}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Step 2: Processing */}
//                         <div className="relative mb-8">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 z-10 ${selectedOrder.status === 'Processing' || selectedOrder.status === 'Active' || selectedOrder.status === 'Started' || selectedOrder.status === 'Completed' ? 'bg-blue-500' : 'bg-gray-300'} rounded-full p-3`}>
//                               <FaCog className="text-white w-5 h-5" />
//                             </div>
//                             <div className="ml-8">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">Processing</h4>
//                                   <p className="text-sm text-gray-600">Order is being prepared</p>
//                                 </div>
//                                 {selectedOrder.status === 'Processing' || selectedOrder.status === 'Active' || selectedOrder.status === 'Started' || selectedOrder.status === 'Completed' ? (
//                                   <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
//                                     {selectedOrder.status === 'Processing' ? 'In Progress' : 'Completed'}
//                                   </span>
//                                 ) : (
//                                   <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
//                                     Pending
//                                   </span>
//                                 )}
//                               </div>
//                               {selectedOrder.processing_date && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   {new Date(selectedOrder.processing_date).toLocaleDateString('en-US', {
//                                     weekday: 'short',
//                                     month: 'short',
//                                     day: 'numeric',
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   })}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Step 3: Expert Assigned */}
//                         <div className="relative mb-8">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 z-10 ${(selectedOrder.vendor_id || selectedOrder.service_expert) ? 'bg-purple-500' : 'bg-gray-300'} rounded-full p-3`}>
//                               <FaUserCheck className="text-white w-5 h-5" />
//                             </div>
//                             <div className="ml-8">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">Expert Assigned</h4>
//                                   <p className="text-sm text-gray-600">
//                                     {(selectedOrder.vendor_id || selectedOrder.service_expert)
//                                       ? `Service expert assigned`
//                                       : 'Waiting for expert assignment'}
//                                   </p>
//                                 </div>
//                                 {(selectedOrder.vendor_id || selectedOrder.service_expert) ? (
//                                   <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
//                                     {selectedOrder.status === 'Active' || selectedOrder.status === 'Started' || selectedOrder.status === 'Completed' ? 'Completed' : 'Assigned'}
//                                   </span>
//                                 ) : (
//                                   <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
//                                     Pending
//                                   </span>
//                                 )}
//                               </div>
//                               {selectedOrder.vendor_assigned_date && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   Assigned: {new Date(selectedOrder.vendor_assigned_date).toLocaleDateString()}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Step 4: Service Started */}
//                         <div className="relative mb-8">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 z-10 ${hasServiceStarted(selectedOrder) ? 'bg-green-500' : 'bg-gray-300'} rounded-full p-3`}>
//                               <FaPlayCircle className="text-white w-5 h-5" />
//                             </div>
//                             <div className="ml-8">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">Service Started</h4>
//                                   <p className="text-sm text-gray-600">
//                                     {hasServiceStarted(selectedOrder)
//                                       ? 'Service expert has started working'
//                                       : 'Service will start at scheduled time'}
//                                   </p>
//                                 </div>
//                                 {hasServiceStarted(selectedOrder) ? (
//                                   <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
//                                     Started
//                                   </span>
//                                 ) : selectedOrder.status === 'Active' ? (
//                                   <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
//                                     Upcoming
//                                   </span>
//                                 ) : (
//                                   <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
//                                     Pending
//                                   </span>
//                                 )}
//                               </div>
//                               {selectedOrder.service_started_date && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   Started: {new Date(selectedOrder.service_started_date).toLocaleDateString('en-US', {
//                                     month: 'short',
//                                     day: 'numeric',
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   })}
//                                 </p>
//                               )}
//                               {hasServiceStarted(selectedOrder) && selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
//                                 <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
//                                   <div className="flex items-center gap-2">
//                                     <FaExclamationTriangle className="text-orange-500 text-sm" />
//                                     <p className="text-xs text-orange-700">
//                                       Cancellation will incur ৳500 penalty fee
//                                     </p>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Step 5: Completed */}
//                         <div className="relative mb-8">
//                           <div className="flex items-center">
//                             <div className={`flex-shrink-0 z-10 ${selectedOrder.status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-300'} rounded-full p-3`}>
//                               <FaCheckCircle className="text-white w-5 h-5" />
//                             </div>
//                             <div className="ml-8">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900">Completed</h4>
//                                   <p className="text-sm text-gray-600">
//                                     {selectedOrder.status === 'Completed'
//                                       ? 'Service has been completed'
//                                       : 'Service completion'}
//                                   </p>
//                                 </div>
//                                 {selectedOrder.status === 'Completed' ? (
//                                   <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">
//                                     Completed
//                                   </span>
//                                 ) : (
//                                   <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
//                                     {selectedOrder.status === 'Active' || selectedOrder.status === 'Started' ? 'Upcoming' : 'Pending'}
//                                   </span>
//                                 )}
//                               </div>
//                               {selectedOrder.completed_date && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   Completed: {new Date(selectedOrder.completed_date).toLocaleDateString('en-US', {
//                                     month: 'short',
//                                     day: 'numeric',
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   })}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Step 6: Cancelled (only show if cancelled) */}
//                         {selectedOrder.status === 'Cancelled' && (
//                           <div className="relative mb-8">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 z-10 bg-red-500 rounded-full p-3">
//                                 <FaTimesCircle className="text-white w-5 h-5" />
//                               </div>
//                               <div className="ml-8">
//                                 <div className="flex items-center justify-between">
//                                   <div>
//                                     <h4 className="font-semibold text-gray-900">Cancelled</h4>
//                                     <p className="text-sm text-gray-600">
//                                       {selectedOrder.cancelled_by === 'user' ? 'You cancelled this order' : 'Order has been cancelled'}
//                                     </p>
//                                   </div>
//                                   <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
//                                     Cancelled
//                                   </span>
//                                 </div>
//                                 {selectedOrder.cancel_reason && (
//                                   <div className="mt-2">
//                                     <p className="text-sm text-gray-700">
//                                       <span className="font-medium">Reason:</span> {selectedOrder.cancel_reason}
//                                     </p>
//                                   </div>
//                                 )}
//                                 {selectedOrder.cancelled_date && (
//                                   <p className="text-xs text-gray-500 mt-1">
//                                     {new Date(selectedOrder.cancelled_date).toLocaleDateString('en-US', {
//                                       month: 'short',
//                                       day: 'numeric',
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })}
//                                   </p>
//                                 )}
//                                 {selectedOrder.penalty_fee > 0 && selectedOrder.cancelled_by === 'user' && (
//                                   <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
//                                     <div className="flex items-center justify-between">
//                                       <span className="text-sm font-medium text-red-700">Penalty Fee</span>
//                                       <span className="font-bold text-red-800">৳{selectedOrder.penalty_fee}</span>
//                                     </div>
//                                     <p className="text-xs text-red-600 mt-1">
//                                       Charged for service time and transportation
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Schedule Information */}
//                     {selectedOrder.schedule_changed && (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                         <div className="flex items-start gap-3">
//                           <FaCalendarAlt className="text-yellow-600 mt-1" />
//                           <div>
//                             <h4 className="font-semibold text-yellow-800 mb-2">Schedule Changed</h4>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <p className="text-sm text-yellow-700">Original Schedule</p>
//                                 <p className="font-medium">
//                                   {new Date(selectedOrder.original_order_date || selectedOrder.order_date).toLocaleDateString()}
//                                   at {formatTimeSlotDisplay(selectedOrder.original_time_slot || selectedOrder.time_slot)}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-yellow-700">Rescheduled To</p>
//                                 <p className="font-medium">
//                                   {new Date(selectedOrder.order_date).toLocaleDateString()}
//                                   at {formatTimeSlotDisplay(selectedOrder.time_slot)}
//                                 </p>
//                               </div>
//                             </div>
//                             {selectedOrder.schedule_changed_date && (
//                               <p className="text-xs text-yellow-600 mt-2">
//                                 Changed on: {new Date(selectedOrder.schedule_changed_date).toLocaleDateString()}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right Column - Vendor & Details */}
//                   <div className="space-y-6">
//                     {/* Service Expert Information */}
//                     {vendorDetails ? (
//                       <div className="bg-white border border-gray-200 rounded-lg p-5">
//                         <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <FaUserTie className="text-gray-600" />
//                           Service Expert Details
//                         </h3>

//                         <div className="flex items-center gap-3 mb-4">
//                           {vendorDetails.photo_url ? (
//                             <img
//                               src={vendorDetails.photo_url}
//                               alt={vendorDetails.name}
//                               className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
//                               onError={handleImageError}
//                             />
//                           ) : (
//                             <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-blue-200">
//                               <FaUser className="text-gray-400 text-2xl" />
//                             </div>
//                           )}
//                           <div>
//                             <h4 className="font-bold text-gray-900 text-lg">{vendorDetails.name}</h4>
//                             <div className="flex items-center gap-2 mt-1">
//                               <div className="flex items-center">
//                                 <FaStar className="text-yellow-500" />
//                                 <span className="font-medium ml-1">{vendorDetails.rating?.toFixed(1) || '4.5'}</span>
//                               </div>
//                               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                                 {vendorDetails.completed_orders || 50}+ orders
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="space-y-3">
//                           {/* Phone number সঠিকভাবে দেখানো - vendorDetails থেকে phone ফিল্ড ব্যবহার করুন */}
//                           {vendorDetails.phone && (
//                             <div className="flex items-center gap-2">
//                               <FaPhone className="text-gray-500" />
//                               <span className="text-gray-700">{vendorDetails.phone}</span>
//                             </div>
//                           )}
//                           <div className="flex items-center gap-2">
//                             <FaHistory className="text-gray-500" />
//                             <span className="text-gray-700">{vendorDetails.experience_years || 2} years experience</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <FaCertificate className="text-gray-500" />
//                             <span className="text-gray-700">{vendorDetails.verified ? 'Verified Expert' : 'Not Verified'}</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <FaMotorcycle className="text-gray-500" />
//                             <span className="text-gray-700">{vendorDetails.vehicle_type || 'Motorcycle'}</span>
//                           </div>
//                           {/* Phone number না থাকলে বিকল্প দেখানো */}
//                           {!vendorDetails.phone && vendorDetails.email && (
//                             <div className="flex items-center gap-2">
//                               <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                               </svg>
//                               <span className="text-gray-700">{vendorDetails.email}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="bg-white border border-gray-200 rounded-lg p-5">
//                         <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <FaUser className="text-gray-600" />
//                           Service Expert
//                         </h3>
//                         <div className="text-center py-6">
//                           <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
//                             <FaUser className="text-gray-400 text-xl" />
//                           </div>
//                           <p className="text-gray-600">
//                             {selectedOrder.vendor_id || selectedOrder.service_expert
//                               ? 'Loading expert details...'
//                               : 'Waiting for expert assignment'}
//                           </p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Order Details */}
//                     <div className="bg-white border border-gray-200 rounded-lg p-5">
//                       <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <FaInfoCircle className="text-gray-600" />
//                         Order Details
//                       </h3>

//                       <div className="space-y-4">
//                         <div>
//                           <label className="text-sm text-gray-600">Order Date & Time</label>
//                           <p className="font-medium text-gray-900">
//                             {new Date(selectedOrder.order_date).toLocaleDateString('en-US', {
//                               weekday: 'long',
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })} at {formatTimeSlotDisplay(selectedOrder.time_slot)}
//                           </p>
//                         </div>

//                         <div>
//                           <label className="text-sm text-gray-600">Service Address</label>
//                           <p className="font-medium text-gray-900">{getAddressForDisplay(selectedOrder)}</p>
//                         </div>

//                         <div>
//                           <label className="text-sm text-gray-600">Items</label>
//                           <p className="font-medium text-gray-900">
//                             {getTotalItems(selectedOrder)} items • ৳{getTotalPrice(selectedOrder)}
//                           </p>
//                         </div>

//                         {selectedOrder.recipient_name && (
//                           <div>
//                             <label className="text-sm text-gray-600">Recipient</label>
//                             <p className="font-medium text-gray-900">{selectedOrder.recipient_name}</p>
//                           </div>
//                         )}

//                         {selectedOrder.notes && (
//                           <div>
//                             <label className="text-sm text-gray-600">Special Instructions</label>
//                             <p className="font-medium text-gray-900">{selectedOrder.notes}</p>
//                           </div>
//                         )}

//                         {/* Penalty Information */}
//                         {selectedOrder.penalty_fee > 0 && selectedOrder.cancelled_by === 'user' && (
//                           <div className="pt-4 border-t border-gray-100">
//                             <div className="bg-red-50 p-3 rounded-lg">
//                               <div className="flex justify-between items-center">
//                                 <span className="font-medium text-red-800">Penalty Fee</span>
//                                 <span className="font-bold text-red-900">৳{selectedOrder.penalty_fee}</span>
//                               </div>
//                               <p className="text-sm text-red-600 mt-1">
//                                 Charged for service time and transportation
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Contact Support */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <div className="flex items-start gap-3">
//                         <FaPhoneAlt className="text-blue-600 mt-0.5" />
//                         <div>
//                           <h4 className="font-medium text-blue-800 mb-1">Need Help?</h4>
//                           <p className="text-sm text-blue-700 mb-2">
//                             Contact our support team for assistance
//                           </p>
//                           <a
//                             href="tel:+8801234567890"
//                             className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                             </svg>
//                             +880 1234 567890
//                           </a>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer - Fixed at bottom */}
//               <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600">
//                       Order ID: {selectedOrder.order_id}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Last updated: {new Date(selectedOrder.order_date).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="flex flex-wrap gap-3">
//                     <button
//                       onClick={() => {
//                         closeTrackModal();
//                         openDetailsModal(selectedOrder);
//                       }}
//                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//                     >
//                       View Full Details
//                     </button>
//                     {selectedOrder.status !== "Completed" && selectedOrder.status !== "Cancelled" && (
//                       <button
//                         onClick={() => {
//                           closeTrackModal();
//                           openCancelModal(selectedOrder);
//                         }}
//                         className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
//                       >
//                         <FaBan className="text-sm" />
//                         Cancel Order
//                         {hasServiceStarted(selectedOrder) && (
//                           <span className="text-xs">(৳500)</span>
//                         )}
//                       </button>
//                     )}
//                     <button
//                       onClick={closeTrackModal}
//                       className="px-6 py-2 bg-olympic text-white font-medium rounded-lg hover:bg-blue-600 transition-colors text-sm"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Review Modal */}
//         {showReviewModal && selectedOrder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl max-w-md w-full">
//               <div className="bg-olympic text-white p-6 rounded-t-2xl">
//                 <div className="flex items-center gap-3">
//                   <FaStar className="text-2xl" />
//                   <h3 className="font-bold text-lg">Rate Your Experience</h3>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <p className="text-gray-700 mb-6">
//                   Please rate your experience for order: <span className="font-semibold">{selectedOrder.order_id}</span>
//                 </p>

//                 <div className="mb-6">
//                   <label className="block font-semibold mb-3 text-gray-900">Service Expert</label>
//                   <div className="flex gap-2">
//                     {renderStars(reviewData.serviceExpert, (rating) =>
//                       setReviewData({ ...reviewData, serviceExpert: rating })
//                     )}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block font-semibold mb-3 text-gray-900">Website Service</label>
//                   <div className="flex gap-2">
//                     {renderStars(reviewData.websiteService, (rating) =>
//                       setReviewData({ ...reviewData, websiteService: rating })
//                     )}
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <label className="block font-semibold mb-3 text-gray-900">Comments</label>
//                   <textarea
//                     className="textarea textarea-bordered w-full rounded-lg border-gray-300"
//                     placeholder="Share your experience..."
//                     rows="3"
//                     value={reviewData.comments}
//                     onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div className="modal-action p-6 pt-0">
//                 <button
//                   onClick={closeReviewModal}
//                   className="btn btn-ghost rounded-lg text-gray-700"
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmitReview}
//                   className="btn bg-olympic border-none text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Submitting...
//                     </>
//                   ) : (
//                     <>
//                       <FaCheckCircle />
//                       Submit Review
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Details Modal */}
//         {showDetailsModal && detailedOrder && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//             <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
//               {/* Header */}
//               <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
//                     <p className="text-gray-600 mt-1">Order ID: {detailedOrder.order_id}</p>
//                     {/* শুধুমাত্র ক্যান্সেল করা অর্ডারের জন্য দেখাবে */}
//                     {detailedOrder.status === "Cancelled" && detailedOrder.cancelled_by === 'user' && (
//                       <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
//                         <FaUserTimes className="text-xs" />
//                         Cancelled by You
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={closeDetailsModal}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <FaTimesCircle className="text-2xl text-gray-500 hover:text-gray-700" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Left Column - Order Summary */}
//                   <div className="space-y-6">
//                     {/* Order Status Card */}
//                     <div className={`p-4 rounded-lg ${detailedOrder.status === 'Completed' ? 'bg-green-50 border border-green-200' :
//                       detailedOrder.status === 'Cancelled' ? 'bg-red-50 border border-red-200' :
//                         detailedOrder.status === 'Processing' ? 'bg-orange-50 border border-orange-200' :
//                           detailedOrder.status === 'Active' ? 'bg-blue-50 border border-blue-200' :
//                             'bg-yellow-50 border border-yellow-200'
//                       }`}>
//                       <div className="flex items-center gap-3">
//                         {getStatusIcon(detailedOrder.status)}
//                         <div>
//                           <h3 className="font-semibold text-gray-900">Current Status</h3>
//                           <p className={`text-lg font-bold ${detailedOrder.status === 'Completed' ? 'text-green-700' :
//                             detailedOrder.status === 'Cancelled' ? 'text-red-700' :
//                               detailedOrder.status === 'Processing' ? 'text-orange-700' :
//                                 detailedOrder.status === 'Active' ? 'text-blue-700' :
//                                   'text-yellow-700'
//                             }`}>
//                             {detailedOrder.status}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Order Information */}
//                     <div className="bg-gray-50 p-5 rounded-lg">
//                       <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <FaInfoCircle />
//                         Order Information
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-sm text-gray-600">Order Date</p>
//                             <p className="font-medium">
//                               {new Date(detailedOrder.order_date).toLocaleDateString('en-US', {
//                                 weekday: 'long',
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-600">Time Slot</p>
//                             <p className="font-medium">{formatTimeSlotDisplay(detailedOrder.time_slot)}</p>
//                           </div>
//                         </div>

//                         <div>
//                           <p className="text-sm text-gray-600">Address Type</p>
//                           <p className="font-medium capitalize flex items-center gap-2">
//                             {detailedOrder.address_type === 'home' ? <FaHome /> :
//                               detailedOrder.address_type === 'office' ? <FaBuilding /> :
//                                 <FaMapMarkerAlt />}
//                             {detailedOrder.address_type || 'Home'}
//                           </p>
//                         </div>

//                         <div>
//                           <p className="text-sm text-gray-600">Delivery Address</p>
//                           <p className="font-medium">{getAddressForDisplay(detailedOrder)}</p>
//                         </div>

//                         {detailedOrder.notes && (
//                           <div>
//                             <p className="text-sm text-gray-600">Special Instructions</p>
//                             <p className="font-medium">{detailedOrder.notes}</p>
//                           </div>
//                         )}

//                         {/* Penalty Fee (only show if user cancelled) */}
//                         {detailedOrder.cancelled_by === 'user' && detailedOrder.penalty_fee > 0 && (
//                           <div className="border-t pt-3">
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <p className="text-sm text-gray-600">Penalty Fee</p>
//                                 <p className="text-xs text-gray-500">Charged for transportation and service time</p>
//                               </div>
//                               <span className="text-lg font-bold text-red-600">৳{detailedOrder.penalty_fee}</span>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Recipient Information */}
//                     {(detailedOrder.recipient_name || detailedOrder.recipient_phone) && (
//                       <div className="bg-gray-50 p-5 rounded-lg">
//                         <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <FaUserTag />
//                           Recipient Information
//                         </h3>
//                         <div className="space-y-2">
//                           {detailedOrder.recipient_name && (
//                             <div className="flex items-center gap-2">
//                               <FaUser className="text-gray-500" />
//                               <span className="font-medium">{detailedOrder.recipient_name}</span>
//                             </div>
//                           )}
//                           {detailedOrder.recipient_phone && (
//                             <div className="flex items-center gap-2">
//                               <FaPhoneAlt className="text-gray-500" />
//                               <span className="font-medium">{detailedOrder.recipient_phone}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Right Column - Items & Vendor */}
//                   <div className="space-y-6">
//                     {/* Order Items */}
//                     <div className="bg-gray-50 p-5 rounded-lg">
//                       <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                         <FaListUl />
//                         Order Items ({detailedOrder.parsed_cart_items?.length || 0})
//                       </h3>
//                       <div className="space-y-3">
//                         {detailedOrder.parsed_cart_items && detailedOrder.parsed_cart_items.length > 0 ? (
//                           detailedOrder.parsed_cart_items.map((item, index) => (
//                             <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
//                               <div>
//                                 <p className="font-medium">{item.name}</p>
//                                 <p className="text-sm text-gray-600">৳{item.price} × {item.quantity}</p>
//                               </div>
//                               <p className="font-bold">৳{item.price * item.quantity}</p>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-gray-500 text-center py-4">No items found</p>
//                         )}

//                         {/* Total Summary */}
//                         <div className="border-t pt-4 mt-4">
//                           <div className="flex justify-between mb-2">
//                             <span className="text-gray-600">Subtotal</span>
//                             <span className="font-medium">৳{getTotalPrice(detailedOrder)}</span>
//                           </div>
//                           {detailedOrder.delivery_charge > 0 && (
//                             <div className="flex justify-between mb-2">
//                               <span className="text-gray-600">Delivery Charge</span>
//                               <span className="font-medium">৳{detailedOrder.delivery_charge}</span>
//                             </div>
//                           )}
//                           {detailedOrder.discount > 0 && (
//                             <div className="flex justify-between mb-2 text-green-600">
//                               <span>Discount</span>
//                               <span>-৳{detailedOrder.discount}</span>
//                             </div>
//                           )}
//                           <div className="flex justify-between text-lg font-bold pt-3 border-t">
//                             <span>Total</span>
//                             <span>
//                               ৳{getTotalPrice(detailedOrder) +
//                                 (detailedOrder.delivery_charge || 0) -
//                                 (detailedOrder.discount || 0)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Vendor Information */}
//                     {(detailedOrder.vendor_id || detailedOrder.service_expert) && (
//                       <div className="bg-gray-50 p-5 rounded-lg">
//                         <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <FaUserCheck />
//                           Service Expert
//                         </h3>
//                         {vendorDetails ? (
//                           <div className="space-y-3">
//                             <div className="flex items-center gap-3">
//                               {vendorDetails.photo_url ? (
//                                 <img
//                                   src={vendorDetails.photo_url}
//                                   alt={vendorDetails.name}
//                                   className="w-12 h-12 rounded-full object-cover"
//                                   onError={handleImageError}
//                                 />
//                               ) : (
//                                 <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                                   <FaUser className="text-gray-400" />
//                                 </div>
//                               )}
//                               <div>
//                                 <h4 className="font-bold text-gray-900">{vendorDetails.name}</h4>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <div className="flex items-center">
//                                     <FaStar className="text-yellow-500 text-sm" />
//                                     <span className="text-sm font-medium ml-1">{vendorDetails.rating?.toFixed(1) || '4.5'}</span>
//                                   </div>
//                                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                     {vendorDetails.completed_orders || 50} orders
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 text-sm">
//                               <div className="flex items-center gap-2">
//                                 <FaPhone className="text-gray-500" />
//                                 <span>{vendorDetails.phone}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <FaBriefcase className="text-gray-500" />
//                                 <span>{vendorDetails.experience_years || 2} years exp</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <FaCertificate className="text-gray-500" />
//                                 <span>{vendorDetails.verified ? 'Verified' : 'Not Verified'}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <FaMotorcycle className="text-gray-500" />
//                                 <span>{vendorDetails.vehicle_type || 'Motorcycle'}</span>
//                               </div>
//                             </div>

//                             <button
//                               onClick={() => {
//                                 closeDetailsModal();
//                                 openTrackModal(selectedOrder);
//                               }}
//                               className="w-full mt-4 btn bg-olympic border-none text-white hover:bg-blue-600 flex items-center justify-center gap-2"
//                             >
//                               <FaTruck />
//                               Track This Order
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="text-center py-4">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olympic mx-auto mb-2"></div>
//                             <p className="text-gray-600">Loading expert details...</p>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Footer Actions */}
//               <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <button
//                       onClick={() => {
//                         closeDetailsModal();
//                         openTrackModal(selectedOrder);
//                       }}
//                       className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
//                     >
//                       <FaTruck />
//                       Track Order
//                     </button>
//                   </div>
//                   <div className="flex gap-3">
//                     {/* Schedule Change Button - only for Pending and Processing orders */}
//                     {(detailedOrder.status === "Pending" || detailedOrder.status === "Processing") && !detailedOrder.vendor_id && !detailedOrder.service_expert && (
//                       <button
//                         onClick={() => {
//                           closeDetailsModal();
//                           openScheduleModal(detailedOrder);
//                         }}
//                         className="btn bg-green-100 border-green-300 text-green-700 hover:bg-green-200 flex items-center gap-2"
//                       >
//                         <FaCalendarAlt />
//                         Reschedule
//                       </button>
//                     )}

//                     {detailedOrder.status !== 'Cancelled' && detailedOrder.status !== 'Completed' && (
//                       <button
//                         onClick={() => {
//                           closeDetailsModal();
//                           openCancelModal(selectedOrder);
//                         }}
//                         className="btn btn-outline btn-error border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
//                       >
//                         <FaBan />
//                         Cancel Order
//                       </button>
//                     )}
//                     <button
//                       onClick={closeDetailsModal}
//                       className="btn bg-olympic border-none text-white hover:bg-blue-600"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;

import React, { useEffect, useState } from "react";
import api from "../../api"; // Import the configured axios instance
import Swal from "sweetalert2";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaUndo,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBan,
  FaSearch,
  FaStar,
  FaUser,
  FaPhone,
  FaTruck,
  FaEye,
  FaListUl,
  FaHome,
  FaBuilding,
  FaInfoCircle,
  FaUserTag,
  FaPhoneAlt,
  FaCog,
  FaUserCheck,
  FaMotorcycle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaPlayCircle,
  FaUserTie,
  FaBriefcase,
  FaHistory,
  FaCertificate,
  FaUserTimes,
  FaUserShield
} from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("active");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState(null);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [reviewData, setReviewData] = useState({
    serviceExpert: 5,
    websiteService: 5,
    comments: ""
  });
  const [cancelFeeAccepted, setCancelFeeAccepted] = useState(false);
  const [showHoldChargeModal, setShowHoldChargeModal] = useState(false);
  const [showCancellationSummary, setShowCancellationSummary] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: "",
    timeSlot: ""
  });

  // 8 AM থেকে 9 PM পর্যন্ত টাইম স্লট
  const timeSlots = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
    "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
    "20:00-21:00"
  ];

  // Check user role on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role || 'user');
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const processedOrders = res.data.orders.map(order => {
        let status = order.status;
        let serviceStarted = checkServiceStartStatus(order);

        // Parse addresses with improved logic
        const parseAddress = (address) => {
          if (!address || address === "null" || address === "") return {};
          try {
            if (typeof address === "string") {
              // Clean the string
              let cleanStr = address.trim();
              // Remove surrounding quotes if present
              if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
                cleanStr = cleanStr.slice(1, -1);
              }
              if (cleanStr.startsWith("'") && cleanStr.endsWith("'")) {
                cleanStr = cleanStr.slice(1, -1);
              }

              // Try to parse as JSON
              try {
                const parsed = JSON.parse(cleanStr);
                if (parsed && typeof parsed === 'object') {
                  return parsed;
                }
              } catch (e) {
                // If not JSON, check format
                if (cleanStr.includes('{') || cleanStr.includes('}')) {
                  // Might be malformed JSON, try to fix
                  try {
                    const fixed = cleanStr
                      .replace(/(\w+):/g, '"$1":')
                      .replace(/'/g, '"');
                    const parsed = JSON.parse(fixed);
                    if (parsed && typeof parsed === 'object') {
                      return parsed;
                    }
                  } catch (fixError) {
                    console.log('Failed to fix JSON:', fixError);
                  }
                }
                // Return as simple address object
                return { full_address: cleanStr };
              }
            } else if (typeof address === 'object') {
              return address;
            }
          } catch (error) {
            console.error("Error parsing address:", error);
          }
          return {};
        };

        return {
          ...order,
          status: status,
          service_started: serviceStarted,
          parsed_cart_items: order.cart_items ?
            (typeof order.cart_items === "string" ? JSON.parse(order.cart_items) : order.cart_items) : [],
          parsed_home_address: parseAddress(order.home_address),
          parsed_office_address: parseAddress(order.office_address),
          parsed_temp_address: parseAddress(order.temp_address),
          cancelled_by: order.cancelled_by || null,
          schedule_changed: order.schedule_changed || false,
          schedule_changed_date: order.schedule_changed_date,
          original_order_date: order.original_order_date,
          original_time_slot: order.original_time_slot
        };
      });

      const sortedOrders = [...processedOrders].sort((a, b) =>
        new Date(b.order_date) - new Date(a.order_date)
      );

      setOrders(sortedOrders);

    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage = error.response?.data?.message || "Failed to load orders";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Check service start status
  const checkServiceStartStatus = (order) => {
    try {
      if (order.service_started_date) {
        return true;
      }

      if (order.time_slot && order.order_date) {
        const orderDate = new Date(order.order_date);
        const [startTimeStr] = order.time_slot.split('-');
        const [hours, minutes] = startTimeStr.split(':').map(Number);

        const serviceStartTime = new Date(orderDate);
        serviceStartTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        return now >= serviceStartTime;
      }

      return false;
    } catch (error) {
      console.error("Error checking service start:", error);
      return false;
    }
  };

  const hasServiceStarted = (order) => {
    if (!order) return false;

    const validStatuses = ['Active', 'Processing', 'Started', 'Expert Assigned'];
    if (!validStatuses.includes(order.status)) {
      return false;
    }

    return order.service_started || checkServiceStartStatus(order);
  };

  // শিডিউল চেঞ্জ মোডাল ওপেন
  const openScheduleModal = (order) => {
    setSelectedOrder(order);
    // Current date থেকে 1 দিন পরের date সেট করুন
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    setNewSchedule({
      date: formattedDate,
      timeSlot: order.time_slot || ""
    });
    setShowScheduleModal(true);
  };

  // শিডিউল চেঞ্জ ক্লোজ
  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedOrder(null);
    setNewSchedule({
      date: "",
      timeSlot: ""
    });
  };

  // শিডিউল আপডেট করুন
  const handleScheduleChange = async () => {
    if (!selectedOrder || !newSchedule.date || !newSchedule.timeSlot) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select both date and time slot!',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const orderId = selectedOrder.order_id;

      const response = await api.patch(
        `/orders/${encodeURIComponent(orderId)}/schedule`,
        {
          newDate: newSchedule.date,
          newTimeSlot: newSchedule.timeSlot
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Schedule Updated!',
          html: `
            <div class="text-center">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Old Schedule:</strong> ${new Date(selectedOrder.order_date).toLocaleDateString()} at ${formatTimeSlotDisplay(selectedOrder.time_slot)}</p>
              <p><strong>New Schedule:</strong> ${new Date(newSchedule.date).toLocaleDateString()} at ${formatTimeSlotDisplay(newSchedule.timeSlot)}</p>
              <p class="text-sm text-green-600 mt-2">
                Schedule has been updated successfully!
              </p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: true
        });

        await fetchOrders();
        closeScheduleModal();

        if (showDetailsModal) closeDetailsModal();
        if (showTrackModal) closeTrackModal();
      }
    } catch (error) {
      console.error("Schedule change error:", error);

      let errorMessage = 'Failed to update schedule. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openTrackModal = async (order) => {
    setSelectedOrder(order);
    setVendorDetails(null);

    if (order.vendor_id || order.service_expert) {
      await fetchVendorDetails(order.vendor_id || order.service_expert);
    }

    setShowTrackModal(true);
  };

  const closeTrackModal = () => {
    setShowTrackModal(false);
    setSelectedOrder(null);
    setVendorDetails(null);
  };

  // Fetch vendor details
  const fetchVendorDetails = async (vendorId) => {
    if (!vendorId) return null;

    try {
      setVendorLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get(`/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const vendor = res.data.vendor;
        setVendorDetails(vendor);
        return vendor;
      }

      return getMockVendorData(vendorId);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      return getMockVendorData(vendorId);
    } finally {
      setVendorLoading(false);
    }
  };

  const getMockVendorData = (vendorId) => {
    const mockData = {
      id: vendorId,
      name: "Md. Rahim Khan",
      phone: "+8801712345678",
      email: "rahim.khan@example.com",
      photo_url: null,
      rating: 4.7,
      completed_orders: 124,
      experience_years: 3,
      specialization: "Home Cleaning & Maintenance",
      vehicle_type: "Motorcycle",
      working_hours: "9:00 AM - 6:00 PM",
      location: "Mirpur, Dhaka",
      service_radius: 15,
      verified: true,
      success_rate: 98,
      avg_rating: 4.7,
      wallet_balance: 12500,
      join_date: "2022-05-15",
      languages: ["Bengali", "English"],
      skills: ["Cleaning", "Repair", "Maintenance"]
    };

    setVendorDetails(mockData);
    return mockData;
  };

  const openCancelModal = async (order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setCancelFeeAccepted(false);

    const serviceStarted = hasServiceStarted(order);
    const isVendorAssigned = !!(order.vendor_id || order.service_expert);
    const canCancel = !(order.status === 'Completed' || order.status === 'Cancelled');

    if (!canCancel) {
      Swal.fire({
        icon: 'info',
        title: 'Cannot Cancel',
        text: 'This order cannot be cancelled.',
        timer: 2000
      });
      return;
    }

    if (serviceStarted && isVendorAssigned) {
      setShowHoldChargeModal(true);
    } else {
      setShowCancelModal(true);
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason("");
  };

  const closeHoldChargeModal = () => {
    setShowHoldChargeModal(false);
    setSelectedOrder(null);
    setCancelReason("");
    setCancelFeeAccepted(false);
  };

  const closeCancellationSummary = () => {
    setShowCancellationSummary(false);
    setSelectedOrder(null);
    setCancelReason("");
    setCancelFeeAccepted(false);
  };

  // Handle hold charge
  const handleHoldCharge = async () => {
    if (!selectedOrder || !selectedOrder.order_id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No order selected.',
      });
      return;
    }

    if (!cancelReason) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a cancel reason!',
      });
      return;
    }

    setShowHoldChargeModal(false);
    setShowCancellationSummary(true);
  };

  // Confirm cancellation with penalty
  const confirmCancellation = async () => {
    if (!selectedOrder || !selectedOrder.order_id) {
      console.error("❌ No order selected");
      return;
    }

    if (!cancelReason) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a cancel reason!',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const orderId = selectedOrder.order_id;

      const encodedOrderId = encodeURIComponent(orderId);
      const url = `/orders/${encodedOrderId}/cancel`;

      const response = await api.patch(
        url,
        {
          reason: cancelReason,
          penaltyFee: 500,
          accept_fee: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Cancelled!',
          html: `
            <div class="text-center">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Status:</strong> Cancelled by You</p>
              <p><strong>Penalty Fee:</strong> ৳500</p>
              <p><strong>Reason:</strong> ${cancelReason}</p>
              <p class="text-sm text-gray-600 mt-2">
                The penalty fee has been charged for service time and transportation.
              </p>
            </div>
          `,
          timer: 3000,
          showConfirmButton: true
        });

        await fetchOrders();

        setShowCancellationSummary(false);
        if (showTrackModal) setShowTrackModal(false);
        if (showDetailsModal) setShowDetailsModal(false);

        setSelectedOrder(null);
        setCancelReason("");
        setCancelFeeAccepted(false);
      }
    } catch (error) {
      console.error("❌ Cancellation error:", error);

      let errorMessage = 'Failed to cancel order. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Order not found.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Cannot cancel this order.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle regular cancellation (no penalty)
  const handleCancelOrder = async () => {
    if (!selectedOrder || !selectedOrder.order_id) {
      console.error("❌ No order selected");
      return;
    }

    if (!cancelReason) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a cancel reason!',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const orderId = selectedOrder.order_id;

      const encodedOrderId = encodeURIComponent(orderId);
      const url = `/orders/${encodedOrderId}/cancel`;

      const response = await api.patch(
        url,
        {
          reason: cancelReason,
          penaltyFee: 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Cancelled!',
          text: response.data.message || 'Order cancelled successfully.',
          timer: 2000,
          showConfirmButton: false
        });

        await fetchOrders();
        closeCancelModal();
        if (showTrackModal) setShowTrackModal(false);
        if (showDetailsModal) setShowDetailsModal(false);
      }
    } catch (error) {
      console.error("Regular cancel error:", error);

      let errorMessage = 'Failed to cancel order.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrder(null);
    setReviewData({
      serviceExpert: 5,
      websiteService: 5,
      comments: ""
    });
  };

  const openDetailsModal = async (order) => {
    if (!order) {
      console.error("No order provided to openDetailsModal");
      Swal.fire("Error", "Order data not found", "error");
      return;
    }

    setSelectedOrder(order);

    setDetailedOrder({
      order_id: order.order_id,
      status: order.status || "Pending",
      order_date: order.order_date,
      time_slot: order.time_slot,
      address_type: order.address_type,
      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
      notes: order.notes,
      vendor_id: order.vendor_id,
      service_expert: order.service_expert,
      parsed_cart_items: order.parsed_cart_items || [],
      parsed_home_address: order.parsed_home_address || {},
      parsed_office_address: order.parsed_office_address || {},
      parsed_temp_address: order.parsed_temp_address || {},
      delivery_charge: order.delivery_charge || 0,
      discount: order.discount || 0,
      checkout_charge: order.checkout_charge || 0,
      cancel_reason: order.cancel_reason,
      cancelled_by: order.cancelled_by,
      service_started: order.service_started,
      service_started_date: order.service_started_date,
      vendor_assigned_date: order.vendor_assigned_date,
      processing_date: order.processing_date,
      completed_date: order.completed_date,
      cancelled_date: order.cancelled_date,
      reviews: order.reviews,
      charge_status: order.charge_status,
      penalty_fee: order.penalty_fee,
      schedule_changed: order.schedule_changed,
      schedule_changed_date: order.schedule_changed_date,
      original_order_date: order.original_order_date,
      original_time_slot: order.original_time_slot
    });

    setShowDetailsModal(true);

    if (order.vendor_id) {
      try {
        await fetchVendorDetails(order.vendor_id);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      }
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setTimeout(() => {
      setDetailedOrder(null);
      setVendorDetails(null);
      setSelectedOrder(null);
    }, 300);
  };

  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post(
        `/orders/${encodeURIComponent(selectedOrder.order_id)}/review`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Thank you for your feedback.',
        timer: 2000,
        showConfirmButton: false
      });

      fetchOrders();
      closeReviewModal();
    } catch (error) {
      console.error("Review error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'Failed to submit review.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order) => {
    const token = localStorage.getItem("token");
    try {
      const cartItems = order.parsed_cart_items || [];

      let address = {};
      let addressType = "home";

      if (order.address_type === "office" && order.parsed_office_address) {
        address = order.parsed_office_address;
        addressType = "office";
      } else if (order.address_type === "another" && order.parsed_temp_address) {
        address = order.parsed_temp_address;
        addressType = "another";
      } else if (order.parsed_home_address) {
        address = order.parsed_home_address;
        addressType = "home";
      }

      const reorderData = {
        category: order.order_id.split("#")[1]?.replace(/\d+/g, "") || "General",
        cart: cartItems,
        selectedDate: new Date().toISOString().split('T')[0],
        selectedSlot: order.time_slot,
        notes: order.notes || "",
        addressType: addressType,
        address: JSON.stringify(address),
        recipientName: order.recipient_name || "Customer",
        recipientPhone: order.recipient_phone || ""
      };

      const response = await api.post(
        "/api/place-order",
        reorderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Order placed successfully! Order ID: ${response.data.orderId}`,
        });
        fetchOrders();
      }
    } catch (err) {
      console.error("Reorder failed:", err.response?.data || err);
      Swal.fire({
        icon: 'error',
        title: 'Reorder Failed',
        text: err.response?.data?.message || 'Failed to reorder. Please try again.',
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <FaClock className="text-yellow-500" />;
      case "Processing": return <FaCog className="text-orange-500" />;
      case "Expert Assigned": return <FaUserCheck className="text-blue-500" />;
      case "Active": return <FaTruck className="text-blue-500" />;
      case "Started": return <FaPlayCircle className="text-green-500" />;
      case "Completed": return <FaCheckCircle className="text-green-500" />;
      case "Cancelled": return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-orange-100 text-orange-800";
      case "Expert Assigned": return "bg-blue-100 text-blue-800";
      case "Active": return "bg-blue-100 text-blue-800";
      case "Started": return "bg-green-100 text-green-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // এড্রেস দেখানোর ফাংশন - ইউজার ফ্রেন্ডলি
  const getAddressForDisplay = (order) => {
    if (!order) return "No address specified";

    try {
      // Priority: parsed addresses > original addresses
      let addressObj = {};

      // Check which address to use based on address_type
      if (order.address_type === "office" && order.parsed_office_address && Object.keys(order.parsed_office_address).length > 0) {
        addressObj = order.parsed_office_address;
      } else if (order.address_type === "another" && order.parsed_temp_address && Object.keys(order.parsed_temp_address).length > 0) {
        addressObj = order.parsed_temp_address;
      } else if (order.parsed_home_address && Object.keys(order.parsed_home_address).length > 0) {
        addressObj = order.parsed_home_address;
      }

      // If parsed addresses are empty, try original addresses
      if (!addressObj || Object.keys(addressObj).length === 0) {
        if (order.home_address && order.home_address !== "null") {
          try {
            if (typeof order.home_address === 'string') {
              // Try to parse as JSON
              try {
                addressObj = JSON.parse(order.home_address);
              } catch (e) {
                // If parsing fails, use as string
                return order.home_address;
              }
            } else {
              addressObj = order.home_address;
            }
          } catch (e) {
            // If parsing fails, use as string
            return order.home_address || "Address not specified";
          }
        }
      }

      // Format the address for display
      if (addressObj && typeof addressObj === 'object') {
        // First check for full_address
        if (addressObj.full_address && addressObj.full_address !== "null" && addressObj.full_address !== "") {
          return addressObj.full_address;
        }

        // Build address from components
        const addressParts = [];

        // Add flat/house details
        if (addressObj.flat_no) addressParts.push(`Flat: ${addressObj.flat_no}`);
        if (addressObj.house_no) addressParts.push(`House: ${addressObj.house_no}`);
        if (addressObj.road_no) addressParts.push(`Road: ${addressObj.road_no}`);

        // Add address lines
        if (addressObj.address_line1) addressParts.push(addressObj.address_line1);
        if (addressObj.address_line2) addressParts.push(addressObj.address_line2);

        // Add area and city
        if (addressObj.area) addressParts.push(addressObj.area);
        if (addressObj.city) addressParts.push(addressObj.city);

        // Add any other fields
        const otherFields = ['street', 'sector', 'block', 'building', 'apartment'];
        otherFields.forEach(field => {
          if (addressObj[field]) addressParts.push(addressObj[field]);
        });

        // If we have parts, join them
        if (addressParts.length > 0) {
          const formattedAddress = addressParts.join(', ');
          return formattedAddress;
        }

        // Try to use any values from the object
        const values = Object.values(addressObj).filter(val =>
          val && val !== "null" && val !== "" && typeof val === 'string'
        );

        if (values.length > 0) {
          return values.join(', ');
        }
      }

      return "Address not specified";

    } catch (error) {
      console.error("Error getting address:", error);
      return "Address information unavailable";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    let typeMatch = true;

    const hasVendorAssigned = order.vendor_id || order.service_expert;
    const displayStatus = hasVendorAssigned && order.status === 'Pending' ? 'Active' : order.status;
    const serviceStarted = hasServiceStarted(order);

    if (filterType === "pending") {
      typeMatch = order.status === "Pending" && !hasVendorAssigned;
    } else if (filterType === "processing") {
      typeMatch = order.status === "Processing";
    } else if (filterType === "active") {
      typeMatch = (displayStatus === "Active" || order.status === "Processing") && !serviceStarted;
    } else if (filterType === "started") {
      typeMatch = serviceStarted && order.status !== "Completed" && order.status !== "Cancelled";
    } else if (filterType === "completed") {
      typeMatch = order.status === "Completed";
    } else if (filterType === "cancelled") {
      typeMatch = order.status === "Cancelled";
    } else if (filterType === "user_cancelled") {
      typeMatch = order.status === "Cancelled" && order.cancelled_by === 'user';
    } else if (filterType === "vendor_cancelled") {
      typeMatch = order.status === "Cancelled" && order.cancelled_by === 'vendor';
    } else if (filterType === "admin_cancelled") {
      typeMatch = order.status === "Cancelled" && order.cancelled_by === 'admin';
    } else if (filterType === "all") {
      typeMatch = true;
    }

    const searchMatch = order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.recipient_name && order.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()));

    return typeMatch && searchMatch;
  });

  const getTotalItems = (order) => {
    try {
      const cart = order.parsed_cart_items || [];
      return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    } catch {
      return 0;
    }
  };

  const getTotalPrice = (order) => {
    try {
      const cart = order.parsed_cart_items || [];
      return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
    } catch {
      return 0;
    }
  };

  const formatTimeSlotDisplay = (timeSlot) => {
    if (!timeSlot) return "Not specified";

    if (timeSlot.includes('-')) {
      const [start, end] = timeSlot.split('-').map(t => t.trim());

      const formatTime = (timeStr) => {
        if (timeStr.includes(':')) {
          const [hoursStr, minutesStr] = timeStr.split(':');
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr) || 0;

          if (!isNaN(hours)) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
            const displayMinutes = minutes.toString().padStart(2, '0');
            return `${displayHour}:${displayMinutes} ${ampm}`;
          }
        }
        return timeStr;
      };

      return `${formatTime(start)} - ${formatTime(end)}`;
    }
    return timeSlot;
  };

  const renderStars = (rating, onChange = null) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange && onChange(star)}
        className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} ${onChange ? 'hover:scale-110 transition-transform' : ''}`}
      >
        <FaStar />
      </button>
    ));
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    if (e.target.nextElementSibling) {
      e.target.nextElementSibling.style.display = 'flex';
    }
  };

  // Calculate filter counts
  const filterCounts = {
    active: orders.filter(o => {
      const hasVendorAssigned = o.vendor_id || o.service_expert;
      const displayStatus = hasVendorAssigned && o.status === 'Pending' ? 'Active' : o.status;
      const serviceStarted = hasServiceStarted(o);
      return (displayStatus === "Active" || o.status === "Processing") && !serviceStarted;
    }).length,
    started: orders.filter(o => {
      const serviceStarted = hasServiceStarted(o);
      return serviceStarted && o.status !== "Completed" && o.status !== "Cancelled";
    }).length,
    processing: orders.filter(o => o.status === "Processing").length,
    pending: orders.filter(o => o.status === "Pending" && !o.vendor_id && !o.service_expert).length,
    completed: orders.filter(o => o.status === "Completed").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
    user_cancelled: orders.filter(o => o.status === "Cancelled" && o.cancelled_by === 'user').length,
    vendor_cancelled: orders.filter(o => o.status === "Cancelled" && o.cancelled_by === 'vendor').length,
    admin_cancelled: orders.filter(o => o.status === "Cancelled" && o.cancelled_by === 'admin').length,
    all: orders.length
  };

  // Hold Charge Modal
  const HoldChargeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaBan className="text-2xl" />
            <h3 className="font-bold text-lg">Cancel Order</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FaExclamationTriangle className="text-red-600" />
              <h4 className="font-bold text-red-800">Service Has Started</h4>
            </div>
            <p className="text-red-700 mb-4">
              Service expert has started working. Cancelling now will incur a checkout charge of ৳500.
            </p>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-800 mb-2">৳500</div>
                <p className="text-red-700 font-medium">Checkout Charge</p>
                <p className="text-sm text-red-600 mt-1">
                  For service expert's time and travel expenses
                </p>
              </div>
            </div>
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-semibold">Cancellation Reason *</span>
            </label>
            <select
              className="select select-bordered w-full rounded-xl"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found better price">Found better price</option>
              <option value="Service expert delayed">Service expert delayed</option>
              <option value="Emergency situation">Emergency situation</option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          <div className="form-control mb-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-error"
                checked={cancelFeeAccepted}
                onChange={(e) => setCancelFeeAccepted(e.target.checked)}
                required
              />
              <span className="label-text font-semibold">
                I understand and accept the ৳500 checkout charge
              </span>
            </label>
          </div>
        </div>

        <div className="modal-action p-6 pt-0">
          <button
            onClick={closeHoldChargeModal}
            className="btn btn-ghost rounded-xl"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleHoldCharge}
            className="btn btn-error rounded-xl flex items-center gap-2"
            disabled={loading || !cancelReason || !cancelFeeAccepted}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <FaBan />
                Proceed to Confirm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Cancellation Summary Modal
  const CancellationSummaryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-2xl" />
            <div>
              <h3 className="font-bold text-lg">Confirm Cancellation</h3>
              <p className="text-sm opacity-90">Service has started - Penalty applies</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-3">Cancellation Summary</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Order ID:</span>
                <span className="font-semibold">{selectedOrder?.order_id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cancelled by:</span>
                <span className="font-semibold text-blue-600">You (Customer)</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cancellation Reason:</span>
                <span className="font-semibold">{cancelReason}</span>
              </div>

              <div className="border-t pt-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-red-800">৳500</div>
                    <p className="text-red-700 font-medium">Checkout Charge</p>
                    <p className="text-sm text-red-600 mt-1">
                      This amount will be charged to your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> This cancellation is initiated by you. The penalty fee compensates for the service expert's time and transportation expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action p-6 pt-0">
          <button
            onClick={closeCancellationSummary}
            className="btn btn-ghost rounded-xl"
            disabled={loading}
          >
            Go Back
          </button>
          <button
            onClick={confirmCancellation}
            className="btn btn-error rounded-xl flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <FaBan />
                Confirm & Pay ৳500
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Regular Cancel Modal (no penalty)
  const RegularCancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-yellow-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaBan className="text-2xl" />
            <h3 className="font-bold text-lg">Cancel Order</h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to cancel order <span className="font-semibold">{selectedOrder?.order_id}</span>?
          </p>
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <span className="text-green-700 font-medium">
                No penalty fee will be charged
              </span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Service hasn't started yet. You can cancel without any charge.
            </p>
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-semibold">Cancellation Reason *</span>
            </label>
            <select
              className="select select-bordered w-full rounded-xl"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found better price">Found better price</option>
              <option value="Service time not suitable">Service time not suitable</option>
              <option value="Other">Other reason</option>
            </select>
          </div>
        </div>

        <div className="modal-action p-6 pt-0">
          <button
            onClick={closeCancelModal}
            className="btn btn-ghost rounded-xl"
            disabled={loading}
          >
            Close
          </button>
          <button
            onClick={handleCancelOrder}
            className="btn btn-error rounded-xl flex items-center gap-2"
            disabled={loading || !cancelReason}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Cancelling...
              </>
            ) : (
              <>
                <FaBan />
                Confirm Cancellation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Schedule Change Modal
  const ScheduleChangeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-2xl" />
            <h3 className="font-bold text-lg">Change Schedule</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Change schedule for order: <span className="font-semibold">{selectedOrder?.order_id}</span>
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Current Schedule */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Current Schedule</h4>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>{new Date(selectedOrder?.order_date).toLocaleDateString()}</span>
                  <FaClock className="text-gray-500 ml-3" />
                  <span>{formatTimeSlotDisplay(selectedOrder?.time_slot)}</span>
                </div>

                {selectedOrder?.schedule_changed && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center gap-1">
                      <FaInfoCircle className="text-yellow-600 text-sm" />
                      <p className="text-xs text-yellow-800">
                        Previously rescheduled
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* New Date */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">New Date *</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full rounded-xl"
                  value={newSchedule.date}
                  onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  min={(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  required
                />
              </div>

              {/* New Time Slot */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">New Time Slot *</span>
                </label>
                <select
                  className="select select-bordered w-full rounded-xl"
                  value={newSchedule.timeSlot}
                  onChange={(e) => setNewSchedule({ ...newSchedule, timeSlot: e.target.value })}
                  required
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {formatTimeSlotDisplay(slot)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address Preview */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Service Address</h4>
                    <p className="text-sm text-blue-700">
                      {getAddressForDisplay(selectedOrder)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Schedule can only be changed once. A notification will be sent to the service expert.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action p-6 pt-0">
          <button
            onClick={closeScheduleModal}
            className="btn btn-ghost rounded-xl"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleScheduleChange}
            className="btn bg-green-600 border-none text-white rounded-xl flex items-center gap-2 hover:bg-green-700"
            disabled={loading || !newSchedule.date || !newSchedule.timeSlot}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <FaCalendarAlt />
                Update Schedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-olympic rounded-lg">
                <FaShoppingBag className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                <p className="text-gray-600">Manage and track your orders</p>
                {userRole === 'admin' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                      <FaUserShield className="text-xs" />
                      Admin View
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative lg:w-72">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="input input-bordered w-full pl-10 rounded-lg bg-white border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-700" />
            <h3 className="font-semibold text-lg text-gray-900">Filter Orders</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "active", label: "Active", icon: FaTruck, count: filterCounts.active },
              { key: "started", label: "Started", icon: FaPlayCircle, count: filterCounts.started },
              { key: "processing", label: "Processing", icon: FaCog, count: filterCounts.processing },
              { key: "pending", label: "Pending", icon: FaClock, count: filterCounts.pending },
              { key: "completed", label: "Completed", icon: FaCheckCircle, count: filterCounts.completed },
              { key: "cancelled", label: "All Cancelled", icon: FaTimesCircle, count: filterCounts.cancelled },
              { key: "user_cancelled", label: "Cancelled by Me", icon: FaUserTimes, count: filterCounts.user_cancelled },
              { key: "vendor_cancelled", label: "Cancelled by Vendor", icon: FaUserShield, count: filterCounts.vendor_cancelled },
              { key: "all", label: "All Orders", icon: FaShoppingBag, count: filterCounts.all }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${filterType === filter.key
                  ? `bg-olympic text-white shadow-sm`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <filter.icon />
                <span>{filter.label}</span>
                <span className={`px-2 py-0.5 text-xs rounded-full ${filterType === filter.key
                  ? 'bg-white/30 text-white'
                  : 'bg-gray-200 text-gray-700'
                  }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-olympic mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
            <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm ? "No orders match your search criteria" : "You haven't placed any orders yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const hasVendorAssigned = order.vendor_id || order.service_expert;
              const displayStatus = hasVendorAssigned && order.status === 'Pending' ? 'Active' : order.status;
              const serviceStarted = hasServiceStarted(order);

              const isCancelled = displayStatus === "Cancelled";
              const isCompleted = displayStatus === "Completed";
              const isActive = displayStatus === "Active" && !serviceStarted;
              const isStarted = serviceStarted && !isCompleted && !isCancelled;
              const isProcessing = order.status === "Processing";
              const isPending = order.status === "Pending" && !hasVendorAssigned;
              const totalItems = getTotalItems(order);
              const totalPrice = getTotalPrice(order);

              // Cancellation badge - শুধুমাত্র ক্যান্সেল করা অর্ডারের জন্য দেখাবে
              let cancellationBadge = null;
              if (isCancelled && order.cancelled_by === 'user') {
                cancellationBadge = (
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    <FaUserTimes className="text-xs" />
                    Cancelled by You
                  </span>
                );
              }

              return (
                <div
                  key={order.order_id}
                  className={`bg-white rounded-2xl shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow duration-300 ${isCancelled ? 'border-red-500' :
                    isCompleted ? 'border-green-500' :
                      isStarted ? 'border-green-500' :
                        isActive ? 'border-blue-500' :
                          isProcessing ? 'border-orange-500' :
                            'border-yellow-500'
                    }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{order.order_id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(displayStatus)}`}>
                          {getStatusIcon(displayStatus)}
                          {displayStatus}
                          {hasVendorAssigned && order.status === 'Pending' && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded ml-1">Expert Assigned</span>
                          )}
                          {serviceStarted && (displayStatus === "Active" || displayStatus === "Started") && !isCompleted && !isCancelled && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded ml-1">Service Started</span>
                          )}
                        </span>
                        {cancellationBadge}
                        {isCancelled && order.penalty_fee > 0 && order.cancelled_by === 'user' && (
                          <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            <FaMoneyBillWave className="text-xs" />
                            Penalty: ৳{order.penalty_fee}
                          </span>
                        )}
                        {order.schedule_changed && (
                          <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            <FaCalendarAlt className="text-xs" />
                            Rescheduled
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-500" />
                          <span className="text-gray-800">{new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-500" />
                          <span className="text-gray-800">{formatTimeSlotDisplay(order.time_slot)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-500" />
                          <span className="text-gray-800">{getAddressForDisplay(order)}</span>
                        </div>
                      </div>

                      {/* Vendor Information */}
                      {(isActive || isStarted || isProcessing) && hasVendorAssigned && (
                        <div className="mt-3 p-3 rounded-lg border border-blue-100 bg-blue-50">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Service Expert: {order.service_expert?.name || 'Assigned'}
                            </span>
                            <button
                              onClick={() => openTrackModal(order)}
                              className="ml-auto text-xs bg-olympic text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Track Order
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-gray-600">Items:</span>
                          <span className="font-medium ml-1 text-gray-900">{totalItems}</span>
                        </div>
                        <div className="bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium ml-1 text-gray-900">৳{totalPrice}</span>
                        </div>
                        {order.cancel_reason && (
                          <div className="bg-red-50 px-3 py-2 rounded-lg">
                            <span className="text-gray-600">Cancel Reason:</span>
                            <span className="font-medium ml-1 text-red-600">{order.cancel_reason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2 min-w-[120px] justify-center"
                      >
                        <FaEye />
                        View Details
                      </button>

                      {(isActive || isStarted || isProcessing || isCompleted) && (
                        <button
                          onClick={() => openTrackModal(order)}
                          className="btn bg-olympic border-none text-white hover:bg-blue-600 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          <FaTruck />
                          Track Order
                        </button>
                      )}

                      {/* Cancel Button - only show if not completed or already cancelled */}
                      {!isCancelled && !isCompleted && (
                        <button
                          onClick={() => openCancelModal(order)}
                          className="btn btn-outline btn-error border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          <FaBan />
                          Cancel
                          {serviceStarted && (
                            <span className="text-xs">(৳500)</span>
                          )}
                        </button>
                      )}

                      {/* Schedule Change Button - only for Pending and Processing orders */}
                      {(isPending || isProcessing) && !hasVendorAssigned && !serviceStarted && (
                        <button
                          onClick={() => openScheduleModal(order)}
                          className="btn bg-green-100 border-green-300 text-green-700 hover:bg-green-200 hover:border-green-400 flex items-center gap-2 min-w-[140px] justify-center"
                        >
                          <FaCalendarAlt />
                          Reschedule
                        </button>
                      )}

                      {isCompleted && !order.reviews && (
                        <button
                          onClick={() => openReviewModal(order)}
                          className="btn bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200 hover:border-yellow-400 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          <FaStar />
                          Review
                        </button>
                      )}

                      {isCancelled && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="btn bg-cyan-100 border-cyan-300 text-cyan-700 hover:bg-cyan-200 hover:border-cyan-400 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          <FaUndo />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modals */}
        {showHoldChargeModal && <HoldChargeModal />}
        {showCancellationSummary && <CancellationSummaryModal />}
        {showCancelModal && selectedOrder && <RegularCancelModal />}
        {showScheduleModal && selectedOrder && <ScheduleChangeModal />}

        {/* Track Order Modal - Fixed Version */}
        {showTrackModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
              {/* Header - Fixed */}
              <div className="sticky top-0 bg-white z-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">ID: {selectedOrder.order_id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          selectedOrder.status === 'Processing' ? 'bg-orange-100 text-orange-800' :
                            selectedOrder.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                        {selectedOrder.status}
                        {selectedOrder.cancelled_by === 'user' && selectedOrder.status === 'Cancelled' && (
                          <span className="ml-1 text-xs">(by You)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={closeTrackModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Timeline & Progress */}
                  <div className="lg:col-span-2">
                    {/* Current Status Summary */}
                    <div className="mb-8">
                      <div className={`p-4 rounded-lg flex items-center gap-4 ${selectedOrder.status === 'Completed' ? 'bg-green-50 border border-green-200' :
                        selectedOrder.status === 'Cancelled' ? 'bg-red-50 border border-red-200' :
                          selectedOrder.status === 'Processing' ? 'bg-orange-50 border border-orange-200' :
                            selectedOrder.status === 'Active' ? 'bg-blue-50 border border-blue-200' :
                              'bg-yellow-50 border border-yellow-200'}`}>
                        <div className={`p-3 rounded ${selectedOrder.status === 'Completed' ? 'bg-green-100' :
                          selectedOrder.status === 'Cancelled' ? 'bg-red-100' :
                            selectedOrder.status === 'Processing' ? 'bg-orange-100' :
                              'bg-blue-100'}`}>
                          {getStatusIcon(selectedOrder.status)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">Current Status: {selectedOrder.status}</h3>
                          <p className="text-gray-600 mt-1">
                            {selectedOrder.status === 'Cancelled' && selectedOrder.cancelled_by === 'user'
                              ? "You cancelled this order"
                              : `Updated: ${new Date(selectedOrder.order_date).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="mb-8">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Order Progress Timeline</h3>

                      <div className="relative">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {/* Step 1: Order Placed */}
                        <div className="relative mb-8">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 z-10 ${selectedOrder.order_date ? 'bg-green-500' : 'bg-gray-400'} rounded-full p-3`}>
                              <FaShoppingBag className="text-white w-5 h-5" />
                            </div>
                            <div className="ml-8">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">Order Placed</h4>
                                  <p className="text-sm text-gray-600">Your order has been received</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                                  Completed
                                </span>
                              </div>
                              {selectedOrder.order_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(selectedOrder.order_date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="relative mb-8">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 z-10 ${selectedOrder.status === 'Processing' || selectedOrder.status === 'Active' || selectedOrder.status === 'Started' || selectedOrder.status === 'Completed' ? 'bg-blue-500' : 'bg-gray-300'} rounded-full p-3`}>
                              <FaCog className="text-white w-5 h-5" />
                            </div>
                            <div className="ml-8">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">Processing</h4>
                                  <p className="text-sm text-gray-600">Order is being prepared</p>
                                </div>
                                {selectedOrder.status === 'Processing' || selectedOrder.status === 'Active' || selectedOrder.status === 'Started' || selectedOrder.status === 'Completed' ? (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                                    {selectedOrder.status === 'Processing' ? 'In Progress' : 'Completed'}
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                              {selectedOrder.processing_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(selectedOrder.processing_date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Step 3: Expert Assigned */}
                        <div className="relative mb-8">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 z-10 ${(selectedOrder.vendor_id || selectedOrder.service_expert) ? 'bg-purple-500' : 'bg-gray-300'} rounded-full p-3`}>
                              <FaUserCheck className="text-white w-5 h-5" />
                            </div>
                            <div className="ml-8">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">Expert Assigned</h4>
                                  <p className="text-sm text-gray-600">
                                    {(selectedOrder.vendor_id || selectedOrder.service_expert)
                                      ? `Service expert assigned`
                                      : 'Waiting for expert assignment'}
                                  </p>
                                </div>
                                {(selectedOrder.vendor_id || selectedOrder.service_expert) ? (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                                    {selectedOrder.status === 'Active' || selectedOrder.status === 'Started' || selectedOrder.status === 'Completed' ? 'Completed' : 'Assigned'}
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                              {selectedOrder.vendor_assigned_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Assigned: {new Date(selectedOrder.vendor_assigned_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Step 4: Service Started */}
                        <div className="relative mb-8">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 z-10 ${hasServiceStarted(selectedOrder) ? 'bg-green-500' : 'bg-gray-300'} rounded-full p-3`}>
                              <FaPlayCircle className="text-white w-5 h-5" />
                            </div>
                            <div className="ml-8">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">Service Started</h4>
                                  <p className="text-sm text-gray-600">
                                    {hasServiceStarted(selectedOrder)
                                      ? 'Service expert has started working'
                                      : 'Service will start at scheduled time'}
                                  </p>
                                </div>
                                {hasServiceStarted(selectedOrder) ? (
                                  <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                                    Started
                                  </span>
                                ) : selectedOrder.status === 'Active' ? (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full">
                                    Upcoming
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                              </div>
                              {selectedOrder.service_started_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Started: {new Date(selectedOrder.service_started_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                              {hasServiceStarted(selectedOrder) && selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                                <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <FaExclamationTriangle className="text-orange-500 text-sm" />
                                    <p className="text-xs text-orange-700">
                                      Cancellation will incur ৳500 penalty fee
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Step 5: Completed */}
                        <div className="relative mb-8">
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 z-10 ${selectedOrder.status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-300'} rounded-full p-3`}>
                              <FaCheckCircle className="text-white w-5 h-5" />
                            </div>
                            <div className="ml-8">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">Completed</h4>
                                  <p className="text-sm text-gray-600">
                                    {selectedOrder.status === 'Completed'
                                      ? 'Service has been completed'
                                      : 'Service completion'}
                                  </p>
                                </div>
                                {selectedOrder.status === 'Completed' ? (
                                  <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">
                                    Completed
                                  </span>
                                ) : (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                                    {selectedOrder.status === 'Active' || selectedOrder.status === 'Started' ? 'Upcoming' : 'Pending'}
                                  </span>
                                )}
                              </div>
                              {selectedOrder.completed_date && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Completed: {new Date(selectedOrder.completed_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Step 6: Cancelled (only show if cancelled) */}
                        {selectedOrder.status === 'Cancelled' && (
                          <div className="relative mb-8">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 z-10 bg-red-500 rounded-full p-3">
                                <FaTimesCircle className="text-white w-5 h-5" />
                              </div>
                              <div className="ml-8">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">Cancelled</h4>
                                    <p className="text-sm text-gray-600">
                                      {selectedOrder.cancelled_by === 'user' ? 'You cancelled this order' : 'Order has been cancelled'}
                                    </p>
                                  </div>
                                  <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full">
                                    Cancelled
                                  </span>
                                </div>
                                {selectedOrder.cancel_reason && (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Reason:</span> {selectedOrder.cancel_reason}
                                    </p>
                                  </div>
                                )}
                                {selectedOrder.cancelled_date && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(selectedOrder.cancelled_date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                                {selectedOrder.penalty_fee > 0 && selectedOrder.cancelled_by === 'user' && (
                                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-red-700">Penalty Fee</span>
                                      <span className="font-bold text-red-800">৳{selectedOrder.penalty_fee}</span>
                                    </div>
                                    <p className="text-xs text-red-600 mt-1">
                                      Charged for service time and transportation
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Schedule Information */}
                    {selectedOrder.schedule_changed && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <FaCalendarAlt className="text-yellow-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-yellow-800 mb-2">Schedule Changed</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-yellow-700">Original Schedule</p>
                                <p className="font-medium">
                                  {new Date(selectedOrder.original_order_date || selectedOrder.order_date).toLocaleDateString()}
                                  at {formatTimeSlotDisplay(selectedOrder.original_time_slot || selectedOrder.time_slot)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-yellow-700">Rescheduled To</p>
                                <p className="font-medium">
                                  {new Date(selectedOrder.order_date).toLocaleDateString()}
                                  at {formatTimeSlotDisplay(selectedOrder.time_slot)}
                                </p>
                              </div>
                            </div>
                            {selectedOrder.schedule_changed_date && (
                              <p className="text-xs text-yellow-600 mt-2">
                                Changed on: {new Date(selectedOrder.schedule_changed_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Vendor & Details */}
                  <div className="space-y-6">
                    {/* Service Expert Information */}
                    {vendorDetails ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FaUserTie className="text-gray-600" />
                          Service Expert Details
                        </h3>

                        <div className="flex items-center gap-3 mb-4">
                          {vendorDetails.photo_url ? (
                            <img
                              src={vendorDetails.photo_url}
                              alt={vendorDetails.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-blue-200">
                              <FaUser className="text-gray-400 text-2xl" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{vendorDetails.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                <FaStar className="text-yellow-500" />
                                <span className="font-medium ml-1">{vendorDetails.rating?.toFixed(1) || '4.5'}</span>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {vendorDetails.completed_orders || 50}+ orders
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Phone number সঠিকভাবে দেখানো - vendorDetails থেকে phone ফিল্ড ব্যবহার করুন */}
                          {vendorDetails.phone && (
                            <div className="flex items-center gap-2">
                              <FaPhone className="text-gray-500" />
                              <span className="text-gray-700">{vendorDetails.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <FaHistory className="text-gray-500" />
                            <span className="text-gray-700">{vendorDetails.experience_years || 2} years experience</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCertificate className="text-gray-500" />
                            <span className="text-gray-700">{vendorDetails.verified ? 'Verified Expert' : 'Not Verified'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMotorcycle className="text-gray-500" />
                            <span className="text-gray-700">{vendorDetails.vehicle_type || 'Motorcycle'}</span>
                          </div>
                          {/* Phone number না থাকলে বিকল্প দেখানো */}
                          {!vendorDetails.phone && vendorDetails.email && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-700">{vendorDetails.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FaUser className="text-gray-600" />
                          Service Expert
                        </h3>
                        <div className="text-center py-6">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <FaUser className="text-gray-400 text-xl" />
                          </div>
                          <p className="text-gray-600">
                            {selectedOrder.vendor_id || selectedOrder.service_expert
                              ? 'Loading expert details...'
                              : 'Waiting for expert assignment'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Order Details */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaInfoCircle className="text-gray-600" />
                        Order Details
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-600">Order Date & Time</label>
                          <p className="font-medium text-gray-900">
                            {new Date(selectedOrder.order_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} at {formatTimeSlotDisplay(selectedOrder.time_slot)}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-600">Service Address</label>
                          <p className="font-medium text-gray-900">{getAddressForDisplay(selectedOrder)}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-600">Items</label>
                          <p className="font-medium text-gray-900">
                            {getTotalItems(selectedOrder)} items • ৳{getTotalPrice(selectedOrder)}
                          </p>
                        </div>

                        {selectedOrder.recipient_name && (
                          <div>
                            <label className="text-sm text-gray-600">Recipient</label>
                            <p className="font-medium text-gray-900">{selectedOrder.recipient_name}</p>
                          </div>
                        )}

                        {selectedOrder.notes && (
                          <div>
                            <label className="text-sm text-gray-600">Special Instructions</label>
                            <p className="font-medium text-gray-900">{selectedOrder.notes}</p>
                          </div>
                        )}

                        {/* Penalty Information */}
                        {selectedOrder.penalty_fee > 0 && selectedOrder.cancelled_by === 'user' && (
                          <div className="pt-4 border-t border-gray-100">
                            <div className="bg-red-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-red-800">Penalty Fee</span>
                                <span className="font-bold text-red-900">৳{selectedOrder.penalty_fee}</span>
                              </div>
                              <p className="text-sm text-red-600 mt-1">
                                Charged for service time and transportation
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FaPhoneAlt className="text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 mb-1">Need Help?</h4>
                          <p className="text-sm text-blue-700 mb-2">
                            Contact our support team for assistance
                          </p>
                          <a
                            href="tel:+8801234567890"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            +880 1234 567890
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Fixed at bottom */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: {selectedOrder.order_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(selectedOrder.order_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        closeTrackModal();
                        openDetailsModal(selectedOrder);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      View Full Details
                    </button>
                    {selectedOrder.status !== "Completed" && selectedOrder.status !== "Cancelled" && (
                      <button
                        onClick={() => {
                          closeTrackModal();
                          openCancelModal(selectedOrder);
                        }}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
                      >
                        <FaBan className="text-sm" />
                        Cancel Order
                        {hasServiceStarted(selectedOrder) && (
                          <span className="text-xs">(৳500)</span>
                        )}
                      </button>
                    )}
                    <button
                      onClick={closeTrackModal}
                      className="px-6 py-2 bg-olympic text-white font-medium rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="bg-olympic text-white p-6 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <FaStar className="text-2xl" />
                  <h3 className="font-bold text-lg">Rate Your Experience</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Please rate your experience for order: <span className="font-semibold">{selectedOrder.order_id}</span>
                </p>

                <div className="mb-6">
                  <label className="block font-semibold mb-3 text-gray-900">Service Expert</label>
                  <div className="flex gap-2">
                    {renderStars(reviewData.serviceExpert, (rating) =>
                      setReviewData({ ...reviewData, serviceExpert: rating })
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-semibold mb-3 text-gray-900">Website Service</label>
                  <div className="flex gap-2">
                    {renderStars(reviewData.websiteService, (rating) =>
                      setReviewData({ ...reviewData, websiteService: rating })
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-semibold mb-3 text-gray-900">Comments</label>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-lg border-gray-300"
                    placeholder="Share your experience..."
                    rows="3"
                    value={reviewData.comments}
                    onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-action p-6 pt-0">
                <button
                  onClick={closeReviewModal}
                  className="btn btn-ghost rounded-lg text-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="btn bg-olympic border-none text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && detailedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    <p className="text-gray-600 mt-1">Order ID: {detailedOrder.order_id}</p>
                    {/* শুধুমাত্র ক্যান্সেল করা অর্ডারের জন্য দেখাবে */}
                    {detailedOrder.status === "Cancelled" && detailedOrder.cancelled_by === 'user' && (
                      <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        <FaUserTimes className="text-xs" />
                        Cancelled by You
                      </span>
                    )}
                  </div>
                  <button
                    onClick={closeDetailsModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FaTimesCircle className="text-2xl text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Order Summary */}
                  <div className="space-y-6">
                    {/* Order Status Card */}
                    <div className={`p-4 rounded-lg ${detailedOrder.status === 'Completed' ? 'bg-green-50 border border-green-200' :
                      detailedOrder.status === 'Cancelled' ? 'bg-red-50 border border-red-200' :
                        detailedOrder.status === 'Processing' ? 'bg-orange-50 border border-orange-200' :
                          detailedOrder.status === 'Active' ? 'bg-blue-50 border border-blue-200' :
                            'bg-yellow-50 border border-yellow-200'
                      }`}>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(detailedOrder.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">Current Status</h3>
                          <p className={`text-lg font-bold ${detailedOrder.status === 'Completed' ? 'text-green-700' :
                            detailedOrder.status === 'Cancelled' ? 'text-red-700' :
                              detailedOrder.status === 'Processing' ? 'text-orange-700' :
                                detailedOrder.status === 'Active' ? 'text-blue-700' :
                                  'text-yellow-700'
                            }`}>
                            {detailedOrder.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Information */}
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaInfoCircle />
                        Order Information
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Order Date</p>
                            <p className="font-medium">
                              {new Date(detailedOrder.order_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Time Slot</p>
                            <p className="font-medium">{formatTimeSlotDisplay(detailedOrder.time_slot)}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Address Type</p>
                          <p className="font-medium capitalize flex items-center gap-2">
                            {detailedOrder.address_type === 'home' ? <FaHome /> :
                              detailedOrder.address_type === 'office' ? <FaBuilding /> :
                                <FaMapMarkerAlt />}
                            {detailedOrder.address_type || 'Home'}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Delivery Address</p>
                          <p className="font-medium">{getAddressForDisplay(detailedOrder)}</p>
                        </div>

                        {detailedOrder.notes && (
                          <div>
                            <p className="text-sm text-gray-600">Special Instructions</p>
                            <p className="font-medium">{detailedOrder.notes}</p>
                          </div>
                        )}

                        {/* Penalty Fee (only show if user cancelled) */}
                        {detailedOrder.cancelled_by === 'user' && detailedOrder.penalty_fee > 0 && (
                          <div className="border-t pt-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-600">Penalty Fee</p>
                                <p className="text-xs text-gray-500">Charged for transportation and service time</p>
                              </div>
                              <span className="text-lg font-bold text-red-600">৳{detailedOrder.penalty_fee}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recipient Information */}
                    {(detailedOrder.recipient_name || detailedOrder.recipient_phone) && (
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FaUserTag />
                          Recipient Information
                        </h3>
                        <div className="space-y-2">
                          {detailedOrder.recipient_name && (
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-500" />
                              <span className="font-medium">{detailedOrder.recipient_name}</span>
                            </div>
                          )}
                          {detailedOrder.recipient_phone && (
                            <div className="flex items-center gap-2">
                              <FaPhoneAlt className="text-gray-500" />
                              <span className="font-medium">{detailedOrder.recipient_phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Items & Vendor */}
                  <div className="space-y-6">
                    {/* Order Items */}
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaListUl />
                        Order Items ({detailedOrder.parsed_cart_items?.length || 0})
                      </h3>
                      <div className="space-y-3">
                        {detailedOrder.parsed_cart_items && detailedOrder.parsed_cart_items.length > 0 ? (
                          detailedOrder.parsed_cart_items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">৳{item.price} × {item.quantity}</p>
                              </div>
                              <p className="font-bold">৳{item.price * item.quantity}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">No items found</p>
                        )}

                        {/* Total Summary */}
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">৳{getTotalPrice(detailedOrder)}</span>
                          </div>
                          {detailedOrder.delivery_charge > 0 && (
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Delivery Charge</span>
                              <span className="font-medium">৳{detailedOrder.delivery_charge}</span>
                            </div>
                          )}
                          {detailedOrder.discount > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                              <span>Discount</span>
                              <span>-৳{detailedOrder.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg font-bold pt-3 border-t">
                            <span>Total</span>
                            <span>
                              ৳{getTotalPrice(detailedOrder) +
                                (detailedOrder.delivery_charge || 0) -
                                (detailedOrder.discount || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vendor Information */}
                    {(detailedOrder.vendor_id || detailedOrder.service_expert) && (
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FaUserCheck />
                          Service Expert
                        </h3>
                        {vendorDetails ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {vendorDetails.photo_url ? (
                                <img
                                  src={vendorDetails.photo_url}
                                  alt={vendorDetails.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={handleImageError}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <FaUser className="text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-gray-900">{vendorDetails.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center">
                                    <FaStar className="text-yellow-500 text-sm" />
                                    <span className="text-sm font-medium ml-1">{vendorDetails.rating?.toFixed(1) || '4.5'}</span>
                                  </div>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {vendorDetails.completed_orders || 50} orders
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-500" />
                                <span>{vendorDetails.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaBriefcase className="text-gray-500" />
                                <span>{vendorDetails.experience_years || 2} years exp</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaCertificate className="text-gray-500" />
                                <span>{vendorDetails.verified ? 'Verified' : 'Not Verified'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMotorcycle className="text-gray-500" />
                                <span>{vendorDetails.vehicle_type || 'Motorcycle'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                closeDetailsModal();
                                openTrackModal(selectedOrder);
                              }}
                              className="w-full mt-4 btn bg-olympic border-none text-white hover:bg-blue-600 flex items-center justify-center gap-2"
                            >
                              <FaTruck />
                              Track This Order
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olympic mx-auto mb-2"></div>
                            <p className="text-gray-600">Loading expert details...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <button
                      onClick={() => {
                        closeDetailsModal();
                        openTrackModal(selectedOrder);
                      }}
                      className="btn btn-outline border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <FaTruck />
                      Track Order
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {/* Schedule Change Button - only for Pending and Processing orders */}
                    {(detailedOrder.status === "Pending" || detailedOrder.status === "Processing") && !detailedOrder.vendor_id && !detailedOrder.service_expert && (
                      <button
                        onClick={() => {
                          closeDetailsModal();
                          openScheduleModal(detailedOrder);
                        }}
                        className="btn bg-green-100 border-green-300 text-green-700 hover:bg-green-200 flex items-center gap-2"
                      >
                        <FaCalendarAlt />
                        Reschedule
                      </button>
                    )}

                    {detailedOrder.status !== 'Cancelled' && detailedOrder.status !== 'Completed' && (
                      <button
                        onClick={() => {
                          closeDetailsModal();
                          openCancelModal(selectedOrder);
                        }}
                        className="btn btn-outline btn-error border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FaBan />
                        Cancel Order
                      </button>
                    )}
                    <button
                      onClick={closeDetailsModal}
                      className="btn bg-olympic border-none text-white hover:bg-blue-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;