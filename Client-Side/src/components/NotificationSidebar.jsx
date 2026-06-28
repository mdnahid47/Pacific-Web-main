import React, { useState, useEffect, useRef } from 'react';
import api from '../api'; // Import the configured axios instance
import { formatDistanceToNow } from 'date-fns';
import {
    Bell,
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
    Settings,
    Filter,
    ChevronRight
} from 'lucide-react';

const NotificationSidebar = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'unread', 'read'
    const sidebarRef = useRef(null);

    // Olympic blue color theme
    const olympicBlue = '#0085C7';

    // Fetch notifications - ✅ Removed /api prefix
    const fetchNotifications = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const token = localStorage.getItem('token');
            const response = await api.get('/notifications', {
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

    // Mark notification as read - ✅ Removed /api prefix
    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/notifications/${id}/read`, {}, {
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

    // Mark all as read - ✅ Removed /api prefix
    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.patch('/notifications/mark-all-read', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Delete notification - ✅ Removed /api prefix
    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/notifications/${id}`, {
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

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    // Initial fetch and polling
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();

            const interval = setInterval(() => fetchNotifications(false), 30000);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

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
                return <Bell className="w-5 h-5 text-gray-500" />;
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

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" />
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full bg-base-100 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-base-300 bg-gradient-to-r from-primary/5 to-olympic/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-olympic/10">
                                <Bell className="w-6 h-6" style={{ color: olympicBlue }} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Notifications</h2>
                                <p className="text-sm text-base-content/60">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className={`btn btn-ghost btn-circle btn-sm ${refreshing ? 'loading' : ''}`}
                                onClick={handleRefresh}
                                disabled={refreshing}
                            >
                                {!refreshing && <RefreshCw className="w-4 h-4" />}
                            </button>
                            <button
                                className="btn btn-ghost btn-circle btn-sm"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-4 border-b border-base-300">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            <button
                                className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                All ({notifications.length})
                            </button>
                            <button
                                className={`btn btn-sm ${activeFilter === 'unread' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setActiveFilter('unread')}
                            >
                                Unread ({notifications.filter(n => !n.is_read).length})
                            </button>
                            <button
                                className={`btn btn-sm ${activeFilter === 'read' ? 'btn-primary' : 'btn-ghost'}`}
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
                                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                                <p className="text-base-content/60">Loading notifications...</p>
                            </div>
                        ) : filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <Bell className="w-20 h-20 text-base-300 mb-4" />
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
                                        className={`p-4 hover:bg-base-200 transition-colors duration-200 cursor-pointer ${!notification.is_read ? 'bg-primary/5' : ''
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
                                                    <h4 className={`font-semibold ${!notification.is_read ? 'text-primary' : 'text-base-content'
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
                                                        <span className="badge badge-primary badge-sm animate-pulse">
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
                                className="btn btn-primary flex-1"
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Mark all as read
                            </button>
                            <button
                                className="btn btn-outline flex-1"
                                onClick={() => {
                                    onClose();
                                    window.location.href = '/notifications';
                                }}
                            >
                                View all
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotificationSidebar;