import React, { useState, useEffect } from 'react';
import { MenuSquare, Save } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { useAdminData } from '../context/AdminDataContext';
import { DataTable } from '../components/DataTable';

const defaultNav = [
  { id: 'home', section_key: 'home', label: 'Home', display_order: 1, is_visible: true },
  { id: 'about', section_key: 'about', label: 'About', display_order: 2, is_visible: true },
  { id: 'research', section_key: 'research', label: 'Research Areas', display_order: 3, is_visible: true },
  { id: 'publications', section_key: 'publications', label: 'Publications', display_order: 4, is_visible: true },
  { id: 'patents', section_key: 'patents', label: 'Patents & IPR', display_order: 5, is_visible: true },
  { id: 'projects', section_key: 'projects', label: 'Projects & Grants', display_order: 6, is_visible: true },
  { id: 'journey', section_key: 'journey', label: 'Journey & CV', display_order: 7, is_visible: true },
  { id: 'guidance', section_key: 'guidance', label: 'Mentorship', display_order: 8, is_visible: true },
  { id: 'academic', section_key: 'academic', label: 'Academic Profile', display_order: 9, is_visible: true },
  { id: 'books', section_key: 'books', label: 'Books & Chapters', display_order: 10, is_visible: true },
  { id: 'talks', section_key: 'talks', label: 'Talks & Events', display_order: 11, is_visible: true },
  { id: 'gallery', section_key: 'gallery', label: 'Gallery', display_order: 12, is_visible: true },
  { id: 'contact', section_key: 'contact', label: 'Contact', display_order: 13, is_visible: true },
];

export const NavigationManagerPage = () => {
  const { showToast, triggerRefresh } = useAdminData();
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNav = async () => {
    setLoading(true);
    const { data } = await portfolioService.sections.getAll(true);
    if (data && data.length > 0) {
      setNavItems(data);
    } else {
      setNavItems(defaultNav);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadNav();
  }, []);

  const handleReorder = async (reordered) => {
    await portfolioService.sections.reorder(reordered);
    loadNav();
    triggerRefresh();
    showToast('Navigation menu order updated!');
  };

  const handleToggleVisibility = async (item) => {
    const nextVal = item.is_visible === false;
    await portfolioService.sections.update(item.id, { is_visible: nextVal });
    loadNav();
    triggerRefresh();
    showToast(`Navigation item "${item.label}" ${nextVal ? 'enabled' : 'hidden'}!`);
  };

  const columns = [
    { key: 'label', label: 'Navigation Link Label' },
    { key: 'section_key', label: 'Page / Target Anchor' },
    {
      key: 'is_visible',
      label: 'Status',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${val !== false ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : 'bg-zinc-800 text-zinc-400'}`}>
          {val !== false ? 'Visible in Menu' : 'Hidden'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <MenuSquare className="w-5 h-5 text-indigo-400" /> Navigation Menu Manager
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Reorder navigation links or toggle visibility in the public header and mobile dropdown menus.
        </p>
      </div>

      <DataTable
        title="Main Header Navigation"
        subtitle="Use the Up/Down arrows to change link hierarchy"
        items={navItems}
        columns={columns}
        searchKey="label"
        loading={loading}
        onReorder={handleReorder}
        onToggleVisibility={handleToggleVisibility}
      />
    </div>
  );
};
