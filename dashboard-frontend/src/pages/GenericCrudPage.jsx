import { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

/**
 * Generic CRUD page for admin dashboard modules.
 * Provides list, create, edit, delete functionality with modal forms.
 */
export default function GenericCrudPage({
  title,
  subtitle,
  apiService,
  columns,
  FormComponent,
  defaultFormData = {},
  searchEnabled = true,
  searchPlaceholder = 'Search...',
  filters: FilterComponent,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [extraFilters, setExtraFilters] = useState({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, ...extraFilters };
      if (search) params.search = search;
      const { data } = await apiService.list(params);
      if (data.success) {
        setItems(data.data);
        setMeta(data.meta || { total: 0, totalPages: 1 });
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [page, search, extraFilters, apiService]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = () => {
    setEditItem(null);
    setFormData(defaultFormData);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    // Create a new object to ensure React detects the change
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await apiService.update(editItem.id, formData);
        toast.success('Updated successfully');
      } else {
        await apiService.create(formData);
        toast.success('Created successfully');
      }
      setShowForm(false);
      setFormData(defaultFormData);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(deleteDialog.id);
      toast.success('Deleted successfully');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
    setDeleteDialog({ open: false, id: null });
  };

  // Enrich columns with edit/delete actions
  const enrichedColumns = [
    ...columns,
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row)} className="text-brand hover:text-brand-dark text-sm font-medium">
            Edit
          </button>
          <button
            onClick={() => setDeleteDialog({ open: true, id: row.id })}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle || `${meta.total} total`}
        actions={
          <button onClick={handleCreate} className="btn-primary">
            + Create New
          </button>
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        {searchEnabled && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field max-w-xs"
          />
        )}
        {FilterComponent && <FilterComponent filters={extraFilters} setFilters={(f) => { setExtraFilters(f); setPage(1); }} />}
      </div>

      <DataTable columns={enrichedColumns} data={items} loading={loading} />
      <Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editItem ? 'Edit' : 'Create'} {title.replace(/s$/, '')}</h3>
            {FormComponent && (
              <FormComponent 
                key={editItem?.id || 'new'} 
                formData={formData} 
                setFormData={setFormData} 
                isEdit={!!editItem} 
              />
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
        danger
        confirmText="Delete"
      />
    </div>
  );
}

