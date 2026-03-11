import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import { usersAPI } from '../api/services';
import { formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null, action: null });

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.list({ page, limit: 10, ...filters });
      if (data.success) {
        setUsers(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    const { userId, action } = confirmDialog;
    try {
      if (action === 'suspend') await usersAPI.suspend(userId);
      else if (action === 'activate') await usersAPI.activate(userId);
      else if (action === 'delete') await usersAPI.delete(userId);
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
    setConfirmDialog({ open: false, userId: null, action: null });
  };

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
            {row.profile?.firstName?.[0] || '?'}
          </div>
          <div>
            <p className="font-medium">{row.profile?.firstName} {row.profile?.lastName}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Role', render: (row) => <StatusBadge status={row.role} /> },
    { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Member ID', render: (row) => row.membershipCard?.memberId || '-' },
    { header: 'Joined', render: (row) => formatDateTime(row.createdAt) },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/users/${row.id}`} className="text-brand hover:text-brand-dark text-sm font-medium">
            View
          </Link>
          {row.status === 'ACTIVE' && row.role !== 'SUPER_ADMIN' && (
            <button
              onClick={() => setConfirmDialog({ open: true, userId: row.id, action: 'suspend' })}
              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
            >
              Suspend
            </button>
          )}
          {row.status === 'SUSPENDED' && (
            <button
              onClick={() => setConfirmDialog({ open: true, userId: row.id, action: 'activate' })}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Activate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Users Management" subtitle={`${meta.total} total users`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
          className="input-field max-w-xs"
        />
        <select
          value={filters.role}
          onChange={(e) => { setFilters({ ...filters, role: e.target.value }); setPage(1); }}
          className="input-field max-w-[160px]"
        >
          <option value="">All Roles</option>
          <option value="CHILD">Child</option>
          <option value="PARENT">Parent</option>
          <option value="TEACHER">Teacher</option>
          <option value="SCHOOL">School</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
          className="input-field max-w-[160px]"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="No users found" />
      <Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={`${confirmDialog.action === 'suspend' ? 'Suspend' : confirmDialog.action === 'activate' ? 'Activate' : 'Delete'} User`}
        message={`Are you sure you want to ${confirmDialog.action} this user?`}
        onConfirm={handleAction}
        onCancel={() => setConfirmDialog({ open: false, userId: null, action: null })}
        danger={confirmDialog.action === 'suspend' || confirmDialog.action === 'delete'}
      />
    </div>
  );
}

