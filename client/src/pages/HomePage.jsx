import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Save, Sparkles, UploadCloud, Activity } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MedicineList from '../components/MedicineList';
import MedicineCard from '../components/MedicineCard';
import DrugInteractions from '../components/DrugInteractions';
import { medicineAPI } from '../api';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const [isExtracting, setIsExtracting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [interactions, setInteractions] = useState(null);
    const [step, setStep] = useState(1); // 1=upload, 2=list, 3=results

    const handleFileAccepted = async (file) => {
        setIsExtracting(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await medicineAPI.uploadFile(formData);
            if (res.success) {
                setMedicines(res.medicines);
                setStep(2);
                toast.success(`${res.count} medicine${res.count !== 1 ? 's' : ''} extracted!`);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to extract medicines');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleTextSubmit = async (text) => {
        setIsExtracting(true);
        try {
            const res = await medicineAPI.extractFromText(text);
            if (res.success) {
                setMedicines(res.medicines);
                setStep(2);
                toast.success(`${res.count} medicine${res.count !== 1 ? 's' : ''} found!`);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to extract medicines');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResults([]);
        setInteractions(null);
        try {
            const res = await medicineAPI.analyze(medicines, i18n.language);
            if (res.success) {
                setAnalysisResults(res.results);
                setInteractions(res.interactions);
                setStep(3);
                toast.success('Analysis complete!');
            }
        } catch (err) {
            toast.error(err.message || 'Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRemoveMedicine = (idx) => {
        setMedicines(medicines.filter((_, i) => i !== idx));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const successful = analysisResults.filter(r => r.success && !r.data?.error);
            await Promise.all(
                successful.map(r => medicineAPI.save({
                    ...r.data,
                    language: i18n.language,
                }))
            );
            toast.success(`${successful.length} medicine${successful.length !== 1 ? 's' : ''} saved to history!`);
        } catch (err) {
            toast.error('Failed to save some medicines');
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setMedicines([]);
        setAnalysisResults([]);
        setInteractions(null);
        setStep(1);
    };

    return (
        <div className="space-y-7 fade-in-up">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <Activity className="text-indigo-400" size={28} />
                        Analyze <span className="gradient-text">Medications</span>
                    </h1>
                    <p className="text-gray-500 text-sm">Upload prescriptions or enter names to get AI-powered medical insights.</p>
                </div>

                {step > 1 && (
                    <button onClick={handleReset} className="btn-secondary text-xs font-bold uppercase tracking-wider px-4 py-2">
                        Reset Analysis
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Step 1: Upload */}
                {step === 1 && (
                    <div className="glass-card p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <UploadCloud className="text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-xl">{t('upload.title')}</h2>
                                <p className="text-gray-500 text-sm">{t('upload.subtitle')}</p>
                            </div>
                        </div>

                        <div className="p-1 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10">
                            <ImageUploader
                                onFileAccepted={handleFileAccepted}
                                onTextSubmit={handleTextSubmit}
                                isLoading={isExtracting}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Medicine List */}
                {step === 2 && medicines.length > 0 && (
                    <div className="glass-card p-8 space-y-6 fade-in-up">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <Activity className="text-cyan-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-xl">{t('medicines.found')}</h2>
                                    <p className="text-gray-500 text-sm">Review the list before starting AI analysis.</p>
                                </div>
                            </div>
                            <span className="badge badge-primary">{medicines.length} Found</span>
                        </div>

                        <MedicineList
                            medicines={medicines}
                            onAnalyze={handleAnalyze}
                            onRemove={handleRemoveMedicine}
                            isAnalyzing={isAnalyzing}
                        />
                    </div>
                )}

                {/* Step 3: Results */}
                {step === 3 && analysisResults.length > 0 && (
                    <div className="space-y-6 fade-in-up">
                        <div className="flex items-center justify-between p-2">
                            <h2 className="text-white font-bold text-xl flex items-center gap-3">
                                <Sparkles size={24} className="text-indigo-400" />
                                AI Medical Insights
                            </h2>
                            <button
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                className="btn-primary text-sm flex items-center gap-2 py-2 px-6"
                            >
                                <Save size={16} />
                                {isSaving ? 'Saving...' : t('medicines.saveAll')}
                            </button>
                        </div>

                        {/* Interaction panel */}
                        {interactions && <DrugInteractions interactions={interactions} />}

                        {/* Medicine cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysisResults.map((result, idx) =>
                                result.success ? (
                                    <MedicineCard key={idx} data={result.data} index={idx} />
                                ) : (
                                    <div key={idx} className="glass-card p-6 border-red-500/20 bg-red-500/5">
                                        <p className="text-red-400 text-sm font-medium">
                                            ❌ Error analyzing {result.medicine || 'Unknown'}:
                                        </p>
                                        <p className="text-red-400/70 text-xs mt-1">{result.error}</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
