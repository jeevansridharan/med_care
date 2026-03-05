const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    uploadAndExtract,
    extractFromText,
    analyzeMedicines,
    saveMedicineAnalysis,
    getMedicineHistory,
} = require('../controllers/medicineController');

// POST /api/medicine/upload - Upload file and extract medicine names
router.post('/upload', upload.single('file'), uploadAndExtract);

// POST /api/medicine/extract - Extract medicines from plain text
router.post('/extract', extractFromText);

// POST /api/medicine/analyze - AI-powered medicine analysis
router.post('/analyze', analyzeMedicines);

// POST /api/medicine/save - Save analysis to database
router.post('/save', saveMedicineAnalysis);

// GET /api/medicine/history - Get history (with pagination & search)
router.get('/history', getMedicineHistory);

module.exports = router;
