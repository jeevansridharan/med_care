import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Search, Clock, Pill, ChevronDown, ChevronUp,
    History, Trash2, Trash, AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import MedicineCard from '../components/MedicineCard';
import DrugInteractions from '../components/DrugInteractions';
import useLocalHistory from '../hooks/useLocalHistory';

/* ─── Confirmation dialog (inline, lightweight) ───────────────────────────── */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
        />
        <div className="relative glass-card p-7 w-full max-w-sm space-y-5 border border-red-500/20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={20} className="text-red-400" />
                </div>
                <p className="text-white font-semibold text-sm leading-relaxed">{message}</p>
            </div>
            <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className="btn-secondary text-sm py-2 px-4">
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="btn-primary text-sm py-2 px-4"
                    style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

/* ─── Relative date formatter ─────────────────────────────────────────────── */
const formatRelative = (isoDate) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(isoDate).toLocaleDateString();
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const HistoryPage = () => {
    const { t } = useTranslation();
    const { history, remove, clear } = useLocalHistory();

    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [confirmClear, setConfirmClear] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    /* Filter by search query across input text and medicine names */
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return history;
        return history.filter((item) => {
            const inInput = item.input?.toLowerCase().includes(q);
            const inResults = item.results?.some(
                (r) => r.data?.medicine?.toLowerCase().includes(q)
            );
            return inInput || inResults;
        });
    }, [history, search]);

    /* ── Delete handlers ── */
    const handleDeleteRequest = (e, id) => {
        e.stopPropagation();
        setConfirmDeleteId(id);
    };

    const handleDeleteConfirm = () => {
        remove(confirmDeleteId);
        if (expandedId === confirmDeleteId) setExpandedId(null);
        setConfirmDeleteId(null);
        toast.success('Entry deleted.');
    };

    const handleClearConfirm = () => {
        clear();
        setExpandedId(null);
        setConfirmClear(false);
        toast.success('History cleared.');
    };

    /* ── Expand toggle ── */
    const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

    return (
        <>
            {/* Confirm modals */}
            {confirmClear && (
                <ConfirmModal
                    message="Clear ALL history? This cannot be undone."
                    onConfirm={handleClearConfirm}
                    onCancel={() => setConfirmClear(false)}
                />
            )}
            {confirmDeleteId && (
                <ConfirmModal
                    message="Delete this entry? This cannot be undone."
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}

            <div className="space-y-7 fade-in-up">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                            <History className="text-cyan-400" size={28} />
                            <span className="gradient-text">{t('history.title')}</span>
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {history.length} saved{' '}
                            {history.length === 1 ? 'analysis' : 'analyses'} · stored locally in your browser
                        </p>
                    </div>

                    {history.length > 0 && (
                        <button
                            onClick={() => setConfirmClear(true)}
                            className="btn-secondary text-xs font-bold uppercase tracking-wider px-4 py-2
                                       flex items-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                        >
                            <Trash size={13} />
                            Clear History
                        </button>
                    )}
                </div>

                {/* ── Search ── */}
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by medicine name or input text…"
                        className="input-field pl-10 py-2.5 text-sm"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* ── Empty state ── */}
                {history.length === 0 && (
                    <div className="glass-card p-14 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto">
                            <Pill size={28} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">{t('history.noHistory')}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Analyze medicines on the Home page — results are saved here automatically.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── No search results ── */}
                {history.length > 0 && filtered.length === 0 && (
                    <div className="glass-card p-10 text-center space-y-2">
                        <Search size={28} className="text-gray-600 mx-auto" />
                        <p className="text-gray-400 text-sm">No history matches &ldquo;{search}&rdquo;</p>
                    </div>
                )}

                {/* ── History list ── */}
                {filtered.length > 0 && (
                    <div className="space-y-2.5">
                        <p className="text-xs text-gray-600 font-semibold px-1">
                            {filtered.length}{search ? ` of ${history.length}` : ''}{' '}
                            {filtered.length === 1 ? 'record' : 'records'}
                        </p>

                        {filtered.map((item, idx) => {
                            const successCount = item.results?.filter((r) => r.success && !r.data?.error).length ?? 0;
                            const isExpanded = expandedId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="glass-card overflow-hidden fade-in-up"
                                    style={{ animationDelay: `${idx * 0.04}s` }}
                                >
                                    {/* ── Row header ── */}
                                    <div
                                        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                        onClick={() => toggleExpand(item.id)}
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                                <Pill size={16} className="text-indigo-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-white font-semibold text-sm truncate max-w-[220px] sm:max-w-none">
                                                    {item.input || 'Unnamed analysis'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="badge badge-primary text-[10px] py-0.5 px-2">
                                                        {successCount} medicine{successCount !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className={`badge text-[10px] py-0.5 px-2 ${item.language === 'ta' ? 'badge-warning' : 'badge-success'}`}>
                                                        {item.language === 'ta' ? 'தமிழ்' : 'EN'}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 text-[10px]">
                                                        <Clock size={10} />
                                                        {formatRelative(item.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => handleDeleteRequest(e, item.id)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600
                                                           hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                title="Delete this entry"
                                            >
                                                <Trash2 size={13} />
                                            </button>

                                            {/* Chevron */}
                                            <span className="text-gray-600">
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── Expanded body ── */}
                                    {isExpanded && (
                                        <div className="border-t border-white/[0.05] p-5 space-y-4 fade-in-up">
                                            {/* Input echo */}
                                            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]">
                                                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-wider mb-2">
                                                    Input Text
                                                </p>
                                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {item.input}
                                                </p>
                                            </div>

                                            {/* Timestamp */}
                                            <p className="text-[10px] text-gray-600">
                                                Saved on {new Date(item.date).toLocaleString()}
                                            </p>

                                            {/* Drug interactions */}
                                            {item.interactions && (
                                                <DrugInteractions interactions={item.interactions} />
                                            )}

                                            {/* Medicine cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {item.results?.map((result, i) =>
                                                    result.success && !result.data?.error ? (
                                                        <MedicineCard key={i} data={result.data} index={i} />
                                                    ) : (
                                                        <div
                                                            key={i}
                                                            className="glass-card p-5 border-red-500/20 bg-red-500/5"
                                                        >
                                                            <p className="text-red-400 text-sm font-medium">
                                                                ❌ {result.medicine || 'Unknown'} — {result.error}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Storage note ── */}
                {history.length > 0 && (
                    <p className="text-center text-[11px] text-gray-700 pt-2">
                        💾 Data stored in browser localStorage · cleared when you clear browser data
                    </p>
                )}
            </div>
        </>
    );
};

export default HistoryPage;
