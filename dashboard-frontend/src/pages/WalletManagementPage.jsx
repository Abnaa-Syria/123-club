import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { walletAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function WalletManagementPage() {
  const [userId, setUserId] = useState('');
  const [actualUserId, setActualUserId] = useState(null); // Store actual userId from wallet response
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pointsForm, setPointsForm] = useState({ amount: '', reason: '', type: 'add' });
  const [submitting, setSubmitting] = useState(false);

  const fetchWallet = async () => {
    if (!userId) { toast.error('Enter a user ID'); return; }
    setLoading(true);
    try {
      const [walletRes, txRes] = await Promise.all([
        walletAPI.getUserWallet(userId),
        walletAPI.getUserTransactions(userId, { page: 1, limit: 50 }),
      ]);
      // Handle different response structures
      const walletData = walletRes.data?.data?.wallet || walletRes.data?.data || null;
      setWallet(walletData);
      setTransactions(txRes.data?.data || txRes.data?.data?.transactions || []);
      
      // Store actual userId from wallet response (needed for add/deduct operations)
      const extractedUserId = walletData?.userId;
      if (extractedUserId) {
        setActualUserId(extractedUserId);
      } else if (!userId.startsWith('CLB-')) {
        // If it's not a Member ID, use it directly as userId
        setActualUserId(userId);
      } else {
        setActualUserId(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load wallet');
      setWallet(null);
      setTransactions([]);
      setActualUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePointsAction = async (e) => {
    e.preventDefault();
    if (!actualUserId || !pointsForm.amount) { 
      toast.error('Please search for a wallet first'); 
      return; 
    }
    setSubmitting(true);
    try {
      // Use actualUserId (not the Member ID) for add/deduct operations
      if (pointsForm.type === 'add') {
        await walletAPI.addPoints(actualUserId, { amount: parseInt(pointsForm.amount), description: pointsForm.reason });
        toast.success('Points added!');
      } else {
        await walletAPI.deductPoints(actualUserId, { amount: parseInt(pointsForm.amount), description: pointsForm.reason });
        toast.success('Points deducted!');
      }
      setPointsForm({ amount: '', reason: '', type: 'add' });
      fetchWallet();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Wallet & Points Management" subtitle="Manage user wallets and point transactions" />

      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-3">Lookup User Wallet</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter User ID or Member ID (CLB-...)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-field flex-1 max-w-md"
          />
          <button onClick={fetchWallet} disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {wallet && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <p className="text-sm opacity-80">Total Balance</p>
            <p className="text-3xl font-bold">{(wallet.currentBalance || wallet.balance || 0).toLocaleString()}</p>
            <p className="text-xs opacity-70 mt-1">points</p>
          </div>
          <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <p className="text-sm opacity-80">Total Earned</p>
            <p className="text-3xl font-bold">{(wallet.totalEarned || 0).toLocaleString()}</p>
            <p className="text-xs opacity-70 mt-1">points</p>
          </div>
          <div className="card bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <p className="text-sm opacity-80">Total Spent</p>
            <p className="text-3xl font-bold">{(wallet.totalRedeemed || wallet.totalSpent || 0).toLocaleString()}</p>
            <p className="text-xs opacity-70 mt-1">points</p>
          </div>
        </div>
      )}

      {wallet && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Add / Deduct Points</h3>
            <form onSubmit={handlePointsAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select value={pointsForm.type} onChange={(e) => setPointsForm({ ...pointsForm, type: e.target.value })} className="input-field">
                  <option value="add">Add Points</option>
                  <option value="deduct">Deduct Points</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" min="1" value={pointsForm.amount} onChange={(e) => setPointsForm({ ...pointsForm, amount: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input type="text" value={pointsForm.reason} onChange={(e) => setPointsForm({ ...pointsForm, reason: e.target.value })} className="input-field" placeholder="Optional reason" />
              </div>
              <button type="submit" disabled={submitting} className={`w-full py-2 px-4 rounded-lg font-medium text-white disabled:opacity-50 ${pointsForm.type === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {submitting ? 'Processing...' : pointsForm.type === 'add' ? 'Add Points' : 'Deduct Points'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-sm">No transactions found.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{tx.description || tx.type}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`font-semibold ${tx.type === 'EARNED' || tx.type === 'ADMIN_ADD' || tx.type === 'REFERRAL_BONUS' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'EARNED' || tx.type === 'ADMIN_ADD' || tx.type === 'REFERRAL_BONUS' ? '+' : '-'}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

