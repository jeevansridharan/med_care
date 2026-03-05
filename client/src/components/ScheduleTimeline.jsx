import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Clock, Save, CheckCheck } from 'lucide-react';

const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'night'];

const TIME_ICONS = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
};

const ScheduleTimeline = ({ onSave }) => {
    const { t } = useTranslation();
    const [patientName, setPatientName] = useState('');
    const [entries, setEntries] = useState([
        { medicineName: '', time: 'morning', dosage: '', notes: '' },
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const addEntry = () => {
        setEntries([...entries, { medicineName: '', time: 'morning', dosage: '', notes: '' }]);
    };

    const removeEntry = (idx) => {
        setEntries(entries.filter((_, i) => i !== idx));
    };

    const updateEntry = (idx, field, value) => {
        const updated = [...entries];
        updated[idx] = { ...updated[idx], [field]: value };
        setEntries(updated);
    };

    const handleSave = async () => {
        const validEntries = entries.filter(e => e.medicineName.trim());
        if (validEntries.length === 0) return;

        setIsSaving(true);
        try {
            await onSave({ patientName: patientName || 'Patient', scheduleEntries: validEntries });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    // Group entries by time slot for timeline view
    const groupedByTime = TIME_SLOTS.reduce((acc, slot) => {
        acc[slot] = entries.filter(e => e.time === slot && e.medicineName.trim());
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Patient Name */}
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t('schedule.patientName')}
                </label>
                <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="input-field"
                />
            </div>

            {/* Entries */}
            <div className="space-y-4">
                {entries.map((entry, idx) => (
                    <div key={idx} className="glass-card p-6 fade-in-up relative group/entry">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">
                                Medicine #{idx + 1}
                            </span>
                            {entries.length > 1 && (
                                <button
                                    onClick={() => removeEntry(idx)}
                                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover/entry:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-5">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{t('schedule.medicineName')}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={entry.medicineName}
                                        onChange={(e) => updateEntry(idx, 'medicineName', e.target.value)}
                                        placeholder="e.g. Advil"
                                        className="input-field text-sm py-2.5"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-4">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{t('schedule.time')}</label>
                                <select
                                    value={entry.time}
                                    onChange={(e) => updateEntry(idx, 'time', e.target.value)}
                                    className="input-field text-sm py-2.5 cursor-pointer"
                                >
                                    {TIME_SLOTS.map(slot => (
                                        <option key={slot} value={slot}>
                                            {TIME_ICONS[slot]} {t(`schedule.${slot}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{t('schedule.dosage')}</label>
                                <input
                                    type="text"
                                    value={entry.dosage}
                                    onChange={(e) => updateEntry(idx, 'dosage', e.target.value)}
                                    placeholder="500mg"
                                    className="input-field text-sm py-2.5"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{t('schedule.notes')}</label>
                            <input
                                type="text"
                                value={entry.notes}
                                onChange={(e) => updateEntry(idx, 'notes', e.target.value)}
                                placeholder="After food, with milk, etc."
                                className="input-field text-sm py-2.5 bg-white/[0.02]"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add / Save buttons */}
            <div className="flex gap-3">
                <button
                    onClick={addEntry}
                    className="btn-secondary flex items-center gap-2 text-sm"
                >
                    <Plus size={16} />
                    {t('schedule.addEntry')}
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving || entries.every(e => !e.medicineName.trim())}
                    className="btn-primary flex items-center gap-2 text-sm flex-1"
                >
                    {saved ? (
                        <><CheckCheck size={16} /> {t('schedule.saved')}</>
                    ) : isSaving ? (
                        <><div className="spinner" style={{ width: 16, height: 16 }} /> Saving...</>
                    ) : (
                        <><Save size={16} /> {t('schedule.save')}</>
                    )}
                </button>
            </div>

            {/* Timeline Preview */}
            {Object.values(groupedByTime).some(arr => arr.length > 0) && (
                <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Clock size={16} className="text-cyan-400" />
                        Schedule Preview
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TIME_SLOTS.map(slot => {
                            const slotEntries = groupedByTime[slot];
                            if (slotEntries.length === 0) return null;
                            return (
                                <div key={slot} className="glass-card p-3 border-indigo-500/10">
                                    <div className="text-center mb-3">
                                        <div className="text-2xl mb-1">{TIME_ICONS[slot]}</div>
                                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            {t(`schedule.${slot}`)}
                                        </div>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {slotEntries.map((e, i) => (
                                            <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-white text-xs font-medium">{e.medicineName}</p>
                                                    {e.dosage && <p className="text-gray-500 text-xs">{e.dosage}</p>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleTimeline;
