import { IAreaRepository } from "./IAreaRepository";
import { Area } from "../../types/Area";

const API_URL = import.meta.env.VITE_API_AREA;

export class AreaRepository implements IAreaRepository {
    async getAllAreas(): Promise<Area[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error fetching areas');
            const json = await response.json();
            return json.getAllAreas || [];
        } catch (error) {
            console.log('Error fetching areas:', error);
            return [];
        }
    }

    async getAreaById(id: number): Promise<Area | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Area not found');
            return await response.json();
        } catch (error) {
            console.log('Area not found:', error);
            return null;
        }
    }

    async createArea(area: Omit<Area, "id_area">): Promise<Area> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(area),
            });
            if (!response.ok) throw new Error('Error creating area');
            return await response.json();
        } catch (error) {
            console.log('Error creating area:', error);
            throw error;
        }
    }

    async updateArea(id: number, area: Partial<Area>): Promise<Area | null> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                 },
                body: JSON.stringify(area),
            });
            if (!response.ok) throw new Error('Error updating area');
            return await response.json();
        } catch (error) {
            console.log('Error updating area:', error);
            return null;
        }
    }

    async deleteArea(id: number): Promise<boolean> {
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
            console.log('Error deleting area:', error);
            return false;
        }
    }
}