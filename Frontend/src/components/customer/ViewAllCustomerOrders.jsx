import '../../styles/viewAllCustomerOrders.css';
import { getOrderByCustomer } from '../../services/AuthService';
import { useEffect, useState } from 'react';

function ViewAllCustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const customerId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderByCustomer(customerId);
        setOrders(data);
      } catch (err) {
        setError('No orders were found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="customer-orders-container">
      <div className="customer-orders-content">
        <h2 className="customer-orders-title">MY ORDERS</h2>
        <div className="customer-orders-info-container">
          <p className="customer-orders-info">
            View and track all your orders in one place
          </p>
        </div>
        {isLoading && <div className="loading-message">Loading orders...</div>}
        {error && <div className="error-message">{error}</div>}

        {!isLoading && !error && (
          <div className="customer-orders-list">
            {orders.map((order) => (
              <div
                key={order.Id}
                className={`customer-order-card ${
                  selectedOrder?.Id === order.Id ? 'selected' : ''
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <h3 className="customer-product-name">{order.Product.Name}</h3>
                <div className="customer-product-details">
                  <p>Price: {order.Product.Price}€</p>
                  <p>Color: {order.Product.Color}</p>
                  <p>Material: {order.Product.Material}</p>
                  <p
                    className={`order-status status-${order.OrderStatus.toLowerCase()}`}
                  >
                    Status: {order.OrderStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="customer-order-details">
            <h3 className="customer-order-details-title">Order Details</h3>

            <div className="customer-details-section">
              <h4> Product Information</h4>
              <p>Name: {selectedOrder.Product.Name}</p>
              <p>Price: {selectedOrder.Product.Price}€</p>
              <p>Color: {selectedOrder.Product.Color}</p>
              <p>Material: {selectedOrder.Product.Material}</p>
              <div className="customer-details-section">
                <h4>Order Status</h4>
                <p
                  className={`order-status status-${selectedOrder.OrderStatus.toLowerCase()}`}
                >
                  {selectedOrder.OrderStatus}
                </p>
              </div>
            </div>
            <div className="customer-details-section">
              <h4>Customer Information</h4>
              <p>Full Name: {selectedOrder.Customer.FullName || 'N/A'}</p>
              <p>Email: {selectedOrder.Customer.Email}</p>
              <p>Phone: {selectedOrder.Customer.PhoneNumber || 'N/A'}</p>
              <p>Address: {selectedOrder.Customer.Address || 'N/A'}</p>
              <p>City: {selectedOrder.Customer.City || 'N/A'}</p>
              <p>ZIP: {selectedOrder.Customer.Zip || 'N/A'}</p>
            </div>
            <div className="customer-details-section">
              <h4>Seller Information</h4>
              <p>Name: {selectedOrder.Seller.Name || 'N/A'}</p>
            </div>

            <div className="customer-details-section">
              <h4>Custom Measurements</h4>
              <ul className="customer-order-measurements-list">
                {selectedOrder.CustomMeasurements.map((measurement, index) => (
                  <li key={index}>
                    {measurement.MeasurementType}: {measurement.Value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p className="customer-orders-go-back-home">
          Go back to{' '}
          <a href="/c/sellerList" className="go-back-home-link">
            Home Page
          </a>
        </p>
      </div>
    </div>
  );
}

export default ViewAllCustomerOrders;
