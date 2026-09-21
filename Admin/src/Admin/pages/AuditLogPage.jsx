import React, { useState, useEffect } from 'react';
import {
  History,
  RefreshCw,
  Clock,
  ShieldCheck,
  Filter,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Database,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';
import { auditService } from '../services/auditService';

export const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    const { data } = await auditService.getRecentLogs(150);
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    // Action filter
    if (filterAction !== 'ALL') {
      if (filterAction === 'UPDATE') {
        if (log.action !== 'UPDATE' && log.action !== 'UPDATE_SINGLETON') return false;
      } else if (filterAction === 'SYNC_DATA') {
        if (log.action !== 'SYNC_DATA' && log.action !== 'INITIAL_SEED') return false;
      } else if (log.action !== filterAction) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const entityMatch = String(log.entity || '').toLowerCase().includes(q);
      const idMatch = String(log.entity_id || '').toLowerCase().includes(q);
      const emailMatch = String(log.admin_email || '').toLowerCase().includes(q);
      const actionMatch = String(log.action || '').toLowerCase().includes(q);
      const detailsMatch = JSON.stringify(log.details || '').toLowerCase().includes(q);
      return entityMatch || idMatch || emailMatch || actionMatch || detailsMatch;
    }

    return true;
  });

  const downloadAuditLogsJson = () => {
    const jsonString = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBadgeStyle = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/80';
      case 'DELETE':
        return 'bg-rose-950/70 text-rose-300 border border-rose-800/80';
      case 'UPDATE':
      case 'UPDATE_SINGLETON':
        return 'bg-amber-950/70 text-amber-300 border border-amber-800/80';
      case 'REORDER':
        return 'bg-purple-950/70 text-purple-300 border border-purple-800/80';
      case 'SYNC_DATA':
      case 'INITIAL_SEED':
        return 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/80';
      default:
        return 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/80';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" /> CMS Audit Trail & Mutation History
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time, immutable record of all content updates, database synchronization, insertions, deletions, and config edits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={downloadAuditLogsJson}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold rounded-xl text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
            title="Download JSON export of audit trail"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" /> Export JSON
          </button>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by entity, field, email, or id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-900/90 border border-zinc-800 outline-none text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-[11px] text-zinc-400 font-mono">
            Showing <strong className="text-zinc-200">{filteredLogs.length}</strong> / {logs.length} logs
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 outline-none text-zinc-200 cursor-pointer focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE / SAVE</option>
              <option value="DELETE">DELETE</option>
              <option value="REORDER">REORDER</option>
              <option value="SYNC_DATA">SYNC & SEED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-zinc-500">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs">Loading audit logs...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 space-y-2">
            <ShieldCheck className="w-10 h-10 text-zinc-700 mx-auto" />
            <div className="text-xs font-semibold text-zinc-400">No matching audit records found.</div>
            <p className="text-[11px] text-zinc-600 max-w-sm mx-auto">
              {searchQuery || filterAction !== 'ALL'
                ? 'Try adjusting your search query or action filter.'
                : 'Edits made in any admin section will automatically be logged here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-900">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const hasDetails = log.details && Object.keys(log.details).length > 0;

              return (
                <div key={log.id} className="py-4 space-y-2.5 transition-colors hover:bg-zinc-900/20 rounded-xl px-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider shrink-0 ${getBadgeStyle(log.action)}`}>
                        {log.action}
                      </span>
                      <div>
                        <div className="font-bold text-zinc-200 flex items-center gap-2">
                          <span>Entity:</span>
                          <span className="text-indigo-400 font-mono bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/40">
                            {log.entity}
                          </span>
                          {log.entity_id && (
                            <span className="text-zinc-500 text-[11px] font-normal">
                              (ID: <span className="font-mono text-zinc-400">{log.entity_id}</span>)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                      <div className="text-right space-y-0.5">
                        <div className="font-semibold text-zinc-300 text-[11px]">{log.admin_email}</div>
                        <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>

                      {hasDetails && (
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                          title="View mutation details"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Snippet if not expanded */}
                  {hasDetails && !isExpanded && (
                    <div
                      onClick={() => setExpandedLogId(log.id)}
                      className="text-[11px] text-zinc-400 font-mono bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/60 p-2.5 rounded-xl cursor-pointer transition-colors line-clamp-2"
                    >
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                    </div>
                  )}

                  {/* Expanded JSON details */}
                  {hasDetails && isExpanded && (
                    <div className="mt-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-[11px] font-mono">
                      <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800/80 pb-2">
                        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                          <FileCode2 className="w-3.5 h-3.5 text-indigo-400" /> Mutation Details Payload
                        </span>
                        <span className="text-[10px] text-zinc-500">Log ID: {log.id}</span>
                      </div>
                      <pre className="text-zinc-300 overflow-x-auto p-2 bg-zinc-950 rounded-lg max-h-60 leading-relaxed">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
