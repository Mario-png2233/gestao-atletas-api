import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  }[type] || 'bg-success';

  return (
    <div className="toast-container">
      <div className={`toast show ${bgClass} text-white`} role="alert">
        <div className="toast-body d-flex justify-content-between align-items-center">
          {message}
          <button 
            type="button" 
            className="btn-close btn-close-white ms-2" 
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default Toast;



