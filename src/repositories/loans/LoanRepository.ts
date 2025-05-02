import { ILoanRepository } from "./ILoanRepository";
import { Loan } from "../../types/Loan";

const API_URL = import.meta.env.VITE_API_LOAN;

export class LoanRepository implements ILoanRepository {

    // Obtener todos los préstamos
    async getAll(): Promise<Loan[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error fetching loans');
            const json = await response.json();

            // Mapear la respuesta para incluir el campo category del laboratorio
            return json.getAllLoans.map((loan: any) => ({
                ...loan,
                laboratory_category: loan.laboratory_category || ''
            })) || [];
        } catch (error) {
            console.error('Error fetching loans:', error);
            return [];
        }
    }

    // Obtener un préstamo por ID
    async getById(id: number): Promise<Loan | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Loan not found');
            const json = await response.json();

            // Asegurarse de que la respuesta tenga la categoría del laboratorio
            return json.loan ? {
                ...json.loan,
                laboratory_category: json.loan.laboratory_category || ''
            } : null;
        } catch (error) {
            console.error('Loan not found:', error);
            return null;
        }
    }

    // Crear un préstamo
    async create(data: Omit<Loan, "id_loan">): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Error creating loan');
        } catch (error) {
            console.error('Error creating loan:', error);
            throw error;
        }
    }

    // Actualizar un préstamo
    async update(id: number, data: Omit<Loan, "id_loan">): Promise<void> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Error updating loan');
        } catch (error) {
            console.error('Error updating loan:', error);
            throw error;
        }
    }

    // Obtener todos los laboratorios
    async getLaboratories(): Promise<any[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/laboratories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error fetching laboratories');
            const json = await response.json();
            return json.getAllLaboratories || [];
        } catch (error) {
            console.error('Error fetching laboratories:', error);
            return [];
        }
    }
}
