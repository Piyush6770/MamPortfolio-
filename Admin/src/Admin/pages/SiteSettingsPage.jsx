import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { seedService } from '../services/seedService';
import { useAdminData } from '../context/AdminDataContext';
import { FormInput, FormTextarea } from '../components/FormControls';
import { MediaUploader } from '../components/MediaUploader';
import { facultyData } from '../../data/facultyData';

export const SiteSettingsPage = () => {
  const { showToast, triggerRefresh } = useAdminData();

  const [formData, setFormData] = useState({
    site_name: facultyData.name,
    owner_name: facultyData.name,
    title: facultyData.title,
    tagline: facultyData.primaryDesignation,
    profile_image_url: '/dr-swati-shinde.jpg',
    department: facultyData.department,
    institution: facultyData.institution,
    address: facultyData.address,
    availability_status: 'Available for Research Mentorship & Expert Keynotes',
    favicon_url: '',
    publish_status: 'published',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => {
    portfolioService.siteSettings.get(true).then((res) => {
      if (res.data) {
        setFormData(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await portfolioService.siteSettings.save(formData);
    setSaving(false);
    if (!error) {
      showToast('Site settings saved successfully!');
      triggerRefresh();
    } else {
      showToast('Failed to save settings: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm('Are you sure you want to synchronize all default faculty data (Projects, Publications, Patents, Experience, Guidance, Books, etc.) into the data store?')) {
      return;
    }
    setSyncing(true);
    const res = await seedService.seedAllData((status) => setSyncStatus(status));
    setSyncing(false);
    setSyncStatus('');
    if (res.success) {
      showToast('All initial data synchronized successfully!');
      triggerRefresh();
    } else {
      showToast('Failed to sync data: ' + (res.error?.message || 'Error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 dark:text-zinc-500">
        <div className="w-8 h-8 border-2 border-slate-400 dark:border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> Global Site Settings & Database Sync
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Configure website name, primary affiliations, profile photos, and 1-click database synchronization.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Sync Banner Box */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm dark:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            1-Click Initial Faculty Data Synchronization
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Synchronizes all standard curriculum vitae data (54 publications, 15 patents, 11 projects, 7 books, student scholars, and gallery moments) into the system data tables.
          </p>
        </div>

        <button
          onClick={handleSeedData}
          disabled={syncing}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-zinc-700 transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? syncStatus || 'Syncing...' : 'Sync Initial Data Now'}
        </button>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Owner / Faculty Full Name"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Academic Title & Honors"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Professor & Academic Leader"
            required
          />

          <div className="md:col-span-2">
            <FormInput
              label="Primary Designation & Dean Leadership"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Dean - Management Information System & Professor in Computer Engineering"
              required
            />
          </div>

          <FormInput
            label="Academic Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department of Computer Engineering"
            required
          />

          <FormInput
            label="Institution / University"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Pimpri Chinchwad College of Engineering (PCCoE), Pune"
            required
          />

          <div className="md:col-span-2">
            <FormTextarea
              label="Official Campus Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <FormInput
              label="Public Availability Status Badge"
              name="availability_status"
              value={formData.availability_status}
              onChange={handleChange}
              placeholder="e.g. Available for Research Mentorship & Expert Keynotes"
            />
          </div>

          <div className="md:col-span-2 pt-4 border-t border-slate-200 dark:border-zinc-800/80">
            <MediaUploader
              label="Global Profile & Faculty Portrait"
              value={formData.profile_image_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, profile_image_url: url }))}
              folder="profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
