import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { referralsAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [search, setSearch] = useState('');

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const res = await referralsAPI.getAll({ page, limit: 20, search });
      setReferrals(res.data?.data || []);
      setMeta(res.data?.meta || {});
    } catch (err) {
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReferrals(); }, [page, search]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    {
      header: 'Referrer',
      render: (row) =>
        row.referrer?.profile
          ? `${row.referrer.profile.firstName} ${row.referrer.profile.lastName || ''}`
          : row.referrerId,
    },
    {
      header: 'Referred User',
      render: (row) =>
        row.referred?.profile
          ? `${row.referred.profile.firstName} ${row.referred.profile.lastName || ''}`
          : row.referredId || 'Pending',
    },
    { header: 'Referral Code', accessor: 'referralCode' },
    {
      header: 'Status',
      render: (row) => {
        const isUsed = row.isUsed;
        const label = isUsed ? 'COMPLETED' : 'PENDING';
        const cls = isUsed
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800';
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: 'Points Awarded',
      render: (row) => row.rewardPoints || 0,
    },
    {
      header: 'Date',
      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Referrals" subtitle="View all referral activities" />

      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search by referral code or user..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field max-w-md"
        />
      </div>

      <div className="card">
        <DataTable columns={columns} data={referrals} />
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

