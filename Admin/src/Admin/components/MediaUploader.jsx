import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, Link2 } from 'lucide-react';
import { storageService } from '../services/storageService';

export const MediaUploader = ({
  value = '',
  onChange,
  folder = 'general',
  label = 'Upload Image',
  accept = 'image/*',
  maxSizeMB = 10,
  helperText = 'Supported formats: PNG, JPG, WEBP, SVG (Max 10MB) or enter URL',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef(null);

  const isImage = value && (value.startsWith('data:image') || /\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(value) || value.startsWith('/'));
  const isPDF = value && /\.pdf($|\?)/i.test(value);

  const handleFile = async (file) => {
    if (!file) return;

    setError('');
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setError(`File size is ${sizeInMB.toFixed(1)}MB, exceeding the limit of ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true);
    const { url, error: uploadErr } = await storageService.uploadFile(file, folder);

    if (uploadErr) {
      setError(uploadErr.message || 'Failed to upload file.');
      setUploading(false);
      return;
    }

    if (url) {
      onChange(url);
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = async () => {
    if (value) {
      await storageService.deleteFile(value);
      onChange('');
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setCustomUrl('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-bold text-zinc-300">{label}</label>}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Link2 className="w-3 h-3" /> {showUrlInput ? 'Hide URL Input' : 'Paste Image URL'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
          <input
            type="text"
            placeholder="e.g. /dr-swati-shinde.jpg or https://..."
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-lg cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {value ? (
        <div className="relative group border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/90 p-4 transition-all">
          <div className="flex items-center gap-4">
            {isImage ? (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 shadow-sm">
                <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
              </div>
            ) : isPDF ? (
              <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-rose-950/60 text-rose-400 shrink-0 border border-rose-800">
                <FileText className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-zinc-800 text-zinc-300 shrink-0">
                <ImageIcon className="w-10 h-10" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Ready & Linked
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-full font-mono">
                {value.startsWith('data:image') ? 'Base64 Embedded Image' : value}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-zinc-300 hover:text-white hover:underline cursor-pointer"
                >
                  Replace File
                </button>
                <span className="text-zinc-600">·</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-zinc-500 bg-zinc-800/80'
              : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-300 mb-3 border border-zinc-700">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-zinc-300" />
            )}
          </div>

          <div className="text-sm font-semibold text-zinc-200">
            {uploading ? 'Processing photo...' : 'Click to select photo or drag & drop'}
          </div>
          <p className="text-xs text-zinc-500 mt-1">{helperText}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};
