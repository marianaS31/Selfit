import React, { useState } from 'react';
import { resetPassword } from '../../../services/AuthService';
import '../../../styles/authForm.css';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { Icon } from 'react-icons-kit';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [newPasswordData, setNewPasswordData] = useState({
    email: '',
    code: '',
    newPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [passwordInputType, setPasswordInputType] = useState('password');
  const [passwordVisibilityIcon, setPasswordVisibilityIcon] = useState(eyeOff);
  const [passwordTooltipText, setPasswordTooltipText] =
    useState('Show password');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setNewPasswordData((previousPassword) => ({
      ...previousPassword,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    if (passwordInputType === 'password') {
      setPasswordVisibilityIcon(eye);
      setPasswordInputType('text');
      setPasswordTooltipText('Hide Password');
    } else {
      setPasswordVisibilityIcon(eyeOff);
      setPasswordInputType('password');
      setPasswordTooltipText('Show password');
    }
  };

  const validateForm = () => {
    const newValidationErrors = {};

    if (!newPasswordData.email) {
      newValidationErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(newPasswordData.email)) {
      newValidationErrors.email = 'Invalid email address.';
    }

    if (!newPasswordData.code) {
      newValidationErrors.code = 'Code is required.';
    }

    if (!newPasswordData.newPassword) {
      newValidationErrors.newPassword = 'New password is required.';
    } else if (newPasswordData.newPassword.length < 8) {
      newValidationErrors.newPassword =
        'Password must be at least 8 characters long.';
    } else if (newPasswordData.newPassword.length > 12) {
      newValidationErrors.newPassword =
        'Password must be less than 12 characters long.';
    } else if (!/^(?=.*[A-Z])(?=.*\d).*$/.test(newPasswordData.newPassword)) {
      newValidationErrors.password =
        'Password must contain at least one uppercase letter and one number';
    }

    setValidationErrors(newValidationErrors);

    return Object.keys(newValidationErrors).length === 0; // Return true if no errors
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    if (validateForm()) {
      try {
        await resetPassword(newPasswordData);
        setNewPasswordSuccess('Password has been changed successfully!');
        setNewPasswordError(null);

        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/a/login');
        }, 2000);
      } catch (err) {
        setNewPasswordError('Failed to change the password, please try again');
        setNewPasswordSuccess(false);
      } finally {
        setIsSending(false);
      }
    }
  };
  //const { token } = useParams();
  //console.log('Reset Password Token:', token);
  return (
    <div className="authentication-form-container">
      <div className="authentication-form">
        <h2 className="auth-title">CHANGE YOUR PASSWORD</h2>
        <div className="auth-info-container">
          <p className="auth-info">Please enter a new password below.</p>
        </div>
        <form onSubmit={handleNewPasswordSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="code"
              value={newPasswordData.code}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
            />
            <label className="label-placeholder">Code*</label>
            {validationErrors.code && (
              <p className="auth-error-message">{validationErrors.code}</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={newPasswordData.email}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
            />
            <label className="label-placeholder">Email Address*</label>
            {validationErrors.email && (
              <p className="auth-error-message">{validationErrors.email}</p>
            )}
          </div>

          <div className="form-group input-password">
            <input
              type={passwordInputType}
              name="newPassword"
              value={newPasswordData.newPassword}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
            />
            <label className="label-placeholder">New Password*</label>
            {validationErrors.newPassword && (
              <p className="auth-error-message">
                {validationErrors.newPassword}
              </p>
            )}
            <span onClick={togglePasswordVisibility} className="icon-wrapper">
              <Icon icon={passwordVisibilityIcon} size={16} />
              <div className="tooltip">{passwordTooltipText}</div>
            </span>
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
        {newPasswordSuccess && (
          <p style={{ color: 'green' }}>{newPasswordSuccess}</p>
        )}
        {newPasswordError && <p style={{ color: 'red' }}>{newPasswordError}</p>}
        {isRedirecting && (
          <p style={{ color: 'blue' }}>Redirecting to login page...</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
