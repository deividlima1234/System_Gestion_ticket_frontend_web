

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'admin' | 'support' | 'user';
}

export interface UpdateUserDTO {
    name: string;
    email: string;
    role: 'admin' | 'support' | 'user';
    password?: string; // Optional for update
    password_confirmation?: string; // Optional for update
}
