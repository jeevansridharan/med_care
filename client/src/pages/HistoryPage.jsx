import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Clock, Pill, ChevronDown, ChevronUp, Loader, History } from 'lucide-react';
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
    const [dbOffline, setDbOffline] = useState(false);

    const fetchHistory = async (p = 1, s = '') => {
        setLoading(true);
        setDbOffline(false);
        try {
            const res = await medicineAPI.getHistory({ page: p, limit: 12, search: s });
            setHistory(res.data || []);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
            setDbOffline(true);
            setHistory([]);
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
        <div className="space-y-7 fade-in-up">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                    <History className="text-cyan-400" size={28} />
                    <span className="gradient-text">{t('history.title')}</span>
                </h1>
                <p className="text-gray-500 text-sm">{t('history.subtitle')}</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('history.search')}
                        className="input-field pl-10 py-2.5 text-sm"
                    />
                </div>
                <button type="submit" className="btn-primary px-5 text-sm py-2.5">Search</button>
            </form>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <Loader size={26} className="text-indigo-400 animate-spin" />
                        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
                    </div>
                </div>
            )}

            {/* DB Offline Banner */}
            {!loading && dbOffline && (
                <div className="glass-card p-6 border border-amber-500/20 bg-amber-500/[0.04]">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="text-amber-300 font-semibold text-sm">Database unavailable</p>
                            <p className="text-amber-500/70 text-xs mt-1 leading-relaxed">
                                Could not connect to MongoDB. History requires a database connection.
                                Start MongoDB locally or add a <code className="bg-white/10 px-1 rounded">MONGODB_URI</code> in <code className="bg-white/10 px-1 rounded">server/.env</code>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!loading && !dbOffline && history.length === 0 && (
                <div className="glass-card p-14 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto">
                        <Pill size={28} className="text-gray-600" />
                    </div>
                    <div>
                        <p className="text-white font-semibold">{t('history.noHistory')}</p>
                        <p className="text-gray-500 text-sm mt-1">Analyze medicines on the Home page to build your history.</p>
                    </div>
                </div>
            )}

            {/* History List */}
            {!loading && history.length > 0 && (
                <div className="space-y-2.5">
                    <p className="text-xs text-gray-600 font-semibold px-1">
                        {pagination?.total ?? history.length} record{history.length !== 1 ? 's' : ''} found
                    </p>
                    {history.map((item, idx) => (
                        <div
                            key={item._id}
                            className="glass-card overflow-hidden fade-in-up"
                            style={{ animationDelay: `${idx * 0.04}s` }}
                        >
                            {/* Row */}
                            <div
                                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                        <Pill size={16} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold text-sm">{item.medicineName}</h3>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            {item.category && (
                                                <span className="badge badge-primary text-[10px] py-0.5 px-2">{item.category}</span>
                                            )}
                                            <span className={`badge text-[10px] py-0.5 px-2 ${item.language === 'ta' ? 'badge-warning' : 'badge-success'}`}>
                                                {item.language === 'ta' ? 'தமிழ்' : 'EN'}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600 text-[10px]">
                                                <Clock size={10} />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-600 flex-shrink-0 ml-2">
                                    {expandedId === item._id
                                        ? <ChevronUp size={16} />
                                        : <ChevronDown size={16} />}
                                </div>
                            </div>

                            {/* Expanded */}
                            {expandedId === item._id && (
                                <div className="border-t border-white/[0.05]">
                                    <MedicineCard data={mapDbToCard(item)} index={0} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="btn-secondary text-sm py-2 px-4 disabled:opacity-40"
                    >
                        ← Prev
                    </button>
                    <span className="text-gray-500 text-sm">
                        Page {pagination.page} of {pagination.pages}
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
