import axios from 'axios';

// Long timeout for AI analysis (up to 2 min)
const api = axios.create({
    baseURL: '/api',
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
});

// Short timeout for DB-backed reads (fail fast if MongoDB is offline)
const dbApi = axios.create({
    baseURL: '/api',
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
});

const handleError = (error) => {
    const message = error?.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
};

api.interceptors.response.use((r) => r.data, handleError);
dbApi.interceptors.response.use((r) => r.data, handleError);

// Medicine API
export const medicineAPI = {
    uploadFile: (formData, onProgress) =>
        api.post('/medicine/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: onProgress,
        }),

    extractFromText: (text) =>
        api.post('/medicine/extract', { text }),

    analyze: (medicines, language = 'en') =>
        api.post('/medicine/analyze', { medicines, language }),

    save: (data) => dbApi.post('/medicine/save', data),

    getHistory: (params = {}) =>
        dbApi.get('/medicine/history', { params }),
};

// Schedule API
export const scheduleAPI = {
    create: (data) => dbApi.post('/schedule/create', data),
    getAll: () => dbApi.get('/schedule/all'),
    getById: (id) => dbApi.get(`/schedule/${id}`),
    update: (id, data) => dbApi.put(`/schedule/${id}`, data),
    delete: (id) => dbApi.delete(`/schedule/${id}`),
};

export default api;
