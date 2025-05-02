import { IEquipmentRepository } from "./IEquipmentRepository";
import { Equipment } from "../../types/Equipment";

const API_URL = import.meta.env.VITE_API_EQUIPMENT;

export class EquipmentRepository implements IEquipmentRepository {
    async getAll(): Promise<Equipment[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error fetching equipment');
            const json = await response.json();
            return json.allRealStates || [];
        } catch (error) {
            console.error('Error fetching equipment:', error);
            return [];
        }
    }

    async getById(id: number): Promise<Equipment | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Equipment not found');
            const json = await response.json();
            return json.realState || null;
        } catch (error) {
            console.error('Equipment not found:', error);
            return null;
        }
    }

    async create(equipment: Omit<Equipment, "id_state">): Promise<Equipment> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(equipment)
            });

            if (!response.ok) throw new Error('Error creating equipment');
            const json = await response.json();
            return json.newRealState;
        } catch (error) {
            console.error('Error creating equipment:', error);
            throw error;
        }
    }

    async update(id: number, data: Omit<Equipment, "id_state">): Promise<Equipment> {
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

            if (!response.ok) throw new Error('Error updating equipment');
            const json = await response.json();
            return json.updatedRealState;
        } catch (error) {
            console.error('Error updating equipment:', error);
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error deleting equipment');
            return true;
        } catch (error) {
            console.error('Error deleting equipment:', error);
            return false;
        }
    }
}
