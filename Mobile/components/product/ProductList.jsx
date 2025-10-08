import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import ProductCard from "../product/ProductCard";
import { getProductsBySellerId } from "../../services/AuthService";

const ProductList = ({ sellerId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProductsBySellerId(sellerId);
                setProducts(data);
                setError(null);
            } catch (err) {
                setError('Products not found');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [sellerId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Our Items</Text>
            <View style={styles.line} />
            {/* Scrollable section for product cards */}
            <ScrollView contentContainerStyle={styles.productList}>
                {loading && <ActivityIndicator style={styles.loadingMessage} />}
                {error && <Text style={styles.errorMessage}>{error}</Text>}
                {products.map((product, index) => (
                    <ProductCard
                        key={product.ProductId || index}
                        product={product}
                        sellerId={sellerId}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center'
    },
    line: {
        height: 1,
        backgroundColor: '#dee2e6',
        marginVertical: 16,
    },
    productList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    loadingMessage: {
        alignSelf: 'center',
    },
    errorMessage: {
        color: '#dc3545',
        textAlign: 'center',
    },
});

export default ProductList;
