import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { pagesAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function StaticPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', isPublished: true });
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await pagesAPI.getAll();
      setPages(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const handleEdit = (page) => {
    setEditing(page.id);
    setForm({ title: page.title, slug: page.slug, content: page.content, isPublished: page.isPublished });
  };

  const handleCreate = () => {
    setEditing('new');
    setForm({ title: '', slug: '', content: '', isPublished: true });
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) { toast.error('Fill all required fields'); return; }
    setSaving(true);
    try {
      if (editing === 'new') {
        await pagesAPI.create(form);
        toast.success('Page created!');
      } else {
        await pagesAPI.update(editing, form);
        toast.success('Page updated!');
      }
      setEditing(null);
      fetchPages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await pagesAPI.delete(id);
      toast.success('Deleted');
      fetchPages();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (editing !== null) {
    return (
      <div>
        <PageHeader title={editing === 'new' ? 'Create Page' : 'Edit Page'} subtitle="Manage static page content" />
        <div className="card max-w-3xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field" placeholder="e.g. about-us" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-field" rows={12} required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} id="isPublished" />
              <label htmlFor="isPublished" className="text-sm text-gray-700">Published</label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Page'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Static Pages" subtitle="Manage application pages (About, Privacy, Terms, etc.)" action={{ label: 'Create Page', onClick: handleCreate }} />

      <div className="grid gap-4">
        {pages.length === 0 ? (
          <div className="card text-center text-gray-500 py-12">No static pages found. Create your first page.</div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{page.title}</h3>
                <p className="text-sm text-gray-500">/{page.slug}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${page.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {page.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(page)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                <button onClick={() => handleDelete(page.id)} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

