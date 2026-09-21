import React, { useState, useEffect } from 'react';
import { FileCode2 } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormSelect, ToggleSwitch } from '../components/FormControls';

export const PatentsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Granted Patent',
    title: '',
    application_no: '',
    status: 'Granted',
    filing_date: '',
    grant_date: '',
    inventors: 'Dr. Swati Vijay Shinde',
    country: 'India',
    is_visible: true,
    publish_status: 'published',
  });

  const loadPatents = async () => {
    setLoading(true);
    const { data } = await portfolioService.patents.getAll(true);
    setPatents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPatents();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'Granted Patent',
      title: '',
      application_no: '',
      status: 'Granted',
      filing_date: new Date().getFullYear().toString(),
      grant_date: '',
      inventors: 'Dr. Swati Vijay Shinde',
      country: 'India',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'Granted Patent',
      title: item.title || '',
      application_no: item.application_no || item.applicationNumber || '',
      status: item.status || 'Granted',
      filing_date: item.filing_date || item.filingDate || '',
      grant_date: item.grant_date || item.grantDate || '',
      inventors: item.inventors || '',
      country: item.country || 'India',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.patents.update(editingItem.id, formData);
      if (!error) {
        showToast('Patent / IPR updated!');
        setModalOpen(false);
        loadPatents();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: patents.length + 1 };
      const { error } = await portfolioService.patents.create(payload);
      if (!error) {
        showToast('Patent / IPR added!');
        setModalOpen(false);
        loadPatents();
        triggerRefresh();
      } else {
        showToast('Failed to add: ' + (error.message || 'Unknown error'), 'error');
      }
    }
    setSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const { error } = await portfolioService.patents.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Patent / IPR deleted!');
      setDeleteTarget(null);
      loadPatents();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'IPR Title & Application No.',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-slate-900 dark:text-white line-clamp-2">{val}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">
            App No: {item.application_no || item.applicationNumber} · {item.inventors}
          </div>
        </div>
      ),
    },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'filing_date', label: 'Filing Year' },
    { key: 'publish_status', label: 'Publish' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> Patents, Designs & Copyrights (IPR)
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage granted patents, published patent applications, and registered copyrights.
        </p>
      </div>

      <DataTable
        title="Patents & IPR Records"
        subtitle={`${patents.length} intellectual property assets registered`}
        items={patents}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.patents.reorder(reordered).then(() => {
            loadPatents();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.patents.update(item.id, { is_visible: item.is_visible === false });
          loadPatents();
          triggerRefresh();
        }}
        addButtonLabel="Add Patent / IPR"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Patent / IPR' : 'Add Patent / IPR'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="IPR Type"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  options={['Granted Patent', 'Published Patent', 'Copyright', 'Industrial Design']}
                />
                <FormSelect
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  options={['Granted', 'Published', 'Registered', 'Filed']}
                />
              </div>

              <FormInput
                label="Patent / IPR Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Full title of the invention..."
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Application / Diary Number"
                  value={formData.application_no}
                  onChange={(e) => setFormData((p) => ({ ...p, application_no: e.target.value }))}
                  placeholder="e.g. 202121012345"
                  required
                />
                <FormInput
                  label="Inventors / Authors"
                  value={formData.inventors}
                  onChange={(e) => setFormData((p) => ({ ...p, inventors: e.target.value }))}
                  placeholder="e.g. Dr. Swati Vijay Shinde"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Filing Date / Year"
                  value={formData.filing_date}
                  onChange={(e) => setFormData((p) => ({ ...p, filing_date: e.target.value }))}
                  placeholder="e.g. 15/07/2021"
                />
                <FormInput
                  label="Grant Date (if granted)"
                  value={formData.grant_date}
                  onChange={(e) => setFormData((p) => ({ ...p, grant_date: e.target.value }))}
                  placeholder="e.g. 10/03/2023"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Publish Status"
                  value={formData.publish_status}
                  onChange={(e) => setFormData((p) => ({ ...p, publish_status: e.target.value }))}
                  options={['published', 'draft']}
                />
                <ToggleSwitch
                  label="Visible on Site"
                  checked={formData.is_visible}
                  onChange={(val) => setFormData((p) => ({ ...p, is_visible: val }))}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 dark:text-black dark:bg-zinc-100 dark:hover:bg-white rounded-xl cursor-pointer shadow-md transition-colors"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update IPR' : 'Save IPR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Patent / IPR"
        message="Are you sure you want to delete this patent/copyright record?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
