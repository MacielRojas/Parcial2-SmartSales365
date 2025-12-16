import React from "react";

type ModalProps = {
  title: string;
  show?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

function Modal({ title, show = true, onClose, children, size = "md" }: ModalProps) {
  const getModalSizeClass = () => {
    switch (size) {
      case "sm":
        return "modal-sm";
      case "lg":
        return "modal-lg";
      case "xl":
        return "modal-xl";
      default:
        return ""; // tamaño normal
    }
  };

  // Si show es false, no renderizamos nada
  if (!show) return null;

  return (
    <div
      id="modal"
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${getModalSizeClass()} mx-3 mx-sm-auto`}
        role="document"
      >
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 id="modalTitle" className="modal-title">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
