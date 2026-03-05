import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    timeout: 120000, // 2 minutes for AI analysis
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error?.response?.data?.message || error.message || 'Network error';
        return Promise.reject(new Error(message));
    }
);

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

    save: (data) => api.post('/medicine/save', data),

    getHistory: (params = {}) =>
        api.get('/medicine/history', { params }),
};

// Schedule API
export const scheduleAPI = {
    create: (data) => api.post('/schedule/create', data),
    getAll: () => api.get('/schedule/all'),
    getById: (id) => api.get(`/schedule/${id}`),
    update: (id, data) => api.put(`/schedule/${id}`, data),
    delete: (id) => api.delete(`/schedule/${id}`),
};

export default api;
