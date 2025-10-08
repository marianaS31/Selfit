import React, { useState } from 'react';
import {
  registerCustomer,
  registerSeller,
} from '../../../services/AuthService';
import '../../../styles/authForm.css';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { Icon } from 'react-icons-kit';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [userType, setUserType] = useState('customer');

  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordInputType, setPasswordInputType] = useState('password');
  const [passwordVisibilityIcon, setPasswordVisibilityIcon] = useState(eyeOff);
  const [passwordTooltipText, setPasswordTooltipText] =
    useState('Show password');

  const [confirmPasswordInputType, setConfirmPasswordInputType] =
    useState('password');
  const [confirmPasswordVisibilityIcon, setConfirmPasswordVisibilityIcon] =
    useState(eyeOff);
  const [confirmPasswordTooltipText, setConfirmPasswordTooltipText] =
    useState('Show password');

  const navigate = useNavigate();

  // Handle user type changes
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    setUserCredentials((previousCredentials) => ({
      ...previousCredentials,
      [e.target.name]: e.target.value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    if (passwordInputType === 'password') {
      setPasswordVisibilityIcon(eye);
      setPasswordInputType('text');
      setPasswordTooltipText('Hide Password');
    } else {
      setPasswordVisibilityIcon(eyeOff);
      setPasswordInputType('password');
      setPasswordTooltipText('Show Password');
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    if (confirmPasswordInputType === 'password') {
      setConfirmPasswordVisibilityIcon(eye);
      setConfirmPasswordInputType('text');
      setConfirmPasswordTooltipText('Hide Password');
    } else {
      setConfirmPasswordVisibilityIcon(eyeOff);
      setConfirmPasswordInputType('password');
      setConfirmPasswordTooltipText('Show Password');
    }
  };

  // Validation function
  const validateForm = () => {
    const newValidationErrors = {};

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userCredentials.email) {
      newValidationErrors.email = 'Email is required';
    } else if (!emailPattern.test(userCredentials.email)) {
      newValidationErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!userCredentials.password) {
      newValidationErrors.password = 'Password is required';
    } else if (userCredentials.password.length < 8) {
      newValidationErrors.password = 'Password must be at least 8 characters';
    } else if (userCredentials.password.length > 12) {
      newValidationErrors.password = 'Password must be less than 12 characters';
    } else if (!/^(?=.*[A-Z])(?=.*\d).*$/.test(userCredentials.password)) {
      newValidationErrors.password =
        'Password must contain at least one uppercase letter and one number';
    }

    // Confirm password validation
    if (userCredentials.confirmPassword !== userCredentials.password) {
      newValidationErrors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  // Handle registration form submission
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (userType === 'customer') {
          await registerCustomer(userCredentials);
        } else if (userType === 'seller') {
          await registerSeller(userCredentials);
        }
        setRegistrationSuccess(true);
        setRegistrationError(null);
        navigate('/a/login');
      } catch (err) {
        setRegistrationError('User Already exist');
        setRegistrationSuccess(false);
      }
    }
  };

  return (
    <div className="authentication-form-container">
      <div className="authentication-form">
        <h2 className="auth-title">SELFIT SIGNUP</h2>
        <div className="auth-info-container">
          <p className="auth-info">
            Sign up to unlock exclusive styles, track orders, and enjoy easy
            shopping.
          </p>
        </div>
        <div className="user-type-selection">
          <button
            type="button"
            className={`user-type-button ${
              userType === 'customer' ? 'active' : ''
            }`}
            onClick={() => handleUserTypeChange('customer')}
          >
            Customer
          </button>
          <button
            type="button"
            className={`user-type-button ${
              userType === 'seller' ? 'active' : ''
            }`}
            onClick={() => handleUserTypeChange('seller')}
          >
            Seller
          </button>
        </div>
        <form onSubmit={handleRegistrationSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={userCredentials.email}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
              autocomplete="username"
            />
            <label className="label-placeholder">Email Address*</label>
            {validationErrors.email && (
              <p className="auth-error-message">{validationErrors.email}</p>
            )}
          </div>

          <div className="form-group input-password">
            <input
              type={passwordInputType}
              name="password"
              value={userCredentials.password}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
              autocomplete="new-password"
            />
            <label className="label-placeholder">Password*</label>
            <span onClick={togglePasswordVisibility} className="icon-wrapper">
              <Icon icon={passwordVisibilityIcon} size={16} />
              <div className="tooltip">{passwordTooltipText}</div>
            </span>
            {validationErrors.password && (
              <p className="auth-error-message">{validationErrors.password}</p>
            )}
          </div>

          <div className="form-group input-password">
            <input
              type={confirmPasswordInputType}
              name="confirmPassword"
              value={userCredentials.confirmPassword}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
              autoComplete="off"
            />
            <label className="label-placeholder">Confirm Password*</label>
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="icon-wrapper"
            >
              <Icon icon={confirmPasswordVisibilityIcon} size={16} />
              <div className="tooltip">{confirmPasswordTooltipText}</div>
            </span>
            {validationErrors.confirmPassword && (
              <p className="auth-error-message">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
          <button type="submit" className="submit-authentication">
            CREATE ACCOUNT
          </button>
          <p className="account-exist-question">
            Already have an account?{' '}
            <a href="/a/login" className="signup-method">
              Log in
            </a>
          </p>
        </form>
        {/* Display registration result */}
        {registrationSuccess && (
          <p style={{ color: 'green' }}>Registration was Successful</p>
        )}
        {registrationError && (
          <p style={{ color: 'red' }}>{registrationError} </p>
        )}
      </div>
    </div>
  );
}

export default RegisterForm;
