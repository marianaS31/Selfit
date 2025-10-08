import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  const checkAuthorization = () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        // If no token is found, user is not authenticated
        return { isAuthenticated: false };
      }

      const decoded = jwtDecode(token); // Decode the JWT
      const userRole = decoded.role; // Extract the role from the token
      const isAllowed = allowedRoles.includes(userRole);

      return {
        isAuthenticated: true,
        isAuthorized: isAllowed,
        userRole,
      };
    } catch (error) {
      console.error('Error while checking authorization:', error.message);
      return { isAuthenticated: false };
    }
  };

  const authStatus = checkAuthorization();

  // Direction based on role
  if (authStatus.isAuthenticated) {
    if (!authStatus.isAuthorized) {
      const redirectPath =
        authStatus.userRole === 'Customer' ? '/c/sellerList' : '/s/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  } else {
    // Direction not authenticated
    return <Navigate to="/a/login" state={{ from: location }} replace />; // Don’t remember the old page
  }

  // If authenticated and authorized, render the protected content
  return children;
};

export default ProtectedRoute;
