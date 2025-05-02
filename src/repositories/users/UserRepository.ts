import { IUserRepository } from "./IUserRepository";
import { User } from "../../types/User";

const API_URL = import.meta.env.VITE_API_USER
const API_URL_LOGIN = import.meta.env.VITE_API_USER_LOGIN
const API_URL_LOGOUT = import.meta.env.VITE_API_USER_LOGOUT
const API_URL_REFRESH = import.meta.env.VITE_API_USER_REFRESH

export class UserRepository implements IUserRepository {
    async getAllUsers(): Promise<User[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) throw new Error('Error fetching Users');
            const json = await response.json();
            return json.getAllUsers || [];
        } catch (error) {
            console.log('Error fetching Users:', error);
            return [];
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) throw new Error('Error not found');
            return await response.json();
        } catch (error) {
            console.log('Error not found:', error);
            return null;
        }
    }

    async createUser(user: Omit<User, "id">): Promise<User> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Error creating user');
            return await response.json();
        } catch (error) {
            console.log('Error creating user:', error);
            throw error;
        }
    }

    async updateUser(id: number, user: Partial<User>): Promise<User | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Error updating user');
            return await response.json();
        } catch (error) {
            console.log('Error updating user:', error);
            return null;
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            return response.ok;
        } catch (error) {
            console.log('Error deleting user:', error);
            return false;
        }
    }

    async loginUser(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string; } | null> {
        try {
            const response = await fetch(API_URL_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Error login user');
            return await response.json();
        } catch (error) {
            console.log('Error login user:', error);
            return null;
        }
    }

    async refreshToken(): Promise<{ accessToken: string; refreshToken: string; } | null> {
        try {
            const response = await fetch(API_URL_REFRESH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Error refreshing token');
            return response.json();
        } catch (error) {
            console.log('Error refreshing token:', error);
            return null;
        }
    }

    async logoutUser(userId: number): Promise<{ message: string } | null> {
        try {
            const accessToken = localStorage.getItem('token');
    
            if (!accessToken) {
                throw new Error('No se encontró el token de acceso.');
            }
    
            const response = await fetch(`${API_URL_LOGOUT}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                credentials: 'include',
            });
    
            if (!response.ok) throw new Error('Error al cerrar sesión');
    
            return await response.json();
        } catch (error) {
            console.log('Error logout user:', error);
            return null;
        }
    }
    
}