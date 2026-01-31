import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL
});

// Add interceptor to include token from localStorage if exists
// Add interceptor to include token from localStorage if exists
api.interceptors.request.use((config) => {
    // Check for admin token ('token') first, then user token fallback
    // This ensures Admin Panel works even if a user session exists logic
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// Response interceptor to handle invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('userToken');
            // Optional: Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getNews = (params: any = {}) => api.get('/news', { params });
export const getNewsBySlug = (slug: string) => api.get(`/news/${slug}`);
export const getNewsById = (id: string) => api.get(`/news/id/${id}`);
export const loginAdmin = (credentials: any) => api.post('/admin/login', credentials);
export const createNews = (data: any) => api.post('/admin/news', data);
export const updateNews = (id: string, data: any) => api.put(`/admin/news/${id}`, data);
export const deleteNews = (id: string) => api.delete(`/admin/news/${id}`);

// Video Management
export const getVideos = () => api.get('/videos');
export const getVideoById = (id: string) => api.get(`/videos/${id}`);
export const createVideo = (data: any) => api.post('/admin/videos', data);
export const deleteVideo = (id: string) => api.delete(`/admin/videos/${id}`);

// Settings Management
export const getSettings = () => api.get('/settings');
export const updateSettings = (data: any) => api.post('/admin/settings', data);

// Admin Management
export const getAdmins = () => api.get('/admin/list');
export const registerAdmin = (data: any) => api.post('/admin/register', data);
export const deleteAdmin = (id: string) => api.delete(`/admin/delete/${id}`);

// Category Management
export const getCategories = () => api.get('/categories');
export const createCategory = (data: any) => api.post('/admin/categories', data);
export const deleteCategory = (id: string) => api.delete(`/admin/categories/${id}`);

// Page Management
export const getPages = () => api.get('/pages');
export const getPageBySlug = (slug: string) => api.get(`/pages/${slug}`);
export const createPage = (data: any) => api.post('/pages', data);
export const updatePage = (id: string, data: any) => api.put(`/pages/${id}`, data);
export const deletePage = (id: string) => api.delete(`/pages/${id}`);

export const translateText = (data: { title: string, content: string, targetLang: string }) => api.post('/admin/translate', data);

export default api;
