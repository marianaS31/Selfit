import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useRoute } from '@react-navigation/native';
import SellerDetailsCard from "../components/seller/SellerDetailsCard";
import ProductList from "../components/product/ProductList";
import { getSellerById } from "../services/AuthService";

const SellerIndividualPage = () => {
	const route = useRoute();
	const { sellerId } = route.params;
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
		<View style={styles.container}>
			{loading && <ActivityIndicator style={styles.loadingMessage} />}
			{error && <Text style={styles.errorMessage}>{error}</Text>}
			{!loading && seller && (
				<ScrollView style={styles.scrollContainer}>
					<SellerDetailsCard seller={seller} />
					<ProductList sellerId={sellerId} />
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 30,
		flex: 1,
		padding: 16,
	},
	scrollContainer: {
		flexGrow: 1,
	},
	loadingMessage: {
		alignSelf: 'center',
	},
	errorMessage: {
		color: '#dc3545',
		textAlign: 'center',
	},
});

export default SellerIndividualPage;
