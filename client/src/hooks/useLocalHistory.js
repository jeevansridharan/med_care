import { useState, useCallback } from 'react';

const STORAGE_KEY = 'med_analysis_history';

/* ─── Pure helpers (no React) ────────────────────────────────────────────── */

/** Read all items from localStorage. Always returns an array. */
export const getHistory = () => {
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
 * Save a single analysis entry to history.
 * @param {string}   input     - The medicine name(s) / raw input text
 * @param {Object[]} results   - Array of analysis result objects from the API
 * @param {Object|null} interactions - Drug interaction data (or null)
 * @param {string}   language  - 'en' | 'ta'
 * @returns {Object} The saved entry
 */
export const saveToHistory = (input, results, interactions, language = 'en') => {
    const existing = getHistory();
    const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        input,
        results,       // full result array from AI
        interactions,  // drug interaction data
        language,
        date: new Date().toISOString(),
    };
    // Prepend so newest is first; cap at 100 items
    const updated = [entry, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
};

/**
 * Delete a single item by id.
 * @param {string} id
 * @returns {Object[]} Updated history
 */
export const deleteItem = (id) => {
    const updated = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

/** Wipe all history. */
export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};

/* ─── React hook ─────────────────────────────────────────────────────────── */

/**
 * React hook that provides reactive access to localStorage history.
 * State is kept in sync after every mutation.
 */
const useLocalHistory = () => {
    const [history, setHistory] = useState(() => getHistory());

    const save = useCallback((input, results, interactions, language) => {
        saveToHistory(input, results, interactions, language);
        setHistory(getHistory());
    }, []);

    const remove = useCallback((id) => {
        setHistory(deleteItem(id));
    }, []);

    const clear = useCallback(() => {
        setHistory(clearHistory());
    }, []);

    const refresh = useCallback(() => {
        setHistory(getHistory());
    }, []);

    return { history, save, remove, clear, refresh };
};

export default useLocalHistory;
