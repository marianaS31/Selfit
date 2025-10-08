import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';
import './styles/global.css';
import LandingPage from './pages/LandingPage';
import RegisterForm from './components/account/Register/RegisterForm';
import LoginForm from './components/account/Login/LoginForm';
import ForgotPassword from './components/account/Login/ForgotPassword';
import ResetPassword from './components/account/Login/ResetPassword';
import SellerListPage from './pages/SellerListPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './utils/ProtectedRoute';
import GuestRoute from './utils/GuestRoute';
import CustomerProfileEdit from './components/customer/CustomerProfileEdit';
import ProductCustomization from './components/order/ProductCustomization ';
import ViewAllCustomerOrders from './components/customer/ViewAllCustomerOrders';
import CreateProduct from './components/product/CreateProduct';
import ViewAllProducts from './components/product/ViewAllProducts';
import ViewAllSellerOrders from './components/seller/ViewAllSellerOrders';
import SellerDashboard from './pages/SellerDashboard';
import SellerIndividualPage from './pages/SellerIndividualPage';
import ProductPage from './pages/ProductPage';
import SellerProfileEdit from './components/seller/SellerProfileEdit';
function App() {
  const location = useLocation();

  const normalizedPath = location.pathname.toLowerCase();
  // Define paths where the header should be hidden
  const noHeaderPaths = [
    '/a/register',
    '/a/login',
    '/a/forgot-password',
    '/a/reset-password',
    '/',
    '',
  ];

  // check if the path exists
  const isPathInList = (path, list) => list.some((item) => item === path);

  //check if header and footer should be hidden
  const shouldHideHeaderAndFooter = isPathInList(normalizedPath, noHeaderPaths);

  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!shouldHideHeaderAndFooter && <Header />}
      <div className={isLandingPage ? 'container-full' : 'container'}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/a/register"
            element={
              <GuestRoute>
                <RegisterForm />
              </GuestRoute>
            }
          />
          <Route
            path="/a/login"
            element={
              <GuestRoute>
                <LoginForm />
              </GuestRoute>
            }
          />
          <Route
            path="/a/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />
          <Route
            path="/a/reset-password"
            element={
              <GuestRoute>
                <ResetPassword />
              </GuestRoute>
            }
          />
          <Route
            path="/"
            element={
              <GuestRoute>
                <LandingPage />
              </GuestRoute>
            }
          />
          {/* Protected Routes */}
          <Route
            path="/c/seller/:sellerId"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <SellerIndividualPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/c/seller/:sellerId/product/:productId"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/s/editProfile"
            element={
              <ProtectedRoute allowedRoles={['Seller']}>
                <SellerProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/s/dashboard"
            element={
              <ProtectedRoute allowedRoles={['Seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/c/sellerList"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <SellerListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/c/editProfile"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <CustomerProfileEdit />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/c/seller/:sellerId"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <SellerProductsPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/c/seller/:sellerId/product/:productId/customize"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <ProductCustomization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/c/orders/:customerId"
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <ViewAllCustomerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/s/createProduct"
            element={
              <ProtectedRoute allowedRoles={['Seller']}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/s/allProducts"
            element={
              <ProtectedRoute allowedRoles={['Seller']}>
                <ViewAllProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/s/orders/:sellerId"
            element={
              <ProtectedRoute allowedRoles={['Seller']}>
                <ViewAllSellerOrders />
              </ProtectedRoute>
            }
          />
          {/* Not found page Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!shouldHideHeaderAndFooter && <Footer />}
    </>
  );
}

export default App;
