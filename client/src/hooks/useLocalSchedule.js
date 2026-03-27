import { useState, useCallback } from 'react';

const STORAGE_KEY = 'med_schedules';

/* ─── Pure helpers ────────────────────────────────────────────────────────── */

/** Read all schedules from localStorage. Always returns an array. */
export const getSchedules = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

/**
 * Save a new schedule entry.
 * @param {string}   patientName      - Name of the patient
 * @param {Object[]} scheduleEntries  - Array of { medicineName, time, dosage, notes }
 * @returns {Object} The saved schedule object
 */
export const addSchedule = (patientName, scheduleEntries) => {
    const existing = getSchedules();
    const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        patientName: patientName || 'Patient',
        scheduleEntries: scheduleEntries.map(e => ({
            ...e,
            id: `dose-${Math.random().toString(36).slice(2, 9)}`,
            taken: false // Default status
        })),
        createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
};

/** Toggle taken/pending for a specific dose */
export const toggleDoseStatus = (scheduleId, doseId) => {
    const schedules = getSchedules();
    const updated = schedules.map(s => {
        if (s.id !== scheduleId) return s;
        return {
            ...s,
            scheduleEntries: s.scheduleEntries.map(e =>
                e.id === doseId ? { ...e, taken: !e.taken } : e
            )
        };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

/** Wipe all schedules. */
export const clearSchedules = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};

/* ─── React hook ─────────────────────────────────────────────────────────── */

/**
 * Reactive hook for medication schedules stored in localStorage.
 * Returns: { schedules, add, remove, toggle, clear }
 */
const useLocalSchedule = () => {
    const [schedules, setSchedules] = useState(() => getSchedules());

    const add = useCallback((patientName, scheduleEntries) => {
        addSchedule(patientName, scheduleEntries);
        setSchedules(getSchedules());
    }, []);

    const remove = useCallback((id) => {
        setSchedules(removeSchedule(id));
    }, []);

    const toggle = useCallback((scheduleId, doseId) => {
        setSchedules(toggleDoseStatus(scheduleId, doseId));
    }, []);

    const clear = useCallback(() => {
        setSchedules(clearSchedules());
    }, []);

    return { schedules, add, remove, toggle, clear };
};

export default useLocalSchedule;
