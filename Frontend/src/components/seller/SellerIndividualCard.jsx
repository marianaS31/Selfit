import '../../styles/sellerIndividualCard.css';
import defaultImage from '../../assets/images/store-background.jpg';

const SellerIndividualCard = ({ seller }) => {
  return (
    <div className="seller-individual-card">
      <img
        src={defaultImage}
        alt="seller"
        className="seller-individual-image"
      />
      <p className="seller-individual-text">{seller?.Name}</p>
      <p className="seller-individual-description">{seller?.Description}</p>
    </div>
  );
};

export default SellerIndividualCard;
