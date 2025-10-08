import React, { useState } from 'react';
import '../../styles/orderMessageModal.css';

const MessageModal = ({ isOpen, onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // State to hold validation error

  const handleSend = () => {
    // Validate the message length
    if (message.length < 10) {
      setError('Message must be at least 10 characters long');
      return;
    }

    try {
      if (message) {
        onSend(message);
        setMessage(''); //reset message
        onClose(); // close modal after sending
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCancel = () => {
    setMessage('');
    setError(''); // Reset error message on cancel
    onClose(); //close modal
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-container">
      <div className="order-modal-content">
        <h3 className="order-modal-title">Contact Seller</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="order-modal-textarea"
        />
        {/* <p className="error-message-modal">{error}</p> */}
        {error && <p className="error-message-modal">{error}</p>}
        <div className="order-modal-buttons">
          <button onClick={handleCancel} className="order-modal-cancel-button">
            Cancel
          </button>
          <button onClick={handleSend} className="order-modal-send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
