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
      <label className="block text-xs font-semibold text-zinc-300">
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
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-900 border transition-all outline-none text-zinc-100 placeholder:text-zinc-600 ${
        error
          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
          : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500'
      } ${disabled ? 'bg-zinc-950 text-zinc-600 cursor-not-allowed border-zinc-900' : ''}`}
    />
    {helperText && !error && <p className="text-[11px] text-zinc-500">{helperText}</p>}
    {error && <p className="text-[11px] font-medium text-rose-400">{error}</p>}
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
      <label className="block text-xs font-semibold text-zinc-300">
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
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-900 border transition-all outline-none resize-y text-zinc-100 placeholder:text-zinc-600 ${
        error
          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
          : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500'
      }`}
    />
    {helperText && !error && <p className="text-[11px] text-zinc-500">{helperText}</p>}
    {error && <p className="text-[11px] font-medium text-rose-400">{error}</p>}
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
      <label className="block text-xs font-semibold text-zinc-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <select
      name={name}
      value={value ?? ''}
      onChange={onChange}
      required={required}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-900 border transition-all outline-none text-zinc-100 cursor-pointer ${
        error
          ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
          : 'border-zinc-800 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500'
      }`}
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-zinc-900 text-zinc-100">
          {opt.label ?? opt}
        </option>
      ))}
    </select>
    {helperText && !error && <p className="text-[11px] text-zinc-500">{helperText}</p>}
    {error && <p className="text-[11px] font-medium text-rose-400">{error}</p>}
  </div>
);

export const ToggleSwitch = ({
  label,
  description = '',
  checked = false,
  onChange,
}) => (
  <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60">
    <div className="space-y-0.5 pr-4">
      <div className="text-xs font-semibold text-zinc-200">{label}</div>
      {description && <div className="text-[11px] text-zinc-400">{description}</div>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-zinc-200' : 'bg-zinc-800'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
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
      {label && <label className="block text-xs font-semibold text-zinc-300">{label}</label>}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-zinc-400 hover:text-rose-400 cursor-pointer"
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
            className="w-full text-sm bg-transparent outline-none text-zinc-100 placeholder:text-zinc-600"
          />
          {inputVal.trim() && (
            <button
              type="button"
              onClick={addCurrentInput}
              className="p-1 text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {helperText && <p className="text-[11px] text-zinc-500">{helperText}</p>}
    </div>
  );
};
