import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Clock, Pill, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { medicineAPI } from '../api';
import MedicineCard from '../components/MedicineCard';

const HistoryPage = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const fetchHistory = async (p = 1, s = '') => {
        setLoading(true);
        try {
            const res = await medicineAPI.getHistory({ page: p, limit: 12, search: s });
            setHistory(res.data || []);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(page, search);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchHistory(1, search);
    };

    const mapDbToCard = (item) => ({
        medicine: item.medicineName,
        purpose: item.purpose,
        benefits: item.benefits,
        sideEffects: item.sideEffects,
        warnings: item.warnings,
        typicalDosage: item.typicalDosage,
        category: item.category,
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black gradient-text">{t('history.title')}</h1>
                <p className="text-gray-400 mt-1">{t('history.subtitle')}</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('history.search')}
                        className="input-field pl-10"
                    />
                </div>
                <button type="submit" className="btn-primary px-5">Search</button>
            </form>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <Loader size={28} className="text-indigo-400 animate-spin" />
                        <p className="text-gray-400">{t('common.loading')}</p>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading && history.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <Pill size={40} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">{t('history.noHistory')}</p>
                </div>
            )}

            {/* History cards */}
            {!loading && history.length > 0 && (
                <div className="space-y-3">
                    {history.map((item, idx) => (
                        <div key={item._id} className="glass-card overflow-hidden fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/2 transition-colors"
                                onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                        <Pill size={18} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">{item.medicineName}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {item.category && <span className="badge badge-primary text-xs">{item.category}</span>}
                                            <span className={`badge text-xs ${item.language === 'ta' ? 'badge-warning' : 'badge-success'}`}>
                                                {item.language === 'ta' ? 'தமிழ்' : 'EN'}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-500 text-xs">
                                                <Clock size={11} />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {expandedId === item._id
                                    ? <ChevronUp size={18} className="text-gray-500" />
                                    : <ChevronDown size={18} className="text-gray-500" />}
                            </div>

                            {expandedId === item._id && (
                                <div className="border-t border-white/5">
                                    <div className="p-0">
                                        <MedicineCard data={mapDbToCard(item)} index={0} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                    >
                        ← Prev
                    </button>
                    <span className="text-gray-400 text-sm">
                        Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
