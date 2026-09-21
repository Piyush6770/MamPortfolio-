import React, { useState, useEffect } from 'react';
import { Mic2, Calendar } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormTextarea, FormSelect, ToggleSwitch } from '../components/FormControls';

export const TalksEventsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Keynote Talk',
    title: '',
    event_name: '',
    organization: 'PCCoE, Pune',
    date: '2025',
    location: 'Pune',
    is_visible: true,
    publish_status: 'published',
  });

  const loadTalks = async () => {
    setLoading(true);
    const { data } = await portfolioService.talksAndEvents.getAll(true);
    setTalks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTalks();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'Keynote Talk',
      title: '',
      event_name: '',
      organization: 'PCCoE, Pune',
      date: new Date().getFullYear().toString(),
      location: 'Pune',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'Keynote Talk',
      title: item.title || item.topic_or_title || '',
      event_name: item.event_name || item.event_or_equipment || '',
      organization: item.organization || item.venue_or_sponsor || '',
      date: item.date || item.date_or_period || '',
      location: item.location || 'Pune',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.talksAndEvents.update(editingItem.id, formData);
      if (!error) {
        showToast('Talk / Event updated!');
        setModalOpen(false);
        loadTalks();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: talks.length + 1 };
      const { error } = await portfolioService.talksAndEvents.create(payload);
      if (!error) {
        showToast('Talk / Event added!');
        setModalOpen(false);
        loadTalks();
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
    const { error } = await portfolioService.talksAndEvents.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Talk / Event deleted!');
      setDeleteTarget(null);
      loadTalks();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Topic / Event Title',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{val || item.topic_or_title}</div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
            {item.event_name || item.event_or_equipment} · {item.organization || item.venue_or_sponsor}
          </div>
        </div>
      ),
    },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date / Year' },
    { key: 'publish_status', label: 'Publish' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> Keynote Talks, Organized Events & Research Labs
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Manage invited sessions, AI/ML workshops, IEEE conferences, and established Centre of Excellence labs.
        </p>
      </div>

      <DataTable
        title="Talks & Research Events"
        subtitle={`${talks.length} events recorded`}
        items={talks}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.talksAndEvents.reorder(reordered).then(() => {
            loadTalks();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.talksAndEvents.update(item.id, { is_visible: item.is_visible === false });
          loadTalks();
          triggerRefresh();
        }}
        addButtonLabel="Add Talk / Event"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Talk / Event' : 'Add Talk / Event'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category / Type"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  options={['Keynote Talk', 'Conference / STTP', 'Research Lab', 'Workshop', 'Expert Session']}
                />
                <FormSelect
                  label="Status"
                  value={formData.publish_status}
                  onChange={(e) => setFormData((p) => ({ ...p, publish_status: e.target.value }))}
                  options={['published', 'draft']}
                />
              </div>

              <FormInput
                label="Topic / Subject Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. AI in Healthcare & Medical Imaging Diagnostics"
                required
              />

              <FormInput
                label="Event / Conference / Lab Name"
                value={formData.event_name}
                onChange={(e) => setFormData((p) => ({ ...p, event_name: e.target.value }))}
                placeholder="e.g. International Conference on Computational Intelligence"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Organization / Host / Sponsor"
                  value={formData.organization}
                  onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
                  placeholder="e.g. IEEE / SPPU Pune"
                />
                <FormInput
                  label="Date / Year"
                  value={formData.date}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  placeholder="e.g. 2024"
                  required
                />
              </div>

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
                  {saving ? 'Saving...' : editingItem ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Talk / Event"
        message="Are you sure you want to delete this event record?"
        itemName={deleteTarget?.title || deleteTarget?.topic_or_title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
