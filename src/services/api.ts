import axios from 'axios';

const API_URL = 'https://system-gestion-ticket-backend.onrender.com/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login if token is invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: Trigger a redirect or state change here
            // window.location.href = '/login'; // Simple force redirect
        }
        return Promise.reject(error);
    }
);

export default api;
