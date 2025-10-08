import { useNavigate } from 'react-router-dom';
import '../../styles/sellerDashboard.css';

const SellerDashboardButtons = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem('userID');

  const handleCreateProductClick = () => {
    navigate(`/s/createProduct`, {
      state: {},
    });
  };

  const handleViewProductsClick = () => {
    navigate(`/s/allProducts`, {
      state: {},
    });
  };

  const handleManageOrdersClick = () => {
    navigate(`/s/orders/${userId}`, {
      state: {},
    });
  };

  return (
    <div className="seller-dashboard-buttons-container">
      <div
        className="seller-dashboard-button"
        onClick={handleCreateProductClick}
      >
        <p className="seller-dashboard-label">CREATE PRODUCT</p>
      </div>
      <div
        className="seller-dashboard-button"
        onClick={handleViewProductsClick}
      >
        <p className="seller-dashboard-label">VIEW PRODUCTS</p>
      </div>
      <div
        className="seller-dashboard-button"
        onClick={handleManageOrdersClick}
      >
        <p className="seller-dashboard-label">MANAGE ORDERS</p>
      </div>
    </div>
  );
};

export default SellerDashboardButtons;
