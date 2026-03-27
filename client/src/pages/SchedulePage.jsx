import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
    Calendar, Trash2, Clock, Plus, X,
    CheckCircle2, Circle, Pill, Utensils,
    Sun, Sunrise, Sunset, Moon, MoreVertical,
    LayoutGrid, List, Filter
} from 'lucide-react';
import ScheduleTimeline from '../components/ScheduleTimeline';
import useLocalSchedule from '../hooks/useLocalSchedule';

const TIME_CONFIG = {
    morning: { icon: Sunrise, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', label: 'Morning' },
    afternoon: { icon: Sun, color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.2)', label: 'Afternoon' },
    evening: { icon: Sunset, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', label: 'Evening' },
    night: { icon: Moon, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.2)', label: 'Night' },
};

/* ─── Dose Card Component ────────────────────────────────────────────────── */
const MedicineDoseCard = ({ medicine, scheduleId, onToggle, onDelete }) => {
    const config = TIME_CONFIG[medicine.time] || TIME_CONFIG.morning;
    const Icon = config.icon;

    return (
        <div
            className={`glass-card relative overflow-hidden transition-all duration-300 group
                ${medicine.taken ? 'opacity-60 grayscale-[0.5]' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10'}`}
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: config.color }} />

            <div className="p-5 flex flex-col h-full">
                {/* Header: Time + Status Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.border}` }}>
                        <Icon size={12} />
                        {config.label}
                    </div>

                    <button
                        onClick={() => onToggle(scheduleId, medicine.id)}
                        className={`transition-all duration-300 ${medicine.taken ? 'text-emerald-400 scale-110' : 'text-gray-600 hover:text-indigo-400'}`}
                    >
                        {medicine.taken ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                </div>

                {/* Body: Name & Dosage */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                        <Pill size={22} className={medicine.taken ? 'text-gray-500' : 'text-indigo-400'} />
                    </div>
                    <div className="min-w-0">
                        <h3 className={`font-bold text-lg truncate ${medicine.taken ? 'text-gray-500 line-through' : 'text-white'}`}>
                            {medicine.medicineName}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{medicine.dosage || 'No dosage specified'}</p>
                    </div>
                </div>

                {/* Footer: Notes */}
                {medicine.notes && (
                    <div className="mt-auto pt-3 border-t border-white/[0.05] flex items-center gap-2 italic">
                        <Utensils size={12} className="text-gray-600 flex-shrink-0" />
                        <p className="text-xs text-gray-500 truncate">{medicine.notes}</p>
                    </div>
                )}

                {/* Action: Delete */}
                <button
                    onClick={() => onDelete(scheduleId)}
                    className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-red-400"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

/* ─── Create Modal ───────────────────────────────────────────────────────── */
const CreateScheduleModal = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative glass-card border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
                <div className="sticky top-0 z-10 bg-[#0a0c10]/80 backdrop-blur-xl p-6 border-b border-white/[0.05] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <Plus className="text-indigo-400" />
                            New Medication Schedule
                        </h2>
                        <p className="text-gray-500 text-xs mt-1">Set up your routine for the day.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-500 hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <ScheduleTimeline onSave={onSave} />
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const SchedulePage = () => {
    const { t } = useTranslation();
    const { schedules, add, remove, toggle } = useLocalSchedule();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, taken
    const [viewMode, setViewMode] = useState('grid'); // grid, routine

    /* ─── Flat map all doses for the Routine View ─── */
    const allDoses = useMemo(() => {
        const flat = [];
        schedules.forEach(s => {
            s.scheduleEntries.forEach(e => {
                flat.push({ ...e, scheduleId: s.id, patientName: s.patientName });
            });
        });

        // Sort by routine order
        const order = { morning: 1, afternoon: 2, evening: 3, night: 4 };
        return flat.sort((a, b) => order[a.time] - order[b.time]);
    }, [schedules]);

    const filteredDoses = useMemo(() => {
        if (filter === 'taken') return allDoses.filter(d => d.taken);
        if (filter === 'pending') return allDoses.filter(d => !d.taken);
        return allDoses;
    }, [allDoses, filter]);

    const handleSave = (data) => {
        add(data.patientName, data.scheduleEntries);
        setIsCreateOpen(false);
        toast.success('Routine updated!');
    };

    return (
        <div className="space-y-8 fade-in-up pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-black text-white flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <Calendar className="text-violet-400" size={24} />
                        </div>
                        <span className="gradient-text">Daily Routine</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Keep track of your medications and never miss a dose.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-1 bg-white/[0.03] rounded-xl border border-white/[0.07] flex items-center gap-1">
                        <button onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('routine')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'routine' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            <List size={18} />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn-primary flex items-center gap-2 px-6 shadow-indigo-500/20"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="font-bold">Add Schedule</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Mops', val: allDoses.length, color: 'text-indigo-400', filter: 'all' },
                    { label: 'Pending', val: allDoses.filter(d => !d.taken).length, color: 'text-amber-400', filter: 'pending' },
                    { label: 'Completed', val: allDoses.filter(d => d.taken).length, color: 'text-emerald-400', filter: 'taken' },
                ].map(stat => (
                    <button
                        key={stat.filter}
                        onClick={() => setFilter(stat.filter)}
                        className={`glass-card p-5 text-left transition-all ${filter === stat.filter ? 'border-white/20 bg-white/[0.04]' : 'border-transparent'}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                            <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                        </div>
                        <div className="mt-4 h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${stat.color.replace('text', 'bg')}`}
                                style={{ width: allDoses.length ? `${(stat.val / allDoses.length) * 100}%` : '0%' }} />
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            {allDoses.length === 0 ? (
                <div className="glass-card p-20 text-center space-y-6">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center mx-auto">
                        <Calendar size={40} className="text-gray-700" />
                    </div>
                    <div className="max-w-xs mx-auto">
                        <h3 className="text-xl font-bold text-white mb-2">No active schedule</h3>
                        <p className="text-gray-500 text-sm mb-6">Create a medication plan to start tracking your health routine.</p>
                        <button onClick={() => setIsCreateOpen(true)} className="btn-primary w-full">Set up Routine</button>
                    </div>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-5'}>
                    {/* View based on Mode */}
                    {viewMode === 'grid' ? (
                        filteredDoses.map((dose) => (
                            <MedicineDoseCard
                                key={dose.id}
                                medicine={dose}
                                scheduleId={dose.scheduleId}
                                onToggle={toggle}
                                onDelete={remove}
                            />
                        ))
                    ) : (
                        // Routine List View (Grouped by time slot)
                        ['morning', 'afternoon', 'evening', 'night'].map(slot => {
                            const slotDoses = filteredDoses.filter(d => d.time === slot);
                            if (slotDoses.length === 0) return null;
                            const config = TIME_CONFIG[slot];
                            const Icon = config.icon;

                            return (
                                <div key={slot} className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.bg, color: config.color }}>
                                            <Icon size={16} />
                                        </div>
                                        <h2 className="text-sm font-black text-white uppercase tracking-widest">{config.label}</h2>
                                        <div className="flex-1 h-px bg-white/[0.05]" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {slotDoses.map(dose => (
                                            <MedicineDoseCard
                                                key={dose.id}
                                                medicine={dose}
                                                scheduleId={dose.scheduleId}
                                                onToggle={toggle}
                                                onDelete={remove}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Modal */}
            <CreateScheduleModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleSave}
            />

            {/* Bottom Note */}
            {allDoses.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-gray-700 py-6">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Session Active</span>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
