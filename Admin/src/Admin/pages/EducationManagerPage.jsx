import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch } from '../components/FormControls';

export const EducationManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    degree: '',
    field: '',
    institution: '',
    university: '',
    year: '',
    grade: '',
    thesis_title: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadEducation = async () => {
    setLoading(true);
    const { data } = await portfolioService.education.getAll(true);
    setEducationList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      degree: 'Ph.D.',
      field: 'Computer Science & Engineering',
      institution: '',
      university: '',
      year: new Date().getFullYear().toString(),
      grade: '',
      thesis_title: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      degree: item.degree || '',
      field: item.field || '',
      institution: item.institution || '',
      university: item.university || '',
      year: item.year || '',
      grade: item.grade || item.specialization || '',
      thesis_title: item.thesis_title || item.thesisTitle || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.education.update(editingItem.id, formData);
      if (!error) {
        showToast('Education record updated!');
        setModalOpen(false);
        loadEducation();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: educationList.length + 1 };
      const { error } = await portfolioService.education.create(payload);
      if (!error) {
        showToast('Education record added!');
        setModalOpen(false);
        loadEducation();
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
    const { error } = await portfolioService.education.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Education record deleted!');
      setDeleteTarget(null);
      loadEducation();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'degree',
      label: 'Degree & Field of Study',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-slate-900 dark:text-white">{val} in {item.field}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400">{item.institution} · {item.university}</div>
        </div>
      ),
    },
    { key: 'year', label: 'Year Completed' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600 dark:text-zinc-300" /> Academic Qualifications & Education
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage Ph.D. degrees, Master of Engineering (M.E.), Bachelor (B.E.), entrance merits, and thesis details.
        </p>
      </div>

      <DataTable
        title="Education History"
        subtitle={`${educationList.length} degrees recorded`}
        items={educationList}
        columns={columns}
        searchKey="degree"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.education.reorder(reordered).then(() => {
            loadEducation();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.education.update(item.id, { is_visible: item.is_visible === false });
          loadEducation();
          triggerRefresh();
        }}
        addButtonLabel="Add Degree"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Qualification' : 'Add Academic Degree'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Degree"
                  value={formData.degree}
                  onChange={(e) => setFormData((p) => ({ ...p, degree: e.target.value }))}
                  placeholder="e.g. Ph.D. / M.E. / B.E."
                  required
                />
                <FormInput
                  label="Field / Discipline"
                  value={formData.field}
                  onChange={(e) => setFormData((p) => ({ ...p, field: e.target.value }))}
                  placeholder="e.g. Computer Science & Engg"
                  required
                />
              </div>

              <FormInput
                label="College / Institute"
                value={formData.institution}
                onChange={(e) => setFormData((p) => ({ ...p, institution: e.target.value }))}
                placeholder="e.g. SGGS Institute of Engineering & Technology"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Affiliating University"
                  value={formData.university}
                  onChange={(e) => setFormData((p) => ({ ...p, university: e.target.value }))}
                  placeholder="e.g. SRTMU Nanded / SPPU"
                />
                <FormInput
                  label="Graduation Year"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="e.g. 2015"
                  required
                />
              </div>

              <FormTextarea
                label="Thesis Title / Research Topic"
                value={formData.thesis_title}
                onChange={(e) => setFormData((p) => ({ ...p, thesis_title: e.target.value }))}
                rows={2}
                placeholder="Title of doctoral or master's thesis dissertation..."
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
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 dark:text-black dark:bg-zinc-100 dark:hover:bg-white rounded-xl cursor-pointer shadow-md"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Degree' : 'Save Degree'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Qualification"
        message="Are you sure you want to delete this education record?"
        itemName={deleteTarget?.degree}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
