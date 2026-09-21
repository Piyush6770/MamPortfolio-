import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Edit2, Trash2, Eye, EyeOff, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const DataTable = ({
  title = '',
  subtitle = '',
  items = [],
  columns = [],
  searchKey = 'title',
  statusKey = 'publish_status',
  onAddNew,
  onEdit,
  onDelete,
  onReorder,
  onToggleVisibility,
  loading = false,
  emptyTitle = 'No items found',
  emptySubtitle = 'Get started by creating your first entry.',
  addButtonLabel = '+ Add New',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const val = item[searchKey] || item.title || item.name || item.role || item.topic_or_title || '';
      const matchesSearch = String(val).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PUBLISHED' && item[statusKey] === 'published') ||
        (statusFilter === 'DRAFT' && item[statusKey] === 'draft') ||
        (statusFilter === 'HIDDEN' && item.is_visible === false);
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, statusFilter, searchKey, statusKey]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleMove = (indexInPaginated, direction) => {
    if (!onReorder) return;
    const actualIndex = (currentPage - 1) * itemsPerPage + indexInPaginated;
    const targetIndex = direction === 'up' ? actualIndex - 1 : actualIndex + 1;

    if (targetIndex < 0 || targetIndex >= filteredItems.length) return;

    const newOrder = [...filteredItems];
    const temp = newOrder[actualIndex];
    newOrder[actualIndex] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const reorderedPayload = newOrder.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1,
    }));
    onReorder(reorderedPayload);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden space-y-4">
      {/* Header controls */}
      <div className="p-5 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
          {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-500 w-48 sm:w-60 text-zinc-100 placeholder:text-zinc-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 outline-none text-zinc-200 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          {/* Add New Button */}
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-white text-black text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" /> {addButtonLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-500 space-y-3">
            <div className="w-7 h-7 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Loading entries...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-bold text-zinc-300">{emptyTitle}</p>
            <p className="text-xs text-zinc-500">{emptySubtitle}</p>
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-zinc-700"
              >
                <Plus className="w-3.5 h-3.5" /> {addButtonLabel}
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-zinc-800">
              <tr>
                {onReorder && <th className="py-3 px-4 w-14 text-center">Order</th>}
                {columns.map((col) => (
                  <th key={col.key} className="py-3 px-4 font-bold">
                    {col.label}
                  </th>
                ))}
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {paginatedItems.map((item, idx) => {
                const isHidden = item.is_visible === false;
                const status = item[statusKey] || 'published';

                return (
                  <tr
                    key={item.id || idx}
                    className={`hover:bg-zinc-900/60 transition-colors ${
                      isHidden ? 'opacity-50 bg-zinc-950/40' : ''
                    }`}
                  >
                    {/* Reorder Buttons */}
                    {onReorder && (
                      <td className="py-3 px-2 text-center">
                        <div className="flex flex-col items-center justify-center -space-y-1">
                          <button
                            onClick={() => handleMove(idx, 'up')}
                            disabled={currentPage === 1 && idx === 0}
                            className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === paginatedItems.length - 1 && currentPage === totalPages}
                            className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}

                    {/* Dynamic Columns */}
                    {columns.map((col) => (
                      <td key={col.key} className="py-3.5 px-4 font-normal text-zinc-200">
                        {col.render ? (
                          col.render(item[col.key], item)
                        ) : col.key === 'publish_status' || col.key === 'status' ? (
                          <StatusBadge status={status} isVisible={item.is_visible !== false} />
                        ) : (
                          <span className="line-clamp-2">{item[col.key] || '—'}</span>
                        )}
                      </td>
                    ))}

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {onToggleVisibility && (
                        <button
                          onClick={() => onToggleVisibility(item)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title={isHidden ? 'Make visible on website' : 'Hide from website'}
                        >
                          {isHidden ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}

                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredItems.length > itemsPerPage && (
        <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 disabled:opacity-30 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-mono text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 disabled:opacity-30 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
