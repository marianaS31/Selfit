import { useState, useEffect } from "react";
import ProductList from "../components/product/ProductList.jsx";
import SellerIndividualCard from "../components/seller/SellerIndividualCard.jsx";
import { getSellerById } from "../services/AuthService.jsx";
import { useParams } from "react-router-dom";

const SellerIndividualPage = () => {
    const { sellerId } = useParams();
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeller = async () => {
            setLoading(true);
            try {
                const data = await getSellerById(sellerId);
                setSeller(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch seller');
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [sellerId]);

    return (
        <div className="product-list-container">
            {loading && <div className="loading-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            {!loading && seller && (
                <>
                    <SellerIndividualCard seller={seller} />
                    <ProductList />
                </>
            )}
        </div>
    );
};

export default SellerIndividualPage;
