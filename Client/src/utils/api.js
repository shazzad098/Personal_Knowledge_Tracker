import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to retrieve token from multiple possible keys/stores
const getToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('authToken');

// Attach JWT to every request if available
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Persist token automatically after successful auth responses
api.interceptors.response.use(
    (response) => {
        try {
            const url = response?.config?.url || '';
            const hasToken = response?.data?.token;
            const isAuthEndpoint = /\/auth\/login|\/auth\/register/i.test(url);
            if (isAuthEndpoint && hasToken) {
                localStorage.setItem('token', response.data.token);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
        } catch {
            // no-op
        }
        return response;
    },
    (error) => {
        // Optionally, handle 401s (e.g., clear token, redirect)
        return Promise.reject(error);
    }
);

export default api;