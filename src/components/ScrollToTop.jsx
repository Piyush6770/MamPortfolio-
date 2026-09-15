import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to Top"
      className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900 text-white dark:bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 rounded-full shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none border border-slate-700 dark:border-teal-400 cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
