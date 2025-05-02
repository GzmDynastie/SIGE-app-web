
export enum  Role {
    R0= "Seleccione Role",
    R1 = "Tecnico",
    R2 = "Administrador",
    R3 = "Super Usuario",
}

export const getRoleName = (role: number): string => {
    const roleMap: Record<number, Role> = {
        1: Role.R1,
        2: Role.R2,
        3: Role.R3,
    };
    return roleMap[role] || "Desconocido";
};

export interface User {
    id_user: number,
    tuition: string,
    name: string,
    last_name: string,
    email: string,
    status: boolean,
    role: number,
    password: string,
}