import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

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
    }
  };

  const handleCancel = () => {
    setMessage('');
    setError(''); // Reset error message on cancel
    onClose(); //close modal
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.orderModalContainer}>
        <View style={styles.orderModalContent}>
          <Text style={styles.orderModalTitle}>Contact Seller</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Enter your message here..."
            style={styles.orderModalTextarea}
            textAlignVertical="top"
            multiline={true}
          />
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          <View style={styles.orderModalButtons}>
            <TouchableOpacity
              style={styles.orderModalCancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.orderModalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderModalSendButton}
              onPress={handleSend}
            >
              <Text style={styles.orderModalSendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  orderModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  orderModalContent: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  orderModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000000',
    textAlign: 'center',
  },
  orderModalTextarea: {
    width: '100%',
    height: 120,
    padding: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#cccccc',
    borderRadius: 8,
    fontSize: 16,
  },
  orderModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  orderModalSendButton: {
    height: 36,
    paddingHorizontal: 24,
    borderRadius: 32,
    borderWidth: 2, // unnecessary, but too keep same size
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderModalCancelButton: {
    height: 36,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderModalSendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  orderModalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginTop: -20,
    marginBottom: 10,
  },
});

export default MessageModal;
