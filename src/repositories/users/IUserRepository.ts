import { User } from "../../types/User";

export interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    createUser(user: Omit<User, "id">): Promise<User>;
    updateUser(id: number, user: Partial<User>): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;

    loginUser(email: string, password: string): Promise<{ user: User, accessToken: string, refreshToken: string } | null>;
    refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null>;
}