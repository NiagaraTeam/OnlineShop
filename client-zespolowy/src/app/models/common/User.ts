export interface User {
    id: string;
    userName: string;
    email: string;
    token: string;
    isAdmin: boolean;
}

export interface UserFormValues {
    userName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}