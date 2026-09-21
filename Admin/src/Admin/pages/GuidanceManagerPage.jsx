import React, { useState, useEffect } from 'react';
import { Users2, GraduationCap } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch } from '../components/FormControls';

export const GuidanceManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    degree: 'Ph.D.',
    scholar_name: '',
    research_topic: '',
    year: '2023',
    university: 'SPPU Pune',
    status: 'Ongoing',
    is_visible: true,
    publish_status: 'published',
  });

  const loadScholars = async () => {
    setLoading(true);
    const { data } = await portfolioService.guidance.getAll(true);
    setScholars(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadScholars();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      degree: 'Ph.D.',
      scholar_name: '',
      research_topic: '',
      year: new Date().getFullYear().toString(),
      university: 'SPPU Pune',
      status: 'Ongoing',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree || 'Ph.D.',
      scholar_name: item.scholar_name || item.name || '',
      research_topic: item.research_topic || item.topic || item.thesis_title || '',
      year: item.year || item.joining_date || '',
      university: item.university || 'SPPU Pune',
      status: item.status || 'Ongoing',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.guidance.update(editingItem.id, formData);
      if (!error) {
        showToast('Scholar record updated!');
        setModalOpen(false);
        loadScholars();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: scholars.length + 1 };
      const { error } = await portfolioService.guidance.create(payload);
      if (!error) {
        showToast('Scholar record added!');
        setModalOpen(false);
        loadScholars();
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
    const { error } = await portfolioService.guidance.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Scholar record deleted!');
      setDeleteTarget(null);
      loadScholars();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'scholar_name',
      label: 'Scholar & Research Area',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{val || item.name}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
            {item.research_topic || item.topic || item.thesis_title}
          </div>
        </div>
      ),
    },
    { key: 'degree', label: 'Degree' },
    { key: 'status', label: 'Status' },
    { key: 'year', label: 'Year' },
    { key: 'publish_status', label: 'Publish' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users2 className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> Research Guidance & Student Mentorship
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage Ph.D. scholars, Master's PG dissertations, and research viva records.
        </p>
      </div>

      <DataTable
        title="Supervised Scholars"
        subtitle={`${scholars.length} scholars recorded`}
        items={scholars}
        columns={columns}
        searchKey="scholar_name"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.guidance.reorder(reordered).then(() => {
            loadScholars();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.guidance.update(item.id, { is_visible: item.is_visible === false });
          loadScholars();
          triggerRefresh();
        }}
        addButtonLabel="Add Scholar"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Scholar Details' : 'Add Supervised Scholar'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Program / Degree"
                  value={formData.degree}
                  onChange={(e) => setFormData((p) => ({ ...p, degree: e.target.value }))}
                  options={['Ph.D.', 'M.Tech / M.E.', 'B.Tech Honors']}
                />
                <FormSelect
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  options={['Completed', 'Ongoing', 'Thesis Submitted']}
                />
              </div>

              <FormInput
                label="Scholar Full Name"
                value={formData.scholar_name}
                onChange={(e) => setFormData((p) => ({ ...p, scholar_name: e.target.value }))}
                placeholder="e.g. Dr. Rajesh Kulkarni"
                required
              />

              <FormTextarea
                label="Research Topic / Dissertation Title"
                value={formData.research_topic}
                onChange={(e) => setFormData((p) => ({ ...p, research_topic: e.target.value }))}
                rows={2}
                placeholder="Title of doctoral or master's research work..."
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Year / Period"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="e.g. 2023"
                  required
                />
                <FormInput
                  label="University / Center"
                  value={formData.university}
                  onChange={(e) => setFormData((p) => ({ ...p, university: e.target.value }))}
                  placeholder="e.g. SPPU Pune"
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
                  {saving ? 'Saving...' : editingItem ? 'Update Scholar' : 'Save Scholar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Scholar Record"
        message="Are you sure you want to delete this scholar mentorship entry?"
        itemName={deleteTarget?.scholar_name || deleteTarget?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
