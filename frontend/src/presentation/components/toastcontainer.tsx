import React from "react";
import { ToastContainer, toast, type ToastOptions, } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Función para disparar los toasts desde cualquier lugar
export const showToast = (message: string, type: "success" | "error" | "info" = "info", options?: ToastOptions) => {
  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
    default:
      toast.info(message, options);
      break;
  }
};

const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastProvider;
