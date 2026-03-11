import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { faqAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', sortOrder: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await faqAPI.getAll();
      setFaqs(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleEdit = (faq) => {
    setEditing(faq.id);
    setForm({ question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder || 0, isActive: faq.isActive });
  };

  const handleCreate = () => {
    setEditing('new');
    setForm({ question: '', answer: '', sortOrder: 0, isActive: true });
  };

  const handleSave = async () => {
    if (!form.question || !form.answer) { toast.error('Fill all fields'); return; }
    setSaving(true);
    try {
      if (editing === 'new') {
        await faqAPI.create(form);
        toast.success('FAQ created!');
      } else {
        await faqAPI.update(editing, form);
        toast.success('FAQ updated!');
      }
      setEditing(null);
      fetchFaqs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await faqAPI.delete(id);
      toast.success('Deleted');
      fetchFaqs();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (editing !== null) {
    return (
      <div>
        <PageHeader title={editing === 'new' ? 'Add FAQ' : 'Edit FAQ'} subtitle="Manage frequently asked questions" />
        <div className="card max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="input-field" rows={5} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="isActive" />
              <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
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
      <PageHeader title="FAQs" subtitle="Manage frequently asked questions" action={{ label: 'Add FAQ', onClick: handleCreate }} />

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="card text-center text-gray-500 py-12">No FAQs found. Add your first FAQ.</div>
        ) : (
          faqs.map((faq, idx) => (
            <div key={faq.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">#{idx + 1}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {faq.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(faq)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                  <button onClick={() => handleDelete(faq.id)} className="text-sm text-red-600 hover:text-red-800 font-medium">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

