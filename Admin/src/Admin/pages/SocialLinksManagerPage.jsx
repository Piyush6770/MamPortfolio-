import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormSelect, ToggleSwitch } from '../components/FormControls';

export const SocialLinksManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    platform: 'LinkedIn',
    url: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadLinks = async () => {
    setLoading(true);
    const { data } = await portfolioService.socialLinks.getAll(true);
    setLinks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      platform: 'Google Scholar',
      url: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      platform: item.platform || '',
      url: item.url || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.socialLinks.update(editingItem.id, formData);
      if (!error) {
        showToast('Link updated!');
        setModalOpen(false);
        loadLinks();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: links.length + 1 };
      const { error } = await portfolioService.socialLinks.create(payload);
      if (!error) {
        showToast('Link added!');
        setModalOpen(false);
        loadLinks();
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
    const { error } = await portfolioService.socialLinks.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Link deleted!');
      setDeleteTarget(null);
      loadLinks();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'platform',
      label: 'Platform / Profile',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-white">{val}</div>
          <div className="text-[11px] text-zinc-400 truncate">{item.url}</div>
        </div>
      ),
    },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-zinc-300" /> Academic & Social Profile Links
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage Google Scholar, Scopus Author, LinkedIn, YouTube, ResearchGate, and ORCID profiles.
        </p>
      </div>

      <DataTable
        title="Profile Links"
        subtitle={`${links.length} profiles configured`}
        items={links}
        columns={columns}
        searchKey="platform"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.socialLinks.reorder(reordered).then(() => {
            loadLinks();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.socialLinks.update(item.id, { is_visible: item.is_visible === false });
          loadLinks();
          triggerRefresh();
        }}
        addButtonLabel="Add Profile Link"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Profile Link' : 'Add Profile Link'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Platform Name"
                value={formData.platform}
                onChange={(e) => setFormData((p) => ({ ...p, platform: e.target.value }))}
                placeholder="e.g. Google Scholar / Scopus / LinkedIn / ORCID"
                required
              />

              <FormInput
                label="Profile Web Address (URL)"
                value={formData.url}
                onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
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
                  {saving ? 'Saving...' : editingItem ? 'Update Link' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Profile Link"
        message="Are you sure you want to remove this profile link?"
        itemName={deleteTarget?.platform}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
