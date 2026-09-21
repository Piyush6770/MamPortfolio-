import { useState, useMemo } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  journalPublications as defaultJournalPublications,
  conferencePublications as defaultConferencePublications,
  publicationStats,
} from '../data/publications';
import { Search, Filter, Award, Copy, Check, ChevronDown, ExternalLink, BookOpen, Layers } from 'lucide-react';

const normalizeIndexing = (idx) => {
  if (!idx) return [];
  if (Array.isArray(idx)) return idx;
  if (typeof idx === 'string') return idx.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

export const PublicationsSection = () => {
  const { publications } = usePortfolioData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [visibleCount, setVisibleCount] = useState(15);
  const [copiedId, setCopiedId] = useState(null);

  // Combine and deduplicate publications
  const allPubs = useMemo(() => {
    const list =
      publications && publications.length > 0
        ? publications
        : [...defaultJournalPublications, ...defaultConferencePublications];

    const map = new Map();
    list.forEach((p) => {
      if (p && p.title) {
        const key = String(p.id || p.title).toLowerCase().trim();
        if (!map.has(key)) {
          map.set(key, p);
        }
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)
    );
  }, [publications]);

  // Dynamic counts
  const counts = useMemo(() => {
    let journals = 0;
    let conferences = 0;
    let scopus = 0;
    let sci = 0;

    allPubs.forEach((pub) => {
      const type = String(pub.type || '').toLowerCase();
      if (type === 'conference') {
        conferences++;
      } else {
        journals++;
      }

      const idxArr = normalizeIndexing(pub.indexing);
      if (idxArr.some((i) => String(i).toUpperCase().includes('SCOPUS') || String(i).toUpperCase().includes('IEEE'))) {
        scopus++;
      }
      if (idxArr.some((i) => String(i).toUpperCase().includes('SCI'))) {
        sci++;
      }
    });

    return { total: allPubs.length, journals, conferences, scopus, sci };
  }, [allPubs]);

  // Filtered publications
  const filteredPubs = useMemo(() => {
    return allPubs.filter((pub) => {
      if (pub.is_visible === false) return false;
      if (pub.publish_status && pub.publish_status !== 'published') return false;

      const pubType = String(pub.type || 'journal').toLowerCase();
      if (selectedCategory === 'journal' && pubType !== 'journal') return false;
      if (selectedCategory === 'conference' && pubType !== 'conference') return false;

      const indexingArr = normalizeIndexing(pub.indexing);
      if (
        selectedCategory === 'sci' &&
        !indexingArr.some((i) => String(i).toUpperCase().includes('SCI'))
      ) {
        return false;
      }
      if (
        selectedCategory === 'scopus' &&
        !indexingArr.some(
          (i) =>
            String(i).toUpperCase().includes('SCOPUS') ||
            String(i).toUpperCase().includes('IEEE')
        )
      ) {
        return false;
      }

      if (selectedYear !== 'all' && String(pub.year) !== String(selectedYear)) {
        return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const titleMatch = String(pub.title || '').toLowerCase().includes(q);
        const authorMatch = String(pub.authors || '').toLowerCase().includes(q);
        const venueMatch = String(
          pub.journal_or_conference || pub.venue || pub.journal || ''
        )
          .toLowerCase()
          .includes(q);
        const doiMatch = String(pub.doi_or_url || '').toLowerCase().includes(q);
        return titleMatch || authorMatch || venueMatch || doiMatch;
      }

      return true;
    });
  }, [allPubs, selectedCategory, selectedYear, searchTerm]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(allPubs.map((p) => p.year)))
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));
  }, [allPubs]);

  const copyCitation = (pub) => {
    const venue = pub.journal_or_conference || pub.venue || pub.journal || '';
    const pages = pub.volume_issue_pages ? `, ${pub.volume_issue_pages}` : '';
    const citationText = `${pub.authors} (${pub.year}). "${pub.title}". ${venue}${pages}.`;
    navigator.clipboard.writeText(citationText);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      id="publications"
      className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader
          badge="SCHOLARLY PUBLICATIONS"
          title="Research Publications"
          subtitle="Peer-reviewed international journals, SCI/SCIE indexed research, and IEEE/Scopus indexed proceedings."
        />

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              value: counts.journals || 37,
              label: 'International Journals',
            },
            {
              value: counts.conferences || 23,
              label: 'Conference Proceedings',
            },
            {
              value: `${counts.scopus || 45}+`,
              label: 'Scopus Indexed',
            },
            {
              value: publicationStats.bestPaperAwards || 5,
              label: 'Best Paper Awards',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-xl p-4 text-center border-t-2 border-blue-600 hover-lift shadow-xs"
            >
              <div className="text-2xl font-bold text-[#1e3a5f] dark:text-blue-300">
                {s.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="glass-card rounded-2xl p-5 mb-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by paper title, authors, journal or conference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="md:col-span-4 relative">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">All Publication Years</option>
                {availableYears.map((y) => (
                  <option key={y} value={y.toString()}>
                    Year {y}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400 self-center font-bold mr-1">
              Filter by Type:
            </span>
            {[
              ['all', `All (${counts.total})`],
              ['journal', `Journals (${counts.journals})`],
              ['conference', `Conferences (${counts.conferences})`],
              ['sci', `SCI/SCIE (${counts.sci})`],
              ['scopus', `Scopus (${counts.scopus})`],
            ].map(([cat, label]) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(15);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1e3a5f] text-white font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Count Bar */}
        <div className="flex justify-between items-center mb-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{Math.min(visibleCount, filteredPubs.length)}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{filteredPubs.length}</strong> publications
          </span>
          {(searchTerm || selectedCategory !== 'all' || selectedYear !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedYear('all');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Publications Stream */}
        {filteredPubs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <div className="text-sm font-semibold">No publications match the selected criteria.</div>
            <p className="text-xs">Try clearing the search term or switching the category filter.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredPubs.slice(0, visibleCount).map((pub) => {
              const venue = pub.journal_or_conference || pub.venue || pub.journal || '';
              const indexingList = normalizeIndexing(pub.indexing);
              const pubType = String(pub.type || 'Journal').toLowerCase();

              return (
                <div
                  key={pub.id}
                  className="glass-card rounded-2xl p-5 hover-lift flex flex-col md:flex-row md:items-start justify-between gap-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1e3a5f] text-white font-bold text-[10px]">
                        {pub.year}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          pubType === 'conference'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        {pubType === 'conference' ? 'Conference' : 'Journal'}
                      </span>
                      {indexingList.map((idx, i) => (
                        <span key={i} className="badge-accent text-[10px]">
                          {idx}
                        </span>
                      ))}
                      {(pub.impact_factor || pub.impactFactor) && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                          IF: {pub.impact_factor || pub.impactFactor}
                        </span>
                      )}
                      {pub.award && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                          <Award className="w-3 h-3 text-amber-600" />
                          {pub.award}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-sm md:text-[15px] font-semibold text-slate-900 dark:text-slate-100 leading-snug"
                      style={{ fontFamily: "'Merriweather', serif" }}
                    >
                      {pub.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {pub.authors}
                    </p>

                    {venue && (
                      <p className="text-xs italic text-slate-700 dark:text-slate-300 font-serif">
                        {venue}
                        {pub.volume_issue_pages && `, ${pub.volume_issue_pages}`}
                      </p>
                    )}

                    {pub.doi_or_url && (
                      <div className="pt-1">
                        <a
                          href={
                            pub.doi_or_url.startsWith('http')
                              ? pub.doi_or_url
                              : `https://doi.org/${pub.doi_or_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> View Publication / DOI
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                    <button
                      onClick={() => copyCitation(pub)}
                      className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-blue-400 transition-all cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                      title="Copy APA formatted citation to clipboard"
                    >
                      {copiedId === pub.id ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <span>{copiedId === pub.id ? 'Copied' : 'Cite'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredPubs.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 15)}
              className="px-6 py-2.5 bg-[#1e3a5f] hover:bg-[#152943] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
            >
              Load More ({filteredPubs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
