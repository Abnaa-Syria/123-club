import GenericCrudPage from './GenericCrudPage';
import { avatarsAPI } from '../api/services';
import ImageUpload from '../components/ImageUpload';
import { getImageUrl } from '../utils/imageUtils';

function AvatarForm({ formData, setFormData }) {
  const handleImageChange = (path) => {
    setFormData((prev) => ({ ...prev, imageUrl: path }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
      </div>
      <ImageUpload
        key={`avatar-${formData.id || 'new'}-${formData.imageUrl || ''}`}
        value={formData.imageUrl || ''}
        onChange={handleImageChange}
        type="avatars"
        label="Avatar Image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
        <input type="number" value={formData.sortOrder || 0} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} className="input-field" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={formData.isActive !== false} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
        <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
      </div>
    </div>
  );
}

const columns = [
  {
    header: 'Avatar',
    render: (r) => (
      <div className="flex items-center gap-3">
        <img 
          src={getImageUrl(r.imageUrl)} 
          alt={r.name} 
          className="w-10 h-10 rounded-full bg-gray-100 object-cover" 
          onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23e5e7eb" width="40" height="40"/></svg>'; }} 
        />
        <span className="font-medium">{r.name}</span>
      </div>
    ),
  },
  { header: 'Description', render: (r) => (r.description || '-').substring(0, 50) },
  { header: 'Order', accessor: 'sortOrder' },
  { header: 'Active', render: (r) => r.isActive ? 'Yes' : 'No' },
];

export default function AvatarsPage() {
  return (
    <GenericCrudPage
      title="Avatars"
      apiService={avatarsAPI}
      columns={columns}
      FormComponent={AvatarForm}
      defaultFormData={{ isActive: true, sortOrder: 0 }}
      searchEnabled={false}
    />
  );
}

