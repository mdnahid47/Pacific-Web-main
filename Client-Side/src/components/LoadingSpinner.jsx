import React from "react";

const LoadingSpinner = ({ fullScreen = true, size = "md", text = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
  };

  const containerClass = fullScreen
    ? "min-h-screen flex items-center justify-center bg-white"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div
            className={`${sizeClasses[size]} border-olympic/20 rounded-full`}
          ></div>
          <div
            className={`${sizeClasses[size]} border-transparent border-t-olympic rounded-full animate-spin absolute top-0 left-0`}
          ></div>
        </div>

        {/* Brand */}
        <div className="text-center">
          <p className="text-olympic font-black text-lg tracking-wider">
            OLYMPIC
          </p>
          {text && (
            <p className="text-gray-500 text-xs font-medium mt-1 animate-pulse">
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;