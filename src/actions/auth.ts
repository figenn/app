'use server';

import { ForgotPasswordFormData, LoginFormData, RegisterFormData, ResetPasswordFormData } from '@/schemas/auth';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function handleFetchResponse(response: Response) {
    try {
        const data = await response.json();
        
        if (!response.ok) {       
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        throw error;
    }
}

export async function login(data: LoginFormData) {
    try {
        const cookieStore = cookies();
        
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: formData,
        });

        const result = await handleFetchResponse(response);

        (await cookieStore).set('token', result.token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function registerUser(data: RegisterFormData) {
    try {
        const formData = new FormData();
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('country', data.country);
        
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            body: formData,
        });

        await handleFetchResponse(response);

        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function forgotPassword(data: ForgotPasswordFormData) {
    try {
        const formData = new FormData();
        formData.append('email', data.email);

        const response = await fetch(`${BACKEND_URL}/auth/request-reset-password`, {
            method: 'POST',
            body: formData,
        });

        await handleFetchResponse(response);

        return { success: true };
    } catch (error) {
        console.error('Forgot password request failed:', error);
        return { success: false, message: (error as Error).message };
    }
}

export async function getSessionData() {
    try {
        const cookieStore = cookies();
        return (await cookieStore).get('token')?.value || null;
    } catch (error) {
        console.error('Error retrieving session data:', error);
        return null;
    }
}

export async function logout() {
    try {
        const cookieStore = cookies();
        (await cookieStore).delete('token');
        return { success: true };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}

export async function auth() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;

        if (!token) {
            return null;
        }

        const response = await fetch(`${BACKEND_URL}/user/me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Une erreur est survenue.');
        }

        return data.user;
    } catch (error) {
        console.error('Authentication failed:', error);
        return null;
    }
}

export async function BearerToken() {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('token')?.value;

        if (!token) {
            return null;
        }

        return token;
    } catch (error) {
        console.error('BearerToken failed:', error);
        return null;
    }
}

export async function resetPassword(data: ResetPasswordFormData, token: string) {
    try {
        const requestBody = {
            ...data,
            token,
        };

        const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
        });

        await handleFetchResponse(response);

        return { success: true };
    } catch (error) {
        console.error('Reset password failed:', error);
        return { success: false, message: (error as Error).message };
    }
}