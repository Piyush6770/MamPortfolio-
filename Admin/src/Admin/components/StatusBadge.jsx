import React from 'react';

export const StatusBadge = ({ status = 'published', isVisible = true }) => {
  if (isVisible === false) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        Hidden
      </span>
    );
  }

  switch (status?.toLowerCase()) {
    case 'published':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Published
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-900/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Draft
        </span>
      );
    case 'archived':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/60 text-rose-400 border border-rose-900/60">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Archived
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
          {status}
        </span>
      );
  }
};
