import SellerDashboardButtons from "../components/seller/SellerDashboardButtons";
import '../styles/sellerDashboard.css';

const SellerDashboard = () => {

    return(
        <div className="seller-dashboard-container">
            <h2 className="seller-dashboard-title">Your Dashboard</h2>
            <p className="seller-dashboard-subtitle">
                Manage your products and orders.
            </p>
            <hr className="title-line-dashboard" />
            <SellerDashboardButtons/>
        </div>
    );
}

export default SellerDashboard;