const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg max-w-96 max-h-[600px] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="h-full overflow-y-auto p-2">
            {/* Content that may exceed the modal height */}
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  export default CustomModal;
  