import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Calendar, Trash2, Clock, Loader, Plus } from 'lucide-react';
import ScheduleTimeline from '../components/ScheduleTimeline';
import { scheduleAPI } from '../api';

const TIME_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };

const SchedulePage = () => {
    const { t } = useTranslation();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('create');
    const [dbOffline, setDbOffline] = useState(false);

    const fetchSchedules = async () => {
        setLoading(true);
        setDbOffline(false);
        try {
            const res = await scheduleAPI.getAll();
            setSchedules(res.data || []);
        } catch (err) {
            console.error(err);
            setDbOffline(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleSave = async (data) => {
        const res = await scheduleAPI.create(data);
        if (res.success) {
            toast.success(t('schedule.saved'));
            fetchSchedules();
            setActiveTab('view');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this schedule?')) return;
        try {
            await scheduleAPI.delete(id);
            toast.success('Schedule deleted');
            fetchSchedules();
        } catch (err) {
            toast.error('Failed to delete schedule');
        }
    };

    return (
        <div className="space-y-7 fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <Calendar className="text-violet-400" size={28} />
                        <span className="gradient-text">{t('schedule.title')}</span>
                    </h1>
                    <p className="text-gray-500 text-sm">{t('schedule.subtitle')}</p>
                </div>

                {/* Schedules Count */}
                {schedules.length > 0 && (
                    <span className="badge badge-primary text-[11px]">
                        {schedules.length} Schedule{schedules.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/[0.07] w-fit">
                {[
                    { id: 'create', icon: Plus, label: 'Create Schedule' },
                    { id: 'view', icon: Clock, label: t('schedule.mySchedules'), count: schedules.length },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Icon size={14} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-white/20' : 'bg-indigo-400/20 text-indigo-300'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Create Tab */}
            {activeTab === 'create' && (
                <div className="glass-card p-6 fade-in-up">
                    <ScheduleTimeline onSave={handleSave} />
                </div>
            )}

            {/* View Tab */}
            {activeTab === 'view' && (
                <div className="space-y-4 fade-in-up">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader size={26} className="text-indigo-400 animate-spin" />
                        </div>
                    )}

                    {!loading && dbOffline && (
                        <div className="glass-card p-6 border border-amber-500/20 bg-amber-500/[0.04]">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="text-amber-300 font-semibold text-sm">Database unavailable</p>
                                    <p className="text-amber-500/70 text-xs mt-1 leading-relaxed">
                                        Could not connect to MongoDB. Schedules require a database connection.
                                        Add a <code className="bg-white/10 px-1 rounded">MONGODB_URI</code> in <code className="bg-white/10 px-1 rounded">server/.env</code>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !dbOffline && schedules.length === 0 && (
                        <div className="glass-card p-14 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto">
                                <Calendar size={28} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-white font-semibold">{t('schedule.noSchedules')}</p>
                                <p className="text-gray-500 text-sm mt-1">Create your first medication schedule.</p>
                            </div>
                            <button
                                onClick={() => setActiveTab('create')}
                                className="btn-primary text-sm mt-2"
                            >
                                Create Schedule
                            </button>
                        </div>
                    )}

                    {!loading && schedules.map((schedule, idx) => (
                        <div
                            key={schedule._id}
                            className="glass-card p-5 fade-in-up"
                            style={{ animationDelay: `${idx * 0.06}s` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-white font-bold">{schedule.patientName}</h3>
                                    <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                                        <Clock size={10} />
                                        {schedule.scheduleEntries.length} medicine{schedule.scheduleEntries.length !== 1 ? 's' : ''}
                                        {' · '}
                                        {new Date(schedule.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(schedule._id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['morning', 'afternoon', 'evening', 'night'].map(slot => {
                                    const slotMeds = schedule.scheduleEntries.filter(e => e.time === slot);
                                    if (slotMeds.length === 0) return null;
                                    return (
                                        <div key={slot} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                                            <div className="text-center text-lg mb-1.5">{TIME_ICONS[slot]}</div>
                                            <p className="text-center text-[10px] text-gray-500 font-semibold mb-2 uppercase tracking-wider">
                                                {t(`schedule.${slot}`)}
                                            </p>
                                            <ul className="space-y-1">
                                                {slotMeds.map((m, i) => (
                                                    <li key={i} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                                                        {m.medicineName}
                                                        {m.dosage && <span className="text-gray-600">({m.dosage})</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
