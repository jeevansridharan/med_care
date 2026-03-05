const path = require('path');
const fs = require('fs');
const { extractTextFromImage, extractTextFromPDF, extractTextFromTxt, parseMedicineNames } = require('../utils/ocr');
const { analyzeMedicine, checkDrugInteractions, translateToTamil } = require('../utils/openai');
const MedicineAnalysis = require('../models/MedicineAnalysis');

/**
 * POST /api/medicine/upload
 * Upload a file and extract medicine names via OCR
 */
const uploadAndExtract = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        const mimeType = req.file.mimetype;
        let rawText = '';

        // Extract text based on file type
        if (mimeType.startsWith('image/')) {
            rawText = await extractTextFromImage(filePath);
        } else if (mimeType === 'application/pdf') {
            rawText = await extractTextFromPDF(filePath);
        } else if (mimeType === 'text/plain') {
            rawText = await extractTextFromTxt(filePath);
        } else {
            return res.status(400).json({ success: false, message: 'Unsupported file type.' });
        }

        // Clean up uploaded file after extraction
        fs.unlink(filePath, (err) => { if (err) console.warn('Failed to delete temp file:', err.message); });

        const medicines = parseMedicineNames(rawText);

        if (medicines.length === 0) {
            return res.status(422).json({
                success: false,
                message: 'No medicine names could be extracted from the file.',
                rawText: rawText.substring(0, 500),
            });
        }

        res.json({
            success: true,
            rawText: rawText.substring(0, 1000),
            medicines,
            count: medicines.length,
        });
    } catch (error) {
        console.error('Upload/Extract Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/medicine/extract
 * Extract medicines from plain text (no file)
 */
const extractFromText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ success: false, message: 'Text input is required.' });
        }

        const medicines = parseMedicineNames(text);
        res.json({ success: true, medicines, count: medicines.length });
    } catch (error) {
        console.error('Extract Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/medicine/analyze
 * Analyze medicines using OpenAI
 */
const analyzeMedicines = async (req, res) => {
    try {
        const { medicines, language = 'en' } = req.body;

        if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ success: false, message: 'Medicines array is required.' });
        }

        if (medicines.length > 10) {
            return res.status(400).json({ success: false, message: 'Maximum 10 medicines per request.' });
        }

        // Analyze each medicine in parallel
        const analysisPromises = medicines.map(async (name) => {
            try {
                let result = await analyzeMedicine(name, language);

                // If English requested, also save English version; if Tamil, translate from English
                if (language === 'ta' && !result.error) {
                    // Re-analyze in English to save the English version, then translate
                    const englishResult = await analyzeMedicine(name, 'en');
                    result = await translateToTamil(englishResult);
                }

                return { success: true, data: result };
            } catch (err) {
                return { success: false, medicine: name, error: err.message };
            }
        });

        const results = await Promise.all(analysisPromises);

        // Check drug interactions if multiple medicines
        let interactions = null;
        const validMedicines = results.filter(r => r.success && !r.data.error).map(r => r.data.medicine || r.data.medicineName);

        if (validMedicines.length >= 2) {
            try {
                interactions = await checkDrugInteractions(validMedicines, language);
            } catch (err) {
                console.warn('Drug interaction check failed:', err.message);
                interactions = { error: 'Interaction check unavailable', interactions: [] };
            }
        }

        res.json({
            success: true,
            results,
            interactions,
            language,
        });
    } catch (error) {
        console.error('Analyze Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/medicine/save
 * Save medicine analysis to database
 */
const saveMedicineAnalysis = async (req, res) => {
    try {
        const { medicineName, purpose, benefits, sideEffects, warnings, typicalDosage, category, language, rawText } = req.body;

        if (!medicineName) {
            return res.status(400).json({ success: false, message: 'Medicine name is required.' });
        }

        const analysis = new MedicineAnalysis({
            medicineName,
            purpose: purpose || '',
            benefits: benefits || [],
            sideEffects: sideEffects || [],
            warnings: warnings || [],
            typicalDosage: typicalDosage || '',
            category: category || '',
            language: language || 'en',
            rawText: rawText || '',
        });

        await analysis.save();

        res.status(201).json({
            success: true,
            message: 'Medicine analysis saved successfully.',
            data: analysis,
        });
    } catch (error) {
        console.error('Save Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/medicine/history
 * Retrieve past medicine analyses
 */
const getMedicineHistory = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', language = '' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {};
        if (search) query.medicineName = { $regex: search, $options: 'i' };
        if (language) query.language = language;

        const [analyses, total] = await Promise.all([
            MedicineAnalysis.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            MedicineAnalysis.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: analyses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('History Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { uploadAndExtract, extractFromText, analyzeMedicines, saveMedicineAnalysis, getMedicineHistory };
