const mongoose = require('mongoose');

const scheduleEntrySchema = new mongoose.Schema({
    medicineName: { type: String, required: true, trim: true },
    time: { type: String, required: true }, // 'morning' | 'afternoon' | 'evening' | 'night'
    customTime: { type: String, default: '' }, // Optional HH:MM
    dosage: { type: String, default: '' },
    notes: { type: String, default: '' },
});

const medicineScheduleSchema = new mongoose.Schema({
    patientName: {
        type: String,
        default: 'Patient',
        trim: true,
    },
    scheduleEntries: [scheduleEntrySchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

medicineScheduleSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const MedicineSchedule = mongoose.model('MedicineSchedule', medicineScheduleSchema);
module.exports = MedicineSchedule;
