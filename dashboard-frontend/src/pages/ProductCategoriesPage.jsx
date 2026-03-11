import GenericCrudPage from './GenericCrudPage';
import { productCategoriesAPI } from '../api/services';

function Form({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input type="text" value={formData.imageUrl || ''} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="input-field" />
      </div>
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
  { header: 'Name', accessor: 'name' },
  { header: 'Products', render: (r) => r._count?.products || 0 },
  { header: 'Order', accessor: 'sortOrder' },
  { header: 'Active', render: (r) => r.isActive ? 'Yes' : 'No' },
];

export default function ProductCategoriesPage() {
  return (
    <GenericCrudPage
      title="Product Categories"
      apiService={productCategoriesAPI}
      columns={columns}
      FormComponent={Form}
      defaultFormData={{ isActive: true, sortOrder: 0 }}
    />
  );
}

