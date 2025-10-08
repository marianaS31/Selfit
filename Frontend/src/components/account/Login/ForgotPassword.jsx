import React, { useState } from 'react';
import '../../../styles/authForm.css';
import { forgotPassword } from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
  const [userEmail, setUserEmail] = useState('');
  const [userEmailError, setUserEmailError] = useState(null);
  const [userEmailSuccess, setUserEmailSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUserEmail(e.target.value);
  };

  const validateForm = () => {
    const errors = {};

    if (!userEmail) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      errors.email = 'Invalid email address.';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    if (validateForm()) {
      try {
        await forgotPassword(userEmail);

        setUserEmailSuccess(true);
        setUserEmailError(null);

        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/a/reset-password');
        }, 2000);
      } catch (err) {
        setUserEmailError('Wrong email, please try again');
        setUserEmailSuccess(false);
        setIsRedirecting(false);
      } finally {
        setIsSending(false); // Reset sending
      }
    }
  };

  return (
    <div className="authentication-form-container">
      <div className="authentication-form">
        <h2 className="auth-title">FORGOT YOUR PASSWORD?</h2>
        <div className="auth-info-container">
          <p className="auth-info">
            No worries. Provide your account email address, and we'll guide you
            how to reset your password.
          </p>
        </div>
        <form onSubmit={handleResetPasswordSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={userEmail}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
            />
            <label className="label-placeholder">Email Address*</label>
            {validationErrors.email && (
              <p className="auth-error-message">{validationErrors.email}</p>
            )}
          </div>
          <button type="submit" className="submit-authentication">
            RESET PASSWORD
          </button>
          <p className="forgot-password">
            <a className="forgot-password-link" href="/a/login">
              Back to login
            </a>
          </p>
        </form>
        {userEmailSuccess && (
          <p style={{ color: 'green' }}>Email sent successfully!</p>
        )}
        {userEmailError && <p style={{ color: 'red' }}>{userEmailError}</p>}
        {isRedirecting && (
          <p style={{ color: 'blue' }}>Redirecting to reset password page...</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
