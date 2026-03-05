import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Plus, Trash2, Sparkles, ShieldCheck } from 'lucide-react';
import { medicineAPI } from '../api';
import DrugInteractions from '../components/DrugInteractions';
import { toast } from 'react-hot-toast';

const InteractionsPage = () => {
    const { t, i18n } = useTranslation();
    const [medicines, setMedicines] = useState(['', '']);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);

    const handleAddMedicine = () => {
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

    return (
        <div className="space-y-8 fade-in-up">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <ShieldCheck className="text-indigo-400" size={32} />
                    Drug <span className="gradient-text">Interactions</span>
                </h1>
                <p className="text-gray-400">Check if your medications safe to take together using our AI Clinical Engine.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Input Panel */}
                <div className="xl:col-span-5 glass-card p-10 space-y-8 sticky top-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Plus size={20} className="text-indigo-400" />
                                Medication List
                            </h2>
                            <p className="text-xs text-gray-500">Minimum 2 required for check</p>
                        </div>
                        <span className="badge badge-primary px-3 py-1.5">
                            {medicines.filter(m => m).length} Active
                        </span>
                    </div>

                    <div className="space-y-4">
                        {medicines.map((med, index) => (
                            <div key={index} className="group relative flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500 group-focus-within:border-indigo-500/50 transition-colors">
                                    0{index + 1}
                                </div>
                                <input
                                    type="text"
                                    value={med}
                                    onChange={(e) => handleUpdateMedicine(index, e.target.value)}
                                    placeholder="e.g. Warfarin"
                                    className="input-field py-2.5 pr-12"
                                />
                                {medicines.length > 2 && (
                                    <button
                                        onClick={() => handleRemoveMedicine(index)}
                                        className="absolute right-3 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={handleAddMedicine}
                            className="btn-secondary flex-1 flex items-center justify-center gap-2 py-4 shadow-sm"
                        >
                            <Plus size={18} />
                            Add Medicine
                        </button>
                        <button
                            onClick={handleCheckInteractions}
                            disabled={isAnalyzing}
                            className="btn-primary flex-[1.5] flex items-center justify-center gap-2 py-4"
                        >
                            {isAnalyzing ? (
                                <div className="spinner !w-5 !h-5 !border-white/20 !border-top-white" />
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Check Interactions
                                </>
                            )}
                        </button>
                    </div>

                    <div className="p-5 rounded-3xl bg-amber-500/[0.03] border border-amber-500/10 flex gap-4">
                        <AlertTriangle className="text-amber-500/60 shrink-0 mt-0.5" size={20} />
                        <p className="text-[11px] text-amber-500/60 leading-relaxed font-medium">
                            AI Clinical Engine analysis is for informational purposes. Consult your doctor before changing meds.
                        </p>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="xl:col-span-7 space-y-6">
                    {results ? (
                        <div className="fade-in-up">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 ml-2">
                                <Activity size={20} className="text-cyan-400" />
                                Analysis Results
                            </h3>
                            <DrugInteractions interactions={results} />
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] border border-dashed border-white/10 bg-white/[0.01] rounded-[3rem] flex flex-col items-center justify-center p-12 text-center gap-6 group">
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                <AlertTriangle className="text-gray-700" size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Ready for Scan</h3>
                                <p className="text-gray-500 text-sm max-w-[300px] mx-auto leading-relaxed">Add at least two medications to evaluate clinical safety and risk factors.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractionsPage;
