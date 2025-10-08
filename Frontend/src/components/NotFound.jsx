import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'Seller') {
          navigate('/s/SellerPage');
        } else if (userRole === 'Customer') {
          navigate('/c/sellerList');
        }
      } catch {
        navigate('/a/login');
      }
    } else {
      navigate('/a/login');
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <div className="not-found-content">
      <h1 className="not-found-error">404</h1>
      <h2 className="not-found-message">WE CAN NOT FIND THAT PAGE</h2>
      <div className="not-found-buttons">
        <button onClick={handleGoBack} className="not-found-button back-button">
          Go Back
        </button>
        <button onClick={handleGoHome} className="not-found-button home-button">
          Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
