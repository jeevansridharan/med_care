const mongoose = require('mongoose');

const medicineAnalysisSchema = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    purpose: {
        type: String,
        default: '',
    },
    benefits: {
        type: [String],
        default: [],
    },
    sideEffects: {
        type: [String],
        default: [],
    },
    warnings: {
        type: [String],
        default: [],
    },
    typicalDosage: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    language: {
        type: String,
        enum: ['en', 'ta'],
        default: 'en',
    },
    rawText: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const MedicineAnalysis = mongoose.model('MedicineAnalysis', medicineAnalysisSchema);
module.exports = MedicineAnalysis;
