import { IAreaRepository } from "./IAreaRepository";
import { Area } from "../../types/Area";
import { Equipment } from "../../types/Equipment";

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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Area not found');
            const json = await response.json();
            return json.area || [];
        } catch (error) {
            console.log('Area not found:', error);
            return null;
        }
    }

    async getEquipmentAreaById(id: number): Promise<Equipment[]> {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/equipment/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Equipment not found');
            const json = await response.json();
            return json.equipment || [];
        } catch (error) {
            console.log('Equipment not found:', error);
            // return null;
            return [];
        }
    }

    async createArea(area: Omit<Area, "id_area" | "status">): Promise<Area> {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('type_space', area.type_space);
            formData.append('sede', area.sede);
            formData.append('building', area.building);
            formData.append('floor', area.floor);
            formData.append('division', area.division);
            formData.append('coordination', area.coordination);
            formData.append('classroom_lab', String(area.classroom_lab));
            formData.append('classroom', area.classroom);
            formData.append('equipment', area.equipment.join(","));

            area.image.forEach((file, index) => {
                if (file instanceof File) {
                    console.log(index)
                    formData.append(`image`, file);
                }
            });

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Error creating area');
            return await response.json();
        } catch (error) {
            console.log('Error creating area:', error);
            throw error;
        }
    }

    async updateArea(id: number, area: Omit<Area, "id_area" | "status">): Promise<Area | null> {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('type_space', area.type_space);
            formData.append('sede', area.sede);
            formData.append('building', area.building);
            formData.append('floor', area.floor);
            formData.append('division', area.division);
            formData.append('coordination', area.coordination);
            formData.append('classroom_lab', String(area.classroom_lab));
            formData.append('equipment', area.equipment.join(","));
            formData.append('classroom', area.classroom);

            area.image.forEach((file, index) => {
                if (file instanceof File) {
                    console.log(index)
                    formData.append(`image`, file);
                }
            });

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
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