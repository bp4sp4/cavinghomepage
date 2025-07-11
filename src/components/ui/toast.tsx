import React from "react";

interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  let bgColor = "bg-gray-800";
  if (type === "success") bgColor = "bg-[#2B7FFF]";
  if (type === "error") bgColor = "bg-red-500";
  if (type === "info") bgColor = "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg mb-3 flex items-center justify-between animate-fade-in-out`}
      style={{ animationDuration: "0.5s" }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white opacity-75 hover:opacity-100"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
