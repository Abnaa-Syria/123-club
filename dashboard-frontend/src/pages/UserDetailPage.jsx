import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { usersAPI, walletAPI } from '../api/services';
import { formatDateTime, formatNumber } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pointsForm, setPointsForm] = useState({ amount: '', description: '' });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await usersAPI.getById(id);
      if (data.success) setUser(data.data);
    } catch {
      toast.error('User not found');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!pointsForm.amount || parseInt(pointsForm.amount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    try {
      await walletAPI.addPoints(id, {
        amount: parseInt(pointsForm.amount),
        description: pointsForm.description || 'Admin added points',
      });
      toast.success('Points added!');
      setPointsForm({ amount: '', description: '' });
      fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add points');
    }
  };

  if (loading) return <LoadingSpinner className="py-20" size="lg" />;
  if (!user) return null;

  return (
    <div>
      <PageHeader
        title="User Details"
        actions={
          <button onClick={() => navigate('/users')} className="btn-secondary">
            Back to Users
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center text-white text-2xl font-bold">
                {user.profile?.firstName?.[0] || '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {user.profile?.firstName} {user.profile?.lastName}
                </h2>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">User ID:</span> <span className="font-mono text-xs break-all">{user.id}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{user.phone || '-'}</span></div>
              <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{user.profile?.gender || '-'}</span></div>
              <div><span className="text-gray-500">Country:</span> <span className="font-medium">{user.profile?.country || '-'}</span></div>
              <div><span className="text-gray-500">City:</span> <span className="font-medium">{user.profile?.city || '-'}</span></div>
              <div><span className="text-gray-500">Joined:</span> <span className="font-medium">{formatDateTime(user.createdAt)}</span></div>
              <div><span className="text-gray-500">Last Login:</span> <span className="font-medium">{formatDateTime(user.lastLoginAt)}</span></div>
            </div>
          </div>

          {/* Role-specific profile */}
          {user.childProfile && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-3">Child Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">School:</span> {user.childProfile.schoolName || '-'}</div>
                <div><span className="text-gray-500">Grade:</span> {user.childProfile.grade || '-'}</div>
                <div><span className="text-gray-500">Interests:</span> {user.childProfile.interests || '-'}</div>
              </div>
            </div>
          )}
          {user.parentProfile && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-3">Parent Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Children:</span> {user.parentProfile.numberOfChildren}</div>
                <div><span className="text-gray-500">Occupation:</span> {user.parentProfile.occupation || '-'}</div>
              </div>
            </div>
          )}
          {user.teacherProfile && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-3">Teacher Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">School:</span> {user.teacherProfile.schoolName || '-'}</div>
                <div><span className="text-gray-500">Specialization:</span> {user.teacherProfile.specialization || '-'}</div>
                <div><span className="text-gray-500">Years of Experience:</span> {user.teacherProfile.yearsOfExp}</div>
              </div>
            </div>
          )}
          {user.schoolProfile && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-3">School Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">School Name:</span> {user.schoolProfile.schoolName}</div>
                <div><span className="text-gray-500">Contact Person:</span> {user.schoolProfile.contactPerson || '-'}</div>
                <div><span className="text-gray-500">Contact Email:</span> {user.schoolProfile.contactEmail || '-'}</div>
                <div><span className="text-gray-500">Students:</span> {user.schoolProfile.studentsCount}</div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Membership Card */}
          {user.membershipCard && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-3">Membership Card</h3>
              <div className="p-4 bg-gradient-to-r from-brand to-brand-dark rounded-lg text-white">
                <p className="text-xs opacity-80">123 Club</p>
                <p className="text-lg font-bold mt-2">{user.membershipCard.memberId}</p>
                <div className="flex justify-between mt-3">
                  <span className="text-sm">{user.membershipCard.level}</span>
                  <span className="text-sm">{user.membershipCard.plan?.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Wallet */}
          {user.pointsWallet && (
            <div className="card mb-6">
              <h3 className="font-semibold mb-3">Points Wallet</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Balance</span>
                  <span className="font-bold text-lg text-brand">{formatNumber(user.pointsWallet.currentBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Earned</span>
                  <span className="text-green-600 font-medium">{formatNumber(user.pointsWallet.totalEarned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Redeemed</span>
                  <span className="text-red-600 font-medium">{formatNumber(user.pointsWallet.totalRedeemed)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Add Points</p>
                <input
                  type="number"
                  placeholder="Amount"
                  value={pointsForm.amount}
                  onChange={(e) => setPointsForm({ ...pointsForm, amount: e.target.value })}
                  className="input-field mb-2"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={pointsForm.description}
                  onChange={(e) => setPointsForm({ ...pointsForm, description: e.target.value })}
                  className="input-field mb-2"
                />
                <button onClick={handleAddPoints} className="btn-primary w-full text-sm">
                  Add Points
                </button>
              </div>
            </div>
          )}

          {/* Avatar */}
          {user.selectedAvatar?.avatar && (
            <div className="card">
              <h3 className="font-semibold mb-3">Selected Avatar</h3>
              <div className="text-center">
                <img
                  src={user.selectedAvatar.avatar.imageUrl}
                  alt={user.selectedAvatar.avatar.name}
                  className="w-20 h-20 rounded-full mx-auto bg-gray-100"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p className="text-sm font-medium mt-2">{user.selectedAvatar.avatar.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

