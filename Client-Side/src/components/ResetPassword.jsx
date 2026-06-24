import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [verifying, setVerifying] = useState(true);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        // Verify token when component mounts
        const verifyToken = async () => {
            if (!token || !email) {
                toast.error("Invalid reset link");
                setVerifying(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5001/api/verify-reset-token?token=${token}&email=${email}`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setTokenValid(true);
                    } else {
                        toast.error(data.message);
                    }
                } else {
                    toast.error("Invalid reset link");
                }
            } catch (error) {
                console.error("Token verification error:", error);
                toast.error("Failed to verify reset link");
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    email,
                    newPassword: formData.password
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Password reset successfully!", {
                    position: "top-center",
                });
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-red-500 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Invalid Reset Link</h2>
                    <p className="text-gray-600 mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="btn btn-primary w-full gap-2 rounded-xl"
                    >
                        <FaArrowLeft />
                        Request New Reset Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheck className="text-green-500 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        Set New Password
                    </h1>
                    <p className="text-gray-600">
                        Enter your new password for {email}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">New Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter new password"
                            className="input input-bordered w-full rounded-xl"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Confirm Password</span>
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            className="input input-bordered w-full rounded-xl"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Resetting...
                            </>
                        ) : (
                            <>
                                <FaLock />
                                Reset Password
                            </>
                        )}
                    </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <button
                        onClick={() => navigate('/login')}
                        className="btn btn-ghost gap-2 rounded-xl"
                    >
                        <FaArrowLeft />
                        Back to Login
                    </button>
                </div>
            </div>

            <ToastContainer 
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default ResetPassword;