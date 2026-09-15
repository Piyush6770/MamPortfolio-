import { useState, useMemo } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { journalPublications, conferencePublications, publicationStats } from '../data/publications';
import { Search, Filter, Award, Copy, Check, ChevronDown } from 'lucide-react';

export const PublicationsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [visibleCount, setVisibleCount] = useState(15);
  const [copiedId, setCopiedId] = useState(null);

  const allPubs = useMemo(() =>
    [...journalPublications, ...conferencePublications].sort((a, b) => b.year - a.year), []);

  const filteredPubs = useMemo(() => allPubs.filter(pub => {
    if (selectedCategory === 'journal' && pub.type !== 'journal') return false;
    if (selectedCategory === 'conference' && pub.type !== 'conference') return false;
    if (selectedCategory === 'sci' && !pub.indexing.some(i => i.includes('SCI') || i.includes('SCIE'))) return false;
    if (selectedCategory === 'scopus' && !pub.indexing.some(i => i.includes('Scopus'))) return false;
    if (selectedYear !== 'all' && pub.year.toString() !== selectedYear) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return pub.title.toLowerCase().includes(q) || pub.authors.toLowerCase().includes(q) || pub.venue.toLowerCase().includes(q);
    }
    return true;
  }), [allPubs, selectedCategory, selectedYear, searchTerm]);

  const availableYears = useMemo(() =>
    Array.from(new Set(allPubs.map(p => p.year))).sort((a, b) => b - a), [allPubs]);

  const copyCitation = (pub) => {
    navigator.clipboard.writeText(`${pub.authors} (${pub.year}). "${pub.title}". ${pub.venue}.`);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="publications" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader
          badge="SCHOLARLY PUBLICATIONS"
          title="Research Publications"
          subtitle="Peer-reviewed journals, SCI/SCIE indexed research, and Scopus indexed conference proceedings."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { value: publicationStats.totalJournals, label: 'International Journals' },
            { value: publicationStats.totalConferences, label: 'Conference Papers' },
            { value: `${publicationStats.scopusIndexed}+`, label: 'Scopus Indexed' },
            { value: publicationStats.bestPaperAwards, label: 'Best Paper Awards' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-lg p-4 text-center border-t-2 border-blue-600 hover-lift">
              <div className="text-2xl font-bold text-[#1e3a5f] dark:text-blue-300">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by title, author, or journal..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="md:col-span-4 relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer appearance-none">
                <option value="all">All Years</option>
                {availableYears.map(y => <option key={y} value={y.toString()}>Year {y}</option>)}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="text-slate-500 self-center font-bold">Type:</span>
            {[
              ['all', `All (${allPubs.length})`],
              ['sci', 'SCI/SCIE'],
              ['scopus', 'Scopus'],
              ['journal', `Journals (${journalPublications.length})`],
              ['conference', `Conferences (${conferencePublications.length})`],
            ].map(([cat, label]) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${selectedCategory === cat
                  ? 'bg-[#1e3a5f] text-white font-bold shadow'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="flex justify-between items-center mb-4 text-xs text-slate-500 font-medium">
          <span>Showing {Math.min(visibleCount, filteredPubs.length)} of {filteredPubs.length} publications</span>
          {searchTerm && <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedYear('all'); }} className="text-blue-600 hover:underline cursor-pointer">Reset</button>}
        </div>

        {/* Publication List */}
        <div className="space-y-3">
          {filteredPubs.slice(0, visibleCount).map((pub) => (
            <div key={pub.id} className="glass-card rounded-xl p-5 hover-lift flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#1e3a5f] text-white font-bold text-[10px]">{pub.year}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold text-[10px] uppercase">{pub.type}</span>
                  {pub.indexing.map((idx, i) => (
                    <span key={i} className="badge-accent">{idx}</span>
                  ))}
                  {pub.award && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                      <Award className="w-3 h-3" />{pub.award}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug" style={{fontFamily: "'Merriweather', serif"}}>{pub.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{pub.authors}</p>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">{pub.venue}</p>
              </div>
              <button onClick={() => copyCitation(pub)}
                className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-400 transition-all cursor-pointer shrink-0">
                {copiedId === pub.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-blue-500" />}
                {copiedId === pub.id ? 'Copied' : 'Cite'}
              </button>
            </div>
          ))}
        </div>

        {visibleCount < filteredPubs.length && (
          <div className="mt-8">
            <button onClick={() => setVisibleCount(prev => prev + 15)} className="btn-primary">
              Load More ({filteredPubs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
