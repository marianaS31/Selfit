import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import profileEditIcon from '../../assets/icons/account192.png';
import logoutIcon from '../../assets/icons/Logout.png';
import ordersIcon from '../../assets/icons/orders.png';

import '../../styles/header.css';

function Header() {
  const navigate = useNavigate();

  const handleSiteTitleClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'Seller') {
          navigate('/s/dashboard');
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

  const handleProfileEditClick = () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === 'Seller') {
          navigate('/s/editProfile');
        } else if (userRole === 'Customer') {
          navigate('/c/editProfile');
        } else {
          navigate('/a/login');
        }
      } catch {
        navigate('/a/login');
      }
    } else {
      navigate('/a/login');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userID');
    localStorage.removeItem('role');
    navigate('/a/login');
  };

  const handleViewOrderClick = () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;
        const userId = decodedToken.user_guid;

        if (userRole === 'Seller') {
          navigate(`/s/orders/${userId}`);
        } else if (userRole === 'Customer') {
          navigate(`/c/orders/${userId}`);
        } else {
          navigate('/a/login');
        }
      } catch {
        navigate('/a/login');
      }
    }
  };
  return (
    <header className="header-container">
      <div className="site-title" onClick={handleSiteTitleClick}>
        SELFIT
      </div>

      <div className="user-actions">
        <div className="user-view-all-orders" onClick={handleViewOrderClick}>
          <img src={ordersIcon} alt="Orders" className="orders-icon" />
        </div>

        <div className="profile-edit-link" onClick={handleProfileEditClick}>
          <img
            src={profileEditIcon}
            alt="Profile Edit"
            className="profile-edit-icon"
          />
        </div>

        <div className="logout-link" onClick={logout}>
          <img src={logoutIcon} alt="Logout" className="logout-icon" />
        </div>
      </div>
    </header>
  );
}

export default Header;
