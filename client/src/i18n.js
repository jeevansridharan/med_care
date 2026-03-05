import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            // Navigation
            appName: 'AI Medicine Explainer',
            tagline: 'Understand your medicines. Stay safe.',
            nav: {
                home: 'Home',
                history: 'History',
                schedule: 'Schedule',
                interactions: 'Interactions',
                about: 'About',
            },
            // Upload
            upload: {
                title: 'Upload Medicine List',
                subtitle: 'Upload an image, PDF, or text file containing medicine names',
                dragDrop: 'Drag & drop your file here, or click to browse',
                supported: 'Supported: JPG, PNG, PDF, TXT (max 10MB)',
                orType: 'Or type medicine names directly',
                textPlaceholder: 'Enter medicine names, one per line...',
                button: 'Extract Medicines',
                analyzing: 'Extracting...',
                processing: 'Processing file...',
                uploadFile: 'Upload File',
                typeText: 'Type Text',
            },
            // Medicines
            medicines: {
                found: 'Medicines Found',
                analyze: 'Analyze All Medicines',
                analyzing: 'Analyzing with AI...',
                purpose: 'Purpose',
                benefits: 'Benefits',
                sideEffects: 'Side Effects',
                warnings: 'Warnings',
                dosage: 'Typical Dosage',
                category: 'Category',
                saveAll: 'Save All to History',
                saved: 'Saved!',
            },
            // Interactions
            interactions: {
                title: 'Drug Interactions',
                noInteractions: 'No significant drug interactions detected.',
                severity: 'Severity',
                description: 'Description',
                recommendation: 'Recommendation',
                overallRisk: 'Overall Risk',
                mild: 'Mild',
                moderate: 'Moderate',
                severe: 'Severe',
                low: 'Low',
                high: 'High',
            },
            // Schedule
            schedule: {
                title: 'Medicine Schedule',
                subtitle: 'Plan when to take your medicines',
                patientName: 'Patient Name',
                addEntry: 'Add Medicine',
                medicineName: 'Medicine Name',
                time: 'Time of Day',
                dosage: 'Dosage',
                notes: 'Notes',
                morning: 'Morning',
                afternoon: 'Afternoon',
                evening: 'Evening',
                night: 'Night',
                save: 'Save Schedule',
                saved: 'Schedule Saved!',
                mySchedules: 'My Schedules',
                noSchedules: 'No schedules saved yet.',
            },
            // History
            history: {
                title: 'Medicine History',
                subtitle: 'Previously analyzed medicines',
                search: 'Search medicine...',
                noHistory: 'No medicine history found.',
                analyzedOn: 'Analyzed on',
            },
            // Language
            language: {
                select: 'Language',
                en: 'English',
                ta: 'Tamil',
            },
            // Common
            common: {
                loading: 'Loading...',
                error: 'An error occurred',
                retry: 'Try Again',
                close: 'Close',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                back: 'Back',
                next: 'Next',
            },
        },
    },
    ta: {
        translation: {
            // Navigation
            appName: 'AI மருந்து விளக்கி',
            tagline: 'உங்கள் மருந்துகளை புரிந்துகொள்ளுங்கள். பாதுகாப்பாக இருங்கள்.',
            nav: {
                home: 'முகப்பு',
                history: 'வரலாறு',
                schedule: 'அட்டவணை',
                interactions: 'இடைவினைகள்',
                about: 'பற்றி',
            },
            // Upload
            upload: {
                title: 'மருந்து பட்டியலை பதிவேற்றவும்',
                subtitle: 'மருந்து பெயர்கள் கொண்ட படம், PDF அல்லது உரை கோப்பை பதிவேற்றவும்',
                dragDrop: 'இங்கே கோப்பை இழுத்து விடவும் அல்லது தேர்வு செய்யவும்',
                supported: 'ஆதரவு: JPG, PNG, PDF, TXT (அதிகபட்சம் 10MB)',
                orType: 'அல்லது நேரடியாக மருந்து பெயர்களை தட்டச்சு செய்யவும்',
                textPlaceholder: 'மருந்து பெயர்களை உள்ளிடவும், ஒவ்வொரு வரியிலும்...',
                button: 'மருந்துகளை பிரித்தெடுக்கவும்',
                analyzing: 'பிரித்தெடுக்கிறது...',
                processing: 'கோப்பு செயலாக்கப்படுகிறது...',
                uploadFile: 'கோப்பு பதிவேற்று',
                typeText: 'உரை தட்டச்சு',
            },
            // Medicines
            medicines: {
                found: 'மருந்துகள் கண்டுபிடிக்கப்பட்டன',
                analyze: 'அனைத்து மருந்துகளையும் பகுப்பாய்வு செய்யவும்',
                analyzing: 'AI உடன் பகுப்பாய்வு செய்கிறது...',
                purpose: 'நோக்கம்',
                benefits: 'நன்மைகள்',
                sideEffects: 'பக்க விளைவுகள்',
                warnings: 'எச்சரிக்கைகள்',
                dosage: 'வழக்கமான டோஸ்',
                category: 'வகை',
                saveAll: 'அனைத்தையும் வரலாற்றில் சேமிக்கவும்',
                saved: 'சேமிக்கப்பட்டது!',
            },
            // Interactions
            interactions: {
                title: 'மருந்து இடைவினைகள்',
                noInteractions: 'குறிப்பிடத்தக்க மருந்து இடைவினைகள் கண்டுபிடிக்கப்படவில்லை.',
                severity: 'தீவிரம்',
                description: 'விளக்கம்',
                recommendation: 'பரிந்துரை',
                overallRisk: 'ஒட்டுமொத்த ஆபத்து',
                mild: 'லேசான',
                moderate: 'மிதமான',
                severe: 'தீவிரமான',
                low: 'குறைந்த',
                high: 'அதிக',
            },
            // Schedule
            schedule: {
                title: 'மருந்து அட்டவணை',
                subtitle: 'உங்கள் மருந்துகளை எப்போது எடுக்க வேண்டும் என்று திட்டமிடுங்கள்',
                patientName: 'நோயாளி பெயர்',
                addEntry: 'மருந்து சேர்க்கவும்',
                medicineName: 'மருந்து பெயர்',
                time: 'நேரம்',
                dosage: 'டோஸ்',
                notes: 'குறிப்புகள்',
                morning: 'காலை',
                afternoon: 'மதியம்',
                evening: 'மாலை',
                night: 'இரவு',
                save: 'அட்டவணையை சேமிக்கவும்',
                saved: 'அட்டவணை சேமிக்கப்பட்டது!',
                mySchedules: 'என் அட்டவணைகள்',
                noSchedules: 'இன்னும் அட்டவணைகள் சேமிக்கப்படவில்லை.',
            },
            // History
            history: {
                title: 'மருந்து வரலாறு',
                subtitle: 'முன்பு பகுப்பாய்வு செய்யப்பட்ட மருந்துகள்',
                search: 'மருந்தை தேடுங்கள்...',
                noHistory: 'மருந்து வரலாறு கிடைக்கவில்லை.',
                analyzedOn: 'பகுப்பாய்வு செய்யப்பட்டது',
            },
            // Language
            language: {
                select: 'மொழி',
                en: 'English',
                ta: 'தமிழ்',
            },
            // Common
            common: {
                loading: 'ஏற்றுகிறது...',
                error: 'பிழை ஏற்பட்டது',
                retry: 'மீண்டும் முயற்சிக்கவும்',
                close: 'மூடு',
                save: 'சேமி',
                delete: 'நீக்கு',
                edit: 'திருத்து',
                back: 'திரும்பு',
                next: 'அடுத்து',
            },
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18n;
