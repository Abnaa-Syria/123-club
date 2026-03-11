import { useEffect, useState } from 'react';
import GenericCrudPage from './GenericCrudPage';
import { productsAPI, productCategoriesAPI } from '../api/services';
import { formatNumber, truncate } from '../utils/helpers';
import ImageUpload from '../components/ImageUpload';

function Form({ formData, setFormData }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    productCategoriesAPI
      .list({ limit: 100 })
      .then((res) => {
        if (!isMounted) return;
        const data = res.data?.data || res.data || [];
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setCategories([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          className="input-field"
          value={formData.categoryId || ''}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
      </div>
      <ImageUpload
        value={formData.imageUrl}
        onChange={(path) => setFormData({ ...formData, imageUrl: path })}
        type="products"
        label="Product Image"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points Cost</label>
          <input type="number" value={formData.pointsCost || 0} onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input type="number" value={formData.stockQuantity || 0} onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })} className="input-field" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={formData.isActive !== false} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={formData.isFeatured || false} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={formData.isRecommended || false} onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })} />
          Recommended
        </label>
      </div>
    </div>
  );
}

const columns = [
  { header: 'Name', render: (r) => truncate(r.name, 35) },
  { header: 'Category', render: (r) => r.category?.name || '-' },
  { header: 'Points', render: (r) => formatNumber(r.pointsCost) },
  { header: 'Stock', render: (r) => formatNumber(r.stockQuantity) },
  { header: 'Featured', render: (r) => r.isFeatured ? 'Yes' : 'No' },
  { header: 'Active', render: (r) => r.isActive ? 'Yes' : 'No' },
];

export default function ProductsPage() {
  return (
    <GenericCrudPage
      title="Products"
      apiService={productsAPI}
      columns={columns}
      FormComponent={Form}
      defaultFormData={{ isActive: true, pointsCost: 0, stockQuantity: 0 }}
    />
  );
}

