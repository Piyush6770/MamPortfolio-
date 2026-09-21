import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput, FormSelect, ToggleSwitch } from '../components/FormControls';

export const CertificationsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'certification',
    title: '',
    issuer: '',
    year: '2023',
    credential_url: '',
    is_visible: true,
    publish_status: 'published',
  });

  const loadCerts = async () => {
    setLoading(true);
    const { data } = await portfolioService.certifications.getAll(true);
    setCerts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'certification',
      title: '',
      issuer: 'NVIDIA / NPTEL / Coursera',
      year: new Date().getFullYear().toString(),
      credential_url: '',
      is_visible: true,
      publish_status: 'published',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      type: item.type || 'certification',
      title: item.title || '',
      issuer: item.issuer || item.organization || '',
      year: item.year || item.issue_date || '',
      credential_url: item.credential_url || '',
      is_visible: item.is_visible !== false,
      publish_status: item.publish_status || 'published',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (editingItem) {
      const { error } = await portfolioService.certifications.update(editingItem.id, formData);
      if (!error) {
        showToast('Credential updated!');
        setModalOpen(false);
        loadCerts();
        triggerRefresh();
      } else {
        showToast('Failed to update: ' + (error.message || 'Unknown error'), 'error');
      }
    } else {
      const payload = { ...formData, display_order: certs.length + 1 };
      const { error } = await portfolioService.certifications.create(payload);
      if (!error) {
        showToast('Credential added!');
        setModalOpen(false);
        loadCerts();
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
    const { error } = await portfolioService.certifications.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Credential deleted!');
      setDeleteTarget(null);
      loadCerts();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Certification / Membership Title',
      render: (val, item) => (
        <div className="space-y-0.5 max-w-md">
          <div className="font-bold text-white line-clamp-1">{val}</div>
          <div className="text-[11px] text-zinc-400">{item.issuer || item.organization}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <span className="capitalize font-medium text-zinc-300">
          {val === 'membership' ? 'Professional Membership' : 'Certificate'}
        </span>
      ),
    },
    { key: 'year', label: 'Year' },
    { key: 'publish_status', label: 'Status' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-zinc-300" /> Certifications & Professional Memberships
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage NVIDIA DLI Instructor Ambassador credentials, NPTEL Silver Elite ranks, ISTE, and IEEE memberships.
        </p>
      </div>

      <DataTable
        title="Certifications & Memberships"
        subtitle={`${certs.length} credentials recorded`}
        items={certs}
        columns={columns}
        searchKey="title"
        loading={loading}
        onAddNew={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteTarget(item)}
        onReorder={(reordered) => {
          portfolioService.certifications.reorder(reordered).then(() => {
            loadCerts();
            triggerRefresh();
          });
        }}
        onToggleVisibility={async (item) => {
          await portfolioService.certifications.update(item.id, { is_visible: item.is_visible === false });
          loadCerts();
          triggerRefresh();
        }}
        addButtonLabel="Add Credential"
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold text-white">
              {editingItem ? 'Edit Credential' : 'Add Credential / Membership'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  options={[
                    { label: 'Certification', value: 'certification' },
                    { label: 'Professional Body Membership', value: 'membership' },
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
                label="Certification / Membership Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. NVIDIA Certified Deep Learning Instructor & Ambassador"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Issuing Organization"
                  value={formData.issuer}
                  onChange={(e) => setFormData((p) => ({ ...p, issuer: e.target.value }))}
                  placeholder="e.g. NVIDIA Deep Learning Institute"
                  required
                />
                <FormInput
                  label="Year Issued"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="e.g. 2023"
                />
              </div>

              <FormInput
                label="Credential URL / Verification Link"
                value={formData.credential_url}
                onChange={(e) => setFormData((p) => ({ ...p, credential_url: e.target.value }))}
                placeholder="https://courses.nvidia.com/..."
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
                  {saving ? 'Saving...' : editingItem ? 'Update Credential' : 'Save Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Credential"
        message="Are you sure you want to delete this certification/membership record?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
