import api from './api';
import type { User } from '../types/auth';
import type { CreateUserDTO, UpdateUserDTO } from '../types/user';

export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data.data || response.data;
    },

    createUser: async (data: CreateUserDTO): Promise<User> => {
        const response = await api.post('/users', data);
        return response.data.data || response.data;
    },

    updateUser: async (id: number, data: UpdateUserDTO): Promise<User> => {
        const response = await api.put(`/users/${id}`, data);
        return response.data.data || response.data;
    },

    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};
