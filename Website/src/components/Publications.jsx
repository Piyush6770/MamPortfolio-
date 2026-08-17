import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { publications } from '../data/publications';
import { Search, FileText, BookOpen, Mic2, BookMarked, ArrowRight, X } from 'lucide-react';

const TABS = [
  { key: 'all',       label: 'All',           icon: FileText },
  { key: 'journal',   label: 'Journals',      icon: BookOpen },
  { key: 'conference',label: 'Conferences',   icon: Mic2 },
  { key: 'chapter',   label: 'Book Chapters', icon: BookMarked },
];

const INDEXING_COLORS = {
  SCI: 'badge-purple',
  SCIE: 'badge-blue',
  Scopus: 'badge-slate',
  'IEEE Xplore': 'badge-slate',
  'ACM DL': 'badge-slate',
};

const SHOW = 8;

function getIndexingClass(indexing) {
  return INDEXING_COLORS[indexing] || 'badge-slate';
}

function getTypeLabel(type) {
  if (type === 'journal') return { label: 'Journal', cls: 'badge-blue' };
  if (type === 'conference') return { label: 'Conference', cls: 'badge-slate' };
  return { label: 'Book Chapter', cls: 'badge-amber' };
}

const counts = {
  all: publications.length,
  journal: publications.filter(p => p.type === 'journal').length,
  conference: publications.filter(p => p.type === 'conference').length,
  chapter: publications.filter(p => p.type === 'chapter').length,
};

export default function Publications() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [yearFilter, setYearFilter] = useState('');

  const allYears = useMemo(() => {
    const yrs = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
    return yrs;
  }, []);

  const filtered = useMemo(() => {
    let result = publications;
    if (activeTab !== 'all') result = result.filter(p => p.type === activeTab);
    if (yearFilter) result = result.filter(p => p.year === Number(yearFilter));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) ||
             p.authors.toLowerCase().includes(q) ||
             p.venue.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => b.year - a.year);
  }, [activeTab, search, yearFilter]);

  const displayed = showAll ? filtered : filtered.slice(0, SHOW);

  const clearSearch = () => { setSearch(''); setShowAll(false); };

  return (
    <section id="publications" className="section bg-white" aria-label="Publications" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="section-eyebrow mb-3">Academic Publications</p>
            <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Publications</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-blue">54 Journals</span>
            <span className="badge badge-slate">82 Conferences</span>
            <span className="badge badge-amber">13 Book Chapters</span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`pub-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.key); setShowAll(false); }}
                aria-pressed={activeTab === tab.key}
                aria-label={`Filter: ${tab.label} (${counts[tab.key]})`}
              >
                <tab.icon size={13} className="inline mr-1" aria-hidden="true" />
                {tab.label}
                <span className="ml-1.5 opacity-70 text-[11px]">{counts[tab.key]}</span>
              </button>
            ))}
          </div>

          {/* Search + Year */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowAll(false); }}
                placeholder="Search by title, author or venue…"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[0.88rem] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                aria-label="Search publications"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setShowAll(false); }}
              className="px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[0.88rem] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all min-w-[120px]"
              aria-label="Filter by year"
            >
              <option value="">All Years</option>
              {allYears.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        {(search || yearFilter) && (
          <p className="text-[0.82rem] text-[#475569] mb-4">
            Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {yearFilter ? ` for ${yearFilter}` : ''}
            {search ? ` matching "${search}"` : ''}
          </p>
        )}

        {/* Publication cards */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayed.length === 0 && (
              <motion.p
                className="text-center text-[#475569] py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No publications match your filter.
              </motion.p>
            )}
            {displayed.map((pub, i) => {
              const typeInfo = getTypeLabel(pub.type);
              return (
                <motion.article
                  key={pub.id}
                  className="card p-5 hover:border-[#BFDBFE]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: Math.min(i, 7) * 0.04 }}
                  aria-label={`Publication: ${pub.title}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className={`badge ${typeInfo.cls}`}>{typeInfo.label}</span>
                        <span className={`badge ${getIndexingClass(pub.indexing)}`}>{pub.indexing}</span>
                        <span className="badge badge-slate">{pub.year}</span>
                      </div>
                      <h3 className="font-semibold text-[#0F172A] text-[0.9rem] leading-snug mb-1" style={{ fontFamily: 'Manrope' }}>
                        {pub.title}
                      </h3>
                      <p className="text-[#475569] text-[0.8rem]">{pub.authors}</p>
                      <p className="text-[#2563EB] text-[0.8rem] font-medium mt-0.5 italic">{pub.venue}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show more */}
        {filtered.length > SHOW && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="btn-outline"
              aria-label={showAll ? 'Show fewer publications' : `Show all ${filtered.length} publications`}
            >
              {showAll ? 'Show Less' : `View All ${filtered.length} Publications`}
              <ArrowRight size={16} className={`transition-transform duration-200 ${showAll ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
