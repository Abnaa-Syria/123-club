import GenericCrudPage from './GenericCrudPage';
import { bannersAPI } from '../api/services';
import ImageUpload from '../components/ImageUpload';

function Form({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" />
      </div>
      <ImageUpload
        value={formData.imageUrl}
        onChange={(path) => setFormData({ ...formData, imageUrl: path })}
        type="banners"
        label="Banner Image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
        <input type="text" value={formData.linkUrl || ''} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select value={formData.type || 'HOME'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
          <option value="HOME">Home</option>
          <option value="PROMO">Promo</option>
          <option value="SEASONAL">Seasonal</option>
          <option value="CAMPAIGN">Campaign</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="datetime-local" value={formData.startDate?.slice(0, 16) || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : null })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="datetime-local" value={formData.endDate?.slice(0, 16) || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : null })} className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
        <input type="number" value={formData.sortOrder || 0} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} className="input-field" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={formData.isActive !== false} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
        <label className="text-sm text-gray-700">Active</label>
      </div>
    </div>
  );
}

const columns = [
  { header: 'Title', accessor: 'title' },
  { header: 'Type', accessor: 'type' },
  { header: 'Order', accessor: 'sortOrder' },
  { header: 'Active', render: (r) => r.isActive ? 'Yes' : 'No' },
];

export default function BannersPage() {
  return <GenericCrudPage title="Banners" apiService={bannersAPI} columns={columns} FormComponent={Form} defaultFormData={{ isActive: true, type: 'HOME', sortOrder: 0 }} searchEnabled={false} />;
}

