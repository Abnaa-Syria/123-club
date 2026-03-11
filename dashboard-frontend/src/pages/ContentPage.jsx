import GenericCrudPage from './GenericCrudPage';
import StatusBadge from '../components/StatusBadge';
import { contentAPI } from '../api/services';
import { truncate } from '../utils/helpers';
import ImageUpload from '../components/ImageUpload';

function Form({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
        <input type="text" value={formData.categoryId || ''} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="input-field" placeholder="Paste category ID" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
            <option value="VIDEO">Video</option>
            <option value="BOOK_STORY">Book/Story</option>
            <option value="SONG">Song</option>
            <option value="GAME">Game</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={formData.status || 'DRAFT'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} />
      </div>
      <ImageUpload
        value={formData.thumbnailUrl}
        onChange={(path) => setFormData({ ...formData, thumbnailUrl: path })}
        type="content"
        label="Thumbnail Image"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
        <input type="text" value={formData.mediaUrl || ''} onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })} className="input-field" placeholder="Video/audio/game URL" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age Min</label>
          <input type="number" value={formData.ageGroupMin || 0} onChange={(e) => setFormData({ ...formData, ageGroupMin: parseInt(e.target.value) })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age Max</label>
          <input type="number" value={formData.ageGroupMax || 18} onChange={(e) => setFormData({ ...formData, ageGroupMax: parseInt(e.target.value) })} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
          <input type="number" value={formData.duration || 0} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="input-field" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
        <input type="text" value={formData.author || ''} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="input-field" />
      </div>
      <div className="flex items-center gap-4">
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
  { header: 'Title', render: (r) => truncate(r.title, 40) },
  { header: 'Type', render: (r) => <StatusBadge status={r.type} /> },
  { header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  { header: 'Category', render: (r) => r.category?.name || '-' },
  { header: 'Views', accessor: 'viewCount' },
  { header: 'Featured', render: (r) => r.isFeatured ? 'Yes' : 'No' },
];

export default function ContentPage() {
  return (
    <GenericCrudPage
      title="Content Items"
      apiService={contentAPI}
      columns={columns}
      FormComponent={Form}
      defaultFormData={{ type: 'VIDEO', status: 'DRAFT', ageGroupMin: 0, ageGroupMax: 18 }}
    />
  );
}

