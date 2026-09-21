import React, { useState, useEffect } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch } from '../components/FormControls';

export const ExperienceManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'admin',
    role: '',
    organization: 'Pimpri Chinchwad College of Engineering, Pune',
    period: '',
    description: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadExperience = async () => {
    setLoading(true);
    const { data } = await portfolioService.experience.getAll(true);
    setExperienceList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'admin',
      role: '',
      organization: 'Pimpri Chinchwad College of Engineering, Pune',
      period: '2023 – Present',
      description: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'admin',
      role: item.role || item.designation || '',
      organization: item.organization || item.institute || '',
      period: item.period || '',
      description: item.description || item.natureOfWork || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.experience.update(editingItem.id, formData);
      if (!error) {
        showToast('Experience updated!');
        setModalOpen(false);
        loadExperience();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: experienceList.length + 1 };
      const { error } = await portfolioService.experience.create(payload);
      if (!error) {
        showToast('Experience added!');
        setModalOpen(false);
        loadExperience();
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
    const { error } = await portfolioService.experience.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Experience deleted!');
      setDeleteTarget(null);
      loadExperience();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'role',
      label: 'Position / Designation',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-white">{val || item.designation}</div>
          <div className="text-[11px] text-zinc-400">{item.organization || item.institute}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Experience Type',
      render: (val) => (
        <span className="capitalize font-medium text-zinc-300">
          {val === 'admin' ? 'Administrative Leadership' : 'Academic / Teaching'}
        </span>
      ),
    },
    { key: 'period', label: 'Tenure / Period' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-zinc-300" /> Teaching & Administrative Experience
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage Dean leadership roles, Head of Department tenures, and professorship experience.
        </p>
      </div>

      <DataTable
        title="Career Timeline & Roles"
        subtitle={`${experienceList.length} positions recorded`}
        items={experienceList}
        columns={columns}
        searchKey="role"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.experience.reorder(reordered).then(() => {
            loadExperience();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.experience.update(item.id, { is_visible: item.is_visible === false });
          loadExperience();
          triggerRefresh();
        }}
        addButtonLabel="Add Experience"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Career Position' : 'Add Career Position'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Experience Type"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  options={[
                    { label: 'Administrative Role', value: 'admin' },
                    { label: 'Teaching / Faculty', value: 'work' },
                  ]}
                />
                <FormSelect
                  label="Status"
                  value={formData.publish_status}
                  onChange={(e) => setFormData((p) => ({ ...p, publish_status: e.target.value }))}
                  options={['published', 'draft']}
                />
              </div>

              <FormInput
                label="Designation / Role Title"
                value={formData.role}
                onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                placeholder="e.g. Dean - Management Information System"
                required
              />

              <FormInput
                label="Institution / Organization"
                value={formData.organization}
                onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
                placeholder="e.g. PCCoE Pune"
                required
              />

              <FormInput
                label="Duration / Period"
                value={formData.period}
                onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
                placeholder="e.g. 2021 – Present"
                required
              />

              <FormTextarea
                label="Responsibilities & Key Achievements"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Details of leadership, accreditation coordination, and initiatives..."
              />

              <ToggleSwitch
                label="Visible on Site"
                checked={formData.is_visible}
                onChange={(val) => setFormData((p) => ({ ...p, is_visible: val }))}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-black bg-zinc-100 hover:bg-white rounded-xl cursor-pointer shadow-md"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Position' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Position Record"
        message="Are you sure you want to delete this career experience entry?"
        itemName={deleteTarget?.role || deleteTarget?.designation}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
