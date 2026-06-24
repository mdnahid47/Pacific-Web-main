import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaArrowLeft, FaKey, FaCheckCircle, FaLock, FaCopy } from 'react-icons/fa';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [resetLink, setResetLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const emailVal = e.target.email.value;
        setEmail(emailVal);

        try {
            console.log("Sending forgot password request...");
            
            const response = await fetch('http://localhost:5001/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailVal }),
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (data.success) {
                toast.success(data.message, {
                    position: "top-center",
                });
                
                // reset link store
                if (data.resetLink) {
                    setResetLink(data.resetLink);
                }
                
                setIsSubmitted(true);
            } else {
                toast.error(data.message, {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error('Request failed:', error);
            toast.error("Failed to send reset request. Please try again.", {
                position: "top-center",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleTryAnotherEmail = () => {
        setIsSubmitted(false);
        setEmail('');
        setResetLink('');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(resetLink);
        toast.success("Link copied to clipboard!", {
            position: "top-center",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Success State */}
                {isSubmitted ? (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="text-green-500 text-3xl" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-gray-900 mb-3">
                            Check Your Email!
                        </h2>
                        
                        <p className="text-gray-600 mb-2">
                            We've sent a password reset link to:
                        </p>
                        <p className="font-semibold text-blue-600 mb-6 break-all">{email}</p>

                        {/* Reset Link Display (Development Mode)
                        {resetLink && (
                            <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                <p className="text-sm text-yellow-800 mb-2 font-semibold">
                                    🚨 Development Mode - Reset Link:
                                </p>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={resetLink} 
                                        readOnly 
                                        className="flex-1 text-xs p-2 border rounded bg-white"
                                    />
                                    <button 
                                        onClick={copyToClipboard}
                                        className="btn btn-sm btn-outline gap-1"
                                    >
                                        <FaCopy />
                                        Copy
                                    </button>
                                </div>
                                <p className="text-xs text-yellow-600 mt-2">
                                    Click the link or copy it to reset your password
                                </p>
                            </div>
                        )}
                         */}
                        <div className="space-y-3">
                            <button
                                onClick={handleTryAnotherEmail}
                                className="btn btn-ghost w-full gap-2 rounded-xl"
                            >
                                <FaEnvelope />
                                Try Another Email
                            </button>
                            
                            <button
                                onClick={handleBackToHome}
                                className="btn btn-outline w-full gap-2 rounded-xl"
                            >
                                <FaArrowLeft />
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Reset Password Form */
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FaLock className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">
                                Reset Password
                            </h1>
                            <p className="text-gray-600">
                                Enter your email to receive a reset link
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                                        <FaEnvelope className="text-blue-500" />
                                        Email Address
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="input input-bordered w-full rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn bg-blue-500 hover:bg-blue-700 text-white w-full rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FaKey />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Back to Home */}
                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleBackToHome}
                                className="btn btn-ghost gap-2 rounded-xl text-gray-600 hover:text-gray-900"
                            >
                                <FaArrowLeft />
                                Back to Home Page
                            </button>
                        </div>
                    </div>
                )}
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
}

export default ForgotPassword;