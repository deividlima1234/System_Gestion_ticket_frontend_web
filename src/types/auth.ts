export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'support' | 'user';
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user?: User; // Depending on if the API returns the user object on login, otherwise we might need to fetch it.
    // The user request showed the login response only has access_token and token_type.
    // I will assume we might need to fetch user details separately or decode the token if it's JWT, 
    // but for now let's stick to what the user showed: access_token.
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
