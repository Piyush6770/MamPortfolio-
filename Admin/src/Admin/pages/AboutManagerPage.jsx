import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, UserCheck } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { FormInput, FormTextarea, TagInput, ToggleSwitch } from '../components/FormControls';
import { facultyData } from '../../data/facultyData';

export const AboutManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [formData, setFormData] = useState({
    heading: `About ${facultyData.name}`,
    bio: facultyData.bio,
    full_bio_paragraphs: facultyData.fullBioParagraphs || [],
    research_interests: facultyData.researchInterests || [],
    courses_taught: facultyData.coursesTaught || [],
    total_experience: facultyData.totalExperience,
    approved_experience: facultyData.approvedExperience,
    citations_count: facultyData.citationsGoogleScholar,
    h_index: facultyData.hIndexGoogleScholar,
    i10_index: facultyData.i10IndexGoogleScholar,
    scopus_pubs: facultyData.totalScopusPubs,
    scopus_citations: facultyData.scopusCitations,
    scopus_h_index: facultyData.scopusHIndex,
    is_visible: true,
    publish_status: 'published',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    portfolioService.about.get(true).then((res) => {
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

  const handleAddParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      full_bio_paragraphs: [...(prev.full_bio_paragraphs || []), ''],
    }));
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...(formData.full_bio_paragraphs || [])];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, full_bio_paragraphs: updated }));
  };

  const handleRemoveParagraph = (index) => {
    const updated = formData.full_bio_paragraphs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, full_bio_paragraphs: updated }));
  };

  const handleSave = async (status = 'published') => {
    setSaving(true);
    const payload = { ...formData, publish_status: status };
    const { error } = await portfolioService.about.save(payload);
    setSaving(false);
    if (!error) {
      setFormData(payload);
      showToast(status === 'published' ? 'About section published successfully!' : 'About saved as draft!');
      triggerRefresh();
    } else {
      showToast('Failed to save about section: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 dark:text-zinc-500">
        <div className="w-8 h-8 border-2 border-slate-400 dark:border-zinc-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span className="text-xs">Loading About section configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-slate-600 dark:text-zinc-300" /> About & Bio Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Manage comprehensive academic biography, citation statistics, research interests, and courses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-zinc-800"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-xs font-black rounded-xl transition-all cursor-pointer shadow-md active:scale-98"
          >
            <Save className="w-4 h-4" /> {saving ? 'Publishing...' : 'Publish About'}
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-6 transition-colors duration-150">
        <ToggleSwitch
          label="Section Visibility"
          description="Display or hide the About & Bio section on public website pages."
          checked={formData.is_visible}
          onChange={(val) => setFormData((prev) => ({ ...prev, is_visible: val }))}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FormInput
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <FormTextarea
              label="Primary Summary Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <FormInput
            label="Total Career Experience"
            name="total_experience"
            value={formData.total_experience}
            onChange={handleChange}
            placeholder="e.g. 25 Years"
          />

          <FormInput
            label="Approved Experience"
            name="approved_experience"
            value={formData.approved_experience}
            onChange={handleChange}
            placeholder="e.g. 21 Years"
          />
        </div>

        {/* Citation & Scopus Stats */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800/80 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Citation Metrics & Scholarly Profiles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <FormInput
              label="Google Scholar Citations"
              name="citations_count"
              type="number"
              value={formData.citations_count}
              onChange={handleChange}
            />
            <FormInput
              label="Google Scholar h-index"
              name="h_index"
              type="number"
              value={formData.h_index}
              onChange={handleChange}
            />
            <FormInput
              label="Google Scholar i10-index"
              name="i10_index"
              type="number"
              value={formData.i10_index}
              onChange={handleChange}
            />
            <FormInput
              label="Total Scopus Publications"
              name="scopus_pubs"
              type="number"
              value={formData.scopus_pubs}
              onChange={handleChange}
            />
            <FormInput
              label="Scopus Citations"
              name="scopus_citations"
              type="number"
              value={formData.scopus_citations}
              onChange={handleChange}
            />
            <FormInput
              label="Scopus h-index"
              name="scopus_h_index"
              type="number"
              value={formData.scopus_h_index}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Tags & Lists */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800/80 space-y-5">
          <TagInput
            label="Research Interests & Specializations"
            tags={formData.research_interests || []}
            onChange={(tags) => setFormData((prev) => ({ ...prev, research_interests: tags }))}
            placeholder="Add specialization..."
            helperText="Press Enter after each domain (e.g. AI/ML, Computer Vision, Soft Computing)"
          />

          <TagInput
            label="Courses & Subjects Taught"
            tags={formData.courses_taught || []}
            onChange={(tags) => setFormData((prev) => ({ ...prev, courses_taught: tags }))}
            placeholder="Add course name..."
            helperText="Press Enter after each course (e.g. Machine Learning, Soft Computing, Data Structures)"
          />
        </div>

        {/* Detailed Bio Paragraphs */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Full Read-More Biography Paragraphs
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-500">
                These paragraphs appear inside the interactive "Read Full Biography" modal.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-zinc-200 dark:hover:text-white px-3 py-1.5 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Paragraph
            </button>
          </div>

          <div className="space-y-3">
            {(formData.full_bio_paragraphs || []).map((para, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Paragraph {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(index)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 cursor-pointer"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className="w-full text-xs p-3 rounded-lg bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 outline-none focus:border-slate-500 dark:focus:border-zinc-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600 shadow-2xs"
                  placeholder="Enter biography paragraph details..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
