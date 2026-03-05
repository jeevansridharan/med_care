const express = require('express');
const router = express.Router();
const {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
} = require('../controllers/scheduleController');

// POST /api/schedule/create
router.post('/create', createSchedule);

// GET /api/schedule/all
router.get('/all', getAllSchedules);

// GET /api/schedule/:id
router.get('/:id', getScheduleById);

// PUT /api/schedule/:id
router.put('/:id', updateSchedule);

// DELETE /api/schedule/:id
router.delete('/:id', deleteSchedule);

module.exports = router;
