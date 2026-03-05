import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const severityConfig = {
    mild: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'mild' },
    moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'moderate' },
    severe: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'severe' },
};

const riskConfig = {
    low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    high: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

const DrugInteractions = ({ interactions }) => {
    const { t } = useTranslation();

    if (!interactions) return null;
    if (interactions.error) {
        return (
            <div className="glass-card p-5">
                <p className="text-gray-400 text-sm">{interactions.error}</p>
            </div>
        );
    }

    const hasInteractions = interactions.interactions?.length > 0;
    const risk = interactions.overallRisk?.toLowerCase() || 'low';
    const riskStyle = riskConfig[risk] || riskConfig.low;

    return (
        <div className="glass-card p-5 space-y-4 fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <AlertCircle size={20} className="text-purple-400" />
                    </div>
                    <h3 className="text-white font-bold">{t('interactions.title')}</h3>
                </div>
                {/* Overall risk badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-semibold ${riskStyle.bg} ${riskStyle.color}`}>
                    <ShieldCheck size={14} />
                    {t('interactions.overallRisk')}: {interactions.overallRisk || 'Low'}
                </div>
            </div>

            {/* Summary */}
            {interactions.summary && (
                <p className="text-gray-400 text-sm border-l-2 border-purple-400/30 pl-3">
                    {interactions.summary}
                </p>
            )}

            {/* No interactions */}
            {!hasInteractions && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <ShieldCheck size={20} className="text-emerald-400" />
                    <p className="text-emerald-400 text-sm font-medium">{t('interactions.noInteractions')}</p>
                </div>
            )}

            {/* Interaction cards */}
            {hasInteractions && (
                <div className="space-y-3">
                    {interactions.interactions.map((item, idx) => {
                        const sev = item.severity?.toLowerCase() || 'mild';
                        const sevStyle = severityConfig[sev] || severityConfig.mild;
                        return (
                            <div key={idx} className={`p-4 rounded-xl border ${sevStyle.bg}`}>
                                {/* Medicine pair */}
                                <div className="flex items-center gap-2 mb-3">
                                    {item.medicines?.map((med, mIdx) => (
                                        <span key={mIdx} className="flex items-center gap-1">
                                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold">{med}</span>
                                            {mIdx < item.medicines.length - 1 && <ArrowRight size={12} className="text-gray-500" />}
                                        </span>
                                    ))}
                                    <span className={`ml-auto badge text-xs ${sevStyle.color}`} style={{ background: 'transparent' }}>
                                        ⚠ {item.severity}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                                {item.recommendation && (
                                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/5">
                                        <span className="text-xs text-indigo-400 font-semibold">{t('interactions.recommendation')}:</span>
                                        <span className="text-xs text-gray-400">{item.recommendation}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DrugInteractions;
