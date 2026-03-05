import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();

    const toggleLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    const currentLang = i18n.language;

    return (
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            <button
                onClick={() => toggleLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${currentLang === 'en'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => toggleLanguage('ta')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${currentLang === 'ta'
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                style={{ fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" }}
            >
                தமிழ்
            </button>
        </div>
    );
};

export default LanguageSelector;
