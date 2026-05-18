import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Client Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Shop from './pages/shop/Shop';
import Collections from './pages/shop/Collections';
import Categories from './pages/shop/Categories';
import CategoryPage from './pages/shop/CategoryPage';
import ProductDetails from './pages/shop/ProductDetails';
import Cart from './pages/shop/Cart';
import Favorites from './pages/shop/Favorites';
import Checkout from './pages/shop/Checkout';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Notifications from './pages/Notifications';
import Legal from './pages/Legal';
import Profile from './pages/profile/Profile';
import OrderHistory from './pages/profile/OrderHistory';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Orders from './pages/admin/Orders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import TopCollections from './pages/admin/TopCollections';
import Activity from './pages/admin/Activity';

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={
            <ProtectedRoute requiredRole="USER">
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notifications" element={
            <ProtectedRoute message="Please login to view your notifications">
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/shipping" element={<Legal />} />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="USER">
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/orders" element={
            <ProtectedRoute requiredRole="USER">
              <OrderHistory />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="activity" element={<Activity />} />
          <Route path="products" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="top-collections" element={<TopCollections />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
