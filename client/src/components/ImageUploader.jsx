import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { CloudUpload, FileText, Image, File, X, CheckCircle } from 'lucide-react';

const ImageUploader = ({ onFileAccepted, onTextSubmit, isLoading }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState('file'); // 'file' | 'text'
    const [textInput, setTextInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file);
            onFileAccepted(file);
        }
    }, [onFileAccepted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
        disabled: isLoading,
    });

    const getFileIcon = (file) => {
        if (!file) return null;
        if (file.type.startsWith('image/')) return <Image size={28} className="text-cyan-400" />;
        if (file.type === 'application/pdf') return <File size={28} className="text-red-400" />;
        return <FileText size={28} className="text-indigo-400" />;
    };

    const handleTextSubmit = () => {
        if (textInput.trim()) {
            onTextSubmit(textInput);
        }
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
    };

    return (
        <div className="space-y-4">
            {/* Mode tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
                <button
                    onClick={() => setMode('file')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'file'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <CloudUpload size={16} />
                    {t('upload.uploadFile')}
                </button>
                <button
                    onClick={() => setMode('text')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'text'
                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <FileText size={16} />
                    {t('upload.typeText')}
                </button>
            </div>

            {mode === 'file' ? (
                <div>
                    <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive
                                ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                                : selectedFile
                                    ? 'border-green-400/50 bg-green-500/5'
                                    : 'border-white/15 hover:border-indigo-400/50 hover:bg-indigo-500/5'
                            }`}
                    >
                        <input {...getInputProps()} />

                        {selectedFile ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                        {getFileIcon(selectedFile)}
                                    </div>
                                    <button
                                        onClick={clearFile}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">{selectedFile.name}</p>
                                    <p className="text-gray-500 text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                                    <CheckCircle size={16} />
                                    File ready to process
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className={`w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center transition-all duration-300 ${isDragActive ? 'scale-110 bg-indigo-500/20' : ''}`}>
                                    <CloudUpload size={32} className="text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-lg">
                                        {isDragActive ? 'Drop your file here' : t('upload.dragDrop')}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">{t('upload.supported')}</p>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="spinner" />
                                    <p className="text-indigo-400 text-sm font-medium">{t('upload.processing')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={t('upload.textPlaceholder')}
                        rows={6}
                        className="input-field resize-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleTextSubmit}
                        disabled={isLoading || !textInput.trim()}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner" style={{ width: 18, height: 18 }} />
                                {t('upload.analyzing')}
                            </>
                        ) : (
                            <>
                                <FileText size={18} />
                                {t('upload.button')}
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
