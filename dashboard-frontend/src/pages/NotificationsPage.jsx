import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { notificationsAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [form, setForm] = useState({ userId: '', title: '', body: '', type: 'SYSTEM' });
  const [bulkForm, setBulkForm] = useState({ title: '', body: '', type: 'SYSTEM', roleFilter: '' });
  const [sending, setSending] = useState(false);

  const handleSendToUser = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.title || !form.body) { toast.error('Fill all required fields'); return; }
    setSending(true);
    try {
      await notificationsAPI.sendToUser(form);
      toast.success('Notification sent!');
      setForm({ userId: '', title: '', body: '', type: 'SYSTEM' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSending(false);
    }
  };

  const handleSendToAll = async (e) => {
    e.preventDefault();
    if (!bulkForm.title || !bulkForm.body) { toast.error('Fill all required fields'); return; }
    setSending(true);
    try {
      await notificationsAPI.sendToAll(bulkForm);
      toast.success('Notification sent to all users!');
      setBulkForm({ title: '', body: '', type: 'SYSTEM', roleFilter: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Send notifications to users" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Send to Specific User</h3>
          <form onSubmit={handleSendToUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input type="text" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="input-field" placeholder="Enter user ID" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input-field" rows={3} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="SYSTEM">System</option>
                <option value="PROMO">Promo</option>
                <option value="ORDER_UPDATE">Order Update</option>
                <option value="POINTS_UPDATE">Points Update</option>
                <option value="NEW_CONTENT">New Content</option>
              </select>
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
              {sending ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Send to All Users</h3>
          <form onSubmit={handleSendToAll} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" value={bulkForm.title} onChange={(e) => setBulkForm({ ...bulkForm, title: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
              <textarea value={bulkForm.body} onChange={(e) => setBulkForm({ ...bulkForm, body: e.target.value })} className="input-field" rows={3} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={bulkForm.type} onChange={(e) => setBulkForm({ ...bulkForm, type: e.target.value })} className="input-field">
                <option value="SYSTEM">System</option>
                <option value="PROMO">Promo</option>
                <option value="NEW_CONTENT">New Content</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Filter (optional)</label>
              <select value={bulkForm.roleFilter} onChange={(e) => setBulkForm({ ...bulkForm, roleFilter: e.target.value })} className="input-field">
                <option value="">All Roles</option>
                <option value="CHILD">Child</option>
                <option value="PARENT">Parent</option>
                <option value="TEACHER">Teacher</option>
                <option value="SCHOOL">School</option>
              </select>
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full disabled:opacity-50">
              {sending ? 'Sending...' : 'Send to All'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

