import { useTranslation } from 'react-i18next';
import { Pill, Trash2, Beaker } from 'lucide-react';

const MedicineList = ({ medicines, onAnalyze, onRemove, isAnalyzing }) => {
    const { t } = useTranslation();

    if (!medicines || medicines.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Pill size={16} className="text-cyan-400" />
                    </div>
                    <h2 className="text-white font-semibold">
                        {t('medicines.found')}
                        <span className="ml-2 badge badge-primary">{medicines.length}</span>
                    </h2>
                </div>
            </div>

            {/* Medicine tags */}
            <div className="flex flex-wrap gap-2">
                {medicines.map((med, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-indigo-400/40 transition-colors group"
                    >
                        <Pill size={13} className="text-indigo-400" />
                        <span>{med}</span>
                        {onRemove && (
                            <button
                                onClick={() => onRemove(idx)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all ml-1"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Analyze button */}
            <button
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5"
            >
                {isAnalyzing ? (
                    <>
                        <div className="spinner" style={{ width: 20, height: 20 }} />
                        {t('medicines.analyzing')}
                    </>
                ) : (
                    <>
                        <Beaker size={20} />
                        {t('medicines.analyze')}
                    </>
                )}
            </button>
        </div>
    );
};

export default MedicineList;
