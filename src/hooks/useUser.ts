import { useState } from "react";
import { User } from "../types/User";
import { UserRepository } from "../repositories/users/UserRepository";
import { useNavigate } from "react-router-dom";

const userRepository = new UserRepository();

export function useUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("token") || null);

    const navigate = useNavigate();

    async function getAllUsers() {
        setLoading(true);
        setError(null);
        try {
            const data = await userRepository.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Error getting users');
        } finally {
            setLoading(false);
        }
    }

    async function getUserById(id: number) {
        setLoading(true);
        setError(null);
        try {
            const user = await userRepository.getUserById(id);
            setSelectedUser(user);
        } catch (err) {
            setError('Error getting user')
        } finally {
            setLoading(false);
        }
    }

    async function createUser(user: Omit<User, "id">) {
        setLoading(true);
        setError(null);
        try {
            const newUser = await userRepository.createUser(user);
            setUsers((prev) => [...prev, newUser])
        } catch (err) {
            setError('Error creating user');
        } finally {
            setLoading(false);
        }
    }

    async function updateUser(id: number, user: Partial<User>) {
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await userRepository.updateUser(id, user);
            if (updatedUser) {
                setUsers((prev) =>
                    prev.map((u) => (u.id_user === id ? updatedUser : u))
                );
            }
        } catch (err) {
            setError('Error updating user');
        } finally {
            setLoading(false);
        }
    }

    async function deleteUser(id: number) {
        setLoading(true);
        setError(null);
        try {
            const success = await userRepository.deleteUser(id);
            if (success) {
                setUsers((prev) => prev.filter((u) => u.id_user !== id));
            }
        } catch (err) {
            setError('Error deleting user');
        } finally {
            setLoading(false)
        }
    }

    async function loadingUser(email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const loginResponse = await userRepository.loginUser(email, password);
            if (!loginResponse) throw new Error('Credenciales inválidas');
    
            if (loginResponse.accessToken) {
                const { id_user, name, email, role } = loginResponse.user;
                localStorage.setItem("token", loginResponse.accessToken);
                localStorage.setItem("user", JSON.stringify({ id_user, name, email, role }));
    
                // fuerza la actualización en WebSocketProvider
                window.dispatchEvent(new StorageEvent("storage", {
                    key: "user",
                    newValue: JSON.stringify({ id_user, name, email, role })
                }));
    
                setAccessToken(loginResponse.accessToken);
                console.log("Datos desde el login con localstorage", localStorage.getItem("user"));
                navigate("/auth/dashboard");
            } else {
                setError("Error al iniciar sesión");
            }
        } catch (err: any) {
            console.error('Error durante el inicio de sesión:', err);
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    }
    

    async function refreshToken() {
        setLoading(true);
        setError(null);
        try {
            const refreshResponse = await userRepository.refreshToken();
            if (!refreshResponse) throw new Error('No se pudo refrescar el token');
            setAccessToken(refreshResponse.accessToken);
        } catch (err) {
            setError('Error al refrescar el token');
        } finally {
            setLoading(false);
        }
    }

    async function refreshAccessToken() {
        try {
            const response = await userRepository.refreshToken();
            if (response && response.accessToken) {
                setAccessToken(response.accessToken);
                localStorage.setItem("token", response.accessToken);
                return response.accessToken;
            }
        } catch (error) {
            console.log("Error refreshing access token:", error);
        }
        return null;
    }

    return {
        users,
        loading,
        error,
        selectedUser,
        accessToken,
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        loadingUser,
        refreshToken,
        refreshAccessToken,
    };
}