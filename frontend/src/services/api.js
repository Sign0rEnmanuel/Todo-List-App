import axios from 'axios';
const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = async (username, password) => {
    try {
        const response = await api.post('/auth/register', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error registering:', error);
        return Promise.reject(error);
    }
};

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        return Promise.reject(error);
    }
};

export const updateUser = async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/auth/update', { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        return Promise.reject(error);
    }
};

export const deleteUser = async (password) => {
    try {
        const response = await api.delete('/auth/delete', { password });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        return Promise.reject(error);
    }
};

export const getTasks = async () => {
    try {
        const response = await api.get('/tasks/get');
        return response.data;
    } catch (error) {
        console.error('Error getting tasks:', error);
        return Promise.reject(error);
    }
};

export const createTask = async (name, description) => {
    try {
        const response = await api.post('/tasks/create', { name, description });
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        return Promise.reject(error);
    }
};

export const updateTask = async (id, name, description) => {
    try {
        const response = await api.put(`/tasks/update/${id}`, { name, description });
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        return Promise.reject(error);
    }
};

export const completeTask = async (id) => {
    try {
        const response = await api.patch(`/tasks/complete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error completing task:', error);
        return Promise.reject(error);
    }
};

export const deleteTask = async (id) => {
    try {
        const response = await api.delete(`/tasks/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
        return Promise.reject(error);
    }
};

export default api;