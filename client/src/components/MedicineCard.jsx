import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Pill, ShieldAlert, CheckCircle, AlertTriangle, Syringe, BookOpen } from 'lucide-react';

const severityColor = {
    mild: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    severe: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const MedicineCard = ({ data, index }) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    if (!data) return null;
    if (data.error) {
        return (
            <div className="glass-card p-5 border-red-500/20 fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <ShieldAlert size={20} className="text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{data.medicine}</h3>
                        <p className="text-red-400 text-sm">{data.error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="glass-card overflow-hidden fade-in-up transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Card Header */}
            <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Pill size={22} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{data.medicine}</h3>
                        {data.category && (
                            <span className="badge badge-primary mt-1">{data.category}</span>
                        )}
                    </div>
                </div>
                <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
                    {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
            </div>

            {/* Purpose (always visible) */}
            {data.purpose && (
                <div className="px-5 pb-4">
                    <div className="flex items-start gap-2 text-gray-300 text-sm">
                        <BookOpen size={15} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p>{data.purpose}</p>
                    </div>
                </div>
            )}

            {/* Expanded Content */}
            {expanded && (
                <div className="border-t border-white/5 px-5 py-4 space-y-5">
                    {/* Benefits */}
                    {data.benefits?.length > 0 && (
                        <Section
                            icon={<CheckCircle size={16} className="text-emerald-400" />}
                            title={t('medicines.benefits')}
                            color="emerald"
                        >
                            <ul className="space-y-2">
                                {data.benefits.map((b, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {/* Side Effects */}
                    {data.sideEffects?.length > 0 && (
                        <Section
                            icon={<AlertTriangle size={16} className="text-amber-400" />}
                            title={t('medicines.sideEffects')}
                            color="amber"
                        >
                            <ul className="space-y-2">
                                {data.sideEffects.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {/* Warnings */}
                    {data.warnings?.length > 0 && (
                        <Section
                            icon={<ShieldAlert size={16} className="text-red-400" />}
                            title={t('medicines.warnings')}
                            color="red"
                        >
                            <ul className="space-y-2">
                                {data.warnings.map((w, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {/* Dosage */}
                    {data.typicalDosage && (
                        <Section
                            icon={<Syringe size={16} className="text-indigo-400" />}
                            title={t('medicines.dosage')}
                            color="indigo"
                        >
                            <p className="text-sm text-gray-300">{data.typicalDosage}</p>
                        </Section>
                    )}
                </div>
            )}
        </div>
    );
};

const Section = ({ icon, title, color, children }) => {
    const colorMap = {
        emerald: 'border-emerald-500/20 bg-emerald-500/3',
        amber: 'border-amber-500/20 bg-amber-500/3',
        red: 'border-red-500/20 bg-red-500/3',
        indigo: 'border-indigo-500/20 bg-indigo-500/3',
    };
    return (
        <div className={`rounded-xl p-4 border ${colorMap[color]}`}>
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h4 className="text-sm font-semibold text-white">{title}</h4>
            </div>
            {children}
        </div>
    );
};

export default MedicineCard;
