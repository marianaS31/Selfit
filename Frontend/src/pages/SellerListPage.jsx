import SellerList from '../components/seller/SellerList';

const SellerListPage = () => {
  return (
    <div className="store-list-container">
      <h2 className="title">Our Stores</h2>
      <div className="store-list-grid">
        <SellerList />
      </div>
    </div>
  );
};

export default SellerListPage;
