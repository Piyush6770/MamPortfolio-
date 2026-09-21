import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const FormInput = ({
  label,
  name,
  value = '',
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
  disabled = false,
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border transition-all outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 ${
        error
          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
          : 'border-slate-200 dark:border-zinc-800 focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500'
      } ${disabled ? 'bg-slate-100 dark:bg-zinc-950 text-slate-400 dark:text-zinc-600 cursor-not-allowed border-slate-200 dark:border-zinc-900' : 'shadow-2xs'}`}
    />
    {helperText && !error && <p className="text-[11px] text-slate-500 dark:text-zinc-500">{helperText}</p>}
    {error && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{error}</p>}
  </div>
);

export const FormTextarea = ({
  label,
  name,
  value = '',
  onChange,
  rows = 4,
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <textarea
      name={name}
      value={value ?? ''}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border transition-all outline-none resize-y text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 ${
        error
          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
          : 'border-slate-200 dark:border-zinc-800 focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500 shadow-2xs'
      }`}
    />
    {helperText && !error && <p className="text-[11px] text-slate-500 dark:text-zinc-500">{helperText}</p>}
    {error && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{error}</p>}
  </div>
);

export const FormSelect = ({
  label,
  name,
  value = '',
  onChange,
  options = [],
  required = false,
  error = '',
  helperText = '',
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <select
      name={name}
      value={value ?? ''}
      onChange={onChange}
      required={required}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border transition-all outline-none text-slate-900 dark:text-zinc-100 cursor-pointer shadow-2xs ${
        error
          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
          : 'border-slate-200 dark:border-zinc-800 focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500'
      }`}
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">
          {opt.label ?? opt}
        </option>
      ))}
    </select>
    {helperText && !error && <p className="text-[11px] text-slate-500 dark:text-zinc-500">{helperText}</p>}
    {error && <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{error}</p>}
  </div>
);

export const ToggleSwitch = ({
  label,
  description = '',
  checked = false,
  onChange,
}) => (
  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-900/60 shadow-2xs">
    <div className="space-y-0.5 pr-4">
      <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{label}</div>
      {description && <div className="text-[11px] text-slate-500 dark:text-zinc-400">{description}</div>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-slate-900 dark:bg-zinc-200' : 'bg-slate-300 dark:bg-zinc-800'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5 bg-white dark:bg-black' : 'translate-x-0 bg-white dark:bg-zinc-400'
        }`}
      />
    </button>
  </div>
);

export const TagInput = ({
  label,
  tags = [],
  onChange,
  placeholder = 'Type and press Enter...',
  helperText = 'Add tags and press Enter to save',
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputVal.trim();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInputVal('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const addCurrentInput = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputVal('');
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">{label}</label>}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-500 dark:focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-slate-500 dark:focus-within:ring-zinc-500 shadow-2xs">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-[140px]">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="w-full text-sm bg-transparent outline-none text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={addCurrentInput}
              className="p-1 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {helperText && <p className="text-[11px] text-slate-500 dark:text-zinc-500">{helperText}</p>}
    </div>
  );
};
