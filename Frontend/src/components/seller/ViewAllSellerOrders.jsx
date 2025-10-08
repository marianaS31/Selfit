import { useEffect, useState } from 'react';
import {
  getOrderBySeller,
  changeOrderStatus,
} from '../../services/AuthService';
import { OrderStatus } from '../../enums/order/OrderStatus';
import '../../styles/viewAllSellerOrders.css';

function ViewAllSellerOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const sellerId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderBySeller(sellerId);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [sellerId]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.OrderStatus);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      await changeOrderStatus(selectedOrder.Id, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.Id === selectedOrder.Id
            ? { ...order, OrderStatus: newStatus }
            : order
        )
      );
      setSelectedOrder((prevOrder) => ({
        ...prevOrder,
        OrderStatus: newStatus,
      }));
    } catch (error) {
      setError('Failed to change order status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="seller-orders-container">
      <div className="seller-orders-content">
        <h2 className="seller-orders-title">MY ORDERS</h2>
        <div className="seller-orders-info-container">
          <p className="seller-orders-info">
            Manage and track all your customer orders
          </p>
        </div>
        {isLoading && <div className="loading-message">Loading orders...</div>}
        {/* {error && <div className="error-message">{error}</div>} */}

        {!isLoading && !error && (
          <div className="seller-orders-list">
            {orders.map((order) => (
              <div
                key={order.Id}
                className={`seller-order-card ${
                  selectedOrder?.Id === order.Id ? 'selected' : ''
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <h3 className="seller-product-name">{order.Product.Name}</h3>
                <div className="seller-product-details">
                  <p>Price: {order.Product.Price}€</p>
                  <p>Color: {order.Product.Color}</p>
                  <p>Material: {order.Product.Material}</p>
                  <p>
                    Status:{' '}
                    <span
                      className={`order-status status-${order.OrderStatus.toLowerCase()}`}
                    >
                      {order.OrderStatus}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <div className="seller-order-details">
            <h3 className="seller-order-details-title">Order Details</h3>

            <div className="seller-details-section">
              <h4>Product Information</h4>
              <p>Name: {selectedOrder.Product.Name}</p>
              <p>Price: {selectedOrder.Product.Price}€</p>
              <p>Color: {selectedOrder.Product.Color}</p>
              <p>Material: {selectedOrder.Product.Material}</p>
            </div>

            <div className="seller-details-section">
              <h4>Customer Information</h4>
              <p>Full Name: {selectedOrder.Customer.FullName || 'N/A'}</p>
              <p>Email: {selectedOrder.Customer.Email}</p>
              <p>Phone: {selectedOrder.Customer.PhoneNumber || 'N/A'}</p>
              <p>Address: {selectedOrder.Customer.Address || 'N/A'}</p>
              <p>City: {selectedOrder.Customer.City || 'N/A'}</p>
              <p>ZIP: {selectedOrder.Customer.Zip || 'N/A'}</p>
            </div>

            <div className="seller-details-section">
              <h4>Order Status</h4>
              <p>
                Current Status:{' '}
                <span
                  className={`order-status status-${selectedOrder.OrderStatus.toLowerCase()}`}
                >
                  {selectedOrder.OrderStatus}
                </span>
              </p>
              <select value={newStatus} onChange={handleStatusChange}>
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveStatus}
                disabled={isUpdating}
                className="save-status-button"
              >
                {isUpdating ? 'Saving...' : 'Save Status'}
              </button>
            </div>

            <div className="seller-details-section">
              <h4>Custom Measurements</h4>
              <ul className="seller-order-measurements-list">
                {selectedOrder.CustomMeasurements.map((measurement, index) => (
                  <li key={index}>
                    {measurement.MeasurementType}: {measurement.Value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p className="seller-orders-go-back-home">
          Go back to{' '}
          <a href="/s/dashboard" className="go-back-home-link">
            Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}

export default ViewAllSellerOrders;
