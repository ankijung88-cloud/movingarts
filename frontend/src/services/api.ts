import axios from 'axios';

const API_URL = 'http://3.36.149.255:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: (data: any) => api.post('/users/login', data),
    register: (data: any) => api.post('/users/register', data),
    getProfile: () => api.get('/users/profile'),
    findEmail: (data: any) => api.post('/users/find-email', data),
    resetPasswordRequest: (data: any) => api.post('/users/reset-password-request', data),
};

export const paymentApi = {
    verify: (data: any) => api.post('/payments/verify', data),
};

export const adminApi = {
    getUsers: () => api.get('/admin/users'),
    getMemberships: () => api.get('/admin/memberships'),
    getContents: () => api.get('/admin/contents'),
    createContent: (data: any) => api.post('/admin/contents', data),
    updateContent: (id: number, data: any) => api.put(`/admin/contents/${id}`, data),
    deleteContent: (id: number) => api.delete(`/admin/contents/${id}`),
};

export default api;
