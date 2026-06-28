import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import api from '../api'; // Import the configured axios instance

const NotificationTrigger = ({ onClick }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch unread count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // ✅ Removed /api prefix
                const response = await api.get('/notifications/unread-count', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setUnreadCount(response.data.count);
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();

        // Poll for updates
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Desktop Floating Button */}
            {!isMobile && (
                <div className="fixed right-6 bottom-6 z-30">
                    <button
                        onClick={onClick}
                        className="btn btn-primary btn-circle btn-lg shadow-2xl hover:shadow-3xl transition-all duration-300 animate-bounce"
                        style={{ animationDuration: '2s' }}
                    >
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-6 min-h-6 text-xs font-bold text-white bg-error rounded-full px-1 animate-ping">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Mobile Bottom Bar Button */}
            {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-base-100 border-t border-base-300 md:hidden">
                    <div className="flex items-center justify-around p-2">
                        <button
                            onClick={onClick}
                            className="flex flex-col items-center justify-center p-3 relative"
                        >
                            <div className="relative">
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-5 min-h-5 text-xs font-bold text-white bg-error rounded-full px-1 animate-pulse">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs mt-1">Notifications</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Floating Button Alternative */}
            {isMobile && (
                <button
                    onClick={onClick}
                    className="fixed right-4 bottom-20 z-30 btn btn-primary btn-circle shadow-2xl md:hidden"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 min-h-5 text-xs font-bold text-white bg-error rounded-full px-1 animate-ping">
                            {unreadCount}
                        </span>
                    )}
                </button>
            )}
        </>
    );
};

export default NotificationTrigger;