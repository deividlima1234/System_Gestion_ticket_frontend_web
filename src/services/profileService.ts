import api from './api';
import type { User } from '../types/auth';
import type { UpdateProfileDTO } from '../types/profile';

export const profileService = {
    getProfile: async (): Promise<User> => {
        const response = await api.get('/profile');
        return response.data.data || response.data;
    },

    updateProfile: async (data: UpdateProfileDTO): Promise<User> => {
        const response = await api.put('/profile', data);
        return response.data.data || response.data;
    },
};
