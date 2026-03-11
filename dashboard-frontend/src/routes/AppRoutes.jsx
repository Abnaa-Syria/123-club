import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import UserDetailPage from '../pages/UserDetailPage';
import MembershipPage from '../pages/MembershipPage';
import AvatarsPage from '../pages/AvatarsPage';
import ContentCategoriesPage from '../pages/ContentCategoriesPage';
import ContentPage from '../pages/ContentPage';
import ProductCategoriesPage from '../pages/ProductCategoriesPage';
import ProductsPage from '../pages/ProductsPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import BannersPage from '../pages/BannersPage';
import NotificationsPage from '../pages/NotificationsPage';
import ReferralsPage from '../pages/ReferralsPage';
import StaticPagesPage from '../pages/StaticPagesPage';
import FAQsPage from '../pages/FAQsPage';
import SettingsPage from '../pages/SettingsPage';
import WalletManagementPage from '../pages/WalletManagementPage';
import AdminProfilePage from '../pages/AdminProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="avatars" element={<AvatarsPage />} />
        <Route path="content-categories" element={<ContentCategoriesPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="product-categories" element={<ProductCategoriesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="pages" element={<StaticPagesPage />} />
        <Route path="faqs" element={<FAQsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="wallet" element={<WalletManagementPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

