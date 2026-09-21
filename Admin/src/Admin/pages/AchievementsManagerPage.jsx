import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch } from '../components/FormControls';

export const AchievementsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    year: '2023',
    category: 'Award',
    description: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadAchievements = async () => {
    setLoading(true);
    const { data } = await portfolioService.achievements.getAll(true);
    setAchievements(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      organization: '',
      year: new Date().getFullYear().toString(),
      category: 'Award',
      description: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      organization: item.organization || '',
      year: item.year || '',
      category: item.category || 'Award',
      description: item.description || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.achievements.update(editingItem.id, formData);
      if (!error) {
        showToast('Achievement updated!');
        setModalOpen(false);
        loadAchievements();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: achievements.length + 1 };
      const { error } = await portfolioService.achievements.create(payload);
      if (!error) {
        showToast('Achievement added!');
        setModalOpen(false);
        loadAchievements();
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
    const { error } = await portfolioService.achievements.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Achievement deleted!');
      setDeleteTarget(null);
      loadAchievements();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Achievement / Award Title',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{val}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">{item.organization}</div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'year', label: 'Year' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> Honors, Awards & Academic Recognitions
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage Dr. APJ Abdul Kalam Award, Best Paper prizes, IEEE recognitions, and university distinctions.
        </p>
      </div>

      <DataTable
        title="Achievements & Honors"
        subtitle={`${achievements.length} recognitions recorded`}
        items={achievements}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.achievements.reorder(reordered).then(() => {
            loadAchievements();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.achievements.update(item.id, { is_visible: item.is_visible === false });
          loadAchievements();
          triggerRefresh();
        }}
        addButtonLabel="Add Achievement"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Achievement' : 'Add Achievement / Honor'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Award / Recognition Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Dr. A.P.J. Abdul Kalam Women Achiever Award"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  options={['National Award', 'State Award', 'Best Paper Award', 'Institutional Recognition', 'Honorary Fellow']}
                />
                <FormInput
                  label="Year Conferred"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="e.g. 2023"
                  required
                />
              </div>

              <FormInput
                label="Conferring Organization / Body"
                value={formData.organization}
                onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
                placeholder="e.g. Global Society for Multidisciplinary Research"
              />

              <FormTextarea
                label="Citation / Description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Brief summary of the honor and achievements recognized..."
              />

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
                  {saving ? 'Saving...' : editingItem ? 'Update Award' : 'Save Award'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement entry?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
