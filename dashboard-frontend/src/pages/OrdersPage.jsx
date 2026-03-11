import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import { ordersAPI } from '../api/services';
import { formatDateTime, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ status: '', search: '' });

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.list({ page, limit: 10, ...filters });
      if (data.success) {
        setOrders(data.data);
        setMeta(data.meta);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const columns = [
    { header: 'Order #', render: (r) => <span className="font-mono text-sm">{r.orderNumber}</span> },
    {
      header: 'Customer',
      render: (r) => (
        <div>
          <p className="font-medium">{r.user?.profile?.firstName} {r.user?.profile?.lastName}</p>
          <p className="text-xs text-gray-500">{r.user?.email}</p>
        </div>
      ),
    },
    { header: 'Items', render: (r) => r._count?.items || r.itemCount },
    { header: 'Points', render: (r) => formatNumber(r.totalPoints) },
    { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Date', render: (r) => formatDateTime(r.createdAt) },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Link to={`/orders/${r.id}`} className="text-brand hover:text-brand-dark text-sm font-medium">
            View
          </Link>
          {r.status === 'PENDING' && (
            <button onClick={() => handleStatusUpdate(r.id, 'CONFIRMED')} className="text-green-600 text-sm font-medium">
              Confirm
            </button>
          )}
          {r.status === 'CONFIRMED' && (
            <button onClick={() => handleStatusUpdate(r.id, 'PROCESSING')} className="text-blue-600 text-sm font-medium">
              Process
            </button>
          )}
          {r.status === 'PROCESSING' && (
            <button onClick={() => handleStatusUpdate(r.id, 'COMPLETED')} className="text-green-600 text-sm font-medium">
              Complete
            </button>
          )}
          {!['COMPLETED', 'CANCELLED'].includes(r.status) && (
            <button onClick={() => handleStatusUpdate(r.id, 'CANCELLED')} className="text-red-600 text-sm font-medium">
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Orders Management" subtitle={`${meta.total} total orders`} />

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search order number..."
          value={filters.search}
          onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
          className="input-field max-w-xs"
        />
        <select
          value={filters.status}
          onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
          className="input-field max-w-[180px]"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <DataTable columns={columns} data={orders} loading={loading} />
      <Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />
    </div>
  );
}

