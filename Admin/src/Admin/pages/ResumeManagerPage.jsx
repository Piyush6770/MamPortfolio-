import React, { useState, useEffect } from 'react';
import { FileDown, FileText, CheckCircle2, Download, Trash2, ExternalLink } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { MediaUploader } from '../components/MediaUploader';
import { FormInput } from '../components/FormControls';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const ResumeManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFileUrl, setNewFileUrl] = useState('');
  const [fileName, setFileName] = useState('Dr_Swati_Shinde_CV_2026.pdf');
  const [versionLabel, setVersionLabel] = useState('Official Profile CV (v2.4)');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadResumes = async () => {
    setLoading(true);
    const { data } = await portfolioService.resumes.getAll(true);
    setResumes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!newFileUrl) {
      showToast('Please upload or select a PDF document first.', 'warning');
      return;
    }

    setSaving(true);
    const payload = {
      file_name: fileName,
      file_url: newFileUrl,
      version_label: versionLabel,
      file_size_kb: 340,
      is_active: resumes.length === 0,
      created_at: new Date().toISOString(),
    };

    const { error } = await portfolioService.resumes.create(payload);
    setSaving(false);
    if (!error) {
      showToast('Resume uploaded and recorded!');
      setNewFileUrl('');
      loadResumes();
      triggerRefresh();
    } else {
      showToast('Failed to save resume: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const handleSetActive = async (resumeId) => {
    for (const r of resumes) {
      await portfolioService.resumes.update(r.id, { is_active: r.id === resumeId });
    }
    showToast('Active resume updated for public download!');
    loadResumes();
    triggerRefresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const { error } = await portfolioService.resumes.delete(deleteTarget.id);
    setSaving(false);
    if (!error) {
      showToast('Resume deleted!');
      setDeleteTarget(null);
      loadResumes();
      triggerRefresh();
    } else {
      showToast('Failed to delete: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FileDown className="w-5 h-5 text-zinc-300" /> Resume & Curriculum Vitae Management
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Upload updated PDF resume documents, tag version numbers, and choose the active CV for public download.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-white">
          Upload New Resume Version (PDF)
        </h2>

        <form onSubmit={handleUploadResume} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Document Label / Title"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g. Dr_Swati_Shinde_CV_2026.pdf"
              required
            />
            <FormInput
              label="Version Tag"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              placeholder="e.g. Official Profile CV (v2.4)"
              required
            />
          </div>

          <MediaUploader
            label="Upload PDF Document"
            value={newFileUrl}
            onChange={(url) => setNewFileUrl(url)}
            accept=".pdf,application/pdf"
            folder="resumes"
            helperText="Upload PDF file (Max 15MB) or enter existing file path"
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || !newFileUrl}
              className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-black text-xs font-black rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {saving ? 'Uploading...' : 'Save & Record CV Document'}
            </button>
          </div>
        </form>
      </div>

      {/* Resume History List */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white">
          Uploaded Resume Versions ({resumes.length})
        </h2>

        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-500">Loading CV versions...</div>
        ) : resumes.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">No resumes uploaded yet.</div>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  r.is_active
                    ? 'bg-zinc-900 border-zinc-700 shadow-sm ring-1 ring-zinc-700'
                    : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <span>{r.file_name || r.title || 'Curriculum Vitae'}</span>
                      {r.is_active && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-900/60">
                          <CheckCircle2 className="w-3 h-3" /> Active Public Download
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {r.version_label || r.version_tag || 'v1.0'} · {new Date(r.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={r.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title="View / Download PDF"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {!r.is_active && (
                    <button
                      onClick={() => handleSetActive(r.id)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg border border-zinc-700 cursor-pointer transition-colors"
                    >
                      Set as Active CV
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTarget(r)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete version"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Resume Version"
        message="Are you sure you want to delete this resume file record?"
        itemName={deleteTarget?.file_name || deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={saving}
      />
    </div>
  );
};
