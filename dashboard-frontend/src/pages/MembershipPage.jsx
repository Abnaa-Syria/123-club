import GenericCrudPage from './GenericCrudPage';
import StatusBadge from '../components/StatusBadge';
import { membershipAPI } from '../api/services';

function MembershipForm({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
        <select value={formData.level || ''} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="input-field">
          <option value="">Select Level</option>
          <option value="BRONZE">Bronze</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="PLATINUM">Platinum</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input type="number" step="0.01" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
          <input type="number" value={formData.durationDays || ''} onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })} className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Points Bonus</label>
        <input type="number" value={formData.pointsBonus || ''} onChange={(e) => setFormData({ ...formData, pointsBonus: parseInt(e.target.value) })} className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
        <textarea value={formData.benefits || ''} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className="input-field" rows={3} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={formData.isActive !== false} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
        <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
      </div>
    </div>
  );
}

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Level', render: (r) => <StatusBadge status={r.level} /> },
  { header: 'Price', render: (r) => `$${r.price}` },
  { header: 'Duration', render: (r) => `${r.durationDays} days` },
  { header: 'Bonus Points', accessor: 'pointsBonus' },
  { header: 'Active', render: (r) => r.isActive ? 'Yes' : 'No' },
];

export default function MembershipPage() {
  return (
    <GenericCrudPage
      title="Membership Plans"
      apiService={membershipAPI}
      columns={columns}
      FormComponent={MembershipForm}
      defaultFormData={{ isActive: true, level: 'BRONZE', durationDays: 365, price: 0, pointsBonus: 0 }}
      searchEnabled={false}
    />
  );
}

