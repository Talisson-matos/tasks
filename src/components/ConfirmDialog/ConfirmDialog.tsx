import React from 'react';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="confirm-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-content">
        <div className="confirm-header">
          <div className="confirm-icon">
            <AlertTriangle size={24} />
          </div>
          <h3 className="confirm-title">{title}</h3>
        </div>
        
        <div className="confirm-body">
          <p className="confirm-message">{message}</p>
        </div>
        
        <div className="confirm-actions">
          <button
            onClick={onCancel}
            className="btn btn-cancel"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;