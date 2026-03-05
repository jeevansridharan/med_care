const MedicineSchedule = require('../models/MedicineSchedule');

/**
 * POST /api/schedule/create
 * Create a new medicine schedule
 */
const createSchedule = async (req, res) => {
    try {
        const { patientName, scheduleEntries } = req.body;

        if (!scheduleEntries || !Array.isArray(scheduleEntries) || scheduleEntries.length === 0) {
            return res.status(400).json({ success: false, message: 'Schedule entries are required.' });
        }

        const schedule = new MedicineSchedule({
            patientName: patientName || 'Patient',
            scheduleEntries,
        });

        await schedule.save();

        res.status(201).json({
            success: true,
            message: 'Medicine schedule created successfully.',
            data: schedule,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/schedule/all
 * Get all schedules
 */
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await MedicineSchedule.find().sort({ createdAt: -1 });
        res.json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/schedule/:id
 * Get schedule by ID
 */
const getScheduleById = async (req, res) => {
    try {
        const schedule = await MedicineSchedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found.' });
        }
        res.json({ success: true, data: schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * PUT /api/schedule/:id
 * Update a schedule
 */
const updateSchedule = async (req, res) => {
    try {
        const schedule = await MedicineSchedule.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found.' });
        }
        res.json({ success: true, data: schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * DELETE /api/schedule/:id
 * Delete a schedule
 */
const deleteSchedule = async (req, res) => {
    try {
        const schedule = await MedicineSchedule.findByIdAndDelete(req.params.id);
        if (!schedule) {
            return res.status(404).json({ success: false, message: 'Schedule not found.' });
        }
        res.json({ success: true, message: 'Schedule deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createSchedule, getAllSchedules, getScheduleById, updateSchedule, deleteSchedule };
