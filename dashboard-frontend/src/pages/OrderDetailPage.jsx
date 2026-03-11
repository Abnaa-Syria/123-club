import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { ordersAPI } from '../api/services';
import { formatDateTime, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const { data } = await ordersAPI.getById(id);
      if (data.success) setOrder(data.data);
    } catch {
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success('Status updated');
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" size="lg" />;
  if (!order) return null;

  return (
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        actions={<button onClick={() => navigate('/orders')} className="btn-secondary">Back</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product?.imageUrl ? (
                        <img src={item.product.imageUrl} alt="" className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">No img</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatNumber(item.pointsCost)} pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card mb-6">
            <h3 className="font-semibold mb-3">Order Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Status</span><StatusBadge status={order.status} /></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Points</span><span className="font-bold">{formatNumber(order.totalPoints)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Items</span><span>{order.itemCount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Created</span><span>{formatDateTime(order.createdAt)}</span></div>
            </div>

            {!['COMPLETED', 'CANCELLED'].includes(order.status) && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Update Status:</p>
                {order.status === 'PENDING' && <button onClick={() => handleStatusUpdate('CONFIRMED')} className="btn-primary w-full text-sm">Confirm</button>}
                {order.status === 'CONFIRMED' && <button onClick={() => handleStatusUpdate('PROCESSING')} className="btn-primary w-full text-sm">Start Processing</button>}
                {order.status === 'PROCESSING' && <button onClick={() => handleStatusUpdate('COMPLETED')} className="btn-primary w-full text-sm">Complete</button>}
                <button onClick={() => handleStatusUpdate('CANCELLED')} className="btn-danger w-full text-sm">Cancel Order</button>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Customer</h3>
            <p className="font-medium">{order.user?.profile?.firstName} {order.user?.profile?.lastName}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

