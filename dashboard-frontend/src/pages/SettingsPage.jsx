import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { settingsAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsAPI.getAll();
      const data = res.data?.data || [];
      setSettings(data);
      const vals = {};
      data.forEach((s) => { vals[s.key] = s.value; });
      setEditValues(vals);
    } catch (err) {
      console.error('Settings fetch error:', err);
      toast.error(err.response?.data?.message || 'Failed to load settings');
      setSettings([]);
      setEditValues({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key, value) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      await settingsAPI.update(key, { value: editValues[key] });
      toast.success(`Setting "${key}" updated`);
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    const key = prompt('Enter setting key:');
    if (!key) return;
    const value = prompt('Enter setting value:');
    if (value === null) return;
    try {
      await settingsAPI.create({ key, value });
      toast.success('Setting created');
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  const groups = {};
  settings.forEach((s) => {
    const group = s.group || 'general';
    if (!groups[group]) groups[group] = [];
    groups[group].push(s);
  });

  return (
    <div>
      <PageHeader title="App Settings" subtitle="Manage application configuration" action={{ label: 'Add Setting', onClick: handleCreate }} />

      {Object.keys(groups).length === 0 ? (
        <div className="card text-center text-gray-500 py-12">No settings configured yet.</div>
      ) : (
        Object.entries(groups).map(([group, items]) => (
          <div key={group} className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{group} Settings</h3>
            <div className="space-y-4">
              {items.map((setting) => (
                <div key={setting.key} className="flex items-end gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{setting.key}</label>
                    {setting.description && <p className="text-xs text-gray-500 mb-1">{setting.description}</p>}
                    {setting.value === 'true' || setting.value === 'false' ? (
                      <select
                        value={editValues[setting.key] || 'false'}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="input-field"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={editValues[setting.key] || ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="input-field"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => handleSave(setting.key)}
                    disabled={saving}
                    className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

