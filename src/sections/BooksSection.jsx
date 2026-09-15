import { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { booksData, bookChaptersData } from '../data/books';
import { BookOpen, Bookmark } from 'lucide-react';

export const BooksSection = () => {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <section id="books" className="py-16 bg-white dark:bg-[#0f172a] border-b border-[#ebebeb] dark:border-[#2e2e30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <SectionHeader badge="SCHOLARLY BOOKS" title="Books & Book Chapters"
          subtitle="7 authored and edited books with international publishers (PHI Learning, Elsevier, CRC Press) and 13 research book chapters." />

        <div className="flex space-x-6 border-b border-slate-200 dark:border-slate-700 mb-8 text-sm font-semibold">
          {[['books', `Books (${booksData.length})`], ['chapters', `Book Chapters (${bookChaptersData.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${activeTab === id ? 'tab-active' : 'tab-inactive'}`}>{label}</button>
          ))}
        </div>

        {activeTab === 'books' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {booksData.map((book) => (
              <div key={book.id} className="glass-card rounded-xl p-5 hover-lift flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge-accent">{book.role}</span>
                    <span className="text-xs font-mono font-bold text-slate-400">{book.year}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-2" style={{fontFamily: "'Merriweather', serif"}}>{book.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1"><strong>Authors/Editors:</strong> {book.authors}</p>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Publisher: {book.publisher}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-3 flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span>ISBN: {book.isbn}</span>
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chapters' && (
          <div className="space-y-3">
            {bookChaptersData.map((ch) => (
              <div key={ch.id} className="glass-card rounded-lg p-4 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-mono">Year {ch.year}{ch.pages ? ` • ${ch.pages}` : ''}</span>
                  <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100" style={{fontFamily: "'Merriweather', serif"}}>"{ch.chapterTitle}"</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400"><strong>Authors:</strong> {ch.authors}</p>
                <p className="text-xs italic text-slate-500 dark:text-slate-400">Book: {ch.bookTitle} ({ch.publisher})</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
