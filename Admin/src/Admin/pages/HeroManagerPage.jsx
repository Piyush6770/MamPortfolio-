import React, { useState, useEffect } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { FormInput, FormTextarea, ToggleSwitch } from '../components/FormControls';
import { MediaUploader } from '../components/MediaUploader';
import { facultyData } from '../../data/facultyData';

export const HeroManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [formData, setFormData] = useState({
    greeting: 'Welcome to the Academic Portfolio of',
    name: facultyData.name,
    title: facultyData.primaryDesignation,
    subtitle: `${facultyData.department}, ${facultyData.institution}`,
    description: facultyData.bio,
    badge_text: 'DST PI · NVIDIA DLI Ambassador · Ph.D. Guide',
    primary_cta_text: 'Explore Research',
    primary_cta_url: '#/research',
    secondary_cta_text: 'Academic Journey',
    secondary_cta_url: '#/journey',
    hero_image_url: '/dr-swati-shinde.jpg',
    is_visible: true,
    publish_status: 'published',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    portfolioService.hero.get(true).then((res) => {
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

  const handleSave = async (status = 'published') => {
    setSaving(true);
    const payload = { ...formData, publish_status: status };
    const { error } = await portfolioService.hero.save(payload);
    setSaving(false);
    if (!error) {
      setFormData(payload);
      showToast(status === 'published' ? 'Hero section published successfully!' : 'Hero saved as draft!');
      triggerRefresh();
    } else {
      showToast('Failed to save hero section: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading Hero configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Hero Section Manager
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure greeting, designations, introductory bio, action buttons, and hero portrait.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-zinc-800"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-zinc-100 hover:bg-white text-black text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg active:scale-98"
          >
            <Save className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish Hero'}
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <ToggleSwitch
          label="Section Visibility"
          description="Display or hide the Hero banner on the public portfolio homepage."
          checked={formData.is_visible}
          onChange={(val) => setFormData((prev) => ({ ...prev, is_visible: val }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Greeting Pre-Header"
            name="greeting"
            value={formData.greeting}
            onChange={handleChange}
            placeholder="Welcome to the Academic Portfolio of"
          />

          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Primary Designation & Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Department & Institute Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Highlight Badge Text"
              name="badge_text"
              value={formData.badge_text}
              onChange={handleChange}
              placeholder="e.g. DST PI · NVIDIA DLI Ambassador · Ph.D. Guide"
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              label="Introduction Summary / Short Bio"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <FormInput
            label="Primary CTA Text"
            name="primary_cta_text"
            value={formData.primary_cta_text}
            onChange={handleChange}
          />

          <FormInput
            label="Primary CTA URL / Target"
            name="primary_cta_url"
            value={formData.primary_cta_url}
            onChange={handleChange}
          />

          <FormInput
            label="Secondary CTA Text"
            name="secondary_cta_text"
            value={formData.secondary_cta_text}
            onChange={handleChange}
          />

          <FormInput
            label="Secondary CTA URL / Target"
            name="secondary_cta_url"
            value={formData.secondary_cta_url}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <MediaUploader
              label="Hero Portrait Image"
              value={formData.hero_image_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, hero_image_url: url }))}
              folder="profile"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
