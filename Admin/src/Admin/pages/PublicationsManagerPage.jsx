import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormSelect, ToggleSwitch, TagInput } from '../components/FormControls';

export const PublicationsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Journal',
    title: '',
    authors: 'Dr. Swati Vijay Shinde',
    journal_or_conference: '',
    year: new Date().getFullYear(),
    indexing: 'Scopus / SCI',
    impact_factor: '',
    doi_or_url: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadPubs = async () => {
    setLoading(true);
    const { data } = await portfolioService.publications.getAll(true);
    setPublications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPubs();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'Journal',
      title: '',
      authors: 'Dr. Swati Vijay Shinde',
      journal_or_conference: '',
      year: new Date().getFullYear(),
      indexing: 'Scopus / SCI',
      impact_factor: '',
      doi_or_url: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'Journal',
      title: item.title || '',
      authors: item.authors || '',
      journal_or_conference: item.journal_or_conference || item.venue || '',
      year: item.year || new Date().getFullYear(),
      indexing: item.indexing || 'Scopus',
      impact_factor: item.impact_factor || item.impactFactor || '',
      doi_or_url: item.doi_or_url || item.doi_url || item.doi || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.publications.update(editingItem.id, formData);
      if (!error) {
        showToast('Publication updated!');
        setModalOpen(false);
        loadPubs();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: publications.length + 1 };
      const { error } = await portfolioService.publications.create(payload);
      if (!error) {
        showToast('Publication added!');
        setModalOpen(false);
        loadPubs();
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
    const { error } = await portfolioService.publications.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Publication deleted!');
      setDeleteTarget(null);
      loadPubs();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Paper Title & Authors',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-white line-clamp-2">{val}</div>
          <div className="text-[11px] text-zinc-400">
            {item.authors} · <i>{item.journal_or_conference || item.venue}</i> ({item.year})
          </div>
        </div>
      ),
    },
    { key: 'type', label: 'Type' },
    { key: 'indexing', label: 'Indexing' },
    { key: 'year', label: 'Year' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-zinc-300" /> Research Publications Manager
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage journal papers (SCI/SCIE/Scopus), international conference proceedings, and book chapters.
        </p>
      </div>

      <DataTable
        title="Scholarly Publications"
        subtitle={`${publications.length} papers recorded`}
        items={publications}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.publications.reorder(reordered).then(() => {
            loadPubs();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.publications.update(item.id, { is_visible: item.is_visible === false });
          loadPubs();
          triggerRefresh();
        }}
        addButtonLabel="Add Publication"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Publication' : 'Add Research Publication'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Publication Type"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  options={[
                    { label: 'Journal Article', value: 'Journal' },
                    { label: 'Conference Proceeding', value: 'Conference' },
                    { label: 'Book Chapter', value: 'Chapter' },
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
                label="Paper Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Full publication title..."
                required
              />

              <FormInput
                label="Authors"
                value={formData.authors}
                onChange={(e) => setFormData((p) => ({ ...p, authors: e.target.value }))}
                placeholder="e.g. S Shinde, M Kalbhor, D Jude..."
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <FormInput
                    label="Journal / Venue / Conference"
                    value={formData.journal_or_conference}
                    onChange={(e) => setFormData((p) => ({ ...p, journal_or_conference: e.target.value }))}
                    placeholder="e.g. Scientific Reports / IEEE ICCUBEA"
                    required
                  />
                </div>
                <FormInput
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: Number(e.target.value) }))}
                  required
                />
              </div>

              <FormInput
                label="Indexing Badges"
                value={formData.indexing}
                onChange={(e) => setFormData((p) => ({ ...p, indexing: e.target.value }))}
                placeholder="e.g. SCI, Scopus, Q1"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Impact Factor (if applicable)"
                  value={formData.impact_factor}
                  onChange={(e) => setFormData((p) => ({ ...p, impact_factor: e.target.value }))}
                  placeholder="e.g. 5.1"
                />
                <FormInput
                  label="DOI / Paper URL"
                  value={formData.doi_or_url}
                  onChange={(e) => setFormData((p) => ({ ...p, doi_or_url: e.target.value }))}
                  placeholder="https://doi.org/..."
                />
              </div>

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
                  {saving ? 'Saving...' : editingItem ? 'Update Paper' : 'Publish Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Publication"
        message="Are you sure you want to delete this publication record?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
