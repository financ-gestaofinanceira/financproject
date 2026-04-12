import React from "react";
import "./ModalStyle.css";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const CadContasModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="cnt_close">
          <button type="button" className="close-button" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default CadContasModal;
