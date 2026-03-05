import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Calendar, Trash2, Clock, Loader } from 'lucide-react';
import ScheduleTimeline from '../components/ScheduleTimeline';
import { scheduleAPI } from '../api';

const TIME_ICONS = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };

const SchedulePage = () => {
    const { t } = useTranslation();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('create'); // 'create' | 'view'

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const res = await scheduleAPI.getAll();
            setSchedules(res.data || []);
        } catch (err) {
            console.error(err);
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
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black gradient-text">{t('schedule.title')}</h1>
                <p className="text-gray-400 mt-1">{t('schedule.subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'create'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Calendar size={15} />
                    Create Schedule
                </button>
                <button
                    onClick={() => setActiveTab('view')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'view'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <Clock size={15} />
                    {t('schedule.mySchedules')}
                    {schedules.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 text-xs">
                            {schedules.length}
                        </span>
                    )}
                </button>
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
                            <Loader size={28} className="text-indigo-400 animate-spin" />
                        </div>
                    )}

                    {!loading && schedules.length === 0 && (
                        <div className="glass-card p-12 text-center">
                            <Calendar size={40} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">{t('schedule.noSchedules')}</p>
                            <button
                                onClick={() => setActiveTab('create')}
                                className="btn-primary mt-4 text-sm"
                            >
                                Create First Schedule
                            </button>
                        </div>
                    )}

                    {schedules.map((schedule, idx) => (
                        <div key={schedule._id} className="glass-card p-5 fade-in-up" style={{ animationDelay: `${idx * 0.08}s` }}>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-white font-bold">{schedule.patientName}</h3>
                                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                        <Clock size={11} />
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

                            {/* Timeline view */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['morning', 'afternoon', 'evening', 'night'].map(slot => {
                                    const slotMeds = schedule.scheduleEntries.filter(e => e.time === slot);
                                    if (slotMeds.length === 0) return null;
                                    return (
                                        <div key={slot} className="p-3 rounded-xl bg-white/3 border border-white/5">
                                            <div className="text-center text-xl mb-2">{TIME_ICONS[slot]}</div>
                                            <p className="text-center text-xs text-gray-500 font-medium mb-2 uppercase">
                                                {t(`schedule.${slot}`)}
                                            </p>
                                            <ul className="space-y-1">
                                                {slotMeds.map((m, i) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />
                                                        {m.medicineName}
                                                        {m.dosage && <span className="text-gray-500">({m.dosage})</span>}
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
