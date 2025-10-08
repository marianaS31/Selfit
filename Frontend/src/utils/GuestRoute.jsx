import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const GuestRoute = ({ children }) => {
  const checkAuthentication = () => {
    try {
      // Check for token in localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { isAuthenticated: false };
      }

      const decoded = jwtDecode(token);
      return {
        isAuthenticated: true,
        userRole: decoded.role,
      };
    } catch (error) {
      console.error('Error checking authentication:', error.message);
      return { isAuthenticated: false };
    }
  };

  const authStatus = checkAuthentication();

  if (authStatus.isAuthenticated) {
    const redirectPath =
      authStatus.userRole === 'Customer' ? '/c/sellerList' : '/s/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If not authenticated, render the requested component
  return children;
};

export default GuestRoute;
