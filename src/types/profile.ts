export interface UpdateProfileDTO {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
}
