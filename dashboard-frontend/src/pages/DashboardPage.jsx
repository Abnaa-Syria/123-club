import { useState, useEffect } from 'react';
import {
  UsersIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  FilmIcon,
  UserGroupIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { dashboardAPI } from '../api/services';
import { formatDateTime, formatNumber } from '../utils/helpers';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, usersRes, ordersRes] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getRecentRegistrations(5),
        dashboardAPI.getRecentOrders(5),
      ]);

      if (overviewRes.data.success) setStats(overviewRes.data.data);
      if (usersRes.data.success) setRecentUsers(usersRes.data.data);
      if (ordersRes.data.success) setRecentOrders(ordersRes.data.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-20" size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats?.users?.total || 0)}
          icon={UsersIcon}
          color="blue"
          subtitle={`${stats?.users?.active || 0} active`}
        />
        <StatsCard
          title="Active Memberships"
          value={formatNumber(stats?.memberships?.active || 0)}
          icon={CreditCardIcon}
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={formatNumber(stats?.orders?.total || 0)}
          icon={ClipboardDocumentListIcon}
          color="purple"
        />
        <StatsCard
          title="Total Products"
          value={formatNumber(stats?.products?.total || 0)}
          icon={ShoppingBagIcon}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Points Issued"
          value={formatNumber(stats?.points?.totalIssued || 0)}
          icon={StarIcon}
          color="orange"
        />
        <StatsCard
          title="Points Redeemed"
          value={formatNumber(stats?.points?.totalRedeemed || 0)}
          icon={SparklesIcon}
          color="red"
        />
        <StatsCard
          title="Content Items"
          value={formatNumber(stats?.content?.total || 0)}
          icon={FilmIcon}
          color="indigo"
        />
        <StatsCard
          title="Referrals"
          value={formatNumber(stats?.referrals?.total || 0)}
          icon={UserGroupIcon}
          color="pink"
        />
      </div>

      {/* Users by Role */}
      {stats?.users?.byRole && (
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(stats.users.byRole).map(([role, count]) => (
              <div key={role} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{formatNumber(count)}</p>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {user.profile?.firstName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={user.role} />
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(user.createdAt)}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No recent registrations</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {order.user?.profile?.firstName} {order.user?.profile?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="text-xs text-gray-400 mt-1">{order.totalPoints} pts</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

