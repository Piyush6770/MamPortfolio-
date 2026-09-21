import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch } from '../components/FormControls';
import { MediaUploader } from '../components/MediaUploader';

export const GalleryManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Research',
    description: '',
    date: '2023',
    image_url: '',
    gradient: 'from-zinc-800 to-zinc-950',
    icon_name: 'Award',
    is_visible: true,
    publish_status: 'published',
  });

  const loadGallery = async () => {
    setLoading(true);
    const { data } = await portfolioService.gallery.getAll(true);
    setGalleryItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Research',
      description: '',
      date: new Date().getFullYear().toString(),
      image_url: '',
      gradient: 'from-zinc-800 to-zinc-950',
      icon_name: 'Award',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Research',
      description: item.description || '',
      date: item.date || '',
      image_url: item.image_url || '',
      gradient: item.gradient || 'from-zinc-800 to-zinc-950',
      icon_name: item.icon_name || 'Award',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.gallery.update(editingItem.id, formData);
      if (!error) {
        showToast('Gallery highlight updated!');
        setModalOpen(false);
        loadGallery();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: galleryItems.length + 1 };
      const { error } = await portfolioService.gallery.create(payload);
      if (!error) {
        showToast('Gallery highlight added!');
        setModalOpen(false);
        loadGallery();
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
    const { error } = await portfolioService.gallery.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Gallery item deleted!');
      setDeleteTarget(null);
      loadGallery();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Moment / Highlight',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {item.image_url ? (
              <img src={item.image_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-zinc-700 shrink-0" />
            ) : null}
            <span>{val}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">{item.description}</div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'date', label: 'Date' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> Gallery & Moment Highlights
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage visual gallery cards, conference inaugurations, DST device demonstrations, and award moments.
        </p>
      </div>

      <DataTable
        title="Gallery Highlights"
        subtitle={`${galleryItems.length} moments available`}
        items={galleryItems}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.gallery.reorder(reordered).then(() => {
            loadGallery();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.gallery.update(item.id, { is_visible: item.is_visible === false });
          loadGallery();
          triggerRefresh();
        }}
        addButtonLabel="Add Gallery Item"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Gallery Highlight' : 'Add Gallery Highlight'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Highlight Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. DST CerviTester Screening Device Demonstration"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  options={['Research', 'Awards', 'Conferences', 'Workshops', 'Institutional']}
                />
                <FormInput
                  label="Date / Period"
                  value={formData.date}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  placeholder="e.g. July 2023"
                  required
                />
              </div>

              <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                placeholder="Details of the event or demonstration..."
                required
              />

              <MediaUploader
                label="Photo / Graphic"
                value={formData.image_url}
                onChange={(url) => setFormData((p) => ({ ...p, image_url: url }))}
                folder="gallery"
              />

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
                  {saving ? 'Saving...' : editingItem ? 'Update Moment' : 'Save Moment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery card?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
