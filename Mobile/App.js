import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './pages/LandingPage';
import RegisterForm from './components/account/Register/RegisterForm';
import LoginForm from './components/account/Login/LoginForm';
import ForgotPassword from './components/account/Login/ForgotPassword';
import ResetPassword from './components/account/Login/ResetPassword';
import SellerListPage from './pages/SellerListPage';
import SellerIndividualPage from './pages/SellerIndividualPage';
import GuestRoute from './utils/GuestRoute';
import BottomNavigation from './layouts/BottomNavigation';
import { View } from 'react-native';
import ProductCustomization from './components/order/ProductCustomization ';
import ProductPage from './pages/ProductPage';
import ViewAllCustomerOrders from './components/customer/ViewAllCustomerOrders';
import CustomerProfileEdit from './components/customer/CustomerProfileEdit';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LandingPage"
        screenOptions={{ headerShown: false }} //disable header for all
      >
        {/*unauthenticated users*/}
        <Stack.Screen name="LandingPage">
          {() => (
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {() => (
            <GuestRoute>
              <RegisterForm />
            </GuestRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {() => (
            <GuestRoute>
              <LoginForm />
            </GuestRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="ForgotPassword">
          {() => (
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          )}
        </Stack.Screen>

        <Stack.Screen name="ResetPassword">
          {() => (
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          )}
        </Stack.Screen>

        {/* authenticated users */}
        <Stack.Screen name="SellerList">
          {() => (
            <View style={{ flex: 1 }}>
              <SellerListPage />
              <BottomNavigation />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="ProductCustomization">
          {() => (
            <View style={{ flex: 1 }}>
              <ProductCustomization />
              <BottomNavigation />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="SellerDetails">
          {() => (
            <View style={{ flex: 1 }}>
              <SellerIndividualPage />
              <BottomNavigation />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="ProductDetails">
          {() => (
            <View style={{ flex: 1 }}>
              <ProductPage />
              <BottomNavigation />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="ViewAllCustomerOrders">
          {() => (
            <View style={{ flex: 1 }}>
              <ViewAllCustomerOrders />
              <BottomNavigation />
            </View>
          )}
        </Stack.Screen>

        <Stack.Screen name="CustomerEditProfile">
          {() => (
            <View style={{ flex: 1 }}>
              <CustomerProfileEdit />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
