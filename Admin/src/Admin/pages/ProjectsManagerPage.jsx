import React, { useState, useEffect } from 'react';
import { Plus, FolderGit2, Star, ExternalLink } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch, TagInput } from '../components/FormControls';
import { MediaUploader } from '../components/MediaUploader';

export const ProjectsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    funding_agency: '',
    amount: '',
    period: '',
    status: 'Completed',
    role: 'Principal Investigator',
    category: 'Government Funded',
    description: '',
    image_url: '',
    tags: [],
    github_url: '',
    live_url: '',
    is_featured: false,
    is_visible: true,
    publish_status: 'published',
  });

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await portfolioService.projects.getAll(true);
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      funding_agency: '',
      amount: '',
      period: '',
      status: 'Completed',
      role: 'Principal Investigator',
      category: 'Government Funded',
      description: '',
      image_url: '',
      tags: [],
      github_url: '',
      live_url: '',
      is_featured: false,
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setEditingItem(proj);
    setFormData({
      title: proj.title || '',
      funding_agency: proj.funding_agency || proj.agency || '',
      amount: proj.amount || '',
      period: proj.period || '',
      status: proj.status || 'Completed',
      role: proj.role || 'Principal Investigator',
      category: proj.category || 'Government Funded',
      description: proj.description || '',
      image_url: proj.image_url || proj.cover_image_url || '',
      tags: Array.isArray(proj.tags) ? proj.tags : Array.isArray(proj.technologies) ? proj.technologies : [],
      github_url: proj.github_url || '',
      live_url: proj.live_url || '',
      is_featured: Boolean(proj.is_featured),
      is_visible: proj.is_visible !== false,
      publish_status: proj.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.projects.update(editingItem.id, formData);
      if (!error) {
        showToast('Project updated successfully!');
        setModalOpen(false);
        loadProjects();
        triggerRefresh();
      } else {
        showToast('Failed to update project: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = {
        ...formData,
        display_order: projects.length + 1,
      };
      const { error } = await portfolioService.projects.create(payload);
      if (!error) {
        showToast('Project created successfully!');
        setModalOpen(false);
        loadProjects();
        triggerRefresh();
      } else {
        showToast('Failed to create project: ' + (error.message || 'Unknown error'), 'error');
      }
    }
    setSaving(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const { error } = await portfolioService.projects.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Project deleted successfully!');
      setDeleteTarget(null);
      loadProjects();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const handleToggleVisibility = async (proj) => {
    const nextVal = proj.is_visible === false;
    await portfolioService.projects.update(proj.id, { is_visible: nextVal });
    loadProjects();
    triggerRefresh();
  };

  const handleReorder = async (reorderedList) => {
    await portfolioService.projects.reorder(reorderedList);
    loadProjects();
    triggerRefresh();
  };

  const columns = [
    {
      key: 'title',
      label: 'Project Title & Grant',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-sm">
          <div className="font-bold text-white line-clamp-2 flex items-center gap-1.5">
            {item.is_featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
            {val}
          </div>
          <div className="text-[11px] text-zinc-400 truncate">
            {item.funding_agency || item.agency} · {item.amount}
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'role', label: 'Role' },
    { key: 'period', label: 'Period' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-zinc-300" /> Funded Projects & Research Grants
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage research grants (DST, SPPU, AICTE), industry projects, consultancies, and credentials.
        </p>
      </div>

      <DataTable
        title="All Research Projects"
        subtitle={`${projects.length} projects recorded`}
        items={projects}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={handleReorder}
        onToggleVisibility={handleToggleVisibility}
        addButtonLabel="Add Project"
      />

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Project Details' : 'Add New Project / Grant'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Project Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. CerviTester: A Smart Screening Device..."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Funding Agency / Sponsor"
                  value={formData.funding_agency}
                  onChange={(e) => setFormData((p) => ({ ...p, funding_agency: e.target.value }))}
                  placeholder="e.g. DST, Govt. of India"
                  required
                />

                <FormInput
                  label="Grant Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="e.g. ₹ 35,70,576 /-"
                  required
                />

                <FormInput
                  label="Period / Duration"
                  value={formData.period}
                  onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
                  placeholder="e.g. July 2021 – June 2023"
                  required
                />

                <FormInput
                  label="Role"
                  value={formData.role}
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                  placeholder="e.g. Principal Investigator"
                />

                <FormSelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  options={['Government Funded', 'Industry Sponsored', 'Institutional', 'Consultancy']}
                />

                <FormSelect
                  label="Project Status"
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  options={['Completed', 'Ongoing', 'Proposed']}
                />
              </div>

              <FormTextarea
                label="Project Overview & Outcomes"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Brief description of research focus, clinical testing, and outcomes..."
              />

              <TagInput
                label="Technologies & Keywords"
                tags={formData.tags}
                onChange={(tags) => setFormData((p) => ({ ...p, tags }))}
                placeholder="e.g. Deep Learning, PyTorch, Embedded AI..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="GitHub Repository URL"
                  value={formData.github_url}
                  onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value }))}
                  placeholder="https://github.com/..."
                />
                <FormInput
                  label="Live Link / Demo URL"
                  value={formData.live_url}
                  onChange={(e) => setFormData((p) => ({ ...p, live_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <MediaUploader
                label="Project Image / Diagram"
                value={formData.image_url}
                onChange={(url) => setFormData((p) => ({ ...p, image_url: url }))}
                folder="projects"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <ToggleSwitch
                  label="Featured Project"
                  checked={formData.is_featured}
                  onChange={(val) => setFormData((p) => ({ ...p, is_featured: val }))}
                />
                <ToggleSwitch
                  label="Visible on Site"
                  checked={formData.is_visible}
                  onChange={(val) => setFormData((p) => ({ ...p, is_visible: val }))}
                />
                <FormSelect
                  label="Publish Status"
                  value={formData.publish_status}
                  onChange={(e) => setFormData((p) => ({ ...p, publish_status: e.target.value }))}
                  options={['published', 'draft']}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
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
                  {saving ? 'Saving...' : editingItem ? 'Update Project' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Project"
        message="Are you sure you want to remove this project record?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
