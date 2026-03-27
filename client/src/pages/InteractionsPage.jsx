import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Plus, Trash2, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { medicineAPI } from '../api';
import DrugInteractions from '../components/DrugInteractions';
import { toast } from 'react-hot-toast';

const InteractionsPage = () => {
    const { t, i18n } = useTranslation();
    const [medicines, setMedicines] = useState(['', '']);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const handleAddMedicine = () => {
        if (medicines.length >= 10) return toast.error('Maximum 10 medicines allowed');
        setMedicines([...medicines, '']);
    };

    const handleRemoveMedicine = (index) => {
        const newMeds = [...medicines];
        newMeds.splice(index, 1);
        setMedicines(newMeds);
    };

    const handleUpdateMedicine = (index, value) => {
        const newMeds = [...medicines];
        newMeds[index] = value;
        setMedicines(newMeds);
    };

    const handleCheckInteractions = async () => {
        const validMeds = medicines.filter(m => m.trim().length > 0);
        if (validMeds.length < 2) {
            toast.error('Please enter at least two medicines');
            return;
        }

        setIsAnalyzing(true);
        try {
            const res = await medicineAPI.analyze(validMeds, i18n.language);
            if (res.success) {
                setResults(res.interactions);
                toast.success('Interaction check complete');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to check interactions');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const activeCount = medicines.filter(m => m.trim()).length;

    return (
        <div className="space-y-7 fade-in-up">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="badge badge-primary text-[10px]">Clinical Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <ShieldCheck className="text-indigo-400" size={28} />
                        Drug <span className="gradient-text">Interactions</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Check if your medications are safe to take together.</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* ── Input Panel ── */}
                <div className="xl:col-span-5 glass-card p-6 space-y-6 sticky top-6">
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-white flex items-center gap-2">
                                <Plus size={17} className="text-indigo-400" />
                                Medication List
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">Enter minimum 2 medications</p>
                        </div>
                        <span className={`badge text-[11px] ${activeCount >= 2 ? 'badge-success' : 'badge-primary'}`}>
                            {activeCount} Active
                        </span>
                    </div>

                    {/* Medicine Inputs */}
                    <div className="space-y-3">
                        {medicines.map((med, index) => (
                            <div key={index} className="group relative flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                                <input
                                    type="text"
                                    value={med}
                                    onChange={(e) => handleUpdateMedicine(index, e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddMedicine()}
                                    placeholder={`Medicine ${index + 1}, e.g. Warfarin`}
                                    className="input-field py-2.5 pr-10 text-sm"
                                />
                                {medicines.length > 2 && (
                                    <button
                                        onClick={() => handleRemoveMedicine(index)}
                                        className="absolute right-2.5 p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAddMedicine}
                            disabled={medicines.length >= 10}
                            className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-40"
                        >
                            <Plus size={16} />
                            Add Medicine
                        </button>
                        <button
                            onClick={handleCheckInteractions}
                            disabled={isAnalyzing || activeCount < 2}
                            className="btn-primary flex-[1.4] flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <div className="spinner !w-4 !h-4" />
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    Check Interactions
                                </>
                            )}
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/12 flex gap-3 items-start">
                        <AlertTriangle className="text-amber-500/50 shrink-0 mt-0.5" size={16} />
                        <p className="text-[11px] text-amber-500/60 leading-relaxed">
                            AI analysis is for informational purposes only. Always consult your doctor before changing medications.
                        </p>
                    </div>
                </div>

                {/* ── Results Panel ── */}
                <div className="xl:col-span-7">
                    {results ? (
                        <div className="fade-in-up space-y-4">
                            <h3 className="text-base font-bold text-white flex items-center gap-2.5 pl-1">
                                <Activity size={18} className="text-cyan-400" />
                                Analysis Results
                            </h3>
                            <DrugInteractions interactions={results} />
                        </div>
                    ) : (
                        <div className="min-h-[420px] border border-dashed border-white/8 bg-white/[0.01] rounded-[2rem] flex flex-col items-center justify-center p-10 text-center gap-5">
                            <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center">
                                <ShieldCheck className="text-gray-700" size={36} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white font-bold text-lg tracking-tight">Ready for Scan</h3>
                                <p className="text-gray-500 text-sm max-w-[260px] mx-auto leading-relaxed">
                                    Add at least two medications to evaluate clinical safety and risk factors.
                                </p>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {['Aspirin', 'Warfarin', 'Metformin'].map(ex => (
                                    <button
                                        key={ex}
                                        onClick={() => {
                                            const empty = medicines.findIndex(m => !m.trim());
                                            if (empty !== -1) handleUpdateMedicine(empty, ex);
                                            else if (medicines.length < 10) setMedicines(m => [...m, ex]);
                                        }}
                                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-indigo-500/40 transition-all"
                                    >
                                        + {ex}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractionsPage;
