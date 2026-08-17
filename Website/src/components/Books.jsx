import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { books } from '../data/books';
import { BookOpen, Star } from 'lucide-react';

function BookCover({ book }) {
  return (
    <div
      className="w-full aspect-[2/3] rounded-xl flex flex-col items-center justify-center p-4 text-center shadow-lg relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${book.color}ee, ${book.color}99)` }}
      role="img"
      aria-label={`Book cover: ${book.title}`}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 10px)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className="text-white/90 font-black text-[2.5rem] leading-none mb-3" style={{ fontFamily: 'Manrope' }}>
          {book.initials}
        </div>
        <p className="text-white text-[0.65rem] font-semibold leading-snug px-2">
          {book.title}
        </p>
      </div>
      {/* Year band */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 py-1.5 text-center">
        <span className="text-white/90 text-[0.6rem] font-semibold">{book.year}</span>
      </div>
    </div>
  );
}

export default function Books() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const featured = books.filter((b) => b.featured);
  const others = books.filter((b) => !b.featured);

  return (
    <section id="books" className="section bg-white" aria-label="Books and Authorship" ref={ref}>
      <div className="container mx-auto px-6 max-w-[1280px]">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="section-eyebrow mb-3">Authorship</p>
            <h2 className="heading-xl" style={{ fontFamily: 'Manrope' }}>Books & Authorship</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-blue">{books.filter(b => b.type === 'Authored').length} Authored</span>
            <span className="badge badge-slate">{books.filter(b => b.type === 'Co-Authored').length} Co-Authored</span>
            <span className="badge badge-amber">{books.filter(b => b.type === 'Edited').length} Edited</span>
          </div>
        </motion.div>

        {/* Featured books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featured.map((book, i) => (
            <motion.article
              key={book.id}
              className="card p-6 flex gap-6 items-start border-2"
              style={{ borderColor: book.color + '33' }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              aria-label={`Book: ${book.title}`}
            >
              <div className="w-[100px] flex-shrink-0">
                <BookCover book={book} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <Star size={13} className="text-amber-500" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wide">Featured</span>
                  <span className="badge badge-blue">{book.type}</span>
                  {book.note && <span className="badge badge-slate">{book.note}</span>}
                </div>
                <h3 className="font-bold text-[#0F172A] text-[1rem] leading-snug mb-1.5" style={{ fontFamily: 'Manrope' }}>
                  {book.title}
                </h3>
                <p className="text-[#475569] text-[0.82rem] mb-1">{book.authors}</p>
                <p className="text-[#2563EB] text-[0.82rem] font-medium mb-1">{book.publisher}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="badge badge-slate">{book.year}</span>
                  {book.isbn !== 'In Press' && (
                    <span className="badge badge-slate">ISBN: {book.isbn}</span>
                  )}
                  {book.isbn === 'In Press' && (
                    <span className="badge badge-amber">In Press</span>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Other books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {others.map((book, i) => (
            <motion.article
              key={book.id}
              className="card p-4 flex flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
              aria-label={`Book: ${book.title}`}
            >
              <div className="mb-3">
                <BookCover book={book} />
              </div>
              <div className="flex flex-wrap gap-1 mb-1.5">
                <span className="badge badge-slate text-[10px]">{book.type}</span>
                <span className="badge badge-slate text-[10px]">{book.year}</span>
              </div>
              <h4 className="font-semibold text-[#0F172A] text-[0.82rem] leading-snug mb-1 flex-1" style={{ fontFamily: 'Manrope' }}>
                {book.title}
              </h4>
              <p className="text-[#475569] text-[0.72rem]">{book.publisher}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
