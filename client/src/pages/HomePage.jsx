import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { Save, Sparkles } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import MedicineList from '../components/MedicineList';
import MedicineCard from '../components/MedicineCard';
import DrugInteractions from '../components/DrugInteractions';
import LanguageSelector from '../components/LanguageSelector';
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
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4 py-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <span className="text-3xl">💊</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black gradient-text">
                    {t('appName')}
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">{t('tagline')}</p>
                <div className="flex justify-center">
                    <LanguageSelector />
                </div>
            </div>

            {/* Step 1: Upload */}
            {step >= 1 && (
                <div className="glass-card p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">1</div>
                        <h2 className="text-white font-bold text-lg">{t('upload.title')}</h2>
                    </div>
                    <p className="text-gray-400 text-sm">{t('upload.subtitle')}</p>
                    <ImageUploader
                        onFileAccepted={handleFileAccepted}
                        onTextSubmit={handleTextSubmit}
                        isLoading={isExtracting}
                    />
                </div>
            )}

            {/* Step 2: Medicine List */}
            {step >= 2 && medicines.length > 0 && (
                <div className="glass-card p-6 space-y-4 fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">2</div>
                        <h2 className="text-white font-bold text-lg">{t('medicines.found')}</h2>
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
                <div className="space-y-4 fade-in-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">3</div>
                            <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                <Sparkles size={18} className="text-indigo-400" />
                                AI Analysis Results
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveAll}
                                disabled={isSaving}
                                className="btn-secondary text-sm flex items-center gap-2 py-2"
                            >
                                <Save size={15} />
                                {isSaving ? 'Saving...' : t('medicines.saveAll')}
                            </button>
                            <button onClick={handleReset} className="btn-secondary text-sm py-2">
                                Start Over
                            </button>
                        </div>
                    </div>

                    {/* Interaction panel */}
                    {interactions && <DrugInteractions interactions={interactions} />}

                    {/* Medicine cards */}
                    <div className="space-y-3">
                        {analysisResults.map((result, idx) =>
                            result.success ? (
                                <MedicineCard key={idx} data={result.data} index={idx} />
                            ) : (
                                <div key={idx} className="glass-card p-4 border-red-500/20">
                                    <p className="text-red-400 text-sm">
                                        ❌ {result.medicine || 'Unknown'}: {result.error}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
