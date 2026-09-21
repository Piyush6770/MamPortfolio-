import React, { useState, useEffect } from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormSelect, ToggleSwitch } from '../components/FormControls';
import { MediaUploader } from '../components/MediaUploader';

export const BooksManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Textbook',
    title: '',
    authors: 'Dr. Swati Vijay Shinde',
    publisher: 'Elsevier, Academic Press',
    year: '2025',
    isbn: '',
    cover_image_url: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadBooks = async () => {
    setLoading(true);
    const { data } = await portfolioService.books.getAll(true);
    setBooks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'Textbook',
      title: '',
      authors: 'Dr. Swati Vijay Shinde',
      publisher: 'CRC Press, Taylor & Francis',
      year: new Date().getFullYear().toString(),
      isbn: '',
      cover_image_url: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'Textbook',
      title: item.title || '',
      authors: item.authors || '',
      publisher: item.publisher || '',
      year: item.year || '',
      isbn: item.isbn || '',
      cover_image_url: item.cover_image_url || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.books.update(editingItem.id, formData);
      if (!error) {
        showToast('Book record updated!');
        setModalOpen(false);
        loadBooks();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: books.length + 1 };
      const { error } = await portfolioService.books.create(payload);
      if (!error) {
        showToast('Book record added!');
        setModalOpen(false);
        loadBooks();
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
    const { error } = await portfolioService.books.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Book record deleted!');
      setDeleteTarget(null);
      loadBooks();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Book Title & Publisher',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-white line-clamp-2">{val}</div>
          <div className="text-[11px] text-zinc-400">
            {item.publisher} ({item.year}) · ISBN: {item.isbn || 'N/A'}
          </div>
        </div>
      ),
    },
    { key: 'type', label: 'Type' },
    { key: 'year', label: 'Year' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-zinc-300" /> Authored Books & Book Chapters
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage published volumes with Elsevier, CRC Press, Springer, PHI Learning, and edited chapters.
        </p>
      </div>

      <DataTable
        title="Books & Authored Volumes"
        subtitle={`${books.length} publications recorded`}
        items={books}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.books.reorder(reordered).then(() => {
            loadBooks();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.books.update(item.id, { is_visible: item.is_visible === false });
          loadBooks();
          triggerRefresh();
        }}
        addButtonLabel="Add Book / Chapter"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Book / Chapter' : 'Add Book / Chapter'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  options={['Textbook', 'Edited Book', 'Book Chapter', 'Monograph']}
                />
                <FormSelect
                  label="Status"
                  value={formData.publish_status}
                  onChange={(e) => setFormData((p) => ({ ...p, publish_status: e.target.value }))}
                  options={['published', 'draft']}
                />
              </div>

              <FormInput
                label="Book / Chapter Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Full title of the book or chapter..."
                required
              />

              <FormInput
                label="Authors / Editors"
                value={formData.authors}
                onChange={(e) => setFormData((p) => ({ ...p, authors: e.target.value }))}
                placeholder="e.g. Dr. Swati Vijay Shinde"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData((p) => ({ ...p, publisher: e.target.value }))}
                  placeholder="e.g. Elsevier / CRC Press"
                  required
                />
                <FormInput
                  label="Year of Publication"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="e.g. 2025"
                  required
                />
              </div>

              <FormInput
                label="ISBN Number"
                value={formData.isbn}
                onChange={(e) => setFormData((p) => ({ ...p, isbn: e.target.value }))}
                placeholder="e.g. 978-0-12-824054-0"
              />

              <MediaUploader
                label="Cover Image (optional)"
                value={formData.cover_image_url}
                onChange={(url) => setFormData((p) => ({ ...p, cover_image_url: url }))}
                folder="books"
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
                  {saving ? 'Saving...' : editingItem ? 'Update Book' : 'Save Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Book Record"
        message="Are you sure you want to delete this book/chapter entry?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
