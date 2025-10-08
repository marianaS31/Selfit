import React, { useState } from 'react';
import { loginUser } from '../../../services/AuthService.jsx';
import '../../../styles/authForm.css';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { Icon } from 'react-icons-kit';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginForm() {
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordInputType, setPasswordInputType] = useState('password');
  const [passwordVisibilityIcon, setPasswordVisibilityIcon] = useState(eyeOff);
  const [passwordTooltipText, setPasswordTooltipText] =
    useState('Show password');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleInputChange = (e) => {
    setUserCredentials((previousCredentials) => ({
      ...previousCredentials,
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
    const errors = {};
    if (!userCredentials.email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(userCredentials.email)) {
      errors.email = 'Invalid email address.';
    }

    if (!userCredentials.password) {
      errors.password = 'Password is required.';
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const decoded = await loginUser(userCredentials);
        setLoginSuccess(true);
        setLoginError(null);
        if (from) {
          navigate(from, { replace: true });
        } else if (decoded.role === 'Customer') {
          navigate('/c/sellerList');
        } else if (decoded.role === 'Seller') {
          navigate('/s/dashboard');
        }
      } catch (err) {
        setLoginError('Failed to log in, please try again');
        setLoginSuccess(false);
      }
    }
  };

  return (
    <div className="authentication-form-container">
      <div className="authentication-form">
        <h2 className="auth-title">SELFIT LOGIN</h2>
        <div className="auth-info-container">
          <p className="auth-info">
            Find your perfect style, track your orders, and shop effortlessly
            with us.
          </p>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={userCredentials.email}
              onChange={handleInputChange}
              placeholder=" "
              className="form-input"
              autoComplete="username"
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
              autoComplete="current-password"
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
          <p className="forgot-password">
            <a className="forgot-password-link" href="/a/forgot-password">
              Forgot password?
            </a>
          </p>
          <button type="submit" className="submit-authentication">
            LOG IN
          </button>
          <p className="account-exist-question">
            Don't have an account?{' '}
            <a href="/a/register" className="signup-method">
              Sign Up
            </a>
          </p>
        </form>
        {loginSuccess && <p style={{ color: 'green' }}>Login was Successful</p>}
        {loginError && (
          <p style={{ color: 'red' }}>Bad Email or Password, try again</p>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
