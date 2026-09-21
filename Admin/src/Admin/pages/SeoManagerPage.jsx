import React, { useState, useEffect } from 'react';
import { Globe, Save } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { FormInput, FormTextarea } from '../components/FormControls';
import { MediaUploader } from '../components/MediaUploader';

export const SeoManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [formData, setFormData] = useState({
    meta_title: 'Dr. Swati Vijay Shinde | Dean MIS & Professor | PCCOE Pune',
    meta_description: 'Official academic portfolio of Dr. Swati Vijay Shinde. Dean - Management Information System, Professor in Computer Engineering at Pimpri Chinchwad College of Engineering (PCCoE), Pune.',
    keywords: 'Dr. Swati Vijay Shinde, Swati Shinde, PCCoE Pune, Dean MIS, Computer Engineering Professor, Artificial Intelligence, Machine Learning, Deep Learning, CerviTester, SPPU',
    og_title: 'Dr. Swati Vijay Shinde | Academic & Research Portfolio',
    og_description: 'Dean - MIS & Professor in Computer Engineering at PCCoE Pune. 25 years experience, Principal Investigator for DST CerviTester.',
    og_image_url: '/dr-swati-shinde.jpg',
    twitter_title: 'Dr. Swati Vijay Shinde | Academic Portfolio',
    twitter_description: 'Dean - MIS & Professor in Computer Engineering at PCCoE Pune.',
    canonical_url: 'https://swatishinde.vercel.app/',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    portfolioService.seo.get(true).then((res) => {
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
    const { error } = await portfolioService.seo.save(formData);
    setSaving(false);
    if (!error) {
      if (formData.meta_title) {
        document.title = formData.meta_title;
      }
      showToast('SEO settings saved and published successfully!');
      triggerRefresh();
    } else {
      showToast('Failed to save SEO: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <div className="w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading SEO settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-zinc-300" /> Search Engine Optimization (SEO) & Social Sharing
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Optimize Google search indexing, page title tags, meta descriptions, Open Graph preview image, and social cards.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2 bg-zinc-100 hover:bg-white text-black text-xs font-black rounded-xl transition-all cursor-pointer shadow-lg active:scale-98"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save SEO'}
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Primary Meta Tags
          </h2>

          <FormInput
            label="Browser Page Title (<title>)"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleChange}
            required
          />

          <FormTextarea
            label="Meta Description (<meta name='description'>)"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            rows={3}
            required
          />

          <FormTextarea
            label="Meta Keywords (comma-separated)"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            rows={2}
          />

          <FormInput
            label="Canonical URL"
            name="canonical_url"
            value={formData.canonical_url}
            onChange={handleChange}
            placeholder="https://swatishinde.vercel.app/"
          />
        </div>

        <div className="pt-6 border-t border-zinc-800/80 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Open Graph & Social Media Preview Cards
          </h2>

          <FormInput
            label="Open Graph Title (og:title)"
            name="og_title"
            value={formData.og_title}
            onChange={handleChange}
          />

          <FormTextarea
            label="Open Graph Description (og:description)"
            name="og_description"
            value={formData.og_description}
            onChange={handleChange}
            rows={2}
          />

          <MediaUploader
            label="Open Graph Social Preview Banner / Image"
            value={formData.og_image_url}
            onChange={(url) => setFormData((p) => ({ ...p, og_image_url: url }))}
            folder="general"
          />
        </div>
      </div>
    </div>
  );
};
