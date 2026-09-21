import React, { useState, useEffect } from 'react';
import { Plus, Code2 } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormSelect, ToggleSwitch } from '../components/FormControls';

export const SkillsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Research & AI/ML',
    proficiency: 95,
    is_visible: true,
    publish_status: 'published',
  });

  const loadSkills = async () => {
    setLoading(true);
    const { data } = await portfolioService.skills.getAll(true);
    setSkills(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Research & AI/ML',
      proficiency: 95,
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingItem(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Research & AI/ML',
      proficiency: skill.proficiency ?? skill.proficiency_level ?? 95,
      is_visible: skill.is_visible !== false,
      publish_status: skill.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.skills.update(editingItem.id, formData);
      if (!error) {
        showToast('Skill updated!');
        setModalOpen(false);
        loadSkills();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: skills.length + 1 };
      const { error } = await portfolioService.skills.create(payload);
      if (!error) {
        showToast('Skill added!');
        setModalOpen(false);
        loadSkills();
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
    const { error } = await portfolioService.skills.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Skill deleted!');
      setDeleteTarget(null);
      loadSkills();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Skill / Domain Specialization',
      render: (val) => <span className="font-bold text-white">{val}</span>,
    },
    { key: 'category', label: 'Domain Category' },
    {
      key: 'proficiency',
      label: 'Expertise Level',
      render: (val, item) => (
        <span className="font-mono text-zinc-300">
          {(item.proficiency ?? item.proficiency_level ?? 90)}%
        </span>
      ),
    },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-zinc-300" /> Technical Skills & Research Competencies
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage AI/ML domains, soft computing proficiencies, architectures, and programming toolkits.
        </p>
      </div>

      <DataTable
        title="Technical Skills & Competencies"
        subtitle={`${skills.length} skills listed`}
        items={skills}
        columns={columns}
        searchKey="name"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.skills.reorder(reordered).then(() => {
            loadSkills();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.skills.update(item.id, { is_visible: item.is_visible === false });
          loadSkills();
          triggerRefresh();
        }}
        addButtonLabel="Add Skill"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Skill' : 'Add Technical Skill'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Skill / Domain Name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Deep Learning & CNNs"
                required
              />

              <FormSelect
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                options={['Research & AI/ML', 'Computer Vision & Healthcare', 'Soft Computing', 'Programming & Frameworks']}
              />

              <FormInput
                label="Proficiency Level (0-100%)"
                type="number"
                value={formData.proficiency}
                onChange={(e) => setFormData((p) => ({ ...p, proficiency: Number(e.target.value) }))}
                required
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
                  {saving ? 'Saving...' : editingItem ? 'Update Skill' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Skill"
        message="Are you sure you want to delete this skill entry?"
        itemName={deleteTarget?.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
