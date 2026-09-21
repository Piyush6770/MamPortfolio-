import React, { useState, useEffect } from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';

export const SectionsManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSections = async () => {
    setLoading(true);
    const { data } = await portfolioService.sections.getAll(true);
    setSections(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleToggle = async (section) => {
    const nextVal = section.is_visible === false;
    await portfolioService.sections.update(section.id, { is_visible: nextVal });
    loadSections();
    triggerRefresh();
    showToast(`Section "${section.label}" ${nextVal ? 'enabled' : 'hidden'}!`);
  };

  const handleReorder = async (reordered) => {
    await portfolioService.sections.reorder(reordered);
    loadSections();
    triggerRefresh();
    showToast('Section order updated!');
  };

  const columns = [
    { key: 'label', label: 'Section Name' },
    { key: 'section_key', label: 'Identifier' },
    {
      key: 'is_visible',
      label: 'Visibility Status',
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${val !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          {val !== false ? 'Enabled on Portfolio' : 'Disabled / Hidden'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" /> Major Section Visibility & Layout
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Enable or disable full major sections on the public site (Hero, About, Research, Patents, Projects, Guidance, Books, Talks, Gallery, Contact).
        </p>
      </div>

      <DataTable
        title="Portfolio Sections"
        subtitle="Toggle sections on/off with instant public reflection"
        items={sections}
        columns={columns}
        searchKey="label"
        loading={loading}
        onReorder={handleReorder}
        onToggleVisibility={handleToggle}
      />
    </div>
  );
};
